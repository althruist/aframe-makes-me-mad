const videoTransition = document.getElementById("loadingVideo");
let isShown = true;

function hide() {
    videoTransition.emit("hide2");
    setTimeout(() => videoTransition.emit("hide1"), 1000);
    isShown = false;
};

function show() {
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