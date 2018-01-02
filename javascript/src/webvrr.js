// @flow
import document from './global/document';
import window from './global/window';
import navigator from './global/navigator';

import HTMLWidgets from './global/htmlwidgets';
import THREE from './global/three';
import WebVRPolyfill from './global/webvrpolyfill';
import webvrui from './global/webvrui';
import Math from './global/math';

import wireframe from './wireframe';

// backwards compatibility with old versions of webvr-polyfill
// lots of API breaking changes across versions...
const polyfill = (typeof WebVRPolyfill === 'function') ?
  new WebVRPolyfill({}) :
  { enable() {} };
polyfill.enable();

HTMLWidgets.widget({
  name: 'webvrr',
  type: 'output',
  factory(el, width, height) {
    let vrButton;
    let geometry;
    let material;
    let skybox;
    let texture;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

    const controls = new THREE.VRControls(camera);
    controls.standing = true;
    camera.position.y = controls.userHeight;

    const effect = new THREE.VREffect(renderer);
    effect.setSize(width, height);

    let lastRenderTime = 0;

    function animateFactory(vrDisplay) {
      const callbacks = [];
      return (timestamp) => {
        const delta = Math.min(timestamp - lastRenderTime, 500);
        lastRenderTime = timestamp;
        if (vrButton.isPresenting()) {
          controls.update();
        }
        callbacks.map(cb => cb(delta));
        effect.render(scene, camera);
        const animate = animateFactory(vrDisplay);
        vrDisplay.requestAnimationFrame(animate);
      };
    }

    navigator.getVRDisplays().then((displays) => {
      if (displays.length > 0) {
        const vrDisplay = displays[0];
        const animate = animateFactory(vrDisplay);
        vrDisplay.requestAnimationFrame(animate);
      }
    });

    const onResize = (e) => {
      if (e && e.vrDisplay && e.vrDisplay.isPresenting) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } else {
        effect.setSize(el.innerWidth, el.innerHeight);
        camera.aspect = el.innerWidth / el.innerHeight;
        camera.updateProjectionMatrix();
      }
    };

    const uiOptions = {
      color: 'black',
      background: 'white',
      corners: 'square',
    };

    vrButton = new webvrui.EnterVRButton(renderer.domElement, uiOptions);

    const uiContainer = document.createElement('div');
    uiContainer.className = 'vr-ui-container';

    const vrButtonContainer = document.createElement('div');
    vrButtonContainer.id = 'vr-button';
    vrButtonContainer.className = 'vr-button-container';
    vrButtonContainer.appendChild(vrButton.domElement);
    uiContainer.appendChild(vrButtonContainer);

    const vrForceContainer = document.createElement('div');
    vrForceContainer.id = 'vr-force';
    vrForceContainer.className = 'vr-force-container';
    const vrForceLink = document.createElement('a');
    vrForceLink.href = '#';
    vrForceLink.innerText = 'Click Here To Try With A Browser';
    vrForceLink.addEventListener('click', () => {
      vrButton.requestEnterFullscreen().then(() => {
        onResize({ vrDisplay: { isPresenting: true }});
      });
    });
    vrForceContainer.appendChild(vrForceLink);
    uiContainer.appendChild(vrForceContainer);

    el.appendChild(uiContainer);

    window.addEventListener('vrdisplaypresentchange', onResize, true);

    return {
      resize(newWidth, newHeight) {
        effect.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      },
      renderValue(x) {
        texture = new THREE.TextureLoader().load(wireframe);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(20, 20);
        geometry = new THREE.SphereGeometry(30, 32, 32);
        geometry.scale(-1, 1, 1);
        material = new THREE.MeshBasicMaterial({
          map: texture,
        });
        skybox = new THREE.Mesh(geometry, material);
        // skybox.position.y = 30 / 2;
        scene.add(skybox);
        if (x) {
          if (x.sphere) {
            material.map = new THREE.TextureLoader().load(x.sphere);
          }
        }
      },
    };
  },
});
