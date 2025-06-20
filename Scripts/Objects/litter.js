import { finishObjective, setObjective } from "../Utils/objectives.js";
import { setupInteractable } from '../Utils/setupInteractable.js';
import { viewport } from '../Utils/cinematic.js';
import { setMusic } from "../Utils/sound.js";

const can = document.getElementById("can");
const bottle = document.getElementById("bottle");
const hook = document.getElementById("hook");
const cigarette = document.getElementById("cigarette");

const turtle = document.getElementById("turtle");

let count = 0;
let interval = 0;

export async function handle(object) {
    count++;
    object.parentElement.setAttribute('marker', false);

    if (object.getAttribute("id") == "plastic") {
        setMusic('#turtlerelease-music');
        viewport('animate', { property: 'position', from: '-1992.608 2.744 -8.807', to: '-1991.828 2.907 -9.583', dur: '5000', easing: 'linear', camRotation: '-8.450 134.850 0', autoStop: true });

        setObjective("Collect Litter: 1/5", false);
        can.setAttribute("class", "interactable pickable");
        bottle.setAttribute("class", "interactable pickable");
        hook.setAttribute("class", "interactable pickable");
        cigarette.setAttribute("class", "interactable pickable");

        setupInteractable(can);
        setupInteractable(bottle);
        setupInteractable(hook);
        setupInteractable(cigarette);

        can.setAttribute("marker", true);
        bottle.setAttribute("marker", true);
        hook.setAttribute("marker", true);
        cigarette.setAttribute("marker", true);

        turtle.setAttribute('sound', {
            src: `#turtle${Math.floor(Math.random() * 5) + 1}-sfx`,
            autoplay: true
        });

        turtle.setAttribute('animation-mixer', {
            useRegExp: true,
            clip: "Swim",
            loop: "repeat"
        });

        turtle.setAttribute("animation__1", {
            property: 'position',
            to: '14.769 -17.234 -1.909',
            dur: 4000,
            easing: "easeOutQuad"
        })

        turtle.setAttribute("animation__2", {
            property: 'rotation',
            to: '1.340 2.700 -47.390',
            dur: 1000,
            easing: "easeOutSine"
        })

        turtle.setAttribute("animation__3", {
            property: 'rotation',
            to: '4.372 174.039 38.490',
            delay: 2500,
            dur: 1000,
            easing: "easeInOutQuad",
            loop: false
        })

        turtle.addEventListener('animationcomplete__3', () => {
            turtle.setAttribute('sound', {
                src: `#turtle${Math.floor(Math.random() * 5) + 1}-sfx`,
                autoplay: true
            });
            turtle.setAttribute('class', 'interactable animal informative ocean-scene');
            setupInteractable(turtle);
        })
    } else {
        setObjective(`Collect Litter: ${count}/5`, true);
    }

    object.remove();

    if (count === 5) {
        setMusic('#oceangrowth-music');
        finishObjective();
        viewport('animate', { property: 'position', from: '-1996.490 3 -13.150', to: '-1996.490 3 -11.150', dur: '2000', easing: 'linear', camRotation: '10.200 0 0' });
        viewport('animate', { property: 'position', from: '-2012.280 4.860 -13.650', to: '-2012.280 4.860 -14.5', dur: '4800', easing: 'linear', camRotation: '16.580 90.000 0' });
        viewport('animate', { property: 'rotation', from: '20 0 0', to: '50 0 0', dur: '5000', easing: 'easeOutCirc', camPosition: "-2016.5 0.91 30.4", autoStop: true });
        fetch('./Scripts/Data/corals.json')
            .then(response => response.json())
            .then(coralData => {
                const scene = document.querySelector('a-scene');

                coralData.forEach((coral, index) => {
                    interval += 100;
                    setTimeout(() => {
                        const coralEl = document.createElement('a-entity');
                        coralEl.setAttribute('id', `coral-${index + 1}`);
                        if (coralEl.getAttribute('id') == "coral-64") {
                            coralEl.setAttribute('class', 'coral ocean-scene');
                            const interactCube = document.createElement('a-box');
                            interactCube.setAttribute('scale', '0.2 0.2 0.2');
                            interactCube.setAttribute('position', '0 0.15 0');
                            interactCube.setAttribute('id', "coral");
                            interactCube.setAttribute('class', 'interactable informative');
                            interactCube.setAttribute("material", "opacity", 0);
                            interactCube.setAttribute("data-logic", "coral");
                            setTimeout(() => {
                                interactCube.setAttribute("marker", true);
                            }, 5000);
                            setupInteractable(interactCube);
                            coralEl.appendChild(interactCube);
                            setObjective("Check out the Big Coral", false);
                        }
                        coralEl.setAttribute('class', 'coral ocean-scene');
                        coralEl.setAttribute('position', coral.position);
                        coralEl.setAttribute('mixin', coral.mixin);
                        coralEl.setAttribute('scale', `${coral.scale} ${coral.scale} ${coral.scale}`);
                        coralEl.setAttribute('rotation', coral.rotation);
                        coralEl.setAttribute('animation-mixer', 'clip: Grow; loop: once;');
                        scene.appendChild(coralEl);

                        coralEl.addEventListener('animation-finished', () => {
                            coralEl.setAttribute('animation-mixer', {
                                clip: 'Idle',
                                loop: 'repeat',
                            });
                            coralEl.removeAttribute('animation-mixer');
                        });
                    }, interval)
                });
            });
    }
}