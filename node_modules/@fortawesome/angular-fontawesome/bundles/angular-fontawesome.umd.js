(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fortawesome/fontawesome-svg-core'), require('@angular/core'), require('@angular/platform-browser'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@fortawesome/angular-fontawesome', ['exports', '@fortawesome/fontawesome-svg-core', '@angular/core', '@angular/platform-browser', '@angular/common'], factory) :
    (factory((global.fortawesome = global.fortawesome || {}, global.fortawesome['angular-fontawesome'] = {}),global.fontawesomeSvgCore,global.ng.core,global.ng.platformBrowser,global.ng.common));
}(this, (function (exports,fontawesomeSvgCore,i0,platformBrowser,common) { 'use strict';

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
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** *
     * Returns if is IconLookup or not.
      @type {?} */
    var isIconLookup = function (i) {
        return ( /** @type {?} */(i)).prefix !== undefined && ( /** @type {?} */(i)).iconName !== undefined;
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** *
     * Normalizing icon spec.
      @type {?} */
    var faNormalizeIconSpec = function (iconSpec, defaultPrefix) {
        if (defaultPrefix === void 0) {
            defaultPrefix = 'fas';
        }
        if (typeof iconSpec === 'undefined' || iconSpec === null) {
            return null;
        }
        if (isIconLookup(iconSpec)) {
            return iconSpec;
        }
        if (Array.isArray(iconSpec) && ( /** @type {?} */(iconSpec)).length === 2) {
            return { prefix: iconSpec[0], iconName: iconSpec[1] };
        }
        if (typeof iconSpec === 'string') {
            return { prefix: defaultPrefix, iconName: iconSpec };
        }
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var objectWithKey = function (key, value) {
        var _a;
        return (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value) ? (_a = {}, _a[key] = value, _a) : {};
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** *
     * Fontawesome class list.
     * Returns classes array by props.
      @type {?} */
    var faClassList = function (props) {
        var _a;
        /** @type {?} */
        var classes = (_a = {
            'fa-spin': props.spin,
            'fa-pulse': props.pulse,
            'fa-fw': props.fixedWidth,
            'fa-border': props.border,
            'fa-li': props.listItem,
            'fa-inverse': props.inverse,
            'fa-layers-counter': props.counter,
            'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
            'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both'
        },
            _a["fa-" + props.size] = props.size !== null,
            _a["fa-rotate-" + props.rotate] = props.rotate !== null,
            _a["fa-pull-" + props.pull] = props.pull !== null,
            _a);
        return Object.keys(classes)
            .map(function (key) { return (classes[key] ? key : null); })
            .filter(function (key) { return key; });
    };
    /** @type {?} */
    var faLayerClassList = function (props) {
        var _a;
        /** @type {?} */
        var classes = (_a = {
            'fa-fw': props.fixedWidth
        },
            _a["fa-" + props.size] = props.size !== null,
            _a);
        return Object.keys(classes)
            .map(function (key) { return (classes[key] ? key : null); })
            .filter(function (key) { return key; });
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var faWarnIfIconHtmlMissing = function (iconObj, iconSpec) {
        if (iconSpec && !iconObj) {
            console.error("FontAwesome: Could not find icon with iconName=" + iconSpec.iconName + " and prefix=" + iconSpec.prefix);
        }
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var faWarnIfIconSpecMissing = function (iconSpec) {
        if (!iconSpec) {
            console.error('FontAwesome: Could not find icon. ' +
                "It looks like you've provided a null or undefined icon object to this component.");
        }
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var faNotFoundIconHtml = "<svg class=\"" + fontawesomeSvgCore.config.replacementClass + "\" viewBox=\"0 0 448 512\"></svg><!--icon not found-->";

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FaIconService = /** @class */ (function () {
        function FaIconService() {
            this.defaultPrefix = 'fas';
        }
        FaIconService.decorators = [
            { type: i0.Injectable, args: [{ providedIn: 'root' },] }
        ];
        /** @nocollapse */ FaIconService.ngInjectableDef = i0.defineInjectable({ factory: function FaIconService_Factory() { return new FaIconService(); }, token: FaIconService, providedIn: "root" });
        return FaIconService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Fontawesome icon.
     */
    var FaIconComponent = /** @class */ (function () {
        function FaIconComponent(sanitizer, iconService) {
            this.sanitizer = sanitizer;
            this.iconService = iconService;
            this.classes = [];
        }
        /**
         * @param {?} changes
         * @return {?}
         */
        FaIconComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes) {
                    this.updateIconSpec();
                    this.updateParams();
                    this.updateIcon();
                    this.renderIcon();
                }
            };
        /**
         * Updating icon spec.
         * @return {?}
         */
        FaIconComponent.prototype.updateIconSpec = /**
         * Updating icon spec.
         * @return {?}
         */
            function () {
                this.iconSpec = faNormalizeIconSpec(this.iconProp, this.iconService.defaultPrefix);
            };
        /**
         * Updating params by component props.
         * @return {?}
         */
        FaIconComponent.prototype.updateParams = /**
         * Updating params by component props.
         * @return {?}
         */
            function () {
                /** @type {?} */
                var classOpts = {
                    flip: this.flip,
                    spin: this.spin,
                    pulse: this.pulse,
                    border: this.border,
                    inverse: this.inverse,
                    listItem: this.listItem,
                    size: this.size || null,
                    pull: this.pull || null,
                    rotate: this.rotate || null,
                    fixedWidth: this.fixedWidth
                };
                /** @type {?} */
                var classes = objectWithKey('classes', __spread(faClassList(classOpts), this.classes));
                /** @type {?} */
                var mask = objectWithKey('mask', faNormalizeIconSpec(this.mask, this.iconService.defaultPrefix));
                /** @type {?} */
                var parsedTransform = typeof this.transform === 'string' ? fontawesomeSvgCore.parse.transform(this.transform) : this.transform;
                /** @type {?} */
                var transform = objectWithKey('transform', parsedTransform);
                this.params = __assign({ title: this.title }, transform, classes, mask, { styles: this.styles, symbol: this.symbol });
            };
        /**
         * Updating icon by params and icon spec.
         * @return {?}
         */
        FaIconComponent.prototype.updateIcon = /**
         * Updating icon by params and icon spec.
         * @return {?}
         */
            function () {
                this.icon = fontawesomeSvgCore.icon(this.iconSpec, this.params);
            };
        /**
         * Rendering icon.
         * @return {?}
         */
        FaIconComponent.prototype.renderIcon = /**
         * Rendering icon.
         * @return {?}
         */
            function () {
                faWarnIfIconSpecMissing(this.iconSpec);
                faWarnIfIconHtmlMissing(this.icon, this.iconSpec);
                this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(this.icon ? this.icon.html.join('\n') : faNotFoundIconHtml);
            };
        FaIconComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'fa-icon',
                        template: "",
                        host: {
                            class: 'ng-fa-icon',
                        }
                    }] }
        ];
        /** @nocollapse */
        FaIconComponent.ctorParameters = function () {
            return [
                { type: platformBrowser.DomSanitizer },
                { type: FaIconService }
            ];
        };
        FaIconComponent.propDecorators = {
            iconProp: [{ type: i0.Input, args: ['icon',] }],
            title: [{ type: i0.Input }],
            spin: [{ type: i0.Input }],
            pulse: [{ type: i0.Input }],
            mask: [{ type: i0.Input }],
            styles: [{ type: i0.Input }],
            flip: [{ type: i0.Input }],
            size: [{ type: i0.Input }],
            pull: [{ type: i0.Input }],
            border: [{ type: i0.Input }],
            inverse: [{ type: i0.Input }],
            symbol: [{ type: i0.Input }],
            listItem: [{ type: i0.Input }],
            rotate: [{ type: i0.Input }],
            fixedWidth: [{ type: i0.Input }],
            classes: [{ type: i0.Input }],
            transform: [{ type: i0.Input }],
            renderedIconHTML: [{ type: i0.HostBinding, args: ['innerHTML',] }]
        };
        return FaIconComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Fontawesome layers.
     */
    var FaLayersComponent = /** @class */ (function () {
        function FaLayersComponent() {
            this.hostClass = 'fa-layers';
        }
        /**
         * @return {?}
         */
        FaLayersComponent.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.updateClasses();
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        FaLayersComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes) {
                    this.updateClasses();
                }
            };
        /**
         * @return {?}
         */
        FaLayersComponent.prototype.updateClasses = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var classOpts = {
                    size: this.size || null,
                    fixedWidth: this.fixedWidth,
                };
                this.hostClass = "fa-layers " + faLayerClassList(classOpts).join(' ');
            };
        FaLayersComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'fa-layers',
                        template: "<ng-content select=\"fa-icon, fa-layers-text, fa-layers-counter\"></ng-content>"
                    }] }
        ];
        FaLayersComponent.propDecorators = {
            size: [{ type: i0.Input }],
            fixedWidth: [{ type: i0.Input }],
            hostClass: [{ type: i0.HostBinding, args: ['class',] }]
        };
        return FaLayersComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** *
     * Warns if parent component not existing.
      @type {?} */
    var faWarnIfParentNotExist = function (parent, parentName, childName) {
        if (!parent) {
            console.error("FontAwesome: " + childName + " should be used as child of " + parentName + " only.");
        }
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * @abstract
     */
    var FaLayersTextBaseComponent = /** @class */ (function () {
        function FaLayersTextBaseComponent(parent, sanitizer) {
            this.parent = parent;
            this.sanitizer = sanitizer;
            this.classes = [];
            faWarnIfParentNotExist(this.parent, 'FaLayersComponent', this.constructor.name);
        }
        /**
         * @param {?} changes
         * @return {?}
         */
        FaLayersTextBaseComponent.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes) {
                    this.updateParams();
                    this.updateContent();
                }
            };
        /**
         * Updating content by params and content.
         * @return {?}
         */
        FaLayersTextBaseComponent.prototype.updateContent = /**
         * Updating content by params and content.
         * @return {?}
         */
            function () {
                this.renderedHTML = this.sanitizer.bypassSecurityTrustHtml(this.renderFontawesomeObject(this.content || '', this.params).html.join('\n'));
            };
        FaLayersTextBaseComponent.decorators = [
            { type: i0.Injectable }
        ];
        /** @nocollapse */
        FaLayersTextBaseComponent.ctorParameters = function () {
            return [
                { type: FaLayersComponent, decorators: [{ type: i0.Inject, args: [i0.forwardRef(function () { return FaLayersComponent; }),] }, { type: i0.Optional }] },
                { type: platformBrowser.DomSanitizer }
            ];
        };
        FaLayersTextBaseComponent.propDecorators = {
            renderedHTML: [{ type: i0.HostBinding, args: ['innerHTML',] }],
            content: [{ type: i0.Input }],
            title: [{ type: i0.Input }],
            styles: [{ type: i0.Input }],
            classes: [{ type: i0.Input }]
        };
        return FaLayersTextBaseComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Fontawesome layers text.
     */
    var FaLayersTextComponent = /** @class */ (function (_super) {
        __extends(FaLayersTextComponent, _super);
        function FaLayersTextComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Updating params by component props.
         */
        /**
         * Updating params by component props.
         * @return {?}
         */
        FaLayersTextComponent.prototype.updateParams = /**
         * Updating params by component props.
         * @return {?}
         */
            function () {
                /** @type {?} */
                var classOpts = {
                    flip: this.flip,
                    spin: this.spin,
                    pulse: this.pulse,
                    border: this.border,
                    inverse: this.inverse,
                    listItem: this.listItem,
                    size: this.size || null,
                    pull: this.pull || null,
                    rotate: this.rotate || null,
                    fixedWidth: this.fixedWidth
                };
                /** @type {?} */
                var classes = objectWithKey('classes', __spread(faClassList(classOpts), this.classes));
                /** @type {?} */
                var parsedTransform = typeof this.transform === 'string' ? fontawesomeSvgCore.parse.transform(this.transform) : this.transform;
                /** @type {?} */
                var transform = objectWithKey('transform', parsedTransform);
                this.params = __assign({}, transform, classes, { title: this.title, styles: this.styles });
            };
        /**
         * @param {?} content
         * @param {?=} params
         * @return {?}
         */
        FaLayersTextComponent.prototype.renderFontawesomeObject = /**
         * @param {?} content
         * @param {?=} params
         * @return {?}
         */
            function (content, params) {
                return fontawesomeSvgCore.text(content, params);
            };
        FaLayersTextComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'fa-layers-text',
                        template: '',
                        host: {
                            class: 'ng-fa-layers-text'
                        }
                    }] }
        ];
        FaLayersTextComponent.propDecorators = {
            spin: [{ type: i0.Input }],
            pulse: [{ type: i0.Input }],
            flip: [{ type: i0.Input }],
            size: [{ type: i0.Input }],
            pull: [{ type: i0.Input }],
            border: [{ type: i0.Input }],
            inverse: [{ type: i0.Input }],
            listItem: [{ type: i0.Input }],
            rotate: [{ type: i0.Input }],
            fixedWidth: [{ type: i0.Input }],
            transform: [{ type: i0.Input }]
        };
        return FaLayersTextComponent;
    }(FaLayersTextBaseComponent));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * Fontawesome layers counter.
     */
    var FaLayersCounterComponent = /** @class */ (function (_super) {
        __extends(FaLayersCounterComponent, _super);
        function FaLayersCounterComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Updating params by component props.
         */
        /**
         * Updating params by component props.
         * @return {?}
         */
        FaLayersCounterComponent.prototype.updateParams = /**
         * Updating params by component props.
         * @return {?}
         */
            function () {
                this.params = {
                    title: this.title,
                    classes: this.classes,
                    styles: this.styles,
                };
            };
        /**
         * @param {?} content
         * @param {?=} params
         * @return {?}
         */
        FaLayersCounterComponent.prototype.renderFontawesomeObject = /**
         * @param {?} content
         * @param {?=} params
         * @return {?}
         */
            function (content, params) {
                return fontawesomeSvgCore.counter(content, params);
            };
        FaLayersCounterComponent.decorators = [
            { type: i0.Component, args: [{
                        selector: 'fa-layers-counter',
                        template: '',
                        host: {
                            class: 'ng-fa-layers-counter'
                        }
                    }] }
        ];
        return FaLayersCounterComponent;
    }(FaLayersTextBaseComponent));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var FontAwesomeModule = /** @class */ (function () {
        function FontAwesomeModule() {
        }
        FontAwesomeModule.decorators = [
            { type: i0.NgModule, args: [{
                        imports: [common.CommonModule],
                        declarations: [
                            FaIconComponent,
                            FaLayersComponent,
                            FaLayersTextComponent,
                            FaLayersCounterComponent,
                        ],
                        exports: [
                            FaIconComponent,
                            FaLayersComponent,
                            FaLayersTextComponent,
                            FaLayersCounterComponent,
                        ],
                    },] }
        ];
        return FontAwesomeModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.FontAwesomeModule = FontAwesomeModule;
    exports.FaIconComponent = FaIconComponent;
    exports.FaIconService = FaIconService;
    exports.FaLayersComponent = FaLayersComponent;
    exports.FaLayersTextComponent = FaLayersTextComponent;
    exports.FaLayersCounterComponent = FaLayersCounterComponent;
    exports.ɵa = FaLayersTextBaseComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1mb250YXdlc29tZS51bWQuanMubWFwIiwic291cmNlcyI6WyJub2RlX21vZHVsZXMvdHNsaWIvdHNsaWIuZXM2LmpzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9zaGFyZWQvdXRpbHMvaXMtaWNvbi1sb29rdXAudXRpbC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvc2hhcmVkL3V0aWxzL25vcm1hbGl6ZS1pY29uLXNwZWMudXRpbC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvc2hhcmVkL3V0aWxzL29iamVjdC13aXRoLWtleXMudXRpbC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvc2hhcmVkL3V0aWxzL2NsYXNzbGlzdC51dGlsLnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9zaGFyZWQvZXJyb3JzL3dhcm4taWYtaWNvbi1odG1sLW1pc3NpbmcudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL3NoYXJlZC9lcnJvcnMvd2Fybi1pZi1pY29uLXNwZWMtbWlzc2luZy50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvc2hhcmVkL2Vycm9ycy9ub3QtZm91bmQtaWNvbi1odG1sLnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9pY29uL2ljb24uc2VydmljZS50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvaWNvbi9pY29uLmNvbXBvbmVudC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvbGF5ZXJzL2xheWVycy5jb21wb25lbnQudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL3NoYXJlZC9lcnJvcnMvd2Fybi1pZi1wYXJlbnQtbm90LWV4aXN0LnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9sYXllcnMvbGF5ZXJzLXRleHQtYmFzZS5jb21wb25lbnQudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL2xheWVycy9sYXllcnMtdGV4dC5jb21wb25lbnQudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL2xheWVycy9sYXllcnMtY291bnRlci5jb21wb25lbnQudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL2ZvbnRhd2Vzb21lLm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbkxpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZVxyXG50aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS4gWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZVxyXG5MaWNlbnNlIGF0IGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG5cclxuVEhJUyBDT0RFIElTIFBST1ZJREVEIE9OIEFOICpBUyBJUyogQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWVxyXG5LSU5ELCBFSVRIRVIgRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgV0lUSE9VVCBMSU1JVEFUSU9OIEFOWSBJTVBMSUVEXHJcbldBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBUSVRMRSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UsXHJcbk1FUkNIQU5UQUJMSVRZIE9SIE5PTi1JTkZSSU5HRU1FTlQuXHJcblxyXG5TZWUgdGhlIEFwYWNoZSBWZXJzaW9uIDIuMCBMaWNlbnNlIGZvciBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnNcclxuYW5kIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xyXG4gICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHRlbmRzKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbb3BbMF0gJiAyLCB0LnZhbHVlXTtcclxuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IF8ubGFiZWwrKzsgcmV0dXJuIHsgdmFsdWU6IG9wWzFdLCBkb25lOiBmYWxzZSB9O1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gNiAmJiBfLmxhYmVsIDwgdFsxXSkgeyBfLmxhYmVsID0gdFsxXTsgdCA9IG9wOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7IG9wID0gWzYsIGVdOyB5ID0gMDsgfSBmaW5hbGx5IHsgZiA9IHQgPSAwOyB9XHJcbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgZXhwb3J0cykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAoIWV4cG9ydHMuaGFzT3duUHJvcGVydHkocCkpIGV4cG9ydHNbcF0gPSBtW3BdO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnRTdGFyKG1vZCkge1xyXG4gICAgaWYgKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgcmV0dXJuIG1vZDtcclxuICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgIGlmIChtb2QgIT0gbnVsbCkgZm9yICh2YXIgayBpbiBtb2QpIGlmIChPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbChtb2QsIGspKSByZXN1bHRba10gPSBtb2Rba107XHJcbiAgICByZXN1bHQuZGVmYXVsdCA9IG1vZDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2ltcG9ydERlZmF1bHQobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IGRlZmF1bHQ6IG1vZCB9O1xyXG59XHJcbiIsImltcG9ydCB7SWNvbkxvb2t1cCwgSWNvblByb3B9IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5cbi8qKlxuICogUmV0dXJucyBpZiBpcyBJY29uTG9va3VwIG9yIG5vdC5cbiAqL1xuZXhwb3J0IGNvbnN0IGlzSWNvbkxvb2t1cCA9IChpOiBJY29uUHJvcCk6IGkgaXMgSWNvbkxvb2t1cCA9PiB7XG4gIHJldHVybiAoPEljb25Mb29rdXA+aSkucHJlZml4ICE9PSB1bmRlZmluZWQgJiYgKDxJY29uTG9va3VwPmkpLmljb25OYW1lICE9PSB1bmRlZmluZWQ7XG59O1xuIiwiaW1wb3J0IHsgSWNvbkxvb2t1cCwgSWNvblByb3AsIEljb25QcmVmaXggfSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuXG5pbXBvcnQgeyBpc0ljb25Mb29rdXAgfSBmcm9tICcuL2lzLWljb24tbG9va3VwLnV0aWwnO1xuXG4vKipcbiAqIE5vcm1hbGl6aW5nIGljb24gc3BlYy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZhTm9ybWFsaXplSWNvblNwZWMgPSAoaWNvblNwZWM6IEljb25Qcm9wLCBkZWZhdWx0UHJlZml4OiBJY29uUHJlZml4ID0gJ2ZhcycpOiBJY29uTG9va3VwID0+IHtcblxuICBpZiAodHlwZW9mIGljb25TcGVjID09PSAndW5kZWZpbmVkJyB8fCBpY29uU3BlYyA9PT0gbnVsbCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKGlzSWNvbkxvb2t1cChpY29uU3BlYykpIHtcbiAgICByZXR1cm4gaWNvblNwZWM7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShpY29uU3BlYykgJiYgKDxBcnJheTxzdHJpbmc+Pmljb25TcGVjKS5sZW5ndGggPT09IDIpIHtcbiAgICByZXR1cm4geyBwcmVmaXg6IGljb25TcGVjWzBdLCBpY29uTmFtZTogaWNvblNwZWNbMV0gfTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaWNvblNwZWMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHsgcHJlZml4OiBkZWZhdWx0UHJlZml4LCBpY29uTmFtZTogaWNvblNwZWMgfTtcbiAgfVxufTtcbiIsImV4cG9ydCBjb25zdCBvYmplY3RXaXRoS2V5ID0gPFQ+KGtleTogc3RyaW5nLCB2YWx1ZTogVCk6IHtbaWQ6IHN0cmluZ106IFR9ID0+IHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPiAwKSB8fCAoIUFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlKSA/IHsgW2tleV06IHZhbHVlIH0gOiB7fTtcbn07XG4iLCJpbXBvcnQgeyBGYVByb3BzIH0gZnJvbSAnLi4vbW9kZWxzL3Byb3BzLm1vZGVsJztcblxuLyoqXG4gKiBGb250YXdlc29tZSBjbGFzcyBsaXN0LlxuICogUmV0dXJucyBjbGFzc2VzIGFycmF5IGJ5IHByb3BzLlxuICovXG5leHBvcnQgY29uc3QgZmFDbGFzc0xpc3QgPSAocHJvcHM6IEZhUHJvcHMpOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IGNsYXNzZXMgPSB7XG4gICAgJ2ZhLXNwaW4nOiBwcm9wcy5zcGluLFxuICAgICdmYS1wdWxzZSc6IHByb3BzLnB1bHNlLFxuICAgICdmYS1mdyc6IHByb3BzLmZpeGVkV2lkdGgsXG4gICAgJ2ZhLWJvcmRlcic6IHByb3BzLmJvcmRlcixcbiAgICAnZmEtbGknOiBwcm9wcy5saXN0SXRlbSxcbiAgICAnZmEtaW52ZXJzZSc6IHByb3BzLmludmVyc2UsXG4gICAgJ2ZhLWxheWVycy1jb3VudGVyJzogcHJvcHMuY291bnRlcixcbiAgICAnZmEtZmxpcC1ob3Jpem9udGFsJzogcHJvcHMuZmxpcCA9PT0gJ2hvcml6b250YWwnIHx8IHByb3BzLmZsaXAgPT09ICdib3RoJyxcbiAgICAnZmEtZmxpcC12ZXJ0aWNhbCc6IHByb3BzLmZsaXAgPT09ICd2ZXJ0aWNhbCcgfHwgcHJvcHMuZmxpcCA9PT0gJ2JvdGgnLFxuICAgIFtgZmEtJHtwcm9wcy5zaXplfWBdOiBwcm9wcy5zaXplICE9PSBudWxsLFxuICAgIFtgZmEtcm90YXRlLSR7cHJvcHMucm90YXRlfWBdOiBwcm9wcy5yb3RhdGUgIT09IG51bGwsXG4gICAgW2BmYS1wdWxsLSR7cHJvcHMucHVsbH1gXTogcHJvcHMucHVsbCAhPT0gbnVsbFxuICB9O1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhjbGFzc2VzKVxuICAgIC5tYXAoa2V5ID0+IChjbGFzc2VzW2tleV0gPyBrZXkgOiBudWxsKSlcbiAgICAuZmlsdGVyKGtleSA9PiBrZXkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGZhTGF5ZXJDbGFzc0xpc3QgPSAocHJvcHM6IEZhUHJvcHMpOiBzdHJpbmdbXSA9PiB7XG4gIGNvbnN0IGNsYXNzZXMgPSB7XG4gICAgJ2ZhLWZ3JzogcHJvcHMuZml4ZWRXaWR0aCxcbiAgICBbYGZhLSR7cHJvcHMuc2l6ZX1gXTogcHJvcHMuc2l6ZSAhPT0gbnVsbCxcbiAgfTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMoY2xhc3NlcylcbiAgICAubWFwKGtleSA9PiAoY2xhc3Nlc1trZXldID8ga2V5IDogbnVsbCkpXG4gICAgLmZpbHRlcihrZXkgPT4ga2V5KTtcbn07XG4iLCJpbXBvcnQgeyBJY29uLCBJY29uTG9va3VwIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcblxuZXhwb3J0IGNvbnN0IGZhV2FybklmSWNvbkh0bWxNaXNzaW5nID0gKGljb25PYmo6IEljb24sIGljb25TcGVjOiBJY29uTG9va3VwKSA9PiB7XG4gIGlmIChpY29uU3BlYyAmJiAhaWNvbk9iaikge1xuICAgIGNvbnNvbGUuZXJyb3IoYEZvbnRBd2Vzb21lOiBDb3VsZCBub3QgZmluZCBpY29uIHdpdGggaWNvbk5hbWU9JHtpY29uU3BlYy5pY29uTmFtZX0gYW5kIHByZWZpeD0ke2ljb25TcGVjLnByZWZpeH1gKTtcbiAgfVxufTtcbiIsImltcG9ydCB7IEljb25Mb29rdXAgfSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuXG5leHBvcnQgY29uc3QgZmFXYXJuSWZJY29uU3BlY01pc3NpbmcgPSAoaWNvblNwZWM6IEljb25Mb29rdXApID0+IHtcbiAgaWYgKCFpY29uU3BlYykge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0ZvbnRBd2Vzb21lOiBDb3VsZCBub3QgZmluZCBpY29uLiAnICtcbiAgICAgIGBJdCBsb29rcyBsaWtlIHlvdSd2ZSBwcm92aWRlZCBhIG51bGwgb3IgdW5kZWZpbmVkIGljb24gb2JqZWN0IHRvIHRoaXMgY29tcG9uZW50LmApO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcblxuZXhwb3J0IGNvbnN0IGZhTm90Rm91bmRJY29uSHRtbCA9IGA8c3ZnIGNsYXNzPVwiJHtjb25maWcucmVwbGFjZW1lbnRDbGFzc31cIiB2aWV3Qm94PVwiMCAwIDQ0OCA1MTJcIj48L3N2Zz48IS0taWNvbiBub3QgZm91bmQtLT5gO1xuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSWNvblByZWZpeCB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIEZhSWNvblNlcnZpY2Uge1xuICBkZWZhdWx0UHJlZml4OiBJY29uUHJlZml4ID0gJ2Zhcyc7XG59XG4iLCJpbXBvcnQge1xuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBDb21wb25lbnQsXG4gIEhvc3RCaW5kaW5nLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgaWNvbixcbiAgSWNvbixcbiAgcGFyc2UsXG4gIFN0eWxlcyxcbiAgUHVsbFByb3AsXG4gIEljb25Qcm9wLFxuICBTaXplUHJvcCxcbiAgRmxpcFByb3AsXG4gIEZhU3ltYm9sLFxuICBUcmFuc2Zvcm0sXG4gIEljb25QYXJhbXMsXG4gIEljb25Mb29rdXAsXG4gIFJvdGF0ZVByb3Bcbn0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcbmltcG9ydCB7IERvbVNhbml0aXplciwgU2FmZUh0bWwgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcblxuaW1wb3J0IHsgZmFOb3JtYWxpemVJY29uU3BlYyB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9ub3JtYWxpemUtaWNvbi1zcGVjLnV0aWwnO1xuaW1wb3J0IHsgRmFQcm9wcyB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbHMvcHJvcHMubW9kZWwnO1xuaW1wb3J0IHsgb2JqZWN0V2l0aEtleSB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9vYmplY3Qtd2l0aC1rZXlzLnV0aWwnO1xuaW1wb3J0IHsgZmFDbGFzc0xpc3QgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMvY2xhc3NsaXN0LnV0aWwnO1xuaW1wb3J0IHsgZmFXYXJuSWZJY29uSHRtbE1pc3NpbmcgfSBmcm9tICcuLi9zaGFyZWQvZXJyb3JzL3dhcm4taWYtaWNvbi1odG1sLW1pc3NpbmcnO1xuaW1wb3J0IHsgZmFXYXJuSWZJY29uU3BlY01pc3NpbmcgfSBmcm9tICcuLi9zaGFyZWQvZXJyb3JzL3dhcm4taWYtaWNvbi1zcGVjLW1pc3NpbmcnO1xuaW1wb3J0IHsgZmFOb3RGb3VuZEljb25IdG1sIH0gZnJvbSAnLi4vc2hhcmVkL2Vycm9ycy9ub3QtZm91bmQtaWNvbi1odG1sJztcbmltcG9ydCB7IEZhSWNvblNlcnZpY2UgfSBmcm9tICcuL2ljb24uc2VydmljZSc7XG5cbi8qKlxuICogRm9udGF3ZXNvbWUgaWNvbi5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmEtaWNvbicsXG4gIHRlbXBsYXRlOiBgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbmctZmEtaWNvbicsXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgRmFJY29uQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWlucHV0LXJlbmFtZVxuICBASW5wdXQoJ2ljb24nKSBpY29uUHJvcDogSWNvblByb3A7XG4gIEBJbnB1dCgpIHRpdGxlPzogc3RyaW5nO1xuICBASW5wdXQoKSBzcGluPzogYm9vbGVhbjtcbiAgQElucHV0KCkgcHVsc2U/OiBib29sZWFuO1xuICBASW5wdXQoKSBtYXNrPzogSWNvblByb3A7XG4gIEBJbnB1dCgpIHN0eWxlcz86IFN0eWxlcztcbiAgQElucHV0KCkgZmxpcD86IEZsaXBQcm9wO1xuICBASW5wdXQoKSBzaXplPzogU2l6ZVByb3A7XG4gIEBJbnB1dCgpIHB1bGw/OiBQdWxsUHJvcDtcbiAgQElucHV0KCkgYm9yZGVyPzogYm9vbGVhbjtcbiAgQElucHV0KCkgaW52ZXJzZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHN5bWJvbD86IEZhU3ltYm9sO1xuICBASW5wdXQoKSBsaXN0SXRlbT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJvdGF0ZT86IFJvdGF0ZVByb3A7XG4gIEBJbnB1dCgpIGZpeGVkV2lkdGg/OiBib29sZWFuO1xuICBASW5wdXQoKSBjbGFzc2VzPzogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgdHJhbnNmb3JtPzogc3RyaW5nIHwgVHJhbnNmb3JtO1xuXG4gIHB1YmxpYyBpY29uOiBJY29uO1xuXG4gIEBIb3N0QmluZGluZygnaW5uZXJIVE1MJylcbiAgcHVibGljIHJlbmRlcmVkSWNvbkhUTUw6IFNhZmVIdG1sO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIsIHByaXZhdGUgaWNvblNlcnZpY2U6IEZhSWNvblNlcnZpY2UpIHt9XG5cbiAgcHJpdmF0ZSBwYXJhbXM6IEljb25QYXJhbXM7XG4gIHByaXZhdGUgaWNvblNwZWM6IEljb25Mb29rdXA7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUljb25TcGVjKCk7XG4gICAgICB0aGlzLnVwZGF0ZVBhcmFtcygpO1xuICAgICAgdGhpcy51cGRhdGVJY29uKCk7XG4gICAgICB0aGlzLnJlbmRlckljb24oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgaWNvbiBzcGVjLlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJY29uU3BlYygpIHtcbiAgICB0aGlzLmljb25TcGVjID0gZmFOb3JtYWxpemVJY29uU3BlYyh0aGlzLmljb25Qcm9wLCB0aGlzLmljb25TZXJ2aWNlLmRlZmF1bHRQcmVmaXgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0aW5nIHBhcmFtcyBieSBjb21wb25lbnQgcHJvcHMuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZVBhcmFtcygpIHtcbiAgICBjb25zdCBjbGFzc09wdHM6IEZhUHJvcHMgPSB7XG4gICAgICBmbGlwOiB0aGlzLmZsaXAsXG4gICAgICBzcGluOiB0aGlzLnNwaW4sXG4gICAgICBwdWxzZTogdGhpcy5wdWxzZSxcbiAgICAgIGJvcmRlcjogdGhpcy5ib3JkZXIsXG4gICAgICBpbnZlcnNlOiB0aGlzLmludmVyc2UsXG4gICAgICBsaXN0SXRlbTogdGhpcy5saXN0SXRlbSxcbiAgICAgIHNpemU6IHRoaXMuc2l6ZSB8fCBudWxsLFxuICAgICAgcHVsbDogdGhpcy5wdWxsIHx8IG51bGwsXG4gICAgICByb3RhdGU6IHRoaXMucm90YXRlIHx8IG51bGwsXG4gICAgICBmaXhlZFdpZHRoOiB0aGlzLmZpeGVkV2lkdGhcbiAgICB9O1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IG9iamVjdFdpdGhLZXkoJ2NsYXNzZXMnLCBbLi4uZmFDbGFzc0xpc3QoY2xhc3NPcHRzKSwgLi4udGhpcy5jbGFzc2VzXSk7XG4gICAgY29uc3QgbWFzayA9IG9iamVjdFdpdGhLZXkoJ21hc2snLCBmYU5vcm1hbGl6ZUljb25TcGVjKHRoaXMubWFzaywgdGhpcy5pY29uU2VydmljZS5kZWZhdWx0UHJlZml4KSk7XG4gICAgY29uc3QgcGFyc2VkVHJhbnNmb3JtID0gdHlwZW9mIHRoaXMudHJhbnNmb3JtID09PSAnc3RyaW5nJyA/IHBhcnNlLnRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybSkgOiB0aGlzLnRyYW5zZm9ybTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBvYmplY3RXaXRoS2V5KCd0cmFuc2Zvcm0nLCBwYXJzZWRUcmFuc2Zvcm0pO1xuXG4gICAgdGhpcy5wYXJhbXMgPSB7XG4gICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgIC4uLnRyYW5zZm9ybSxcbiAgICAgIC4uLmNsYXNzZXMsXG4gICAgICAuLi5tYXNrLFxuICAgICAgc3R5bGVzOiB0aGlzLnN0eWxlcyxcbiAgICAgIHN5bWJvbDogdGhpcy5zeW1ib2xcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0aW5nIGljb24gYnkgcGFyYW1zIGFuZCBpY29uIHNwZWMuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUljb24oKSB7XG4gICAgdGhpcy5pY29uID0gaWNvbih0aGlzLmljb25TcGVjLCB0aGlzLnBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyaW5nIGljb24uXG4gICAqL1xuICBwcml2YXRlIHJlbmRlckljb24oKSB7XG4gICAgZmFXYXJuSWZJY29uU3BlY01pc3NpbmcodGhpcy5pY29uU3BlYyk7XG4gICAgZmFXYXJuSWZJY29uSHRtbE1pc3NpbmcodGhpcy5pY29uLCB0aGlzLmljb25TcGVjKTtcblxuICAgIHRoaXMucmVuZGVyZWRJY29uSFRNTCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgdGhpcy5pY29uID8gdGhpcy5pY29uLmh0bWwuam9pbignXFxuJykgOiBmYU5vdEZvdW5kSWNvbkh0bWxcbiAgICApO1xuICB9XG59XG5cbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFNpbXBsZUNoYW5nZXMsIE9uQ2hhbmdlcywgT25Jbml0LCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2l6ZVByb3AgfSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgZmFMYXllckNsYXNzTGlzdCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbCc7XG5pbXBvcnQgeyBGYVByb3BzIH0gZnJvbSAnLi4vc2hhcmVkL21vZGVscy9wcm9wcy5tb2RlbCc7XG5cbi8qKlxuICogRm9udGF3ZXNvbWUgbGF5ZXJzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYS1sYXllcnMnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50IHNlbGVjdD1cImZhLWljb24sIGZhLWxheWVycy10ZXh0LCBmYS1sYXllcnMtY291bnRlclwiPjwvbmctY29udGVudD5gLFxufSlcbmV4cG9ydCBjbGFzcyBGYUxheWVyc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgc2l6ZT86IFNpemVQcm9wO1xuICBASW5wdXQoKSBmaXhlZFdpZHRoPzogYm9vbGVhbjtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgaG9zdENsYXNzID0gJ2ZhLWxheWVycyc7XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNsYXNzZXMoKSB7XG4gICAgY29uc3QgY2xhc3NPcHRzOiBGYVByb3BzID0ge1xuICAgICAgc2l6ZTogdGhpcy5zaXplIHx8IG51bGwsXG4gICAgICBmaXhlZFdpZHRoOiB0aGlzLmZpeGVkV2lkdGgsXG4gICAgfTtcbiAgICB0aGlzLmhvc3RDbGFzcyA9IGBmYS1sYXllcnMgJHtmYUxheWVyQ2xhc3NMaXN0KGNsYXNzT3B0cykuam9pbignICcpfWA7XG4gIH1cblxufVxuIiwiLyoqXG4gKiBXYXJucyBpZiBwYXJlbnQgY29tcG9uZW50IG5vdCBleGlzdGluZy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZhV2FybklmUGFyZW50Tm90RXhpc3QgPSAocGFyZW50OiBhbnksIHBhcmVudE5hbWU6IHN0cmluZywgY2hpbGROYW1lOiBzdHJpbmcpID0+IHtcbiAgaWYgKCFwYXJlbnQpIHtcbiAgICBjb25zb2xlLmVycm9yKGBGb250QXdlc29tZTogJHtjaGlsZE5hbWV9IHNob3VsZCBiZSB1c2VkIGFzIGNoaWxkIG9mICR7cGFyZW50TmFtZX0gb25seS5gKTtcbiAgfVxufTtcbiIsImltcG9ydCB7XG4gIElucHV0LFxuICBJbmplY3QsXG4gIEluamVjdGFibGUsXG4gIE9wdGlvbmFsLFxuICBPbkNoYW5nZXMsXG4gIGZvcndhcmRSZWYsXG4gIEhvc3RCaW5kaW5nLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgU3R5bGVzLFxuICBGb250YXdlc29tZU9iamVjdCxcbiAgVGV4dFBhcmFtc1xufSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBGYUxheWVyc0NvbXBvbmVudCB9IGZyb20gJy4vbGF5ZXJzLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBmYVdhcm5JZlBhcmVudE5vdEV4aXN0IH0gZnJvbSAnLi4vc2hhcmVkL2Vycm9ycy93YXJuLWlmLXBhcmVudC1ub3QtZXhpc3QnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmFMYXllcnNUZXh0QmFzZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQEhvc3RCaW5kaW5nKCdpbm5lckhUTUwnKVxuICBwdWJsaWMgcmVuZGVyZWRIVE1MOiBTYWZlSHRtbDtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gRmFMYXllcnNDb21wb25lbnQpKSBAT3B0aW9uYWwoKSBwcml2YXRlIHBhcmVudDogRmFMYXllcnNDb21wb25lbnQsXG4gICAgcHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplcikge1xuXG4gICAgZmFXYXJuSWZQYXJlbnROb3RFeGlzdCh0aGlzLnBhcmVudCwgJ0ZhTGF5ZXJzQ29tcG9uZW50JywgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBwYXJhbXM6IFRleHRQYXJhbXM7XG5cbiAgQElucHV0KCkgcHJvdGVjdGVkIGNvbnRlbnQ6IHN0cmluZztcbiAgQElucHV0KCkgcHJvdGVjdGVkIHRpdGxlPzogc3RyaW5nO1xuICBASW5wdXQoKSBwcm90ZWN0ZWQgc3R5bGVzPzogU3R5bGVzO1xuICBASW5wdXQoKSBwcm90ZWN0ZWQgY2xhc3Nlcz86IHN0cmluZ1tdID0gW107XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBhcmFtcygpO1xuICAgICAgdGhpcy51cGRhdGVDb250ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0aW5nIHBhcmFtcyBieSBjb21wb25lbnQgcHJvcHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgdXBkYXRlUGFyYW1zKCk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgRm9udGF3ZXNvbWVPYmplY3QgdXNpbmcgdGhlIGNvbnRlbnQgYW5kIHBhcmFtcy5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCByZW5kZXJGb250YXdlc29tZU9iamVjdChjb250ZW50OiBzdHJpbmcgfCBudW1iZXIsIHBhcmFtcz86IFRleHRQYXJhbXMpOiBGb250YXdlc29tZU9iamVjdDtcblxuICAvKipcbiAgICogVXBkYXRpbmcgY29udGVudCBieSBwYXJhbXMgYW5kIGNvbnRlbnQuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUNvbnRlbnQoKSB7XG4gICAgdGhpcy5yZW5kZXJlZEhUTUwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbChcbiAgICAgIHRoaXMucmVuZGVyRm9udGF3ZXNvbWVPYmplY3QodGhpcy5jb250ZW50IHx8ICcnLCB0aGlzLnBhcmFtcykuaHRtbC5qb2luKCdcXG4nKVxuICAgICk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHtcbiAgSW5wdXQsXG4gIENvbXBvbmVudCxcbiAgSG9zdEJpbmRpbmdcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICB0ZXh0LFxuICBwYXJzZSxcbiAgVGV4dCxcbiAgVGV4dFBhcmFtcyxcbiAgU2l6ZVByb3AsXG4gIEZsaXBQcm9wLFxuICBQdWxsUHJvcCxcbiAgVHJhbnNmb3JtLFxuICBSb3RhdGVQcm9wXG59IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5pbXBvcnQgeyBGYUxheWVyc1RleHRCYXNlQ29tcG9uZW50IH0gZnJvbSAnLi9sYXllcnMtdGV4dC1iYXNlLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IEZhUHJvcHMgfSBmcm9tICcuLi9zaGFyZWQvbW9kZWxzL3Byb3BzLm1vZGVsJztcbmltcG9ydCB7IG9iamVjdFdpdGhLZXkgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMvb2JqZWN0LXdpdGgta2V5cy51dGlsJztcbmltcG9ydCB7IGZhQ2xhc3NMaXN0IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL2NsYXNzbGlzdC51dGlsJztcblxuLyoqXG4gKiBGb250YXdlc29tZSBsYXllcnMgdGV4dC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmEtbGF5ZXJzLXRleHQnLFxuICB0ZW1wbGF0ZTogJycsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25nLWZhLWxheWVycy10ZXh0J1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIEZhTGF5ZXJzVGV4dENvbXBvbmVudCBleHRlbmRzIEZhTGF5ZXJzVGV4dEJhc2VDb21wb25lbnQge1xuXG4gIEBJbnB1dCgpIHNwaW4/OiBib29sZWFuO1xuICBASW5wdXQoKSBwdWxzZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGZsaXA/OiBGbGlwUHJvcDtcbiAgQElucHV0KCkgc2l6ZT86IFNpemVQcm9wO1xuICBASW5wdXQoKSBwdWxsPzogUHVsbFByb3A7XG4gIEBJbnB1dCgpIGJvcmRlcj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGludmVyc2U/OiBib29sZWFuO1xuICBASW5wdXQoKSBsaXN0SXRlbT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHJvdGF0ZT86IFJvdGF0ZVByb3A7XG4gIEBJbnB1dCgpIGZpeGVkV2lkdGg/OiBib29sZWFuO1xuICBASW5wdXQoKSB0cmFuc2Zvcm0/OiBzdHJpbmcgfCBUcmFuc2Zvcm07XG5cbiAgLyoqXG4gICAqIFVwZGF0aW5nIHBhcmFtcyBieSBjb21wb25lbnQgcHJvcHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlUGFyYW1zKCkge1xuICAgIGNvbnN0IGNsYXNzT3B0czogRmFQcm9wcyA9IHtcbiAgICAgIGZsaXA6IHRoaXMuZmxpcCxcbiAgICAgIHNwaW46IHRoaXMuc3BpbixcbiAgICAgIHB1bHNlOiB0aGlzLnB1bHNlLFxuICAgICAgYm9yZGVyOiB0aGlzLmJvcmRlcixcbiAgICAgIGludmVyc2U6IHRoaXMuaW52ZXJzZSxcbiAgICAgIGxpc3RJdGVtOiB0aGlzLmxpc3RJdGVtLFxuICAgICAgc2l6ZTogdGhpcy5zaXplIHx8IG51bGwsXG4gICAgICBwdWxsOiB0aGlzLnB1bGwgfHwgbnVsbCxcbiAgICAgIHJvdGF0ZTogdGhpcy5yb3RhdGUgfHwgbnVsbCxcbiAgICAgIGZpeGVkV2lkdGg6IHRoaXMuZml4ZWRXaWR0aFxuICAgIH07XG5cbiAgICBjb25zdCBjbGFzc2VzID0gb2JqZWN0V2l0aEtleSgnY2xhc3NlcycsIFsuLi5mYUNsYXNzTGlzdChjbGFzc09wdHMpLCAuLi50aGlzLmNsYXNzZXNdKTtcbiAgICBjb25zdCBwYXJzZWRUcmFuc2Zvcm0gPSB0eXBlb2YgdGhpcy50cmFuc2Zvcm0gPT09ICdzdHJpbmcnID8gcGFyc2UudHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtKSA6IHRoaXMudHJhbnNmb3JtO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG9iamVjdFdpdGhLZXkoJ3RyYW5zZm9ybScsIHBhcnNlZFRyYW5zZm9ybSk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIC4uLnRyYW5zZm9ybSxcbiAgICAgIC4uLmNsYXNzZXMsXG4gICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgIHN0eWxlczogdGhpcy5zdHlsZXNcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbmRlckZvbnRhd2Vzb21lT2JqZWN0KGNvbnRlbnQ6IHN0cmluZywgcGFyYW1zPzogVGV4dFBhcmFtcykge1xuICAgIHJldHVybiB0ZXh0KGNvbnRlbnQsIHBhcmFtcyk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIGNvdW50ZXIsXG4gIENvdW50ZXIsXG4gIENvdW50ZXJQYXJhbXMsXG59IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5pbXBvcnQgeyBGYUxheWVyc1RleHRCYXNlQ29tcG9uZW50IH0gZnJvbSAnLi9sYXllcnMtdGV4dC1iYXNlLmNvbXBvbmVudCc7XG5cbi8qKlxuICogRm9udGF3ZXNvbWUgbGF5ZXJzIGNvdW50ZXIuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhLWxheWVycy1jb3VudGVyJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICduZy1mYS1sYXllcnMtY291bnRlcidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBGYUxheWVyc0NvdW50ZXJDb21wb25lbnQgZXh0ZW5kcyBGYUxheWVyc1RleHRCYXNlQ29tcG9uZW50IHtcblxuICAvKipcbiAgICogVXBkYXRpbmcgcGFyYW1zIGJ5IGNvbXBvbmVudCBwcm9wcy5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVQYXJhbXMoKSB7XG4gICAgdGhpcy5wYXJhbXMgPSB7XG4gICAgICB0aXRsZTogdGhpcy50aXRsZSxcbiAgICAgIGNsYXNzZXM6IHRoaXMuY2xhc3NlcyxcbiAgICAgIHN0eWxlczogdGhpcy5zdHlsZXMsXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW5kZXJGb250YXdlc29tZU9iamVjdChjb250ZW50OiBzdHJpbmcgfCBudW1iZXIsIHBhcmFtcz86IENvdW50ZXJQYXJhbXMpIHtcbiAgICByZXR1cm4gY291bnRlcihjb250ZW50LCBwYXJhbXMpO1xuICB9XG59XG5cbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQgeyBGYUljb25Db21wb25lbnQgfSBmcm9tICcuL2ljb24vaWNvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmFMYXllcnNDb21wb25lbnQgfSBmcm9tICcuL2xheWVycy9sYXllcnMuY29tcG9uZW50JztcbmltcG9ydCB7IEZhTGF5ZXJzVGV4dENvbXBvbmVudCB9IGZyb20gJy4vbGF5ZXJzL2xheWVycy10ZXh0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGYUxheWVyc0NvdW50ZXJDb21wb25lbnQgfSBmcm9tICcuL2xheWVycy9sYXllcnMtY291bnRlci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgRmFJY29uQ29tcG9uZW50LFxuICAgIEZhTGF5ZXJzQ29tcG9uZW50LFxuICAgIEZhTGF5ZXJzVGV4dENvbXBvbmVudCxcbiAgICBGYUxheWVyc0NvdW50ZXJDb21wb25lbnQsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBGYUljb25Db21wb25lbnQsXG4gICAgRmFMYXllcnNDb21wb25lbnQsXG4gICAgRmFMYXllcnNUZXh0Q29tcG9uZW50LFxuICAgIEZhTGF5ZXJzQ291bnRlckNvbXBvbmVudCxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgRm9udEF3ZXNvbWVNb2R1bGUge1xufVxuIl0sIm5hbWVzIjpbImNvbmZpZyIsIkluamVjdGFibGUiLCJwYXJzZSIsImljb24iLCJDb21wb25lbnQiLCJEb21TYW5pdGl6ZXIiLCJJbnB1dCIsIkhvc3RCaW5kaW5nIiwiSW5qZWN0IiwiZm9yd2FyZFJlZiIsIk9wdGlvbmFsIiwidHNsaWJfMS5fX2V4dGVuZHMiLCJ0ZXh0IiwiY291bnRlciIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQTs7Ozs7Ozs7Ozs7Ozs7SUFjQTtJQUVBLElBQUksYUFBYSxHQUFHLFVBQVMsQ0FBQyxFQUFFLENBQUM7UUFDN0IsYUFBYSxHQUFHLE1BQU0sQ0FBQyxjQUFjO2FBQ2hDLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxZQUFZLEtBQUssSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1lBQzVFLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztvQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMvRSxPQUFPLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQyxDQUFDO0FBRUYsdUJBQTBCLENBQUMsRUFBRSxDQUFDO1FBQzFCLGFBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEIsZ0JBQWdCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDdkMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RixDQUFDO0FBRUQsSUFBTyxJQUFJLFFBQVEsR0FBRztRQUNsQixRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxrQkFBa0IsQ0FBQztZQUMzQyxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDakQsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakIsS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO29CQUFFLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7d0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNoRjtZQUNELE9BQU8sQ0FBQyxDQUFDO1NBQ1osQ0FBQTtRQUNELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFBO0FBRUQsb0JBNkV1QixDQUFDLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzRCxJQUFJLENBQUMsQ0FBQztZQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2pDLElBQUk7WUFDQSxPQUFPLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJO2dCQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsT0FBTyxLQUFLLEVBQUU7WUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUM7U0FBRTtnQkFDL0I7WUFDSixJQUFJO2dCQUNBLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDcEQ7b0JBQ087Z0JBQUUsSUFBSSxDQUFDO29CQUFFLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQzthQUFFO1NBQ3BDO1FBQ0QsT0FBTyxFQUFFLENBQUM7SUFDZCxDQUFDO0FBRUQ7UUFDSSxLQUFLLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtZQUM5QyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Ozs7Ozs7OztBQ3JJRCxRQUFhLFlBQVksR0FBRyxVQUFDLENBQVc7UUFDdEMsT0FBTyxtQkFBYSxDQUFDLEdBQUUsTUFBTSxLQUFLLFNBQVMsSUFBSSxtQkFBYSxDQUFDLEdBQUUsUUFBUSxLQUFLLFNBQVMsQ0FBQztLQUN2RixDQUFDOzs7Ozs7QUNMRjs7O0FBS0EsUUFBYSxtQkFBbUIsR0FBRyxVQUFDLFFBQWtCLEVBQUUsYUFBaUM7UUFBakMsOEJBQUE7WUFBQSxxQkFBaUM7O1FBRXZGLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7WUFDeEQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQzFCLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO1FBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLG1CQUFnQixRQUFRLEdBQUUsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNyRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDdkQ7UUFFRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFFBQVEsRUFBRTtZQUNoQyxPQUFPLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUM7U0FDdEQ7S0FDRixDQUFDOzs7Ozs7O0FDeEJGLFFBQWEsYUFBYSxHQUFHLFVBQUksR0FBVyxFQUFFLEtBQVE7O1FBQ3BELE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsYUFBSyxHQUFDLEdBQUcsSUFBRyxLQUFLLFFBQUssRUFBRSxDQUFDO0tBQy9HLENBQUM7Ozs7Ozs7Ozs7QUNJRixRQUFhLFdBQVcsR0FBRyxVQUFDLEtBQWM7OztRQUN4QyxJQUFNLE9BQU87WUFDWCxTQUFTLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDckIsVUFBVSxFQUFFLEtBQUssQ0FBQyxLQUFLO1lBQ3ZCLE9BQU8sRUFBRSxLQUFLLENBQUMsVUFBVTtZQUN6QixXQUFXLEVBQUUsS0FBSyxDQUFDLE1BQU07WUFDekIsT0FBTyxFQUFFLEtBQUssQ0FBQyxRQUFRO1lBQ3ZCLFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTztZQUMzQixtQkFBbUIsRUFBRSxLQUFLLENBQUMsT0FBTztZQUNsQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLFlBQVksSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU07WUFDMUUsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLElBQUksS0FBSyxVQUFVLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNOztZQUN0RSxHQUFDLFFBQU0sS0FBSyxDQUFDLElBQU0sSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUk7WUFDekMsR0FBQyxlQUFhLEtBQUssQ0FBQyxNQUFRLElBQUcsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJO1lBQ3BELEdBQUMsYUFBVyxLQUFLLENBQUMsSUFBTSxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSTtnQkFDOUM7UUFFRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO2FBQ3hCLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxRQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsSUFBSSxJQUFDLENBQUM7YUFDdkMsTUFBTSxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsR0FBRyxHQUFBLENBQUMsQ0FBQztLQUN2QixDQUFDOztBQUVGLFFBQWEsZ0JBQWdCLEdBQUcsVUFBQyxLQUFjOzs7UUFDN0MsSUFBTSxPQUFPO1lBQ1gsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVOztZQUN6QixHQUFDLFFBQU0sS0FBSyxDQUFDLElBQU0sSUFBRyxLQUFLLENBQUMsSUFBSSxLQUFLLElBQUk7Z0JBQ3pDO1FBRUYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQzthQUN4QixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksUUFBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBQyxDQUFDO2FBQ3ZDLE1BQU0sQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLEdBQUcsR0FBQSxDQUFDLENBQUM7S0FDdkIsQ0FBQzs7Ozs7OztBQ2xDRixRQUFhLHVCQUF1QixHQUFHLFVBQUMsT0FBYSxFQUFFLFFBQW9CO1FBQ3pFLElBQUksUUFBUSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ3hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0RBQWtELFFBQVEsQ0FBQyxRQUFRLG9CQUFlLFFBQVEsQ0FBQyxNQUFRLENBQUMsQ0FBQztTQUNwSDtLQUNGLENBQUM7Ozs7Ozs7QUNKRixRQUFhLHVCQUF1QixHQUFHLFVBQUMsUUFBb0I7UUFDMUQsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0NBQW9DO2dCQUNoRCxrRkFBa0YsQ0FBQyxDQUFDO1NBQ3ZGO0tBQ0YsQ0FBQzs7Ozs7O0FDUEY7QUFFQSxRQUFhLGtCQUFrQixHQUFHLGtCQUFlQSx5QkFBTSxDQUFDLGdCQUFnQiwyREFBcUQsQ0FBQzs7Ozs7O0FDRjlIOztpQ0FLOEIsS0FBSzs7O29CQUZsQ0MsYUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7OzRCQUhoQzs7Ozs7Ozs7Ozs7UUNvRUUseUJBQW9CLFNBQXVCLEVBQVUsV0FBMEI7WUFBM0QsY0FBUyxHQUFULFNBQVMsQ0FBYztZQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFlOzJCQVJqRCxFQUFFO1NBUW1EOzs7OztRQUtuRixxQ0FBVzs7OztZQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksT0FBTyxFQUFFO29CQUNYLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDdEIsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO29CQUNwQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztpQkFDbkI7YUFDRjs7Ozs7UUFLTyx3Q0FBYzs7Ozs7Z0JBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7Ozs7UUFNN0Usc0NBQVk7Ozs7OztnQkFDbEIsSUFBTSxTQUFTLEdBQVk7b0JBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtvQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07b0JBQ25CLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztvQkFDckIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJO29CQUN2QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJO29CQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJO29CQUMzQixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQzVCLENBQUM7O2dCQUVGLElBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxTQUFTLFdBQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7Z0JBQ3ZGLElBQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7O2dCQUNuRyxJQUFNLGVBQWUsR0FBRyxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxHQUFHQyx3QkFBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7Z0JBQzlHLElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRTlELElBQUksQ0FBQyxNQUFNLGNBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLElBQ2QsU0FBUyxFQUNULE9BQU8sRUFDUCxJQUFJLElBQ1AsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQ25CLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxHQUNwQixDQUFDOzs7Ozs7UUFNSSxvQ0FBVTs7Ozs7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUdDLHVCQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7OztRQU12QyxvQ0FBVTs7Ozs7Z0JBQ2hCLHVCQUF1QixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDdkMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBRWxELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUM1RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxrQkFBa0IsQ0FDM0QsQ0FBQzs7O29CQXJHTEMsWUFBUyxTQUFDO3dCQUNULFFBQVEsRUFBRSxTQUFTO3dCQUNuQixRQUFRLEVBQUUsRUFBRTt3QkFDWixJQUFJLEVBQUU7NEJBQ0osS0FBSyxFQUFFLFlBQVk7eUJBQ3BCO3FCQUNGOzs7Ozt3QkFwQlFDLDRCQUFZO3dCQVNaLGFBQWE7Ozs7K0JBY25CQyxRQUFLLFNBQUMsTUFBTTs0QkFDWkEsUUFBSzsyQkFDTEEsUUFBSzs0QkFDTEEsUUFBSzsyQkFDTEEsUUFBSzs2QkFDTEEsUUFBSzsyQkFDTEEsUUFBSzsyQkFDTEEsUUFBSzsyQkFDTEEsUUFBSzs2QkFDTEEsUUFBSzs4QkFDTEEsUUFBSzs2QkFDTEEsUUFBSzsrQkFDTEEsUUFBSzs2QkFDTEEsUUFBSztpQ0FDTEEsUUFBSzs4QkFDTEEsUUFBSztnQ0FDTEEsUUFBSzt1Q0FJTEMsY0FBVyxTQUFDLFdBQVc7OzhCQWpFMUI7Ozs7Ozs7QUNBQTs7Ozs7NkJBaUJjLFdBQVc7Ozs7O1FBRXZCLG9DQUFROzs7WUFBUjtnQkFDRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7YUFDdEI7Ozs7O1FBRUQsdUNBQVc7Ozs7WUFBWCxVQUFZLE9BQXNCO2dCQUNoQyxJQUFJLE9BQU8sRUFBRTtvQkFDWCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7aUJBQ3RCO2FBQ0Y7Ozs7UUFFRCx5Q0FBYTs7O1lBQWI7O2dCQUNFLElBQU0sU0FBUyxHQUFZO29CQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJO29CQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7aUJBQzVCLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLFNBQVMsR0FBRyxlQUFhLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUcsQ0FBQzthQUN2RTs7b0JBM0JGSCxZQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLFdBQVc7d0JBQ3JCLFFBQVEsRUFBRSxpRkFBK0U7cUJBQzFGOzs7MkJBRUVFLFFBQUs7aUNBQ0xBLFFBQUs7Z0NBRUxDLGNBQVcsU0FBQyxPQUFPOztnQ0FoQnRCOzs7Ozs7Ozs7O0FDR0EsUUFBYSxzQkFBc0IsR0FBRyxVQUFDLE1BQVcsRUFBRSxVQUFrQixFQUFFLFNBQWlCO1FBQ3ZGLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFnQixTQUFTLG9DQUErQixVQUFVLFdBQVEsQ0FBQyxDQUFDO1NBQzNGO0tBQ0YsQ0FBQzs7Ozs7O0FDUEY7Ozs7UUEwQkUsbUNBQTZFLE1BQXlCLEVBQzVGO1lBRG1FLFdBQU0sR0FBTixNQUFNLENBQW1CO1lBQzVGLGNBQVMsR0FBVCxTQUFTOzJCQVVxQixFQUFFO1lBUnhDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqRjs7Ozs7UUFTRCwrQ0FBVzs7OztZQUFYLFVBQVksT0FBc0I7Z0JBQ2hDLElBQUksT0FBTyxFQUFFO29CQUNYLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDcEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUN0QjthQUNGOzs7OztRQWVPLGlEQUFhOzs7OztnQkFDbkIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLHVCQUF1QixDQUN4RCxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQzlFLENBQUM7OztvQkExQ0xOLGFBQVU7Ozs7O3dCQUhGLGlCQUFpQix1QkFTWE8sU0FBTSxTQUFDQyxhQUFVLENBQUMsY0FBTSxPQUFBLGlCQUFpQixHQUFBLENBQUMsY0FBR0MsV0FBUTt3QkFYM0RMLDRCQUFZOzs7O21DQVFsQkUsY0FBVyxTQUFDLFdBQVc7OEJBV3ZCRCxRQUFLOzRCQUNMQSxRQUFLOzZCQUNMQSxRQUFLOzhCQUNMQSxRQUFLOzt3Q0FyQ1I7Ozs7Ozs7Ozs7O1FDZ0MyQ0sseUNBQXlCOzs7Ozs7Ozs7OztRQWlCeEQsNENBQVk7Ozs7WUFBdEI7O2dCQUNFLElBQU0sU0FBUyxHQUFZO29CQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7b0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztvQkFDakIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO29CQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3JCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSTtvQkFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSTtvQkFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSTtvQkFDM0IsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO2lCQUM1QixDQUFDOztnQkFFRixJQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsU0FBUyxXQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O2dCQUN2RixJQUFNLGVBQWUsR0FBRyxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxHQUFHVCx3QkFBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7Z0JBQzlHLElBQU0sU0FBUyxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsZUFBZSxDQUFDLENBQUM7Z0JBRTlELElBQUksQ0FBQyxNQUFNLGdCQUNOLFNBQVMsRUFDVCxPQUFPLElBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxHQUNwQixDQUFDO2FBQ0g7Ozs7OztRQUVTLHVEQUF1Qjs7Ozs7WUFBakMsVUFBa0MsT0FBZSxFQUFFLE1BQW1CO2dCQUNwRSxPQUFPVSx1QkFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQzthQUM5Qjs7b0JBcERGUixZQUFTLFNBQUM7d0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjt3QkFDMUIsUUFBUSxFQUFFLEVBQUU7d0JBQ1osSUFBSSxFQUFFOzRCQUNKLEtBQUssRUFBRSxtQkFBbUI7eUJBQzNCO3FCQUNGOzs7MkJBR0VFLFFBQUs7NEJBQ0xBLFFBQUs7MkJBQ0xBLFFBQUs7MkJBQ0xBLFFBQUs7MkJBQ0xBLFFBQUs7NkJBQ0xBLFFBQUs7OEJBQ0xBLFFBQUs7K0JBQ0xBLFFBQUs7NkJBQ0xBLFFBQUs7aUNBQ0xBLFFBQUs7Z0NBQ0xBLFFBQUs7O29DQTVDUjtNQWdDMkMseUJBQXlCOzs7Ozs7Ozs7O1FDWHRCSyw0Q0FBeUI7Ozs7Ozs7Ozs7O1FBSzNELCtDQUFZOzs7O1lBQXRCO2dCQUNFLElBQUksQ0FBQyxNQUFNLEdBQUc7b0JBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO29CQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtpQkFDcEIsQ0FBQzthQUNIOzs7Ozs7UUFFUywwREFBdUI7Ozs7O1lBQWpDLFVBQWtDLE9BQXdCLEVBQUUsTUFBc0I7Z0JBQ2hGLE9BQU9FLDBCQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ2pDOztvQkF0QkZULFlBQVMsU0FBQzt3QkFDVCxRQUFRLEVBQUUsbUJBQW1CO3dCQUM3QixRQUFRLEVBQUUsRUFBRTt3QkFDWixJQUFJLEVBQUU7NEJBQ0osS0FBSyxFQUFFLHNCQUFzQjt5QkFDOUI7cUJBQ0Y7O3VDQXBCRDtNQXFCOEMseUJBQXlCOzs7Ozs7QUNyQnZFOzs7O29CQVFDVSxXQUFRLFNBQUM7d0JBQ1IsT0FBTyxFQUFFLENBQUNDLG1CQUFZLENBQUM7d0JBQ3ZCLFlBQVksRUFBRTs0QkFDWixlQUFlOzRCQUNmLGlCQUFpQjs0QkFDakIscUJBQXFCOzRCQUNyQix3QkFBd0I7eUJBQ3pCO3dCQUNELE9BQU8sRUFBRTs0QkFDUCxlQUFlOzRCQUNmLGlCQUFpQjs0QkFDakIscUJBQXFCOzRCQUNyQix3QkFBd0I7eUJBQ3pCO3FCQUNGOztnQ0F0QkQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9