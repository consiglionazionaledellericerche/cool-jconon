import { config, icon, parse, text, counter } from '@fortawesome/fontawesome-svg-core';
import { Injectable, Input, Inject, Optional, forwardRef, HostBinding, NgModule, Component, defineInjectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Returns if is IconLookup or not.
  @type {?} */
const isIconLookup = (i) => {
    return (/** @type {?} */ (i)).prefix !== undefined && (/** @type {?} */ (i)).iconName !== undefined;
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Normalizing icon spec.
  @type {?} */
const faNormalizeIconSpec = (iconSpec, defaultPrefix = 'fas') => {
    if (typeof iconSpec === 'undefined' || iconSpec === null) {
        return null;
    }
    if (isIconLookup(iconSpec)) {
        return iconSpec;
    }
    if (Array.isArray(iconSpec) && (/** @type {?} */ (iconSpec)).length === 2) {
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
const objectWithKey = (key, value) => {
    return (Array.isArray(value) && value.length > 0) || (!Array.isArray(value) && value) ? { [key]: value } : {};
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Fontawesome class list.
 * Returns classes array by props.
  @type {?} */
const faClassList = (props) => {
    /** @type {?} */
    const classes = {
        'fa-spin': props.spin,
        'fa-pulse': props.pulse,
        'fa-fw': props.fixedWidth,
        'fa-border': props.border,
        'fa-li': props.listItem,
        'fa-inverse': props.inverse,
        'fa-layers-counter': props.counter,
        'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
        'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both',
        [`fa-${props.size}`]: props.size !== null,
        [`fa-rotate-${props.rotate}`]: props.rotate !== null,
        [`fa-pull-${props.pull}`]: props.pull !== null
    };
    return Object.keys(classes)
        .map(key => (classes[key] ? key : null))
        .filter(key => key);
};
/** @type {?} */
const faLayerClassList = (props) => {
    /** @type {?} */
    const classes = {
        'fa-fw': props.fixedWidth,
        [`fa-${props.size}`]: props.size !== null,
    };
    return Object.keys(classes)
        .map(key => (classes[key] ? key : null))
        .filter(key => key);
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const faWarnIfIconHtmlMissing = (iconObj, iconSpec) => {
    if (iconSpec && !iconObj) {
        console.error(`FontAwesome: Could not find icon with iconName=${iconSpec.iconName} and prefix=${iconSpec.prefix}`);
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const faWarnIfIconSpecMissing = (iconSpec) => {
    if (!iconSpec) {
        console.error('FontAwesome: Could not find icon. ' +
            `It looks like you've provided a null or undefined icon object to this component.`);
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const faNotFoundIconHtml = `<svg class="${config.replacementClass}" viewBox="0 0 448 512"></svg><!--icon not found-->`;

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FaIconService {
    constructor() {
        this.defaultPrefix = 'fas';
    }
}
FaIconService.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] }
];
/** @nocollapse */ FaIconService.ngInjectableDef = defineInjectable({ factory: function FaIconService_Factory() { return new FaIconService(); }, token: FaIconService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Fontawesome icon.
 */
class FaIconComponent {
    /**
     * @param {?} sanitizer
     * @param {?} iconService
     */
    constructor(sanitizer, iconService) {
        this.sanitizer = sanitizer;
        this.iconService = iconService;
        this.classes = [];
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes) {
            this.updateIconSpec();
            this.updateParams();
            this.updateIcon();
            this.renderIcon();
        }
    }
    /**
     * Updating icon spec.
     * @return {?}
     */
    updateIconSpec() {
        this.iconSpec = faNormalizeIconSpec(this.iconProp, this.iconService.defaultPrefix);
    }
    /**
     * Updating params by component props.
     * @return {?}
     */
    updateParams() {
        /** @type {?} */
        const classOpts = {
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
        const classes = objectWithKey('classes', [...faClassList(classOpts), ...this.classes]);
        /** @type {?} */
        const mask = objectWithKey('mask', faNormalizeIconSpec(this.mask, this.iconService.defaultPrefix));
        /** @type {?} */
        const parsedTransform = typeof this.transform === 'string' ? parse.transform(this.transform) : this.transform;
        /** @type {?} */
        const transform = objectWithKey('transform', parsedTransform);
        this.params = Object.assign({ title: this.title }, transform, classes, mask, { styles: this.styles, symbol: this.symbol });
    }
    /**
     * Updating icon by params and icon spec.
     * @return {?}
     */
    updateIcon() {
        this.icon = icon(this.iconSpec, this.params);
    }
    /**
     * Rendering icon.
     * @return {?}
     */
    renderIcon() {
        faWarnIfIconSpecMissing(this.iconSpec);
        faWarnIfIconHtmlMissing(this.icon, this.iconSpec);
        this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(this.icon ? this.icon.html.join('\n') : faNotFoundIconHtml);
    }
}
FaIconComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-icon',
                template: ``,
                host: {
                    class: 'ng-fa-icon',
                }
            }] }
];
/** @nocollapse */
FaIconComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: FaIconService }
];
FaIconComponent.propDecorators = {
    iconProp: [{ type: Input, args: ['icon',] }],
    title: [{ type: Input }],
    spin: [{ type: Input }],
    pulse: [{ type: Input }],
    mask: [{ type: Input }],
    styles: [{ type: Input }],
    flip: [{ type: Input }],
    size: [{ type: Input }],
    pull: [{ type: Input }],
    border: [{ type: Input }],
    inverse: [{ type: Input }],
    symbol: [{ type: Input }],
    listItem: [{ type: Input }],
    rotate: [{ type: Input }],
    fixedWidth: [{ type: Input }],
    classes: [{ type: Input }],
    transform: [{ type: Input }],
    renderedIconHTML: [{ type: HostBinding, args: ['innerHTML',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Fontawesome layers.
 */
class FaLayersComponent {
    constructor() {
        this.hostClass = 'fa-layers';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateClasses();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes) {
            this.updateClasses();
        }
    }
    /**
     * @return {?}
     */
    updateClasses() {
        /** @type {?} */
        const classOpts = {
            size: this.size || null,
            fixedWidth: this.fixedWidth,
        };
        this.hostClass = `fa-layers ${faLayerClassList(classOpts).join(' ')}`;
    }
}
FaLayersComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-layers',
                template: `<ng-content select="fa-icon, fa-layers-text, fa-layers-counter"></ng-content>`
            }] }
];
FaLayersComponent.propDecorators = {
    size: [{ type: Input }],
    fixedWidth: [{ type: Input }],
    hostClass: [{ type: HostBinding, args: ['class',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Warns if parent component not existing.
  @type {?} */
const faWarnIfParentNotExist = (parent, parentName, childName) => {
    if (!parent) {
        console.error(`FontAwesome: ${childName} should be used as child of ${parentName} only.`);
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class FaLayersTextBaseComponent {
    /**
     * @param {?} parent
     * @param {?} sanitizer
     */
    constructor(parent, sanitizer) {
        this.parent = parent;
        this.sanitizer = sanitizer;
        this.classes = [];
        faWarnIfParentNotExist(this.parent, 'FaLayersComponent', this.constructor.name);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes) {
            this.updateParams();
            this.updateContent();
        }
    }
    /**
     * Updating content by params and content.
     * @return {?}
     */
    updateContent() {
        this.renderedHTML = this.sanitizer.bypassSecurityTrustHtml(this.renderFontawesomeObject(this.content || '', this.params).html.join('\n'));
    }
}
FaLayersTextBaseComponent.decorators = [
    { type: Injectable }
];
/** @nocollapse */
FaLayersTextBaseComponent.ctorParameters = () => [
    { type: FaLayersComponent, decorators: [{ type: Inject, args: [forwardRef(() => FaLayersComponent),] }, { type: Optional }] },
    { type: DomSanitizer }
];
FaLayersTextBaseComponent.propDecorators = {
    renderedHTML: [{ type: HostBinding, args: ['innerHTML',] }],
    content: [{ type: Input }],
    title: [{ type: Input }],
    styles: [{ type: Input }],
    classes: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Fontawesome layers text.
 */
class FaLayersTextComponent extends FaLayersTextBaseComponent {
    /**
     * Updating params by component props.
     * @return {?}
     */
    updateParams() {
        /** @type {?} */
        const classOpts = {
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
        const classes = objectWithKey('classes', [...faClassList(classOpts), ...this.classes]);
        /** @type {?} */
        const parsedTransform = typeof this.transform === 'string' ? parse.transform(this.transform) : this.transform;
        /** @type {?} */
        const transform = objectWithKey('transform', parsedTransform);
        this.params = Object.assign({}, transform, classes, { title: this.title, styles: this.styles });
    }
    /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    renderFontawesomeObject(content, params) {
        return text(content, params);
    }
}
FaLayersTextComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-layers-text',
                template: '',
                host: {
                    class: 'ng-fa-layers-text'
                }
            }] }
];
FaLayersTextComponent.propDecorators = {
    spin: [{ type: Input }],
    pulse: [{ type: Input }],
    flip: [{ type: Input }],
    size: [{ type: Input }],
    pull: [{ type: Input }],
    border: [{ type: Input }],
    inverse: [{ type: Input }],
    listItem: [{ type: Input }],
    rotate: [{ type: Input }],
    fixedWidth: [{ type: Input }],
    transform: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Fontawesome layers counter.
 */
class FaLayersCounterComponent extends FaLayersTextBaseComponent {
    /**
     * Updating params by component props.
     * @return {?}
     */
    updateParams() {
        this.params = {
            title: this.title,
            classes: this.classes,
            styles: this.styles,
        };
    }
    /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    renderFontawesomeObject(content, params) {
        return counter(content, params);
    }
}
FaLayersCounterComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-layers-counter',
                template: '',
                host: {
                    class: 'ng-fa-layers-counter'
                }
            }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class FontAwesomeModule {
}
FontAwesomeModule.decorators = [
    { type: NgModule, args: [{
                imports: [CommonModule],
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { FontAwesomeModule, FaIconComponent, FaIconService, FaLayersComponent, FaLayersTextComponent, FaLayersCounterComponent, FaLayersTextBaseComponent as ɵa };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1mb250YXdlc29tZS5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvc2hhcmVkL3V0aWxzL2lzLWljb24tbG9va3VwLnV0aWwudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL3NoYXJlZC91dGlscy9ub3JtYWxpemUtaWNvbi1zcGVjLnV0aWwudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL3NoYXJlZC91dGlscy9vYmplY3Qtd2l0aC1rZXlzLnV0aWwudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL3NoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvc2hhcmVkL2Vycm9ycy93YXJuLWlmLWljb24taHRtbC1taXNzaW5nLnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9zaGFyZWQvZXJyb3JzL3dhcm4taWYtaWNvbi1zcGVjLW1pc3NpbmcudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL3NoYXJlZC9lcnJvcnMvbm90LWZvdW5kLWljb24taHRtbC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvaWNvbi9pY29uLnNlcnZpY2UudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL2ljb24vaWNvbi5jb21wb25lbnQudHMiLCJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lL2xheWVycy9sYXllcnMuY29tcG9uZW50LnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9zaGFyZWQvZXJyb3JzL3dhcm4taWYtcGFyZW50LW5vdC1leGlzdC50cyIsIm5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvbGF5ZXJzL2xheWVycy10ZXh0LWJhc2UuY29tcG9uZW50LnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9sYXllcnMvbGF5ZXJzLXRleHQuY29tcG9uZW50LnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9sYXllcnMvbGF5ZXJzLWNvdW50ZXIuY29tcG9uZW50LnRzIiwibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS9mb250YXdlc29tZS5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJY29uTG9va3VwLCBJY29uUHJvcH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcblxuLyoqXG4gKiBSZXR1cm5zIGlmIGlzIEljb25Mb29rdXAgb3Igbm90LlxuICovXG5leHBvcnQgY29uc3QgaXNJY29uTG9va3VwID0gKGk6IEljb25Qcm9wKTogaSBpcyBJY29uTG9va3VwID0+IHtcbiAgcmV0dXJuICg8SWNvbkxvb2t1cD5pKS5wcmVmaXggIT09IHVuZGVmaW5lZCAmJiAoPEljb25Mb29rdXA+aSkuaWNvbk5hbWUgIT09IHVuZGVmaW5lZDtcbn07XG4iLCJpbXBvcnQgeyBJY29uTG9va3VwLCBJY29uUHJvcCwgSWNvblByZWZpeCB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5cbmltcG9ydCB7IGlzSWNvbkxvb2t1cCB9IGZyb20gJy4vaXMtaWNvbi1sb29rdXAudXRpbCc7XG5cbi8qKlxuICogTm9ybWFsaXppbmcgaWNvbiBzcGVjLlxuICovXG5leHBvcnQgY29uc3QgZmFOb3JtYWxpemVJY29uU3BlYyA9IChpY29uU3BlYzogSWNvblByb3AsIGRlZmF1bHRQcmVmaXg6IEljb25QcmVmaXggPSAnZmFzJyk6IEljb25Mb29rdXAgPT4ge1xuXG4gIGlmICh0eXBlb2YgaWNvblNwZWMgPT09ICd1bmRlZmluZWQnIHx8IGljb25TcGVjID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoaXNJY29uTG9va3VwKGljb25TcGVjKSkge1xuICAgIHJldHVybiBpY29uU3BlYztcbiAgfVxuXG4gIGlmIChBcnJheS5pc0FycmF5KGljb25TcGVjKSAmJiAoPEFycmF5PHN0cmluZz4+aWNvblNwZWMpLmxlbmd0aCA9PT0gMikge1xuICAgIHJldHVybiB7IHByZWZpeDogaWNvblNwZWNbMF0sIGljb25OYW1lOiBpY29uU3BlY1sxXSB9O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBpY29uU3BlYyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4geyBwcmVmaXg6IGRlZmF1bHRQcmVmaXgsIGljb25OYW1lOiBpY29uU3BlYyB9O1xuICB9XG59O1xuIiwiZXhwb3J0IGNvbnN0IG9iamVjdFdpdGhLZXkgPSA8VD4oa2V5OiBzdHJpbmcsIHZhbHVlOiBUKToge1tpZDogc3RyaW5nXTogVH0gPT4ge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkodmFsdWUpICYmIHZhbHVlLmxlbmd0aCA+IDApIHx8ICghQXJyYXkuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUpID8geyBba2V5XTogdmFsdWUgfSA6IHt9O1xufTtcbiIsImltcG9ydCB7IEZhUHJvcHMgfSBmcm9tICcuLi9tb2RlbHMvcHJvcHMubW9kZWwnO1xuXG4vKipcbiAqIEZvbnRhd2Vzb21lIGNsYXNzIGxpc3QuXG4gKiBSZXR1cm5zIGNsYXNzZXMgYXJyYXkgYnkgcHJvcHMuXG4gKi9cbmV4cG9ydCBjb25zdCBmYUNsYXNzTGlzdCA9IChwcm9wczogRmFQcm9wcyk6IHN0cmluZ1tdID0+IHtcbiAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAnZmEtc3Bpbic6IHByb3BzLnNwaW4sXG4gICAgJ2ZhLXB1bHNlJzogcHJvcHMucHVsc2UsXG4gICAgJ2ZhLWZ3JzogcHJvcHMuZml4ZWRXaWR0aCxcbiAgICAnZmEtYm9yZGVyJzogcHJvcHMuYm9yZGVyLFxuICAgICdmYS1saSc6IHByb3BzLmxpc3RJdGVtLFxuICAgICdmYS1pbnZlcnNlJzogcHJvcHMuaW52ZXJzZSxcbiAgICAnZmEtbGF5ZXJzLWNvdW50ZXInOiBwcm9wcy5jb3VudGVyLFxuICAgICdmYS1mbGlwLWhvcml6b250YWwnOiBwcm9wcy5mbGlwID09PSAnaG9yaXpvbnRhbCcgfHwgcHJvcHMuZmxpcCA9PT0gJ2JvdGgnLFxuICAgICdmYS1mbGlwLXZlcnRpY2FsJzogcHJvcHMuZmxpcCA9PT0gJ3ZlcnRpY2FsJyB8fCBwcm9wcy5mbGlwID09PSAnYm90aCcsXG4gICAgW2BmYS0ke3Byb3BzLnNpemV9YF06IHByb3BzLnNpemUgIT09IG51bGwsXG4gICAgW2BmYS1yb3RhdGUtJHtwcm9wcy5yb3RhdGV9YF06IHByb3BzLnJvdGF0ZSAhPT0gbnVsbCxcbiAgICBbYGZhLXB1bGwtJHtwcm9wcy5wdWxsfWBdOiBwcm9wcy5wdWxsICE9PSBudWxsXG4gIH07XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNsYXNzZXMpXG4gICAgLm1hcChrZXkgPT4gKGNsYXNzZXNba2V5XSA/IGtleSA6IG51bGwpKVxuICAgIC5maWx0ZXIoa2V5ID0+IGtleSk7XG59O1xuXG5leHBvcnQgY29uc3QgZmFMYXllckNsYXNzTGlzdCA9IChwcm9wczogRmFQcm9wcyk6IHN0cmluZ1tdID0+IHtcbiAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAnZmEtZncnOiBwcm9wcy5maXhlZFdpZHRoLFxuICAgIFtgZmEtJHtwcm9wcy5zaXplfWBdOiBwcm9wcy5zaXplICE9PSBudWxsLFxuICB9O1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhjbGFzc2VzKVxuICAgIC5tYXAoa2V5ID0+IChjbGFzc2VzW2tleV0gPyBrZXkgOiBudWxsKSlcbiAgICAuZmlsdGVyKGtleSA9PiBrZXkpO1xufTtcbiIsImltcG9ydCB7IEljb24sIEljb25Mb29rdXAgfSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuXG5leHBvcnQgY29uc3QgZmFXYXJuSWZJY29uSHRtbE1pc3NpbmcgPSAoaWNvbk9iajogSWNvbiwgaWNvblNwZWM6IEljb25Mb29rdXApID0+IHtcbiAgaWYgKGljb25TcGVjICYmICFpY29uT2JqKSB7XG4gICAgY29uc29sZS5lcnJvcihgRm9udEF3ZXNvbWU6IENvdWxkIG5vdCBmaW5kIGljb24gd2l0aCBpY29uTmFtZT0ke2ljb25TcGVjLmljb25OYW1lfSBhbmQgcHJlZml4PSR7aWNvblNwZWMucHJlZml4fWApO1xuICB9XG59O1xuIiwiaW1wb3J0IHsgSWNvbkxvb2t1cCB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5cbmV4cG9ydCBjb25zdCBmYVdhcm5JZkljb25TcGVjTWlzc2luZyA9IChpY29uU3BlYzogSWNvbkxvb2t1cCkgPT4ge1xuICBpZiAoIWljb25TcGVjKSB7XG4gICAgY29uc29sZS5lcnJvcignRm9udEF3ZXNvbWU6IENvdWxkIG5vdCBmaW5kIGljb24uICcgK1xuICAgICAgYEl0IGxvb2tzIGxpa2UgeW91J3ZlIHByb3ZpZGVkIGEgbnVsbCBvciB1bmRlZmluZWQgaWNvbiBvYmplY3QgdG8gdGhpcyBjb21wb25lbnQuYCk7XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBjb25maWcgfSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuXG5leHBvcnQgY29uc3QgZmFOb3RGb3VuZEljb25IdG1sID0gYDxzdmcgY2xhc3M9XCIke2NvbmZpZy5yZXBsYWNlbWVudENsYXNzfVwiIHZpZXdCb3g9XCIwIDAgNDQ4IDUxMlwiPjwvc3ZnPjwhLS1pY29uIG5vdCBmb3VuZC0tPmA7XG4iLCJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBJY29uUHJlZml4IH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcblxuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgRmFJY29uU2VydmljZSB7XG4gIGRlZmF1bHRQcmVmaXg6IEljb25QcmVmaXggPSAnZmFzJztcbn1cbiIsImltcG9ydCB7XG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIENvbXBvbmVudCxcbiAgSG9zdEJpbmRpbmcsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBpY29uLFxuICBJY29uLFxuICBwYXJzZSxcbiAgU3R5bGVzLFxuICBQdWxsUHJvcCxcbiAgSWNvblByb3AsXG4gIFNpemVQcm9wLFxuICBGbGlwUHJvcCxcbiAgRmFTeW1ib2wsXG4gIFRyYW5zZm9ybSxcbiAgSWNvblBhcmFtcyxcbiAgSWNvbkxvb2t1cCxcbiAgUm90YXRlUHJvcFxufSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBmYU5vcm1hbGl6ZUljb25TcGVjIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL25vcm1hbGl6ZS1pY29uLXNwZWMudXRpbCc7XG5pbXBvcnQgeyBGYVByb3BzIH0gZnJvbSAnLi4vc2hhcmVkL21vZGVscy9wcm9wcy5tb2RlbCc7XG5pbXBvcnQgeyBvYmplY3RXaXRoS2V5IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL29iamVjdC13aXRoLWtleXMudXRpbCc7XG5pbXBvcnQgeyBmYUNsYXNzTGlzdCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbCc7XG5pbXBvcnQgeyBmYVdhcm5JZkljb25IdG1sTWlzc2luZyB9IGZyb20gJy4uL3NoYXJlZC9lcnJvcnMvd2Fybi1pZi1pY29uLWh0bWwtbWlzc2luZyc7XG5pbXBvcnQgeyBmYVdhcm5JZkljb25TcGVjTWlzc2luZyB9IGZyb20gJy4uL3NoYXJlZC9lcnJvcnMvd2Fybi1pZi1pY29uLXNwZWMtbWlzc2luZyc7XG5pbXBvcnQgeyBmYU5vdEZvdW5kSWNvbkh0bWwgfSBmcm9tICcuLi9zaGFyZWQvZXJyb3JzL25vdC1mb3VuZC1pY29uLWh0bWwnO1xuaW1wb3J0IHsgRmFJY29uU2VydmljZSB9IGZyb20gJy4vaWNvbi5zZXJ2aWNlJztcblxuLyoqXG4gKiBGb250YXdlc29tZSBpY29uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYS1pY29uJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICduZy1mYS1pY29uJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBGYUljb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXG4gIEBJbnB1dCgnaWNvbicpIGljb25Qcm9wOiBJY29uUHJvcDtcbiAgQElucHV0KCkgdGl0bGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNwaW4/OiBib29sZWFuO1xuICBASW5wdXQoKSBwdWxzZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1hc2s/OiBJY29uUHJvcDtcbiAgQElucHV0KCkgc3R5bGVzPzogU3R5bGVzO1xuICBASW5wdXQoKSBmbGlwPzogRmxpcFByb3A7XG4gIEBJbnB1dCgpIHNpemU/OiBTaXplUHJvcDtcbiAgQElucHV0KCkgcHVsbD86IFB1bGxQcm9wO1xuICBASW5wdXQoKSBib3JkZXI/OiBib29sZWFuO1xuICBASW5wdXQoKSBpbnZlcnNlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgc3ltYm9sPzogRmFTeW1ib2w7XG4gIEBJbnB1dCgpIGxpc3RJdGVtPzogYm9vbGVhbjtcbiAgQElucHV0KCkgcm90YXRlPzogUm90YXRlUHJvcDtcbiAgQElucHV0KCkgZml4ZWRXaWR0aD86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsYXNzZXM/OiBzdHJpbmdbXSA9IFtdO1xuICBASW5wdXQoKSB0cmFuc2Zvcm0/OiBzdHJpbmcgfCBUcmFuc2Zvcm07XG5cbiAgcHVibGljIGljb246IEljb247XG5cbiAgQEhvc3RCaW5kaW5nKCdpbm5lckhUTUwnKVxuICBwdWJsaWMgcmVuZGVyZWRJY29uSFRNTDogU2FmZUh0bWw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplciwgcHJpdmF0ZSBpY29uU2VydmljZTogRmFJY29uU2VydmljZSkge31cblxuICBwcml2YXRlIHBhcmFtczogSWNvblBhcmFtcztcbiAgcHJpdmF0ZSBpY29uU3BlYzogSWNvbkxvb2t1cDtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlSWNvblNwZWMoKTtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1zKCk7XG4gICAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICAgIHRoaXMucmVuZGVySWNvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBpY29uIHNwZWMuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUljb25TcGVjKCkge1xuICAgIHRoaXMuaWNvblNwZWMgPSBmYU5vcm1hbGl6ZUljb25TcGVjKHRoaXMuaWNvblByb3AsIHRoaXMuaWNvblNlcnZpY2UuZGVmYXVsdFByZWZpeCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgcGFyYW1zIGJ5IGNvbXBvbmVudCBwcm9wcy5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlUGFyYW1zKCkge1xuICAgIGNvbnN0IGNsYXNzT3B0czogRmFQcm9wcyA9IHtcbiAgICAgIGZsaXA6IHRoaXMuZmxpcCxcbiAgICAgIHNwaW46IHRoaXMuc3BpbixcbiAgICAgIHB1bHNlOiB0aGlzLnB1bHNlLFxuICAgICAgYm9yZGVyOiB0aGlzLmJvcmRlcixcbiAgICAgIGludmVyc2U6IHRoaXMuaW52ZXJzZSxcbiAgICAgIGxpc3RJdGVtOiB0aGlzLmxpc3RJdGVtLFxuICAgICAgc2l6ZTogdGhpcy5zaXplIHx8IG51bGwsXG4gICAgICBwdWxsOiB0aGlzLnB1bGwgfHwgbnVsbCxcbiAgICAgIHJvdGF0ZTogdGhpcy5yb3RhdGUgfHwgbnVsbCxcbiAgICAgIGZpeGVkV2lkdGg6IHRoaXMuZml4ZWRXaWR0aFxuICAgIH07XG5cbiAgICBjb25zdCBjbGFzc2VzID0gb2JqZWN0V2l0aEtleSgnY2xhc3NlcycsIFsuLi5mYUNsYXNzTGlzdChjbGFzc09wdHMpLCAuLi50aGlzLmNsYXNzZXNdKTtcbiAgICBjb25zdCBtYXNrID0gb2JqZWN0V2l0aEtleSgnbWFzaycsIGZhTm9ybWFsaXplSWNvblNwZWModGhpcy5tYXNrLCB0aGlzLmljb25TZXJ2aWNlLmRlZmF1bHRQcmVmaXgpKTtcbiAgICBjb25zdCBwYXJzZWRUcmFuc2Zvcm0gPSB0eXBlb2YgdGhpcy50cmFuc2Zvcm0gPT09ICdzdHJpbmcnID8gcGFyc2UudHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtKSA6IHRoaXMudHJhbnNmb3JtO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG9iamVjdFdpdGhLZXkoJ3RyYW5zZm9ybScsIHBhcnNlZFRyYW5zZm9ybSk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgLi4udHJhbnNmb3JtLFxuICAgICAgLi4uY2xhc3NlcyxcbiAgICAgIC4uLm1hc2ssXG4gICAgICBzdHlsZXM6IHRoaXMuc3R5bGVzLFxuICAgICAgc3ltYm9sOiB0aGlzLnN5bWJvbFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgaWNvbiBieSBwYXJhbXMgYW5kIGljb24gc3BlYy5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSWNvbigpIHtcbiAgICB0aGlzLmljb24gPSBpY29uKHRoaXMuaWNvblNwZWMsIHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJpbmcgaWNvbi5cbiAgICovXG4gIHByaXZhdGUgcmVuZGVySWNvbigpIHtcbiAgICBmYVdhcm5JZkljb25TcGVjTWlzc2luZyh0aGlzLmljb25TcGVjKTtcbiAgICBmYVdhcm5JZkljb25IdG1sTWlzc2luZyh0aGlzLmljb24sIHRoaXMuaWNvblNwZWMpO1xuXG4gICAgdGhpcy5yZW5kZXJlZEljb25IVE1MID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoXG4gICAgICB0aGlzLmljb24gPyB0aGlzLmljb24uaHRtbC5qb2luKCdcXG4nKSA6IGZhTm90Rm91bmRJY29uSHRtbFxuICAgICk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgU2ltcGxlQ2hhbmdlcywgT25DaGFuZ2VzLCBPbkluaXQsIEhvc3RCaW5kaW5nIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTaXplUHJvcCB9IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5pbXBvcnQgeyBmYUxheWVyQ2xhc3NMaXN0IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL2NsYXNzbGlzdC51dGlsJztcbmltcG9ydCB7IEZhUHJvcHMgfSBmcm9tICcuLi9zaGFyZWQvbW9kZWxzL3Byb3BzLm1vZGVsJztcblxuLyoqXG4gKiBGb250YXdlc29tZSBsYXllcnMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhLWxheWVycycsXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRlbnQgc2VsZWN0PVwiZmEtaWNvbiwgZmEtbGF5ZXJzLXRleHQsIGZhLWxheWVycy1jb3VudGVyXCI+PC9uZy1jb250ZW50PmAsXG59KVxuZXhwb3J0IGNsYXNzIEZhTGF5ZXJzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICBASW5wdXQoKSBzaXplPzogU2l6ZVByb3A7XG4gIEBJbnB1dCgpIGZpeGVkV2lkdGg/OiBib29sZWFuO1xuXG4gIEBIb3N0QmluZGluZygnY2xhc3MnKVxuICBob3N0Q2xhc3MgPSAnZmEtbGF5ZXJzJztcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgdGhpcy51cGRhdGVDbGFzc2VzKCk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2xhc3NlcygpIHtcbiAgICBjb25zdCBjbGFzc09wdHM6IEZhUHJvcHMgPSB7XG4gICAgICBzaXplOiB0aGlzLnNpemUgfHwgbnVsbCxcbiAgICAgIGZpeGVkV2lkdGg6IHRoaXMuZml4ZWRXaWR0aCxcbiAgICB9O1xuICAgIHRoaXMuaG9zdENsYXNzID0gYGZhLWxheWVycyAke2ZhTGF5ZXJDbGFzc0xpc3QoY2xhc3NPcHRzKS5qb2luKCcgJyl9YDtcbiAgfVxuXG59XG4iLCIvKipcbiAqIFdhcm5zIGlmIHBhcmVudCBjb21wb25lbnQgbm90IGV4aXN0aW5nLlxuICovXG5leHBvcnQgY29uc3QgZmFXYXJuSWZQYXJlbnROb3RFeGlzdCA9IChwYXJlbnQ6IGFueSwgcGFyZW50TmFtZTogc3RyaW5nLCBjaGlsZE5hbWU6IHN0cmluZykgPT4ge1xuICBpZiAoIXBhcmVudCkge1xuICAgIGNvbnNvbGUuZXJyb3IoYEZvbnRBd2Vzb21lOiAke2NoaWxkTmFtZX0gc2hvdWxkIGJlIHVzZWQgYXMgY2hpbGQgb2YgJHtwYXJlbnROYW1lfSBvbmx5LmApO1xuICB9XG59O1xuIiwiaW1wb3J0IHtcbiAgSW5wdXQsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgT3B0aW9uYWwsXG4gIE9uQ2hhbmdlcyxcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBTdHlsZXMsXG4gIEZvbnRhd2Vzb21lT2JqZWN0LFxuICBUZXh0UGFyYW1zXG59IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IEZhTGF5ZXJzQ29tcG9uZW50IH0gZnJvbSAnLi9sYXllcnMuY29tcG9uZW50JztcbmltcG9ydCB7IGZhV2FybklmUGFyZW50Tm90RXhpc3QgfSBmcm9tICcuLi9zaGFyZWQvZXJyb3JzL3dhcm4taWYtcGFyZW50LW5vdC1leGlzdCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGYUxheWVyc1RleHRCYXNlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICBASG9zdEJpbmRpbmcoJ2lubmVySFRNTCcpXG4gIHB1YmxpYyByZW5kZXJlZEhUTUw6IFNhZmVIdG1sO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBGYUxheWVyc0NvbXBvbmVudCkpIEBPcHRpb25hbCgpIHByaXZhdGUgcGFyZW50OiBGYUxheWVyc0NvbXBvbmVudCxcbiAgICBwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7XG5cbiAgICBmYVdhcm5JZlBhcmVudE5vdEV4aXN0KHRoaXMucGFyZW50LCAnRmFMYXllcnNDb21wb25lbnQnLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcmFtczogVGV4dFBhcmFtcztcblxuICBASW5wdXQoKSBwcm90ZWN0ZWQgY29udGVudDogc3RyaW5nO1xuICBASW5wdXQoKSBwcm90ZWN0ZWQgdGl0bGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByb3RlY3RlZCBzdHlsZXM/OiBTdHlsZXM7XG4gIEBJbnB1dCgpIHByb3RlY3RlZCBjbGFzc2VzPzogc3RyaW5nW10gPSBbXTtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1zKCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgcGFyYW1zIGJ5IGNvbXBvbmVudCBwcm9wcy5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCB1cGRhdGVQYXJhbXMoKTogdm9pZDtcblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBGb250YXdlc29tZU9iamVjdCB1c2luZyB0aGUgY29udGVudCBhbmQgcGFyYW1zLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlbmRlckZvbnRhd2Vzb21lT2JqZWN0KGNvbnRlbnQ6IHN0cmluZyB8IG51bWJlciwgcGFyYW1zPzogVGV4dFBhcmFtcyk6IEZvbnRhd2Vzb21lT2JqZWN0O1xuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBjb250ZW50IGJ5IHBhcmFtcyBhbmQgY29udGVudC5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlQ29udGVudCgpIHtcbiAgICB0aGlzLnJlbmRlcmVkSFRNTCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgdGhpcy5yZW5kZXJGb250YXdlc29tZU9iamVjdCh0aGlzLmNvbnRlbnQgfHwgJycsIHRoaXMucGFyYW1zKS5odG1sLmpvaW4oJ1xcbicpXG4gICAgKTtcbiAgfVxufVxuXG4iLCJpbXBvcnQge1xuICBJbnB1dCxcbiAgQ29tcG9uZW50LFxuICBIb3N0QmluZGluZ1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIHRleHQsXG4gIHBhcnNlLFxuICBUZXh0LFxuICBUZXh0UGFyYW1zLFxuICBTaXplUHJvcCxcbiAgRmxpcFByb3AsXG4gIFB1bGxQcm9wLFxuICBUcmFuc2Zvcm0sXG4gIFJvdGF0ZVByb3Bcbn0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcbmltcG9ydCB7IEZhTGF5ZXJzVGV4dEJhc2VDb21wb25lbnQgfSBmcm9tICcuL2xheWVycy10ZXh0LWJhc2UuY29tcG9uZW50JztcblxuaW1wb3J0IHsgRmFQcm9wcyB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbHMvcHJvcHMubW9kZWwnO1xuaW1wb3J0IHsgb2JqZWN0V2l0aEtleSB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9vYmplY3Qtd2l0aC1rZXlzLnV0aWwnO1xuaW1wb3J0IHsgZmFDbGFzc0xpc3QgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMvY2xhc3NsaXN0LnV0aWwnO1xuXG4vKipcbiAqIEZvbnRhd2Vzb21lIGxheWVycyB0ZXh0LlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYS1sYXllcnMtdGV4dCcsXG4gIHRlbXBsYXRlOiAnJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbmctZmEtbGF5ZXJzLXRleHQnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgRmFMYXllcnNUZXh0Q29tcG9uZW50IGV4dGVuZHMgRmFMYXllcnNUZXh0QmFzZUNvbXBvbmVudCB7XG5cbiAgQElucHV0KCkgc3Bpbj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHB1bHNlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgZmxpcD86IEZsaXBQcm9wO1xuICBASW5wdXQoKSBzaXplPzogU2l6ZVByb3A7XG4gIEBJbnB1dCgpIHB1bGw/OiBQdWxsUHJvcDtcbiAgQElucHV0KCkgYm9yZGVyPzogYm9vbGVhbjtcbiAgQElucHV0KCkgaW52ZXJzZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxpc3RJdGVtPzogYm9vbGVhbjtcbiAgQElucHV0KCkgcm90YXRlPzogUm90YXRlUHJvcDtcbiAgQElucHV0KCkgZml4ZWRXaWR0aD86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHRyYW5zZm9ybT86IHN0cmluZyB8IFRyYW5zZm9ybTtcblxuICAvKipcbiAgICogVXBkYXRpbmcgcGFyYW1zIGJ5IGNvbXBvbmVudCBwcm9wcy5cbiAgICovXG4gIHByb3RlY3RlZCB1cGRhdGVQYXJhbXMoKSB7XG4gICAgY29uc3QgY2xhc3NPcHRzOiBGYVByb3BzID0ge1xuICAgICAgZmxpcDogdGhpcy5mbGlwLFxuICAgICAgc3BpbjogdGhpcy5zcGluLFxuICAgICAgcHVsc2U6IHRoaXMucHVsc2UsXG4gICAgICBib3JkZXI6IHRoaXMuYm9yZGVyLFxuICAgICAgaW52ZXJzZTogdGhpcy5pbnZlcnNlLFxuICAgICAgbGlzdEl0ZW06IHRoaXMubGlzdEl0ZW0sXG4gICAgICBzaXplOiB0aGlzLnNpemUgfHwgbnVsbCxcbiAgICAgIHB1bGw6IHRoaXMucHVsbCB8fCBudWxsLFxuICAgICAgcm90YXRlOiB0aGlzLnJvdGF0ZSB8fCBudWxsLFxuICAgICAgZml4ZWRXaWR0aDogdGhpcy5maXhlZFdpZHRoXG4gICAgfTtcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBvYmplY3RXaXRoS2V5KCdjbGFzc2VzJywgWy4uLmZhQ2xhc3NMaXN0KGNsYXNzT3B0cyksIC4uLnRoaXMuY2xhc3Nlc10pO1xuICAgIGNvbnN0IHBhcnNlZFRyYW5zZm9ybSA9IHR5cGVvZiB0aGlzLnRyYW5zZm9ybSA9PT0gJ3N0cmluZycgPyBwYXJzZS50cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm0pIDogdGhpcy50cmFuc2Zvcm07XG4gICAgY29uc3QgdHJhbnNmb3JtID0gb2JqZWN0V2l0aEtleSgndHJhbnNmb3JtJywgcGFyc2VkVHJhbnNmb3JtKTtcblxuICAgIHRoaXMucGFyYW1zID0ge1xuICAgICAgLi4udHJhbnNmb3JtLFxuICAgICAgLi4uY2xhc3NlcyxcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgc3R5bGVzOiB0aGlzLnN0eWxlc1xuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVuZGVyRm9udGF3ZXNvbWVPYmplY3QoY29udGVudDogc3RyaW5nLCBwYXJhbXM/OiBUZXh0UGFyYW1zKSB7XG4gICAgcmV0dXJuIHRleHQoY29udGVudCwgcGFyYW1zKTtcbiAgfVxufVxuXG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEhvc3RCaW5kaW5nXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgY291bnRlcixcbiAgQ291bnRlcixcbiAgQ291bnRlclBhcmFtcyxcbn0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcbmltcG9ydCB7IEZhTGF5ZXJzVGV4dEJhc2VDb21wb25lbnQgfSBmcm9tICcuL2xheWVycy10ZXh0LWJhc2UuY29tcG9uZW50JztcblxuLyoqXG4gKiBGb250YXdlc29tZSBsYXllcnMgY291bnRlci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmEtbGF5ZXJzLWNvdW50ZXInLFxuICB0ZW1wbGF0ZTogJycsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25nLWZhLWxheWVycy1jb3VudGVyJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIEZhTGF5ZXJzQ291bnRlckNvbXBvbmVudCBleHRlbmRzIEZhTGF5ZXJzVGV4dEJhc2VDb21wb25lbnQge1xuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBwYXJhbXMgYnkgY29tcG9uZW50IHByb3BzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHVwZGF0ZVBhcmFtcygpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgY2xhc3NlczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGVzOiB0aGlzLnN0eWxlcyxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbmRlckZvbnRhd2Vzb21lT2JqZWN0KGNvbnRlbnQ6IHN0cmluZyB8IG51bWJlciwgcGFyYW1zPzogQ291bnRlclBhcmFtcykge1xuICAgIHJldHVybiBjb3VudGVyKGNvbnRlbnQsIHBhcmFtcyk7XG4gIH1cbn1cblxuIiwiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IEZhSWNvbkNvbXBvbmVudCB9IGZyb20gJy4vaWNvbi9pY29uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBGYUxheWVyc0NvbXBvbmVudCB9IGZyb20gJy4vbGF5ZXJzL2xheWVycy5jb21wb25lbnQnO1xuaW1wb3J0IHsgRmFMYXllcnNUZXh0Q29tcG9uZW50IH0gZnJvbSAnLi9sYXllcnMvbGF5ZXJzLXRleHQuY29tcG9uZW50JztcbmltcG9ydCB7IEZhTGF5ZXJzQ291bnRlckNvbXBvbmVudCB9IGZyb20gJy4vbGF5ZXJzL2xheWVycy1jb3VudGVyLmNvbXBvbmVudCc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBGYUljb25Db21wb25lbnQsXG4gICAgRmFMYXllcnNDb21wb25lbnQsXG4gICAgRmFMYXllcnNUZXh0Q29tcG9uZW50LFxuICAgIEZhTGF5ZXJzQ291bnRlckNvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW1xuICAgIEZhSWNvbkNvbXBvbmVudCxcbiAgICBGYUxheWVyc0NvbXBvbmVudCxcbiAgICBGYUxheWVyc1RleHRDb21wb25lbnQsXG4gICAgRmFMYXllcnNDb3VudGVyQ29tcG9uZW50LFxuICBdLFxufSlcbmV4cG9ydCBjbGFzcyBGb250QXdlc29tZU1vZHVsZSB7XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBS0EsTUFBYSxZQUFZLEdBQUcsQ0FBQyxDQUFXO0lBQ3RDLE9BQU8sbUJBQWEsQ0FBQyxHQUFFLE1BQU0sS0FBSyxTQUFTLElBQUksbUJBQWEsQ0FBQyxHQUFFLFFBQVEsS0FBSyxTQUFTLENBQUM7Q0FDdkYsQ0FBQzs7Ozs7O0FDTEY7OztBQUtBLE1BQWEsbUJBQW1CLEdBQUcsQ0FBQyxRQUFrQixFQUFFLGdCQUE0QixLQUFLO0lBRXZGLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxJQUFJLFFBQVEsS0FBSyxJQUFJLEVBQUU7UUFDeEQsT0FBTyxJQUFJLENBQUM7S0FDYjtJ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