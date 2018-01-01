(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = global.HTMLWidgets;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = global.THREE;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = global.WebVRPolyfill;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
'use strict';

var _htmlwidgets = require('./global/htmlwidgets');

var _htmlwidgets2 = _interopRequireDefault(_htmlwidgets);

var _three = require('./global/three');

var _three2 = _interopRequireDefault(_three);

var _wireframe = require('./wireframe');

var _wireframe2 = _interopRequireDefault(_wireframe);

var _webvrpolyfill = require('./global/webvrpolyfill');

var _webvrpolyfill2 = _interopRequireDefault(_webvrpolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var polyfill = new _webvrpolyfill2.default({});
polyfill.enable();

_htmlwidgets2.default.widget({
  name: 'webvrr',
  type: 'output',
  factory: function factory(el, width, height) {
    var vrButton, geometry, material, skybox;
    el.style = "";
    var renderer = new _three2.default.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    var scene = new _three2.default.Scene();
    el.appendChild(renderer.domElement);

    var aspect = width / height;
    var camera = new _three2.default.PerspectiveCamera(75, aspect, 0.1, 10000);

    var controls = new _three2.default.VRControls(camera);
    controls.standing = true;
    camera.position.y = controls.userHeight;

    var effect = new _three2.default.VREffect(renderer);
    effect.setSize(width, height);

    var lastRenderTime = 0;
    function animateFactory(vrDisplay) {
      return function (timestamp) {
        var delta = Math.min(timestamp - lastRenderTime, 500);
        lastRenderTime = timestamp;
        if (vrButton.isPresenting()) {
          controls.update();
        }
        effect.render(scene, camera);
        var animate = animateFactory(vrDisplay);
        vrDisplay.requestAnimationFrame(animate);
      };
    }

    var texture = new _three2.default.TextureLoader().load(_wireframe2.default);
    texture.wrapS = _three2.default.RepeatWrapping;
    texture.wrapT = _three2.default.RepeatWrapping;
    texture.repeat.set(20, 20);
    geometry = new _three2.default.SphereGeometry(30, 32, 32);
    geometry.scale(-1, 1, 1);
    material = new _three2.default.MeshBasicMaterial({
      map: texture
    });
    skybox = new _three2.default.Mesh(geometry, material);
    skybox.position.y = 30 / 2;
    scene.add(skybox);

    navigator.getVRDisplays().then(function (displays) {
      if (displays.length > 0) {
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
    vrButton.on('error', function (err) {
      console.error(err);
    });
    var uiContainer = document.createElement('div');
    uiContainer.className = "vr-ui-container";
    var vrButtonContainer = document.createElement('div');
    vrButtonContainer.id = "vr-button";
    vrButtonContainer.className = "vr-button-container";
    vrButtonContainer.appendChild(vrButton.domElement);
    uiContainer.appendChild(vrButtonContainer);
    el.appendChild(uiContainer);

    var onResize = function onResize(e) {
      if (e.vrDisplay.isPresenting) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      } else {
        effect.setSize(el.innerWidth, el.innerHeight);
        camera.aspect = el.innerWidth / el.innerHeight;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('vrdisplaypresentchange', onResize, true);

    return {
      resize: function resize(newWidth, newHeight) {
        effect.setSize(newWidth, newHeight);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
      },
      renderValue: function renderValue(x) {
        if (x) {
          if (x.sphere) {
            material.map = new _three2.default.TextureLoader().load(x.sphere);
          }
        }
      }
    };
  }
});

},{"./global/htmlwidgets":1,"./global/three":2,"./global/webvrpolyfill":3,"./wireframe":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var wireframe = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAi5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWNvcm4gdmVyc2lvbiAzLjU8L3htcDpDcmVhdG9yVG9vbD4KICAgICAgICAgPHRpZmY6Q29tcHJlc3Npb24+NTwvdGlmZjpDb21wcmVzc2lvbj4KICAgICAgICAgPHRpZmY6WVJlc29sdXRpb24+NzI8L3RpZmY6WVJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOlhSZXNvbHV0aW9uPjcyPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4K0W8K+AAAF9BJREFUeAHt2LENwgAUQ0FAKPvPmwYChcUMvEvllL6fwsr9dT03DwECBAgQIJASeKTaKkuAAAECBAh8BQwAHwIBAgQIEAgKPH87H8fx+yoTIECAAAECfyRwnufa+AMwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR8AA6NxaUwIECBAgMAEDYBQCAQIECBDoCBgAnVtrSoAAAQIEJmAAjEIgQIAAAQIdAQOgc2tNCRAgQIDABAyAUQgECBAgQKAjYAB0bq0pAQIECBCYgAEwCoEAAQIECHQEDIDOrTUlQIAAAQITMABGIRAgQIAAgY6AAdC5taYECBAgQGACBsAoBAIECBAg0BEwADq31pQAAQIECEzAABiFQIAAAQIEOgIGQOfWmhIgQIAAgQkYAKMQCBAgQIBAR+D+up5OXU0JECBAgACBj4A/AL4DAgQIECAQFDAAgkdXmQABAgQIvAFh5Q758wMrPQAAAABJRU5ErkJggg==';
exports.default = wireframe;

},{}]},{},[4]);
