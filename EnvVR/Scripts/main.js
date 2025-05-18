import { transition } from './Utils/transitionScreen.js';
import { setSong, fade, playSound} from './Utils/sound.js';
import { objectiveVR } from './Utils/objectives.js';
import { haptics } from './Utils/haptics.js';

const cursor = document.getElementById('cursor');
const camera = document.getElementById('camera');
const startButton = document.getElementById('startButton');
const startText = document.getElementById('startText');

// Sound Players
const footstepsPlayer = document.getElementById('footstepsPlayer');

// Gameplay Elements
const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
const vrObjective = document.getElementById('vrObjective');
const interactables = document.querySelectorAll('.interactable');

// VR Controllers
const leftHand = document.getElementById('left-hand');
const rightHand = document.getElementById('right-hand');

// Sounds
const hoverSound = '#hover-sfx';
const clickSound = '#click-sfx';
const blockSound = '#block-sfx';

//Runtime Stuff
let clickDebounce = false;
let isWalking = false;
let canWalk = false;

AFRAME.registerComponent('disabled', {
    schema: { type: 'boolean', default: false }
});

AFRAME.registerComponent('walk', {
    schema: { type: 'boolean', default: true },

    update: function (oldData) {
        if (oldData !== this.data) {
            if (this.data) {
                canWalk = true;
                camera.setAttribute('wasd-controls', 'enabled', true);
                leftHand.setAttribute('smooth-locomotion', 'target: #rig; reference: #camera');
            } else {
                canWalk = false;
                camera.setAttribute('wasd-controls', 'enabled', false);
                leftHand.removeAttribute('smooth-locomotion');
            }
        }
    }
});

AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (evt) {
        if (!canWalk) return;

        const x = evt.detail.x;
        const y = evt.detail.y;
        const deadzone = 0.1;

        if (Math.abs(x) > deadzone || Math.abs(y) > deadzone) {
            if (!isWalking) {
                footstepsPlayer.components.sound.playSound();
                isWalking = true;
            }
        } else {
            footstepsPlayer.components.sound.stopSound();
            isWalking = false;
        }
    }
});

AFRAME.registerComponent('render-order', {
    schema: { type: 'int', default: 0 },

    init: function () {
        this.el.addEventListener('object3dset', () => {
            this.setRenderOrder();
        });
    },

    update: function () {
        this.setRenderOrder();
    },

    setRenderOrder: function () {
        const object3D = this.el.object3D;
        object3D.traverse((child) => {
            if (child.renderOrder !== undefined) {
                child.renderOrder = this.data;
                child.material && (child.material.depthTest = false);
            }
        });
    }
});

AFRAME.registerComponent('nav-offset-animator', {
    schema: { type: 'vec3', default: { x: 0, y: 1.6, z: 0 } },
    update() {
      const nav = this.el.components['nav-mesh-constrained'];
      if (nav) {
        nav.data.offset = this.data;
      }
    }
  });


  leftHand.addEventListener('xbuttondown', () => {
    objectiveVR(true);
  });

  leftHand.addEventListener('xbuttonup', () => {
    objectiveVR(false);
  });

camera.setAttribute('walk', false);

scene.addEventListener('enter-vr', () => {
    text.setAttribute('position', "0.06211 -0.4 -2");
    cursor.setAttribute('visible', 'false');
    cursor.setAttribute('raycaster', 'enabled: false');
    vrObjective.setAttribute('visible', true)
});

scene.addEventListener('exit-vr', () => {
    text.setAttribute('position', '0.06211 -1 -1.20656');
    cursor.setAttribute('visible', 'true');
    cursor.setAttribute('raycaster', 'enabled: true');
    vrObjective.setAttribute('visible', false)
});

interactables.forEach(object => {
    object.addEventListener('click', async (e) => {
        if (object.getAttribute('disabled') || (e.detail && e.detail.cursorEl == rightHand && !cursor.getAttribute('raycaster').enabled)) {
            cursor.emit("block");
            playSound(blockSound);
            haptics(leftHand, "block");
            haptics(rightHand, "block");
            return;
        } else {
            haptics(leftHand, "click");
            const logicId = object.getAttribute('data-logic');
            clickDebounce = true;

            try {
                const targetLogic = await import(`./Objects/${logicId}.js`);
                if (targetLogic?.handle) {
                    targetLogic.handle(object);
                } else {
                    console.warn(`No 'handle' function found in ${logicId}.js`);
                }
            } catch (err) {
                console.error(`Failed to load logic for object '${logicId}':`, err);
            }

            playSound(clickSound);
            if (object.getAttribute('clickonce')) {
                object.classList.toggle('interactable');
            }

            setTimeout(() => {
                clickDebounce = false;
            }, 300);
        }
    })

    object.setAttribute('animation__hover', {
        property: 'material.emissiveIntensity',
        to: 1,
        dur: 500,
        dir: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        startEvents: 'enter',
        pauseEvents: 'leave, click',
        resumeEvents: 'enter'
    });

    object.setAttribute('animation__leave', {
        property: 'material.emissiveIntensity',
        to: 0,
        dur: 200,
        easing: 'easeInOutSine',
        startEvents: 'leave, click'
    });

    object.setAttribute('material', 'emissiveIntensity', 0);

    object.addEventListener('mouseenter', (e) => {
        if (object.getAttribute('disabled') || e.detail.cursorEl == rightHand) {
            e.detail.cursorEl.setAttribute('raycaster', 'lineColor', '#FF0000');
            return;
        } else {
            haptics(leftHand, "hover");
            object.emit('enter');
            playSound(hoverSound);
        };
    });

    object.addEventListener('mouseleave', (e) => {
        if (clickDebounce) return;
        if (object.getAttribute('disabled') || e.detail.cursorEl == rightHand) {
            e.detail.cursorEl.setAttribute('raycaster', 'lineColor', '#e5f5a9');
        } else {
            object.emit('leave');
        };
    });
});

cursor.addEventListener('animationcomplete__click', function () {
    cursor.emit("reset");
});

cursor.addEventListener('animationcomplete__block', function () {
    cursor.emit("whiten");
});

// Updated start button logic
function onStartClick() {
    startButton.removeEventListener("click", onStartClick);
    document.title = "EnvVR - Scene Selection";
    setSong('#space-song');
    setTimeout(() => transition(), 3000);
    setTimeout(() => fade('in'), 3000);
}

scene.addEventListener('loaded', () => {
    startText.innerHTML = "Click Anywhere to Start!";
    startButton.addEventListener('click', onStartClick);
});

const keysPressed = new Set();
const movementKeys = new Set(['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

document.addEventListener('keydown', (event) => {
    if (!canWalk) return;
    if (movementKeys.has(event.key)) {
        keysPressed.add(event.key);
        if (keysPressed.size > 0 && !isWalking) {
            footstepsPlayer.components.sound.playSound();
            isWalking = true;
            camera.emit('walkAnim');
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (!canWalk) return;
    if (movementKeys.has(event.key)) {
        keysPressed.delete(event.key);
        if (keysPressed.size === 0) {
            footstepsPlayer.components.sound.stopSound();
            isWalking = false;
            camera.emit('stopAnim');
        }
    }
});