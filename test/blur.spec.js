import './setup';
import { Blur } from '../src/blur';

describe('blur', () => {
  /**@type {Blur} */
  let blur;
  let container;
  let input1;
  let input2;
  let button;
  let focusableDiv;
  let outsideDiv;

  /**@param {string} name */
  function el(name) {
    return document.createElement(name);
  }

  Blur.listen
    .focus()
    .touch()
    .mouse()
    .windowBlur();

  beforeEach(() => {
    outsideDiv = el('div');
    container = el('form');
    document.body.appendChild(container);
    document.body.appendChild(outsideDiv);

    input1 = el('input');
    input2 = el('input');
    button = el('button');
    focusableDiv = el('div');
    focusableDiv.tabIndex = -1;
    container.append(input1, input2, button, focusableDiv);

    blur = new Blur(container);

    input1.focus();
  });

  it('should not change value to false when focusing different elements inside container', () => {
    blur.value = true;

    input2.focus();

    expect(blur.value).toBe(true);
  });

  it('should not change value to false when interacting different elements inside bound container', () => {
    blur.value = true;

    button.click();

    expect(blur.value).toBe(true);
  });
});
