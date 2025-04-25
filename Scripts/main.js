import { transition } from './Utils/transitionScreen.js';
import { setSong, fade } from './Utils/music.js';

const cursor = document.getElementById('cursor');
const camera = document.getElementById('camera');
const startButton = document.getElementById('startButton');

// Sound Players
const sfxPlayer = document.getElementById('sfxPlayer');
const footstepsPlayer = document.getElementById('footstepsPlayer');

// Gameplay Elements
const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
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

const haptics = (controller, type) => {
    if (controller && controller.components && controller.components.haptics) {
        if (type == "block") {
            controller.components.haptics.pulse(1, 100);
            setTimeout(() => {
                if (controller.components.haptics) {
                    controller.components.haptics.pulse(1, 100);
                }
            }, 200);
        }
    }
};

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
                console.log(leftHand.components);
            } else {
                canWalk = false;
                camera.setAttribute('wasd-controls', 'enabled', false);
                leftHand.removeAttribute('smooth-locomotion');
                console.log(leftHand.components);
            }
        }
    }
});

camera.setAttribute('walk', false);

const playSound = (soundID) => {
    sfxPlayer.setAttribute('sound', 'autoplay', false);
    sfxPlayer.components.sound.stopSound();
    sfxPlayer.setAttribute('sound', `src: ${soundID}`);
    sfxPlayer.components.sound.playSound();
};

scene.addEventListener('enter-vr', () => {
    text.setAttribute('position', "0.06211 -0.4 -2");
    cursor.setAttribute('visible', 'false');
    cursor.setAttribute('raycaster', 'enabled: false');
});

scene.addEventListener('exit-vr', () => {
    text.setAttribute('position', '0.06211 -1 -1.20656');
    cursor.setAttribute('visible', 'true');
    cursor.setAttribute('raycaster', 'enabled: true');
});

interactables.forEach(object => {
    object.addEventListener('click', async (e) => {
        if (object.getAttribute('disabled') || (e.detail && e.detail.cursorEl == rightHand && !cursor.getAttribute('raycaster').enabled)) {
            playSound(blockSound);
            haptics(leftHand, "block");
            haptics(rightHand, "block");
            return;
        } else {
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

// leftHand.addEventListener('triggerdown', function () {
//     if (leftTriggerDown) return;
//     leftTriggerDown = true;

//     const clickedObj = leftHand.components.raycaster.intersectedEls[0];
//     if (clickedObj && clickedObj.classList) {
//         if (clickedObj.getAttribute('clickonce')) {
//             clickedObj.classList.toggle('interactable');
//         }
//         clickedObj.emit("click");
//     }
// });

startButton.addEventListener('click', function () {
    startButton.removeEventListener("click", startButton);
    document.title = "EnvVR - Scene Selection";
    setSong('#space-song');
    setTimeout(() => transition(),
        3000);
    setTimeout(() => fade('in'),
        3000);
});

const keysPressed = new Set();
const movementKeys = new Set(['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

document.addEventListener('keydown', (event) => {
    if (!canWalk) {
        return;
    }
    if (movementKeys.has(event.key)) {
        keysPressed.add(event.key);
        if (keysPressed.size > 0) {
            if (isWalking) {
                return;
            } else {
                footstepsPlayer.components.sound.playSound();
                isWalking = true;
                camera.emit('walkAnim');
            }
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (!canWalk) {
        return;
    }
    if (movementKeys.has(event.key)) {
        keysPressed.delete(event.key);
        if (keysPressed.size === 0) {
            footstepsPlayer.components.sound.stopSound();
            isWalking = false;
            camera.emit('stopAnim');
        }
    }
});

AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (evt) {
        if (!canWalk) {
            return;
        }
        const x = evt.detail.x;
        const y = evt.detail.y;
        const deadzone = 0.1; // Threshold to consider the thumbstick at rest

        if (Math.abs(x) > deadzone || Math.abs(y) > deadzone) {
            if (isWalking) {
                return;
            } else {
                footstepsPlayer.components.sound.playSound();
                isWalking = true;
            }
        } else {
            footstepsPlayer.components.sound.stopSound();
            isWalking = false;
        }
    }
});
