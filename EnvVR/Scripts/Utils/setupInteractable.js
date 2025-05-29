import { playSound } from './sound.js';
import { setTooltip, tooltipVisibility } from './tooltip.js';
import { haptics } from './haptics.js';

const cursor = document.getElementById('cursor');
const scene = document.querySelector('a-scene');
const leftHand = document.getElementById('left-hand');
const rightHand = document.getElementById('right-hand');

// Sounds
const hoverSound = '#hover-sfx';
const clickSound = '#click-sfx';
const blockSound = '#block-sfx';

let clickDebounce = false;
let hoveringOver = null;

export function setupInteractable(object) {
    object.addEventListener('click', async (e) => {
        leftHand.setAttribute('raycaster', 'lineColor', '#e5f5a9');
        tooltipVisibility(false);
        if (clickDebounce) return;

        if (object.getAttribute('disabled') || (e.detail?.cursorEl === rightHand && !cursor.getAttribute('raycaster').enabled)) {
            cursor.emit("block");
            playSound(blockSound, "sfxPlayer");
            haptics(leftHand, "block");
            haptics(rightHand, "block");
            return;
        }

        haptics(leftHand, "click");
        const logicId = object.getAttribute('data-logic');
        clickDebounce = true;

        if (object.classList.contains('informative')) {
            const infoLogic = await import('../Utils/info.js');
            infoLogic.handle(object);
        }

        if (object.classList.contains("pickable")) {
            object.setAttribute('disabled', true);
            object.setAttribute('visible', false);;
        }

        try {
            const targetLogic = await import(`../Objects/${logicId}.js`);
            if (targetLogic?.handle) {
                targetLogic.handle(object, false);
            }
        } catch (err) {
            console.warn(`Logic for '${logicId}' failed:`, err);
        }
        object.setAttribute("marker", "false");
        playSound(clickSound, "sfxPlayer");
        if (object.getAttribute('clickonce')) {
            object.classList.remove('interactable');
        }

        setTimeout(() => {
            clickDebounce = false;
        }, 300);
    });

    if (object.getAttribute("material")) {
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
    }

    object.addEventListener('mouseenter', (e) => {
        if (object.getAttribute('disabled') || e.detail?.cursorEl === rightHand) {
            haptics(rightHand, "hover");
            e.detail.cursorEl.setAttribute('raycaster', 'lineColor', '#FF0000');
            return;
        }

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
    });

    object.addEventListener('mouseleave', (e) => {
        if (clickDebounce) return;
        if (object.getAttribute('disabled') || e.detail?.cursorEl === rightHand) {
            e.detail.cursorEl.setAttribute('raycaster', 'lineColor', '#e5f5a9');
        } else {
            object.emit('leave');
            hoveringOver = null;
            tooltipVisibility(false);
        }
    });

    window.addEventListener('keydown', async (e) => {
        if (hoveringOver && e.key === 'e' && hoveringOver.classList.contains("animal")) {
            const logicId = hoveringOver.getAttribute('data-logic');
            const targetLogic = await import(`../Objects/${logicId}.js`);
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
}
