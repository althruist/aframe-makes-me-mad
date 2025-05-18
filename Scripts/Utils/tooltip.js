const tooltip = document.getElementById('tooltip');

export async function setTooltip(text, autoHide = true, time = 5) {
    time = time * 1000;
    if (tooltip.getAttribute('text').opacity == 0) {
        console.log("Tooltip wasn't visible, made it automatically visible.");
        tooltipVisibility(true);
    }

    tooltip.setAttribute('value', text);

    if (autoHide) {
        await new Promise(resolve => setTimeout(resolve, time));
        tooltipVisibility(false);
    } else if ((!autoHide) && time != 0) {
        await new Promise(resolve => setTimeout(resolve, time));
    };
}

export function tooltipVisibility(visible) {
    if (visible) {
        tooltip.emit("show");
    } else if (!visible) {
        tooltip.emit("hide");
    } else {
        console.warn("tooltipVisibility is used but no argument was given.");
    }
}