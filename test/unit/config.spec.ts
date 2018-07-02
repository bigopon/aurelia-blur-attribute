import { Blur, configure } from '../../src/index';

describe('config', () => {

  beforeEach(() => {
    spyOn(Blur, 'use').and.callThrough();
  });


  it('should config', () => {
    let config = {
      focus: true
    };
    configure({ globalResources() { } }, config);
    expect(Blur.use).toHaveBeenCalled();
  });
});
