'use strict';

System.register(['./blur'], function (_export, _context) {
  "use strict";

  var Blur, defaultConfig;
  function configure(frameworkConfig, blurConfig) {
    frameworkConfig.globalResources(PLATFORM.moduleName('./blur'));
    Blur.use(Object.assign({}, defaultConfig, blurConfig));
  }

  _export('configure', configure);

  return {
    setters: [function (_blur) {
      Blur = _blur.Blur;
    }],
    execute: function () {
      defaultConfig = {
        mouse: true,
        touch: false,
        pointer: false,
        focus: true
      };
    }
  };
});