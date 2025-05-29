AFRAME.registerComponent('fog-controller', {
  schema: {
    density: { type: 'number', default: 0.1 },
    far: { type: 'number', default: 250 },
    color: { type: 'color', default: '#AAA' }
  },

  init: function () {
    this.updateFog();
  },

  updateFog: function () {
    this.el.sceneEl.setAttribute('fog', {
      density: this.data.density,
      far: this.data.far,
      color: this.data.color
    });
  },

  update: function () {
    this.updateFog();
  }
});


AFRAME.registerComponent('disable-fog', {
  init: function () {
    this.el.addEventListener('model-loaded', (evt) => {
      const model = evt.detail.model;
      model.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.fog = false;
          node.material.needsUpdate = true; 
        }
      });
    });
  }
});