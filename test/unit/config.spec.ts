import { DOM, PLATFORM, FrameworkConfiguration, Aurelia } from 'aurelia-framework';
import { configure, Blur, BlurConfig } from '../../src/index';

describe('config', () => {

  beforeEach(() => {
    spyOn(Blur, 'use').and.callThrough();
  });


  it('should config', () => {
    let config = {
      focus: true
    };
    configure(new FrameworkConfiguration({} as any), config);
    expect(Blur.use).toHaveBeenCalled();
  });
});
