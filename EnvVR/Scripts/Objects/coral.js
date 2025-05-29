import { viewport } from "../Utils/cinematic.js";
import { setMusic } from "../Utils/sound.js";
import { setObjective } from "../Utils/objectives.js";

const fish = document.getElementById("fish");
let debounce = false;

export function handle() {
    if (debounce == true) { return };
    debounce = true;
    viewport('animate', { property: 'position', from: '-2020.640 3.030 4.250', to: '-2021.500 1.980 3.920', easing: 'easeOutQuart', dur: 4000, autoStop: true });
    setMusic('#fishdiscovery-music');
    fish.setAttribute('position', '-2016.902 4.781 1.873');
    fish.setAttribute('rotation', '0 180 0');

    fish.setAttribute('animation__1', {
        property: 'position',
        to: '-2021.603 1.831 1.873',
        easing: 'easeOutSine',
        dur: 2000,
        loop: false
    })
    fish.setAttribute('animation__2', {
        property: 'rotation',
        to: '0 180 -33.640',
        easing: 'linear',
        dur: 2000,
        loop: false
    })
    fish.addEventListener('animationcomplete__1', () => {
        fish.setAttribute('animation__3', {
            property: 'rotation',
            to: '0 260 0',
            easing: 'easeOutSine',
            dur: 2000,
            loop: false
        })

        fish.setAttribute('animation__4', {
            property: 'position',
            to: '-2021.583 1.779 2.084',
            easing: 'easeOutSine',
            dur: 2000,
            loop: false
        })
    })

    fish.setAttribute('sound', {
        src: `#fish${Math.floor(Math.random() * 5) + 1}-sfx`,
        autoplay: false
    });

    fish.addEventListener('animationcomplete__4', () => {
        setObjective("Check out the Fish", false);
    })
}