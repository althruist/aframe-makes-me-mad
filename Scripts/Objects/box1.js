import { viewport } from '../Utils/cinematic.js';
import { setObjective } from '../Utils/objectives.js';

export async function handle() {
    viewport("animate", { property: "position", from: "10 50 10", to: "-50 50 -50", dur: 5000, easing: "linear", camRotation: "-90 0 0"});
    viewport("animate", { property: "position", from: "10 100 10", to: "50 100 10", dur: 5000, easing: "easeOutCirc", autoStop: true, camRotation: "0 0 0", camPosition: "0 50 0" });
    setObjective("you pressed it!");
}