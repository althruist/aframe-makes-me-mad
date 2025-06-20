import { setObjective } from '../Utils/objectives.js';

const plastic = document.getElementById("plasticmarker");

export function init() {
    document.querySelectorAll('.ocean-scene').forEach((el) =>{
        el.setAttribute('visible', true);
    })
    plastic.setAttribute("marker", true);
    setObjective(`Help the Turtle`, false);
}