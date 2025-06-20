const borise = document.getElementById("borise");
const fogcontroller = document.getElementById("fogcontroller");
const walls = document.getElementById("hexagon-walls");

const buttons = ['button1', 'button2', 'button3', 'button4', 'button5', 'button6'];
let interval = 0;

import { boriseSay } from "../Utils/boriseTalk.js";
import { setObjective } from "../Utils/objectives.js";

export function init() {
    setTimeout(() => {
        walls.setAttribute('animation-mixer', 'clip: Spawn; loop: once;');
        walls.setAttribute('position', '4000 0 0');
        borise.setAttribute('position', '3999.53971 0.19 2.22437');
        borise.setAttribute("animation-mixer", "clip: Spawn; loop: once;");
    }, 15000);
    borise.addEventListener('animation-finished', () => {
        borise.setAttribute("animation-mixer", "clip: Idle; loop: repeat;");
    })

    setTimeout(() => {
        boriseSay("Well that was loud...");
        boriseSay("Anyway, hi! I'm Borise! I detect that you are a new recruit!");
        boriseSay("Ready to find your ultimate quest?");
        boriseSay("Let's play!");
        boriseSay("You are in an escape room.");
        boriseSay("Each wall hides a future career treasure.");
        boriseSay("Let's see which one you're destined for...");
    }, 26000);

    setTimeout(() => {
        setObjective("Explore");
        borise.setAttribute('borise', 'distance: 4; followSpeed: 0.08; height: 0.5; rotationSpeed: 90;');
        fogcontroller.setAttribute('fog-controller', 'far: 30;')

        buttons.forEach(element => {
            setTimeout(() => {
                interval = 1000 * buttons.indexOf(element);
                const button = document.getElementById(element);
                const position = button.getAttribute('position');
                const newPos = `${position.x}, 0, ${position.z}`;
                button.setAttribute('animation', `property: position; to: ${newPos}; dur: 3000; easing: easeOutCirc;`);
                button.setAttribute('marker', true);
            }, interval)
        });
    }, 54000);
}
