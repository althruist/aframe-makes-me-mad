function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    AFRAME.scenes[0].enterVR();
    document.getElementById('spinningtree-video').play();
    document.getElementById('spinningtree-video').volume = '0.2';
}