const subtitle = document.getElementById('subtitles');

export async function setSubtitle(text, autoHide = true, time = 5) {
    time = time * 1000;
    if (subtitle.getAttribute('text').opacity == 0) {
        console.log("Subtitles weren't visible, made them automatically visible.");
        subtitleVisibility(true);
    }

    subtitle.setAttribute('value', text);

    if (autoHide) {
        await new Promise(resolve => setTimeout(resolve, time));
        subtitleVisibility(false);
    } else if ((!autoHide) && time != 0) {
        await new Promise(resolve => setTimeout(resolve, time));
    };
}

export function subtitleVisibility(visible) {
    if (visible) {
        subtitle.emit("show");
    } else if (!visible) {
        subtitle.emit("hide");
    } else {
        console.warn("subtitleVisibility is used but no argument was given.");
    }
}