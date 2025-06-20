let objectiveQueue = [];
let processing = false;
let isDisabled = false;
let debounce = false;
let paused = false;

const objective = document.getElementById("objective");
const vrObjective = document.getElementById("vrObjective");

const leftHand = document.getElementById('left-hand');

const objectiveClearedSound = '#objectivecleared-sfx';
const newObjectiveSound = '#newobjective-sfx';

import { haptics } from "./haptics.js";
import { playSound } from "./sound.js";

function enqueue(action) {
    objectiveQueue.push(action);
    processQueue();
}

export function setObjective(text, edit = false) {
    enqueue({ type: "set", text, edit });
}

export function finishObjective() {
    enqueue({ type: "finish" });
}

export function pauseObjectives() {
    paused = true;
}

export function resumeObjectives() {
    if (!paused) return;
    paused = false;
    processQueue();
}

async function processQueue() {
    if (processing || isDisabled || paused || objectiveQueue.length === 0) return;

    const action = objectiveQueue.shift();
    processing = true;

    if (action.type === "set") {
        if (objective.getAttribute('text', 'value').value !== "No Objectives Yet" && !action.edit) {
            await executeFinishObjective();
        }
        await executeSetObjective(action.text, action.edit);
    }

    if (action.type === "finish") {
        await executeFinishObjective();
    }

    processing = false;
    processQueue();
}

function executeSetObjective(text, edit) {
    return new Promise((resolve) => {
        if (edit) {
            objective.emit("show");
            vrObjective.emit("show");
            objective.setAttribute('text', 'value', `Objective: ${text}`);
            vrObjective.setAttribute('text', 'value', `Objective: ${text}`);
            haptics(leftHand, "hover");

            setTimeout(() => {
                objective.emit("hide");
                vrObjective.emit("hide");
                resolve();
            }, 2000);
        } else {
            isDisabled = true;
            haptics(leftHand, "newObjective");
            objective.emit("show");
            vrObjective.emit("show");
            objective.setAttribute('text', 'value', `Objective: ${text}`);
            vrObjective.setAttribute('text', 'value', `Objective: ${text}`);
            playSound(newObjectiveSound, "objectivesPlayer");

            setTimeout(() => {
                objective.emit("hide");
                vrObjective.emit("hide");
                isDisabled = false;
                resolve();
            }, 5000);
        }
    });
}

function executeFinishObjective() {
    return new Promise((resolve) => {
        isDisabled = true;
        haptics(leftHand, "objectiveFinished");

        objective.emit("show");
        vrObjective.emit("show");

        objective.setAttribute('text', 'color', '#00FF00');
        vrObjective.setAttribute('text', 'color', '#00FF00');
        playSound(objectiveClearedSound, "objectivesPlayer");

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
    }

    if (action === true) {
        haptics(leftHand, "newObjective");
        vrObjective.emit("show");
        playSound(newObjectiveSound, "objectivesPlayer");
    } else {
        vrObjective.emit("hide");
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === "o") {
        if (isDisabled || debounce) return;

        debounce = true;
        playSound(newObjectiveSound, "objectivesPlayer");
        objective.emit("show");
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === "o") {
        if (isDisabled) return;

        debounce = false;
        objective.emit("hide");
    }
});