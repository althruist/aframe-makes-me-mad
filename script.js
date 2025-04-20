const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
const interactables = document.querySelectorAll('.interactable');
const cursor = document.getElementById('cursor');
const leftHand = document.getElementById('left-hand');
const rightHand = document.getElementById('right-hand');

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
    object.addEventListener('click', () => {
        object.setAttribute('color', '#FF0000');
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
        startEvents: 'mouseenter'
    });

    object.setAttribute('animation__leave', {
        property: 'material.emissiveIntensity',
        to: 0,
        dur: 200,
        easing: 'easeInOutSine',
        startEvents: 'mouseleave'
    });

    const originalColour = object.getAttribute('color');
    const animation = object.components.animation__hover;

    object.setAttribute('material', 'emissive', originalColour);
    object.setAttribute('material', 'emissiveIntensity', 0);

    object.addEventListener('mouseenter', () => {
        animation.play();
        text.setAttribute('value', `${object.id} hovered!`);
    });

    object.addEventListener('mouseleave', () => {
        animation.pause();
        text.setAttribute('value', `${object.id} left!`);
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