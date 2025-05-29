import { setObjective } from "../Utils/objectives.js";
import { setupInteractable } from "../Utils/setupInteractable.js";
import { setTooltip, tooltipVisibility } from "../Utils/tooltip.js";

const seedData = [
    { id: "seed1", position: "-40.47608 20.69479 -2.71528" },
    { id: "seed2", position: "-40.19266 25.36403 -61.46082" },
    { id: "seed3", position: "-79.8022 32.9 -59.66665" },
    { id: "seed4", position: "-75.73676 15.61316 21.99073" },
    { id: "seed5", position: "38.35825 7.48589 0" },
    { id: "seed6", position: "45.25407 6.87266 6.44728" },
    { id: "seed7", position: "10.0378 4.78051 -63.78385" },
];

export function init() {
    setObjective(`Collect Seeds: 0/7`, true);

    seedData.forEach((data, index) => {
        const wrapper = document.createElement('a-entity');
        wrapper.setAttribute('id', data.id);
        wrapper.setAttribute('class', 'seed');
        wrapper.setAttribute('position', data.position);

        const inner = document.createElement('a-entity');
        inner.setAttribute('mixin', 'seed-mixin');
        inner.setAttribute('class', 'interactable pickable');
        inner.setAttribute('data-logic', 'seed');

        inner.setAttribute('animation', 'property: rotation; to: 0 360 0; easing: linear; loop: true; dur: 5000;');
        inner.setAttribute('animation__1', 'property: position; to: 0 0.2 0; easing: easeInOutQuad; loop: true; dur: 1000; dir: alternate;');

        wrapper.setAttribute('marker', true);
        wrapper.appendChild(inner);
        scene.appendChild(wrapper);
        setupInteractable(inner);
    });

}