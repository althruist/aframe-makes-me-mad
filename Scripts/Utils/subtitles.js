const subtitle = document.getElementById('subtitles');
const subtitleSkip = document.getElementById('subtitles-skip');
const leftHand = document.getElementById('left-hand');

let skipHandler;

export async function setSubtitle(text, { autoHide = true, time = 5, skippable = false } = {}) {
    if (scene.is('vr-mode')) {
        subtitleSkip.setAttribute("text", "value", "Press Left Trigger to Skip");
        subtitleSkip.setAttribute('position', '0 -0.5 -2');
        subtitle.setAttribute('position', '0 -0.4 -2');
    }

    time = time * 1000;

    if (subtitle.getAttribute('text').opacity == 0) {
        console.log("Subtitles weren't visible, made them automatically visible.");
        subtitleVisibility(true);
    }

    subtitle.setAttribute('value', text);

    let skip = false;
    let timeoutId;

    if (skippable) {
        skipHandler = () => {
            subtitle.emit("skipped");
            skip = true;
            subtitleSkip.emit("hide");
            subtitleVisibility(false);
            removeSkipListener();
        };
        subtitleSkip.emit("show");
        addSkipListener(skipHandler);
    }

    if (autoHide && time !== 0) {
        await new Promise(resolve => {
            timeoutId = setTimeout(() => {
                if (!skip) {
                    subtitleVisibility(false);
                    removeSkipListener();
                }
                resolve();
            }, time);
        });
    }
}

function addSkipListener(handler) {
    window.addEventListener('click', handler);
    if (leftHand) {
        leftHand.addEventListener('triggerdown', handler);
    }
}

function removeSkipListener() {
    if (skipHandler) {
        window.removeEventListener('click', skipHandler);

        if (leftHand) {
            leftHand.removeEventListener('triggerdown', skipHandler);
        }

        skipHandler = null;
    }
}

export function subtitleVisibility(visible) {
    if (visible) {
        subtitle.emit("show");
    } else if (!visible) {
        subtitle.emit("hide");
    } else {
        console.warn("subtitleVisibility is used but no argument was given.");
    }
};