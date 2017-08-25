import { PLATFORM, DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';

const { global } = PLATFORM;
/**@type {{ document: Document }} */
const { document } = global;

let useTouch = false; // eslint-disable-line no-unused-vars
let useMouse = false;
let usePointer = false; // eslint-disable-line no-unused-vars
let useFocus = false; // eslint-disable-line no-unused-vars

@customAttribute('blur', bindingMode.twoWay)
export class Blur {

  static inject = [DOM.Element]

  static use(cfg) {
    for (let i in cfg) {
      if (i in this.listen) {
        this.listen[i](cfg[i]);
      }
    }
  }

  static listen = {
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
  }

  @bindable({
    primaryProperty: true,
    defaultBindingMode: bindingMode.twoWay
  }) value

  @bindable onBlur

  /**
   * Used to determine which elemens this attribute will be linked with
   * Interacting with a linked element will not trigger blur for this attribute
   * @type {string | Element | (string | Element)[]}
   */
  @bindable linkedWith

  /**
   * Only used when linkedWith is a string.
   * Used to determine whether to use querySelector / querySelectorAll to find all interactable elements without triggering blur
   * Performace wise Consider using this only when necessary
   */
  @bindable linkedMultiple = true

  /**
   * Only used when linkedWith is a string, or an array containing some strings
   * During query for finding element to link with:
   * - true: search all children, using `querySelectorAll`
   * - false: search immediate children using for loop
   */
  @bindable searchSubTree = true

  /**
   * Only used when linkedWith is a string. or an array containing a string
   * Determine from which node/ nodes, search for elements
   * @type {string | Element}
   */
  @bindable linkingContext = null

  /**
   * @param {Element} element
   */
  constructor(element) {
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

  /**
   * @param {Element} target
   */
  contains(target) {
    if (!this.value) {
      return false;
    }
    let els;
    let el;
    let i, ii; // eslint-disable-line
    let j, jj; // eslint-disable-line
    /**@type {string | Element | (string | Element)[]} */
    let links;
    /**@type {Element} */
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
      // When user specify to link with something by a string, it acts as a CSS selector
      // We need to do some querying stuff to determine if target above is contained.
      if (typeof el === 'string') {
        // Default behavior, search the whole tree, from context that user specified, which default to document body
        // Function `query` used will be similar to `querySelectorAll`, but optimized for performant
        if (this.searchSubTree) {
          els = query(el, contextNode);
          for (j = 0, jj = els.length; j < jj; ++j) {
            if (els[j].contains(target)) {
              return true;
            }
          }
        } else {
          // default to document body, if user didn't define a linking context, and wanted to ignore subtree.
          // This is specifically performant and useful for dialogs, plugins
          // that usually generate contents to document body
          contextNode = contextNode || document.body;
          els = contextNode.children;
          for (j = 0, jj = els.length; j < jj; ++j) {
            if (els[j].matches(el)) return true;
          }
        }
      } else {
        // When user passed in something that is not a string,
        // simply check if has method `contains` (allow duck typing)
        // and call it against target.
        // This enables flexible usages
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
}

/**
 * An optimized version of `querySelectorAll`, as it is expected to be called quite often
 * @param {string} selector
 * @param {Element} context
 * @returns {Element[]}
 */
function query(selector, context) {
  context = context || document.body;
  // Redirect simple selectors to the more performant function
  if (/^(#?[\w-]+|\.[\w-.]+)$/.test(selector)) {
    switch (selector.charAt(0)) {
    case '#':
        // Handle ID-based selectors
      return [context.getElementById(selector.substr(1))];
    case '.':
      // Handle class-based selectors
      // Query by multiple classes by converting the selector
      // string into single spaced class names
      let classes = selector.substr(1).replace(/\./g, ' ');
      return [].slice.call(context.getElementsByClassName(classes));
    default:
      // Handle tag-based selectors
      return [].slice.call(context.getElementsByTagName(selector));
    }
  }
  // Default to `querySelectorAll`
  return [].slice.call(context.querySelectorAll(selector));
}

function addListener(el, ev, listener, capture) {
  el.addEventListener(ev, listener, capture);
}
function removeListener(el, ev, listener, capture) {
  el.removeEventListener(ev, listener, capture);
}

/*******************************
 * EVENTS ORDER
 * -----------------------------
 * pointerdown
 * touchstart
 * pointerup
 * touchend
 * mousedown
 * --------------
 * BLUR
 * FOCUS
 * --------------
 * mouseup
 * click
 ******************************/

/**
 * In which case focus happens without mouse interaction? Keyboard
 * So it needs to capture both mouse / focus movement
 */


/**
 * @type {Blur[]}
 */
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

/**@param {PointerEvent} e */
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

/**@param {TouchEvent} e */
function handleTouchStart(e) {
  if (alreadyChecked) {
    if (!useMouse) { // If user listen to mouse even, dont revert, let mousedownHandler do the job
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

/**@param {MouseEvent} e */
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

/**@param {FocusEvent} e */
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
