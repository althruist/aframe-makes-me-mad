import { viewport } from "../Utils/cinematic.js";
import { setObjective } from "../Utils/objectives.js";
const spaceTeleport = document.getElementById("space-teleport");
const oceanTeleport = document.getElementById("ocean-teleport");

let objectiveSent = false;

export async function handle(deer, pressedE) {

    deer.setAttribute('animation-mixer', 'clip', 'Tease');
    deer.setAttribute('animation-mixer', 'loop', 'once');
    deer.setAttribute('sound', {
        src: '',
        autoplay: false
    });
    deer.setAttribute('sound', {
        src: `#deer${Math.floor(Math.random() * 6) + 1}-sfx`,
        autoplay: false
    });
    deer.components.sound.playSound();

    deer.addEventListener('animation-finished', function () {
        deer.setAttribute('animation-mixer', 'clip', 'Idle');
        deer.setAttribute('animation-mixer', 'loop', 'repeat');
    });

    if (pressedE) { return; };
    if (objectiveSent) { return; };
    oceanTeleport.setAttribute("disabled", false);
    spaceTeleport.setAttribute('animation', {
        property: 'position',
        to: '-14.99106 3.04666 0.23',
        dur: 5000,
        easing: 'easeOutCirc'
    });
    spaceTeleport.setAttribute('sound', {
        src: '#spaceteleportrumble-sfx',
        autoplay: true,
        volume: 1
    });
    viewport('animate', { property: 'position', from: '-10.910 4.430 1.6', to: '-10.103 4.291 1.985', easing: 'easeOutSine', dur: 5000, autoStop: true, camRotation: '8.850 70 0' });
    await new Promise(resolve => setTimeout(resolve, 5000));
    setObjective("Go through the Space Door", false);

    objectiveSent = true;
}