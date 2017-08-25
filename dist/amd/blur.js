define(['exports', 'aurelia-pal', 'aurelia-templating', 'aurelia-binding'], function (exports, _aureliaPal, _aureliaTemplating, _aureliaBinding) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Blur = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
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

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _temp;

  var global = _aureliaPal.PLATFORM.global;
  var document = global.document;


  var useTouch = false;
  var useMouse = false;
  var usePointer = false;
  var useFocus = false;var Blur = exports.Blur = (_dec = (0, _aureliaTemplating.customAttribute)('blur', _aureliaBinding.bindingMode.twoWay), _dec2 = (0, _aureliaTemplating.bindable)({
    primaryProperty: true,
    defaultBindingMode: _aureliaBinding.bindingMode.twoWay
  }), _dec(_class = (_class2 = (_temp = _class3 = function () {
    Blur.use = function use(cfg) {
      for (var i in cfg) {
        if (i in this.listen) {
          this.listen[i](cfg[i]);
        }
      }
    };

    function Blur(element) {
      _classCallCheck(this, Blur);

      _initDefineProp(this, 'value', _descriptor, this);

      _initDefineProp(this, 'onBlur', _descriptor2, this);

      _initDefineProp(this, 'linkedWith', _descriptor3, this);

      _initDefineProp(this, 'linkedMultiple', _descriptor4, this);

      _initDefineProp(this, 'searchSubTree', _descriptor5, this);

      _initDefineProp(this, 'linkingContext', _descriptor6, this);

      this.element = element;
    }

    Blur.prototype.bind = function bind(bindingContext) {
      this.context = bindingContext;
    };

    Blur.prototype.attached = function attached() {
      checkTargets.push(this);
    };

    Blur.prototype.detached = function detached() {
      unregister(this);
    };

    Blur.prototype.contains = function contains(target) {
      if (!this.value) {
        return false;
      }
      var els = void 0;
      var el = void 0;
      var i = void 0,
          ii = void 0;
      var j = void 0,
          jj = void 0;
      var links = void 0;

      var contextNode = void 0;

      if (this.element.contains(target)) {
        return true;
      }

      if (!this.linkedWith) {
        return false;
      }

      var linkedWith = this.linkedWith,
          linkingContext = this.linkingContext;


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
    };

    Blur.prototype.triggerBlur = function triggerBlur() {
      if (typeof this.onBlur === 'function') {
        this.onBlur.call(this.context);
      }
      this.value = false;
    };

    return Blur;
  }(), _class3.inject = [_aureliaPal.DOM.Element], _class3.listen = {
    touch: function touch(on) {
      useTouch = !!on;
      var fn = on ? addListener : removeListener;
      fn(document.body, 'touchstart', handleTouchStart, true);
      return Blur.listen;
    },
    mouse: function mouse(on) {
      useMouse = !!on;
      var fn = on ? addListener : removeListener;
      fn(document.body, 'mousedown', handleMousedown, true);
      return Blur.listen;
    },
    pointer: function pointer(on) {
      usePointer = !!on;
      var fn = on ? addListener : removeListener;
      fn(document.body, 'pointerdown', handlePointerDown, true);
      return Blur.listen;
    },
    focus: function focus(on) {
      useFocus = !!on;
      var fn = on ? addListener : removeListener;
      fn(global, 'focus', handleWindowFocus, true);
      return Blur.listen;
    },
    windowBlur: function windowBlur(on) {
      var fn = on ? addListener : removeListener;
      fn(global, 'blur', handleWindowBlur);
      return Blur.listen;
    }
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'value', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'onBlur', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'linkedWith', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, 'linkedMultiple', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, 'searchSubTree', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, 'linkingContext', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
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
          var classes = selector.substr(1).replace(/\./g, ' ');
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

  var checkTargets = [];
  function unregister(attr) {
    var idx = checkTargets.indexOf(attr);
    if (idx !== -1) checkTargets.splice(idx, 1);
  }

  var alreadyChecked = false;
  var cleanCheckTimeout = 0;
  function revertAlreadyChecked() {
    alreadyChecked = false;
    cleanCheckTimeout = 0;
  }

  function handlePointerDown(e) {
    for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
      var attr = checkTargets[i];
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
    var target = getTargetFromEvent(e);
    for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
      var attr = checkTargets[i];
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
    var target = getTargetFromEvent(e);
    for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
      var attr = checkTargets[i];
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
    var target = getTargetFromEvent(e);
    var shouldBlur = target === window;
    for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
      var attr = checkTargets[i];
      if (shouldBlur || !attr.contains(target)) {
        attr.triggerBlur();
      }
    }
  }

  function handleWindowBlur() {
    for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
      checkTargets[i].triggerBlur();
    }
  }

  function getTargetFromEvent(e) {
    return e.target;
  }
});