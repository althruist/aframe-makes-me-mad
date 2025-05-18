let isShown = true;

const videoTransition = document.getElementById("loadingVideo");
const sfxPlayer = document.getElementById("sfxPlayer");

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
    
    sfxPlayer.setAttribute('sound', 'loop', false);
    sfxPlayer.setAttribute('sound', 'volume', '1');
    sfxPlayer.components.sound.stopSound();

    videoTransition.emit("hide2");
    setTimeout(() => videoTransition.emit("hide1"), 1000);
    isShown = false;
};

function show() {
    if (scene.is('vr-mode')) {
        rightHand.setAttribute('raycaster', 'enabled', false);
        leftHand.setAttribute('raycaster', 'enabled', false);
    } else {
        cursor.setAttribute('raycaster', 'enabled', false)
    }

    sfxPlayer.setAttribute('sound', 'src', '#loading-sfx');
    sfxPlayer.setAttribute('sound', 'volume', '0.1');
    sfxPlayer.setAttribute('sound', 'loop', true);
    sfxPlayer.components.sound.playSound();

    videoTransition.emit("show1");
    setTimeout(() => videoTransition.emit("show2"), 1000);
    isShown = true;
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