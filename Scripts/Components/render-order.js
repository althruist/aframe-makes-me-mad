AFRAME.registerComponent('render-order', {
    schema: { type: 'int', default: 0 },

    init: function () {
        this.el.addEventListener('object3dset', () => {
            this.setRenderOrder();
        });
    },

    update: function () {
        this.setRenderOrder();
    },

    setRenderOrder: function () {
        const object3D = this.el.object3D;
        object3D.traverse((child) => {
            if (child.renderOrder !== undefined) {
                child.renderOrder = this.data;
                child.material && (child.material.depthTest = false);
            }
        });
    }
});