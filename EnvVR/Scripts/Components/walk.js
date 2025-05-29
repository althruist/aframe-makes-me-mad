let canWalk = false;
let isWalking = false;

const keysPressed = new Set();
const movementKeys = new Set(['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

const leftHand = document.getElementById('left-hand');
const footstepsPlayer = document.getElementById('footsteps-player');

AFRAME.registerComponent('walk', {
    schema: { type: 'boolean', default: true },

    update: function (oldData) {
        if (oldData !== this.data) {
            if (this.data) {
                canWalk = true;
                camera.setAttribute('wasd-controls', 'enabled', true);
                leftHand.setAttribute('smooth-locomotion', 'target: #rig; reference: #camera');
            } else {
                canWalk = false;
                camera.setAttribute('wasd-controls', 'enabled', false);
                leftHand.removeAttribute('smooth-locomotion');
            }
        }
    }
});

document.addEventListener('keydown', (event) => {
    if (!canWalk) return;
    if (movementKeys.has(event.key)) {
        keysPressed.add(event.key);
        if (keysPressed.size > 0 && !isWalking) {
            footstepsPlayer.components.sound.playSound();
            isWalking = true;
            camera.emit('walkAnim');
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (!canWalk) return;
    if (movementKeys.has(event.key)) {
        keysPressed.delete(event.key);
        if (keysPressed.size === 0) {
            footstepsPlayer.components.sound.stopSound();
            isWalking = false;
            camera.emit('stopAnim');
        }
    }
});