import { setObjective } from "../Utils/objectives.js";

const bucket = document.getElementById("bucket");
let objectiveSent = false

export function handle(bird, pressedE) {
    bird.setAttribute('animation-mixer', 'clip', 'Tease');
    bird.setAttribute('animation-mixer', 'loop', 'once');
    bird.setAttribute('sound', {
        src: '',
        autoplay: false
    });
    bird.setAttribute('sound', {
        src: `#chirp${Math.floor(Math.random() * 5) + 1}-bird-sfx`,
        autoplay: false
    });
    bird.components.sound.playSound();

    bird.addEventListener('animation-finished', function () {
        bird.setAttribute('animation-mixer', 'clip', 'Idle');
        bird.setAttribute('animation-mixer', 'loop', 'repeat');
    });

    if (pressedE) { return; };
    if (objectiveSent) { return; };
    objectiveSent = true;
    setObjective("Collect the Bucket", false);
    bucket.setAttribute('position', '-71 14.565 23.076');
    bucket.setAttribute('marker', true);
}