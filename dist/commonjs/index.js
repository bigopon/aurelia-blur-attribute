'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configure = configure;

var _blur = require('./blur');

var defaultConfig = {
  mouse: true,
  touch: false,
  pointer: false,
  focus: true
};

function configure(frameworkConfig, blurConfig) {
  frameworkConfig.globalResources(PLATFORM.moduleName('./blur'));
  _blur.Blur.use(Object.assign({}, defaultConfig, blurConfig));
}