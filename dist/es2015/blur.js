var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _temp;

function _initDefineProp(target, property, descriptor, context) {
  if (!descriptor) return;
  Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function _initializerWarningHelper(descriptor, context) {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

import { PLATFORM, DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';

const { global } = PLATFORM;

const { document } = global;

let useTouch = false;
let useMouse = false;
let usePointer = false;
let useFocus = false;
export let Blur = (_dec = customAttribute('blur', bindingMode.twoWay), _dec2 = bindable({
  primaryProperty: true,
  defaultBindingMode: bindingMode.twoWay
}), _dec(_class = (_class2 = (_temp = _class3 = class Blur {

  static use(cfg) {
    for (let i in cfg) {
      if (i in this.listen) {
        this.listen[i](cfg[i]);
      }
    }
  }

  constructor(element) {
    _initDefineProp(this, 'value', _descriptor, this);

    _initDefineProp(this, 'onBlur', _descriptor2, this);

    _initDefineProp(this, 'linkedWith', _descriptor3, this);

    _initDefineProp(this, 'linkedMultiple', _descriptor4, this);

    _initDefineProp(this, 'searchSubTree', _descriptor5, this);

    _initDefineProp(this, 'linkingContext', _descriptor6, this);

    this.element = element;
  }
  bind(bindingContext) {
    this.context = bindingContext;
  }
  attached() {
    checkTargets.push(this);
  }
  detached() {
    unregister(this);
  }

  contains(target) {
    if (!this.value) {
      return false;
    }
    let els;
    let el;
    let i, ii;
    let j, jj;
    let links;

    let contextNode;

    if (this.element.contains(target)) {
      return true;
    }

    if (!this.linkedWith) {
      return false;
    }

    const { linkedWith, linkingContext } = this;

    links = Array.isArray(linkedWith) ? linkedWith : [linkedWith];
    contextNode = typeof linkingContext === 'string' ? query(linkingContext)[0] : linkingContext;
    for (i = 0, ii = links.length; i < ii; ++i) {
      el = links[i];

      if (typeof el === 'string') {
        if (this.searchSubTree) {
          els = query(el, contextNode);
          for (j = 0, jj = els.length; j < jj; ++j) {
            if (els[j].contains(target)) {
              return true;
            }
          }
        } else {
          contextNode = contextNode || document.body;
          els = contextNode.children;
          for (j = 0, jj = els.length; j < jj; ++j) {
            if (els[j].matches(el)) return true;
          }
        }
      } else {
        if (el && el.contains(target)) {
          return true;
        }
      }
    }
    return false;
  }

  triggerBlur() {
    if (typeof this.onBlur === 'function') {
      this.onBlur.call(this.context);
    }
    this.value = false;
  }
}, _class3.inject = [DOM.Element], _class3.listen = {
  touch(on) {
    useTouch = !!on;
    const fn = on ? addListener : removeListener;
    fn(document.body, 'touchstart', handleTouchStart, true);
    return Blur.listen;
  },
  mouse(on) {
    useMouse = !!on;
    const fn = on ? addListener : removeListener;
    fn(document.body, 'mousedown', handleMousedown, true);
    return Blur.listen;
  },
  pointer(on) {
    usePointer = !!on;
    const fn = on ? addListener : removeListener;
    fn(document.body, 'pointerdown', handlePointerDown, true);
    return Blur.listen;
  },
  focus(on) {
    useFocus = !!on;
    const fn = on ? addListener : removeListener;
    fn(global, 'focus', handleWindowFocus, true);
    return Blur.listen;
  },
  windowBlur(on) {
    const fn = on ? addListener : removeListener;
    fn(global, 'blur', handleWindowBlur);
    return Blur.listen;
  }
}, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec2], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'onBlur', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'linkedWith', [bindable], {
  enumerable: true,
  initializer: null
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'linkedMultiple', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'searchSubTree', [bindable], {
  enumerable: true,
  initializer: function () {
    return true;
  }
}), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'linkingContext', [bindable], {
  enumerable: true,
  initializer: function () {
    return null;
  }
})), _class2)) || _class);

function query(selector, context) {
  context = context || document.body;

  if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
    switch (selector.charAt(0)) {
      case '#':
        return [context.getElementById(selector.substr(1))];
      case '.':
        let classes = selector.substr(1).replace(/\./g, ' ');
        return [].slice.call(context.getElementsByClassName(classes));
      default:
        return [].slice.call(context.getElementsByTagName(selector));
    }
  }

  return [].slice.call(context.querySelectorAll(selector));
}

function addListener(el, ev, listener, capture) {
  el.addEventListener(ev, listener, capture);
}
function removeListener(el, ev, listener, capture) {
  el.removeEventListener(ev, listener, capture);
}

let checkTargets = [];
function unregister(attr) {
  let idx = checkTargets.indexOf(attr);
  if (idx !== -1) checkTargets.splice(idx, 1);
}

let alreadyChecked = false;
let cleanCheckTimeout = 0;
function revertAlreadyChecked() {
  alreadyChecked = false;
  cleanCheckTimeout = 0;
}

function handlePointerDown(e) {
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (!attr.contains(e.target)) {
      attr.triggerBlur();
    }
  }
  alreadyChecked = true;
  cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
}

function handleTouchStart(e) {
  if (alreadyChecked) {
    if (!useMouse) {
      clearTimeout(cleanCheckTimeout);
      revertAlreadyChecked();
    }
    return;
  }
  let target = getTargetFromEvent(e);
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (!attr.contains(target)) {
      attr.triggerBlur();
    }
  }
  alreadyChecked = true;
  cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
}

function handleMousedown(e) {
  if (alreadyChecked) {
    clearTimeout(cleanCheckTimeout);
    revertAlreadyChecked();
    return;
  }
  let target = getTargetFromEvent(e);
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (!attr.contains(target)) {
      attr.triggerBlur();
    }
  }
  alreadyChecked = true;
  cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
}

function handleWindowFocus(e) {
  if (alreadyChecked) {
    clearTimeout(cleanCheckTimeout);
    revertAlreadyChecked();
    return;
  }
  let target = getTargetFromEvent(e);
  let shouldBlur = target === window;
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (shouldBlur || !attr.contains(target)) {
      attr.triggerBlur();
    }
  }
}

function handleWindowBlur() {
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    checkTargets[i].triggerBlur();
  }
}

function getTargetFromEvent(e) {
  return e.target;
}