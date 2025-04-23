import { transition } from '../Utils/transitionScreen.js';

const rig = document.getElementById("rig");
export function handle(teleporter){
    teleporter.setAttribute('disabled', true);
    if(teleporter.id == 'forest-teleport'){
        transition(false);
        setTimeout(() => rig.setAttribute('position', '0 0 0'), 2000);
        setTimeout(() => transition(), 2000);
    } else {
        console.log("click");
    }
}