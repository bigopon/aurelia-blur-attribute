import { PLATFORM, DOM } from 'aurelia-pal';
import { customAttribute, bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';

const global: Window = PLATFORM.global;
const document: Document = global.document;

// let useTouch = false;
let useMouse = false;
// let usePointer = false;
// let useFocus = false;

export interface BlurConfig {
  touch?: boolean
  mouse?: boolean
  pointer?: boolean
  focus?: boolean
  windowBlur?: boolean
}

@customAttribute('blur', bindingMode.twoWay)
export class Blur {

  static inject = [DOM.Element]

  static use(cfg: BlurConfig) {
    for (let i in cfg) {
      if (i in this.listen) {
        (this.listen as any) [i]((cfg as any) [i]);
      }
    }
  }

  static listen = {
    touch(on: boolean) {
      // useTouch = !!on;
      const fn = on ? addListener : removeListener;
      fn(document, 'touchstart', handleTouchStart, true);
      return Blur.listen;
    },
    mouse(on: boolean) {
      useMouse = !!on;
      const fn = on ? addListener : removeListener;
      fn(document, 'mousedown', handleMousedown, true);
      return Blur.listen;
    },
    pointer(on: boolean) {
      // usePointer = !!on;
      const fn = on ? addListener : removeListener;
      fn(document, 'pointerdown', handlePointerDown, true);
      return Blur.listen;
    },
    focus(on: boolean) {
      // useFocus = !!on;
      const fn = on ? addListener : removeListener;
      fn(global, 'focus', handleWindowFocus, true);
      return Blur.listen;
    },
    windowBlur(on: boolean) {
      const fn = on ? addListener : removeListener;
      fn(global, 'blur', handleWindowBlur, false);
      return Blur.listen;
    }
  }

  @bindable({
    primaryProperty: true,
    defaultBindingMode: bindingMode.twoWay
  })
  value: boolean

  @bindable onBlur: Function

  /**
   * Used to determine which elemens this attribute will be linked with
   * Interacting with a linked element will not trigger blur for this attribute
   */
  @bindable linkedWith: string | Element | (string | Element) []

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
   */
  @bindable linkingContext: string | Element | null = null

  constructor(private element: Element) {
  }

  attached() {
    checkTargets.push(this);
  }

  detached() {
    unregister(this);
  }

  contains(target: Element) {
    if (!this.value) {
      return false;
    }
    let els;
    let el;
    let i: number, ii: number;
    let j: number, jj: number;
    let links: string | Element | (string | Element) [];
    let contextNode: Element | null;

    if (this.element.contains(target)) {
      return true;
    }

    if (!this.linkedWith) {
      return false;
    }

    const { linkedWith, linkingContext } = this;

    links = Array.isArray(linkedWith) ? linkedWith : [linkedWith];
    contextNode = (typeof linkingContext === 'string' ? document.querySelector(linkingContext) : linkingContext) || document.body;
    for (i = 0, ii = links.length; i < ii; ++i) {
      el = links[i];
      // When user specify to link with something by a string, it acts as a CSS selector
      // We need to do some querying stuff to determine if target above is contained.
      if (typeof el === 'string') {
        // Default behavior, search the whole tree, from context that user specified, which default to document body
        // Function `query` used will be similar to `querySelectorAll`, but optimized for performant
        if (this.searchSubTree) {
          els = contextNode.querySelectorAll(el);
          for (j = 0, jj = els.length; j < jj; ++j) {
            if (els[j].contains(target)) {
              return true;
            }
          }
        } else {
          // default to document body, if user didn't define a linking context, and wanted to ignore subtree.
          // This is specifically performant and useful for dialogs, plugins
          // that usually generate contents to document body
          els = contextNode.children;
          for (j = 0, jj = els.length; j < jj; ++j) {
            if (els[j].matches(el)) {
              return true;
            }
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
      this.onBlur.call(null);
    }
    this.value = false;
  }
}

function addListener(el: EventTarget, ev: string, listener: EventListenerOrEventListenerObject, capture: boolean) {
  el.addEventListener(ev, listener, capture);
}
function removeListener(el: EventTarget, ev: string, listener: EventListenerOrEventListenerObject, capture: boolean) {
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

let checkTargets: Blur[] = [];
function unregister(attr: Blur) {
  let idx = checkTargets.indexOf(attr);
  if (idx !== -1) checkTargets.splice(idx, 1);
}

let setTimeout = global.setTimeout
let alreadyChecked = false;
let cleanCheckTimeout = 0;
function revertAlreadyChecked() {
  alreadyChecked = false;
  cleanCheckTimeout = 0;
}

function handlePointerDown(e: PointerEvent) {
  let target = getTargetFromEvent(e);
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (global === target || !attr.contains(target as Element)) {
      attr.triggerBlur();
    }
  }
  alreadyChecked = true;
  cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
}

function handleTouchStart(e: TouchEvent) {
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
    if (target === global || !attr.contains(target as Element)) {
      attr.triggerBlur();
    }
  }
  alreadyChecked = true;
  cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
}

function handleMousedown(e: MouseEvent) {
  if (alreadyChecked) {
    clearTimeout(cleanCheckTimeout);
    revertAlreadyChecked();
    return;
  }
  let target = getTargetFromEvent(e);
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (global === target || !attr.contains(target as Element)) {
      attr.triggerBlur();
    }
  }
  alreadyChecked = true;
  cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
}

function handleWindowFocus(e: FocusEvent) {
  if (alreadyChecked) {
    clearTimeout(cleanCheckTimeout);
    revertAlreadyChecked();
    return;
  }
  let target = getTargetFromEvent(e);
  let shouldBlur = target === global;
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    let attr = checkTargets[i];
    if (shouldBlur || !attr.contains(target as Element)) {
      attr.triggerBlur();
    }
  }
}

function handleWindowBlur() {
  for (let i = 0, ii = checkTargets.length; i < ii; ++i) {
    checkTargets[i].triggerBlur();
  }
}

function getTargetFromEvent(e: Event) {
  return e.target;
}
