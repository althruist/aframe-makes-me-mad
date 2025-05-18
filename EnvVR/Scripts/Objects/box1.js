import { viewport } from '../Utils/cinematic.js';
import { setObjective } from '../Utils/objectives.js';

export async function handle() {
    viewport("animate", { property: "position", from: "10 10 10", to: "50 50 50", dur: 5000, easing: "linear" });
    viewport("animate", { property: "position", from: "10 10 10", to: "50 10 10", dur: 5000, easing: "easeOutCirc", autoStop: true, camPos: "0 0 0" });
    setObjective("you pressed it!");
}