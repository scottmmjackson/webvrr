/* eslint-disable no-param-reassign,no-undef */
// @flow

import document from './global/document';
import window from './global/window';
import navigator from './global/navigator';

import HTMLWidgets from './global/htmlwidgets';
import THREE from './global/three';
import WebVRPolyfill from './global/webvrpolyfill';
import webvrui from './global/webvrui';
import Math from './global/math';
import target from './target';
import wireframe from './wireframe';

// backwards compatibility with old versions of webvr-polyfill
// lots of API breaking changes across versions...
const polyfill = (typeof WebVRPolyfill === 'function') ?
  new WebVRPolyfill({}) :
  {
    enable() {
    },
  };
polyfill.enable();

type Scene = {
  add: ({}) => void;
  background: {},
}

type Camera = {
  aspect: number,
  updateProjectionMatrix: () => void,
}

type Effect = {
  render: (Scene, Camera) => void,
  setSize: (number, number) => void,
}

type AnimateFactoryOptions = {
  vrDisplay: {
    requestAnimationFrame: ((number) => void) => void,
  },
  lastRenderTime: number,
  vrButton: {
    isPresenting: () => boolean,
  },
  effect: Effect,
  controls: {
    update: () => void,
  },
  scene: Scene,
  camera: Camera,
}

type OnResizeFactoryOptions = {
  effect: Effect,
  camera: Camera,
  el: HTMLElement,
}

type Background = {
  type: "color",
  color: number,
} | {
  type: "texture",
  texture: string,
  repeat: false | {
    repeatX: number,
    repeatY: number,
  }
} | {
  type: "cube",
  cube: [
    string,
    string,
    string,
    string,
    string,
    string,
    ]
};

type Call = {
  type: "innerTexturedSphere",
  texture?: string,
  repeat: false | {
    repeatX: number,
    repeatY: number,
  },
  radius: number,
  widthSegments: number,
  heightSegments: number,
};

type X = {
  background?: Background,
  calls?: Array<Call>,
}

function onResizeFactory({ effect, camera, el }: OnResizeFactoryOptions) {
  return function onResize(e) {
    if (e && e.vrDisplay && e.vrDisplay.isPresenting) {
      effect.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    } else {
      effect.setSize(el.clientWidth, el.clientHeight);
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
    }
  };
}

function animateFactory(options: AnimateFactoryOptions) {
  const {
    vrDisplay,
    vrButton,
    effect,
    controls,
    scene,
    camera,
    lastRenderTime,
  } = options;
  const callbacks = [];
  return (timestamp: number): void => {
    const delta = Math.min(timestamp - lastRenderTime, 500);
    if (vrButton.isPresenting()) {
      controls.update();
    }
    callbacks.map(cb => cb(delta));
    effect.render(scene, camera);
    const animate = animateFactory({
      ...options,
      lastRenderTime: timestamp,
    });
    vrDisplay.requestAnimationFrame(animate);
  };
}

function setBackground(scene: Scene, background?: Background) {
  if (!background) { return; }
  switch (background.type) {
    case 'color': {
      scene.background = new THREE.Color(background.color);
      break;
    }
    case 'texture': {
      scene.background = new THREE.TextureLoader().load(background.texture);
      if (background.repeat) {
        scene.background.wrapS = THREE.RepeatWrapping;
        scene.background.wrapT = THREE.RepeatWrapping;
        scene.background.repeat.set(background.repeat.repeatX, background.repeat.repeatY);
      }
      break;
    }
    case 'cube': {
      scene.background = new THREE.CubeTextureLoader().load(background.cube);
      break;
    }
    default:
      break;
  }
}

function doCall(c: Call, scene: Scene) {
  switch (c.type) {
    case 'innerTexturedSphere': {
      const {
        texture, repeat, radius, widthSegments, heightSegments,
      } = c;
      let loadTex;
      let color;
      if (
        texture === 'wireframe' ||
        texture === null ||
        texture === undefined
      ) {
        loadTex = wireframe;
        color = 0x01BE00;
      } else if (texture === 'target') {
        loadTex = target;
      } else {
        loadTex = texture;
      }
      const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      const material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load(loadTex),
        color,
        side: THREE.BackSide,
      });
      if (repeat) {
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.repeat.set(repeat.repeatX, repeat.repeatY);
      }
      // Align the skybox to the floor (which is at y=0).
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.y = radius / 2;
      scene.add(sphere);
      break;
    }
    default:
      break;
  }
}

HTMLWidgets.widget({
  name: 'webvrr',
  type: 'output',
  factory(el, width, height) {
    let vrButton;
    let renderer;
    let scene;
    let camera;
    let controls;
    let effect;

    const uiOptions = {
      color: 'black',
      background: 'white',
      corners: 'square',
    };

    return {
      getScene() {
        return scene;
      },
      resize(newWidth, newHeight) {
        effect.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      },
      renderValue({
        // eslint-disable-next-line no-unused-vars
        background, calls,
      }: X) {
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        el.appendChild(renderer.domElement);

        scene = new THREE.Scene();
        setBackground(scene, background);

        camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

        controls = new THREE.VRControls(camera);
        controls.standing = true;
        camera.position.y = controls.userHeight;

        effect = new THREE.VREffect(renderer);
        effect.setSize(width, height);

        const onResize = onResizeFactory({ effect, camera, el });
        window.addEventListener('vrdisplaypresentchange', onResize, true);

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
            onResize({ vrDisplay: { isPresenting: true } });
          });
        });
        vrForceContainer.appendChild(vrForceLink);
        uiContainer.appendChild(vrForceContainer);
        el.appendChild(uiContainer);

        (calls || []).forEach(c => doCall(c, scene));

        navigator.getVRDisplays().then((displays) => {
          if (displays.length > 0) {
            const vrDisplay = displays[0];
            const animate = animateFactory({
              vrDisplay,
              vrButton,
              effect,
              scene,
              camera,
              controls,
              lastRenderTime: 0,
            });
            vrDisplay.requestAnimationFrame(animate);
          }
        });
      },
    };
  },
});
