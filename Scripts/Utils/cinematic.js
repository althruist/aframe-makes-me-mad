let animationQueue = [];
let isAnimating = false;

const rig = document.getElementById("rig");
const camera = document.getElementById("camera");
const cinematicCamera = document.getElementById("cinematic-camera");

function disableControls() {
    camera.components['look-controls']?.pause();
    camera.components['nav-mesh-constrained']?.pause();
    camera.setAttribute("walk", false);

    const rightHand = document.getElementById("right-hand");
    if (rightHand && rightHand.components['smooth-turn']) {
        rightHand.removeAttribute('smooth-turn');
    }
}

function enableControls() {
    camera.components['look-controls']?.play();
    camera.components['nav-mesh-constrained']?.play();
    camera.setAttribute("walk", true);

    const rightHand = document.getElementById("right-hand");
    if (rightHand && !rightHand.components['smooth-turn']) {
        rightHand.setAttribute('smooth-turn', 'target: #rig; reference: #camera; turnSpeed: 180');
    }
}

function switchCamera(cam) {
    if (cam == 'cinematic') {
        camera.setAttribute("camera", "active", false);
        cinematicCamera.setAttribute("camera", "active", true);
        disableControls();
    } else if (cam == 'game') {
        cinematicCamera.setAttribute("camera", "active", false);
        camera.setAttribute("camera", "active", true);
        enableControls();
    }
}


function stop(camPosition) {
    cinematicCamera.setAttribute('rotation', "0 0 0");
    cinematicCamera.setAttribute('position', camPosition);
    switchCamera('game');
    cinematicCamera.removeAttribute('animation');
    animationQueue = [];
    isAnimating = false;
}

export function viewport(action, options = {}) {
    const { property, from, to, dur, easing, autoStop = false, camPosition, camRotation } = options;

    if (action === "animate") {
        animationQueue.push({ property, from, to, dur, easing, autoStop, camPosition, camRotation });
        processQueue();
    } else if (action === "stop") {
        stop(camPosition);
    }
}

function processQueue() {
    if (isAnimating || animationQueue.length === 0) return;

    isAnimating = true;
    const { property, from, to, dur, easing, autoStop, camPosition, camRotation } = animationQueue.shift();

    switchCamera('cinematic');
    cinematicCamera.setAttribute('rotation', camRotation);
    cinematicCamera.setAttribute('animation', {
        property,
        from,
        to,
        dur,
        easing
    });

    const onComplete = () => {
        cinematicCamera.removeEventListener('animationcomplete', onComplete);
        isAnimating = false;

        if (autoStop && animationQueue.length === 0) {
            stop(camPosition);
        } else {
            processQueue();
        }
    };

    cinematicCamera.addEventListener('animationcomplete', onComplete);
}
