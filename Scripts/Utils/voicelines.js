import { setSubtitle, subtitleVisibility } from "./subtitles.js";

const voicelinesPlayer = document.getElementById('voice-player');
const borise = document.getElementById("borise");
const camera = document.getElementById("camera");

let queue = [];
let isPlaying = false;
let currentTimeout = null;

export function say(scene, number, priority = false, message) {
    const request = { scene, number, message };

    if (priority) {
        if (voicelinesPlayer.components.sound.isPlaying) {
            voicelinesPlayer.components.sound.stopSound();
        }
        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }
        queue = [];

        queue.unshift(request);
        isPlaying = false;
        playNextInQueue();
    } else {
        queue.push(request);
        console.log(`queued voiceline ${scene}, ${number}`);
        if (!isPlaying) {
            playNextInQueue();
        }
    }
}

function playNextInQueue() {
    if (queue.length === 0) {
        subtitleVisibility(false);
        isPlaying = false;
        camera.setAttribute("walk", true);
        return;
    }

    const { scene, number, message } = queue.shift();
    isPlaying = true;
    camera.setAttribute("walk", false);

    const audioPath = getAudioPath(scene, number);
    const tempAudio = new Audio(audioPath);

    tempAudio.addEventListener('loadedmetadata', () => {
        const duration = tempAudio.duration * 1000;

        if (scene === "MCAST") {
            borise.setAttribute('animation-mixer', 'clip: Talk');
            borise.setAttribute('sound', 'src', audioPath);
            borise.components.sound.playSound();
        } else {
            voicelinesPlayer.setAttribute('sound', 'src', audioPath);
            voicelinesPlayer.components.sound.playSound();
        }

        setSubtitle(message, { autoHide: false, skippable: false });

        currentTimeout = setTimeout(() => {
            isPlaying = false;
            playNextInQueue();
            if (scene === "MCAST") {
                borise.setAttribute('animation-mixer', 'clip: Idle');
            }
            voicelinesPlayer.emit("voicelinefinished");
        }, duration);
    });
}

function getAudioPath(scene, number) {
    if (scene === 'MCAST') {
        return `Sound/Voicelines/MCASTScene/Speak${number}.mp3`;
    }
}
