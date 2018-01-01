import HTMLWidgets from './global/htmlwidgets';
import THREE from './global/three';
import wireframe from './wireframe';
import WebVRPolyfill from './global/webvrpolyfill';

var polyfill = new WebVRPolyfill({});
polyfill.enable();

HTMLWidgets.widget({
  name: 'webvrr',
  type: 'output',
  factory: function(el, width, height) {
    var vrButton,
        geometry,
        material,
        skybox;
    el.style = "";
    var renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    var scene = new THREE.Scene();
    el.appendChild(renderer.domElement);

    var aspect = width / height;
    var camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 10000);

    var controls = new THREE.VRControls(camera);
    controls.standing = true;
    camera.position.y = controls.userHeight;

    var effect = new THREE.VREffect(renderer);
    effect.setSize(width, height);

    var lastRenderTime = 0;
    function animateFactory(vrDisplay) {
      return function(timestamp) {
        var delta =  Math.min(timestamp - lastRenderTime, 500);
        lastRenderTime = timestamp;
        if (vrButton.isPresenting()) {
          controls.update();
        }
        effect.render(scene, camera);
        var animate = animateFactory(vrDisplay);
        vrDisplay.requestAnimationFrame(animate);
      };
    }

    var texture = new THREE.TextureLoader().load(wireframe);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20,20);
    geometry = new THREE.SphereGeometry(30, 32, 32);
    geometry.scale(-1, 1, 1);
    material = new THREE.MeshBasicMaterial({
      map: texture,
    })
    skybox = new THREE.Mesh(geometry, material);
    skybox.position.y = 30/2;
    scene.add(skybox)


    navigator.getVRDisplays().then(function(displays) {
          if(displays.length > 0) {
            var vrDisplay = displays[0];
            var animate = animateFactory(vrDisplay);
            vrDisplay.requestAnimationFrame(animate);
          }
    });

    var uiOptions = {
    color: 'black',
    background: 'white',
    corners: 'square'
    };
    vrButton = new webvrui.EnterVRButton(renderer.domElement, uiOptions);
    vrButton.on('error', function(err) {
      console.error(err)
    })
    var uiContainer = document.createElement('div');
    uiContainer.className = "vr-ui-container";
    var vrButtonContainer = document.createElement('div');
    vrButtonContainer.id = "vr-button";
    vrButtonContainer.className = "vr-button-container";
    vrButtonContainer.appendChild(vrButton.domElement);
    uiContainer.appendChild(vrButtonContainer);
    el.appendChild(uiContainer);

    const onResize = function(e) {
      if(e.vrDisplay.isPresenting) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } else {
        effect.setSize(el.innerWidth, el.innerHeight);
        camera.aspect = el.innerWidth / el.innerHeight;
        camera.updateProjectionMatrix();
      }
    }
    window.addEventListener('vrdisplaypresentchange', onResize, true);

    return {
      resize: function(newWidth, newHeight) {
        effect.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      },
      renderValue: function(x) {
        if(x) {
          if(x.sphere) {
            material.map = new THREE.TextureLoader().load(x.sphere);
          }
        }
      }
    }
  }
})
