import { DOM } from 'aurelia-pal';
import { Blur } from '../../src/blur';

describe('blur', () => {
  let blur: Blur;
  let container: HTMLFormElement;
  let input1: HTMLInputElement;
  let input2: HTMLInputElement;
  let button: HTMLButtonElement;
  let focusableDiv: HTMLDivElement;
  let outsideDiv1: HTMLDivElement;
  let outsideDiv2: HTMLDivElement;
  let outsideDiv3: HTMLDivElement;
  let spy: jasmine.Spy;

  const checkDelay = 40;

  function h<T extends keyof HTMLElementTagNameMap>(name: T, attrs: Record<string, string | number> = {}, ...children: (string | HTMLElement | Text | Comment)[]) {
    let el = document.createElement<T>(name);
    for (let attr in attrs) {
      el.setAttribute(attr, '' + attrs[attr]);
    }
    for (let child of children) {
      el.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    }
    return el;
  }

  Blur.listen
    .focus(true)
    .touch(true)
    .mouse(true)
    .pointer(true)
    .windowBlur(true);

  beforeEach(() => {
    /**
     * HTML:
     * <body>
     *   <form>
     *     <input id="input1" class="input1" />
     *     <input id="input2" class="input2" />
     *     <button></button>
     *     <div tabindex="-1"></div>
     *   </form>
     *   <div class="outside-div div-1" tabindex="-1"></div>
     *   <div class="outside-div div-2" tabindex="-1"></div>
     * </body>
     */
    document.body.appendChild(h('div', null,
      container = h('form', null,
        input1 = h('input', { id: 'input1', class: 'input1' }),
        input2 = h('input', { id: 'input2', class: 'input2' }),
        button = h('button'),
        focusableDiv = h('div', { tabindex: -1 })
      ),
      outsideDiv1 = h('div', { class: 'outside-div div1', tabindex: -1 }),
      outsideDiv2 = h('div', { class: 'outside-div div2', tabindex: -1 }),
      outsideDiv3 = h('div', { class: 'outside-div div3', tabindex: -1 }),
    ));

    input1.focus();

    blur = new Blur(container);
    blur.value = true;
    blur.attached();

    spyOn(blur, 'contains').and.callThrough();
    spyOn(blur, 'triggerBlur').and.callThrough();
  });

  it('should not change value to false when focusing different elements inside container', () => {
    input2.focus();
    expect(blur.value).toBe(true);
    expect(blur.contains).toHaveBeenCalledWith(input2);
  });

  describe('focusing outside', () => {

    it('with focus changes', () => {
      outsideDiv1.focus();
      expect(blur.value).toBe(false);
    });
    it('with mouse', () => {
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('mousedown', {}));
      expect(blur.value).toBe(false);
    });
    it('with touch', () => {
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('touchstart', {}));
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('mousedown', {}));
      expect(blur.value).toBe(false);

      blur.value = true;
      Blur.listen.mouse(false);
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('touchstart', {}));
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('mousedown', {}));
      expect(blur.value).toBe(false);

    });
    it('with pointer', () => {
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('pointerdown', {}));
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('touchstart', {}));
      outsideDiv2.dispatchEvent(DOM.createCustomEvent('mousedown', {}));
      expect(blur.value).toBe(false);
    });
    it('with window blur', () => {
      window.dispatchEvent(DOM.createCustomEvent('blur', {}));
      expect(blur.value).toBe(false);
    });

    it('should call onBlur()', () => {
      let blurred = false;
      blur.onBlur = () => { blurred = true; }
      window.dispatchEvent(DOM.createCustomEvent('blur', {}));
      expect(blur.value).toBe(false);
      expect(blurred).toBe(true);
    })
  })

  it('should not change value to false after detached()', () => {
    blur.detached();
    outsideDiv1.focus();

    expect(blur.value).toBe(true);
  });

  describe('linked-with binding', () => {

    it('should not set value to false when interacting with single linked element', () => {

      blur.linkedWith = outsideDiv1;
      outsideDiv1.focus();

      expect(blur.value).toBe(true);
    });

    it('should not set value to false when interacting with linked element', () => {

      blur.linkedWith = ['#input1', '.div2', outsideDiv1];
      outsideDiv3.focus();
      expect(blur.contains).toHaveBeenCalledWith(outsideDiv3);
      expect(blur.value).toBe(false);
    });

    it('should not set value to false when used with complex selectors', () => {

      // Complex query case but resolvable to simple classes
      blur.linkedWith = ['#input1', '.outside-div.div2', outsideDiv1];
      outsideDiv2.focus();
      expect(blur.contains).toHaveBeenCalledWith(outsideDiv2);
      expect(blur.value).toBe(true);

      // Complex query case
      blur.linkedWith = ['div .div2', outsideDiv1];
      outsideDiv1.focus();
      expect(blur.value).toBe(true);

      // Complext query case without searching subtree
      blur.searchSubTree = false;
      blur.linkingContext = document.body.firstElementChild;
      blur.linkedWith = ['div .div2', outsideDiv1];
      outsideDiv2.focus();
      expect(blur.value).toBe(true);
    });
  });
});
