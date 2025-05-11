import 'aframe-locomotion';
import 'aframe-extras/controls';
import 'aframe-extras/loaders';
import 'aframe-gltf-model-plus';
import 'aframe-haptics';
import 'aframe-extras/primitives';

import { transition } from './Utils/transitionScreen.js';
import { setSong, fade, playSound } from './Utils/sound.js';
import { objectiveVR } from './Utils/objectives.js';
import { haptics } from './Utils/haptics.js';

const cursor = document.getElementById('cursor');
const camera = document.getElementById('camera');
const startButton = document.getElementById('start-button');
const startText = document.getElementById('start-text');
const startScreen = document.getElementById('start-screen');

// Gameplay Elements
const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
const vrObjective = document.getElementById('vrObjective');
const interactables = document.querySelectorAll('.interactable');
const tree = document.getElementById("tree");

// VR Controllers
const leftHand = document.getElementById('left-hand');
const rightHand = document.getElementById('right-hand');

// Sounds
const hoverSound = '#hover-sfx';
const clickSound = '#click-sfx';
const blockSound = '#block-sfx';

//Runtime Stuff
let clickDebounce = false;

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
            playSound(blockSound, "sfxPlayer");
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

            playSound(clickSound, "sfxPlayer");
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
        to: 5,
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
            playSound(hoverSound, "sfxPlayer");
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
    startScreen.style.backgroundColor = "transparent";
});

startButton.addEventListener('click', () => {
    document.getElementById('start-sfx').volume = '0.2';
    document.getElementById('start-sfx').play();
})

startButton.addEventListener('mouseenter', () => {
    document.getElementById('hover-sfx').play();
})