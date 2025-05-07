const camera = document.getElementById("camera");
const rig = document.getElementById("rig");

let animationQueue = [];
let isAnimating = false;

function disableControls() {
    camera.components['look-controls'].pause();
    camera.components['nav-mesh-constrained'].pause();
    camera.setAttribute("walk", false);

    const rightHand = document.getElementById("right-hand");
    if (rightHand && rightHand.components['smooth-turn']) {
        rightHand.removeAttribute('smooth-turn');
    }
}

function enableControls() {
    camera.components['look-controls'].play();
    camera.components['nav-mesh-constrained'].play();
    camera.setAttribute("walk", true);

    const rightHand = document.getElementById("right-hand");
    if (rightHand && !rightHand.components['smooth-turn']) {
        rightHand.setAttribute('smooth-turn', 'target: #rig; reference: #camera; turnSpeed: 180');
    }
}

function stop(camPos) {
    rig.setAttribute('position', camPos);
    enableControls();
    rig.removeAttribute('animation');
    animationQueue = [];
    isAnimating = false;
}

export function viewport(action, options = {}) {
    const { property, from, to, dur, easing, autoStop = false, camPos } = options;

    if (action === "animate") {
        animationQueue.push({ property, from, to, dur, easing, autoStop, camPos });
        processQueue();
    } else if (action === "stop") {
        stop(camPos);
    }
}

function processQueue() {
    if (isAnimating || animationQueue.length === 0) return;

    isAnimating = true;
    const { property, from, to, dur, easing, autoStop, camPos } = animationQueue.shift();

    disableControls();

    rig.setAttribute('animation', {
        property,
        from,
        to,
        dur,
        easing
    });

    const onComplete = () => {
        rig.removeEventListener('animationcomplete', onComplete);
        isAnimating = false;

        if (autoStop && animationQueue.length === 0) {
            stop(camPos);
        } else {
            processQueue();
        }
    };

    rig.addEventListener('animationcomplete', onComplete);
}