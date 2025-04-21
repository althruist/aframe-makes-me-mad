const voicelinesPlayer = document.getElementById('voicePlayer');

export function say(scene, number){
    if(scene == 'Test'){
        voicelinesPlayer.setAttribute('sound', 'src', `Sound/Voicelines/TestScene/${number}.mp3`);
        voicelinesPlayer.components.sound.playSound();
    }
}