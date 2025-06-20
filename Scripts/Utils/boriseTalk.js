import { say } from "./voicelines.js";

export function boriseSay(message, priority = false) {
    say('MCAST', Math.floor(Math.random() * 6) + 1, priority, message);
};