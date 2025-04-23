import { transition } from './Utils/transitionScreen.js';

const cursor = document.getElementById('cursor');
const startButton = document.getElementById('startButton');
const sfxPlayer = document.getElementById('sfxPlayer');

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
// let leftTriggerDown = false;

AFRAME.registerComponent('disabled', {
    schema: { type: 'boolean', default: false }
});


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
        console.log("clicked");
        if (object.getAttribute('disabled') || (e.detail && e.detail.cursorEl == rightHand && !cursor.getAttribute('raycaster').enabled)) {
            playSound(blockSound);
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
    setTimeout(() => transition(),
        3000);
});