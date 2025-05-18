import { haptics } from "./haptics.js";
import { playSound } from "./sound.js";

const objective = document.getElementById("objective");
const vrObjective = document.getElementById("vrObjective");

const objectiveClearedSound = '#objectivecleared-sfx';
const newObjectiveSound = '#newobjective-sfx';

const leftHand = document.getElementById('left-hand');

let isDisabled = false;
let debounce = false;

export async function setObjective(text) {
    if (objective.getAttribute('text', 'value').value !== "No Objectives Yet") {
        await finishObjective();
    }
    if (isDisabled) {
        console.warn("Objectives are disabled. You cannot set them... yet.");
        return;
    }
    haptics(leftHand, "newObjective");
    isDisabled = true;
    objective.emit("show");
    vrObjective.emit("show");
    objective.setAttribute('text', 'value', `Objective: ${text}`);
    vrObjective.setAttribute('text', 'value', `Objective: ${text}`);
    playSound(newObjectiveSound);
    setTimeout(() => {
        objective.emit("hide");
        vrObjective.emit("hide");
        isDisabled = false;
    }, 5000);
}

document.addEventListener('keydown', (event) => {
    if (event.key == "o") {
        if (isDisabled) {
            console.warn("Objectives are disabled. You cannot set them... yet.");
            return;
        }
        if(debounce){
            return;
        }
        debounce = true;
        playSound(newObjectiveSound);
        objective.emit("show");
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key == "o") {
        if (isDisabled) {
            console.warn("Objectives are disabled. You cannot set them... yet.");
            return;
        }
        debounce = false;
        objective.emit("hide");
    }
});

export function finishObjective() {
    return new Promise((resolve) => {
        if (isDisabled) {
            console.warn("Objectives are disabled. You cannot set them... yet.");
            resolve();
            return;
        }

        haptics(leftHand, "objectiveFinished");
        isDisabled = true;
        objective.emit("show");
        vrObjective.emit("show");
        objective.setAttribute('text', 'color', '#00FF00');
        vrObjective.setAttribute('text', 'color', '#00FF00');
        playSound(objectiveClearedSound);

        setTimeout(() => {
            objective.emit("hide");
            vrObjective.emit("hide");
        }, 5000);

        setTimeout(() => {
            objective.setAttribute('text', 'value', 'No Objectives Yet');
            vrObjective.setAttribute('text', 'value', 'No Objectives Yet');
            objective.setAttribute('text', 'color', '#FFFFFF');
            vrObjective.setAttribute('text', 'color', '#FFFFFF');
            isDisabled = false;
            resolve();
        }, 6000);
    });
}


export function objectiveVR(action) {
    if (isDisabled) {
        console.warn("Objectives are disabled. You cannot set them... yet.");
        return;
    } else {
        if (action == true) {
            haptics(leftHand, "newObjective");
            vrObjective.emit("show");
        } else {
            vrObjective.emit("hide");
        }
    }
}