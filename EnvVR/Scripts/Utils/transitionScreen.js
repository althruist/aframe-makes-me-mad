let isShown = true;

const videoTransition = document.getElementById("loading-video");
const sfxPlayer = document.getElementById("sfx-player");
const video = document.getElementById("spinningtree-video");

const scene = document.getElementById('scene');

const leftHand = document.getElementById('left-hand');
const rightHand = document.getElementById('right-hand');
const cursor = document.getElementById('cursor');

function hide() {
    if (scene.is('vr-mode')) {
        rightHand.setAttribute('raycaster', 'enabled', true);
        leftHand.setAttribute('raycaster', 'enabled', true);
    } else {
        cursor.setAttribute('raycaster', 'enabled', true)
    }

    videoTransition.emit("hide2");
    setTimeout(() => videoTransition.emit("hide1"), 1000);
    isShown = false;
    video.volume = 0;
};

function show() {
    if (scene.is('vr-mode')) {
        rightHand.setAttribute('raycaster', 'enabled', false);
        leftHand.setAttribute('raycaster', 'enabled', false);
    } else {
        cursor.setAttribute('raycaster', 'enabled', false)
    }

    videoTransition.emit("show1");
    setTimeout(() => videoTransition.emit("show2"), 1000);
    isShown = true;
    video.volume = 0.2;
};

export function transition(autoHide = true, time = 3) {
    time = time * 1000;
    if (!isShown) {
        show();
        if (autoHide) {
            setTimeout(() => hide(),
                time);
        }
    } else {
        hide();
    }
}