define('aurelia-blur-attribute', ['exports', 'aurelia-pal', 'aurelia-templating', 'aurelia-binding'], function (exports, aureliaPal, aureliaTemplating, aureliaBinding) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    // let useTouch = false;
    var useMouse = false;
    var Blur = /** @class */ (function () {
        function Blur(element) {
            this.element = element;
            /**
             * Only used when linkedWith is a string.
             * Used to determine whether to use querySelector / querySelectorAll to find all interactable elements without triggering blur
             * Performace wise Consider using this only when necessary
             */
            this.linkedMultiple = true;
            /**
             * Only used when linkedWith is a string, or an array containing some strings
             * During query for finding element to link with:
             * - true: search all children, using `querySelectorAll`
             * - false: search immediate children using for loop
             */
            this.searchSubTree = true;
            /**
             * Only used when linkedWith is a string. or an array containing a string
             * Determine from which node/ nodes, search for elements
             */
            this.linkingContext = null;
        }
        Blur_1 = Blur;
        Blur.inject = function () {
            return [aureliaPal.DOM.Element];
        };
        Blur.use = function (cfg) {
            for (var i in cfg) {
                if (i in this.listen) {
                    this.listen[i](cfg[i]);
                }
            }
        };
        Blur.prototype.attached = function () {
            checkTargets.push(this);
        };
        Blur.prototype.detached = function () {
            unregister(this);
        };
        Blur.prototype.contains = function (target) {
            if (!this.value) {
                return false;
            }
            var els;
            var el;
            var i, ii;
            var j, jj;
            var links;
            var contextNode;
            if (this.element.contains(target)) {
                return true;
            }
            if (!this.linkedWith) {
                return false;
            }
            var _a = this, linkedWith = _a.linkedWith, linkingContext = _a.linkingContext;
            links = Array.isArray(linkedWith) ? linkedWith : [linkedWith];
            contextNode = (typeof linkingContext === 'string' ? aureliaPal.PLATFORM.global.document.querySelector(linkingContext) : linkingContext) || aureliaPal.PLATFORM.global.document.body;
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
                    }
                    else {
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
                }
                else {
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
        };
        Blur.prototype.triggerBlur = function () {
            if (typeof this.onBlur === 'function') {
                this.onBlur.call(null);
            }
            this.value = false;
        };
        Blur.listen = {
            touch: function (on) {
                // useTouch = !!on;
                var fn = on ? addListener : removeListener;
                fn(aureliaPal.PLATFORM.global.document, 'touchstart', handleTouchStart, true);
                return Blur_1.listen;
            },
            mouse: function (on) {
                useMouse = !!on;
                var fn = on ? addListener : removeListener;
                fn(aureliaPal.PLATFORM.global.document, 'mousedown', handleMousedown, true);
                return Blur_1.listen;
            },
            pointer: function (on) {
                // usePointer = !!on;
                var fn = on ? addListener : removeListener;
                fn(aureliaPal.PLATFORM.global.document, 'pointerdown', handlePointerDown, true);
                return Blur_1.listen;
            },
            focus: function (on) {
                // useFocus = !!on;
                var fn = on ? addListener : removeListener;
                fn(aureliaPal.PLATFORM.global, 'focus', handleWindowFocus, true);
                return Blur_1.listen;
            },
            windowBlur: function (on) {
                var fn = on ? addListener : removeListener;
                fn(aureliaPal.PLATFORM.global, 'blur', handleWindowBlur, false);
                return Blur_1.listen;
            }
        };
        __decorate([
            aureliaTemplating.bindable({
                primaryProperty: true,
                defaultBindingMode: aureliaBinding.bindingMode.twoWay
            })
        ], Blur.prototype, "value", void 0);
        __decorate([
            aureliaTemplating.bindable
        ], Blur.prototype, "onBlur", void 0);
        __decorate([
            aureliaTemplating.bindable
        ], Blur.prototype, "linkedWith", void 0);
        __decorate([
            aureliaTemplating.bindable
        ], Blur.prototype, "linkedMultiple", void 0);
        __decorate([
            aureliaTemplating.bindable
        ], Blur.prototype, "searchSubTree", void 0);
        __decorate([
            aureliaTemplating.bindable
        ], Blur.prototype, "linkingContext", void 0);
        Blur = Blur_1 = __decorate([
            aureliaTemplating.customAttribute('blur', aureliaBinding.bindingMode.twoWay)
        ], Blur);
        return Blur;
        var Blur_1;
    }());
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
    var checkTargets = [];
    function unregister(attr) {
        var idx = checkTargets.indexOf(attr);
        if (idx !== -1)
            checkTargets.splice(idx, 1);
    }
    var alreadyChecked = false;
    var cleanCheckTimeout = 0;
    function revertAlreadyChecked() {
        alreadyChecked = false;
        cleanCheckTimeout = 0;
    }
    function handlePointerDown(e) {
        var target = getTargetFromEvent(e);
        for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
            var attr = checkTargets[i];
            if (aureliaPal.PLATFORM.global === target || !attr.contains(target)) {
                attr.triggerBlur();
            }
        }
        alreadyChecked = true;
        cleanCheckTimeout = setTimeout(revertAlreadyChecked, 50);
    }
    function handleTouchStart(e) {
        if (alreadyChecked) {
            if (!useMouse) { // If user listen to mouse even, dont revert, let mousedownHandler do the job
                clearTimeout(cleanCheckTimeout);
                revertAlreadyChecked();
            }
            return;
        }
        var target = getTargetFromEvent(e);
        for (var i = 0, ii = checkTargets.length; i < ii; ++i) {
            var attr = checkTargets[i];
            if (target === aureliaPal.PLATFORM.global || !attr.contains(target)) {
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
            if (aureliaPal.PLATFORM.global === target || !attr.contains(target)) {
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
        var shouldBlur = target === aureliaPal.PLATFORM.global;
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

    var defaultConfig = {
        mouse: true,
        touch: false,
        pointer: false,
        focus: true,
        windowBlur: true
    };
    function configure(frameworkConfig, blurConfig) {
        frameworkConfig.globalResources(Blur);
        Blur.use(Object.assign({}, defaultConfig, blurConfig));
    }

    exports.configure = configure;
    exports.Blur = Blur;

    Object.defineProperty(exports, '__esModule', { value: true });

});
