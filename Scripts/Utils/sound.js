const sfxPlayer = document.getElementById('sfxPlayer');
const musicPlayer = document.getElementById('musicPlayer');

export function playSound(soundID) {
    sfxPlayer.setAttribute('sound', 'autoplay', false);
    sfxPlayer.components.sound.stopSound();
    sfxPlayer.setAttribute('sound', `src: ${soundID}`);
    sfxPlayer.components.sound.playSound();
};

export function setSong(src){
    musicPlayer.components.sound.stopSound();
    musicPlayer.setAttribute('sound', 'src', src);
    musicPlayer.setAttribute('sound', 'volume', 0.1);
    musicPlayer.components.sound.playSound();
}

export function fade(direction){
    if(direction == "in"){
        musicPlayer.emit("fadein");
    } else if (direction == "out"){
        musicPlayer.emit("fadeout");
    }
}