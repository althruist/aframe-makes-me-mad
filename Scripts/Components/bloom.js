/* global THREE */
import AFRAME from 'aframe';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

AFRAME.registerComponent('bloom', {
  schema: {
    enabled: { type: 'boolean', default: true },
    threshold: { type: 'number', default: 1 },
    strength: { type: 'number', default: 0.5 },
    radius: { type: 'number', default: 1 }
  },

  init: function () {
    this.size = new THREE.Vector2();
    this.scene = this.el.object3D;
    this.renderer = this.el.renderer;
    this.originalRender = this.el.renderer.render;
    this._bound = false;

    if (this.data.enabled) {
      this._setupComposer();
    }
  },

  update: function (oldData) {
    const data = this.data;

    // If enabled toggled
    if (oldData.enabled !== data.enabled) {
      if (data.enabled) {
        this._setupComposer();
      } else {
        this._disableComposer();
      }
      return;
    }

    // If any bloom params changed, rebuild composer
    if (
      data.enabled &&
      (
        oldData.threshold !== data.threshold ||
        oldData.strength !== data.strength ||
        oldData.radius !== data.radius
      )
    ) {
      this._setupComposer();
    }
  },

  _setupComposer: function () {
    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }

    const renderer = this.renderer;
    const resolution = renderer.getDrawingBufferSize(new THREE.Vector2());

    const renderTarget = new THREE.WebGLRenderTarget(resolution.width, resolution.height, {
      type: THREE.HalfFloatType,
      samples: 8,
    });

    this.composer = new EffectComposer(renderer, renderTarget);

    if (!this.renderPass) {
      this.renderPass = new RenderPass(this.scene, this.el.camera);
    }
    this.composer.addPass(this.renderPass);

    if (this.bloomPass) {
      this.bloomPass.dispose();
    }
    this.bloomPass = new UnrealBloomPass(
      resolution,
      this.data.strength,
      this.data.radius,
      this.data.threshold
    );
    this.composer.addPass(this.bloomPass);

    if (this.outputPass) {
      this.outputPass.dispose();
    }
    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);

    this._bindRenderer();
  },

  _bindRenderer: function () {
    if (this._bound) return;
    this._bound = true;

    const self = this;
    let insideRender = false;

    this.el.renderer.render = function () {
      if (insideRender) {
        self.originalRender.apply(this, arguments);
      } else {
        insideRender = true;
        self.renderPass.camera = self.el.camera;
        self.composer.render();
        insideRender = false;
      }
    };
  },

  _disableComposer: function () {
    this.el.renderer.render = this.originalRender;
    if (this.composer) {
      this.composer.dispose();
      this.composer = null;
    }
  },

  events: {
    rendererresize: function () {
      if (!this.composer) return;
      this.renderer.getSize(this.size);
      this.composer.setSize(this.size.width, this.size.height);
    }
  },

  remove: function () {
    this._disableComposer();

    if (this.bloomPass) {
      this.bloomPass.dispose();
      this.bloomPass = null;
    }
    if (this.outputPass) {
      this.outputPass.dispose();
      this.outputPass = null;
    }
    if (this.renderPass) {
      this.renderPass = null;
    }
  }
});
