import 'aframe-locomotion';
import 'aframe-extras/controls';
import 'aframe-extras/loaders';
import 'aframe-gltf-model-plus';
import 'aframe-haptics';
import 'aframe-extras/primitives';
import 'aframe-look-at-component';
import 'aframe-randomizer-component';
import 'aframe-particle-system-component';

import { transition } from './Utils/transitionScreen.js';
import { setAmbience, playSound, stopAmbience } from './Utils/sound.js';
import { objectiveVR } from './Utils/objectives.js';
import { haptics } from './Utils/haptics.js';
import { setTooltip, tooltipVisibility } from './Utils/tooltip.js';
// import { say } from './Utils/say.js';
import { setSubtitle } from './Utils/subtitles.js';
import { say } from './Utils/voicelines.js';

const cursor = document.getElementById('cursor');
const camera = document.getElementById('camera');
const startButton = document.getElementById('start-button');
const startText = document.getElementById('start-text');
const assetText = document.getElementById('asset-text');
const startScreen = document.getElementById('start-screen');
const assetEls = [];

// Gameplay Elements
const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
const objective = document.getElementById('objective');
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
let hoveringOver = null;
let cursorAnimating = false;

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
    objective.setAttribute('visible', false);
    vrObjective.setAttribute('visible', true);
});

scene.addEventListener('exit-vr', () => {
    text.setAttribute('position', '0.06211 -1 -1.20656');
    cursor.setAttribute('visible', 'true');
    cursor.setAttribute('raycaster', 'enabled: true');
    objective.setAttribute('visible', true);
    vrObjective.setAttribute('visible', false);
});

interactables.forEach(object => {
    object.addEventListener('click', async (e) => {
        leftHand.setAttribute('raycaster', 'lineColor', '#e5f5a9');
        tooltipVisibility(false);
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
            if (object.classList.contains('informative')) {
                const infoLogic = await import('./Utils/info.js');
                infoLogic.handle(object);
            }

            if (object.classList.contains("pickable")) {
                object.setAttribute('disabled', true);
                object.setAttribute('visible', false);;
            }

            if (object.getAttribute("init")) {
                const initLogic = await import(`./Objectives/${object.getAttribute("init")}.js`);
                initLogic.init();
            }

            try {
                const targetLogic = await import(`./Objects/${logicId}.js`);
                if (targetLogic?.handle) {
                    targetLogic.handle(object, false);
                    object.setAttribute("marker", "false");
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
        to: 2,
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
            haptics(rightHand, "hover");
            e.detail.cursorEl.setAttribute('raycaster', 'lineColor', '#FF0000');
            return;
        } else {
            haptics(leftHand, "hover");
            object.emit('enter');
            playSound(hoverSound, "sfxPlayer");
            hoveringOver = object;
            if (object.classList.contains("animal")) {
                setTooltip(scene.is('vr-mode') ? "Press 'Y' to Taunt / Left Trigger to Get Info" : "Press 'E' to Taunt / Click to Get Information", false);
            } else if (object.classList.contains("pickable")) {
                setTooltip(scene.is('vr-mode') ? "Press Left Trigger to Pick Up" : "Click to Pick Up", false);
            } else if (object.classList.contains("informative") && !object.classList.contains("animal")) {
                setTooltip(scene.is('vr-mode') ? "Press Left Trigger to Get Info" : "Click to Get Information", false);
            } else {
                setTooltip(scene.is('vr-mode') ? "Press Left Trigger to Interact" : "Click to Interact", false);
            }
        };
    });

    object.addEventListener('mouseleave', (e) => {
        if (clickDebounce) return;
        if (object.getAttribute('disabled') || e.detail.cursorEl == rightHand) {
            e.detail.cursorEl.setAttribute('raycaster', 'lineColor', '#e5f5a9');
            leftHand.setAttribute('raycaster', 'lineColor', '#e5f5a9');
        } else {
            object.emit('leave');
            hoveringOver = null;
            tooltipVisibility(false);
        };
    });
});

cursor.addEventListener('animationcomplete__click', function () {
    cursorAnimating = false;
    cursor.emit("reset");
});

cursor.addEventListener('animationcomplete__leave', function () {
    cursorAnimating = false;
    cursor.emit("reset");
});

cursor.addEventListener('animationcomplete__block', function () {
    cursorAnimating = false;
    cursor.emit("whiten");
});

cursor.addEventListener('click', function () {
    cursorAnimating = true;
})

cursor.addEventListener('mouseleave', function () {
    if (cursorAnimating) {
        cursor.addEventListener('animationcomplete__click', () => {
            cursor.emit("leave")
        })
    } else {
        cursor.emit("leave");
    };
});

function onStartClick() {
    startButton.removeEventListener("click", onStartClick);
    document.title = "EnvVR - Space";
    setAmbience('#space-ambience');
    transition(true, 2000);
}

scene.addEventListener('loaded', () => {
    startText.innerHTML = "Click Anywhere to Start!";
    assetText.remove();
    startButton.addEventListener('click', onStartClick);
    startScreen.style.backgroundColor = "transparent";
});

window.addEventListener('DOMContentLoaded', () => {
    assetEls.push(...assets.children);
    const totalAssets = assetEls.length;
    let loadedCount = 0;

    assetEls.forEach((el) => {
        if (el.hasLoaded) {
            loadedCount++;
        } else {
            ['loadeddata', 'load'].forEach(eventType => {
                el.addEventListener(eventType, () => {
                    loadedCount++;
                    updateText(el.getAttribute('src') || el.id);
                });
            });
        }
    });
    if (loadedCount === totalAssets) {
        updateText('All assets preloaded');
    }

    function updateText(currentAsset) {
        startText.textContent = `Assets Loaded ${loadedCount} of ${totalAssets}`;
        assetText.textContent = currentAsset;
    }
});

startButton.addEventListener('click', () => {
    document.getElementById('start-sfx').volume = '0.2';
    document.getElementById('start-sfx').play();
})

startButton.addEventListener('mouseenter', () => {
    document.getElementById('hover-sfx').play();
})

window.addEventListener('keydown', async (e) => {
    if (hoveringOver && e.key === 'e' && hoveringOver.classList.contains("animal")) {
        const logicId = hoveringOver.getAttribute('data-logic');
        const targetLogic = await import(`./Objects/${logicId}.js`);
        targetLogic.handle(hoveringOver, true);
    }
});

leftHand.addEventListener('ybuttondown', async () => {
    if (hoveringOver && hoveringOver.classList.contains("animal")) {
        const logicId = hoveringOver.getAttribute('data-logic');
        const targetLogic = await import(`./Objects/${logicId}.js`);
        targetLogic.handle(hoveringOver, true);
    }
});