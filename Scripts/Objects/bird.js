import { setObjective } from "../Utils/objectives.js";

export async function handle(bird) {
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
}