const sfxPlayer = document.getElementById('sfx-player');
const musicPlayer = document.getElementById('music-player');
const objectivesPlayer = document.getElementById('objectives-player');

export function playSound(soundID, player) {
    let playerObj;
    if (player == "objectivesPlayer") {
        playerObj = objectivesPlayer;
    } else if (player == "sfxPlayer") {
        playerObj = sfxPlayer;
    }

    playerObj.setAttribute('sound', 'autoplay', false);
    playerObj.components.sound.stopSound();
    playerObj.setAttribute('sound', 'src', soundID);
    playerObj.components.sound.playSound();
};

export function setSong(src) {
    musicPlayer.components.sound.stopSound();
    musicPlayer.setAttribute('sound', 'src', src);
    musicPlayer.setAttribute('sound', 'volume', 0.1);
    musicPlayer.components.sound.playSound();
}

export function fade(direction) {
    if (direction == "in") {
        musicPlayer.emit("fadein");
    } else if (direction == "out") {
        musicPlayer.emit("fadeout");
    }
}