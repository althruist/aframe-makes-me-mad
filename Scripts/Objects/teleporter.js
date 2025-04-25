import { transition } from '../Utils/transitionScreen.js';
import { setSong, fade } from '../Utils/music.js';

const rig = document.getElementById("rig");
const camera = document.getElementById("camera");

export function handle(teleporter){
    teleporter.setAttribute('disabled', true);
    if(teleporter.id == 'forest-teleport'){
        fade("out");
        transition(false);
        setTimeout(() => rig.setAttribute('position', '0 0 0'), 2000);
        setTimeout(() => transition(), 2000);
        setTimeout(() => fade("in"), 3000);
        setTimeout(() => setSong("#forest-song"), 3000);
        setTimeout(() => camera.setAttribute('walk', true), 3000);
        document.title = "EnvVR - Forest";
    } else {
        document.title = "EnvVR - Ocean";
        console.log("wip");
    }
}