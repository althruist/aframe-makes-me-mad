import { transition } from '../Utils/transitionScreen.js';
import { setAmbience, fade, setMusic, stopAmbience } from '../Utils/sound.js';
import { setTooltip } from '../Utils/tooltip.js';
import { setObjective } from '../Utils/objectives.js';
import { setSubtitle } from '../Utils/subtitles.js';

const fogController = document.getElementById('fogcontroller');
const oceanTeleport = document.getElementById('ocean-teleport');
const finishBG = document.getElementById("finish-bg");
const cursor = document.getElementById("cursor");
const subtitles = document.getElementById("subtitles");
const loadingVideo = document.getElementById("loading-video");
const endingVideo = document.getElementById("ending-video");
const spinningTreeVideo = document.getElementById("spinningtree-video");

let alreadyShown = false;
let finish = false;

function teleport(ambience, rigPos, docTitle, fogDensity, fogColor, fogFar, teleportId) {
    fade("out");
    transition(false);
    setTimeout(() => {
        rig.setAttribute('position', rigPos);
        fogController.setAttribute("fog-controller", "density", fogDensity);
        fogController.setAttribute("fog-controller", "color", fogColor);
        fogController.setAttribute("fog-controller", "far", fogFar);
        transition();
    }, 2000);

    setTimeout(() => {
        fade("in");
        setAmbience(ambience);
        if (teleportId == 'space-teleport') {
            camera.setAttribute('walk', false);
        } else {
            camera.setAttribute('walk', true);
        }
        if (!alreadyShown) {
            alreadyShown = true;
            if (scene.is('vr-mode')) {
                setTooltip("Press 'X' to view current objective", true);
            } else {
                setTooltip("Press 'O' to view current objective", true);
            }
        } else {
            return;
        }
    }, 3000);

    document.title = docTitle;
}

export async function handle(teleporter) {
    teleporter.setAttribute('disabled', true);

    if (teleporter.id !== 'space-teleport') {
        teleporter.setAttribute('animation',
            {
                property: 'scale',
                to: '1 0 1',
                dur: 1000,
                easing: 'easeOutCirc'
            }
        )
    }

    if (teleporter.id == 'forest-teleport') {
        teleport('#forest-ambience', '0 5 -72', 'EnvVR - Forest', 0.03, '#a4d0b5', 250);
        setTimeout(() => {
            oceanTeleport.setAttribute('position', '-0.022 0.004 0.043');
            teleporter.remove();
            setMusic('#forestentrance-music', 0.2);
        }, 3000);
    } else if (teleporter.id == 'ocean-teleport') {
        setTimeout(() => {
            setMusic('#oceanentrance-music', 0.2);
        }, 3000)
        const oceanLight = document.getElementById("ocean-light");
        oceanLight.setAttribute('light', 'intensity', 500);
        teleport('#ocean-ambience', '-2000 10 0', 'EnvVR - Ocean', 0.03, '#105870', 50);
    } else if (teleporter.id == 'space-teleport') {
        if (finish) {
            teleport('#space-ambience', '2000 10 -27.325', 'EnvVR - You did it!', 0, '#000', 10000, teleporter.id);
            stopAmbience();
            setTimeout(async () => {
                subtitles.setAttribute("position", "0 -0.081 -1.021")
                cursor.remove();
                finishBG.setAttribute('material', 'opacity', 1);
                if (scene.is('vr-mode')) {
                    loadingVideo.setAttribute('position', '0 0 -2.160');
                };
                await setSubtitle("You did it!", false, 4);
                await setSubtitle("You won the game!", false, 4);
                await setSubtitle("Thanks for playing EnvVR!", true, 5);
                loadingVideo.setAttribute("src", "#ending-video");
                spinningTreeVideo.remove();
                endingVideo.play();
                transition(false);
            }, 2000)
        } else {
            finish = true
            setObjective("Go to the Ocean Level", false);
            camera.removeAttribute('nav-mesh-constrained');

            teleport('#space-ambience', '2000 10 -27.325', 'EnvVR - Space', 0, '#000', 10000, teleporter.id);

            setTimeout(() => {
                document.querySelectorAll('.forest-scene').forEach(object => {
                    object.remove();
                })
                camera.setAttribute('position', '0 0 0');
                rig.setAttribute('position', '2000 10 -27.325');
                camera.setAttribute('nav-mesh-constrained', 'fallMode: snap;');
                camera.setAttribute('walk', false);
            }, 1000);
        }
    }

}