AFRAME.registerComponent('nav-offset-animator', {
    schema: { type: 'vec3', default: { x: 0, y: 1.6, z: 0 } },
    update() {
        const nav = this.el.components['nav-mesh-constrained'];
        if (nav) {
            nav.data.offset = this.data;
        }
    }
});