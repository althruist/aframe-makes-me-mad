export function handle(turtle, pressedE) {
    turtle.setAttribute('animation-mixer', 'clip', 'Tease');
    turtle.setAttribute('animation-mixer', 'loop', 'once');
    turtle.setAttribute('sound', {
        src: '',
        autoplay: false
    });
    turtle.setAttribute('sound', {
        src: `#turtle${Math.floor(Math.random() * 5) + 1}-sfx`,
        autoplay: false
    });
    turtle.components.sound.playSound();

    turtle.addEventListener('animation-finished', function () {
        turtle.setAttribute('animation-mixer', 'clip', 'Swim');
        turtle.setAttribute('animation-mixer', 'loop', 'repeat');
    });
}