import { setObjective } from '../Utils/objectives.js';

const plastic = document.getElementById("plastic");

export function init() {
    plastic.setAttribute("marker", true);
    setObjective(`Help the Turtle`, false);
}