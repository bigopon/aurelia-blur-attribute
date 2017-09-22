import {Blur} from './blur';

const defaultConfig = {
  mouse: true,
  touch: false,
  pointer: false,
  focus: true,
  windowBlur: true
};

export function configure(frameworkConfig, blurConfig) {
  frameworkConfig.globalResources(PLATFORM.moduleName('./blur'));
  Blur.use(Object.assign({}, defaultConfig, blurConfig));
}

export {Blur};
