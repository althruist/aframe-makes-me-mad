import { setObjective } from "../Utils/objectives.js";
import { setTooltip, tooltipVisibility } from "../Utils/tooltip.js";

let handled = false;
let filled = false;
let saltified = false;

let currentHolograph = null;

async function place(x, y, z, bucket) {
    if (currentHolograph != null) {
        currentHolograph.remove();
    }
    const holograph = document.createElement('a-entity');
    holograph.setAttribute('gltf-model', '#holographicbucket-model');

    holograph.setAttribute('marker', true);
    holograph.setAttribute('position', `${x} ${y} ${z}`);
    holograph.setAttribute('animation', {
        property: 'position',
        to: `${x} ${y - 1} ${z}`,
        dur: 1000,
        easing: "easeInOutSine",
        dir: "alternate",
        loop: true
    })
    holograph.setAttribute('animation__1', {
        property: 'rotation',
        to: `0 360 0`,
        dur: 5000,
        easing: "linear",
        dir: "alternate",
        loop: true
    })

    holograph.classList.add('interactable');
    bucket.classList.add('interactable');

    holograph.addEventListener('click', async () => {
        if (!filled) {
            filled = true;
            setObjective("Let the Water Evaporate");
            holograph.setAttribute('disabled', true);
            holograph.classList.remove('interactable');
            holograph.setAttribute('visible', false);
            currentHolograph = null;
            bucket.setAttribute('position', `${x} 3 ${z}`);
            bucket.setAttribute('rotation', holograph.getAttribute('rotation'));
            bucket.setAttribute('visible', true);
            bucket.setAttribute('animation-mixer', 'clip: WaterRise; loop: once;');
            bucket.setAttribute('sound', 'src: #bucketplace-sfx; positional: false; autoplay: true;');
            await new Promise(resolve => setTimeout(resolve, 2300));
            bucket.setAttribute('visible', false);
            place(66.686, 6.279, 50.163, bucket);
            holograph.remove();
        } else {
            saltified = true;
            holograph.setAttribute('disabled', true);
            holograph.classList.remove('interactable');
            holograph.setAttribute('visible', false);
            bucket.setAttribute('position', `${x} 5.4 ${z}`);
            bucket.setAttribute('rotation', holograph.getAttribute('rotation'));
            bucket.components.sound.playSound();
            bucket.setAttribute('visible', true);
            bucket.setAttribute('animation-mixer', 'clip: Saltify; loop: once;');
            await new Promise(resolve => setTimeout(resolve, 2300));
            bucket.setAttribute('animation-mixer', 'clip: SaltIdle; loop: repeat;');
            bucket.setAttribute("disabled", false);
        }
    })

    holograph.addEventListener('mouseenter', () => {
        if (filled) {
            if (scene.is('vr-mode')) {
                setTooltip("Press Left Trigger to evaporate", false);
            } else {
                setTooltip("Click to evaporate", false);
            }
        } else if (filled && saltified) {
            if (scene.is('vr-mode')) {
                setTooltip("Press Left Trigger to start Cloud Seeding", false);
            } else {
                setTooltip("Click to start Cloud Seeding", false);
            }
        }
        else {
            if (scene.is('vr-mode')) {
                setTooltip("Press Left Trigger to Fill Bucket", false);
            } else {
                setTooltip("Click to Fill Bucket", false);
            }
        }
    })

    holograph.addEventListener('mouseleave', () => {
        tooltipVisibility(false);
    })

    scene.appendChild(holograph);
    currentHolograph = holograph;
}

export async function handle(bucket) {
    tooltipVisibility(false);
    if (!handled) {
        bucket.classList.remove("pickable");
        bucket.setAttribute('sound', 'src: #bucketpickup-sfx; autoplay: true;');
        setObjective("Fill the Bucket with Seawater", false);
        handled = true;
        place(80.943, 6.182, 55.879, bucket);
    }

    if (filled) {
        const rainForest = await import('../Cutscene/rainForest.js');
        await rainForest.handle();
        bucket.remove();
    }
}