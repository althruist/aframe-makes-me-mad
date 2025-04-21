const cursor = document.getElementById('cursor');
const sfxPlayer = document.getElementById('sfxPlayer');

// Gameplay Elements
const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
const interactables = document.querySelectorAll('.interactable');

// VR Controllers
const leftHand = document.getElementById('left-hand');
const rightHand = document.getElementById('right-hand');

// Sounds
const hoverSound = '#hover-sfx';
const clickSound = '#click-sfx';
const blockSound = '#block-sfx';

//Runtime Stuff
let clickDebounce = false;

const playSound = (soundID) => {
    sfxPlayer.setAttribute('sound', 'autoplay', false);
    sfxPlayer.components.sound.stopSound();
    sfxPlayer.setAttribute('sound', `src: ${soundID}`);
    sfxPlayer.components.sound.playSound();
};

scene.addEventListener('enter-vr', () => {
    text.setAttribute('position', "0.06211 -0.4 -2");
    cursor.setAttribute('visible', 'false');
    cursor.setAttribute('raycaster', 'enabled: false');
});

scene.addEventListener('exit-vr', () => {
    text.setAttribute('position', '0.06211 -1 -1.20656');
    cursor.setAttribute('visible', 'true');
    cursor.setAttribute('raycaster', 'enabled: true');
});

interactables.forEach(object => {
    object.addEventListener('click', async (e) => {
        if (e.detail && !cursor.getAttribute('raycaster').enabled) {
            playSound(blockSound);
            return;
        } else {
            const logicId = object.getAttribute('data-logic');
            clickDebounce = true;

            try {
                const targetLogic = await import(`./Objects/${logicId}.js`);
                if (targetLogic?.handle) {
                    targetLogic.handle(object);
                } else {
                    console.warn(`No 'handle' function found in ${logicId}.js`);
                }
            } catch (err) {
                console.error(`Failed to load logic for object '${logicId}':`, err);
            }

            playSound(clickSound);

            setTimeout(() => {
                clickDebounce = false;
            }, 300);
        }
    })
});

interactables.forEach(object => {
    object.setAttribute('animation__hover', {
        property: 'material.emissiveIntensity',
        to: 1,
        dur: 500,
        dir: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        startEvents: 'enter',
        pauseEvents: 'leave, click',
        resumeEvents: 'enter'
    });

    object.setAttribute('animation__leave', {
        property: 'material.emissiveIntensity',
        to: 0,
        dur: 200,
        easing: 'easeInOutSine',
        startEvents: 'leave, click'
    });

    const originalColour = object.getAttribute('color');

    object.setAttribute('material', 'emissive', originalColour);
    object.setAttribute('material', 'emissiveIntensity', 0);

    object.addEventListener('mouseenter', (e) => {
        if (e.detail.cursorEl == rightHand) {
            rightHand.setAttribute('raycaster', 'lineColor', '#FF0000');
            return;
        } else {
            object.emit('enter');
            playSound(hoverSound);
        };
    });

    object.addEventListener('mouseleave', (e) => {
        if (clickDebounce) return;
        if (e.detail.cursorEl == rightHand) {
            rightHand.setAttribute('raycaster', 'lineColor', '#e5f5a9');
        } else {
            object.emit('leave');
        };
    });
});

cursor.addEventListener('animationcomplete__click', function () {
    const clickedObj = cursor.components.raycaster.intersectedEls[0];
    cursor.emit("reset");
    clickedObj.classList.toggle('interactable');
});

leftHand.addEventListener('triggerdown', function () {
    const clickedObj = leftHand.components.raycaster.intersectedEls[0];
    if (clickedObj && clickedObj.classList) {
        clickedObj.classList.toggle('interactable');
        clickedObj.emit("click");
    }
});