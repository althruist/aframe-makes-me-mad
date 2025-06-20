function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    // if (scene.is('vr-mode')) {
    //     setTooltip("Press 'Y' to Taunt / Left Trigger to Get Information", false);
    //     return;
    // }
    if (!AFRAME.utils.device.isMobile()) {
        navigator.xr?.isSessionSupported('immersive-vr').then((supported) => {
            if (supported) {
                document.querySelector('a-scene').enterVR();
            }
        });
    }
}