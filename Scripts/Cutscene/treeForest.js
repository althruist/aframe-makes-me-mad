import { viewport } from "../Utils/cinematic.js";
import { pauseObjectives, resumeObjectives, setObjective } from "../Utils/objectives.js";
import { setMusic } from "../Utils/sound.js";

export async function handle() {
    pauseObjectives();
    setMusic('#forestgrowth-music', 0.7);
    document.getElementById('tree').setAttribute('animation-mixer', 'clip: Grow; loop: once;');

    document.getElementById("tree").setAttribute('sound', {
        src: `#treegrow${Math.floor(Math.random() * 8) + 1}-sfx`,
        autoplay: true
    });

    document.getElementById('tree').setAttribute('sound', 'src: #treegrow-sfx; autoplay: true');

    viewport("animate", { property: "position", from: "-15 5.325 23.632", to: "-15 5.325 22", dur: 3000, easing: "linear", camRotation: "6.29 172 0" });
    viewport("animate", { property: "position", from: "-15 5.325 22", to: "-14.29 5.325 18", dur: 5000, easing: "easeOutCirc", camRotation: "6.29 172 0" });
    viewport("animate", { property: "position", from: "0 6 17.5", to: "-3 6.5 17", dur: 4000, easing: "linear", camRotation: "11.5 -101 0" });
    viewport("animate", { property: "rotation", from: "27 100 0", to: "27 72 0", dur: 6000, easing: "linear", camPosition: '-4.8 8.3 17' });
    viewport("animate", { property: "position", from: "-33.278 27.651 -18.211", to: "-32 27.651 -18.211", dur: 4000, easing: "easeOutSine", camRotation: '-8.2 -92 0' });
    viewport("animate", { property: "position", from: "-14.558 4.915 36.515", to: "-14.437 4.915 35.590", dur: 6000, easing: "linear", camRotation: '10.720 60 0', autoStop: true });
    await new Promise(resolve => setTimeout(resolve, 2300));
    fetch('./Scripts/Data/trees.json')
        .then(response => response.json())
        .then(treeData => {
            const scene = document.querySelector('a-scene');
            const templateTree = document.getElementById('template-tree');

            treeData.forEach((tree, index) => {
                setTimeout(() => {
                    const treeEl = templateTree.cloneNode(true);

                    treeEl.setAttribute('id', `tree-${index + 1}`);
                    treeEl.setAttribute('class', 'tree');
                    treeEl.setAttribute('visible', 'true');
                    treeEl.setAttribute('position', tree.position);
                    treeEl.setAttribute('scale', `${tree.scale} ${tree.scale} ${tree.scale}`);
                    treeEl.setAttribute('random-rotation', 'min: 0 0 0; max: 0 360 0');
                    treeEl.setAttribute('animation-mixer', 'clip: Grow; loop: once;');

                    treeEl.addEventListener('animation-finished', () => {
                        if (!tree.stopAnimatingOnGrowth) {
                            treeEl.setAttribute('animation-mixer', {
                                clip: 'Idle',
                                loop: 'repeat',
                            });
                        } else {
                            treeEl.removeAttribute('animation-mixer');
                        }
                    });

                    scene.appendChild(treeEl);

                }, index * 250);
            });
        });


    await new Promise(resolve => setTimeout(resolve, 20000));
    bird.setAttribute('sound', {
        src: `#chirp${Math.floor(Math.random() * 5) + 1}-bird-sfx`,
        autoplay: true
    });

    bird.setAttribute('animation__flyIn', {
        property: 'position',
        from: "-30.6742 10 34.17358",
        to: '-16.801 5.486 34.174',
        dur: 2000,
        easing: 'easeOutSine'
    })

    bird.addEventListener('animationcomplete__flyIn', () => {
        bird.setAttribute('animation-mixer', 'clip: Idle;');
    })

    await new Promise(resolve => setTimeout(resolve, 3000));

    bird.setAttribute('animation-mixer', 'clip: Tease;');
    bird.setAttribute('sound', {
        src: `#chirp${Math.floor(Math.random() * 5) + 1}-bird-sfx`,
        autoplay: true
    });

    await new Promise(resolve => setTimeout(resolve, 400));

    bird.setAttribute('animation-mixer', 'clip: Idle;');

    await new Promise(resolve => setTimeout(resolve, 3400));
    bird.setAttribute('marker', true);

    resumeObjectives();
    setObjective("Check out the Bird", false);
}