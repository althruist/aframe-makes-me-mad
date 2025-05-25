import { viewport } from "../Utils/cinematic.js";
import { setObjective } from "../Utils/objectives.js";
import { setMusic } from "../Utils/sound.js";

const fogController = document.getElementById('fogcontroller');
const rain = document.getElementById('rain');
const rainySky = document.getElementById('rainy-sky');
const lightSun = document.getElementById('light-sun');
const clouds = document.getElementById('clouds');
const freshWater = document.getElementById("freshwater");
const freshWaterPlayer = document.getElementById("freshwater-player");
const deer = document.getElementById("deer");
const deer2 = document.getElementById("deer2");

export async function handle(object) {
    setMusic('#forestrain-music', 0.7)
    rain.setAttribute('sound', 'volume', 5);
    rain.components.sound.playSound();
    clouds.setAttribute('animation', 'property: position; to: 13 600 -19; dur: 4000; easing: easeOutSine; loop: false;');
    clouds.addEventListener('animationcomplete', () => {
        clouds.remove();
    })
    lightSun.setAttribute('animation', 'property: light.intensity; to: 0; dur: 4000; easing: easeOutSine');
    rainySky.setAttribute('animation', 'property: material.opacity; to: 1; dur: 4000; easing: easeOutSine');
    fogController.setAttribute('animation', 'property: fog-controller.far; to: 80; dur: 4000; easing: easeOutSine');
    fogController.setAttribute('animation__1', 'property: fog-controller.color; to: #9e9e9e; dur: 4000; easing: easeOutSine');
    rain.setAttribute('particle-system', "opacity", "1");
    viewport("animate", { property: "position", from: "27 13.5 -23.18", to: "27 13.5 -22.8", dur: 4000, easing: "linear", camRotation: "-11.070 180 0" });
    viewport("animate", { property: "position", from: "51.6 20 -49", to: "46 22 -48", dur: 8000, easing: "linear", camRotation: "-23 280 0" });
    await new Promise(resolve => setTimeout(resolve, 4000));
    freshWater.setAttribute('animation', {
        property: 'position',
        to: '93.688 12.963 -50.50',
        dur: 8000,
        easing: "linear"
    })
    freshWaterPlayer.setAttribute('sound', 'volume', 1);
    viewport("animate", { property: "position", from: "17.465 8.599 -58.411", to: "19.665 8.599 -55.238", dur: 10000, easing: "linear", camRotation: "0 115 0" });
    viewport("animate", { property: "position", from: "56.6 14 -42", to: "56.6 14 -40", dur: 4000, easing: "linear", camRotation: "-23 280 0", autoStop: true });
    await new Promise(resolve => setTimeout(resolve, 12000));
    deer.setAttribute('position', "59.68474 13.86007 -40.95018");
    deer.setAttribute('animation-mixer', 'useRegExp: true; clip: Drink;');
    lightSun.setAttribute('animation', 'property: light.intensity; to: 1; dur: 4000; easing: easeOutSine');
    rainySky.setAttribute('animation', 'property: material.opacity; to: 0; dur: 4000; easing: easeOutSine');
    fogController.setAttribute('animation', 'property: fog-controller.far; to: 250; dur: 4000; easing: easeOutSine');
    fogController.setAttribute('animation__1', 'property: fog-controller.color; to: #a4d0b5; dur: 4000; easing: easeOutSine');
    rain.setAttribute('particle-system', "opacity", "0");
    rain.emit("fadeout");
    await new Promise(resolve => setTimeout(resolve, 8000));
    deer2.setAttribute('position', "3.817 4.6 -7.346");
    deer2.setAttribute('rotation', "-1.85 -90 1.240");
    deer2.setAttribute('marker', true);
    setObjective("Check out the Deer", false);
}