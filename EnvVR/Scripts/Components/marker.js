AFRAME.registerComponent('marker', {
    schema: { type: 'boolean', default: false },

    init: function () {
        this.markerId = 'marker';
        this.markerEl = null;

        const assets = document.querySelector('a-assets');
        if (assets.hasLoaded) {
            this.updateMarker();
        } else {
            assets.addEventListener('loaded', () => this.updateMarker());
        }
    },

    update: function () {
        this.updateMarker();
    },

    updateMarker: function () {
        const template = document.getElementById('marker');

        const existing = this.el.querySelector(`#marker`);
        if (existing) {
            existing.remove();
        };

        if (this.data) {
            const markerClone = template.firstElementChild.cloneNode(true);
            markerClone.setAttribute('id', this.markerId);
            markerClone.setAttribute('position', '0 1 0');
            this.el.appendChild(markerClone);
            markerClone.setAttribute('animation', 'property: position; to: 0 1.2 0; dur: 500; dir: alternate; loop: true; easing: easeInOutSine;');
        }
    }
});
