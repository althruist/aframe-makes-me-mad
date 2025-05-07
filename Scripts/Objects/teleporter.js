import { transition } from '../Utils/transitionScreen.js';
import { setSong, fade } from '../Utils/sound.js';

const rig = document.getElementById("rig");
const camera = document.getElementById("camera");

function teleport(song, rigPos, docTitle){
    fade("out");
    transition(false);
    setTimeout(() => {
        rig.setAttribute('position', rigPos);
        transition();
    }, 2000);

    setTimeout(() => {
        fade("in");
        setSong(song);
        camera.setAttribute('walk', true);
    }, 3000);

    document.title = docTitle;
}

export function handle(teleporter){
    teleporter.setAttribute('disabled', true);
    if(teleporter.id == 'forest-teleport'){
        teleport('#forest-song', '0 0 0', 'EnvVR - Forest');
    } else {
        document.title = "EnvVR - Ocean";
        console.log("wip");
    }
}