const voicelinesPlayer = document.getElementById('voicePlayer');

let queue = [];
let isPlaying = false;

export function say(scene, number) {
    queue.push({ scene, number });
    console.log(`queued voiceline ${scene, number}`);

    if (!isPlaying) {
        playNextInQueue();
    }
}

function playNextInQueue() {
    if (queue.length === 0) {
        isPlaying = false;
        return;
    }

    const { scene, number } = queue.shift();
    isPlaying = true;

    console.log(`playing: ${scene, number}`);

    if (scene === 'Test') {
        voicelinesPlayer.setAttribute('sound', 'src', `Sound/Voicelines/TestScene/${number}.mp3`);
        voicelinesPlayer.components.sound.playSound();
    }
}

voicelinesPlayer.addEventListener('sound-ended', () => {
    isPlaying = false;
    playNextInQueue();
});
