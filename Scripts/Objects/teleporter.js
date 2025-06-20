import { transition } from '../Utils/transitionScreen.js';
import { setAmbience, fade, setMusic, stopAmbience, setVolume } from '../Utils/sound.js';
import { setTooltip } from '../Utils/tooltip.js';
import { setObjective } from '../Utils/objectives.js';
import { setSubtitle } from '../Utils/subtitles.js';

const fogController = document.getElementById('fogcontroller');
const finishBG = document.getElementById("finish-bg");
const cursor = document.getElementById("cursor");
const subtitles = document.getElementById("subtitles");
const loadingVideo = document.getElementById("loading-video");
const title = document.getElementById("envvr");
const blackBG = document.getElementById("finish-bg");

const oceanTeleport = document.getElementById('ocean-teleport');
const mcastTeleport = document.getElementById('mcast-teleport');
const spaceTeleport = document.getElementById('space-teleport');

const spinningTreeVideo = document.getElementById("spinningtree-video");
const spinningCoralVideo = document.getElementById("spinningcoral-video");
const spinningBirdVideo = document.getElementById("spinningbird-video");

let finish = false;
let startScreen = false;
let titleShown = false;

export function teleport(ambience, rigPos, docTitle, fogDensity, fogColor, fogFar, teleportId) {
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
    }, 3000);

    document.title = docTitle;
}

function showStartScreen(stage) {
    blackBG.setAttribute('opacity', 1);
    title.setAttribute('src', '#developed-image');
    title.emit("show1");
    title.addEventListener('animationcomplete__show4', () => {
        title.emit("hide");
    })
    title.addEventListener('animationcomplete__show1', () => {
        title.emit("hide");
    })
    title.addEventListener('animationcomplete__hide', () => {
        if (titleShown) {
            if (scene.is('vr-mode')) {
                setTooltip("Press 'X' to view current objective", true);
            } else {
                setTooltip("Press 'O' to view current objective", true);
            }
            return;
        }
        if (startScreen) {
            title.setAttribute('src', '#title-image');
            title.emit("show");
            if (stage == "forest") {
                setMusic('#forestentrance-music', 0.2);
            } else {
                setMusic('#hexagonentrance-music', 0.5);
            }
            blackBG.emit("hide");
            titleShown = true;
            return;
        }
        title.setAttribute('src', '#mcast-image');
        title.emit("show1");
        startScreen = true;
    })
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
        spinningBirdVideo.remove()
        loadingVideo.setAttribute("src", '#spinningtree-video');
        spinningTreeVideo.play();
        teleport('#forest-ambience', '0 5 -72', 'EnvVR - Forest', 0.03, '#a4d0b5', 250);
        setTimeout(() => {
            document.querySelectorAll('.mcast-scene').forEach(object => {
                object.remove();
            })
            oceanTeleport.setAttribute('position', '-0.022 0.004 0.043');
            teleporter.remove();
            mcastTeleport.remove();
            showStartScreen('forest');
        }, 3000);
    } else if (teleporter.id == 'ocean-teleport') {
        spinningTreeVideo.remove()
        loadingVideo.setAttribute("src", '#spinningcoral-video');
        spinningCoralVideo.play();
        setTimeout(() => {
            setMusic('#oceanentrance-music', 0.2);
        }, 3000)
        const oceanLight = document.getElementById("ocean-light");
        oceanLight.setAttribute('light', 'intensity', 500);
        teleport('#ocean-ambience', '-2000 10 0', 'EnvVR - Ocean', 0.03, '#105870', 50);
    } else if (teleporter.id == 'mcast-teleport') {
        spinningBirdVideo.currentTime = 0;
        teleport('#hexagon-ambience', '4000 0 0', 'EnvVR - Where are you??', 0.03, '#100f1b', 5, teleporter.id);
        setTimeout(() => {
            showStartScreen('hexagon');
            document.querySelectorAll('.forest-scene').forEach(object => {
                object.remove();
            })
            document.querySelectorAll('.ocean-scene').forEach(object => {
                object.remove();
            })
            document.querySelectorAll('.space-scene').forEach(object => {
                object.remove();
            })
            document.querySelectorAll('.island-scene').forEach(object => {
                object.remove();
            })
            camera.setAttribute('walk', false);
        }, 3000);
    } else if (teleporter.id == 'space-teleport') {
        if (finish) {
            document.querySelectorAll('.ocean-scene').forEach(object => {
                object.remove();
            })
            document.querySelectorAll('.space-scene').forEach(object => {
                object.remove();
            })
            camera.removeAttribute('nav-mesh-constrained');
            camera.setAttribute('walk', false);
            teleport('#space-ambience', '5999 0.543 -1.711', 'EnvVR - You did it!', 1, '#d1999f', 50, teleporter.id);
            stopAmbience();
            setTimeout(async () => {
                spaceTeleport.remove();
                subtitles.setAttribute("position", "0 -0.081 -1.021")
                cursor.remove();
                finishBG.setAttribute('material', 'opacity', 1);
                if (scene.is('vr-mode')) {
                    loadingVideo.setAttribute('position', '0 0 -2.160');
                };
                finishBG.setAttribute("render-order", '998');
                await setSubtitle("You did it!", { autoHide: true, time: 4 });
                document.querySelectorAll('.island-scene').forEach(object => {
                    object.setAttribute('visible', true);
                })
                await setSubtitle("You won the game!", { autoHide: false, time: 4 });
                await setSubtitle("Thanks for playing EnvVR!", { autoHide: true, time: 5 });
                spinningCoralVideo.remove();
                finishBG.emit("hide");
                camera.setAttribute('position', '0 0 0');
                if (scene.is('vr-mode')) {
                    rig.setAttribute('position', '6010 -1 0');
                } else {
                    rig.setAttribute('position', '5997 -0.5 -1.711');
                }
                setMusic('#ending-music', 1, true);
            }, 2000)
        } else {
            finish = true
            setObjective("Go to the Ocean Level", false);
            camera.removeAttribute('nav-mesh-constrained');

            teleport('#space-ambience', '2000 7 -27.325', 'EnvVR - Space', 0, '#000', 10000, teleporter.id);

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

export function finishOBJ() {
    console.log("set");
    finish = true;
}

window.finishOBJ = finishOBJ;