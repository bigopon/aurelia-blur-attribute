import { Blur, BlurConfig } from './blur';

const defaultConfig = {
  mouse: true,
  touch: false,
  pointer: false,
  focus: true,
  windowBlur: true
};

export function configure(frameworkConfig: any, blurConfig: BlurConfig) {
  frameworkConfig.globalResources(Blur);
  Blur.use(Object.assign({}, defaultConfig, blurConfig));
}

export { Blur, BlurConfig };
