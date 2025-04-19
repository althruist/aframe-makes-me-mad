const scene = document.querySelector('a-scene');
const text = document.getElementById('subtitles');
const box = document.getElementById('box');
const cursor = document.getElementById('cursor');

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

box.addEventListener('click', () => {
    box.setAttribute('color', '#FF0000');
});

box.addEventListener('mouseenter', () => {
    box.setAttribute('color', '#00FF00');
});

box.addEventListener('mouseleave', () => {
    box.setAttribute('color', '#0000FF');
});