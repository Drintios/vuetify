var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import '../../../src/stylus/components/_dialogs.styl';
// Mixins
import Dependent from '../../mixins/dependent';
import Detachable from '../../mixins/detachable';
import Overlayable from '../../mixins/overlayable';
import Returnable from '../../mixins/returnable';
import Stackable from '../../mixins/stackable';
import Toggleable from '../../mixins/toggleable';
// Directives
import ClickOutside from '../../directives/click-outside';
// Helpers
import { getZIndex, convertToUnit } from '../../util/helpers';
import ThemeProvider from '../../util/ThemeProvider';
/* @vue/component */
export default {
    name: 'v-dialog',
    directives: {
        ClickOutside: ClickOutside
    },
    mixins: [Dependent, Detachable, Overlayable, Returnable, Stackable, Toggleable],
    props: {
        disabled: Boolean,
        persistent: Boolean,
        fullscreen: Boolean,
        fullWidth: Boolean,
        noClickAnimation: Boolean,
        light: Boolean,
        dark: Boolean,
        maxWidth: {
            type: [String, Number],
            default: 'none'
        },
        origin: {
            type: String,
            default: 'center center'
        },
        width: {
            type: [String, Number],
            default: 'auto'
        },
        scrollable: Boolean,
        transition: {
            type: [String, Boolean],
            default: 'dialog-transition'
        }
    },
    data: function data() {
        return {
            animate: false,
            animateTimeout: null,
            stackClass: 'v-dialog__content--active',
            stackMinZIndex: 200
        };
    },

    computed: {
        classes: function classes() {
            var _ref;

            return _ref = {}, _defineProperty(_ref, ('v-dialog ' + this.contentClass).trim(), true), _defineProperty(_ref, 'v-dialog--active', this.isActive), _defineProperty(_ref, 'v-dialog--persistent', this.persistent), _defineProperty(_ref, 'v-dialog--fullscreen', this.fullscreen), _defineProperty(_ref, 'v-dialog--scrollable', this.scrollable), _defineProperty(_ref, 'v-dialog--animated', this.animate), _ref;
        },
        contentClasses: function contentClasses() {
            return {
                'v-dialog__content': true,
                'v-dialog__content--active': this.isActive
            };
        }
    },
    watch: {
        isActive: function isActive(val) {
            if (val) {
                this.show();
                this.hideScroll();
            } else {
                this.removeOverlay();
                this.unbind();
            }
        },
        fullscreen: function fullscreen(val) {
            if (!this.isActive) return;
            if (val) {
                this.hideScroll();
                this.removeOverlay(false);
            } else {
                this.showScroll();
                this.genOverlay();
            }
        }
    },
    beforeMount: function beforeMount() {
        var _this = this;

        this.$nextTick(function () {
            _this.isBooted = _this.isActive;
            _this.isActive && _this.show();
        });
    },
    beforeDestroy: function beforeDestroy() {
        if (typeof window !== 'undefined') this.unbind();
    },

    methods: {
        animateClick: function animateClick() {
            var _this2 = this;

            this.animate = false;
            // Needed for when clicking very fast
            // outside of the dialog
            this.$nextTick(function () {
                _this2.animate = true;
                clearTimeout(_this2.animateTimeout);
                _this2.animateTimeout = setTimeout(function () {
                    return _this2.animate = false;
                }, 150);
            });
        },
        closeConditional: function closeConditional(e) {
            // If the dialog content contains
            // the click event, or if the
            // dialog is not active
            if (this.$refs.content.contains(e.target) || !this.isActive) return false;
            // If we made it here, the click is outside
            // and is active. If persistent, and the
            // click is on the overlay, animate
            if (this.persistent) {
                if (!this.noClickAnimation && this.overlay === e.target) this.animateClick();
                return false;
            }
            // close dialog if !persistent, clicked outside and we're the topmost dialog.
            // Since this should only be called in a capture event (bottom up), we shouldn't need to stop propagation
            return getZIndex(this.$refs.content) >= this.getMaxZIndex();
        },
        hideScroll: function hideScroll() {
            if (this.fullscreen) {
                document.documentElement.classList.add('overflow-y-hidden');
            } else {
                Overlayable.methods.hideScroll.call(this);
            }
        },
        show: function show() {
            !this.fullscreen && !this.hideOverlay && this.genOverlay();
            this.$refs.content.focus();
            this.$listeners.keydown && this.bind();
        },
        bind: function bind() {
            window.addEventListener('keydown', this.onKeydown);
        },
        unbind: function unbind() {
            window.removeEventListener('keydown', this.onKeydown);
        },
        onKeydown: function onKeydown(e) {
            this.$emit('keydown', e);
        },
        genActivator: function genActivator() {
            var _this3 = this;

            if (!this.$slots.activator && !this.$scopedSlots.activator) return null;
            var listeners = this.disabled ? {} : {
                click: function click(e) {
                    e.stopPropagation();
                    if (!_this3.disabled) _this3.isActive = !_this3.isActive;
                }
            };
            if (this.$scopedSlots.activator) {
                var activator = this.$scopedSlots.activator({ on: listeners });
                this.activatorNode = activator;
                return activator;
            }
            return this.$createElement('div', {
                staticClass: 'v-dialog__activator',
                'class': {
                    'v-dialog__activator--disabled': this.disabled
                },
                on: listeners
            }, [this.$slots.activator]);
        }
    },
    render: function render(h) {
        var _this4 = this;

        var children = [];
        var data = {
            'class': this.classes,
            ref: 'dialog',
            directives: [{
                name: 'click-outside',
                value: function value() {
                    return _this4.isActive = false;
                },
                args: {
                    closeConditional: this.closeConditional,
                    include: this.getOpenDependentElements
                }
            }, { name: 'show', value: this.isActive }],
            on: {
                click: function click(e) {
                    e.stopPropagation();
                }
            }
        };
        if (!this.fullscreen) {
            data.style = {
                maxWidth: this.maxWidth === 'none' ? undefined : convertToUnit(this.maxWidth),
                width: this.width === 'auto' ? undefined : convertToUnit(this.width)
            };
        }
        children.push(this.genActivator());
        var dialog = h('div', data, this.showLazyContent(this.$slots.default));
        if (this.transition) {
            dialog = h('transition', {
                props: {
                    name: this.transition,
                    origin: this.origin
                }
            }, [dialog]);
        }
        children.push(h('div', {
            'class': this.contentClasses,
            attrs: _extends({
                tabIndex: '-1'
            }, this.getScopeIdAttrs()),
            style: { zIndex: this.activeZIndex },
            ref: 'content'
        }, [this.$createElement(ThemeProvider, {
            props: {
                root: true,
                light: this.light,
                dark: this.dark
            }
        }, [dialog])]));
        return h('div', {
            staticClass: 'v-dialog__container',
            style: {
                display: !this.$slots.activator || this.fullWidth ? 'block' : 'inline-block'
            }
        }, children);
    }
};
//# sourceMappingURL=VDialog.js.map