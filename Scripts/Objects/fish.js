import { viewport } from "../Utils/cinematic.js";
import { setObjective } from "../Utils/objectives.js";
let objectiveSent = false
let portalOpened = false;

const portal = document.getElementById("space-teleport");

export function handle(fish, pressedE) {
    fish.setAttribute('animation-mixer', 'clip', 'Tease');
    fish.setAttribute('animation-mixer', 'loop', 'once');
    fish.setAttribute('sound', {
        src: '',
        autoplay: false
    });
    fish.setAttribute('sound', {
        src: `#fish${Math.floor(Math.random() * 5) + 1}-sfx`,
        autoplay: false
    });
    fish.components.sound.playSound();

    fish.addEventListener('animation-finished', function () {
        fish.setAttribute('animation-mixer', 'clip', 'Swim');
        fish.setAttribute('animation-mixer', 'loop', 'repeat');
    });

    if (pressedE) { return; };
    if (!portalOpened) {
        portal.setAttribute('position', '-1987.280 -6.967 11.620');
        portal.setAttribute('rotation', '0 -20.510 14.240');
        portal.setAttribute('animation', {
            property: 'position',
            to: '-1987.280 -0.330 11.620',
            dur: 5000,
            ease: 'easeOutCirc',
            loop: false
        })
        portal.setAttribute('sound', {
            src: '#spaceteleportrumble-sfx',
            autoplay: true,
            volume: 1
        });
        portal.setAttribute("disabled", false);
        viewport('animate', { property: 'position', from: '-1996.908 2.175 6.602', to: '-1995.480 2.175 7.426', ease: 'linear', dur: 6000, autoStop: true, camRotation: '0 240 0' });
    }
    portalOpened = true;
    if (objectiveSent) { return; }
    objectiveSent = true;
    setObjective("Finish the game!", false);
}