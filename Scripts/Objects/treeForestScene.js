import { viewport } from "../Utils/cinematic.js";

export async function handle(object, animate) {

    let interval = 0;

    document.getElementById('tree').setAttribute('animation-mixer', 'clip: Grow; loop: once;');
    viewport("animate", { property: "position", from: "-15 5.325 23.632", to: "-15 5.325 22", dur: 4000, easing: "linear", camRotation: "6.29 172 0" });
    viewport("animate", { property: "position", from: "-15 5.325 22", to: "-14.29 5.325 18", dur: 2000, easing: "easeOutSine", camRotation: "6.29 172 0" });
    viewport("animate", { property: "position", from: "-14.29 5.325 18", to: "-14.29 5.325 17.9", dur: 1000, easing: "linear", camRotation: "6.29 172 0" });
    viewport("animate", { property: "position", from: "0 6 17.5", to: "-3 6.5 17", dur: 4000, easing: "linear", camRotation: "11.5 -101 0" });
    viewport("animate", { property: "rotation", from: "27 100 0", to: "27 72 0", dur: 6000, easing: "linear", camPosition: '-4.8 8.3 17' });
    viewport("animate", { property: "position", from: "-33.278 27.651 -18.211", to: "-32 27.651 -18.211", dur: 4000, easing: "easeOutSine", camRotation: '-8.2 -92 0', autoStop: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    document.querySelectorAll('.tree').forEach(tree => {
        interval += 250;
        setTimeout(() => {
            if (tree.id == 'tree') {
                return;
            }
            tree.setAttribute('animation-mixer', 'clip: Grow; loop: once;');
        }, interval);

        tree.addEventListener('animation-finished', () => {
            tree.setAttribute('animation-mixer', {
                clip: 'Idle',
                loop: 'repeat',
            });
        });
    });
}