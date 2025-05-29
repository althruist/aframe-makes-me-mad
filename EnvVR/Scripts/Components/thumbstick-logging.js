const footstepsPlayer = document.getElementById('footsteps-player');
let isWalking = false;

AFRAME.registerComponent('thumbstick-logging', {
    init: function () {
        this.el.addEventListener('thumbstickmoved', this.logThumbstick);
    },
    logThumbstick: function (evt) {
        if (camera.getAttribute("walk") == false) return;

        const x = evt.detail.x;
        const y = evt.detail.y;
        const deadzone = 0.1;

        if (Math.abs(x) > deadzone || Math.abs(y) > deadzone) {
            if (!isWalking) {
                footstepsPlayer.components.sound.playSound();
                isWalking = true;
            }
        } else {
            footstepsPlayer.components.sound.stopSound();
            isWalking = false;
        }
    }
});