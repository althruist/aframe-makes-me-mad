let debounce = false;

export function handle(object) {
    if (debounce) {
        return;
    }

    debounce = true;

    const existingPlane = object.querySelector('#info-panel');
    if (existingPlane) {
        const imageEntity = existingPlane.querySelector('#info-content');

        existingPlane.setAttribute('animation__out1', 'property: position; to: 2 -1 1; dur: 500; loop: false; easing: easeOutSine;');

        imageEntity.setAttribute('animation__out2', 'property: material.opacity; to: 0; dur: 250; loop: false; easing: easeOutSine;');
        imageEntity.setAttribute('animation__out3', 'property: scale; to: 0 0 0; dur: 750; loop: false; easing: easeOutSine');

        existingPlane.addEventListener('animationcomplete__out1', () => {
            existingPlane.remove();
        });
        return;
    }

    const template = document.getElementById('info-panel');
    const planeEntity = template.cloneNode(true);
    const imageEntity = planeEntity.querySelector('#info-content');
    object.appendChild(planeEntity);

    planeEntity.setAttribute('animation__in1', 'property: position; to: 2 0.5 1; dur: 500; loop: false; easing: easeOutCirc;')
    planeEntity.setAttribute('sound', {
        src: '#openpanel-sfx',
        autoplay: 'true',
        volume: 5
    });
    imageEntity.setAttribute('animation__in2', 'property: material.opacity; to: 1; dur: 500; loop: false; easing: easeOutCirc;')
    imageEntity.setAttribute('animation__in3', 'property: scale; to: 1 1 1; dur: 750; loop: false; easing: easeOutCirc;')

    if (object.id == "bird") {
        imageEntity.setAttribute('material', 'src: #bird-panel;')
    } else if (object.id == "deer2") {
        imageEntity.setAttribute('material', 'src: #deer-panel;')
    } else if (object.id == "turtle") {
        imageEntity.setAttribute('material', 'src: #turtle-panel;')
    } else if (object.id == "fish") {
        imageEntity.setAttribute('material', 'src: #fish-panel;')
    } else if (object.id == "coral") {
        imageEntity.setAttribute('material', 'src: #coral-panel;')
    }

    planeEntity.addEventListener('animationcomplete', () => {
        planeEntity.setAttribute('animation', 'property: position; to: 2 0.2 1; dur: 5000; dir: alternate; loop: true; easing: easeInOutSine;')
        debounce = false;
    })
    object.appendChild(planeEntity);
}