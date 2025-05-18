import { transition } from '../Utils/transitionScreen.js';
import { setSong, fade } from '../Utils/sound.js';
import { setTooltip } from '../Utils/tooltip.js';

function teleport(song, rigPos, docTitle, fogDensity, fogColor, fogFar) {
    fade("out");
    transition(false);
    setTimeout(() => {
        rig.setAttribute('position', rigPos);
        scene.setAttribute("fog", "density", fogDensity);
        scene.setAttribute("fog", "color", fogColor);
        scene.setAttribute("fog", "far", fogFar);
        transition();
    }, 2000);

    setTimeout(() => {
        fade("in");
        setSong(song);
        camera.setAttribute('walk', true);
        if (scene.is('vr-mode')) {
            setTooltip("Press 'X' to view current objective", true);
        } else {
            setTooltip("Press 'O' to view current objective", true);
        }
    }, 3000);

    document.title = docTitle;
}

export function handle(teleporter) {
    teleporter.setAttribute('disabled', true);

    teleporter.setAttribute('animation',
        {
            property: 'scale',
            to: '1 0 1',
            dur: 1000,
            easing: 'easeOutCirc'
        }
    )
    
    if (teleporter.id == 'forest-teleport') {
        teleport('#forest-song', '0 5 -72', 'EnvVR - Forest', 0.03, '#a4d0b5', 250);
    } else {
        teleport('#ocean-song', '-2000 10 0', 'EnvVR - Ocean', 0.03, '#105870', 50);
    }
}