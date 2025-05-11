import { transition } from '../Utils/transitionScreen.js';
import { setSong, fade } from '../Utils/sound.js';

function teleport(song, rigPos, docTitle, fogDensity, fogColor) {
    fade("out");
    transition(false);
    setTimeout(() => {
        rig.setAttribute('position', rigPos);
        scene.setAttribute("fog", "density", fogDensity);
        scene.setAttribute("fog", "color", "#a4d0b5");
        transition();
    }, 2000);

    setTimeout(() => {
        fade("in");
        setSong(song);
        camera.setAttribute('walk', true);
    }, 3000);

    document.title = docTitle;
}

export function handle(teleporter) {
    teleporter.setAttribute('disabled', true);
    if (teleporter.id == 'forest-teleport') {
        teleport('#forest-song', '0 50 0', 'EnvVR - Forest', 0.03);
    } else {
        document.title = "EnvVR - Ocean";
        console.log("wip");
    }
}