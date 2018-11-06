import { Injectable, NgModule, Directive, forwardRef, Input, Renderer2, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Inject, NgZone, Output, PLATFORM_ID, TemplateRef, LOCALE_ID, ContentChild, Injector, ViewContainerRef, ComponentFactoryResolver, InjectionToken, ApplicationRef, defineInjectable, inject, INJECTOR } from '@angular/core';
import { CommonModule, isPlatformBrowser, FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth, formatDate, DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormsModule } from '@angular/forms';
import { Subject, timer, fromEvent, race, NEVER, BehaviorSubject } from 'rxjs';
import { filter, map, switchMap, takeUntil, take, withLatestFrom, tap } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} value
 * @return {?}
 */
function toInteger(value) {
    return parseInt(`${value}`, 10);
}
/**
 * @param {?} value
 * @return {?}
 */
function toString(value) {
    return (value !== undefined && value !== null) ? `${value}` : '';
}
/**
 * @param {?} value
 * @param {?} max
 * @param {?=} min
 * @return {?}
 */
function getValueInRange(value, max, min = 0) {
    return Math.max(Math.min(value, max), min);
}
/**
 * @param {?} value
 * @return {?}
 */
function isString(value) {
    return typeof value === 'string';
}
/**
 * @param {?} value
 * @return {?}
 */
function isNumber(value) {
    return !isNaN(toInteger(value));
}
/**
 * @param {?} value
 * @return {?}
 */
function isInteger(value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
}
/**
 * @param {?} value
 * @return {?}
 */
function isDefined(value) {
    return value !== undefined && value !== null;
}
/**
 * @param {?} value
 * @return {?}
 */
function padNumber(value) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    }
    else {
        return '';
    }
}
/**
 * @param {?} text
 * @return {?}
 */
function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbAccordion component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the accordions used in the application.
 */
class NgbAccordionConfig {
    constructor() {
        this.closeOthers = false;
    }
}
NgbAccordionConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbAccordionConfig.ngInjectableDef = defineInjectable({ factory: function NgbAccordionConfig_Factory() { return new NgbAccordionConfig(); }, token: NgbAccordionConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId = 0;
/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
class NgbPanelTitle {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelTitle.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbPanelTitle]' },] },
];
/** @nocollapse */
NgbPanelTitle.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * This directive must be used to wrap accordion panel content.
 */
class NgbPanelContent {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbPanelContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbPanelContent]' },] },
];
/** @nocollapse */
NgbPanelContent.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * The NgbPanel directive represents an individual panel with the title and collapsible
 * content
 */
class NgbPanel {
    constructor() {
        /**
         *  A flag determining whether the panel is disabled or not.
         *  When disabled, the panel cannot be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel. The id should be unique.
         *  If not provided, it will be auto-generated.
         */
        this.id = `ngb-panel-${nextId++}`;
        /**
         * A flag telling if the panel is currently open
         */
        this.isOpen = false;
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContantChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}
NgbPanel.decorators = [
    { type: Directive, args: [{ selector: 'ngb-panel' },] },
];
NgbPanel.propDecorators = {
    disabled: [{ type: Input }],
    id: [{ type: Input }],
    title: [{ type: Input }],
    type: [{ type: Input }],
    titleTpls: [{ type: ContentChildren, args: [NgbPanelTitle, { descendants: false },] }],
    contentTpls: [{ type: ContentChildren, args: [NgbPanelContent, { descendants: false },] }]
};
/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only one panel can be opened at a time.
 */
class NgbAccordion {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * An array or comma separated strings of panel identifiers that should be opened
         */
        this.activeIds = [];
        /**
         * Whether the closed panels should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
         */
        this.panelChange = new EventEmitter();
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Programmatically toggle a panel with a given id.
     * @param {?} panelId
     * @return {?}
     */
    toggle(panelId) {
        /** @type {?} */
        const panel = this.panels.find(p => p.id === panelId);
        if (panel && !panel.disabled) {
            /** @type {?} */
            let defaultPrevented = false;
            this.panelChange.emit({ panelId: panelId, nextState: !panel.isOpen, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                panel.isOpen = !panel.isOpen;
                if (this.closeOtherPanels) {
                    this._closeOthers(panelId);
                }
                this._updateActiveIds();
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // active id updates
        if (isString(this.activeIds)) {
            this.activeIds = this.activeIds.split(/\s*,\s*/);
        }
        // update panels open states
        this.panels.forEach(panel => panel.isOpen = !panel.disabled && this.activeIds.indexOf(panel.id) > -1);
        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0]);
            this._updateActiveIds();
        }
    }
    /**
     * @param {?} panelId
     * @return {?}
     */
    _closeOthers(panelId) {
        this.panels.forEach(panel => {
            if (panel.id !== panelId) {
                panel.isOpen = false;
            }
        });
    }
    /**
     * @return {?}
     */
    _updateActiveIds() {
        this.activeIds = this.panels.filter(panel => panel.isOpen && !panel.disabled).map(panel => panel.id);
    }
}
NgbAccordion.decorators = [
    { type: Component, args: [{
                selector: 'ngb-accordion',
                exportAs: 'ngbAccordion',
                host: { 'class': 'accordion', 'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                template: `
    <ng-template ngFor let-panel [ngForOf]="panels">
      <div class="card">
        <div role="tab" id="{{panel.id}}-header" [class]="'card-header ' + (panel.type ? 'bg-'+panel.type: type ? 'bg-'+type : '')">
          <h5 class="mb-0">
            <button class="btn btn-link" (click)="!!toggle(panel.id)" [disabled]="panel.disabled" [class.collapsed]="!panel.isOpen"
              [attr.aria-expanded]="panel.isOpen" [attr.aria-controls]="panel.id">
              {{panel.title}}<ng-template [ngTemplateOutlet]="panel.titleTpl?.templateRef"></ng-template>
            </button>
          </h5>
        </div>
        <div id="{{panel.id}}" role="tabpanel" [attr.aria-labelledby]="panel.id + '-header'"
             class="collapse" [class.show]="panel.isOpen" *ngIf="!destroyOnHide || panel.isOpen">
          <div class="card-body">
               <ng-template [ngTemplateOutlet]="panel.contentTpl?.templateRef"></ng-template>
          </div>
        </div>
      </div>
    </ng-template>
  `
            },] },
];
/** @nocollapse */
NgbAccordion.ctorParameters = () => [
    { type: NgbAccordionConfig }
];
NgbAccordion.propDecorators = {
    panels: [{ type: ContentChildren, args: [NgbPanel,] }],
    activeIds: [{ type: Input }],
    closeOtherPanels: [{ type: Input, args: ['closeOthers',] }],
    destroyOnHide: [{ type: Input }],
    type: [{ type: Input }],
    panelChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_ACCORDION_DIRECTIVES = [NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent];
class NgbAccordionModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbAccordionModule }; }
}
NgbAccordionModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_ACCORDION_DIRECTIVES, exports: NGB_ACCORDION_DIRECTIVES, imports: [CommonModule] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbAlert component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the alerts used in the application.
 */
class NgbAlertConfig {
    constructor() {
        this.dismissible = true;
        this.type = 'warning';
    }
}
NgbAlertConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbAlertConfig.ngInjectableDef = defineInjectable({ factory: function NgbAlertConfig_Factory() { return new NgbAlertConfig(); }, token: NgbAlertConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Alerts can be used to provide feedback messages.
 */
class NgbAlert {
    /**
     * @param {?} config
     * @param {?} _renderer
     * @param {?} _element
     */
    constructor(config, _renderer, _element) {
        this._renderer = _renderer;
        this._element = _element;
        /**
         * An event emitted when the close button is clicked. This event has no payload. Only relevant for dismissible alerts.
         */
        this.close = new EventEmitter();
        this.dismissible = config.dismissible;
        this.type = config.type;
    }
    /**
     * @return {?}
     */
    closeHandler() { this.close.emit(null); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const typeChange = changes['type'];
        if (typeChange && !typeChange.firstChange) {
            this._renderer.removeClass(this._element.nativeElement, `alert-${typeChange.previousValue}`);
            this._renderer.addClass(this._element.nativeElement, `alert-${typeChange.currentValue}`);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() { this._renderer.addClass(this._element.nativeElement, `alert-${this.type}`); }
}
NgbAlert.decorators = [
    { type: Component, args: [{
                selector: 'ngb-alert',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'role': 'alert', 'class': 'alert', '[class.alert-dismissible]': 'dismissible' },
                template: `
    <button *ngIf="dismissible" type="button" class="close" aria-label="Close" i18n-aria-label="@@ngb.alert.close"
      (click)="closeHandler()">
      <span aria-hidden="true">&times;</span>
    </button>
    <ng-content></ng-content>
    `,
                styles: [`
    :host {
      display: block;
    }
  `]
            },] },
];
/** @nocollapse */
NgbAlert.ctorParameters = () => [
    { type: NgbAlertConfig },
    { type: Renderer2 },
    { type: ElementRef }
];
NgbAlert.propDecorators = {
    dismissible: [{ type: Input }],
    type: [{ type: Input }],
    close: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbAlertModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbAlertModule }; }
}
NgbAlertModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbAlert], exports: [NgbAlert], imports: [CommonModule], entryComponents: [NgbAlert] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbButtonLabel {
}
NgbButtonLabel.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButtonLabel]',
                host: { '[class.btn]': 'true', '[class.active]': 'active', '[class.disabled]': 'disabled', '[class.focus]': 'focused' }
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_CHECKBOX_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbCheckBox),
    multi: true
};
/**
 * Easily create Bootstrap-style checkbox buttons. A value of a checked button is bound to a variable
 * specified via ngModel.
 */
class NgbCheckBox {
    /**
     * @param {?} _label
     */
    constructor(_label) {
        this._label = _label;
        /**
         * A flag indicating if a given checkbox button is disabled.
         */
        this.disabled = false;
        /**
         * Value to be propagated as model when the checkbox is checked.
         */
        this.valueChecked = true;
        /**
         * Value to be propagated as model when the checkbox is unchecked.
         */
        this.valueUnChecked = false;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        this._label.focused = isFocused;
        if (!isFocused) {
            this.onTouched();
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    onInputChange($event) {
        /** @type {?} */
        const modelToPropagate = $event.target.checked ? this.valueChecked : this.valueUnChecked;
        this.onChange(modelToPropagate);
        this.onTouched();
        this.writeValue(modelToPropagate);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
        this._label.disabled = isDisabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.checked = value === this.valueChecked;
        this._label.active = this.checked;
    }
}
NgbCheckBox.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButton][type=checkbox]',
                host: {
                    'autocomplete': 'off',
                    '[checked]': 'checked',
                    '[disabled]': 'disabled',
                    '(change)': 'onInputChange($event)',
                    '(focus)': 'focused = true',
                    '(blur)': 'focused = false'
                },
                providers: [NGB_CHECKBOX_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
NgbCheckBox.ctorParameters = () => [
    { type: NgbButtonLabel }
];
NgbCheckBox.propDecorators = {
    disabled: [{ type: Input }],
    valueChecked: [{ type: Input }],
    valueUnChecked: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_RADIO_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbRadioGroup),
    multi: true
};
/** @type {?} */
let nextId$1 = 0;
/**
 * Easily create Bootstrap-style radio buttons. A value of a selected button is bound to a variable
 * specified via ngModel.
 */
class NgbRadioGroup {
    constructor() {
        this._radios = new Set();
        this._value = null;
        /**
         * The name of the group. Unless enclosed inputs specify a name, this name is used as the name of the
         * enclosed inputs. If not specified, a name is generated automatically.
         */
        this.name = `ngb-radio-${nextId$1++}`;
        this.onChange = (_) => { };
        this.onTouched = () => { };
    }
    /**
     * @return {?}
     */
    get disabled() { return this._disabled; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) { this.setDisabledState(isDisabled); }
    /**
     * @param {?} radio
     * @return {?}
     */
    onRadioChange(radio) {
        this.writeValue(radio.value);
        this.onChange(radio.value);
    }
    /**
     * @return {?}
     */
    onRadioValueUpdate() { this._updateRadiosValue(); }
    /**
     * @param {?} radio
     * @return {?}
     */
    register(radio) { this._radios.add(radio); }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._disabled = isDisabled;
        this._updateRadiosDisabled();
    }
    /**
     * @param {?} radio
     * @return {?}
     */
    unregister(radio) { this._radios.delete(radio); }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this._value = value;
        this._updateRadiosValue();
    }
    /**
     * @return {?}
     */
    _updateRadiosValue() { this._radios.forEach((radio) => radio.updateValue(this._value)); }
    /**
     * @return {?}
     */
    _updateRadiosDisabled() { this._radios.forEach((radio) => radio.updateDisabled()); }
}
NgbRadioGroup.decorators = [
    { type: Directive, args: [{ selector: '[ngbRadioGroup]', host: { 'role': 'group' }, providers: [NGB_RADIO_VALUE_ACCESSOR] },] },
];
NgbRadioGroup.propDecorators = {
    name: [{ type: Input }]
};
/**
 * Marks an input of type "radio" as part of the NgbRadioGroup.
 */
class NgbRadio {
    /**
     * @param {?} _group
     * @param {?} _label
     * @param {?} _renderer
     * @param {?} _element
     */
    constructor(_group, _label, _renderer, _element) {
        this._group = _group;
        this._label = _label;
        this._renderer = _renderer;
        this._element = _element;
        this._value = null;
        this._group.register(this);
    }
    /**
     * You can specify model value of a given radio by binding to the value property.
     * @param {?} value
     * @return {?}
     */
    set value(value) {
        this._value = value;
        /** @type {?} */
        const stringValue = value ? value.toString() : '';
        this._renderer.setProperty(this._element.nativeElement, 'value', stringValue);
        this._group.onRadioValueUpdate();
    }
    /**
     * A flag indicating if a given radio button is disabled.
     * @param {?} isDisabled
     * @return {?}
     */
    set disabled(isDisabled) {
        this._disabled = isDisabled !== false;
        this.updateDisabled();
    }
    /**
     * @param {?} isFocused
     * @return {?}
     */
    set focused(isFocused) {
        if (this._label) {
            this._label.focused = isFocused;
        }
        if (!isFocused) {
            this._group.onTouched();
        }
    }
    /**
     * @return {?}
     */
    get checked() { return this._checked; }
    /**
     * @return {?}
     */
    get disabled() { return this._group.disabled || this._disabled; }
    /**
     * @return {?}
     */
    get value() { return this._value; }
    /**
     * @return {?}
     */
    get nameAttr() { return this.name || this._group.name; }
    /**
     * @return {?}
     */
    ngOnDestroy() { this._group.unregister(this); }
    /**
     * @return {?}
     */
    onChange() { this._group.onRadioChange(this); }
    /**
     * @param {?} value
     * @return {?}
     */
    updateValue(value) {
        this._checked = this.value === value;
        this._label.active = this._checked;
    }
    /**
     * @return {?}
     */
    updateDisabled() { this._label.disabled = this.disabled; }
}
NgbRadio.decorators = [
    { type: Directive, args: [{
                selector: '[ngbButton][type=radio]',
                host: {
                    '[checked]': 'checked',
                    '[disabled]': 'disabled',
                    '[name]': 'nameAttr',
                    '(change)': 'onChange()',
                    '(focus)': 'focused = true',
                    '(blur)': 'focused = false'
                }
            },] },
];
/** @nocollapse */
NgbRadio.ctorParameters = () => [
    { type: NgbRadioGroup },
    { type: NgbButtonLabel },
    { type: Renderer2 },
    { type: ElementRef }
];
NgbRadio.propDecorators = {
    name: [{ type: Input }],
    value: [{ type: Input, args: ['value',] }],
    disabled: [{ type: Input, args: ['disabled',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_BUTTON_DIRECTIVES = [NgbButtonLabel, NgbCheckBox, NgbRadioGroup, NgbRadio];
class NgbButtonsModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbButtonsModule }; }
}
NgbButtonsModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_BUTTON_DIRECTIVES, exports: NGB_BUTTON_DIRECTIVES },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbCarousel component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the carousels used in the application.
 */
class NgbCarouselConfig {
    constructor() {
        this.interval = 5000;
        this.wrap = true;
        this.keyboard = true;
        this.pauseOnHover = true;
        this.showNavigationArrows = true;
        this.showNavigationIndicators = true;
    }
}
NgbCarouselConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbCarouselConfig.ngInjectableDef = defineInjectable({ factory: function NgbCarouselConfig_Factory() { return new NgbCarouselConfig(); }, token: NgbCarouselConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$2 = 0;
/**
 * Represents an individual slide to be used within a carousel.
 */
class NgbSlide {
    /**
     * @param {?} tplRef
     */
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
         * Will be auto-generated if not provided.
         */
        this.id = `ngb-slide-${nextId$2++}`;
    }
}
NgbSlide.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbSlide]' },] },
];
/** @nocollapse */
NgbSlide.ctorParameters = () => [
    { type: TemplateRef }
];
NgbSlide.propDecorators = {
    id: [{ type: Input }]
};
/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
class NgbCarousel {
    /**
     * @param {?} config
     * @param {?} _platformId
     * @param {?} _ngZone
     * @param {?} _cd
     */
    constructor(config, _platformId, _ngZone, _cd) {
        this._platformId = _platformId;
        this._ngZone = _ngZone;
        this._cd = _cd;
        this._start$ = new Subject();
        this._stop$ = new Subject();
        /**
         * A carousel slide event fired when the slide transition is completed.
         * See NgbSlideEvent for payload details
         */
        this.slide = new EventEmitter();
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
        this.pauseOnHover = config.pauseOnHover;
        this.showNavigationArrows = config.showNavigationArrows;
        this.showNavigationIndicators = config.showNavigationIndicators;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(() => {
                this._start$
                    .pipe(map(() => this.interval), filter(interval => interval > 0), switchMap(interval => timer(interval).pipe(takeUntil(this._stop$))))
                    .subscribe(() => this._ngZone.run(() => {
                    this.next();
                    this._cd.detectChanges();
                }));
                this._start$.next();
            });
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        /** @type {?} */
        let activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this._stop$.next(); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('interval' in changes && !changes['interval'].isFirstChange()) {
            this._start$.next();
        }
    }
    /**
     * Navigate to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    select(slideId) { this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId)); }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    prev() { this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    next() { this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); }
    /**
     * Stops the carousel from cycling through items.
     * @return {?}
     */
    pause() { this._stop$.next(); }
    /**
     * Restarts cycling through the carousel slides from left to right.
     * @return {?}
     */
    cycle() { this._start$.next(); }
    /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    _cycleToSelected(slideIdx, direction) {
        /** @type {?} */
        let selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction });
            this._start$.next();
            this.activeId = selectedSlide.id;
        }
    }
    /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        /** @type {?} */
        const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        /** @type {?} */
        const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
    }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideById(slideId) { return this.slides.find(slide => slide.id === slideId); }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideIdxById(slideId) {
        return this.slides.toArray().indexOf(this._getSlideById(slideId));
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getNextSlide(currentSlideId) {
        /** @type {?} */
        const slideArr = this.slides.toArray();
        /** @type {?} */
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        const isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getPrevSlide(currentSlideId) {
        /** @type {?} */
        const slideArr = this.slides.toArray();
        /** @type {?} */
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        const isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    }
}
NgbCarousel.decorators = [
    { type: Component, args: [{
                selector: 'ngb-carousel',
                exportAs: 'ngbCarousel',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'carousel slide',
                    '[style.display]': '"block"',
                    'tabIndex': '0',
                    '(mouseenter)': 'pauseOnHover && pause()',
                    '(mouseleave)': 'pauseOnHover && cycle()',
                    '(keydown.arrowLeft)': 'keyboard && prev()',
                    '(keydown.arrowRight)': 'keyboard && next()'
                },
                template: `
    <ol class="carousel-indicators" *ngIf="showNavigationIndicators">
      <li *ngFor="let slide of slides" [id]="slide.id" [class.active]="slide.id === activeId"
          (click)="select(slide.id); pauseOnHover && pause()"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <a class="carousel-control-prev" role="button" (click)="prev()" *ngIf="showNavigationArrows">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.previous">Previous</span>
    </a>
    <a class="carousel-control-next" role="button" (click)="next()" *ngIf="showNavigationArrows">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.next">Next</span>
    </a>
  `
            },] },
];
/** @nocollapse */
NgbCarousel.ctorParameters = () => [
    { type: NgbCarouselConfig },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
NgbCarousel.propDecorators = {
    slides: [{ type: ContentChildren, args: [NgbSlide,] }],
    activeId: [{ type: Input }],
    interval: [{ type: Input }],
    wrap: [{ type: Input }],
    keyboard: [{ type: Input }],
    pauseOnHover: [{ type: Input }],
    showNavigationArrows: [{ type: Input }],
    showNavigationIndicators: [{ type: Input }],
    slide: [{ type: Output }]
};
/** @enum {string} */
var NgbSlideEventDirection = {
    LEFT: /** @type {?} */ ('left'),
    RIGHT: /** @type {?} */ ('right'),
};
/** @type {?} */
const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbCarouselModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbCarouselModule }; }
}
NgbCarouselModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_CAROUSEL_DIRECTIVES, exports: NGB_CAROUSEL_DIRECTIVES, imports: [CommonModule] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * The NgbCollapse directive provides a simple way to hide and show an element with animations.
 */
class NgbCollapse {
    constructor() {
        /**
         * A flag indicating collapsed (true) or open (false) state.
         */
        this.collapsed = false;
    }
}
NgbCollapse.decorators = [
    { type: Directive, args: [{
                selector: '[ngbCollapse]',
                exportAs: 'ngbCollapse',
                host: { '[class.collapse]': 'true', '[class.show]': '!collapsed' }
            },] },
];
NgbCollapse.propDecorators = {
    collapsed: [{ type: Input, args: ['ngbCollapse',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbCollapseModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbCollapseModule }; }
}
NgbCollapseModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbCollapse], exports: [NgbCollapse] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Simple class used for a date representation that datepicker also uses internally
 *
 * \@since 3.0.0
 */
class NgbDate {
    /**
     * Static method. Creates a new date object from the NgbDateStruct, ex. NgbDate.from({year: 2000,
     * month: 5, day: 1}). If the 'date' is already of NgbDate, the method will return the same object
     * @param {?} date
     * @return {?}
     */
    static from(date) {
        if (date instanceof NgbDate) {
            return date;
        }
        return date ? new NgbDate(date.year, date.month, date.day) : null;
    }
    /**
     * @param {?} year
     * @param {?} month
     * @param {?} day
     */
    constructor(year, month, day) {
        this.year = isInteger(year) ? year : null;
        this.month = isInteger(month) ? month : null;
        this.day = isInteger(day) ? day : null;
    }
    /**
     * Checks if current date is equal to another date
     * @param {?} other
     * @return {?}
     */
    equals(other) {
        return other && this.year === other.year && this.month === other.month && this.day === other.day;
    }
    /**
     * Checks if current date is before another date
     * @param {?} other
     * @return {?}
     */
    before(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day < other.day;
            }
            else {
                return this.month < other.month;
            }
        }
        else {
            return this.year < other.year;
        }
    }
    /**
     * Checks if current date is after another date
     * @param {?} other
     * @return {?}
     */
    after(other) {
        if (!other) {
            return false;
        }
        if (this.year === other.year) {
            if (this.month === other.month) {
                return this.day === other.day ? false : this.day > other.day;
            }
            else {
                return this.month > other.month;
            }
        }
        else {
            return this.year > other.year;
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} jsDate
 * @return {?}
 */
function fromJSDate(jsDate) {
    return new NgbDate(jsDate.getFullYear(), jsDate.getMonth() + 1, jsDate.getDate());
}
/**
 * @param {?} date
 * @return {?}
 */
function toJSDate(date) {
    /** @type {?} */
    const jsDate = new Date(date.year, date.month - 1, date.day, 12);
    // this is done avoid 30 -> 1930 conversion
    if (!isNaN(jsDate.getTime())) {
        jsDate.setFullYear(date.year);
    }
    return jsDate;
}
/**
 * Calendar used by the datepicker.
 * Default implementation uses Gregorian calendar.
 * @abstract
 */
class NgbCalendar {
}
NgbCalendar.decorators = [
    { type: Injectable },
];
class NgbCalendarGregorian extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        /** @type {?} */
        let jsDate = toJSDate(date);
        switch (period) {
            case 'y':
                return new NgbDate(date.year + number, 1, 1);
            case 'm':
                jsDate = new Date(date.year, date.month + number - 1, 1, 12);
                break;
            case 'd':
                jsDate.setDate(jsDate.getDate() + number);
                break;
            default:
                return date;
        }
        return fromJSDate(jsDate);
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        let jsDate = toJSDate(date);
        /** @type {?} */
        let day = jsDate.getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        /** @type {?} */
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        /** @type {?} */
        let date = week[thursdayIndex];
        /** @type {?} */
        const jsDate = toJSDate(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));
        /** @type {?} */
        const time = jsDate.getTime();
        jsDate.setMonth(0); // Compare with Jan 1
        jsDate.setDate(1);
        return Math.floor(Math.round((time - jsDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return fromJSDate(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        if (!date || !isInteger(date.year) || !isInteger(date.month) || !isInteger(date.day)) {
            return false;
        }
        /** @type {?} */
        const jsDate = toJSDate(date);
        return !isNaN(jsDate.getTime()) && jsDate.getFullYear() === date.year && jsDate.getMonth() + 1 === date.month &&
            jsDate.getDate() === date.day;
    }
}
NgbCalendarGregorian.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
function isChangedDate(prev, next) {
    return !dateComparator(prev, next);
}
/**
 * @param {?} prev
 * @param {?} next
 * @return {?}
 */
function dateComparator(prev, next) {
    return (!prev && !next) || (!!prev && !!next && prev.equals(next));
}
/**
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function checkMinBeforeMax(minDate, maxDate) {
    if (maxDate && minDate && maxDate.before(minDate)) {
        throw new Error(`'maxDate' ${maxDate} should be greater than 'minDate' ${minDate}`);
    }
}
/**
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function checkDateInRange(date, minDate, maxDate) {
    if (date && minDate && date.before(minDate)) {
        return minDate;
    }
    if (date && maxDate && date.after(maxDate)) {
        return maxDate;
    }
    return date;
}
/**
 * @param {?} date
 * @param {?} state
 * @return {?}
 */
function isDateSelectable(date, state) {
    const { minDate, maxDate, disabled, markDisabled } = state;
    // clang-format off
    return !(!isDefined(date) ||
        disabled ||
        (markDisabled && markDisabled(date, { year: date.year, month: date.month })) ||
        (minDate && date.before(minDate)) ||
        (maxDate && date.after(maxDate)));
    // clang-format on
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function generateSelectBoxMonths(calendar, date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    /** @type {?} */
    let months = calendar.getMonths();
    if (minDate && date.year === minDate.year) {
        /** @type {?} */
        const index = months.findIndex(month => month === minDate.month);
        months = months.slice(index);
    }
    if (maxDate && date.year === maxDate.year) {
        /** @type {?} */
        const index = months.findIndex(month => month === maxDate.month);
        months = months.slice(0, index + 1);
    }
    return months;
}
/**
 * @param {?} date
 * @param {?} minDate
 * @param {?} maxDate
 * @return {?}
 */
function generateSelectBoxYears(date, minDate, maxDate) {
    if (!date) {
        return [];
    }
    /** @type {?} */
    const start = minDate && minDate.year || date.year - 10;
    /** @type {?} */
    const end = maxDate && maxDate.year || date.year + 10;
    return Array.from({ length: end - start + 1 }, (e, i) => start + i);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} maxDate
 * @return {?}
 */
function nextMonthDisabled(calendar, date, maxDate) {
    return maxDate && calendar.getNext(date, 'm').after(maxDate);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} minDate
 * @return {?}
 */
function prevMonthDisabled(calendar, date, minDate) {
    /** @type {?} */
    const prevDate = calendar.getPrev(date, 'm');
    return minDate && (prevDate.year === minDate.year && prevDate.month < minDate.month ||
        prevDate.year < minDate.year && minDate.month === 1);
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} state
 * @param {?} i18n
 * @param {?} force
 * @return {?}
 */
function buildMonths(calendar, date, state, i18n, force) {
    const { displayMonths, months } = state;
    /** @type {?} */
    const monthsToReuse = months.splice(0, months.length);
    /** @type {?} */
    const firstDates = Array.from({ length: displayMonths }, (_, i) => {
        /** @type {?} */
        const firstDate = calendar.getNext(date, 'm', i);
        months[i] = null;
        if (!force) {
            /** @type {?} */
            const reusedIndex = monthsToReuse.findIndex(month => month.firstDate.equals(firstDate));
            // move reused month back to months
            if (reusedIndex !== -1) {
                months[i] = monthsToReuse.splice(reusedIndex, 1)[0];
            }
        }
        return firstDate;
    });
    // rebuild nullified months
    firstDates.forEach((firstDate, i) => {
        if (months[i] === null) {
            months[i] = buildMonth(calendar, firstDate, state, i18n, monthsToReuse.shift() || /** @type {?} */ ({}));
        }
    });
    return months;
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} state
 * @param {?} i18n
 * @param {?=} month
 * @return {?}
 */
function buildMonth(calendar, date, state, i18n, month = /** @type {?} */ ({})) {
    const { minDate, maxDate, firstDayOfWeek, markDisabled, outsideDays } = state;
    month.firstDate = null;
    month.lastDate = null;
    month.number = date.month;
    month.year = date.year;
    month.weeks = month.weeks || [];
    month.weekdays = month.weekdays || [];
    date = getFirstViewDate(calendar, date, firstDayOfWeek);
    // month has weeks
    for (let week = 0; week < calendar.getWeeksPerMonth(); week++) {
        /** @type {?} */
        let weekObject = month.weeks[week];
        if (!weekObject) {
            weekObject = month.weeks[week] = { number: 0, days: [], collapsed: true };
        }
        /** @type {?} */
        const days = weekObject.days;
        // week has days
        for (let day = 0; day < calendar.getDaysPerWeek(); day++) {
            if (week === 0) {
                month.weekdays[day] = calendar.getWeekday(date);
            }
            /** @type {?} */
            const newDate = new NgbDate(date.year, date.month, date.day);
            /** @type {?} */
            const nextDate = calendar.getNext(newDate);
            /** @type {?} */
            const ariaLabel = i18n.getDayAriaLabel(newDate);
            /** @type {?} */
            let disabled = !!((minDate && newDate.before(minDate)) || (maxDate && newDate.after(maxDate)));
            if (!disabled && markDisabled) {
                disabled = markDisabled(newDate, { month: month.number, year: month.year });
            }
            // saving first date of the month
            if (month.firstDate === null && newDate.month === month.number) {
                month.firstDate = newDate;
            }
            // saving last date of the month
            if (newDate.month === month.number && nextDate.month !== month.number) {
                month.lastDate = newDate;
            }
            /** @type {?} */
            let dayObject = days[day];
            if (!dayObject) {
                dayObject = days[day] = /** @type {?} */ ({});
            }
            dayObject.date = newDate;
            dayObject.context = Object.assign(dayObject.context || {}, { date: newDate, currentMonth: month.number, disabled, focused: false, selected: false });
            dayObject.tabindex = -1;
            dayObject.ariaLabel = ariaLabel;
            dayObject.hidden = false;
            date = nextDate;
        }
        weekObject.number = calendar.getWeekNumber(days.map(day => day.date), firstDayOfWeek);
        // marking week as collapsed
        weekObject.collapsed = outsideDays === 'collapsed' && days[0].date.month !== month.number &&
            days[days.length - 1].date.month !== month.number;
    }
    return month;
}
/**
 * @param {?} calendar
 * @param {?} date
 * @param {?} firstDayOfWeek
 * @return {?}
 */
function getFirstViewDate(calendar, date, firstDayOfWeek) {
    /** @type {?} */
    const daysPerWeek = calendar.getDaysPerWeek();
    /** @type {?} */
    const firstMonthDate = new NgbDate(date.year, date.month, 1);
    /** @type {?} */
    const dayOfWeek = calendar.getWeekday(firstMonthDate) % daysPerWeek;
    return calendar.getPrev(firstMonthDate, 'd', (daysPerWeek + dayOfWeek - firstDayOfWeek) % daysPerWeek);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 * @abstract
 */
class NgbDatepickerI18n {
    /**
     * Returns the textual representation of a day that is rendered in a day cell
     *
     * \@since 3.0.0
     * @param {?} date
     * @return {?}
     */
    getDayNumerals(date) { return `${date.day}`; }
    /**
     * Returns the textual representation of a week number rendered by date picker
     *
     * \@since 3.0.0
     * @param {?} weekNumber
     * @return {?}
     */
    getWeekNumerals(weekNumber) { return `${weekNumber}`; }
    /**
     * Returns the textual representation of a year that is rendered
     * in date picker year select box
     *
     * \@since 3.0.0
     * @param {?} year
     * @return {?}
     */
    getYearNumerals(year) { return `${year}`; }
}
NgbDatepickerI18n.decorators = [
    { type: Injectable },
];
class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
    /**
     * @param {?} _locale
     */
    constructor(_locale) {
        super();
        this._locale = _locale;
        /** @type {?} */
        const weekdaysStartingOnSunday = getLocaleDayNames(_locale, FormStyle.Standalone, TranslationWidth.Short);
        this._weekdaysShort = weekdaysStartingOnSunday.map((day, index) => weekdaysStartingOnSunday[(index + 1) % 7]);
        this._monthsShort = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Abbreviated);
        this._monthsFull = getLocaleMonthNames(_locale, FormStyle.Standalone, TranslationWidth.Wide);
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayShortName(weekday) { return this._weekdaysShort[weekday - 1]; }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthShortName(month) { return this._monthsShort[month - 1]; }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthFullName(month) { return this._monthsFull[month - 1]; }
    /**
     * @param {?} date
     * @return {?}
     */
    getDayAriaLabel(date) {
        /** @type {?} */
        const jsDate = new Date(date.year, date.month - 1, date.day);
        return formatDate(jsDate, 'fullDate', this._locale);
    }
}
NgbDatepickerI18nDefault.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgbDatepickerI18nDefault.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerService {
    /**
     * @param {?} _calendar
     * @param {?} _i18n
     */
    constructor(_calendar, _i18n) {
        this._calendar = _calendar;
        this._i18n = _i18n;
        this._model$ = new Subject();
        this._select$ = new Subject();
        this._state = {
            disabled: false,
            displayMonths: 1,
            firstDayOfWeek: 1,
            focusVisible: false,
            months: [],
            navigation: 'select',
            outsideDays: 'visible',
            prevDisabled: false,
            nextDisabled: false,
            selectBoxes: { years: [], months: [] },
            selectedDate: null
        };
    }
    /**
     * @return {?}
     */
    get model$() { return this._model$.pipe(filter(model => model.months.length > 0)); }
    /**
     * @return {?}
     */
    get select$() { return this._select$.pipe(filter(date => date !== null)); }
    /**
     * @param {?} disabled
     * @return {?}
     */
    set disabled(disabled) {
        if (this._state.disabled !== disabled) {
            this._nextState({ disabled });
        }
    }
    /**
     * @param {?} displayMonths
     * @return {?}
     */
    set displayMonths(displayMonths) {
        displayMonths = toInteger(displayMonths);
        if (isInteger(displayMonths) && displayMonths > 0 && this._state.displayMonths !== displayMonths) {
            this._nextState({ displayMonths });
        }
    }
    /**
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    set firstDayOfWeek(firstDayOfWeek) {
        firstDayOfWeek = toInteger(firstDayOfWeek);
        if (isInteger(firstDayOfWeek) && firstDayOfWeek >= 0 && this._state.firstDayOfWeek !== firstDayOfWeek) {
            this._nextState({ firstDayOfWeek });
        }
    }
    /**
     * @param {?} focusVisible
     * @return {?}
     */
    set focusVisible(focusVisible) {
        if (this._state.focusVisible !== focusVisible && !this._state.disabled) {
            this._nextState({ focusVisible });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set maxDate(date) {
        /** @type {?} */
        const maxDate = this.toValidDate(date, null);
        if (isChangedDate(this._state.maxDate, maxDate)) {
            this._nextState({ maxDate });
        }
    }
    /**
     * @param {?} markDisabled
     * @return {?}
     */
    set markDisabled(markDisabled) {
        if (this._state.markDisabled !== markDisabled) {
            this._nextState({ markDisabled });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set minDate(date) {
        /** @type {?} */
        const minDate = this.toValidDate(date, null);
        if (isChangedDate(this._state.minDate, minDate)) {
            this._nextState({ minDate });
        }
    }
    /**
     * @param {?} navigation
     * @return {?}
     */
    set navigation(navigation) {
        if (this._state.navigation !== navigation) {
            this._nextState({ navigation });
        }
    }
    /**
     * @param {?} outsideDays
     * @return {?}
     */
    set outsideDays(outsideDays) {
        if (this._state.outsideDays !== outsideDays) {
            this._nextState({ outsideDays });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    focus(date) {
        if (!this._state.disabled && this._calendar.isValid(date) && isChangedDate(this._state.focusDate, date)) {
            this._nextState({ focusDate: date });
        }
    }
    /**
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    focusMove(period, number) {
        this.focus(this._calendar.getNext(this._state.focusDate, period, number));
    }
    /**
     * @return {?}
     */
    focusSelect() {
        if (isDateSelectable(this._state.focusDate, this._state)) {
            this.select(this._state.focusDate, { emitEvent: true });
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    open(date) {
        /** @type {?} */
        const firstDate = this.toValidDate(date, this._calendar.getToday());
        if (!this._state.disabled) {
            this._nextState({ firstDate });
        }
    }
    /**
     * @param {?} date
     * @param {?=} options
     * @return {?}
     */
    select(date, options = {}) {
        /** @type {?} */
        const selectedDate = this.toValidDate(date, null);
        if (!this._state.disabled) {
            if (isChangedDate(this._state.selectedDate, selectedDate)) {
                this._nextState({ selectedDate });
            }
            if (options.emitEvent && isDateSelectable(selectedDate, this._state)) {
                this._select$.next(selectedDate);
            }
        }
    }
    /**
     * @param {?} date
     * @param {?=} defaultValue
     * @return {?}
     */
    toValidDate(date, defaultValue) {
        /** @type {?} */
        const ngbDate = NgbDate.from(date);
        if (defaultValue === undefined) {
            defaultValue = this._calendar.getToday();
        }
        return this._calendar.isValid(ngbDate) ? ngbDate : defaultValue;
    }
    /**
     * @param {?} patch
     * @return {?}
     */
    _nextState(patch) {
        /** @type {?} */
        const newState = this._updateState(patch);
        this._patchContexts(newState);
        this._state = newState;
        this._model$.next(this._state);
    }
    /**
     * @param {?} state
     * @return {?}
     */
    _patchContexts(state) {
        const { months, displayMonths, selectedDate, focusDate, focusVisible, disabled, outsideDays } = state;
        state.months.forEach(month => {
            month.weeks.forEach(week => {
                week.days.forEach(day => {
                    // patch focus flag
                    if (focusDate) {
                        day.context.focused = focusDate.equals(day.date) && focusVisible;
                    }
                    // calculating tabindex
                    day.tabindex = !disabled && day.date.equals(focusDate) && focusDate.month === month.number ? 0 : -1;
                    // override context disabled
                    if (disabled === true) {
                        day.context.disabled = true;
                    }
                    // patch selection flag
                    if (selectedDate !== undefined) {
                        day.context.selected = selectedDate !== null && selectedDate.equals(day.date);
                    }
                    // visibility
                    if (month.number !== day.date.month) {
                        day.hidden = outsideDays === 'hidden' || outsideDays === 'collapsed' ||
                            (displayMonths > 1 && day.date.after(months[0].firstDate) &&
                                day.date.before(months[displayMonths - 1].lastDate));
                    }
                });
            });
        });
    }
    /**
     * @param {?} patch
     * @return {?}
     */
    _updateState(patch) {
        /** @type {?} */
        const state = Object.assign({}, this._state, patch);
        /** @type {?} */
        let startDate = state.firstDate;
        // min/max dates changed
        if ('minDate' in patch || 'maxDate' in patch) {
            checkMinBeforeMax(state.minDate, state.maxDate);
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
        }
        // disabled
        if ('disabled' in patch) {
            state.focusVisible = false;
        }
        // initial rebuild via 'select()'
        if ('selectedDate' in patch && this._state.months.length === 0) {
            startDate = state.selectedDate;
        }
        // focus date changed
        if ('focusDate' in patch) {
            state.focusDate = checkDateInRange(state.focusDate, state.minDate, state.maxDate);
            startDate = state.focusDate;
            // nothing to rebuild if only focus changed and it is still visible
            if (state.months.length !== 0 && !state.focusDate.before(state.firstDate) &&
                !state.focusDate.after(state.lastDate)) {
                return state;
            }
        }
        // first date changed
        if ('firstDate' in patch) {
            state.firstDate = checkDateInRange(state.firstDate, state.minDate, state.maxDate);
            startDate = state.firstDate;
        }
        // rebuilding months
        if (startDate) {
            /** @type {?} */
            const forceRebuild = 'firstDayOfWeek' in patch || 'markDisabled' in patch || 'minDate' in patch ||
                'maxDate' in patch || 'disabled' in patch || 'outsideDays' in patch;
            /** @type {?} */
            const months = buildMonths(this._calendar, startDate, state, this._i18n, forceRebuild);
            // updating months and boundary dates
            state.months = months;
            state.firstDate = months.length > 0 ? months[0].firstDate : undefined;
            state.lastDate = months.length > 0 ? months[months.length - 1].lastDate : undefined;
            // reset selected date if 'markDisabled' returns true
            if ('selectedDate' in patch && !isDateSelectable(state.selectedDate, state)) {
                state.selectedDate = null;
            }
            // adjusting focus after months were built
            if ('firstDate' in patch) {
                if (state.focusDate === undefined || state.focusDate.before(state.firstDate) ||
                    state.focusDate.after(state.lastDate)) {
                    state.focusDate = startDate;
                }
            }
            /** @type {?} */
            const yearChanged = !this._state.firstDate || this._state.firstDate.year !== state.firstDate.year;
            /** @type {?} */
            const monthChanged = !this._state.firstDate || this._state.firstDate.month !== state.firstDate.month;
            if (state.navigation === 'select') {
                // years ->  boundaries (min/max were changed)
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.years.length === 0 || yearChanged) {
                    state.selectBoxes.years = generateSelectBoxYears(state.firstDate, state.minDate, state.maxDate);
                }
                // months -> when current year or boundaries change
                if ('minDate' in patch || 'maxDate' in patch || state.selectBoxes.months.length === 0 || yearChanged) {
                    state.selectBoxes.months =
                        generateSelectBoxMonths(this._calendar, state.firstDate, state.minDate, state.maxDate);
                }
            }
            else {
                state.selectBoxes = { years: [], months: [] };
            }
            // updating navigation arrows -> boundaries change (min/max) or month/year changes
            if ((state.navigation === 'arrows' || state.navigation === 'select') &&
                (monthChanged || yearChanged || 'minDate' in patch || 'maxDate' in patch || 'disabled' in patch)) {
                state.prevDisabled = state.disabled || prevMonthDisabled(this._calendar, state.firstDate, state.minDate);
                state.nextDisabled = state.disabled || nextMonthDisabled(this._calendar, state.lastDate, state.maxDate);
            }
        }
        return state;
    }
}
NgbDatepickerService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgbDatepickerService.ctorParameters = () => [
    { type: NgbCalendar },
    { type: NgbDatepickerI18n }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const Key = {
    Tab: 9,
    Enter: 13,
    Escape: 27,
    Space: 32,
    PageUp: 33,
    PageDown: 34,
    End: 35,
    Home: 36,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
};
Key[Key.Tab] = 'Tab';
Key[Key.Enter] = 'Enter';
Key[Key.Escape] = 'Escape';
Key[Key.Space] = 'Space';
Key[Key.PageUp] = 'PageUp';
Key[Key.PageDown] = 'PageDown';
Key[Key.End] = 'End';
Key[Key.Home] = 'Home';
Key[Key.ArrowLeft] = 'ArrowLeft';
Key[Key.ArrowUp] = 'ArrowUp';
Key[Key.ArrowRight] = 'ArrowRight';
Key[Key.ArrowDown] = 'ArrowDown';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerKeyMapService {
    /**
     * @param {?} _service
     * @param {?} _calendar
     */
    constructor(_service, _calendar) {
        this._service = _service;
        this._calendar = _calendar;
        _service.model$.subscribe(model => {
            this._minDate = model.minDate;
            this._maxDate = model.maxDate;
            this._firstViewDate = model.firstDate;
            this._lastViewDate = model.lastDate;
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    processKey(event) {
        if (Key[toString(event.which)]) {
            switch (event.which) {
                case Key.PageUp:
                    this._service.focusMove(event.shiftKey ? 'y' : 'm', -1);
                    break;
                case Key.PageDown:
                    this._service.focusMove(event.shiftKey ? 'y' : 'm', 1);
                    break;
                case Key.End:
                    this._service.focus(event.shiftKey ? this._maxDate : this._lastViewDate);
                    break;
                case Key.Home:
                    this._service.focus(event.shiftKey ? this._minDate : this._firstViewDate);
                    break;
                case Key.ArrowLeft:
                    this._service.focusMove('d', -1);
                    break;
                case Key.ArrowUp:
                    this._service.focusMove('d', -this._calendar.getDaysPerWeek());
                    break;
                case Key.ArrowRight:
                    this._service.focusMove('d', 1);
                    break;
                case Key.ArrowDown:
                    this._service.focusMove('d', this._calendar.getDaysPerWeek());
                    break;
                case Key.Enter:
                case Key.Space:
                    this._service.focusSelect();
                    break;
                default:
                    return;
            }
            event.preventDefault();
            event.stopPropagation();
        }
    }
}
NgbDatepickerKeyMapService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgbDatepickerKeyMapService.ctorParameters = () => [
    { type: NgbDatepickerService },
    { type: NgbCalendar }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const NavigationEvent = {
    PREV: 0,
    NEXT: 1,
};
NavigationEvent[NavigationEvent.PREV] = 'PREV';
NavigationEvent[NavigationEvent.NEXT] = 'NEXT';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbDatepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the datepickers used in the application.
 */
class NgbDatepickerConfig {
    constructor() {
        this.displayMonths = 1;
        this.firstDayOfWeek = 1;
        this.navigation = 'select';
        this.outsideDays = 'visible';
        this.showWeekdays = true;
        this.showWeekNumbers = false;
    }
}
NgbDatepickerConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbDatepickerConfig.ngInjectableDef = defineInjectable({ factory: function NgbDatepickerConfig_Factory() { return new NgbDatepickerConfig(); }, token: NgbDatepickerConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Abstract type serving as a DI token for the service converting from your application Date model to internal
 * NgbDateStruct model.
 * A default implementation converting from and to NgbDateStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 * @abstract
 * @template D
 */
class NgbDateAdapter {
}
NgbDateAdapter.decorators = [
    { type: Injectable },
];
class NgbDateStructAdapter extends NgbDateAdapter {
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    fromModel(date) {
        return (date && date.year && date.month && date.day) ? { year: date.year, month: date.month, day: date.day } : null;
    }
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    toModel(date) {
        return (date && date.year && date.month && date.day) ? { year: date.year, month: date.month, day: date.day } : null;
    }
}
NgbDateStructAdapter.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbDatepicker),
    multi: true
};
/**
 * A lightweight and highly configurable datepicker directive
 */
class NgbDatepicker {
    /**
     * @param {?} _keyMapService
     * @param {?} _service
     * @param {?} _calendar
     * @param {?} i18n
     * @param {?} config
     * @param {?} _cd
     * @param {?} _elementRef
     * @param {?} _ngbDateAdapter
     * @param {?} _ngZone
     */
    constructor(_keyMapService, _service, _calendar, i18n, config, _cd, _elementRef, _ngbDateAdapter, _ngZone) {
        this._keyMapService = _keyMapService;
        this._service = _service;
        this._calendar = _calendar;
        this.i18n = i18n;
        this._cd = _cd;
        this._elementRef = _elementRef;
        this._ngbDateAdapter = _ngbDateAdapter;
        this._ngZone = _ngZone;
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new EventEmitter();
        /**
         * An event fired when user selects a date using keyboard or mouse.
         * The payload of the event is currently selected NgbDate.
         */
        this.select = new EventEmitter();
        this.onChange = (_) => { };
        this.onTouched = () => { };
        ['dayTemplate', 'displayMonths', 'firstDayOfWeek', 'markDisabled', 'minDate', 'maxDate', 'navigation',
            'outsideDays', 'showWeekdays', 'showWeekNumbers', 'startDate']
            .forEach(input => this[input] = config[input]);
        this._selectSubscription = _service.select$.subscribe(date => { this.select.emit(date); });
        this._subscription = _service.model$.subscribe(model => {
            /** @type {?} */
            const newDate = model.firstDate;
            /** @type {?} */
            const oldDate = this.model ? this.model.firstDate : null;
            /** @type {?} */
            const newSelectedDate = model.selectedDate;
            /** @type {?} */
            const oldSelectedDate = this.model ? this.model.selectedDate : null;
            /** @type {?} */
            const newFocusedDate = model.focusDate;
            /** @type {?} */
            const oldFocusedDate = this.model ? this.model.focusDate : null;
            this.model = model;
            // handling selection change
            if (isChangedDate(newSelectedDate, oldSelectedDate)) {
                this.onTouched();
                this.onChange(this._ngbDateAdapter.toModel(newSelectedDate));
            }
            // handling focus change
            if (isChangedDate(newFocusedDate, oldFocusedDate) && oldFocusedDate && model.focusVisible) {
                this.focus();
            }
            // emitting navigation event if the first month changes
            if (!newDate.equals(oldDate)) {
                this.navigate.emit({
                    current: oldDate ? { year: oldDate.year, month: oldDate.month } : null,
                    next: { year: newDate.year, month: newDate.month }
                });
            }
            _cd.markForCheck();
        });
    }
    /**
     * Manually focus the focusable day in the datepicker
     * @return {?}
     */
    focus() {
        this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
            /** @type {?} */
            const elementToFocus = this._elementRef.nativeElement.querySelector('div.ngb-dp-day[tabindex="0"]');
            if (elementToFocus) {
                elementToFocus.focus();
            }
        });
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    navigateTo(date) {
        this._service.open(NgbDate.from(date ? Object.assign({}, date, { day: 1 }) : null));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._subscription.unsubscribe();
        this._selectSubscription.unsubscribe();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.model === undefined) {
            ['displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate', 'outsideDays'].forEach(input => this._service[input] = this[input]);
            this.navigateTo(this.startDate);
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        ['displayMonths', 'markDisabled', 'firstDayOfWeek', 'navigation', 'minDate', 'maxDate', 'outsideDays']
            .filter(input => input in changes)
            .forEach(input => this._service[input] = this[input]);
        if ('startDate' in changes) {
            this.navigateTo(this.startDate);
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    onDateSelect(date) {
        this._service.focus(date);
        this._service.select(date, { emitEvent: true });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyDown(event) { this._keyMapService.processKey(event); }
    /**
     * @param {?} date
     * @return {?}
     */
    onNavigateDateSelect(date) { this._service.open(date); }
    /**
     * @param {?} event
     * @return {?}
     */
    onNavigateEvent(event) {
        switch (event) {
            case NavigationEvent.PREV:
                this._service.open(this._calendar.getPrev(this.model.firstDate, 'm', 1));
                break;
            case NavigationEvent.NEXT:
                this._service.open(this._calendar.getNext(this.model.firstDate, 'm', 1));
                break;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this._service.disabled = isDisabled; }
    /**
     * @param {?} focusVisible
     * @return {?}
     */
    showFocus(focusVisible) { this._service.focusVisible = focusVisible; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) { this._service.select(NgbDate.from(this._ngbDateAdapter.fromModel(value))); }
}
NgbDatepicker.decorators = [
    { type: Component, args: [{
                exportAs: 'ngbDatepicker',
                selector: 'ngb-datepicker',
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    :host {
      border: 1px solid #dfdfdf;
      border-radius: 0.25rem;
      display: inline-block;
    }
    .ngb-dp-month {
      pointer-events: none;
    }
    .ngb-dp-header {
      border-bottom: 0;
      border-radius: 0.25rem 0.25rem 0 0;
      padding-top: 0.25rem;
    }
    ngb-datepicker-month-view {
      pointer-events: auto;
    }
    .ngb-dp-month-name {
      font-size: larger;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
    }
    /deep/ .ngb-dp-month + .ngb-dp-month > ngb-datepicker-month-view > .ngb-dp-week {
      padding-left: 1rem;
    }
    /deep/ .ngb-dp-month + .ngb-dp-month > .ngb-dp-month-name {
      padding-left: 1rem;
    }
    /deep/ .ngb-dp-month:last-child .ngb-dp-week {
      padding-right: .25rem;
    }
    /deep/ .ngb-dp-month:first-child .ngb-dp-week {
      padding-left: .25rem;
    }
    /deep/ .ngb-dp-month > ngb-datepicker-month-view > .ngb-dp-week:last-child {
      padding-bottom: .25rem;
    }
    .ngb-dp-months {
      display: -ms-flexbox;
      display: flex;
    }
  `],
                template: `
    <ng-template #dt let-date="date" let-currentMonth="currentMonth" let-selected="selected" let-disabled="disabled" let-focused="focused">
      <div ngbDatepickerDayView
        [date]="date"
        [currentMonth]="currentMonth"
        [selected]="selected"
        [disabled]="disabled"
        [focused]="focused">
      </div>
    </ng-template>

    <div class="ngb-dp-header bg-light">
      <ngb-datepicker-navigation *ngIf="navigation !== 'none'"
        [date]="model.firstDate"
        [months]="model.months"
        [disabled]="model.disabled"
        [showSelect]="model.navigation === 'select'"
        [prevDisabled]="model.prevDisabled"
        [nextDisabled]="model.nextDisabled"
        [selectBoxes]="model.selectBoxes"
        (navigate)="onNavigateEvent($event)"
        (select)="onNavigateDateSelect($event)">
      </ngb-datepicker-navigation>
    </div>

    <div class="ngb-dp-months" (keydown)="onKeyDown($event)" (focusin)="showFocus(true)" (focusout)="showFocus(false)">
      <ng-template ngFor let-month [ngForOf]="model.months" let-i="index">
        <div class="ngb-dp-month">
          <div *ngIf="navigation === 'none' || (displayMonths > 1 && navigation === 'select')"
                class="ngb-dp-month-name bg-light">
            {{ i18n.getMonthFullName(month.number) }} {{ i18n.getYearNumerals(month.year) }}
          </div>
          <ngb-datepicker-month-view
            [month]="month"
            [dayTemplate]="dayTemplate || dt"
            [showWeekdays]="showWeekdays"
            [showWeekNumbers]="showWeekNumbers"
            (select)="onDateSelect($event)">
          </ngb-datepicker-month-view>
        </div>
      </ng-template>
    </div>
  `,
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NgbDatepickerService, NgbDatepickerKeyMapService]
            },] },
];
/** @nocollapse */
NgbDatepicker.ctorParameters = () => [
    { type: NgbDatepickerKeyMapService },
    { type: NgbDatepickerService },
    { type: NgbCalendar },
    { type: NgbDatepickerI18n },
    { type: NgbDatepickerConfig },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NgbDateAdapter },
    { type: NgZone }
];
NgbDatepicker.propDecorators = {
    dayTemplate: [{ type: Input }],
    displayMonths: [{ type: Input }],
    firstDayOfWeek: [{ type: Input }],
    markDisabled: [{ type: Input }],
    maxDate: [{ type: Input }],
    minDate: [{ type: Input }],
    navigation: [{ type: Input }],
    outsideDays: [{ type: Input }],
    showWeekdays: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    startDate: [{ type: Input }],
    navigate: [{ type: Output }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerMonthView {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    /**
     * @param {?} day
     * @return {?}
     */
    doSelect(day) {
        if (!day.context.disabled && !day.hidden) {
            this.select.emit(day.date);
        }
    }
}
NgbDatepickerMonthView.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-month-view',
                host: { 'role': 'grid' },
                styles: [`
    :host {
      display: block;
    }
    .ngb-dp-weekday, .ngb-dp-week-number {
      line-height: 2rem;
      text-align: center;
      font-style: italic;
    }
    .ngb-dp-weekday {
      color: #5bc0de;
      color: var(--info);
    }
    .ngb-dp-week {
      border-radius: 0.25rem;
      display: -ms-flexbox;
      display: flex;
    }
    .ngb-dp-weekdays {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      border-radius: 0;
    }
    .ngb-dp-day, .ngb-dp-weekday, .ngb-dp-week-number {
      width: 2rem;
      height: 2rem;
    }
    .ngb-dp-day {
      cursor: pointer;
    }
    .ngb-dp-day.disabled, .ngb-dp-day.hidden {
      cursor: default;
    }
  `],
                template: `
    <div *ngIf="showWeekdays" class="ngb-dp-week ngb-dp-weekdays bg-light">
      <div *ngIf="showWeekNumbers" class="ngb-dp-weekday ngb-dp-showweek"></div>
      <div *ngFor="let w of month.weekdays" class="ngb-dp-weekday small">
        {{ i18n.getWeekdayShortName(w) }}
      </div>
    </div>
    <ng-template ngFor let-week [ngForOf]="month.weeks">
      <div *ngIf="!week.collapsed" class="ngb-dp-week" role="row">
        <div *ngIf="showWeekNumbers" class="ngb-dp-week-number small text-muted">{{ i18n.getWeekNumerals(week.number) }}</div>
        <div *ngFor="let day of week.days" (click)="doSelect(day)" class="ngb-dp-day" role="gridcell"
          [class.disabled]="day.context.disabled"
          [tabindex]="day.tabindex"
          [class.hidden]="day.hidden"
          [attr.aria-label]="day.ariaLabel">
          <ng-template [ngIf]="!day.hidden">
            <ng-template [ngTemplateOutlet]="dayTemplate" [ngTemplateOutletContext]="day.context"></ng-template>
          </ng-template>
        </div>
      </div>
    </ng-template>
  `
            },] },
];
/** @nocollapse */
NgbDatepickerMonthView.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerMonthView.propDecorators = {
    dayTemplate: [{ type: Input }],
    month: [{ type: Input }],
    showWeekdays: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerNavigation {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.navigation = NavigationEvent;
        this.months = [];
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
}
NgbDatepickerNavigation.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-navigation',
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    :host {
      display: -ms-flexbox;
      display: flex;
      align-items: center;
    }
    .ngb-dp-navigation-chevron {
      border-style: solid;
      border-width: 0.2em 0.2em 0 0;
      display: inline-block;
      width: 0.75em;
      height: 0.75em;
      margin-left: 0.25em;
      margin-right: 0.15em;
      transform: rotate(-135deg);
      -ms-transform: rotate(-135deg);
    }
    .right .ngb-dp-navigation-chevron {
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
      margin-left: 0.15em;
      margin-right: 0.25em;
    }
    .ngb-dp-arrow {
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1 1 auto;
      flex-grow: 1;
      padding-right: 0;
      padding-left: 0;
      margin: 0;
      width: 2rem;
      height: 2rem;
    }
    .ngb-dp-arrow.right {
      -ms-flex-pack: end;
      justify-content: flex-end;
    }
    .ngb-dp-arrow-btn {
      padding: 0 0.25rem;
      margin: 0 0.5rem;
      border: none;
      background-color: transparent;
      z-index: 1;
    }
    .ngb-dp-arrow-btn:focus {
      outline: auto 1px;
    }
    .ngb-dp-month-name {
      font-size: larger;
      height: 2rem;
      line-height: 2rem;
      text-align: center;
    }
    .ngb-dp-navigation-select {
      display: -ms-flexbox;
      display: flex;
      -ms-flex: 1 1 9rem;
      flex-grow: 1;
      flex-basis: 9rem;
    }
  `],
                template: `
    <div class="ngb-dp-arrow">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="!!navigate.emit(navigation.PREV)" [disabled]="prevDisabled"
              i18n-aria-label="@@ngb.datepicker.previous-month" aria-label="Previous month"
              i18n-title="@@ngb.datepicker.previous-month" title="Previous month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    <ngb-datepicker-navigation-select *ngIf="showSelect" class="ngb-dp-navigation-select"
      [date]="date"
      [disabled] = "disabled"
      [months]="selectBoxes.months"
      [years]="selectBoxes.years"
      (select)="select.emit($event)">
    </ngb-datepicker-navigation-select>

    <ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
      <div class="ngb-dp-arrow" *ngIf="i > 0"></div>
      <div class="ngb-dp-month-name">
        {{ i18n.getMonthFullName(month.number) }} {{ month.year }}
      </div>
      <div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
    </ng-template>
    <div class="ngb-dp-arrow right">
      <button type="button" class="btn btn-link ngb-dp-arrow-btn" (click)="!!navigate.emit(navigation.NEXT)" [disabled]="nextDisabled"
              i18n-aria-label="@@ngb.datepicker.next-month" aria-label="Next month"
              i18n-title="@@ngb.datepicker.next-month" title="Next month">
        <span class="ngb-dp-navigation-chevron"></span>
      </button>
    </div>
    `
            },] },
];
/** @nocollapse */
NgbDatepickerNavigation.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerNavigation.propDecorators = {
    date: [{ type: Input }],
    disabled: [{ type: Input }],
    months: [{ type: Input }],
    showSelect: [{ type: Input }],
    prevDisabled: [{ type: Input }],
    nextDisabled: [{ type: Input }],
    selectBoxes: [{ type: Input }],
    navigate: [{ type: Output }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 * @abstract
 */
class NgbDateParserFormatter {
}
class NgbDateISOParserFormatter extends NgbDateParserFormatter {
    /**
     * @param {?} value
     * @return {?}
     */
    parse(value) {
        if (value) {
            /** @type {?} */
            const dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
            }
        }
        return null;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    format(date) {
        return date ?
            `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
            '';
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Positioning {
    /**
     * @param {?} element
     * @return {?}
     */
    getAllStyles(element) { return window.getComputedStyle(element); }
    /**
     * @param {?} element
     * @param {?} prop
     * @return {?}
     */
    getStyle(element, prop) { return this.getAllStyles(element)[prop]; }
    /**
     * @param {?} element
     * @return {?}
     */
    isStaticPositioned(element) {
        return (this.getStyle(element, 'position') || 'static') === 'static';
    }
    /**
     * @param {?} element
     * @return {?}
     */
    offsetParent(element) {
        /** @type {?} */
        let offsetParentEl = /** @type {?} */ (element.offsetParent) || document.documentElement;
        while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
            offsetParentEl = /** @type {?} */ (offsetParentEl.offsetParent);
        }
        return offsetParentEl || document.documentElement;
    }
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    position(element, round = true) {
        /** @type {?} */
        let elPosition;
        /** @type {?} */
        let parentOffset = { width: 0, height: 0, top: 0, bottom: 0, left: 0, right: 0 };
        if (this.getStyle(element, 'position') === 'fixed') {
            elPosition = element.getBoundingClientRect();
        }
        else {
            /** @type {?} */
            const offsetParentEl = this.offsetParent(element);
            elPosition = this.offset(element, false);
            if (offsetParentEl !== document.documentElement) {
                parentOffset = this.offset(offsetParentEl, false);
            }
            parentOffset.top += offsetParentEl.clientTop;
            parentOffset.left += offsetParentEl.clientLeft;
        }
        elPosition.top -= parentOffset.top;
        elPosition.bottom -= parentOffset.top;
        elPosition.left -= parentOffset.left;
        elPosition.right -= parentOffset.left;
        if (round) {
            elPosition.top = Math.round(elPosition.top);
            elPosition.bottom = Math.round(elPosition.bottom);
            elPosition.left = Math.round(elPosition.left);
            elPosition.right = Math.round(elPosition.right);
        }
        return elPosition;
    }
    /**
     * @param {?} element
     * @param {?=} round
     * @return {?}
     */
    offset(element, round = true) {
        /** @type {?} */
        const elBcr = element.getBoundingClientRect();
        /** @type {?} */
        const viewportOffset = {
            top: window.pageYOffset - document.documentElement.clientTop,
            left: window.pageXOffset - document.documentElement.clientLeft
        };
        /** @type {?} */
        let elOffset = {
            height: elBcr.height || element.offsetHeight,
            width: elBcr.width || element.offsetWidth,
            top: elBcr.top + viewportOffset.top,
            bottom: elBcr.bottom + viewportOffset.top,
            left: elBcr.left + viewportOffset.left,
            right: elBcr.right + viewportOffset.left
        };
        if (round) {
            elOffset.height = Math.round(elOffset.height);
            elOffset.width = Math.round(elOffset.width);
            elOffset.top = Math.round(elOffset.top);
            elOffset.bottom = Math.round(elOffset.bottom);
            elOffset.left = Math.round(elOffset.left);
            elOffset.right = Math.round(elOffset.right);
        }
        return elOffset;
    }
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @param {?} placement
     * @param {?=} appendToBody
     * @return {?}
     */
    positionElements(hostElement, targetElement, placement, appendToBody) {
        /** @type {?} */
        const hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
        /** @type {?} */
        const targetElStyles = this.getAllStyles(targetElement);
        /** @type {?} */
        const targetElBCR = targetElement.getBoundingClientRect();
        /** @type {?} */
        const placementPrimary = placement.split('-')[0] || 'top';
        /** @type {?} */
        const placementSecondary = placement.split('-')[1] || 'center';
        /** @type {?} */
        let targetElPosition = {
            'height': targetElBCR.height || targetElement.offsetHeight,
            'width': targetElBCR.width || targetElement.offsetWidth,
            'top': 0,
            'bottom': targetElBCR.height || targetElement.offsetHeight,
            'left': 0,
            'right': targetElBCR.width || targetElement.offsetWidth
        };
        switch (placementPrimary) {
            case 'top':
                targetElPosition.top =
                    hostElPosition.top - (targetElement.offsetHeight + parseFloat(targetElStyles.marginBottom));
                break;
            case 'bottom':
                targetElPosition.top = hostElPosition.top + hostElPosition.height;
                break;
            case 'left':
                targetElPosition.left =
                    hostElPosition.left - (targetElement.offsetWidth + parseFloat(targetElStyles.marginRight));
                break;
            case 'right':
                targetElPosition.left = hostElPosition.left + hostElPosition.width;
                break;
        }
        switch (placementSecondary) {
            case 'top':
                targetElPosition.top = hostElPosition.top;
                break;
            case 'bottom':
                targetElPosition.top = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
                break;
            case 'left':
                targetElPosition.left = hostElPosition.left;
                break;
            case 'right':
                targetElPosition.left = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
                break;
            case 'center':
                if (placementPrimary === 'top' || placementPrimary === 'bottom') {
                    targetElPosition.left = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
                }
                else {
                    targetElPosition.top = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
                }
                break;
        }
        targetElPosition.top = Math.round(targetElPosition.top);
        targetElPosition.bottom = Math.round(targetElPosition.bottom);
        targetElPosition.left = Math.round(targetElPosition.left);
        targetElPosition.right = Math.round(targetElPosition.right);
        return targetElPosition;
    }
    /**
     * @param {?} hostElement
     * @param {?} targetElement
     * @return {?}
     */
    getAvailablePlacements(hostElement, targetElement) {
        /** @type {?} */
        let availablePlacements = [];
        /** @type {?} */
        let hostElemClientRect = hostElement.getBoundingClientRect();
        /** @type {?} */
        let targetElemClientRect = targetElement.getBoundingClientRect();
        /** @type {?} */
        let html = document.documentElement;
        /** @type {?} */
        let windowHeight = window.innerHeight || html.clientHeight;
        /** @type {?} */
        let windowWidth = window.innerWidth || html.clientWidth;
        /** @type {?} */
        let hostElemClientRectHorCenter = hostElemClientRect.left + hostElemClientRect.width / 2;
        /** @type {?} */
        let hostElemClientRectVerCenter = hostElemClientRect.top + hostElemClientRect.height / 2;
        // left: check if target width can be placed between host left and viewport start and also height of target is
        // inside viewport
        if (targetElemClientRect.width < hostElemClientRect.left) {
            // check for left only
            if (hostElemClientRectVerCenter > targetElemClientRect.height / 2 &&
                windowHeight - hostElemClientRectVerCenter > targetElemClientRect.height / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'left');
            }
            // check for left-top and left-bottom
            this.setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, 'left', availablePlacements);
        }
        // top: target height is less than host top
        if (targetElemClientRect.height < hostElemClientRect.top) {
            if (hostElemClientRectHorCenter > targetElemClientRect.width / 2 &&
                windowWidth - hostElemClientRectHorCenter > targetElemClientRect.width / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'top');
            }
            this.setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, 'top', availablePlacements);
        }
        // right: check if target width can be placed between host right and viewport end and also height of target is
        // inside viewport
        if (windowWidth - hostElemClientRect.right > targetElemClientRect.width) {
            // check for right only
            if (hostElemClientRectVerCenter > targetElemClientRect.height / 2 &&
                windowHeight - hostElemClientRectVerCenter > targetElemClientRect.height / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'right');
            }
            // check for right-top and right-bottom
            this.setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, 'right', availablePlacements);
        }
        // bottom: check if there is enough space between host bottom and viewport end for target height
        if (windowHeight - hostElemClientRect.bottom > targetElemClientRect.height) {
            if (hostElemClientRectHorCenter > targetElemClientRect.width / 2 &&
                windowWidth - hostElemClientRectHorCenter > targetElemClientRect.width / 2) {
                availablePlacements.splice(availablePlacements.length, 1, 'bottom');
            }
            this.setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, 'bottom', availablePlacements);
        }
        return availablePlacements;
    }
    /**
     * check if secondary placement for left and right are available i.e. left-top, left-bottom, right-top, right-bottom
     * primaryplacement: left|right
     * availablePlacementArr: array in which available placemets to be set
     * @param {?} hostElemClientRect
     * @param {?} targetElemClientRect
     * @param {?} primaryPlacement
     * @param {?} availablePlacementArr
     * @return {?}
     */
    setSecondaryPlacementForLeftRight(hostElemClientRect, targetElemClientRect, primaryPlacement, availablePlacementArr) {
        /** @type {?} */
        let html = document.documentElement;
        // check for left-bottom
        if (targetElemClientRect.height <= hostElemClientRect.bottom) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-bottom');
        }
        if ((window.innerHeight || html.clientHeight) - hostElemClientRect.top >= targetElemClientRect.height) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-top');
        }
    }
    /**
     * check if secondary placement for top and bottom are available i.e. top-left, top-right, bottom-left, bottom-right
     * primaryplacement: top|bottom
     * availablePlacementArr: array in which available placemets to be set
     * @param {?} hostElemClientRect
     * @param {?} targetElemClientRect
     * @param {?} primaryPlacement
     * @param {?} availablePlacementArr
     * @return {?}
     */
    setSecondaryPlacementForTopBottom(hostElemClientRect, targetElemClientRect, primaryPlacement, availablePlacementArr) {
        /** @type {?} */
        let html = document.documentElement;
        // check for left-bottom
        if ((window.innerWidth || html.clientWidth) - hostElemClientRect.left >= targetElemClientRect.width) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-left');
        }
        if (targetElemClientRect.width <= hostElemClientRect.right) {
            availablePlacementArr.splice(availablePlacementArr.length, 1, primaryPlacement + '-right');
        }
    }
}
/** @type {?} */
const positionService = new Positioning();
/**
 * @param {?} hostElement
 * @param {?} targetElement
 * @param {?} placement
 * @param {?=} appendToBody
 * @return {?}
 */
function positionElements(hostElement, targetElement, placement, appendToBody) {
    /** @type {?} */
    let placementVals = Array.isArray(placement) ? placement : [/** @type {?} */ (placement)];
    /** @type {?} */
    let hasAuto = placementVals.findIndex(val => val === 'auto');
    if (hasAuto >= 0) {
        ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-top',
            'left-bottom', 'right-top', 'right-bottom',
        ].forEach(function (obj) {
            if (placementVals.find(val => val.search('^' + obj) !== -1) == null) {
                placementVals.splice(hasAuto++, 1, /** @type {?} */ (obj));
            }
        });
    }
    /** @type {?} */
    let topVal = 0;
    /** @type {?} */
    let leftVal = 0;
    /** @type {?} */
    let appliedPlacement;
    /** @type {?} */
    let availablePlacements = positionService.getAvailablePlacements(hostElement, targetElement);
    // iterate over all the passed placements
    for (let { item, index } of toItemIndexes(placementVals)) {
        // check if passed placement is present in the available placement or otherwise apply the last placement in the
        // passed placement list
        if ((availablePlacements.find(val => val === item) != null) || (placementVals.length === index + 1)) {
            appliedPlacement = /** @type {?} */ (item);
            /** @type {?} */
            const pos = positionService.positionElements(hostElement, targetElement, item, appendToBody);
            topVal = pos.top;
            leftVal = pos.left;
            break;
        }
    }
    targetElement.style.top = `${topVal}px`;
    targetElement.style.left = `${leftVal}px`;
    return appliedPlacement;
}
/**
 * @template T
 * @param {?} a
 * @return {?}
 */
function toItemIndexes(a) {
    return a.map((item, index) => ({ item, index }));
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const FOCUSABLE_ELEMENTS_SELECTOR = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
    'textarea:not([disabled])', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
].join(', ');
/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 * @param {?} element
 * @return {?}
 */
function getFocusableBoundaryElements(element) {
    /** @type {?} */
    const list = element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
    return [list[0], list[list.length - 1]];
}
/** *
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * \@param element The element around which focus will be trapped inside
 * \@param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
  @type {?} */
const ngbFocusTrap = (element, stopFocusTrap$) => {
    /** @type {?} */
    const lastFocusedElement$ = fromEvent(element, 'focusin').pipe(takeUntil(stopFocusTrap$), map(e => e.target));
    // 'tab' / 'shift+tab' stream
    fromEvent(element, 'keydown')
        .pipe(takeUntil(stopFocusTrap$), filter(e => e.which === Key.Tab), withLatestFrom(lastFocusedElement$))
        .subscribe(([tabEvent, focusedElement]) => {
        const [first, last] = getFocusableBoundaryElements(element);
        if (focusedElement === first && tabEvent.shiftKey) {
            last.focus();
            tabEvent.preventDefault();
        }
        if (focusedElement === last && !tabEvent.shiftKey) {
            first.focus();
            tabEvent.preventDefault();
        }
    });
    // inside click
    fromEvent(element, 'click')
        .pipe(takeUntil(stopFocusTrap$), withLatestFrom(lastFocusedElement$), map(arr => /** @type {?} */ (arr[1])))
        .subscribe(lastFocusedElement => lastFocusedElement.focus());
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_DATEPICKER_VALUE_ACCESSOR$1 = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbInputDatepicker),
    multi: true
};
/** @type {?} */
const NGB_DATEPICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => NgbInputDatepicker),
    multi: true
};
/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
class NgbInputDatepicker {
    /**
     * @param {?} _parserFormatter
     * @param {?} _elRef
     * @param {?} _vcRef
     * @param {?} _renderer
     * @param {?} _cfr
     * @param {?} _ngZone
     * @param {?} _service
     * @param {?} _calendar
     * @param {?} _dateAdapter
     * @param {?} _document
     */
    constructor(_parserFormatter, _elRef, _vcRef, _renderer, _cfr, _ngZone, _service, _calendar, _dateAdapter, _document) {
        this._parserFormatter = _parserFormatter;
        this._elRef = _elRef;
        this._vcRef = _vcRef;
        this._renderer = _renderer;
        this._cfr = _cfr;
        this._ngZone = _ngZone;
        this._service = _service;
        this._calendar = _calendar;
        this._dateAdapter = _dateAdapter;
        this._document = _document;
        this._closed$ = new Subject();
        this._cRef = null;
        this._disabled = false;
        /**
         * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
         *
         * By default the popup will close on both date selection and outside click. If the value is 'false' the popup has to
         * be closed manually via '.close()' or '.toggle()' methods. If the value is set to 'inside' the popup will close on
         * date selection only. For the 'outside' the popup will close only on the outside click.
         *
         * \@since 3.0.0
         */
        this.autoClose = true;
        /**
         * Placement of a datepicker popup accepts:
         *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
         *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
         * and array of above values.
         */
        this.placement = 'bottom-left';
        /**
         * An event fired when user selects a date using keyboard or mouse.
         * The payload of the event is currently selected NgbDate.
         *
         * \@since 1.1.1
         */
        this.dateSelect = new EventEmitter();
        /**
         * An event fired when navigation happens and currently displayed month changes.
         * See NgbDatepickerNavigateEvent for the payload info.
         */
        this.navigate = new EventEmitter();
        this._onChange = (_) => { };
        this._onTouched = () => { };
        this._validatorChange = () => { };
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._cRef) {
                positionElements(this._elRef.nativeElement, this._cRef.location.nativeElement, this.placement, this.container === 'body');
            }
        });
    }
    /**
     * @return {?}
     */
    get disabled() {
        return this._disabled;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set disabled(value) {
        this._disabled = value === '' || (value && value !== 'false');
        if (this.isOpen()) {
            this._cRef.instance.setDisabledState(this._disabled);
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this._onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this._onTouched = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnValidatorChange(fn) { this._validatorChange = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} c
     * @return {?}
     */
    validate(c) {
        /** @type {?} */
        const value = c.value;
        if (value === null || value === undefined) {
            return null;
        }
        /** @type {?} */
        const ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
        if (!this._calendar.isValid(ngbDate)) {
            return { 'ngbDate': { invalid: c.value } };
        }
        if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
            return { 'ngbDate': { requiredBefore: this.minDate } };
        }
        if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
            return { 'ngbDate': { requiredAfter: this.maxDate } };
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    }
    /**
     * @param {?} value
     * @param {?=} updateView
     * @return {?}
     */
    manualDateChange(value, updateView = false) {
        this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    }
    /**
     * @return {?}
     */
    isOpen() { return !!this._cRef; }
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     * @return {?}
     */
    open() {
        if (!this.isOpen()) {
            /** @type {?} */
            const cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange((selectedDate) => {
                this.writeValue(selectedDate);
                this._onChange(selectedDate);
            });
            this._cRef.changeDetectorRef.detectChanges();
            this._cRef.instance.setDisabledState(this.disabled);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._cRef.location.nativeElement);
            }
            // focus handling
            ngbFocusTrap(this._cRef.location.nativeElement, this._closed$);
            this._cRef.instance.focus();
            // closing on ESC and outside clicks
            this._ngZone.runOutsideAngular(() => {
                /** @type {?} */
                const escapes$ = fromEvent(this._document, 'keyup')
                    .pipe(takeUntil(this._closed$), filter(e => e.which === Key.Escape));
                /** @type {?} */
                let outsideClicks$;
                if (this.autoClose === true || this.autoClose === 'outside') {
                    /** @type {?} */
                    let isOpening = true;
                    requestAnimationFrame(() => isOpening = false);
                    outsideClicks$ =
                        fromEvent(this._document, 'click')
                            .pipe(takeUntil(this._closed$), filter(event => !isOpening && this._shouldCloseOnOutsideClick(event)));
                }
                else {
                    outsideClicks$ = NEVER;
                }
                race([escapes$, outsideClicks$]).subscribe(() => this._ngZone.run(() => this.close()));
            });
        }
    }
    /**
     * Closes the datepicker popup.
     * @return {?}
     */
    close() {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._closed$.next();
        }
    }
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    navigateTo(date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    }
    /**
     * @return {?}
     */
    onBlur() { this._onTouched(); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    _applyDatepickerInputs(datepickerInstance) {
        ['dayTemplate', 'displayMonths', 'firstDayOfWeek', 'markDisabled', 'minDate', 'maxDate', 'navigation',
            'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
            .forEach((optionName) => {
            if (this[optionName] !== undefined) {
                datepickerInstance[optionName] = this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    }
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    _applyPopupStyling(nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
        this._renderer.addClass(nativeElement, 'show');
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseOnOutsideClick(event) {
        return ![this._elRef.nativeElement, this._cRef.location.nativeElement].some(el => el.contains(event.target));
    }
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    _subscribeForDatepickerOutputs(datepickerInstance) {
        datepickerInstance.navigate.subscribe(date => this.navigate.emit(date));
        datepickerInstance.select.subscribe(date => {
            this.dateSelect.emit(date);
            if (this.autoClose === true || this.autoClose === 'inside') {
                this.close();
            }
        });
    }
    /**
     * @param {?} model
     * @return {?}
     */
    _writeModelValue(model) {
        this._renderer.setProperty(this._elRef.nativeElement, 'value', this._parserFormatter.format(model));
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    _fromDateStruct(date) {
        /** @type {?} */
        const ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    }
}
NgbInputDatepicker.decorators = [
    { type: Directive, args: [{
                selector: 'input[ngbDatepicker]',
                exportAs: 'ngbDatepicker',
                host: {
                    '(input)': 'manualDateChange($event.target.value)',
                    '(change)': 'manualDateChange($event.target.value, true)',
                    '(blur)': 'onBlur()',
                    '[disabled]': 'disabled'
                },
                providers: [NGB_DATEPICKER_VALUE_ACCESSOR$1, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
            },] },
];
/** @nocollapse */
NgbInputDatepicker.ctorParameters = () => [
    { type: NgbDateParserFormatter },
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: Renderer2 },
    { type: ComponentFactoryResolver },
    { type: NgZone },
    { type: NgbDatepickerService },
    { type: NgbCalendar },
    { type: NgbDateAdapter },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbInputDatepicker.propDecorators = {
    autoClose: [{ type: Input }],
    dayTemplate: [{ type: Input }],
    displayMonths: [{ type: Input }],
    firstDayOfWeek: [{ type: Input }],
    markDisabled: [{ type: Input }],
    minDate: [{ type: Input }],
    maxDate: [{ type: Input }],
    navigation: [{ type: Input }],
    outsideDays: [{ type: Input }],
    placement: [{ type: Input }],
    showWeekdays: [{ type: Input }],
    showWeekNumbers: [{ type: Input }],
    startDate: [{ type: Input }],
    container: [{ type: Input }],
    dateSelect: [{ type: Output }],
    navigate: [{ type: Output }],
    disabled: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerDayView {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
    }
    /**
     * @return {?}
     */
    isMuted() { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); }
}
NgbDatepickerDayView.decorators = [
    { type: Component, args: [{
                selector: '[ngbDatepickerDayView]',
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    :host {
      text-align: center;
      width: 2rem;
      height: 2rem;
      line-height: 2rem;
      border-radius: 0.25rem;
      background: transparent;
    }
    :host.outside {
      opacity: 0.5;
    }
  `],
                host: {
                    'class': 'btn-light',
                    '[class.bg-primary]': 'selected',
                    '[class.text-white]': 'selected',
                    '[class.text-muted]': 'isMuted()',
                    '[class.outside]': 'isMuted()',
                    '[class.active]': 'focused'
                },
                template: `{{ i18n.getDayNumerals(date) }}`
            },] },
];
/** @nocollapse */
NgbDatepickerDayView.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerDayView.propDecorators = {
    currentMonth: [{ type: Input }],
    date: [{ type: Input }],
    disabled: [{ type: Input }],
    focused: [{ type: Input }],
    selected: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerNavigationSelect {
    /**
     * @param {?} i18n
     */
    constructor(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    /**
     * @param {?} month
     * @return {?}
     */
    changeMonth(month) { this.select.emit(new NgbDate(this.date.year, toInteger(month), 1)); }
    /**
     * @param {?} year
     * @return {?}
     */
    changeYear(year) { this.select.emit(new NgbDate(toInteger(year), this.date.month, 1)); }
}
NgbDatepickerNavigationSelect.decorators = [
    { type: Component, args: [{
                selector: 'ngb-datepicker-navigation-select',
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    :host>select {
      display: flex;
      display: -ms-flexbox;
      -ms-flex: 1 1 auto;
      width: 100%;
      padding: 0 0.5rem;
      font-size: 0.875rem;
      height: 1.85rem;
    }
  `],
                template: `
    <select
      [disabled]="disabled"
      class="custom-select"
      [value]="date?.month"
      (change)="changeMonth($event.target.value)">
        <option *ngFor="let m of months" [attr.aria-label]="i18n.getMonthFullName(m)" [value]="m">{{ i18n.getMonthShortName(m) }}</option>
    </select><select
      [disabled]="disabled"
      class="custom-select"
      [value]="date?.year"
      (change)="changeYear($event.target.value)">
        <option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
    </select>
  `
            },] },
];
/** @nocollapse */
NgbDatepickerNavigationSelect.ctorParameters = () => [
    { type: NgbDatepickerI18n }
];
NgbDatepickerNavigationSelect.propDecorators = {
    date: [{ type: Input }],
    disabled: [{ type: Input }],
    months: [{ type: Input }],
    years: [{ type: Input }],
    select: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @abstract
 */
class NgbCalendarHijri extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date = this._setYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = this._setMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return this._setDay(date, date.day + number);
            default:
                return date;
        }
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        const day = this.toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        /** @type {?} */
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        /** @type {?} */
        const date = week[thursdayIndex];
        /** @type {?} */
        const jsDate = this.toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));
        /** @type {?} */
        const time = jsDate.getTime();
        /** @type {?} */
        const MuhDate = this.toGregorian(new NgbDate(date.year, 1, 1)); // Compare with Muharram 1
        return Math.floor(Math.round((time - MuhDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return this.fromGregorian(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        return date && isNumber(date.year) && isNumber(date.month) && isNumber(date.day) &&
            !isNaN(this.toGregorian(date).getTime());
    }
    /**
     * @param {?} date
     * @param {?} day
     * @return {?}
     */
    _setDay(date, day) {
        day = +day;
        /** @type {?} */
        let mDays = this.getDaysPerMonth(date.month, date.year);
        if (day <= 0) {
            while (day <= 0) {
                date = this._setMonth(date, date.month - 1);
                mDays = this.getDaysPerMonth(date.month, date.year);
                day += mDays;
            }
        }
        else if (day > mDays) {
            while (day > mDays) {
                day -= mDays;
                date = this._setMonth(date, date.month + 1);
                mDays = this.getDaysPerMonth(date.month, date.year);
            }
        }
        date.day = day;
        return date;
    }
    /**
     * @param {?} date
     * @param {?} month
     * @return {?}
     */
    _setMonth(date, month) {
        month = +month;
        date.year = date.year + Math.floor((month - 1) / 12);
        date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
        return date;
    }
    /**
     * @param {?} date
     * @param {?} year
     * @return {?}
     */
    _setYear(date, year) {
        date.year = +year;
        return date;
    }
}
NgbCalendarHijri.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Checks if islamic year is a leap year
 * @param {?} hYear
 * @return {?}
 */
function isIslamicLeapYear(hYear) {
    return (14 + 11 * hYear) % 30 < 11;
}
/**
 * Checks if gregorian years is a leap year
 * @param {?} gDate
 * @return {?}
 */
function isGregorianLeapYear(gDate) {
    /** @type {?} */
    const year = gDate.getFullYear();
    return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
}
/**
 * Returns the start of Hijri Month.
 * `hMonth` is 0 for Muharram, 1 for Safar, etc.
 * `hYear` is any Hijri hYear.
 * @param {?} hYear
 * @param {?} hMonth
 * @return {?}
 */
function getIslamicMonthStart(hYear, hMonth) {
    return Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30.0);
}
/**
 * Returns the start of Hijri year.
 * `year` is any Hijri year.
 * @param {?} year
 * @return {?}
 */
function getIslamicYearStart(year) {
    return (year - 1) * 354 + Math.floor((3 + 11 * year) / 30.0);
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function mod(a, b) {
    return a - b * Math.floor(a / b);
}
/** *
 * The civil calendar is one type of Hijri calendars used in islamic countries.
 * Uses a fixed cycle of alternating 29- and 30-day months,
 * with a leap day added to the last month of 11 out of every 30 years.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
 * All the calculations here are based on the equations from "Calendrical Calculations" By Edward M. Reingold, Nachum
 * Dershowitz.
  @type {?} */
const GREGORIAN_EPOCH = 1721425.5;
/** @type {?} */
const ISLAMIC_EPOCH = 1948439.5;
class NgbCalendarIslamicCivil extends NgbCalendarHijri {
    /**
     * Returns the equivalent islamic(civil) date value for a give input Gregorian date.
     * `gDate` is a JS Date to be converted to Hijri.
     * @param {?} gDate
     * @return {?}
     */
    fromGregorian(gDate) {
        /** @type {?} */
        const gYear = gDate.getFullYear();
        /** @type {?} */
        const gMonth = gDate.getMonth();
        /** @type {?} */
        const gDay = gDate.getDate();
        /** @type {?} */
        let julianDay = GREGORIAN_EPOCH - 1 + 365 * (gYear - 1) + Math.floor((gYear - 1) / 4) +
            -Math.floor((gYear - 1) / 100) + Math.floor((gYear - 1) / 400) +
            Math.floor((367 * (gMonth + 1) - 362) / 12 + (gMonth + 1 <= 2 ? 0 : isGregorianLeapYear(gDate) ? -1 : -2) + gDay);
        julianDay = Math.floor(julianDay) + 0.5;
        /** @type {?} */
        const days = julianDay - ISLAMIC_EPOCH;
        /** @type {?} */
        const hYear = Math.floor((30 * days + 10646) / 10631.0);
        /** @type {?} */
        let hMonth = Math.ceil((days - 29 - getIslamicYearStart(hYear)) / 29.5);
        hMonth = Math.min(hMonth, 11);
        /** @type {?} */
        const hDay = Math.ceil(days - getIslamicMonthStart(hYear, hMonth)) + 1;
        return new NgbDate(hYear, hMonth + 1, hDay);
    }
    /**
     * Returns the equivalent JS date value for a give input islamic(civil) date.
     * `hDate` is an islamic(civil) date to be converted to Gregorian.
     * @param {?} hDate
     * @return {?}
     */
    toGregorian(hDate) {
        /** @type {?} */
        const hYear = hDate.year;
        /** @type {?} */
        const hMonth = hDate.month - 1;
        /** @type {?} */
        const hDay = hDate.day;
        /** @type {?} */
        const julianDay = hDay + Math.ceil(29.5 * hMonth) + (hYear - 1) * 354 + Math.floor((3 + 11 * hYear) / 30) + ISLAMIC_EPOCH - 1;
        /** @type {?} */
        const wjd = Math.floor(julianDay - 0.5) + 0.5;
        /** @type {?} */
        const depoch = wjd - GREGORIAN_EPOCH;
        /** @type {?} */
        const quadricent = Math.floor(depoch / 146097);
        /** @type {?} */
        const dqc = mod(depoch, 146097);
        /** @type {?} */
        const cent = Math.floor(dqc / 36524);
        /** @type {?} */
        const dcent = mod(dqc, 36524);
        /** @type {?} */
        const quad = Math.floor(dcent / 1461);
        /** @type {?} */
        const dquad = mod(dcent, 1461);
        /** @type {?} */
        const yindex = Math.floor(dquad / 365);
        /** @type {?} */
        let year = quadricent * 400 + cent * 100 + quad * 4 + yindex;
        if (!(cent === 4 || yindex === 4)) {
            year++;
        }
        /** @type {?} */
        const gYearStart = GREGORIAN_EPOCH + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400);
        /** @type {?} */
        const yearday = wjd - gYearStart;
        /** @type {?} */
        const tjd = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) + Math.floor(739 / 12 + (isGregorianLeapYear(new Date(year, 3, 1)) ? -1 : -2) + 1);
        /** @type {?} */
        const leapadj = wjd < tjd ? 0 : isGregorianLeapYear(new Date(year, 3, 1)) ? 1 : 2;
        /** @type {?} */
        const month = Math.floor(((yearday + leapadj) * 12 + 373) / 367);
        /** @type {?} */
        const tjd2 = GREGORIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor((year - 1) / 4) - Math.floor((year - 1) / 100) +
            Math.floor((year - 1) / 400) +
            Math.floor((367 * month - 362) / 12 + (month <= 2 ? 0 : isGregorianLeapYear(new Date(year, month - 1, 1)) ? -1 : -2) +
                1);
        /** @type {?} */
        const day = wjd - tjd2 + 1;
        return new Date(year, month - 1, day);
    }
    /**
     * Returns the number of days in a specific Hijri month.
     * `month` is 1 for Muharram, 2 for Safar, etc.
     * `year` is any Hijri year.
     * @param {?} month
     * @param {?} year
     * @return {?}
     */
    getDaysPerMonth(month, year) {
        year = year + Math.floor(month / 13);
        month = ((month - 1) % 12) + 1;
        /** @type {?} */
        let length = 29 + month % 2;
        if (month === 12 && isIslamicLeapYear(year)) {
            length++;
        }
        return length;
    }
}
NgbCalendarIslamicCivil.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Umalqura calendar is one type of Hijri calendars used in islamic countries.
 * This Calendar is used by Saudi Arabia for administrative purpose.
 * Unlike tabular calendars, the algorithm involves astronomical calculation, but it's still deterministic.
 * http://cldr.unicode.org/development/development-process/design-proposals/islamic-calendar-types
  @type {?} */
const GREGORIAN_FIRST_DATE = new Date(1882, 10, 12);
/** @type {?} */
const GREGORIAN_LAST_DATE = new Date(2174, 10, 25);
/** @type {?} */
const HIJRI_BEGIN = 1300;
/** @type {?} */
const HIJRI_END = 1600;
/** @type {?} */
const ONE_DAY = 1000 * 60 * 60 * 24;
/** @type {?} */
const MONTH_LENGTH = [
    '101010101010', '110101010100', '111011001001', '011011010100', '011011101010',
    '001101101100', '101010101101', '010101010101', '011010101001', '011110010010',
    '101110101001', '010111010100', '101011011010', '010101011100', '110100101101',
    '011010010101', '011101001010', '101101010100', '101101101010', '010110101101',
    '010010101110', '101001001111', '010100010111', '011010001011', '011010100101',
    '101011010101', '001011010110', '100101011011', '010010011101', '101001001101',
    '110100100110', '110110010101', '010110101100', '100110110110', '001010111010',
    '101001011011', '010100101011', '101010010101', '011011001010', '101011101001',
    '001011110100', '100101110110', '001010110110', '100101010110', '101011001010',
    '101110100100', '101111010010', '010111011001', '001011011100', '100101101101',
    '010101001101', '101010100101', '101101010010', '101110100101', '010110110100',
    '100110110110', '010101010111', '001010010111', '010101001011', '011010100011',
    '011101010010', '101101100101', '010101101010', '101010101011', '010100101011',
    '110010010101', '110101001010', '110110100101', '010111001010', '101011010110',
    '100101010111', '010010101011', '100101001011', '101010100101', '101101010010',
    '101101101010', '010101110101', '001001110110', '100010110111', '010001011011',
    '010101010101', '010110101001', '010110110100', '100111011010', '010011011101',
    '001001101110', '100100110110', '101010101010', '110101010100', '110110110010',
    '010111010101', '001011011010', '100101011011', '010010101011', '101001010101',
    '101101001001', '101101100100', '101101110001', '010110110100', '101010110101',
    '101001010101', '110100100101', '111010010010', '111011001001', '011011010100',
    '101011101001', '100101101011', '010010101011', '101010010011', '110101001001',
    '110110100100', '110110110010', '101010111001', '010010111010', '101001011011',
    '010100101011', '101010010101', '101100101010', '101101010101', '010101011100',
    '010010111101', '001000111101', '100100011101', '101010010101', '101101001010',
    '101101011010', '010101101101', '001010110110', '100100111011', '010010011011',
    '011001010101', '011010101001', '011101010100', '101101101010', '010101101100',
    '101010101101', '010101010101', '101100101001', '101110010010', '101110101001',
    '010111010100', '101011011010', '010101011010', '101010101011', '010110010101',
    '011101001001', '011101100100', '101110101010', '010110110101', '001010110110',
    '101001010110', '111001001101', '101100100101', '101101010010', '101101101010',
    '010110101101', '001010101110', '100100101111', '010010010111', '011001001011',
    '011010100101', '011010101100', '101011010110', '010101011101', '010010011101',
    '101001001101', '110100010110', '110110010101', '010110101010', '010110110101',
    '001011011010', '100101011011', '010010101101', '010110010101', '011011001010',
    '011011100100', '101011101010', '010011110101', '001010110110', '100101010110',
    '101010101010', '101101010100', '101111010010', '010111011001', '001011101010',
    '100101101101', '010010101101', '101010010101', '101101001010', '101110100101',
    '010110110010', '100110110101', '010011010110', '101010010111', '010101000111',
    '011010010011', '011101001001', '101101010101', '010101101010', '101001101011',
    '010100101011', '101010001011', '110101000110', '110110100011', '010111001010',
    '101011010110', '010011011011', '001001101011', '100101001011', '101010100101',
    '101101010010', '101101101001', '010101110101', '000101110110', '100010110111',
    '001001011011', '010100101011', '010101100101', '010110110100', '100111011010',
    '010011101101', '000101101101', '100010110110', '101010100110', '110101010010',
    '110110101001', '010111010100', '101011011010', '100101011011', '010010101011',
    '011001010011', '011100101001', '011101100010', '101110101001', '010110110010',
    '101010110101', '010101010101', '101100100101', '110110010010', '111011001001',
    '011011010010', '101011101001', '010101101011', '010010101011', '101001010101',
    '110100101001', '110101010100', '110110101010', '100110110101', '010010111010',
    '101000111011', '010010011011', '101001001101', '101010101010', '101011010101',
    '001011011010', '100101011101', '010001011110', '101000101110', '110010011010',
    '110101010101', '011010110010', '011010111001', '010010111010', '101001011101',
    '010100101101', '101010010101', '101101010010', '101110101000', '101110110100',
    '010110111001', '001011011010', '100101011010', '101101001010', '110110100100',
    '111011010001', '011011101000', '101101101010', '010101101101', '010100110101',
    '011010010101', '110101001010', '110110101000', '110111010100', '011011011010',
    '010101011011', '001010011101', '011000101011', '101100010101', '101101001010',
    '101110010101', '010110101010', '101010101110', '100100101110', '110010001111',
    '010100100111', '011010010101', '011010101010', '101011010110', '010101011101',
    '001010011101'
];
/**
 * @param {?} date1
 * @param {?} date2
 * @return {?}
 */
function getDaysDiff(date1, date2) {
    /** @type {?} */
    const diff = Math.abs(date1.getTime() - date2.getTime());
    return Math.round(diff / ONE_DAY);
}
class NgbCalendarIslamicUmalqura extends NgbCalendarIslamicCivil {
    /**
     * Returns the equivalent islamic(Umalqura) date value for a give input Gregorian date.
     * `gdate` is s JS Date to be converted to Hijri.
     * @param {?} gDate
     * @return {?}
     */
    fromGregorian(gDate) {
        /** @type {?} */
        let hDay = 1;
        /** @type {?} */
        let hMonth = 0;
        /** @type {?} */
        let hYear = 1300;
        /** @type {?} */
        let daysDiff = getDaysDiff(gDate, GREGORIAN_FIRST_DATE);
        if (gDate.getTime() - GREGORIAN_FIRST_DATE.getTime() >= 0 && gDate.getTime() - GREGORIAN_LAST_DATE.getTime() <= 0) {
            /** @type {?} */
            let year = 1300;
            for (let i = 0; i < MONTH_LENGTH.length; i++, year++) {
                for (let j = 0; j < 12; j++) {
                    /** @type {?} */
                    let numOfDays = +MONTH_LENGTH[i][j] + 29;
                    if (daysDiff <= numOfDays) {
                        hDay = daysDiff + 1;
                        if (hDay > numOfDays) {
                            hDay = 1;
                            j++;
                        }
                        if (j > 11) {
                            j = 0;
                            year++;
                        }
                        hMonth = j;
                        hYear = year;
                        return new NgbDate(hYear, hMonth + 1, hDay);
                    }
                    daysDiff = daysDiff - numOfDays;
                }
            }
        }
        else {
            return super.fromGregorian(gDate);
        }
    }
    /**
     * Converts the current Hijri date to Gregorian.
     * @param {?} hDate
     * @return {?}
     */
    toGregorian(hDate) {
        /** @type {?} */
        const hYear = hDate.year;
        /** @type {?} */
        const hMonth = hDate.month - 1;
        /** @type {?} */
        const hDay = hDate.day;
        /** @type {?} */
        let gDate = new Date(GREGORIAN_FIRST_DATE);
        /** @type {?} */
        let dayDiff = hDay - 1;
        if (hYear >= HIJRI_BEGIN && hYear <= HIJRI_END) {
            for (let y = 0; y < hYear - HIJRI_BEGIN; y++) {
                for (let m = 0; m < 12; m++) {
                    dayDiff += +MONTH_LENGTH[y][m] + 29;
                }
            }
            for (let m = 0; m < hMonth; m++) {
                dayDiff += +MONTH_LENGTH[hYear - HIJRI_BEGIN][m] + 29;
            }
            gDate.setDate(GREGORIAN_FIRST_DATE.getDate() + dayDiff);
        }
        else {
            gDate = super.toGregorian(hDate);
        }
        return gDate;
    }
    /**
     * Returns the number of days in a specific Hijri hMonth.
     * `hMonth` is 1 for Muharram, 2 for Safar, etc.
     * `hYear` is any Hijri hYear.
     * @param {?} hMonth
     * @param {?} hYear
     * @return {?}
     */
    getDaysPerMonth(hMonth, hYear) {
        if (hYear >= HIJRI_BEGIN && hYear <= HIJRI_END) {
            /** @type {?} */
            const pos = hYear - HIJRI_BEGIN;
            return +MONTH_LENGTH[pos][hMonth - 1] + 29;
        }
        return super.getDaysPerMonth(hMonth, hYear);
    }
}
NgbCalendarIslamicUmalqura.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDateNativeAdapter extends NgbDateAdapter {
    /**
     * @param {?} date
     * @return {?}
     */
    fromModel(date) {
        return (date && date.getFullYear) ? { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } :
            null;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    toModel(date) {
        return date && date.year && date.month ? new Date(date.year, date.month - 1, date.day, 12) : null;
    }
}
NgbDateNativeAdapter.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Returns the equivalent JS date value for a give input Jalali date.
 * `jalaliDate` is an Jalali date to be converted to Gregorian.
 * @param {?} jalaliDate
 * @return {?}
 */
function toGregorian(jalaliDate) {
    /** @type {?} */
    let jdn = jalaliToJulian(jalaliDate.year, jalaliDate.month, jalaliDate.day);
    /** @type {?} */
    let date = julianToGregorian(jdn);
    date.setHours(6, 30, 3, 200);
    return date;
}
/**
 * Returns the equivalent jalali date value for a give input Gregorian date.
 * `gdate` is a JS Date to be converted to jalali.
 * utc to local
 * @param {?} gdate
 * @return {?}
 */
function fromGregorian(gdate) {
    /** @type {?} */
    let g2d = gregorianToJulian(gdate.getFullYear(), gdate.getMonth() + 1, gdate.getDate());
    return julianToJalali(g2d);
}
/**
 * @param {?} date
 * @param {?} yearValue
 * @return {?}
 */
function setJalaliYear(date, yearValue) {
    date.year = +yearValue;
    return date;
}
/**
 * @param {?} date
 * @param {?} month
 * @return {?}
 */
function setJalaliMonth(date, month) {
    month = +month;
    date.year = date.year + Math.floor((month - 1) / 12);
    date.month = Math.floor(((month - 1) % 12 + 12) % 12) + 1;
    return date;
}
/**
 * @param {?} date
 * @param {?} day
 * @return {?}
 */
function setJalaliDay(date, day) {
    /** @type {?} */
    let mDays = getDaysPerMonth(date.month, date.year);
    if (day <= 0) {
        while (day <= 0) {
            date = setJalaliMonth(date, date.month - 1);
            mDays = getDaysPerMonth(date.month, date.year);
            day += mDays;
        }
    }
    else if (day > mDays) {
        while (day > mDays) {
            day -= mDays;
            date = setJalaliMonth(date, date.month + 1);
            mDays = getDaysPerMonth(date.month, date.year);
        }
    }
    date.day = day;
    return date;
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function mod$1(a, b) {
    return a - b * Math.floor(a / b);
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function div(a, b) {
    return Math.trunc(a / b);
}
/**
 * @param {?} jalaliYear
 * @return {?}
 */
function jalCal(jalaliYear) {
    /** @type {?} */
    let breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
    /** @type {?} */
    const breaksLength = breaks.length;
    /** @type {?} */
    const gYear = jalaliYear + 621;
    /** @type {?} */
    let leapJ = -14;
    /** @type {?} */
    let jp = breaks[0];
    if (jalaliYear < jp || jalaliYear >= breaks[breaksLength - 1]) {
        throw new Error('Invalid Jalali year ' + jalaliYear);
    }
    /** @type {?} */
    let jump;
    for (let i = 1; i < breaksLength; i += 1) {
        /** @type {?} */
        const jm = breaks[i];
        jump = jm - jp;
        if (jalaliYear < jm) {
            break;
        }
        leapJ = leapJ + div(jump, 33) * 8 + div(mod$1(jump, 33), 4);
        jp = jm;
    }
    /** @type {?} */
    let n = jalaliYear - jp;
    // Find the number of leap years from AD 621 to the beginning
    // of the current Jalali year in the Persian calendar.
    leapJ = leapJ + div(n, 33) * 8 + div(mod$1(n, 33) + 3, 4);
    if (mod$1(jump, 33) === 4 && jump - n === 4) {
        leapJ += 1;
    }
    /** @type {?} */
    const leapG = div(gYear, 4) - div((div(gYear, 100) + 1) * 3, 4) - 150;
    /** @type {?} */
    const march = 20 + leapJ - leapG;
    // Find how many years have passed since the last leap year.
    if (jump - n < 6) {
        n = n - jump + div(jump + 4, 33) * 33;
    }
    /** @type {?} */
    let leap = mod$1(mod$1(n + 1, 33) - 1, 4);
    if (leap === -1) {
        leap = 4;
    }
    return { leap: leap, gy: gYear, march: march };
}
/**
 * @param {?} julianDayNumber
 * @return {?}
 */
function julianToGregorian(julianDayNumber) {
    /** @type {?} */
    let j = 4 * julianDayNumber + 139361631;
    j = j + div(div(4 * julianDayNumber + 183187720, 146097) * 3, 4) * 4 - 3908;
    /** @type {?} */
    const i = div(mod$1(j, 1461), 4) * 5 + 308;
    /** @type {?} */
    const gDay = div(mod$1(i, 153), 5) + 1;
    /** @type {?} */
    const gMonth = mod$1(div(i, 153), 12) + 1;
    /** @type {?} */
    const gYear = div(j, 1461) - 100100 + div(8 - gMonth, 6);
    return new Date(gYear, gMonth - 1, gDay);
}
/**
 * @param {?} gy
 * @param {?} gm
 * @param {?} gd
 * @return {?}
 */
function gregorianToJulian(gy, gm, gd) {
    /** @type {?} */
    let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod$1(gm + 9, 12) + 2, 5) + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
}
/**
 * @param {?} julianDayNumber
 * @return {?}
 */
function julianToJalali(julianDayNumber) {
    /** @type {?} */
    let gy = julianToGregorian(julianDayNumber).getFullYear();
    /** @type {?} */
    let jalaliYear = gy - 621;
    /** @type {?} */
    let r = jalCal(jalaliYear);
    /** @type {?} */
    let gregorianDay = gregorianToJulian(gy, 3, r.march);
    /** @type {?} */
    let jalaliDay;
    /** @type {?} */
    let jalaliMonth;
    /** @type {?} */
    let numberOfDays;
    // Find number of days that passed since 1 Farvardin.
    numberOfDays = julianDayNumber - gregorianDay;
    if (numberOfDays >= 0) {
        if (numberOfDays <= 185) {
            // The first 6 months.
            jalaliMonth = 1 + div(numberOfDays, 31);
            jalaliDay = mod$1(numberOfDays, 31) + 1;
            return new NgbDate(jalaliYear, jalaliMonth, jalaliDay);
        }
        else {
            // The remaining months.
            numberOfDays -= 186;
        }
    }
    else {
        // Previous Jalali year.
        jalaliYear -= 1;
        numberOfDays += 179;
        if (r.leap === 1) {
            numberOfDays += 1;
        }
    }
    jalaliMonth = 7 + div(numberOfDays, 30);
    jalaliDay = mod$1(numberOfDays, 30) + 1;
    return new NgbDate(jalaliYear, jalaliMonth, jalaliDay);
}
/**
 * @param {?} jYear
 * @param {?} jMonth
 * @param {?} jDay
 * @return {?}
 */
function jalaliToJulian(jYear, jMonth, jDay) {
    /** @type {?} */
    let r = jalCal(jYear);
    return gregorianToJulian(r.gy, 3, r.march) + (jMonth - 1) * 31 - div(jMonth, 7) * (jMonth - 7) + jDay - 1;
}
/**
 * Returns the number of days in a specific jalali month.
 * @param {?} month
 * @param {?} year
 * @return {?}
 */
function getDaysPerMonth(month, year) {
    if (month <= 6) {
        return 31;
    }
    if (month <= 11) {
        return 30;
    }
    if (jalCal(year).leap === 0) {
        return 30;
    }
    return 29;
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbCalendarPersian extends NgbCalendar {
    /**
     * @return {?}
     */
    getDaysPerWeek() { return 7; }
    /**
     * @return {?}
     */
    getMonths() { return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; }
    /**
     * @return {?}
     */
    getWeeksPerMonth() { return 6; }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getNext(date, period = 'd', number = 1) {
        date = new NgbDate(date.year, date.month, date.day);
        switch (period) {
            case 'y':
                date = setJalaliYear(date, date.year + number);
                date.month = 1;
                date.day = 1;
                return date;
            case 'm':
                date = setJalaliMonth(date, date.month + number);
                date.day = 1;
                return date;
            case 'd':
                return setJalaliDay(date, date.day + number);
            default:
                return date;
        }
    }
    /**
     * @param {?} date
     * @param {?=} period
     * @param {?=} number
     * @return {?}
     */
    getPrev(date, period = 'd', number = 1) { return this.getNext(date, period, -number); }
    /**
     * @param {?} date
     * @return {?}
     */
    getWeekday(date) {
        /** @type {?} */
        const day = toGregorian(date).getDay();
        // in JS Date Sun=0, in ISO 8601 Sun=7
        return day === 0 ? 7 : day;
    }
    /**
     * @param {?} week
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    getWeekNumber(week, firstDayOfWeek) {
        // in JS Date Sun=0, in ISO 8601 Sun=7
        if (firstDayOfWeek === 7) {
            firstDayOfWeek = 0;
        }
        /** @type {?} */
        const thursdayIndex = (4 + 7 - firstDayOfWeek) % 7;
        /** @type {?} */
        const date = week[thursdayIndex];
        /** @type {?} */
        const jsDate = toGregorian(date);
        jsDate.setDate(jsDate.getDate() + 4 - (jsDate.getDay() || 7));
        /** @type {?} */
        const time = jsDate.getTime();
        /** @type {?} */
        const startDate = toGregorian(new NgbDate(date.year, 1, 1));
        return Math.floor(Math.round((time - startDate.getTime()) / 86400000) / 7) + 1;
    }
    /**
     * @return {?}
     */
    getToday() { return fromGregorian(new Date()); }
    /**
     * @param {?} date
     * @return {?}
     */
    isValid(date) {
        return date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day) &&
            !isNaN(toGregorian(date).getTime());
    }
}
NgbCalendarPersian.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbDatepickerModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbDatepickerModule }; }
}
NgbDatepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    NgbDatepicker, NgbDatepickerMonthView, NgbDatepickerNavigation, NgbDatepickerNavigationSelect, NgbDatepickerDayView,
                    NgbInputDatepicker
                ],
                exports: [NgbDatepicker, NgbInputDatepicker],
                imports: [CommonModule, FormsModule],
                providers: [
                    { provide: NgbCalendar, useClass: NgbCalendarGregorian },
                    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nDefault },
                    { provide: NgbDateParserFormatter, useClass: NgbDateISOParserFormatter },
                    { provide: NgbDateAdapter, useClass: NgbDateStructAdapter }
                ],
                entryComponents: [NgbDatepicker]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbDropdown directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the dropdowns used in the application.
 */
class NgbDropdownConfig {
    constructor() {
        this.autoClose = true;
        this.placement = 'bottom-left';
    }
}
NgbDropdownConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbDropdownConfig.ngInjectableDef = defineInjectable({ factory: function NgbDropdownConfig_Factory() { return new NgbDropdownConfig(); }, token: NgbDropdownConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 *
 */
class NgbDropdownMenu {
    /**
     * @param {?} dropdown
     * @param {?} _elementRef
     * @param {?} _renderer
     */
    constructor(dropdown, _elementRef, _renderer) {
        this.dropdown = dropdown;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this.placement = 'bottom';
        this.isOpen = false;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
    /**
     * @param {?} triggerEl
     * @param {?} placement
     * @return {?}
     */
    position(triggerEl, placement) {
        this.applyPlacement(positionElements(triggerEl, this._elementRef.nativeElement, placement));
    }
    /**
     * @param {?} _placement
     * @return {?}
     */
    applyPlacement(_placement) {
        // remove the current placement classes
        this._renderer.removeClass(this._elementRef.nativeElement.parentNode, 'dropup');
        this._renderer.removeClass(this._elementRef.nativeElement.parentNode, 'dropdown');
        this.placement = _placement;
        /**
             * apply the new placement
             * in case of top use up-arrow or down-arrow otherwise
             */
        if (_placement.search('^top') !== -1) {
            this._renderer.addClass(this._elementRef.nativeElement.parentNode, 'dropup');
        }
        else {
            this._renderer.addClass(this._elementRef.nativeElement.parentNode, 'dropdown');
        }
    }
}
NgbDropdownMenu.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownMenu]',
                host: { '[class.dropdown-menu]': 'true', '[class.show]': 'dropdown.isOpen()', '[attr.x-placement]': 'placement' }
            },] },
];
/** @nocollapse */
NgbDropdownMenu.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef },
    { type: Renderer2 }
];
/**
 * Marks an element to which dropdown menu will be anchored. This is a simple version
 * of the NgbDropdownToggle directive. It plays the same role as NgbDropdownToggle but
 * doesn't listen to click events to toggle dropdown menu thus enabling support for
 * events other than click.
 *
 * \@since 1.1.0
 */
class NgbDropdownAnchor {
    /**
     * @param {?} dropdown
     * @param {?} _elementRef
     */
    constructor(dropdown, _elementRef) {
        this.dropdown = dropdown;
        this._elementRef = _elementRef;
        this.anchorEl = _elementRef.nativeElement;
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    isEventFrom($event) { return this._elementRef.nativeElement.contains($event.target); }
}
NgbDropdownAnchor.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownAnchor]',
                host: { 'class': 'dropdown-toggle', 'aria-haspopup': 'true', '[attr.aria-expanded]': 'dropdown.isOpen()' }
            },] },
];
/** @nocollapse */
NgbDropdownAnchor.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef }
];
/**
 * Allows the dropdown to be toggled via click. This directive is optional: you can use NgbDropdownAnchor as an
 * alternative.
 */
class NgbDropdownToggle extends NgbDropdownAnchor {
    /**
     * @param {?} dropdown
     * @param {?} elementRef
     */
    constructor(dropdown, elementRef) {
        super(dropdown, elementRef);
    }
    /**
     * @return {?}
     */
    toggleOpen() { this.dropdown.toggle(); }
}
NgbDropdownToggle.decorators = [
    { type: Directive, args: [{
                selector: '[ngbDropdownToggle]',
                host: {
                    'class': 'dropdown-toggle',
                    'aria-haspopup': 'true',
                    '[attr.aria-expanded]': 'dropdown.isOpen()',
                    '(click)': 'toggleOpen()'
                },
                providers: [{ provide: NgbDropdownAnchor, useExisting: forwardRef(() => NgbDropdownToggle) }]
            },] },
];
/** @nocollapse */
NgbDropdownToggle.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [forwardRef(() => NgbDropdown),] }] },
    { type: ElementRef }
];
/**
 * Transforms a node into a dropdown.
 */
class NgbDropdown {
    /**
     * @param {?} _changeDetector
     * @param {?} config
     * @param {?} _document
     * @param {?} _ngZone
     */
    constructor(_changeDetector, config, _document, _ngZone) {
        this._changeDetector = _changeDetector;
        this._document = _document;
        this._ngZone = _ngZone;
        this._closed$ = new Subject();
        /**
         *  Defines whether or not the dropdown-menu is open initially.
         */
        this._open = false;
        /**
         *  An event fired when the dropdown is opened or closed.
         *  Event's payload equals whether dropdown is open.
         */
        this.openChange = new EventEmitter();
        this.placement = config.placement;
        this.autoClose = config.autoClose;
        this._zoneSubscription = _ngZone.onStable.subscribe(() => { this._positionMenu(); });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this._menu) {
            this._menu.applyPlacement(Array.isArray(this.placement) ? (this.placement[0]) : /** @type {?} */ (this.placement));
        }
        if (this._open) {
            this._setCloseHandlers();
        }
    }
    /**
     * Checks if the dropdown menu is open or not.
     * @return {?}
     */
    isOpen() { return this._open; }
    /**
     * Opens the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    open() {
        if (!this._open) {
            this._open = true;
            this._positionMenu();
            this.openChange.emit(true);
            this._setCloseHandlers();
        }
    }
    /**
     * @return {?}
     */
    _setCloseHandlers() {
        if (this.autoClose) {
            this._ngZone.runOutsideAngular(() => {
                /** @type {?} */
                const escapes$ = fromEvent(this._document, 'keyup')
                    .pipe(takeUntil(this._closed$), filter(event => event.which === Key.Escape));
                /** @type {?} */
                const clicks$ = fromEvent(this._document, 'click')
                    .pipe(takeUntil(this._closed$), filter(event => this._shouldCloseFromClick(event)));
                race([escapes$, clicks$]).pipe(takeUntil(this._closed$)).subscribe(() => this._ngZone.run(() => {
                    this.close();
                    this._changeDetector.markForCheck();
                }));
            });
        }
    }
    /**
     * Closes the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    close() {
        if (this._open) {
            this._open = false;
            this._closed$.next();
            this.openChange.emit(false);
        }
    }
    /**
     * Toggles the dropdown menu of a given navbar or tabbed navigation.
     * @return {?}
     */
    toggle() {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseFromClick(event) {
        if (event.button !== 2 && !this._isEventFromToggle(event)) {
            if (this.autoClose === true) {
                return true;
            }
            else if (this.autoClose === 'inside' && this._isEventFromMenu(event)) {
                return true;
            }
            else if (this.autoClose === 'outside' && !this._isEventFromMenu(event)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._closed$.next();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    _isEventFromToggle($event) { return this._anchor.isEventFrom($event); }
    /**
     * @param {?} $event
     * @return {?}
     */
    _isEventFromMenu($event) { return this._menu ? this._menu.isEventFrom($event) : false; }
    /**
     * @return {?}
     */
    _positionMenu() {
        if (this.isOpen() && this._menu) {
            this._menu.position(this._anchor.anchorEl, this.placement);
        }
    }
}
NgbDropdown.decorators = [
    { type: Directive, args: [{ selector: '[ngbDropdown]', exportAs: 'ngbDropdown', host: { '[class.show]': 'isOpen()' } },] },
];
/** @nocollapse */
NgbDropdown.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NgbDropdownConfig },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone }
];
NgbDropdown.propDecorators = {
    _menu: [{ type: ContentChild, args: [NgbDropdownMenu,] }],
    _anchor: [{ type: ContentChild, args: [NgbDropdownAnchor,] }],
    autoClose: [{ type: Input }],
    _open: [{ type: Input, args: ['open',] }],
    placement: [{ type: Input }],
    openChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_DROPDOWN_DIRECTIVES = [NgbDropdown, NgbDropdownAnchor, NgbDropdownToggle, NgbDropdownMenu];
class NgbDropdownModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbDropdownModule }; }
}
NgbDropdownModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_DROPDOWN_DIRECTIVES, exports: NGB_DROPDOWN_DIRECTIVES },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalBackdrop {
}
NgbModalBackdrop.decorators = [
    { type: Component, args: [{
                selector: 'ngb-modal-backdrop',
                template: '',
                host: { '[class]': '"modal-backdrop fade show" + (backdropClass ? " " + backdropClass : "")' }
            },] },
];
NgbModalBackdrop.propDecorators = {
    backdropClass: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const ModalDismissReasons = {
    BACKDROP_CLICK: 0,
    ESC: 1,
};
ModalDismissReasons[ModalDismissReasons.BACKDROP_CLICK] = 'BACKDROP_CLICK';
ModalDismissReasons[ModalDismissReasons.ESC] = 'ESC';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalWindow {
    /**
     * @param {?} document
     * @param {?} _elRef
     * @param {?} _renderer
     */
    constructor(document, _elRef, _renderer) {
        this._elRef = _elRef;
        this._renderer = _renderer;
        this.backdrop = true;
        this.keyboard = true;
        this.dismissEvent = new EventEmitter();
        this._document = document;
        ngbFocusTrap(this._elRef.nativeElement, this.dismissEvent);
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    backdropClick($event) {
        if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
            this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
        }
    }
    /**
     * @param {?} $event
     * @return {?}
     */
    escKey($event) {
        if (this.keyboard && !$event.defaultPrevented) {
            this.dismiss(ModalDismissReasons.ESC);
        }
    }
    /**
     * @param {?} reason
     * @return {?}
     */
    dismiss(reason) { this.dismissEvent.emit(reason); }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._elWithFocus = this._document.activeElement;
        this._renderer.addClass(this._document.body, 'modal-open');
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (!this._elRef.nativeElement.contains(document.activeElement)) {
            this._elRef.nativeElement['focus'].apply(this._elRef.nativeElement, []);
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const body = this._document.body;
        /** @type {?} */
        const elWithFocus = this._elWithFocus;
        /** @type {?} */
        let elementToFocus;
        if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
            elementToFocus = elWithFocus;
        }
        else {
            elementToFocus = body;
        }
        elementToFocus['focus'].apply(elementToFocus, []);
        this._elWithFocus = null;
        this._renderer.removeClass(body, 'modal-open');
    }
}
NgbModalWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-modal-window',
                host: {
                    '[class]': '"modal fade show d-block" + (windowClass ? " " + windowClass : "")',
                    'role': 'dialog',
                    'tabindex': '-1',
                    '(keyup.esc)': 'escKey($event)',
                    '(click)': 'backdropClick($event)',
                    '[attr.aria-labelledby]': 'ariaLabelledBy',
                },
                template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `
            },] },
];
/** @nocollapse */
NgbModalWindow.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ElementRef },
    { type: Renderer2 }
];
NgbModalWindow.propDecorators = {
    ariaLabelledBy: [{ type: Input }],
    backdrop: [{ type: Input }],
    centered: [{ type: Input }],
    keyboard: [{ type: Input }],
    size: [{ type: Input }],
    windowClass: [{ type: Input }],
    dismissEvent: [{ type: Output, args: ['dismiss',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class ContentRef {
    /**
     * @param {?} nodes
     * @param {?=} viewRef
     * @param {?=} componentRef
     */
    constructor(nodes, viewRef, componentRef) {
        this.nodes = nodes;
        this.viewRef = viewRef;
        this.componentRef = componentRef;
    }
}
/**
 * @template T
 */
class PopupService {
    /**
     * @param {?} _type
     * @param {?} _injector
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} _componentFactoryResolver
     */
    constructor(_type, _injector, _viewContainerRef, _renderer, _componentFactoryResolver) {
        this._type = _type;
        this._injector = _injector;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._componentFactoryResolver = _componentFactoryResolver;
    }
    /**
     * @param {?=} content
     * @param {?=} context
     * @return {?}
     */
    open(content, context) {
        if (!this._windowRef) {
            this._contentRef = this._getContentRef(content, context);
            this._windowRef = this._viewContainerRef.createComponent(this._componentFactoryResolver.resolveComponentFactory(this._type), 0, this._injector, this._contentRef.nodes);
        }
        return this._windowRef;
    }
    /**
     * @return {?}
     */
    close() {
        if (this._windowRef) {
            this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._windowRef.hostView));
            this._windowRef = null;
            if (this._contentRef.viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef));
                this._contentRef = null;
            }
        }
    }
    /**
     * @param {?} content
     * @param {?=} context
     * @return {?}
     */
    _getContentRef(content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            /** @type {?} */
            const viewRef = this._viewContainerRef.createEmbeddedView(/** @type {?} */ (content), context);
            return new ContentRef([viewRef.rootNodes], viewRef);
        }
        else {
            return new ContentRef([[this._renderer.createText(`${content}`)]]);
        }
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const noop = () => { };
/**
 * Utility to handle the scrollbar.
 *
 * It allows to compensate the lack of a vertical scrollbar by adding an
 * equivalent padding on the right of the body, and to remove this compensation.
 */
class ScrollBar {
    /**
     * @param {?} _document
     */
    constructor(_document) {
        this._document = _document;
    }
    /**
     * Detects if a scrollbar is present and if yes, already compensates for its
     * removal by adding an equivalent padding on the right of the body.
     *
     * @return {?} a callback used to revert the compensation (noop if there was none,
     * otherwise a function removing the padding)
     */
    compensate() { return !this._isPresent() ? noop : this._adjustBody(this._getWidth()); }
    /**
     * Adds a padding of the given width on the right of the body.
     *
     * @param {?} width
     * @return {?} a callback used to revert the padding to its previous value
     */
    _adjustBody(width) {
        /** @type {?} */
        const body = this._document.body;
        /** @type {?} */
        const userSetPadding = body.style.paddingRight;
        /** @type {?} */
        const paddingAmount = parseFloat(window.getComputedStyle(body)['padding-right']);
        body.style['padding-right'] = `${paddingAmount + width}px`;
        return () => body.style['padding-right'] = userSetPadding;
    }
    /**
     * Tells whether a scrollbar is currently present on the body.
     *
     * @return {?} true if scrollbar is present, false otherwise
     */
    _isPresent() {
        /** @type {?} */
        const rect = this._document.body.getBoundingClientRect();
        return rect.left + rect.right < window.innerWidth;
    }
    /**
     * Calculates and returns the width of a scrollbar.
     *
     * @return {?} the width of a scrollbar on this page
     */
    _getWidth() {
        /** @type {?} */
        const measurer = this._document.createElement('div');
        measurer.className = 'modal-scrollbar-measure';
        /** @type {?} */
        const body = this._document.body;
        body.appendChild(measurer);
        /** @type {?} */
        const width = measurer.getBoundingClientRect().width - measurer.clientWidth;
        body.removeChild(measurer);
        return width;
    }
}
ScrollBar.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
ScrollBar.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
/** @nocollapse */ ScrollBar.ngInjectableDef = defineInjectable({ factory: function ScrollBar_Factory() { return new ScrollBar(inject(DOCUMENT)); }, token: ScrollBar, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A reference to an active (currently opened) modal. Instances of this class
 * can be injected into components passed as modal content.
 */
class NgbActiveModal {
    /**
     * Can be used to close a modal, passing an optional result.
     * @param {?=} result
     * @return {?}
     */
    close(result) { }
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     * @param {?=} reason
     * @return {?}
     */
    dismiss(reason) { }
}
/**
 * A reference to a newly opened modal.
 */
class NgbModalRef {
    /**
     * @param {?} _windowCmptRef
     * @param {?} _contentRef
     * @param {?=} _backdropCmptRef
     * @param {?=} _beforeDismiss
     */
    constructor(_windowCmptRef, _contentRef, _backdropCmptRef, _beforeDismiss) {
        this._windowCmptRef = _windowCmptRef;
        this._contentRef = _contentRef;
        this._backdropCmptRef = _backdropCmptRef;
        this._beforeDismiss = _beforeDismiss;
        _windowCmptRef.instance.dismissEvent.subscribe((reason) => { this.dismiss(reason); });
        this.result = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        this.result.then(null, () => { });
    }
    /**
     * The instance of component used as modal's content.
     * Undefined when a TemplateRef is used as modal's content.
     * @return {?}
     */
    get componentInstance() {
        if (this._contentRef.componentRef) {
            return this._contentRef.componentRef.instance;
        }
    }
    /**
     * @param {?} instance
     * @return {?}
     */
    set componentInstance(instance) { }
    /**
     * Can be used to close a modal, passing an optional result.
     * @param {?=} result
     * @return {?}
     */
    close(result) {
        if (this._windowCmptRef) {
            this._resolve(result);
            this._removeModalElements();
        }
    }
    /**
     * @param {?=} reason
     * @return {?}
     */
    _dismiss(reason) {
        this._reject(reason);
        this._removeModalElements();
    }
    /**
     * Can be used to dismiss a modal, passing an optional reason.
     * @param {?=} reason
     * @return {?}
     */
    dismiss(reason) {
        if (this._windowCmptRef) {
            if (!this._beforeDismiss) {
                this._dismiss(reason);
            }
            else {
                /** @type {?} */
                const dismiss = this._beforeDismiss();
                if (dismiss && dismiss.then) {
                    dismiss.then(result => {
                        if (result !== false) {
                            this._dismiss(reason);
                        }
                    }, () => { });
                }
                else if (dismiss !== false) {
                    this._dismiss(reason);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    _removeModalElements() {
        /** @type {?} */
        const windowNativeEl = this._windowCmptRef.location.nativeElement;
        windowNativeEl.parentNode.removeChild(windowNativeEl);
        this._windowCmptRef.destroy();
        if (this._backdropCmptRef) {
            /** @type {?} */
            const backdropNativeEl = this._backdropCmptRef.location.nativeElement;
            backdropNativeEl.parentNode.removeChild(backdropNativeEl);
            this._backdropCmptRef.destroy();
        }
        if (this._contentRef && this._contentRef.viewRef) {
            this._contentRef.viewRef.destroy();
        }
        this._windowCmptRef = null;
        this._backdropCmptRef = null;
        this._contentRef = null;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalStack {
    /**
     * @param {?} _applicationRef
     * @param {?} _injector
     * @param {?} _document
     * @param {?} _scrollBar
     */
    constructor(_applicationRef, _injector, _document, _scrollBar) {
        this._applicationRef = _applicationRef;
        this._injector = _injector;
        this._document = _document;
        this._scrollBar = _scrollBar;
        this._windowAttributes = ['ariaLabelledBy', 'backdrop', 'centered', 'keyboard', 'size', 'windowClass'];
        this._backdropAttributes = ['backdropClass'];
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} options
     * @return {?}
     */
    open(moduleCFR, contentInjector, content, options) {
        /** @type {?} */
        const containerEl = isDefined(options.container) ? this._document.querySelector(options.container) : this._document.body;
        /** @type {?} */
        const revertPaddingForScrollBar = this._scrollBar.compensate();
        if (!containerEl) {
            throw new Error(`The specified modal container "${options.container || 'body'}" was not found in the DOM.`);
        }
        /** @type {?} */
        const activeModal = new NgbActiveModal();
        /** @type {?} */
        const contentRef = this._getContentRef(moduleCFR, options.injector || contentInjector, content, activeModal);
        /** @type {?} */
        let backdropCmptRef = options.backdrop !== false ? this._attachBackdrop(moduleCFR, containerEl) : null;
        /** @type {?} */
        let windowCmptRef = this._attachWindowComponent(moduleCFR, containerEl, contentRef);
        /** @type {?} */
        let ngbModalRef = new NgbModalRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss);
        ngbModalRef.result.then(revertPaddingForScrollBar, revertPaddingForScrollBar);
        activeModal.close = (result) => { ngbModalRef.close(result); };
        activeModal.dismiss = (reason) => { ngbModalRef.dismiss(reason); };
        this._applyWindowOptions(windowCmptRef.instance, options);
        if (backdropCmptRef && backdropCmptRef.instance) {
            this._applyBackdropOptions(backdropCmptRef.instance, options);
        }
        return ngbModalRef;
    }
    /**
     * @param {?} moduleCFR
     * @param {?} containerEl
     * @return {?}
     */
    _attachBackdrop(moduleCFR, containerEl) {
        /** @type {?} */
        let backdropFactory = moduleCFR.resolveComponentFactory(NgbModalBackdrop);
        /** @type {?} */
        let backdropCmptRef = backdropFactory.create(this._injector);
        this._applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }
    /**
     * @param {?} moduleCFR
     * @param {?} containerEl
     * @param {?} contentRef
     * @return {?}
     */
    _attachWindowComponent(moduleCFR, containerEl, contentRef) {
        /** @type {?} */
        let windowFactory = moduleCFR.resolveComponentFactory(NgbModalWindow);
        /** @type {?} */
        let windowCmptRef = windowFactory.create(this._injector, contentRef.nodes);
        this._applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }
    /**
     * @param {?} windowInstance
     * @param {?} options
     * @return {?}
     */
    _applyWindowOptions(windowInstance, options) {
        this._windowAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * @param {?} backdropInstance
     * @param {?} options
     * @return {?}
     */
    _applyBackdropOptions(backdropInstance, options) {
        this._backdropAttributes.forEach((optionName) => {
            if (isDefined(options[optionName])) {
                backdropInstance[optionName] = options[optionName];
            }
        });
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} context
     * @return {?}
     */
    _getContentRef(moduleCFR, contentInjector, content, context) {
        if (!content) {
            return new ContentRef([]);
        }
        else if (content instanceof TemplateRef) {
            return this._createFromTemplateRef(content, context);
        }
        else if (isString(content)) {
            return this._createFromString(content);
        }
        else {
            return this._createFromComponent(moduleCFR, contentInjector, content, context);
        }
    }
    /**
     * @param {?} content
     * @param {?} context
     * @return {?}
     */
    _createFromTemplateRef(content, context) {
        /** @type {?} */
        const viewRef = content.createEmbeddedView(context);
        this._applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }
    /**
     * @param {?} content
     * @return {?}
     */
    _createFromString(content) {
        /** @type {?} */
        const component = this._document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }
    /**
     * @param {?} moduleCFR
     * @param {?} contentInjector
     * @param {?} content
     * @param {?} context
     * @return {?}
     */
    _createFromComponent(moduleCFR, contentInjector, content, context) {
        /** @type {?} */
        const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        /** @type {?} */
        const modalContentInjector = Injector.create({ providers: [{ provide: NgbActiveModal, useValue: context }], parent: contentInjector });
        /** @type {?} */
        const componentRef = contentCmptFactory.create(modalContentInjector);
        this._applicationRef.attachView(componentRef.hostView);
        return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
}
NgbModalStack.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
NgbModalStack.ctorParameters = () => [
    { type: ApplicationRef },
    { type: Injector },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: ScrollBar }
];
/** @nocollapse */ NgbModalStack.ngInjectableDef = defineInjectable({ factory: function NgbModalStack_Factory() { return new NgbModalStack(inject(ApplicationRef), inject(INJECTOR), inject(DOCUMENT), inject(ScrollBar)); }, token: NgbModalStack, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A service to open modal windows. Creating a modal is straightforward: create a template and pass it as an argument to
 * the "open" method!
 */
class NgbModal {
    /**
     * @param {?} _moduleCFR
     * @param {?} _injector
     * @param {?} _modalStack
     */
    constructor(_moduleCFR, _injector, _modalStack) {
        this._moduleCFR = _moduleCFR;
        this._injector = _injector;
        this._modalStack = _modalStack;
    }
    /**
     * Opens a new modal window with the specified content and using supplied options. Content can be provided
     * as a TemplateRef or a component type. If you pass a component type as content than instances of those
     * components can be injected with an instance of the NgbActiveModal class. You can use methods on the
     * NgbActiveModal class to close / dismiss modals from "inside" of a component.
     * @param {?} content
     * @param {?=} options
     * @return {?}
     */
    open(content, options = {}) {
        return this._modalStack.open(this._moduleCFR, this._injector, content, options);
    }
}
NgbModal.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
NgbModal.ctorParameters = () => [
    { type: ComponentFactoryResolver },
    { type: Injector },
    { type: NgbModalStack }
];
/** @nocollapse */ NgbModal.ngInjectableDef = defineInjectable({ factory: function NgbModal_Factory() { return new NgbModal(inject(ComponentFactoryResolver), inject(INJECTOR), inject(NgbModalStack)); }, token: NgbModal, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbModalModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbModalModule }; }
}
NgbModalModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbModalBackdrop, NgbModalWindow],
                entryComponents: [NgbModalBackdrop, NgbModalWindow],
                providers: [NgbModal]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
class NgbPaginationConfig {
    constructor() {
        this.disabled = false;
        this.boundaryLinks = false;
        this.directionLinks = true;
        this.ellipses = true;
        this.maxSize = 0;
        this.pageSize = 10;
        this.rotate = false;
    }
}
NgbPaginationConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbPaginationConfig.ngInjectableDef = defineInjectable({ factory: function NgbPaginationConfig_Factory() { return new NgbPaginationConfig(); }, token: NgbPaginationConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A directive that will take care of visualising a pagination bar and enable / disable buttons correctly!
 */
class NgbPagination {
    /**
     * @param {?} config
     */
    constructor(config) {
        this.pageCount = 0;
        this.pages = [];
        /**
         *  Current page. Page numbers start with 1
         */
        this.page = 1;
        /**
         *  An event fired when the page is changed.
         *  Event's payload equals to the newly selected page.
         *  Will fire only if collection size is set and all values are valid.
         *  Page numbers start with 1
         */
        this.pageChange = new EventEmitter(true);
        this.disabled = config.disabled;
        this.boundaryLinks = config.boundaryLinks;
        this.directionLinks = config.directionLinks;
        this.ellipses = config.ellipses;
        this.maxSize = config.maxSize;
        this.pageSize = config.pageSize;
        this.rotate = config.rotate;
        this.size = config.size;
    }
    /**
     * @return {?}
     */
    hasPrevious() { return this.page > 1; }
    /**
     * @return {?}
     */
    hasNext() { return this.page < this.pageCount; }
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    selectPage(pageNumber) { this._updatePages(pageNumber); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) { this._updatePages(this.page); }
    /**
     * @param {?} pageNumber
     * @return {?}
     */
    isEllipsis(pageNumber) { return pageNumber === -1; }
    /**
     * Appends ellipses and first/last page number to the displayed pages
     * @param {?} start
     * @param {?} end
     * @return {?}
     */
    _applyEllipses(start, end) {
        if (this.ellipses) {
            if (start > 0) {
                if (start > 1) {
                    this.pages.unshift(-1);
                }
                this.pages.unshift(1);
            }
            if (end < this.pageCount) {
                if (end < (this.pageCount - 1)) {
                    this.pages.push(-1);
                }
                this.pages.push(this.pageCount);
            }
        }
    }
    /**
     * Rotates page numbers based on maxSize items visible.
     * Currently selected page stays in the middle:
     *
     * Ex. for selected page = 6:
     * [5,*6*,7] for maxSize = 3
     * [4,5,*6*,7] for maxSize = 4
     * @return {?}
     */
    _applyRotation() {
        /** @type {?} */
        let start = 0;
        /** @type {?} */
        let end = this.pageCount;
        /** @type {?} */
        let leftOffset = Math.floor(this.maxSize / 2);
        /** @type {?} */
        let rightOffset = this.maxSize % 2 === 0 ? leftOffset - 1 : leftOffset;
        if (this.page <= leftOffset) {
            // very beginning, no rotation -> [0..maxSize]
            end = this.maxSize;
        }
        else if (this.pageCount - this.page < leftOffset) {
            // very end, no rotation -> [len-maxSize..len]
            start = this.pageCount - this.maxSize;
        }
        else {
            // rotate
            start = this.page - leftOffset - 1;
            end = this.page + rightOffset;
        }
        return [start, end];
    }
    /**
     * Paginates page numbers based on maxSize items per page
     * @return {?}
     */
    _applyPagination() {
        /** @type {?} */
        let page = Math.ceil(this.page / this.maxSize) - 1;
        /** @type {?} */
        let start = page * this.maxSize;
        /** @type {?} */
        let end = start + this.maxSize;
        return [start, end];
    }
    /**
     * @param {?} newPageNo
     * @return {?}
     */
    _setPageInRange(newPageNo) {
        /** @type {?} */
        const prevPageNo = this.page;
        this.page = getValueInRange(newPageNo, this.pageCount, 1);
        if (this.page !== prevPageNo && isNumber(this.collectionSize)) {
            this.pageChange.emit(this.page);
        }
    }
    /**
     * @param {?} newPage
     * @return {?}
     */
    _updatePages(newPage) {
        this.pageCount = Math.ceil(this.collectionSize / this.pageSize);
        if (!isNumber(this.pageCount)) {
            this.pageCount = 0;
        }
        // fill-in model needed to render pages
        this.pages.length = 0;
        for (let i = 1; i <= this.pageCount; i++) {
            this.pages.push(i);
        }
        // set page within 1..max range
        this._setPageInRange(newPage);
        // apply maxSize if necessary
        if (this.maxSize > 0 && this.pageCount > this.maxSize) {
            /** @type {?} */
            let start = 0;
            /** @type {?} */
            let end = this.pageCount;
            // either paginating or rotating page numbers
            if (this.rotate) {
                [start, end] = this._applyRotation();
            }
            else {
                [start, end] = this._applyPagination();
            }
            this.pages = this.pages.slice(start, end);
            // adding ellipses
            this._applyEllipses(start, end);
        }
    }
}
NgbPagination.decorators = [
    { type: Component, args: [{
                selector: 'ngb-pagination',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: { 'role': 'navigation' },
                template: `
    <ul [class]="'pagination' + (size ? ' pagination-' + size : '')">
      <li *ngIf="boundaryLinks" class="page-item"
        [class.disabled]="!hasPrevious() || disabled">
        <a aria-label="First" i18n-aria-label="@@ngb.pagination.first-aria" class="page-link" href
          (click)="!!selectPage(1)" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.first">&laquo;&laquo;</span>
        </a>
      </li>

      <li *ngIf="directionLinks" class="page-item"
        [class.disabled]="!hasPrevious() || disabled">
        <a aria-label="Previous" i18n-aria-label="@@ngb.pagination.previous-aria" class="page-link" href
          (click)="!!selectPage(page-1)" [attr.tabindex]="(hasPrevious() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.previous">&laquo;</span>
        </a>
      </li>
      <li *ngFor="let pageNumber of pages" class="page-item" [class.active]="pageNumber === page"
        [class.disabled]="isEllipsis(pageNumber) || disabled">
        <a *ngIf="isEllipsis(pageNumber)" class="page-link">...</a>
        <a *ngIf="!isEllipsis(pageNumber)" class="page-link" href (click)="!!selectPage(pageNumber)">
          {{pageNumber}}
          <span *ngIf="pageNumber === page" class="sr-only">(current)</span>
        </a>
      </li>
      <li *ngIf="directionLinks" class="page-item" [class.disabled]="!hasNext() || disabled">
        <a aria-label="Next" i18n-aria-label="@@ngb.pagination.next-aria" class="page-link" href
          (click)="!!selectPage(page+1)" [attr.tabindex]="(hasNext() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.next">&raquo;</span>
        </a>
      </li>

      <li *ngIf="boundaryLinks" class="page-item" [class.disabled]="!hasNext() || disabled">
        <a aria-label="Last" i18n-aria-label="@@ngb.pagination.last-aria" class="page-link" href
          (click)="!!selectPage(pageCount)" [attr.tabindex]="(hasNext() ? null : '-1')">
          <span aria-hidden="true" i18n="@@ngb.pagination.last">&raquo;&raquo;</span>
        </a>
      </li>
    </ul>
  `
            },] },
];
/** @nocollapse */
NgbPagination.ctorParameters = () => [
    { type: NgbPaginationConfig }
];
NgbPagination.propDecorators = {
    disabled: [{ type: Input }],
    boundaryLinks: [{ type: Input }],
    directionLinks: [{ type: Input }],
    ellipses: [{ type: Input }],
    rotate: [{ type: Input }],
    collectionSize: [{ type: Input }],
    maxSize: [{ type: Input }],
    page: [{ type: Input }],
    pageSize: [{ type: Input }],
    pageChange: [{ type: Output }],
    size: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbPaginationModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbPaginationModule }; }
}
NgbPaginationModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbPagination], exports: [NgbPagination], imports: [CommonModule] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class Trigger {
    /**
     * @param {?} open
     * @param {?=} close
     */
    constructor(open, close) {
        this.open = open;
        this.close = close;
        if (!close) {
            this.close = open;
        }
    }
    /**
     * @return {?}
     */
    isManual() { return this.open === 'manual' || this.close === 'manual'; }
}
/** @type {?} */
const DEFAULT_ALIASES = {
    'hover': ['mouseenter', 'mouseleave']
};
/**
 * @param {?} triggers
 * @param {?=} aliases
 * @return {?}
 */
function parseTriggers(triggers, aliases = DEFAULT_ALIASES) {
    /** @type {?} */
    const trimmedTriggers = (triggers || '').trim();
    if (trimmedTriggers.length === 0) {
        return [];
    }
    /** @type {?} */
    const parsedTriggers = trimmedTriggers.split(/\s+/).map(trigger => trigger.split(':')).map((triggerPair) => {
        /** @type {?} */
        let alias = aliases[triggerPair[0]] || triggerPair;
        return new Trigger(alias[0], alias[1]);
    });
    /** @type {?} */
    const manualTriggers = parsedTriggers.filter(triggerPair => triggerPair.isManual());
    if (manualTriggers.length > 1) {
        throw 'Triggers parse error: only one manual trigger is allowed';
    }
    if (manualTriggers.length === 1 && parsedTriggers.length > 1) {
        throw 'Triggers parse error: manual trigger can\'t be mixed with other triggers';
    }
    return parsedTriggers;
}
/** @type {?} */
const noopFn = () => { };
/**
 * @param {?} renderer
 * @param {?} nativeElement
 * @param {?} triggers
 * @param {?} openFn
 * @param {?} closeFn
 * @param {?} toggleFn
 * @return {?}
 */
function listenToTriggers(renderer, nativeElement, triggers, openFn, closeFn, toggleFn) {
    /** @type {?} */
    const parsedTriggers = parseTriggers(triggers);
    /** @type {?} */
    const listeners = [];
    if (parsedTriggers.length === 1 && parsedTriggers[0].isManual()) {
        return noopFn;
    }
    parsedTriggers.forEach((trigger) => {
        if (trigger.open === trigger.close) {
            listeners.push(renderer.listen(nativeElement, trigger.open, toggleFn));
        }
        else {
            listeners.push(renderer.listen(nativeElement, trigger.open, openFn), renderer.listen(nativeElement, trigger.close, closeFn));
        }
    });
    return () => { listeners.forEach(unsubscribeFn => unsubscribeFn()); };
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbPopover directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the popovers used in the application.
 */
class NgbPopoverConfig {
    constructor() {
        this.autoClose = true;
        this.placement = 'top';
        this.triggers = 'click';
        this.disablePopover = false;
    }
}
NgbPopoverConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbPopoverConfig.ngInjectableDef = defineInjectable({ factory: function NgbPopoverConfig_Factory() { return new NgbPopoverConfig(); }, token: NgbPopoverConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$3 = 0;
class NgbPopoverWindow {
    /**
     * @param {?} _element
     * @param {?} _renderer
     */
    constructor(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this.placement = 'top';
    }
    /**
     * @param {?} _placement
     * @return {?}
     */
    applyPlacement(_placement) {
        // remove the current placement classes
        this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
        this._renderer.removeClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());
        // set the new placement classes
        this.placement = _placement;
        // apply the new placement
        this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString().split('-')[0]);
        this._renderer.addClass(this._element.nativeElement, 'bs-popover-' + this.placement.toString());
    }
    /**
     * Tells whether the event has been triggered from this component's subtree or not.
     *
     * @param {?} event the event to check
     *
     * @return {?} whether the event has been triggered from this component's subtree or not.
     */
    isEventFrom(event) { return this._element.nativeElement.contains(/** @type {?} */ (event.target)); }
}
NgbPopoverWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-popover-window',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class]': '"popover bs-popover-" + placement.split("-")[0]+" bs-popover-" + placement + (popoverClass ? " " + popoverClass : "")',
                    'role': 'tooltip',
                    '[id]': 'id'
                },
                template: `
    <div class="arrow"></div>
    <h3 class="popover-header">{{title}}</h3><div class="popover-body"><ng-content></ng-content></div>`,
                styles: [`
    :host.bs-popover-top .arrow, :host.bs-popover-bottom .arrow {
      left: 50%;
      margin-left: -5px;
    }

    :host.bs-popover-top-left .arrow, :host.bs-popover-bottom-left .arrow {
      left: 2em;
    }

    :host.bs-popover-top-right .arrow, :host.bs-popover-bottom-right .arrow {
      left: auto;
      right: 2em;
    }

    :host.bs-popover-left .arrow, :host.bs-popover-right .arrow {
      top: 50%;
      margin-top: -5px;
    }

    :host.bs-popover-left-top .arrow, :host.bs-popover-right-top .arrow {
      top: 0.7em;
    }

    :host.bs-popover-left-bottom .arrow, :host.bs-popover-right-bottom .arrow {
      top: auto;
      bottom: 0.7em;
    }
  `]
            },] },
];
/** @nocollapse */
NgbPopoverWindow.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
NgbPopoverWindow.propDecorators = {
    placement: [{ type: Input }],
    title: [{ type: Input }],
    id: [{ type: Input }],
    popoverClass: [{ type: Input }]
};
/**
 * A lightweight, extensible directive for fancy popover creation.
 */
class NgbPopover {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} _ngZone
     * @param {?} _document
     */
    constructor(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, _ngZone, _document) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        /**
         * Emits an event when the popover is shown
         */
        this.shown = new EventEmitter();
        /**
         * Emits an event when the popover is hidden
         */
        this.hidden = new EventEmitter();
        this._ngbPopoverWindowId = `ngb-popover-${nextId$3++}`;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disablePopover = config.disablePopover;
        this.popoverClass = config.popoverClass;
        this._popupService = new PopupService(NgbPopoverWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            }
        });
    }
    /**
     * @return {?}
     */
    _isDisabled() {
        if (this.disablePopover) {
            return true;
        }
        if (!this.ngbPopover && !this.popoverTitle) {
            return true;
        }
        return false;
    }
    /**
     * Opens an element’s popover. This is considered a “manual” triggering of the popover.
     * The context is an optional value to be injected into the popover template when it is created.
     * @param {?=} context
     * @return {?}
     */
    open(context) {
        if (!this._windowRef && !this._isDisabled()) {
            this._windowRef = this._popupService.open(this.ngbPopover, context);
            this._windowRef.instance.title = this.popoverTitle;
            this._windowRef.instance.popoverClass = this.popoverClass;
            this._windowRef.instance.id = this._ngbPopoverWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbPopoverWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            // apply styling to set basic css-classes on target element, before going for positioning
            this._windowRef.changeDetectorRef.detectChanges();
            this._windowRef.changeDetectorRef.markForCheck();
            // position popover along the element
            this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            if (this.autoClose) {
                this._ngZone.runOutsideAngular(() => {
                    /** @type {?} */
                    let justOpened = true;
                    requestAnimationFrame(() => justOpened = false);
                    /** @type {?} */
                    const escapes$ = fromEvent(this._document, 'keyup')
                        .pipe(takeUntil(this.hidden), filter(event => event.which === Key.Escape));
                    /** @type {?} */
                    const clicks$ = fromEvent(this._document, 'click')
                        .pipe(takeUntil(this.hidden), filter(() => !justOpened), filter(event => this._shouldCloseFromClick(event)));
                    race([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => this.close()));
                });
            }
            this.shown.emit();
        }
    }
    /**
     * Closes an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    close() {
        if (this._windowRef) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }
    /**
     * Toggles an element’s popover. This is considered a “manual” triggering of the popover.
     * @return {?}
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns whether or not the popover is currently being shown
     * @return {?}
     */
    isOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        // close popover if title and content become empty, or disablePopover set to true
        if ((changes['ngbPopover'] || changes['popoverTitle'] || changes['disablePopover']) && this._isDisabled()) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        this._unregisterListenersFn();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseFromClick(event) {
        if (event.button !== 2) {
            if (this.autoClose === true) {
                return true;
            }
            else if (this.autoClose === 'inside' && this._isEventFromPopover(event)) {
                return true;
            }
            else if (this.autoClose === 'outside' && !this._isEventFromPopover(event)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _isEventFromPopover(event) {
        /** @type {?} */
        const popup = this._windowRef.instance;
        return popup ? popup.isEventFrom(event) : false;
    }
}
NgbPopover.decorators = [
    { type: Directive, args: [{ selector: '[ngbPopover]', exportAs: 'ngbPopover' },] },
];
/** @nocollapse */
NgbPopover.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: NgbPopoverConfig },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbPopover.propDecorators = {
    autoClose: [{ type: Input }],
    ngbPopover: [{ type: Input }],
    popoverTitle: [{ type: Input }],
    placement: [{ type: Input }],
    triggers: [{ type: Input }],
    container: [{ type: Input }],
    disablePopover: [{ type: Input }],
    popoverClass: [{ type: Input }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbPopoverModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbPopoverModule }; }
}
NgbPopoverModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbPopover, NgbPopoverWindow], exports: [NgbPopover], entryComponents: [NgbPopoverWindow] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbProgressbar component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the progress bars used in the application.
 */
class NgbProgressbarConfig {
    constructor() {
        this.max = 100;
        this.animated = false;
        this.striped = false;
        this.showValue = false;
    }
}
NgbProgressbarConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbProgressbarConfig.ngInjectableDef = defineInjectable({ factory: function NgbProgressbarConfig_Factory() { return new NgbProgressbarConfig(); }, token: NgbProgressbarConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Directive that can be used to provide feedback on the progress of a workflow or an action.
 */
class NgbProgressbar {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * Current value to be displayed in the progressbar. Should be smaller or equal to "max" value.
         */
        this.value = 0;
        this.max = config.max;
        this.animated = config.animated;
        this.striped = config.striped;
        this.type = config.type;
        this.showValue = config.showValue;
        this.height = config.height;
    }
    /**
     * @return {?}
     */
    getValue() { return getValueInRange(this.value, this.max); }
    /**
     * @return {?}
     */
    getPercentValue() { return 100 * this.getValue() / this.max; }
}
NgbProgressbar.decorators = [
    { type: Component, args: [{
                selector: 'ngb-progressbar',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <div class="progress" [style.height]="height">
      <div class="progress-bar{{type ? ' bg-' + type : ''}}{{animated ? ' progress-bar-animated' : ''}}{{striped ?
    ' progress-bar-striped' : ''}}" role="progressbar" [style.width.%]="getPercentValue()"
    [attr.aria-valuenow]="getValue()" aria-valuemin="0" [attr.aria-valuemax]="max">
        <span *ngIf="showValue" i18n="@@ngb.progressbar.value">{{getPercentValue()}}%</span><ng-content></ng-content>
      </div>
    </div>
  `
            },] },
];
/** @nocollapse */
NgbProgressbar.ctorParameters = () => [
    { type: NgbProgressbarConfig }
];
NgbProgressbar.propDecorators = {
    max: [{ type: Input }],
    animated: [{ type: Input }],
    striped: [{ type: Input }],
    showValue: [{ type: Input }],
    type: [{ type: Input }],
    value: [{ type: Input }],
    height: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbProgressbarModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbProgressbarModule }; }
}
NgbProgressbarModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbProgressbar], exports: [NgbProgressbar], imports: [CommonModule] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbRating component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the ratings used in the application.
 */
class NgbRatingConfig {
    constructor() {
        this.max = 10;
        this.readonly = false;
        this.resettable = false;
    }
}
NgbRatingConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbRatingConfig.ngInjectableDef = defineInjectable({ factory: function NgbRatingConfig_Factory() { return new NgbRatingConfig(); }, token: NgbRatingConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_RATING_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbRating),
    multi: true
};
/**
 * Rating directive that will take care of visualising a star rating bar.
 */
class NgbRating {
    /**
     * @param {?} config
     * @param {?} _changeDetectorRef
     */
    constructor(config, _changeDetectorRef) {
        this._changeDetectorRef = _changeDetectorRef;
        this.contexts = [];
        this.disabled = false;
        /**
         * An event fired when a user is hovering over a given rating.
         * Event's payload equals to the rating being hovered over.
         */
        this.hover = new EventEmitter();
        /**
         * An event fired when a user stops hovering over a given rating.
         * Event's payload equals to the rating of the last item being hovered over.
         */
        this.leave = new EventEmitter();
        /**
         * An event fired when a user selects a new rating.
         * Event's payload equals to the newly selected rating.
         */
        this.rateChange = new EventEmitter(true);
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.max = config.max;
        this.readonly = config.readonly;
    }
    /**
     * @return {?}
     */
    ariaValueText() { return `${this.nextRate} out of ${this.max}`; }
    /**
     * @param {?} value
     * @return {?}
     */
    enter(value) {
        if (!this.readonly && !this.disabled) {
            this._updateState(value);
        }
        this.hover.emit(value);
    }
    /**
     * @return {?}
     */
    handleBlur() { this.onTouched(); }
    /**
     * @param {?} value
     * @return {?}
     */
    handleClick(value) { this.update(this.resettable && this.rate === value ? 0 : value); }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyDown(event) {
        if (Key[toString(event.which)]) {
            event.preventDefault();
            switch (event.which) {
                case Key.ArrowDown:
                case Key.ArrowLeft:
                    this.update(this.rate - 1);
                    break;
                case Key.ArrowUp:
                case Key.ArrowRight:
                    this.update(this.rate + 1);
                    break;
                case Key.Home:
                    this.update(0);
                    break;
                case Key.End:
                    this.update(this.max);
                    break;
            }
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['rate']) {
            this.update(this.rate);
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.contexts = Array.from({ length: this.max }, (v, k) => ({ fill: 0, index: k }));
        this._updateState(this.rate);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @return {?}
     */
    reset() {
        this.leave.emit(this.nextRate);
        this._updateState(this.rate);
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} value
     * @param {?=} internalChange
     * @return {?}
     */
    update(value, internalChange = true) {
        /** @type {?} */
        const newRate = getValueInRange(value, this.max, 0);
        if (!this.readonly && !this.disabled && this.rate !== newRate) {
            this.rate = newRate;
            this.rateChange.emit(this.rate);
        }
        if (internalChange) {
            this.onChange(this.rate);
            this.onTouched();
        }
        this._updateState(this.rate);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.update(value, false);
        this._changeDetectorRef.markForCheck();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    _getFillValue(index) {
        /** @type {?} */
        const diff = this.nextRate - index;
        if (diff >= 1) {
            return 100;
        }
        if (diff < 1 && diff > 0) {
            return Number.parseInt((diff * 100).toFixed(2));
        }
        return 0;
    }
    /**
     * @param {?} nextValue
     * @return {?}
     */
    _updateState(nextValue) {
        this.nextRate = nextValue;
        this.contexts.forEach((context, index) => context.fill = this._getFillValue(index));
    }
}
NgbRating.decorators = [
    { type: Component, args: [{
                selector: 'ngb-rating',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'd-inline-flex',
                    'tabindex': '0',
                    'role': 'slider',
                    'aria-valuemin': '0',
                    '[attr.aria-valuemax]': 'max',
                    '[attr.aria-valuenow]': 'nextRate',
                    '[attr.aria-valuetext]': 'ariaValueText()',
                    '[attr.aria-disabled]': 'readonly ? true : null',
                    '(blur)': 'handleBlur()',
                    '(keydown)': 'handleKeyDown($event)',
                    '(mouseleave)': 'reset()'
                },
                template: `
    <ng-template #t let-fill="fill">{{ fill === 100 ? '&#9733;' : '&#9734;' }}</ng-template>
    <ng-template ngFor [ngForOf]="contexts" let-index="index">
      <span class="sr-only">({{ index < nextRate ? '*' : ' ' }})</span>
      <span (mouseenter)="enter(index + 1)" (click)="handleClick(index + 1)" [style.cursor]="readonly || disabled ? 'default' : 'pointer'">
        <ng-template [ngTemplateOutlet]="starTemplate || t" [ngTemplateOutletContext]="contexts[index]"></ng-template>
      </span>
    </ng-template>
  `,
                providers: [NGB_RATING_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
NgbRating.ctorParameters = () => [
    { type: NgbRatingConfig },
    { type: ChangeDetectorRef }
];
NgbRating.propDecorators = {
    max: [{ type: Input }],
    rate: [{ type: Input }],
    readonly: [{ type: Input }],
    resettable: [{ type: Input }],
    starTemplate: [{ type: Input }, { type: ContentChild, args: [TemplateRef,] }],
    hover: [{ type: Output }],
    leave: [{ type: Output }],
    rateChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbRatingModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbRatingModule }; }
}
NgbRatingModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbRating], exports: [NgbRating], imports: [CommonModule] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTabset component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tabsets used in the application.
 */
class NgbTabsetConfig {
    constructor() {
        this.justify = 'start';
        this.orientation = 'horizontal';
        this.type = 'tabs';
    }
}
NgbTabsetConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbTabsetConfig.ngInjectableDef = defineInjectable({ factory: function NgbTabsetConfig_Factory() { return new NgbTabsetConfig(); }, token: NgbTabsetConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$4 = 0;
/**
 * This directive should be used to wrap tab titles that need to contain HTML markup or other directives.
 */
class NgbTabTitle {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbTabTitle.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbTabTitle]' },] },
];
/** @nocollapse */
NgbTabTitle.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * This directive must be used to wrap content to be displayed in a tab.
 */
class NgbTabContent {
    /**
     * @param {?} templateRef
     */
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
NgbTabContent.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbTabContent]' },] },
];
/** @nocollapse */
NgbTabContent.ctorParameters = () => [
    { type: TemplateRef }
];
/**
 * A directive representing an individual tab.
 */
class NgbTab {
    constructor() {
        /**
         * Unique tab identifier. Must be unique for the entire document for proper accessibility support.
         */
        this.id = `ngb-tab-${nextId$4++}`;
        /**
         * Allows toggling disabled state of a given state. Disabled tabs can't be selected.
         */
        this.disabled = false;
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        // We are using @ContentChildren instead of @ContantChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.contentTpl = this.contentTpls.first;
    }
}
NgbTab.decorators = [
    { type: Directive, args: [{ selector: 'ngb-tab' },] },
];
NgbTab.propDecorators = {
    id: [{ type: Input }],
    title: [{ type: Input }],
    disabled: [{ type: Input }],
    titleTpls: [{ type: ContentChildren, args: [NgbTabTitle, { descendants: false },] }],
    contentTpls: [{ type: ContentChildren, args: [NgbTabContent, { descendants: false },] }]
};
/**
 * A component that makes it easy to create tabbed interface.
 */
class NgbTabset {
    /**
     * @param {?} config
     */
    constructor(config) {
        /**
         * Whether the closed tabs should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A tab change event fired right before the tab selection happens. See NgbTabChangeEvent for payload details
         */
        this.tabChange = new EventEmitter();
        this.type = config.type;
        this.justify = config.justify;
        this.orientation = config.orientation;
    }
    /**
     * The horizontal alignment of the nav with flexbox utilities. Can be one of 'start', 'center', 'end', 'fill' or
     * 'justified'
     * The default value is 'start'.
     * @param {?} className
     * @return {?}
     */
    set justify(className) {
        if (className === 'fill' || className === 'justified') {
            this.justifyClass = `nav-${className}`;
        }
        else {
            this.justifyClass = `justify-content-${className}`;
        }
    }
    /**
     * Selects the tab with the given id and shows its associated pane.
     * Any other tab that was previously selected becomes unselected and its associated pane is hidden.
     * @param {?} tabId
     * @return {?}
     */
    select(tabId) {
        /** @type {?} */
        let selectedTab = this._getTabById(tabId);
        if (selectedTab && !selectedTab.disabled && this.activeId !== selectedTab.id) {
            /** @type {?} */
            let defaultPrevented = false;
            this.tabChange.emit({ activeId: this.activeId, nextId: selectedTab.id, preventDefault: () => { defaultPrevented = true; } });
            if (!defaultPrevented) {
                this.activeId = selectedTab.id;
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        /** @type {?} */
        let activeTab = this._getTabById(this.activeId);
        this.activeId = activeTab ? activeTab.id : (this.tabs.length ? this.tabs.first.id : null);
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _getTabById(id) {
        /** @type {?} */
        let tabsWithId = this.tabs.filter(tab => tab.id === id);
        return tabsWithId.length ? tabsWithId[0] : null;
    }
}
NgbTabset.decorators = [
    { type: Component, args: [{
                selector: 'ngb-tabset',
                exportAs: 'ngbTabset',
                template: `
    <ul [class]="'nav nav-' + type + (orientation == 'horizontal'?  ' ' + justifyClass : ' flex-column')" role="tablist">
      <li class="nav-item" *ngFor="let tab of tabs">
        <a [id]="tab.id" class="nav-link" [class.active]="tab.id === activeId" [class.disabled]="tab.disabled"
          href (click)="!!select(tab.id)" role="tab" [attr.tabindex]="(tab.disabled ? '-1': undefined)"
          [attr.aria-controls]="(!destroyOnHide || tab.id === activeId ? tab.id + '-panel' : null)"
          [attr.aria-expanded]="tab.id === activeId" [attr.aria-disabled]="tab.disabled">
          {{tab.title}}<ng-template [ngTemplateOutlet]="tab.titleTpl?.templateRef"></ng-template>
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <ng-template ngFor let-tab [ngForOf]="tabs">
        <div
          class="tab-pane {{tab.id === activeId ? 'active' : null}}"
          *ngIf="!destroyOnHide || tab.id === activeId"
          role="tabpanel"
          [attr.aria-labelledby]="tab.id" id="{{tab.id}}-panel"
          [attr.aria-expanded]="tab.id === activeId">
          <ng-template [ngTemplateOutlet]="tab.contentTpl?.templateRef"></ng-template>
        </div>
      </ng-template>
    </div>
  `
            },] },
];
/** @nocollapse */
NgbTabset.ctorParameters = () => [
    { type: NgbTabsetConfig }
];
NgbTabset.propDecorators = {
    tabs: [{ type: ContentChildren, args: [NgbTab,] }],
    activeId: [{ type: Input }],
    destroyOnHide: [{ type: Input }],
    justify: [{ type: Input }],
    orientation: [{ type: Input }],
    type: [{ type: Input }],
    tabChange: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_TABSET_DIRECTIVES = [NgbTabset, NgbTab, NgbTabContent, NgbTabTitle];
class NgbTabsetModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTabsetModule }; }
}
NgbTabsetModule.decorators = [
    { type: NgModule, args: [{ declarations: NGB_TABSET_DIRECTIVES, exports: NGB_TABSET_DIRECTIVES, imports: [CommonModule] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTime {
    /**
     * @param {?=} hour
     * @param {?=} minute
     * @param {?=} second
     */
    constructor(hour, minute, second) {
        this.hour = toInteger(hour);
        this.minute = toInteger(minute);
        this.second = toInteger(second);
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeHour(step = 1) { this.updateHour((isNaN(this.hour) ? 0 : this.hour) + step); }
    /**
     * @param {?} hour
     * @return {?}
     */
    updateHour(hour) {
        if (isNumber(hour)) {
            this.hour = (hour < 0 ? 24 + hour : hour) % 24;
        }
        else {
            this.hour = NaN;
        }
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeMinute(step = 1) { this.updateMinute((isNaN(this.minute) ? 0 : this.minute) + step); }
    /**
     * @param {?} minute
     * @return {?}
     */
    updateMinute(minute) {
        if (isNumber(minute)) {
            this.minute = minute % 60 < 0 ? 60 + minute % 60 : minute % 60;
            this.changeHour(Math.floor(minute / 60));
        }
        else {
            this.minute = NaN;
        }
    }
    /**
     * @param {?=} step
     * @return {?}
     */
    changeSecond(step = 1) { this.updateSecond((isNaN(this.second) ? 0 : this.second) + step); }
    /**
     * @param {?} second
     * @return {?}
     */
    updateSecond(second) {
        if (isNumber(second)) {
            this.second = second < 0 ? 60 + second % 60 : second % 60;
            this.changeMinute(Math.floor(second / 60));
        }
        else {
            this.second = NaN;
        }
    }
    /**
     * @param {?=} checkSecs
     * @return {?}
     */
    isValid(checkSecs = true) {
        return isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true);
    }
    /**
     * @return {?}
     */
    toString() { return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`; }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTimepicker component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the timepickers used in the application.
 */
class NgbTimepickerConfig {
    constructor() {
        this.meridian = false;
        this.spinners = true;
        this.seconds = false;
        this.hourStep = 1;
        this.minuteStep = 1;
        this.secondStep = 1;
        this.disabled = false;
        this.readonlyInputs = false;
        this.size = 'medium';
    }
}
NgbTimepickerConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbTimepickerConfig.ngInjectableDef = defineInjectable({ factory: function NgbTimepickerConfig_Factory() { return new NgbTimepickerConfig(); }, token: NgbTimepickerConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Abstract type serving as a DI token for the service converting from your application Time model to internal
 * NgbTimeStruct model.
 * A default implementation converting from and to NgbTimeStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 *
 * \@since 2.2.0
 * @abstract
 * @template T
 */
class NgbTimeAdapter {
}
NgbTimeAdapter.decorators = [
    { type: Injectable },
];
class NgbTimeStructAdapter extends NgbTimeAdapter {
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    fromModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    toModel(time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    }
}
NgbTimeStructAdapter.decorators = [
    { type: Injectable },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTimepicker),
    multi: true
};
/**
 * A lightweight & configurable timepicker directive.
 */
class NgbTimepicker {
    /**
     * @param {?} config
     * @param {?} _ngbTimeAdapter
     */
    constructor(config, _ngbTimeAdapter) {
        this._ngbTimeAdapter = _ngbTimeAdapter;
        this.onChange = (_) => { };
        this.onTouched = () => { };
        this.meridian = config.meridian;
        this.spinners = config.spinners;
        this.seconds = config.seconds;
        this.hourStep = config.hourStep;
        this.minuteStep = config.minuteStep;
        this.secondStep = config.secondStep;
        this.disabled = config.disabled;
        this.readonlyInputs = config.readonlyInputs;
        this.size = config.size;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        /** @type {?} */
        const structValue = this._ngbTimeAdapter.fromModel(value);
        this.model = structValue ? new NgbTime(structValue.hour, structValue.minute, structValue.second) : new NgbTime();
        if (!this.seconds && (!structValue || !isNumber(structValue.second))) {
            this.model.second = 0;
        }
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this.onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) { this.disabled = isDisabled; }
    /**
     * @param {?} step
     * @return {?}
     */
    changeHour(step) {
        this.model.changeHour(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeMinute(step) {
        this.model.changeMinute(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} step
     * @return {?}
     */
    changeSecond(step) {
        this.model.changeSecond(step);
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateHour(newVal) {
        /** @type {?} */
        const isPM = this.model.hour >= 12;
        /** @type {?} */
        const enteredHour = toInteger(newVal);
        if (this.meridian && (isPM && enteredHour < 12 || !isPM && enteredHour === 12)) {
            this.model.updateHour(enteredHour + 12);
        }
        else {
            this.model.updateHour(enteredHour);
        }
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateMinute(newVal) {
        this.model.updateMinute(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @param {?} newVal
     * @return {?}
     */
    updateSecond(newVal) {
        this.model.updateSecond(toInteger(newVal));
        this.propagateModelChange();
    }
    /**
     * @return {?}
     */
    toggleMeridian() {
        if (this.meridian) {
            this.changeHour(12);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatHour(value) {
        if (isNumber(value)) {
            if (this.meridian) {
                return padNumber(value % 12 === 0 ? 12 : value % 12);
            }
            else {
                return padNumber(value % 24);
            }
        }
        else {
            return padNumber(NaN);
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    formatMinSec(value) { return padNumber(value); }
    /**
     * @return {?}
     */
    setFormControlSize() { return { 'form-control-sm': this.size === 'small', 'form-control-lg': this.size === 'large' }; }
    /**
     * @return {?}
     */
    setButtonSize() { return { 'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large' }; }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
            this.model.second = 0;
            this.propagateModelChange(false);
        }
    }
    /**
     * @param {?=} touched
     * @return {?}
     */
    propagateModelChange(touched = true) {
        if (touched) {
            this.onTouched();
        }
        if (this.model.isValid(this.seconds)) {
            this.onChange(this._ngbTimeAdapter.toModel({ hour: this.model.hour, minute: this.model.minute, second: this.model.second }));
        }
        else {
            this.onChange(this._ngbTimeAdapter.toModel(null));
        }
    }
}
NgbTimepicker.decorators = [
    { type: Component, args: [{
                selector: 'ngb-timepicker',
                styles: [`

    :host {
      font-size: 1rem;
    }

    .ngb-tp {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-align: center;
      align-items: center;
    }

    .ngb-tp-input-container {
      width: 4em;
    }

    .ngb-tp-hour, .ngb-tp-minute, .ngb-tp-second, .ngb-tp-meridian {
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-align: center;
      align-items: center;
      -ms-flex-pack: distribute;
      justify-content: space-around;
    }

    .ngb-tp-spacer {
      width: 1em;
      text-align: center;
    }

    .chevron::before {
      border-style: solid;
      border-width: 0.29em 0.29em 0 0;
      content: '';
      display: inline-block;
      height: 0.69em;
      left: 0.05em;
      position: relative;
      top: 0.15em;
      transform: rotate(-45deg);
      -webkit-transform: rotate(-45deg);
      -ms-transform: rotate(-45deg);
      vertical-align: middle;
      width: 0.71em;
    }

    .chevron.bottom:before {
      top: -.3em;
      -webkit-transform: rotate(135deg);
      -ms-transform: rotate(135deg);
      transform: rotate(135deg);
    }

    input {
      text-align: center;
    }
  `],
                template: `
    <fieldset [disabled]="disabled" [class.disabled]="disabled">
      <div class="ngb-tp">
        <div class="ngb-tp-input-container ngb-tp-hour">
          <button *ngIf="spinners" type="button" class="btn btn-link" [ngClass]="setButtonSize()" (click)="changeHour(hourStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-hours">Increment hours</span>
          </button>
          <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2"
            placeholder="HH" i18n-placeholder="@@ngb.timepicker.HH"
            [value]="formatHour(model?.hour)" (change)="updateHour($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Hours" i18n-aria-label="@@ngb.timepicker.hours">
          <button *ngIf="spinners" type="button" class="btn btn-link" [ngClass]="setButtonSize()" (click)="changeHour(-hourStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.decrement-hours">Decrement hours</span>
          </button>
        </div>
        <div class="ngb-tp-spacer">:</div>
        <div class="ngb-tp-input-container ngb-tp-minute">
          <button *ngIf="spinners" type="button" class="btn btn-link" [ngClass]="setButtonSize()" (click)="changeMinute(minuteStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-minutes">Increment minutes</span>
          </button>
          <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2"
            placeholder="MM" i18n-placeholder="@@ngb.timepicker.MM"
            [value]="formatMinSec(model?.minute)" (change)="updateMinute($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Minutes" i18n-aria-label="@@ngb.timepicker.minutes">
          <button *ngIf="spinners" type="button" class="btn btn-link" [ngClass]="setButtonSize()" (click)="changeMinute(-minuteStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only"  i18n="@@ngb.timepicker.decrement-minutes">Decrement minutes</span>
          </button>
        </div>
        <div *ngIf="seconds" class="ngb-tp-spacer">:</div>
        <div *ngIf="seconds" class="ngb-tp-input-container ngb-tp-second">
          <button *ngIf="spinners" type="button" class="btn btn-link" [ngClass]="setButtonSize()" (click)="changeSecond(secondStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.increment-seconds">Increment seconds</span>
          </button>
          <input type="text" class="form-control" [ngClass]="setFormControlSize()" maxlength="2"
            placeholder="SS" i18n-placeholder="@@ngb.timepicker.SS"
            [value]="formatMinSec(model?.second)" (change)="updateSecond($event.target.value)"
            [readonly]="readonlyInputs" [disabled]="disabled" aria-label="Seconds" i18n-aria-label="@@ngb.timepicker.seconds">
          <button *ngIf="spinners" type="button" class="btn btn-link" [ngClass]="setButtonSize()" (click)="changeSecond(-secondStep)"
            [disabled]="disabled" [class.disabled]="disabled">
            <span class="chevron bottom"></span>
            <span class="sr-only" i18n="@@ngb.timepicker.decrement-seconds">Decrement seconds</span>
          </button>
        </div>
        <div *ngIf="meridian" class="ngb-tp-spacer"></div>
        <div *ngIf="meridian" class="ngb-tp-meridian">
          <button type="button" class="btn btn-outline-primary" [ngClass]="setButtonSize()"
            [disabled]="disabled" [class.disabled]="disabled"
                  (click)="toggleMeridian()">
            <ng-container *ngIf="model?.hour >= 12; else am" i18n="@@ngb.timepicker.PM">PM</ng-container>
            <ng-template #am i18n="@@ngb.timepicker.AM">AM</ng-template>
          </button>
        </div>
      </div>
    </fieldset>
  `,
                providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
NgbTimepicker.ctorParameters = () => [
    { type: NgbTimepickerConfig },
    { type: NgbTimeAdapter }
];
NgbTimepicker.propDecorators = {
    meridian: [{ type: Input }],
    spinners: [{ type: Input }],
    seconds: [{ type: Input }],
    hourStep: [{ type: Input }],
    minuteStep: [{ type: Input }],
    secondStep: [{ type: Input }],
    readonlyInputs: [{ type: Input }],
    size: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTimepickerModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTimepickerModule }; }
}
NgbTimepickerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbTimepicker],
                exports: [NgbTimepicker],
                imports: [CommonModule],
                providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStructAdapter }]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTooltip directive.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the tooltips used in the application.
 */
class NgbTooltipConfig {
    constructor() {
        this.autoClose = true;
        this.placement = 'top';
        this.triggers = 'hover';
        this.disableTooltip = false;
    }
}
NgbTooltipConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbTooltipConfig.ngInjectableDef = defineInjectable({ factory: function NgbTooltipConfig_Factory() { return new NgbTooltipConfig(); }, token: NgbTooltipConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
let nextId$5 = 0;
class NgbTooltipWindow {
    /**
     * @param {?} _element
     * @param {?} _renderer
     */
    constructor(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this.placement = 'top';
    }
    /**
     * @param {?} _placement
     * @return {?}
     */
    applyPlacement(_placement) {
        // remove the current placement classes
        this._renderer.removeClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
        this._renderer.removeClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString());
        // set the new placement classes
        this.placement = _placement;
        // apply the new placement
        this._renderer.addClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString().split('-')[0]);
        this._renderer.addClass(this._element.nativeElement, 'bs-tooltip-' + this.placement.toString());
    }
    /**
     * Tells whether the event has been triggered from this component's subtree or not.
     *
     * @param {?} event the event to check
     *
     * @return {?} whether the event has been triggered from this component's subtree or not.
     */
    isEventFrom(event) { return this._element.nativeElement.contains(/** @type {?} */ (event.target)); }
}
NgbTooltipWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-tooltip-window',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    '[class]': '"tooltip show bs-tooltip-" + placement.split("-")[0]+" bs-tooltip-" + placement',
                    'role': 'tooltip',
                    '[id]': 'id'
                },
                template: `<div class="arrow"></div><div class="tooltip-inner"><ng-content></ng-content></div>`,
                styles: [`
    :host.bs-tooltip-top .arrow, :host.bs-tooltip-bottom .arrow {
      left: calc(50% - 0.4rem);
    }

    :host.bs-tooltip-top-left .arrow, :host.bs-tooltip-bottom-left .arrow {
      left: 1em;
    }

    :host.bs-tooltip-top-right .arrow, :host.bs-tooltip-bottom-right .arrow {
      left: auto;
      right: 0.8rem;
    }

    :host.bs-tooltip-left .arrow, :host.bs-tooltip-right .arrow {
      top: calc(50% - 0.4rem);
    }

    :host.bs-tooltip-left-top .arrow, :host.bs-tooltip-right-top .arrow {
      top: 0.4rem;
    }

    :host.bs-tooltip-left-bottom .arrow, :host.bs-tooltip-right-bottom .arrow {
      top: auto;
      bottom: 0.4rem;
    }
  `]
            },] },
];
/** @nocollapse */
NgbTooltipWindow.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
NgbTooltipWindow.propDecorators = {
    placement: [{ type: Input }],
    id: [{ type: Input }]
};
/**
 * A lightweight, extensible directive for fancy tooltip creation.
 */
class NgbTooltip {
    /**
     * @param {?} _elementRef
     * @param {?} _renderer
     * @param {?} injector
     * @param {?} componentFactoryResolver
     * @param {?} viewContainerRef
     * @param {?} config
     * @param {?} _ngZone
     * @param {?} _document
     */
    constructor(_elementRef, _renderer, injector, componentFactoryResolver, viewContainerRef, config, _ngZone, _document) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._ngZone = _ngZone;
        this._document = _document;
        /**
         * Emits an event when the tooltip is shown
         */
        this.shown = new EventEmitter();
        /**
         * Emits an event when the tooltip is hidden
         */
        this.hidden = new EventEmitter();
        this._ngbTooltipWindowId = `ngb-tooltip-${nextId$5++}`;
        this.autoClose = config.autoClose;
        this.placement = config.placement;
        this.triggers = config.triggers;
        this.container = config.container;
        this.disableTooltip = config.disableTooltip;
        this._popupService = new PopupService(NgbTooltipWindow, injector, viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = _ngZone.onStable.subscribe(() => {
            if (this._windowRef) {
                this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            }
        });
    }
    /**
     * Content to be displayed as tooltip. If falsy, the tooltip won't open.
     * @param {?} value
     * @return {?}
     */
    set ngbTooltip(value) {
        this._ngbTooltip = value;
        if (!value && this._windowRef) {
            this.close();
        }
    }
    /**
     * @return {?}
     */
    get ngbTooltip() { return this._ngbTooltip; }
    /**
     * Opens an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * The context is an optional value to be injected into the tooltip template when it is created.
     * @param {?=} context
     * @return {?}
     */
    open(context) {
        if (!this._windowRef && this._ngbTooltip && !this.disableTooltip) {
            this._windowRef = this._popupService.open(this._ngbTooltip, context);
            this._windowRef.instance.id = this._ngbTooltipWindowId;
            this._renderer.setAttribute(this._elementRef.nativeElement, 'aria-describedby', this._ngbTooltipWindowId);
            if (this.container === 'body') {
                this._document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
            this._windowRef.instance.placement = Array.isArray(this.placement) ? this.placement[0] : this.placement;
            // apply styling to set basic css-classes on target element, before going for positioning
            this._windowRef.changeDetectorRef.detectChanges();
            this._windowRef.changeDetectorRef.markForCheck();
            // position tooltip along the element
            this._windowRef.instance.applyPlacement(positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body'));
            if (this.autoClose) {
                this._ngZone.runOutsideAngular(() => {
                    /** @type {?} */
                    let justOpened = true;
                    requestAnimationFrame(() => justOpened = false);
                    /** @type {?} */
                    const escapes$ = fromEvent(this._document, 'keyup')
                        .pipe(takeUntil(this.hidden), filter(event => event.which === Key.Escape));
                    /** @type {?} */
                    const clicks$ = fromEvent(this._document, 'click')
                        .pipe(takeUntil(this.hidden), filter(() => !justOpened), filter(event => this._shouldCloseFromClick(event)));
                    race([escapes$, clicks$]).subscribe(() => this._ngZone.run(() => this.close()));
                });
            }
            this.shown.emit();
        }
    }
    /**
     * Closes an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    close() {
        if (this._windowRef != null) {
            this._renderer.removeAttribute(this._elementRef.nativeElement, 'aria-describedby');
            this._popupService.close();
            this._windowRef = null;
            this.hidden.emit();
        }
    }
    /**
     * Toggles an element’s tooltip. This is considered a “manual” triggering of the tooltip.
     * @return {?}
     */
    toggle() {
        if (this._windowRef) {
            this.close();
        }
        else {
            this.open();
        }
    }
    /**
     * Returns whether or not the tooltip is currently being shown
     * @return {?}
     */
    isOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    ngOnInit() {
        this._unregisterListenersFn = listenToTriggers(this._renderer, this._elementRef.nativeElement, this.triggers, this.open.bind(this), this.close.bind(this), this.toggle.bind(this));
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.close();
        // This check is needed as it might happen that ngOnDestroy is called before ngOnInit
        // under certain conditions, see: https://github.com/ng-bootstrap/ng-bootstrap/issues/2199
        if (this._unregisterListenersFn) {
            this._unregisterListenersFn();
        }
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _shouldCloseFromClick(event) {
        if (event.button !== 2) {
            if (this.autoClose === true) {
                return true;
            }
            else if (this.autoClose === 'inside' && this._isEventFromTooltip(event)) {
                return true;
            }
            else if (this.autoClose === 'outside' && !this._isEventFromTooltip(event)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    _isEventFromTooltip(event) {
        /** @type {?} */
        const popup = this._windowRef.instance;
        return popup ? popup.isEventFrom(event) : false;
    }
}
NgbTooltip.decorators = [
    { type: Directive, args: [{ selector: '[ngbTooltip]', exportAs: 'ngbTooltip' },] },
];
/** @nocollapse */
NgbTooltip.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: ViewContainerRef },
    { type: NgbTooltipConfig },
    { type: NgZone },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
NgbTooltip.propDecorators = {
    autoClose: [{ type: Input }],
    placement: [{ type: Input }],
    triggers: [{ type: Input }],
    container: [{ type: Input }],
    disableTooltip: [{ type: Input }],
    shown: [{ type: Output }],
    hidden: [{ type: Output }],
    ngbTooltip: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTooltipModule {
    /**
     * No need in forRoot anymore with tree-shakeable services
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTooltipModule }; }
}
NgbTooltipModule.decorators = [
    { type: NgModule, args: [{ declarations: [NgbTooltip, NgbTooltipWindow], exports: [NgbTooltip], entryComponents: [NgbTooltipWindow] },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * A component that can be used inside a custom result template in order to highlight the term inside the text of the
 * result
 */
class NgbHighlight {
    constructor() {
        /**
         * The CSS class of the span elements wrapping the term inside the result
         */
        this.highlightClass = 'ngb-highlight';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const resultStr = toString(this.result);
        /** @type {?} */
        const resultLC = resultStr.toLowerCase();
        /** @type {?} */
        const termLC = toString(this.term).toLowerCase();
        /** @type {?} */
        let currentIdx = 0;
        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
                /** @type {?} */
                const originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        }
        else {
            this.parts = [resultStr];
        }
    }
}
NgbHighlight.decorators = [
    { type: Component, args: [{
                selector: 'ngb-highlight',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                    `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
                    `</ng-template>`,
                // template needs to be formatted in a certain way so we don't add empty text nodes
                styles: [`
    .ngb-highlight {
      font-weight: bold;
    }
  `]
            },] },
];
NgbHighlight.propDecorators = {
    highlightClass: [{ type: Input }],
    result: [{ type: Input }],
    term: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTypeaheadWindow {
    constructor() {
        this.activeIdx = 0;
        /**
         * Flag indicating if the first row should be active initially
         */
        this.focusFirst = true;
        /**
         * A function used to format a given result before display. This function should return a formatted string without any
         * HTML markup
         */
        this.formatter = toString;
        /**
         * Event raised when user selects a particular result row
         */
        this.selectEvent = new EventEmitter();
        this.activeChangeEvent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    hasActive() { return this.activeIdx > -1 && this.activeIdx < this.results.length; }
    /**
     * @return {?}
     */
    getActive() { return this.results[this.activeIdx]; }
    /**
     * @param {?} activeIdx
     * @return {?}
     */
    markActive(activeIdx) {
        this.activeIdx = activeIdx;
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    next() {
        if (this.activeIdx === this.results.length - 1) {
            this.activeIdx = this.focusFirst ? (this.activeIdx + 1) % this.results.length : -1;
        }
        else {
            this.activeIdx++;
        }
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    prev() {
        if (this.activeIdx < 0) {
            this.activeIdx = this.results.length - 1;
        }
        else if (this.activeIdx === 0) {
            this.activeIdx = this.focusFirst ? this.results.length - 1 : -1;
        }
        else {
            this.activeIdx--;
        }
        this._activeChanged();
    }
    /**
     * @return {?}
     */
    resetActive() {
        this.activeIdx = this.focusFirst ? 0 : -1;
        this._activeChanged();
    }
    /**
     * @param {?} item
     * @return {?}
     */
    select(item) { this.selectEvent.emit(item); }
    /**
     * @return {?}
     */
    ngOnInit() { this.resetActive(); }
    /**
     * @return {?}
     */
    _activeChanged() {
        this.activeChangeEvent.emit(this.activeIdx >= 0 ? this.id + '-' + this.activeIdx : undefined);
    }
}
NgbTypeaheadWindow.decorators = [
    { type: Component, args: [{
                selector: 'ngb-typeahead-window',
                exportAs: 'ngbTypeaheadWindow',
                host: { 'class': 'dropdown-menu show', 'role': 'listbox', '[id]': 'id' },
                template: `
    <ng-template #rt let-result="result" let-term="term" let-formatter="formatter">
      <ngb-highlight [result]="formatter(result)" [term]="term"></ngb-highlight>
    </ng-template>
    <ng-template ngFor [ngForOf]="results" let-result let-idx="index">
      <button type="button" class="dropdown-item" role="option"
        [id]="id + '-' + idx"
        [class.active]="idx === activeIdx"
        (mouseenter)="markActive(idx)"
        (click)="select(result)">
          <ng-template [ngTemplateOutlet]="resultTemplate || rt"
          [ngTemplateOutletContext]="{result: result, term: term, formatter: formatter}"></ng-template>
      </button>
    </ng-template>
  `
            },] },
];
NgbTypeaheadWindow.propDecorators = {
    id: [{ type: Input }],
    focusFirst: [{ type: Input }],
    results: [{ type: Input }],
    term: [{ type: Input }],
    formatter: [{ type: Input }],
    resultTemplate: [{ type: Input }],
    selectEvent: [{ type: Output, args: ['select',] }],
    activeChangeEvent: [{ type: Output, args: ['activeChange',] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const ARIA_LIVE_DELAY = new InjectionToken('live announcer delay', { providedIn: 'root', factory: ARIA_LIVE_DELAY_FACTORY });
/**
 * @return {?}
 */
function ARIA_LIVE_DELAY_FACTORY() {
    return 100;
}
/**
 * @param {?} document
 * @param {?=} lazyCreate
 * @return {?}
 */
function getLiveElement(document, lazyCreate = false) {
    /** @type {?} */
    let element = /** @type {?} */ (document.body.querySelector('#ngb-live'));
    if (element == null && lazyCreate) {
        element = document.createElement('div');
        element.setAttribute('id', 'ngb-live');
        element.setAttribute('aria-live', 'polite');
        element.setAttribute('aria-atomic', 'true');
        element.classList.add('sr-only');
        document.body.appendChild(element);
    }
    return element;
}
class Live {
    /**
     * @param {?} _document
     * @param {?} _delay
     */
    constructor(_document, _delay) {
        this._document = _document;
        this._delay = _delay;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        /** @type {?} */
        const element = getLiveElement(this._document);
        if (element) {
            element.parentElement.removeChild(element);
        }
    }
    /**
     * @param {?} message
     * @return {?}
     */
    say(message) {
        /** @type {?} */
        const element = getLiveElement(this._document, true);
        /** @type {?} */
        const delay = this._delay;
        element.textContent = '';
        /** @type {?} */
        const setText = () => element.textContent = message;
        if (delay === null) {
            setText();
        }
        else {
            setTimeout(setText, delay);
        }
    }
}
Live.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
Live.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [ARIA_LIVE_DELAY,] }] }
];
/** @nocollapse */ Live.ngInjectableDef = defineInjectable({ factory: function Live_Factory() { return new Live(inject(DOCUMENT), inject(ARIA_LIVE_DELAY)); }, token: Live, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Configuration service for the NgbTypeahead component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the typeaheads used in the application.
 */
class NgbTypeaheadConfig {
    constructor() {
        this.editable = true;
        this.focusFirst = true;
        this.showHint = false;
        this.placement = 'bottom-left';
    }
}
NgbTypeaheadConfig.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */ NgbTypeaheadConfig.ngInjectableDef = defineInjectable({ factory: function NgbTypeaheadConfig_Factory() { return new NgbTypeaheadConfig(); }, token: NgbTypeaheadConfig, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_TYPEAHEAD_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTypeahead),
    multi: true
};
/** @type {?} */
let nextWindowId = 0;
/**
 * NgbTypeahead directive provides a simple way of creating powerful typeaheads from any text input
 */
class NgbTypeahead {
    /**
     * @param {?} _elementRef
     * @param {?} _viewContainerRef
     * @param {?} _renderer
     * @param {?} _injector
     * @param {?} componentFactoryResolver
     * @param {?} config
     * @param {?} ngZone
     * @param {?} _live
     */
    constructor(_elementRef, _viewContainerRef, _renderer, _injector, componentFactoryResolver, config, ngZone, _live) {
        this._elementRef = _elementRef;
        this._viewContainerRef = _viewContainerRef;
        this._renderer = _renderer;
        this._injector = _injector;
        this._live = _live;
        /**
         * Value for the configurable autocomplete attribute.
         * Defaults to 'off' to disable the native browser autocomplete, but this standard value does not seem
         * to be always correctly taken into account.
         *
         * \@since 2.1.0
         */
        this.autocomplete = 'off';
        /**
         * Placement of a typeahead accepts:
         *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
         *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
         * and array of above values.
         */
        this.placement = 'bottom-left';
        /**
         * An event emitted when a match is selected. Event payload is of type NgbTypeaheadSelectItemEvent.
         */
        this.selectItem = new EventEmitter();
        this.popupId = `ngb-typeahead-${nextWindowId++}`;
        this._onTouched = () => { };
        this._onChange = (_) => { };
        this.container = config.container;
        this.editable = config.editable;
        this.focusFirst = config.focusFirst;
        this.showHint = config.showHint;
        this.placement = config.placement;
        this._valueChanges = fromEvent(_elementRef.nativeElement, 'input')
            .pipe(map($event => (/** @type {?} */ ($event.target)).value));
        this._resubscribeTypeahead = new BehaviorSubject(null);
        this._popupService = new PopupService(NgbTypeaheadWindow, _injector, _viewContainerRef, _renderer, componentFactoryResolver);
        this._zoneSubscription = ngZone.onStable.subscribe(() => {
            if (this.isPopupOpen()) {
                positionElements(this._elementRef.nativeElement, this._windowRef.location.nativeElement, this.placement, this.container === 'body');
            }
        });
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /** @type {?} */
        const inputValues$ = this._valueChanges.pipe(tap(value => {
            this._inputValueBackup = value;
            if (this.editable) {
                this._onChange(value);
            }
        }));
        /** @type {?} */
        const results$ = inputValues$.pipe(this.ngbTypeahead);
        /** @type {?} */
        const processedResults$ = results$.pipe(tap(() => {
            if (!this.editable) {
                this._onChange(undefined);
            }
        }));
        /** @type {?} */
        const userInput$ = this._resubscribeTypeahead.pipe(switchMap(() => processedResults$));
        this._subscription = this._subscribeToUserInput(userInput$);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this._closePopup();
        this._unsubscribeFromUserInput();
        this._zoneSubscription.unsubscribe();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) { this._onChange = fn; }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) { this._onTouched = fn; }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) { this._writeInputValue(this._formatItemForInput(value)); }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onDocumentClick(event) {
        if (event.target !== this._elementRef.nativeElement) {
            this.dismissPopup();
        }
    }
    /**
     * Dismisses typeahead popup window
     * @return {?}
     */
    dismissPopup() {
        if (this.isPopupOpen()) {
            this._closePopup();
            this._writeInputValue(this._inputValueBackup);
        }
    }
    /**
     * Returns true if the typeahead popup window is displayed
     * @return {?}
     */
    isPopupOpen() { return this._windowRef != null; }
    /**
     * @return {?}
     */
    handleBlur() {
        this._resubscribeTypeahead.next(null);
        this._onTouched();
    }
    /**
     * @param {?} event
     * @return {?}
     */
    handleKeyDown(event) {
        if (!this.isPopupOpen()) {
            return;
        }
        if (Key[toString(event.which)]) {
            switch (event.which) {
                case Key.ArrowDown:
                    event.preventDefault();
                    this._windowRef.instance.next();
                    this._showHint();
                    break;
                case Key.ArrowUp:
                    event.preventDefault();
                    this._windowRef.instance.prev();
                    this._showHint();
                    break;
                case Key.Enter:
                case Key.Tab:
                    /** @type {?} */
                    const result = this._windowRef.instance.getActive();
                    if (isDefined(result)) {
                        event.preventDefault();
                        event.stopPropagation();
                        this._selectResult(result);
                    }
                    this._closePopup();
                    break;
                case Key.Escape:
                    event.preventDefault();
                    this._resubscribeTypeahead.next(null);
                    this.dismissPopup();
                    break;
            }
        }
    }
    /**
     * @return {?}
     */
    _openPopup() {
        if (!this.isPopupOpen()) {
            this._inputValueBackup = this._elementRef.nativeElement.value;
            this._windowRef = this._popupService.open();
            this._windowRef.instance.id = this.popupId;
            this._windowRef.instance.selectEvent.subscribe((result) => this._selectResultClosePopup(result));
            this._windowRef.instance.activeChangeEvent.subscribe((activeId) => this.activeDescendant = activeId);
            if (this.container === 'body') {
                window.document.querySelector(this.container).appendChild(this._windowRef.location.nativeElement);
            }
        }
    }
    /**
     * @return {?}
     */
    _closePopup() {
        this._popupService.close();
        this._windowRef = null;
        this.activeDescendant = undefined;
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _selectResult(result) {
        /** @type {?} */
        let defaultPrevented = false;
        this.selectItem.emit({ item: result, preventDefault: () => { defaultPrevented = true; } });
        this._resubscribeTypeahead.next(null);
        if (!defaultPrevented) {
            this.writeValue(result);
            this._onChange(result);
        }
    }
    /**
     * @param {?} result
     * @return {?}
     */
    _selectResultClosePopup(result) {
        this._selectResult(result);
        this._closePopup();
    }
    /**
     * @return {?}
     */
    _showHint() {
        if (this.showHint && this._windowRef.instance.hasActive() && this._inputValueBackup != null) {
            /** @type {?} */
            const userInputLowerCase = this._inputValueBackup.toLowerCase();
            /** @type {?} */
            const formattedVal = this._formatItemForInput(this._windowRef.instance.getActive());
            if (userInputLowerCase === formattedVal.substr(0, this._inputValueBackup.length).toLowerCase()) {
                this._writeInputValue(this._inputValueBackup + formattedVal.substr(this._inputValueBackup.length));
                this._elementRef.nativeElement['setSelectionRange'].apply(this._elementRef.nativeElement, [this._inputValueBackup.length, formattedVal.length]);
            }
            else {
                this.writeValue(this._windowRef.instance.getActive());
            }
        }
    }
    /**
     * @param {?} item
     * @return {?}
     */
    _formatItemForInput(item) {
        return item != null && this.inputFormatter ? this.inputFormatter(item) : toString(item);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    _writeInputValue(value) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', toString(value));
    }
    /**
     * @param {?} userInput$
     * @return {?}
     */
    _subscribeToUserInput(userInput$) {
        return userInput$.subscribe((results) => {
            if (!results || results.length === 0) {
                this._closePopup();
            }
            else {
                this._openPopup();
                this._windowRef.instance.focusFirst = this.focusFirst;
                this._windowRef.instance.results = results;
                this._windowRef.instance.term = this._elementRef.nativeElement.value;
                if (this.resultFormatter) {
                    this._windowRef.instance.formatter = this.resultFormatter;
                }
                if (this.resultTemplate) {
                    this._windowRef.instance.resultTemplate = this.resultTemplate;
                }
                this._windowRef.instance.resetActive();
                // The observable stream we are subscribing to might have async steps
                // and if a component containing typeahead is using the OnPush strategy
                // the change detection turn wouldn't be invoked automatically.
                this._windowRef.changeDetectorRef.detectChanges();
                this._showHint();
            }
            /** @type {?} */
            const count = results ? results.length : 0;
            this._live.say(count === 0 ? 'No results available' : `${count} result${count === 1 ? '' : 's'} available`);
        });
    }
    /**
     * @return {?}
     */
    _unsubscribeFromUserInput() {
        if (this._subscription) {
            this._subscription.unsubscribe();
        }
        this._subscription = null;
    }
}
NgbTypeahead.decorators = [
    { type: Directive, args: [{
                selector: 'input[ngbTypeahead]',
                exportAs: 'ngbTypeahead',
                host: {
                    '(blur)': 'handleBlur()',
                    '[class.open]': 'isPopupOpen()',
                    '(document:click)': 'onDocumentClick($event)',
                    '(keydown)': 'handleKeyDown($event)',
                    '[autocomplete]': 'autocomplete',
                    'autocapitalize': 'off',
                    'autocorrect': 'off',
                    'role': 'combobox',
                    'aria-multiline': 'false',
                    '[attr.aria-autocomplete]': 'showHint ? "both" : "list"',
                    '[attr.aria-activedescendant]': 'activeDescendant',
                    '[attr.aria-owns]': 'isPopupOpen() ? popupId : null',
                    '[attr.aria-expanded]': 'isPopupOpen()'
                },
                providers: [NGB_TYPEAHEAD_VALUE_ACCESSOR]
            },] },
];
/** @nocollapse */
NgbTypeahead.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: Renderer2 },
    { type: Injector },
    { type: ComponentFactoryResolver },
    { type: NgbTypeaheadConfig },
    { type: NgZone },
    { type: Live }
];
NgbTypeahead.propDecorators = {
    autocomplete: [{ type: Input }],
    container: [{ type: Input }],
    editable: [{ type: Input }],
    focusFirst: [{ type: Input }],
    inputFormatter: [{ type: Input }],
    ngbTypeahead: [{ type: Input }],
    resultFormatter: [{ type: Input }],
    resultTemplate: [{ type: Input }],
    showHint: [{ type: Input }],
    placement: [{ type: Input }],
    selectItem: [{ type: Output }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgbTypeaheadModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbTypeaheadModule }; }
}
NgbTypeaheadModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgbTypeahead, NgbHighlight, NgbTypeaheadWindow],
                exports: [NgbTypeahead, NgbHighlight],
                imports: [CommonModule],
                entryComponents: [NgbTypeaheadWindow]
            },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const NGB_MODULES = [
    NgbAccordionModule, NgbAlertModule, NgbButtonsModule, NgbCarouselModule, NgbCollapseModule, NgbDatepickerModule,
    NgbDropdownModule, NgbModalModule, NgbPaginationModule, NgbPopoverModule, NgbProgressbarModule, NgbRatingModule,
    NgbTabsetModule, NgbTimepickerModule, NgbTooltipModule, NgbTypeaheadModule
];
/**
 * NgbRootModule is no longer necessary, you can simply import NgbModule
 * Will be removed in 4.0.0.
 *
 * @deprecated 3.0.0
 */
class NgbRootModule {
}
NgbRootModule.decorators = [
    { type: NgModule, args: [{ imports: [NGB_MODULES], exports: NGB_MODULES },] },
];
class NgbModule {
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    static forRoot() { return { ngModule: NgbRootModule }; }
}
NgbModule.decorators = [
    { type: NgModule, args: [{ imports: NGB_MODULES, exports: NGB_MODULES },] },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgbAccordionModule, NgbAccordionConfig, NgbAccordion, NgbPanel, NgbPanelTitle, NgbPanelContent, NgbAlertModule, NgbAlertConfig, NgbAlert, NgbButtonsModule, NgbCheckBox, NgbRadioGroup, NgbCarouselModule, NgbCarouselConfig, NgbCarousel, NgbSlide, NgbCollapseModule, NgbCollapse, NgbCalendar, NgbCalendarIslamicCivil, NgbCalendarIslamicUmalqura, NgbCalendarPersian, NgbDatepickerModule, NgbDatepickerI18n, NgbDatepickerConfig, NgbDate, NgbDateParserFormatter, NgbDateAdapter, NgbDateNativeAdapter, NgbDatepicker, NgbInputDatepicker, NgbDropdownModule, NgbDropdownConfig, NgbDropdown, NgbModalModule, NgbModal, NgbActiveModal, NgbModalRef, ModalDismissReasons, NgbPaginationModule, NgbPaginationConfig, NgbPagination, NgbPopoverModule, NgbPopoverConfig, NgbPopover, NgbProgressbarModule, NgbProgressbarConfig, NgbProgressbar, NgbRatingModule, NgbRatingConfig, NgbRating, NgbTabsetModule, NgbTabsetConfig, NgbTabset, NgbTab, NgbTabContent, NgbTabTitle, NgbTimepickerModule, NgbTimepickerConfig, NgbTimepicker, NgbTimeAdapter, NgbTooltipModule, NgbTooltipConfig, NgbTooltip, NgbHighlight, NgbTypeaheadModule, NgbTypeaheadConfig, NgbTypeahead, NgbRootModule, NgbModule, NgbButtonLabel as ɵa, NgbRadio as ɵb, NGB_CAROUSEL_DIRECTIVES as ɵc, NgbDateStructAdapter as ɵj, NgbDatepickerDayView as ɵf, NgbDatepickerI18nDefault as ɵi, NgbDatepickerKeyMapService as ɵt, NgbDatepickerMonthView as ɵe, NgbDatepickerNavigation as ɵg, NgbDatepickerNavigationSelect as ɵh, NgbDatepickerService as ɵs, NgbCalendarHijri as ɵbb, NgbCalendarGregorian as ɵd, NgbDateISOParserFormatter as ɵk, NgbDropdownAnchor as ɵm, NgbDropdownMenu as ɵl, NgbDropdownToggle as ɵn, NgbModalBackdrop as ɵu, NgbModalStack as ɵw, NgbModalWindow as ɵv, NgbPopoverWindow as ɵo, NgbTimeStructAdapter as ɵp, NgbTooltipWindow as ɵq, NgbTypeaheadWindow as ɵr, ARIA_LIVE_DELAY as ɵy, ARIA_LIVE_DELAY_FACTORY as ɵz, Live as ɵba, ContentRef as ɵbc, ScrollBar as ɵx };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctYm9vdHN0cmFwLmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC91dGlsL3V0aWwudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2FjY29yZGlvbi9hY2NvcmRpb24tY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9hY2NvcmRpb24vYWNjb3JkaW9uLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9hY2NvcmRpb24vYWNjb3JkaW9uLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvYWxlcnQvYWxlcnQtY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9hbGVydC9hbGVydC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvYWxlcnQvYWxlcnQubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL2xhYmVsLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL2NoZWNrYm94LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL3JhZGlvLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9idXR0b25zL2J1dHRvbnMubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9jYXJvdXNlbC9jYXJvdXNlbC1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2Nhcm91c2VsL2Nhcm91c2VsLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9jYXJvdXNlbC9jYXJvdXNlbC5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2NvbGxhcHNlL2NvbGxhcHNlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9jb2xsYXBzZS9jb2xsYXBzZS5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvbmdiLWRhdGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvbmdiLWNhbGVuZGFyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItdG9vbHMudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1pMThuLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItc2VydmljZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9rZXkudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1rZXltYXAtc2VydmljZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLXZpZXctbW9kZWwudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvYWRhcHRlcnMvbmdiLWRhdGUtYWRhcHRlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItbW9udGgtdmlldy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW5hdmlnYXRpb24udHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9wb3NpdGlvbmluZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdXRpbC9mb2N1cy10cmFwLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2RhdGVwaWNrZXItaW5wdXQudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci1kYXktdmlldy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2hpanJpL25nYi1jYWxlbmRhci1oaWpyaS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9oaWpyaS9uZ2ItY2FsZW5kYXItaXNsYW1pYy1jaXZpbC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9oaWpyaS9uZ2ItY2FsZW5kYXItaXNsYW1pYy11bWFscXVyYS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9hZGFwdGVycy9uZ2ItZGF0ZS1uYXRpdmUtYWRhcHRlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9qYWxhbGkvamFsYWxpLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kYXRlcGlja2VyL2phbGFsaS9uZ2ItY2FsZW5kYXItcGVyc2lhbi50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZGF0ZXBpY2tlci9kYXRlcGlja2VyLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZHJvcGRvd24vZHJvcGRvd24tY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9kcm9wZG93bi9kcm9wZG93bi50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC1iYWNrZHJvcC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvbW9kYWwvbW9kYWwtZGlzbWlzcy1yZWFzb25zLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC13aW5kb3cudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvcG9wdXAudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvc2Nyb2xsYmFyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC1yZWYudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL21vZGFsL21vZGFsLXN0YWNrLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9tb2RhbC9tb2RhbC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvbW9kYWwvbW9kYWwubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9wYWdpbmF0aW9uL3BhZ2luYXRpb24tY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9wYWdpbmF0aW9uL3BhZ2luYXRpb24udHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvdHJpZ2dlcnMudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3BvcG92ZXIvcG9wb3Zlci1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3BvcG92ZXIvcG9wb3Zlci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcG9wb3Zlci9wb3BvdmVyLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXItY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9wcm9ncmVzc2Jhci9wcm9ncmVzc2Jhci50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIubW9kdWxlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9yYXRpbmcvcmF0aW5nLWNvbmZpZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcmF0aW5nL3JhdGluZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvcmF0aW5nL3JhdGluZy5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3RhYnNldC90YWJzZXQtY29uZmlnLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90YWJzZXQvdGFic2V0LnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90YWJzZXQvdGFic2V0Lm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdGltZXBpY2tlci9uZ2ItdGltZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdGltZXBpY2tlci90aW1lcGlja2VyLWNvbmZpZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdGltZXBpY2tlci9uZ2ItdGltZS1hZGFwdGVyLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90aW1lcGlja2VyL3RpbWVwaWNrZXIudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3RpbWVwaWNrZXIvdGltZXBpY2tlci5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3Rvb2x0aXAvdG9vbHRpcC1jb25maWcudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3Rvb2x0aXAvdG9vbHRpcC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdG9vbHRpcC90b29sdGlwLm1vZHVsZS50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdHlwZWFoZWFkL2hpZ2hsaWdodC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdHlwZWFoZWFkL3R5cGVhaGVhZC13aW5kb3cudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL3V0aWwvYWNjZXNzaWJpbGl0eS9saXZlLnRzIiwibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC90eXBlYWhlYWQvdHlwZWFoZWFkLWNvbmZpZy50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdHlwZWFoZWFkL3R5cGVhaGVhZC50cyIsIm5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvdHlwZWFoZWFkL3R5cGVhaGVhZC5tb2R1bGUudHMiLCJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB0b0ludGVnZXIodmFsdWU6IGFueSk6IG51bWJlciB7XG4gIHJldHVybiBwYXJzZUludChgJHt2YWx1ZX1gLCAxMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0b1N0cmluZyh2YWx1ZTogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsKSA/IGAke3ZhbHVlfWAgOiAnJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFZhbHVlSW5SYW5nZSh2YWx1ZTogbnVtYmVyLCBtYXg6IG51bWJlciwgbWluID0gMCk6IG51bWJlciB7XG4gIHJldHVybiBNYXRoLm1heChNYXRoLm1pbih2YWx1ZSwgbWF4KSwgbWluKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBzdHJpbmcge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtYmVyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuICByZXR1cm4gIWlzTmFOKHRvSW50ZWdlcih2YWx1ZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbnRlZ2VyKHZhbHVlOiBhbnkpOiB2YWx1ZSBpcyBudW1iZXIge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWx1ZSkgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNEZWZpbmVkKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYWROdW1iZXIodmFsdWU6IG51bWJlcikge1xuICBpZiAoaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgcmV0dXJuIGAwJHt2YWx1ZX1gLnNsaWNlKC0yKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZ0V4cEVzY2FwZSh0ZXh0KSB7XG4gIHJldHVybiB0ZXh0LnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uLFxcXFxeJHwjXFxzXS9nLCAnXFxcXCQmJyk7XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYkFjY29yZGlvbiBjb21wb25lbnQuXG4gKiBZb3UgY2FuIGluamVjdCB0aGlzIHNlcnZpY2UsIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgY29tcG9uZW50LCBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW5cbiAqIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCB0aGUgYWNjb3JkaW9ucyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uQ29uZmlnIHtcbiAgY2xvc2VPdGhlcnMgPSBmYWxzZTtcbiAgdHlwZTogc3RyaW5nO1xufVxuIiwiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge2lzU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5pbXBvcnQge05nYkFjY29yZGlvbkNvbmZpZ30gZnJvbSAnLi9hY2NvcmRpb24tY29uZmlnJztcblxubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgc2hvdWxkIGJlIHVzZWQgdG8gd3JhcCBhY2NvcmRpb24gcGFuZWwgdGl0bGVzIHRoYXQgbmVlZCB0byBjb250YWluIEhUTUwgbWFya3VwIG9yIG90aGVyIGRpcmVjdGl2ZXMuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFuZWxUaXRsZV0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYW5lbFRpdGxlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIFRoaXMgZGlyZWN0aXZlIG11c3QgYmUgdXNlZCB0byB3cmFwIGFjY29yZGlvbiBwYW5lbCBjb250ZW50LlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlBhbmVsQ29udGVudF0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYW5lbENvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogVGhlIE5nYlBhbmVsIGRpcmVjdGl2ZSByZXByZXNlbnRzIGFuIGluZGl2aWR1YWwgcGFuZWwgd2l0aCB0aGUgdGl0bGUgYW5kIGNvbGxhcHNpYmxlXG4gKiBjb250ZW50XG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmdiLXBhbmVsJ30pXG5leHBvcnQgY2xhc3MgTmdiUGFuZWwgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkIHtcbiAgLyoqXG4gICAqICBBIGZsYWcgZGV0ZXJtaW5pbmcgd2hldGhlciB0aGUgcGFuZWwgaXMgZGlzYWJsZWQgb3Igbm90LlxuICAgKiAgV2hlbiBkaXNhYmxlZCwgdGhlIHBhbmVsIGNhbm5vdCBiZSB0b2dnbGVkLlxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQgPSBmYWxzZTtcblxuICAvKipcbiAgICogIEFuIG9wdGlvbmFsIGlkIGZvciB0aGUgcGFuZWwuIFRoZSBpZCBzaG91bGQgYmUgdW5pcXVlLlxuICAgKiAgSWYgbm90IHByb3ZpZGVkLCBpdCB3aWxsIGJlIGF1dG8tZ2VuZXJhdGVkLlxuICAgKi9cbiAgQElucHV0KCkgaWQgPSBgbmdiLXBhbmVsLSR7bmV4dElkKyt9YDtcblxuICAvKipcbiAgICogQSBmbGFnIHRlbGxpbmcgaWYgdGhlIHBhbmVsIGlzIGN1cnJlbnRseSBvcGVuXG4gICAqL1xuICBpc09wZW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogIFRoZSB0aXRsZSBmb3IgdGhlIHBhbmVsLlxuICAgKi9cbiAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcblxuICAvKipcbiAgICogIEFjY29yZGlvbidzIHR5cGVzIG9mIHBhbmVscyB0byBiZSBhcHBsaWVkIHBlciBwYW5lbCBiYXNpcy5cbiAgICogIEJvb3RzdHJhcCByZWNvZ25pemVzIHRoZSBmb2xsb3dpbmcgdHlwZXM6IFwicHJpbWFyeVwiLCBcInNlY29uZGFyeVwiLCBcInN1Y2Nlc3NcIiwgXCJkYW5nZXJcIiwgXCJ3YXJuaW5nXCIsIFwiaW5mb1wiLCBcImxpZ2h0XCJcbiAgICogYW5kIFwiZGFya1wiXG4gICAqL1xuICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cbiAgdGl0bGVUcGw6IE5nYlBhbmVsVGl0bGUgfCBudWxsO1xuICBjb250ZW50VHBsOiBOZ2JQYW5lbENvbnRlbnQgfCBudWxsO1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiUGFuZWxUaXRsZSwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIHRpdGxlVHBsczogUXVlcnlMaXN0PE5nYlBhbmVsVGl0bGU+O1xuICBAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsQ29udGVudCwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIGNvbnRlbnRUcGxzOiBRdWVyeUxpc3Q8TmdiUGFuZWxDb250ZW50PjtcblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gV2UgYXJlIHVzaW5nIEBDb250ZW50Q2hpbGRyZW4gaW5zdGVhZCBvZiBAQ29udGFudENoaWxkIGFzIGluIHRoZSBBbmd1bGFyIHZlcnNpb24gYmVpbmcgdXNlZFxuICAgIC8vIG9ubHkgQENvbnRlbnRDaGlsZHJlbiBhbGxvd3MgdXMgdG8gc3BlY2lmeSB0aGUge2Rlc2NlbmRhbnRzOiBmYWxzZX0gb3B0aW9uLlxuICAgIC8vIFdpdGhvdXQge2Rlc2NlbmRhbnRzOiBmYWxzZX0gd2UgYXJlIGhpdHRpbmcgYnVncyBkZXNjcmliZWQgaW46XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvaXNzdWVzLzIyNDBcbiAgICB0aGlzLnRpdGxlVHBsID0gdGhpcy50aXRsZVRwbHMuZmlyc3Q7XG4gICAgdGhpcy5jb250ZW50VHBsID0gdGhpcy5jb250ZW50VHBscy5maXJzdDtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBjaGFuZ2UgZXZlbnQgZmlyZWQgcmlnaHQgYmVmb3JlIHRvZ2dsaW5nIGFuIGFjY29yZGlvbiBwYW5lbFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlBhbmVsQ2hhbmdlRXZlbnQge1xuICAvKipcbiAgICogSWQgb2YgdGhlIGFjY29yZGlvbiBwYW5lbCB0aGF0IGlzIHRvZ2dsZWRcbiAgICovXG4gIHBhbmVsSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgcGFuZWwgd2lsbCBiZSBvcGVuZWQgKHRydWUpIG9yIGNsb3NlZCAoZmFsc2UpXG4gICAqL1xuICBuZXh0U3RhdGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEZ1bmN0aW9uIHRoYXQgd2lsbCBwcmV2ZW50IHBhbmVsIHRvZ2dsaW5nIGlmIGNhbGxlZFxuICAgKi9cbiAgcHJldmVudERlZmF1bHQ6ICgpID0+IHZvaWQ7XG59XG5cbi8qKlxuICogVGhlIE5nYkFjY29yZGlvbiBkaXJlY3RpdmUgaXMgYSBjb2xsZWN0aW9uIG9mIHBhbmVscy5cbiAqIEl0IGNhbiBhc3N1cmUgdGhhdCBvbmx5IG9uZSBwYW5lbCBjYW4gYmUgb3BlbmVkIGF0IGEgdGltZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWFjY29yZGlvbicsXG4gIGV4cG9ydEFzOiAnbmdiQWNjb3JkaW9uJyxcbiAgaG9zdDogeydjbGFzcyc6ICdhY2NvcmRpb24nLCAncm9sZSc6ICd0YWJsaXN0JywgJ1thdHRyLmFyaWEtbXVsdGlzZWxlY3RhYmxlXSc6ICchY2xvc2VPdGhlclBhbmVscyd9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtcGFuZWwgW25nRm9yT2ZdPVwicGFuZWxzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2FyZFwiPlxuICAgICAgICA8ZGl2IHJvbGU9XCJ0YWJcIiBpZD1cInt7cGFuZWwuaWR9fS1oZWFkZXJcIiBbY2xhc3NdPVwiJ2NhcmQtaGVhZGVyICcgKyAocGFuZWwudHlwZSA/ICdiZy0nK3BhbmVsLnR5cGU6IHR5cGUgPyAnYmctJyt0eXBlIDogJycpXCI+XG4gICAgICAgICAgPGg1IGNsYXNzPVwibWItMFwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tbGlua1wiIChjbGljayk9XCIhIXRvZ2dsZShwYW5lbC5pZClcIiBbZGlzYWJsZWRdPVwicGFuZWwuZGlzYWJsZWRcIiBbY2xhc3MuY29sbGFwc2VkXT1cIiFwYW5lbC5pc09wZW5cIlxuICAgICAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cInBhbmVsLmlzT3BlblwiIFthdHRyLmFyaWEtY29udHJvbHNdPVwicGFuZWwuaWRcIj5cbiAgICAgICAgICAgICAge3twYW5lbC50aXRsZX19PG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhbmVsLnRpdGxlVHBsPy50ZW1wbGF0ZVJlZlwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L2g1PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBpZD1cInt7cGFuZWwuaWR9fVwiIHJvbGU9XCJ0YWJwYW5lbFwiIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJwYW5lbC5pZCArICctaGVhZGVyJ1wiXG4gICAgICAgICAgICAgY2xhc3M9XCJjb2xsYXBzZVwiIFtjbGFzcy5zaG93XT1cInBhbmVsLmlzT3BlblwiICpuZ0lmPVwiIWRlc3Ryb3lPbkhpZGUgfHwgcGFuZWwuaXNPcGVuXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtYm9keVwiPlxuICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cInBhbmVsLmNvbnRlbnRUcGw/LnRlbXBsYXRlUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQge1xuICBAQ29udGVudENoaWxkcmVuKE5nYlBhbmVsKSBwYW5lbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbD47XG5cbiAgLyoqXG4gICAqIEFuIGFycmF5IG9yIGNvbW1hIHNlcGFyYXRlZCBzdHJpbmdzIG9mIHBhbmVsIGlkZW50aWZpZXJzIHRoYXQgc2hvdWxkIGJlIG9wZW5lZFxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlSWRzOiBzdHJpbmcgfCBzdHJpbmdbXSA9IFtdO1xuXG4gIC8qKlxuICAgKiAgV2hldGhlciB0aGUgb3RoZXIgcGFuZWxzIHNob3VsZCBiZSBjbG9zZWQgd2hlbiBhIHBhbmVsIGlzIG9wZW5lZFxuICAgKi9cbiAgQElucHV0KCdjbG9zZU90aGVycycpIGNsb3NlT3RoZXJQYW5lbHM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNsb3NlZCBwYW5lbHMgc2hvdWxkIGJlIGhpZGRlbiB3aXRob3V0IGRlc3Ryb3lpbmcgdGhlbVxuICAgKi9cbiAgQElucHV0KCkgZGVzdHJveU9uSGlkZSA9IHRydWU7XG5cbiAgLyoqXG4gICAqICBBY2NvcmRpb24ncyB0eXBlcyBvZiBwYW5lbHMgdG8gYmUgYXBwbGllZCBnbG9iYWxseS5cbiAgICogIEJvb3RzdHJhcCByZWNvZ25pemVzIHRoZSBmb2xsb3dpbmcgdHlwZXM6IFwicHJpbWFyeVwiLCBcInNlY29uZGFyeVwiLCBcInN1Y2Nlc3NcIiwgXCJkYW5nZXJcIiwgXCJ3YXJuaW5nXCIsIFwiaW5mb1wiLCBcImxpZ2h0XCJcbiAgICogYW5kIFwiZGFya1xuICAgKi9cbiAgQElucHV0KCkgdHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHBhbmVsIGNoYW5nZSBldmVudCBmaXJlZCByaWdodCBiZWZvcmUgdGhlIHBhbmVsIHRvZ2dsZSBoYXBwZW5zLiBTZWUgTmdiUGFuZWxDaGFuZ2VFdmVudCBmb3IgcGF5bG9hZCBkZXRhaWxzXG4gICAqL1xuICBAT3V0cHV0KCkgcGFuZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlBhbmVsQ2hhbmdlRXZlbnQ+KCk7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JBY2NvcmRpb25Db25maWcpIHtcbiAgICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgICB0aGlzLmNsb3NlT3RoZXJQYW5lbHMgPSBjb25maWcuY2xvc2VPdGhlcnM7XG4gIH1cblxuICAvKipcbiAgICogUHJvZ3JhbW1hdGljYWxseSB0b2dnbGUgYSBwYW5lbCB3aXRoIGEgZ2l2ZW4gaWQuXG4gICAqL1xuICB0b2dnbGUocGFuZWxJZDogc3RyaW5nKSB7XG4gICAgY29uc3QgcGFuZWwgPSB0aGlzLnBhbmVscy5maW5kKHAgPT4gcC5pZCA9PT0gcGFuZWxJZCk7XG5cbiAgICBpZiAocGFuZWwgJiYgIXBhbmVsLmRpc2FibGVkKSB7XG4gICAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnBhbmVsQ2hhbmdlLmVtaXQoXG4gICAgICAgICAge3BhbmVsSWQ6IHBhbmVsSWQsIG5leHRTdGF0ZTogIXBhbmVsLmlzT3BlbiwgcHJldmVudERlZmF1bHQ6ICgpID0+IHsgZGVmYXVsdFByZXZlbnRlZCA9IHRydWU7IH19KTtcblxuICAgICAgaWYgKCFkZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgIHBhbmVsLmlzT3BlbiA9ICFwYW5lbC5pc09wZW47XG5cbiAgICAgICAgaWYgKHRoaXMuY2xvc2VPdGhlclBhbmVscykge1xuICAgICAgICAgIHRoaXMuX2Nsb3NlT3RoZXJzKHBhbmVsSWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkcygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBhY3RpdmUgaWQgdXBkYXRlc1xuICAgIGlmIChpc1N0cmluZyh0aGlzLmFjdGl2ZUlkcykpIHtcbiAgICAgIHRoaXMuYWN0aXZlSWRzID0gdGhpcy5hY3RpdmVJZHMuc3BsaXQoL1xccyosXFxzKi8pO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBwYW5lbHMgb3BlbiBzdGF0ZXNcbiAgICB0aGlzLnBhbmVscy5mb3JFYWNoKHBhbmVsID0+IHBhbmVsLmlzT3BlbiA9ICFwYW5lbC5kaXNhYmxlZCAmJiB0aGlzLmFjdGl2ZUlkcy5pbmRleE9mKHBhbmVsLmlkKSA+IC0xKTtcblxuICAgIC8vIGNsb3NlT3RoZXJzIHVwZGF0ZXNcbiAgICBpZiAodGhpcy5hY3RpdmVJZHMubGVuZ3RoID4gMSAmJiB0aGlzLmNsb3NlT3RoZXJQYW5lbHMpIHtcbiAgICAgIHRoaXMuX2Nsb3NlT3RoZXJzKHRoaXMuYWN0aXZlSWRzWzBdKTtcbiAgICAgIHRoaXMuX3VwZGF0ZUFjdGl2ZUlkcygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlT3RoZXJzKHBhbmVsSWQ6IHN0cmluZykge1xuICAgIHRoaXMucGFuZWxzLmZvckVhY2gocGFuZWwgPT4ge1xuICAgICAgaWYgKHBhbmVsLmlkICE9PSBwYW5lbElkKSB7XG4gICAgICAgIHBhbmVsLmlzT3BlbiA9IGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlQWN0aXZlSWRzKCkge1xuICAgIHRoaXMuYWN0aXZlSWRzID0gdGhpcy5wYW5lbHMuZmlsdGVyKHBhbmVsID0+IHBhbmVsLmlzT3BlbiAmJiAhcGFuZWwuZGlzYWJsZWQpLm1hcChwYW5lbCA9PiBwYW5lbC5pZCk7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiQWNjb3JkaW9uLCBOZ2JQYW5lbCwgTmdiUGFuZWxUaXRsZSwgTmdiUGFuZWxDb250ZW50fSBmcm9tICcuL2FjY29yZGlvbic7XG5cbmV4cG9ydCB7TmdiQWNjb3JkaW9uLCBOZ2JQYW5lbCwgTmdiUGFuZWxUaXRsZSwgTmdiUGFuZWxDb250ZW50LCBOZ2JQYW5lbENoYW5nZUV2ZW50fSBmcm9tICcuL2FjY29yZGlvbic7XG5leHBvcnQge05nYkFjY29yZGlvbkNvbmZpZ30gZnJvbSAnLi9hY2NvcmRpb24tY29uZmlnJztcblxuY29uc3QgTkdCX0FDQ09SRElPTl9ESVJFQ1RJVkVTID0gW05nYkFjY29yZGlvbiwgTmdiUGFuZWwsIE5nYlBhbmVsVGl0bGUsIE5nYlBhbmVsQ29udGVudF07XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBOR0JfQUNDT1JESU9OX0RJUkVDVElWRVMsIGV4cG9ydHM6IE5HQl9BQ0NPUkRJT05fRElSRUNUSVZFUywgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYkFjY29yZGlvbk1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JBY2NvcmRpb25Nb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYkFsZXJ0IGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBhbGVydHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYkFsZXJ0Q29uZmlnIHtcbiAgZGlzbWlzc2libGUgPSB0cnVlO1xuICB0eXBlID0gJ3dhcm5pbmcnO1xufVxuIiwiaW1wb3J0IHtcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBSZW5kZXJlcjIsXG4gIEVsZW1lbnRSZWYsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYkFsZXJ0Q29uZmlnfSBmcm9tICcuL2FsZXJ0LWNvbmZpZyc7XG5cbi8qKlxuICogQWxlcnRzIGNhbiBiZSB1c2VkIHRvIHByb3ZpZGUgZmVlZGJhY2sgbWVzc2FnZXMuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1hbGVydCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7J3JvbGUnOiAnYWxlcnQnLCAnY2xhc3MnOiAnYWxlcnQnLCAnW2NsYXNzLmFsZXJ0LWRpc21pc3NpYmxlXSc6ICdkaXNtaXNzaWJsZSd9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxidXR0b24gKm5nSWY9XCJkaXNtaXNzaWJsZVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IuYWxlcnQuY2xvc2VcIlxuICAgICAgKGNsaWNrKT1cImNsb3NlSGFuZGxlcigpXCI+XG4gICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj4mdGltZXM7PC9zcGFuPlxuICAgIDwvYnV0dG9uPlxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICBgLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuICBgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JBbGVydCBpbXBsZW1lbnRzIE9uSW5pdCxcbiAgICBPbkNoYW5nZXMge1xuICAvKipcbiAgICogQSBmbGFnIGluZGljYXRpbmcgaWYgYSBnaXZlbiBhbGVydCBjYW4gYmUgZGlzbWlzc2VkIChjbG9zZWQpIGJ5IGEgdXNlci4gSWYgdGhpcyBmbGFnIGlzIHNldCwgYSBjbG9zZSBidXR0b24gKGluIGFcbiAgICogZm9ybSBvZiBhbiDDg8KXKSB3aWxsIGJlIGRpc3BsYXllZC5cbiAgICovXG4gIEBJbnB1dCgpIGRpc21pc3NpYmxlOiBib29sZWFuO1xuICAvKipcbiAgICogQWxlcnQgdHlwZSAoQ1NTIGNsYXNzKS4gQm9vdHN0cmFwIDQgcmVjb2duaXplcyB0aGUgZm9sbG93aW5nIHR5cGVzOiBcInN1Y2Nlc3NcIiwgXCJpbmZvXCIsIFwid2FybmluZ1wiLCBcImRhbmdlclwiLFxuICAgKiBcInByaW1hcnlcIiwgXCJzZWNvbmRhcnlcIiwgXCJsaWdodFwiLCBcImRhcmtcIi5cbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiB0aGUgY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQuIFRoaXMgZXZlbnQgaGFzIG5vIHBheWxvYWQuIE9ubHkgcmVsZXZhbnQgZm9yIGRpc21pc3NpYmxlIGFsZXJ0cy5cbiAgICovXG4gIEBPdXRwdXQoKSBjbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYkFsZXJ0Q29uZmlnLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmKSB7XG4gICAgdGhpcy5kaXNtaXNzaWJsZSA9IGNvbmZpZy5kaXNtaXNzaWJsZTtcbiAgICB0aGlzLnR5cGUgPSBjb25maWcudHlwZTtcbiAgfVxuXG4gIGNsb3NlSGFuZGxlcigpIHsgdGhpcy5jbG9zZS5lbWl0KG51bGwpOyB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHR5cGVDaGFuZ2UgPSBjaGFuZ2VzWyd0eXBlJ107XG4gICAgaWYgKHR5cGVDaGFuZ2UgJiYgIXR5cGVDaGFuZ2UuZmlyc3RDaGFuZ2UpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgYGFsZXJ0LSR7dHlwZUNoYW5nZS5wcmV2aW91c1ZhbHVlfWApO1xuICAgICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBgYWxlcnQtJHt0eXBlQ2hhbmdlLmN1cnJlbnRWYWx1ZX1gKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpIHsgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCBgYWxlcnQtJHt0aGlzLnR5cGV9YCk7IH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiQWxlcnR9IGZyb20gJy4vYWxlcnQnO1xuXG5leHBvcnQge05nYkFsZXJ0fSBmcm9tICcuL2FsZXJ0JztcbmV4cG9ydCB7TmdiQWxlcnRDb25maWd9IGZyb20gJy4vYWxlcnQtY29uZmlnJztcblxuQE5nTW9kdWxlKHtkZWNsYXJhdGlvbnM6IFtOZ2JBbGVydF0sIGV4cG9ydHM6IFtOZ2JBbGVydF0sIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLCBlbnRyeUNvbXBvbmVudHM6IFtOZ2JBbGVydF19KVxuZXhwb3J0IGNsYXNzIE5nYkFsZXJ0TW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYkFsZXJ0TW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtEaXJlY3RpdmV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiQnV0dG9uTGFiZWxdJyxcbiAgaG9zdDpcbiAgICAgIHsnW2NsYXNzLmJ0bl0nOiAndHJ1ZScsICdbY2xhc3MuYWN0aXZlXSc6ICdhY3RpdmUnLCAnW2NsYXNzLmRpc2FibGVkXSc6ICdkaXNhYmxlZCcsICdbY2xhc3MuZm9jdXNdJzogJ2ZvY3VzZWQnfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JCdXR0b25MYWJlbCB7XG4gIGFjdGl2ZTogYm9vbGVhbjtcbiAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIGZvY3VzZWQ6IGJvb2xlYW47XG59XG4iLCJpbXBvcnQge0RpcmVjdGl2ZSwgZm9yd2FyZFJlZiwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHtOZ2JCdXR0b25MYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5cbmNvbnN0IE5HQl9DSEVDS0JPWF9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYkNoZWNrQm94KSxcbiAgbXVsdGk6IHRydWVcbn07XG5cblxuLyoqXG4gKiBFYXNpbHkgY3JlYXRlIEJvb3RzdHJhcC1zdHlsZSBjaGVja2JveCBidXR0b25zLiBBIHZhbHVlIG9mIGEgY2hlY2tlZCBidXR0b24gaXMgYm91bmQgdG8gYSB2YXJpYWJsZVxuICogc3BlY2lmaWVkIHZpYSBuZ01vZGVsLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiQnV0dG9uXVt0eXBlPWNoZWNrYm94XScsXG4gIGhvc3Q6IHtcbiAgICAnYXV0b2NvbXBsZXRlJzogJ29mZicsXG4gICAgJ1tjaGVja2VkXSc6ICdjaGVja2VkJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCcsXG4gICAgJyhjaGFuZ2UpJzogJ29uSW5wdXRDaGFuZ2UoJGV2ZW50KScsXG4gICAgJyhmb2N1cyknOiAnZm9jdXNlZCA9IHRydWUnLFxuICAgICcoYmx1ciknOiAnZm9jdXNlZCA9IGZhbHNlJ1xuICB9LFxuICBwcm92aWRlcnM6IFtOR0JfQ0hFQ0tCT1hfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE5nYkNoZWNrQm94IGltcGxlbWVudHMgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBjaGVja2VkO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiBhIGdpdmVuIGNoZWNrYm94IGJ1dHRvbiBpcyBkaXNhYmxlZC5cbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFZhbHVlIHRvIGJlIHByb3BhZ2F0ZWQgYXMgbW9kZWwgd2hlbiB0aGUgY2hlY2tib3ggaXMgY2hlY2tlZC5cbiAgICovXG4gIEBJbnB1dCgpIHZhbHVlQ2hlY2tlZCA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFZhbHVlIHRvIGJlIHByb3BhZ2F0ZWQgYXMgbW9kZWwgd2hlbiB0aGUgY2hlY2tib3ggaXMgdW5jaGVja2VkLlxuICAgKi9cbiAgQElucHV0KCkgdmFsdWVVbkNoZWNrZWQgPSBmYWxzZTtcblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBzZXQgZm9jdXNlZChpc0ZvY3VzZWQ6IGJvb2xlYW4pIHtcbiAgICB0aGlzLl9sYWJlbC5mb2N1c2VkID0gaXNGb2N1c2VkO1xuICAgIGlmICghaXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2xhYmVsOiBOZ2JCdXR0b25MYWJlbCkge31cblxuICBvbklucHV0Q2hhbmdlKCRldmVudCkge1xuICAgIGNvbnN0IG1vZGVsVG9Qcm9wYWdhdGUgPSAkZXZlbnQudGFyZ2V0LmNoZWNrZWQgPyB0aGlzLnZhbHVlQ2hlY2tlZCA6IHRoaXMudmFsdWVVbkNoZWNrZWQ7XG4gICAgdGhpcy5vbkNoYW5nZShtb2RlbFRvUHJvcGFnYXRlKTtcbiAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgIHRoaXMud3JpdGVWYWx1ZShtb2RlbFRvUHJvcGFnYXRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5fbGFiZWwuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuY2hlY2tlZCA9IHZhbHVlID09PSB0aGlzLnZhbHVlQ2hlY2tlZDtcbiAgICB0aGlzLl9sYWJlbC5hY3RpdmUgPSB0aGlzLmNoZWNrZWQ7XG4gIH1cbn1cbiIsImltcG9ydCB7RGlyZWN0aXZlLCBmb3J3YXJkUmVmLCBJbnB1dCwgUmVuZGVyZXIyLCBFbGVtZW50UmVmLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHtOZ2JCdXR0b25MYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5cbmNvbnN0IE5HQl9SQURJT19WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYlJhZGlvR3JvdXApLFxuICBtdWx0aTogdHJ1ZVxufTtcblxubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogRWFzaWx5IGNyZWF0ZSBCb290c3RyYXAtc3R5bGUgcmFkaW8gYnV0dG9ucy4gQSB2YWx1ZSBvZiBhIHNlbGVjdGVkIGJ1dHRvbiBpcyBib3VuZCB0byBhIHZhcmlhYmxlXG4gKiBzcGVjaWZpZWQgdmlhIG5nTW9kZWwuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYlJhZGlvR3JvdXBdJywgaG9zdDogeydyb2xlJzogJ2dyb3VwJ30sIHByb3ZpZGVyczogW05HQl9SQURJT19WQUxVRV9BQ0NFU1NPUl19KVxuZXhwb3J0IGNsYXNzIE5nYlJhZGlvR3JvdXAgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHByaXZhdGUgX3JhZGlvczogU2V0PE5nYlJhZGlvPiA9IG5ldyBTZXQ8TmdiUmFkaW8+KCk7XG4gIHByaXZhdGUgX3ZhbHVlID0gbnVsbDtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgZ2V0IGRpc2FibGVkKCkgeyByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7IH1cbiAgc2V0IGRpc2FibGVkKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHsgdGhpcy5zZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQpOyB9XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBncm91cC4gVW5sZXNzIGVuY2xvc2VkIGlucHV0cyBzcGVjaWZ5IGEgbmFtZSwgdGhpcyBuYW1lIGlzIHVzZWQgYXMgdGhlIG5hbWUgb2YgdGhlXG4gICAqIGVuY2xvc2VkIGlucHV0cy4gSWYgbm90IHNwZWNpZmllZCwgYSBuYW1lIGlzIGdlbmVyYXRlZCBhdXRvbWF0aWNhbGx5LlxuICAgKi9cbiAgQElucHV0KCkgbmFtZSA9IGBuZ2ItcmFkaW8tJHtuZXh0SWQrK31gO1xuXG4gIG9uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIG9uVG91Y2hlZCA9ICgpID0+IHt9O1xuXG4gIG9uUmFkaW9DaGFuZ2UocmFkaW86IE5nYlJhZGlvKSB7XG4gICAgdGhpcy53cml0ZVZhbHVlKHJhZGlvLnZhbHVlKTtcbiAgICB0aGlzLm9uQ2hhbmdlKHJhZGlvLnZhbHVlKTtcbiAgfVxuXG4gIG9uUmFkaW9WYWx1ZVVwZGF0ZSgpIHsgdGhpcy5fdXBkYXRlUmFkaW9zVmFsdWUoKTsgfVxuXG4gIHJlZ2lzdGVyKHJhZGlvOiBOZ2JSYWRpbykgeyB0aGlzLl9yYWRpb3MuYWRkKHJhZGlvKTsgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICAgIHRoaXMuX3VwZGF0ZVJhZGlvc0Rpc2FibGVkKCk7XG4gIH1cblxuICB1bnJlZ2lzdGVyKHJhZGlvOiBOZ2JSYWRpbykgeyB0aGlzLl9yYWRpb3MuZGVsZXRlKHJhZGlvKTsgfVxuXG4gIHdyaXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuX3VwZGF0ZVJhZGlvc1ZhbHVlKCk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVSYWRpb3NWYWx1ZSgpIHsgdGhpcy5fcmFkaW9zLmZvckVhY2goKHJhZGlvKSA9PiByYWRpby51cGRhdGVWYWx1ZSh0aGlzLl92YWx1ZSkpOyB9XG4gIHByaXZhdGUgX3VwZGF0ZVJhZGlvc0Rpc2FibGVkKCkgeyB0aGlzLl9yYWRpb3MuZm9yRWFjaCgocmFkaW8pID0+IHJhZGlvLnVwZGF0ZURpc2FibGVkKCkpOyB9XG59XG5cblxuLyoqXG4gKiBNYXJrcyBhbiBpbnB1dCBvZiB0eXBlIFwicmFkaW9cIiBhcyBwYXJ0IG9mIHRoZSBOZ2JSYWRpb0dyb3VwLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiQnV0dG9uXVt0eXBlPXJhZGlvXScsXG4gIGhvc3Q6IHtcbiAgICAnW2NoZWNrZWRdJzogJ2NoZWNrZWQnLFxuICAgICdbZGlzYWJsZWRdJzogJ2Rpc2FibGVkJyxcbiAgICAnW25hbWVdJzogJ25hbWVBdHRyJyxcbiAgICAnKGNoYW5nZSknOiAnb25DaGFuZ2UoKScsXG4gICAgJyhmb2N1cyknOiAnZm9jdXNlZCA9IHRydWUnLFxuICAgICcoYmx1ciknOiAnZm9jdXNlZCA9IGZhbHNlJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE5nYlJhZGlvIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfY2hlY2tlZDogYm9vbGVhbjtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQ6IGJvb2xlYW47XG4gIHByaXZhdGUgX3ZhbHVlOiBhbnkgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgaW5wdXQuIEFsbCBpbnB1dHMgb2YgYSBncm91cCBzaG91bGQgaGF2ZSB0aGUgc2FtZSBuYW1lLiBJZiBub3Qgc3BlY2lmaWVkLFxuICAgKiB0aGUgbmFtZSBvZiB0aGUgZW5jbG9zaW5nIGdyb3VwIGlzIHVzZWQuXG4gICAqL1xuICBASW5wdXQoKSBuYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFlvdSBjYW4gc3BlY2lmeSBtb2RlbCB2YWx1ZSBvZiBhIGdpdmVuIHJhZGlvIGJ5IGJpbmRpbmcgdG8gdGhlIHZhbHVlIHByb3BlcnR5LlxuICAgKi9cbiAgQElucHV0KCd2YWx1ZScpXG4gIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ3ZhbHVlJywgc3RyaW5nVmFsdWUpO1xuICAgIHRoaXMuX2dyb3VwLm9uUmFkaW9WYWx1ZVVwZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIGEgZ2l2ZW4gcmFkaW8gYnV0dG9uIGlzIGRpc2FibGVkLlxuICAgKi9cbiAgQElucHV0KCdkaXNhYmxlZCcpXG4gIHNldCBkaXNhYmxlZChpc0Rpc2FibGVkOiBib29sZWFuKSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSBpc0Rpc2FibGVkICE9PSBmYWxzZTtcbiAgICB0aGlzLnVwZGF0ZURpc2FibGVkKCk7XG4gIH1cblxuICBzZXQgZm9jdXNlZChpc0ZvY3VzZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5fbGFiZWwpIHtcbiAgICAgIHRoaXMuX2xhYmVsLmZvY3VzZWQgPSBpc0ZvY3VzZWQ7XG4gICAgfVxuICAgIGlmICghaXNGb2N1c2VkKSB7XG4gICAgICB0aGlzLl9ncm91cC5vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgY2hlY2tlZCgpIHsgcmV0dXJuIHRoaXMuX2NoZWNrZWQ7IH1cblxuICBnZXQgZGlzYWJsZWQoKSB7IHJldHVybiB0aGlzLl9ncm91cC5kaXNhYmxlZCB8fCB0aGlzLl9kaXNhYmxlZDsgfVxuXG4gIGdldCB2YWx1ZSgpIHsgcmV0dXJuIHRoaXMuX3ZhbHVlOyB9XG5cbiAgZ2V0IG5hbWVBdHRyKCkgeyByZXR1cm4gdGhpcy5uYW1lIHx8IHRoaXMuX2dyb3VwLm5hbWU7IH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2dyb3VwOiBOZ2JSYWRpb0dyb3VwLCBwcml2YXRlIF9sYWJlbDogTmdiQnV0dG9uTGFiZWwsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgICBwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+KSB7XG4gICAgdGhpcy5fZ3JvdXAucmVnaXN0ZXIodGhpcyk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHsgdGhpcy5fZ3JvdXAudW5yZWdpc3Rlcih0aGlzKTsgfVxuXG4gIG9uQ2hhbmdlKCkgeyB0aGlzLl9ncm91cC5vblJhZGlvQ2hhbmdlKHRoaXMpOyB9XG5cbiAgdXBkYXRlVmFsdWUodmFsdWUpIHtcbiAgICB0aGlzLl9jaGVja2VkID0gdGhpcy52YWx1ZSA9PT0gdmFsdWU7XG4gICAgdGhpcy5fbGFiZWwuYWN0aXZlID0gdGhpcy5fY2hlY2tlZDtcbiAgfVxuXG4gIHVwZGF0ZURpc2FibGVkKCkgeyB0aGlzLl9sYWJlbC5kaXNhYmxlZCA9IHRoaXMuZGlzYWJsZWQ7IH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JCdXR0b25MYWJlbH0gZnJvbSAnLi9sYWJlbCc7XG5pbXBvcnQge05nYkNoZWNrQm94fSBmcm9tICcuL2NoZWNrYm94JztcbmltcG9ydCB7TmdiUmFkaW8sIE5nYlJhZGlvR3JvdXB9IGZyb20gJy4vcmFkaW8nO1xuXG5leHBvcnQge05nYkJ1dHRvbkxhYmVsfSBmcm9tICcuL2xhYmVsJztcbmV4cG9ydCB7TmdiQ2hlY2tCb3h9IGZyb20gJy4vY2hlY2tib3gnO1xuZXhwb3J0IHtOZ2JSYWRpbywgTmdiUmFkaW9Hcm91cH0gZnJvbSAnLi9yYWRpbyc7XG5cblxuY29uc3QgTkdCX0JVVFRPTl9ESVJFQ1RJVkVTID0gW05nYkJ1dHRvbkxhYmVsLCBOZ2JDaGVja0JveCwgTmdiUmFkaW9Hcm91cCwgTmdiUmFkaW9dO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogTkdCX0JVVFRPTl9ESVJFQ1RJVkVTLCBleHBvcnRzOiBOR0JfQlVUVE9OX0RJUkVDVElWRVN9KVxuZXhwb3J0IGNsYXNzIE5nYkJ1dHRvbnNNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiQnV0dG9uc01vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiQ2Fyb3VzZWwgY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGNhcm91c2VscyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiQ2Fyb3VzZWxDb25maWcge1xuICBpbnRlcnZhbCA9IDUwMDA7XG4gIHdyYXAgPSB0cnVlO1xuICBrZXlib2FyZCA9IHRydWU7XG4gIHBhdXNlT25Ib3ZlciA9IHRydWU7XG4gIHNob3dOYXZpZ2F0aW9uQXJyb3dzID0gdHJ1ZTtcbiAgc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzID0gdHJ1ZTtcbn1cbiIsImltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFBMQVRGT1JNX0lELFxuICBRdWVyeUxpc3QsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOZ2JDYXJvdXNlbENvbmZpZ30gZnJvbSAnLi9jYXJvdXNlbC1jb25maWcnO1xuXG5pbXBvcnQge1N1YmplY3QsIHRpbWVyfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHN3aXRjaE1hcCwgdGFrZVVudGlsfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmxldCBuZXh0SWQgPSAwO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYW4gaW5kaXZpZHVhbCBzbGlkZSB0byBiZSB1c2VkIHdpdGhpbiBhIGNhcm91c2VsLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nLXRlbXBsYXRlW25nYlNsaWRlXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlNsaWRlIHtcbiAgLyoqXG4gICAqIFVuaXF1ZSBzbGlkZSBpZGVudGlmaWVyLiBNdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgcHJvcGVyIGFjY2Vzc2liaWxpdHkgc3VwcG9ydC5cbiAgICogV2lsbCBiZSBhdXRvLWdlbmVyYXRlZCBpZiBub3QgcHJvdmlkZWQuXG4gICAqL1xuICBASW5wdXQoKSBpZCA9IGBuZ2Itc2xpZGUtJHtuZXh0SWQrK31gO1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdHBsUmVmOiBUZW1wbGF0ZVJlZjxhbnk+KSB7fVxufVxuXG4vKipcbiAqIERpcmVjdGl2ZSB0byBlYXNpbHkgY3JlYXRlIGNhcm91c2VscyBiYXNlZCBvbiBCb290c3RyYXAncyBtYXJrdXAuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1jYXJvdXNlbCcsXG4gIGV4cG9ydEFzOiAnbmdiQ2Fyb3VzZWwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdjYXJvdXNlbCBzbGlkZScsXG4gICAgJ1tzdHlsZS5kaXNwbGF5XSc6ICdcImJsb2NrXCInLFxuICAgICd0YWJJbmRleCc6ICcwJyxcbiAgICAnKG1vdXNlZW50ZXIpJzogJ3BhdXNlT25Ib3ZlciAmJiBwYXVzZSgpJyxcbiAgICAnKG1vdXNlbGVhdmUpJzogJ3BhdXNlT25Ib3ZlciAmJiBjeWNsZSgpJyxcbiAgICAnKGtleWRvd24uYXJyb3dMZWZ0KSc6ICdrZXlib2FyZCAmJiBwcmV2KCknLFxuICAgICcoa2V5ZG93bi5hcnJvd1JpZ2h0KSc6ICdrZXlib2FyZCAmJiBuZXh0KCknXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG9sIGNsYXNzPVwiY2Fyb3VzZWwtaW5kaWNhdG9yc1wiICpuZ0lmPVwic2hvd05hdmlnYXRpb25JbmRpY2F0b3JzXCI+XG4gICAgICA8bGkgKm5nRm9yPVwibGV0IHNsaWRlIG9mIHNsaWRlc1wiIFtpZF09XCJzbGlkZS5pZFwiIFtjbGFzcy5hY3RpdmVdPVwic2xpZGUuaWQgPT09IGFjdGl2ZUlkXCJcbiAgICAgICAgICAoY2xpY2spPVwic2VsZWN0KHNsaWRlLmlkKTsgcGF1c2VPbkhvdmVyICYmIHBhdXNlKClcIj48L2xpPlxuICAgIDwvb2w+XG4gICAgPGRpdiBjbGFzcz1cImNhcm91c2VsLWlubmVyXCI+XG4gICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBzbGlkZSBvZiBzbGlkZXNcIiBjbGFzcz1cImNhcm91c2VsLWl0ZW1cIiBbY2xhc3MuYWN0aXZlXT1cInNsaWRlLmlkID09PSBhY3RpdmVJZFwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwic2xpZGUudHBsUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxhIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1wcmV2XCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJwcmV2KClcIiAqbmdJZj1cInNob3dOYXZpZ2F0aW9uQXJyb3dzXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtcHJldi1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLnByZXZpb3VzXCI+UHJldmlvdXM8L3NwYW4+XG4gICAgPC9hPlxuICAgIDxhIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1uZXh0XCIgcm9sZT1cImJ1dHRvblwiIChjbGljayk9XCJuZXh0KClcIiAqbmdJZj1cInNob3dOYXZpZ2F0aW9uQXJyb3dzXCI+XG4gICAgICA8c3BhbiBjbGFzcz1cImNhcm91c2VsLWNvbnRyb2wtbmV4dC1pY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPlxuICAgICAgPHNwYW4gY2xhc3M9XCJzci1vbmx5XCIgaTE4bj1cIkBAbmdiLmNhcm91c2VsLm5leHRcIj5OZXh0PC9zcGFuPlxuICAgIDwvYT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JDYXJvdXNlbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICBAQ29udGVudENoaWxkcmVuKE5nYlNsaWRlKSBzbGlkZXM6IFF1ZXJ5TGlzdDxOZ2JTbGlkZT47XG5cbiAgcHJpdmF0ZSBfc3RhcnQkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBfc3RvcCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBUaGUgYWN0aXZlIHNsaWRlIGlkLlxuICAgKi9cbiAgQElucHV0KCkgYWN0aXZlSWQ6IHN0cmluZztcblxuXG4gIC8qKlxuICAgKiBBbW91bnQgb2YgdGltZSBpbiBtaWxsaXNlY29uZHMgYmVmb3JlIG5leHQgc2xpZGUgaXMgc2hvd24uXG4gICAqL1xuICBASW5wdXQoKSBpbnRlcnZhbDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIGNhbiB3cmFwIGZyb20gdGhlIGxhc3QgdG8gdGhlIGZpcnN0IHNsaWRlLlxuICAgKi9cbiAgQElucHV0KCkgd3JhcDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIGZvciBhbGxvd2luZyBuYXZpZ2F0aW9uIHZpYSBrZXlib2FyZFxuICAgKi9cbiAgQElucHV0KCkga2V5Ym9hcmQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBlbmFibGUgc2xpZGUgY3ljbGluZyBwYXVzZS9yZXN1bWUgb24gbW91c2VvdmVyLlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHBhdXNlT25Ib3ZlcjogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIHRvIHNob3cgLyBoaWRlIG5hdmlnYXRpb24gYXJyb3dzLlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHNob3dOYXZpZ2F0aW9uQXJyb3dzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gc2hvdyAvIGhpZGUgbmF2aWdhdGlvbiBpbmRpY2F0b3JzLlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHNob3dOYXZpZ2F0aW9uSW5kaWNhdG9yczogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBjYXJvdXNlbCBzbGlkZSBldmVudCBmaXJlZCB3aGVuIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZC5cbiAgICogU2VlIE5nYlNsaWRlRXZlbnQgZm9yIHBheWxvYWQgZGV0YWlsc1xuICAgKi9cbiAgQE91dHB1dCgpIHNsaWRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JTbGlkZUV2ZW50PigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgY29uZmlnOiBOZ2JDYXJvdXNlbENvbmZpZywgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBfcGxhdGZvcm1JZCwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICBwcml2YXRlIF9jZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICB0aGlzLmludGVydmFsID0gY29uZmlnLmludGVydmFsO1xuICAgIHRoaXMud3JhcCA9IGNvbmZpZy53cmFwO1xuICAgIHRoaXMua2V5Ym9hcmQgPSBjb25maWcua2V5Ym9hcmQ7XG4gICAgdGhpcy5wYXVzZU9uSG92ZXIgPSBjb25maWcucGF1c2VPbkhvdmVyO1xuICAgIHRoaXMuc2hvd05hdmlnYXRpb25BcnJvd3MgPSBjb25maWcuc2hvd05hdmlnYXRpb25BcnJvd3M7XG4gICAgdGhpcy5zaG93TmF2aWdhdGlvbkluZGljYXRvcnMgPSBjb25maWcuc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIHNldEludGVydmFsKCkgZG9lc24ndCBwbGF5IHdlbGwgd2l0aCBTU1IgYW5kIHByb3RyYWN0b3IsXG4gICAgLy8gc28gd2Ugc2hvdWxkIHJ1biBpdCBpbiB0aGUgYnJvd3NlciBhbmQgb3V0c2lkZSBBbmd1bGFyXG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICB0aGlzLl9zdGFydCRcbiAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoKSA9PiB0aGlzLmludGVydmFsKSwgZmlsdGVyKGludGVydmFsID0+IGludGVydmFsID4gMCksXG4gICAgICAgICAgICAgICAgc3dpdGNoTWFwKGludGVydmFsID0+IHRpbWVyKGludGVydmFsKS5waXBlKHRha2VVbnRpbCh0aGlzLl9zdG9wJCkpKSlcbiAgICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICB0aGlzLl9jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICB9KSk7XG5cbiAgICAgICAgdGhpcy5fc3RhcnQkLm5leHQoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICBsZXQgYWN0aXZlU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQodGhpcy5hY3RpdmVJZCk7XG4gICAgdGhpcy5hY3RpdmVJZCA9IGFjdGl2ZVNsaWRlID8gYWN0aXZlU2xpZGUuaWQgOiAodGhpcy5zbGlkZXMubGVuZ3RoID8gdGhpcy5zbGlkZXMuZmlyc3QuaWQgOiBudWxsKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkgeyB0aGlzLl9zdG9wJC5uZXh0KCk7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XG4gICAgaWYgKCdpbnRlcnZhbCcgaW4gY2hhbmdlcyAmJiAhY2hhbmdlc1snaW50ZXJ2YWwnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMuX3N0YXJ0JC5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlIHRvIGEgc2xpZGUgd2l0aCB0aGUgc3BlY2lmaWVkIGlkZW50aWZpZXIuXG4gICAqL1xuICBzZWxlY3Qoc2xpZGVJZDogc3RyaW5nKSB7IHRoaXMuX2N5Y2xlVG9TZWxlY3RlZChzbGlkZUlkLCB0aGlzLl9nZXRTbGlkZUV2ZW50RGlyZWN0aW9uKHRoaXMuYWN0aXZlSWQsIHNsaWRlSWQpKTsgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZSB0byB0aGUgbmV4dCBzbGlkZS5cbiAgICovXG4gIHByZXYoKSB7IHRoaXMuX2N5Y2xlVG9TZWxlY3RlZCh0aGlzLl9nZXRQcmV2U2xpZGUodGhpcy5hY3RpdmVJZCksIE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uUklHSFQpOyB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlLlxuICAgKi9cbiAgbmV4dCgpIHsgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldE5leHRTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5MRUZUKTsgfVxuXG4gIC8qKlxuICAgKiBTdG9wcyB0aGUgY2Fyb3VzZWwgZnJvbSBjeWNsaW5nIHRocm91Z2ggaXRlbXMuXG4gICAqL1xuICBwYXVzZSgpIHsgdGhpcy5fc3RvcCQubmV4dCgpOyB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIGN5Y2xpbmcgdGhyb3VnaCB0aGUgY2Fyb3VzZWwgc2xpZGVzIGZyb20gbGVmdCB0byByaWdodC5cbiAgICovXG4gIGN5Y2xlKCkgeyB0aGlzLl9zdGFydCQubmV4dCgpOyB9XG5cbiAgcHJpdmF0ZSBfY3ljbGVUb1NlbGVjdGVkKHNsaWRlSWR4OiBzdHJpbmcsIGRpcmVjdGlvbjogTmdiU2xpZGVFdmVudERpcmVjdGlvbikge1xuICAgIGxldCBzZWxlY3RlZFNsaWRlID0gdGhpcy5fZ2V0U2xpZGVCeUlkKHNsaWRlSWR4KTtcbiAgICBpZiAoc2VsZWN0ZWRTbGlkZSAmJiBzZWxlY3RlZFNsaWRlLmlkICE9PSB0aGlzLmFjdGl2ZUlkKSB7XG4gICAgICB0aGlzLnNsaWRlLmVtaXQoe3ByZXY6IHRoaXMuYWN0aXZlSWQsIGN1cnJlbnQ6IHNlbGVjdGVkU2xpZGUuaWQsIGRpcmVjdGlvbjogZGlyZWN0aW9ufSk7XG4gICAgICB0aGlzLl9zdGFydCQubmV4dCgpO1xuICAgICAgdGhpcy5hY3RpdmVJZCA9IHNlbGVjdGVkU2xpZGUuaWQ7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0U2xpZGVFdmVudERpcmVjdGlvbihjdXJyZW50QWN0aXZlU2xpZGVJZDogc3RyaW5nLCBuZXh0QWN0aXZlU2xpZGVJZDogc3RyaW5nKTogTmdiU2xpZGVFdmVudERpcmVjdGlvbiB7XG4gICAgY29uc3QgY3VycmVudEFjdGl2ZVNsaWRlSWR4ID0gdGhpcy5fZ2V0U2xpZGVJZHhCeUlkKGN1cnJlbnRBY3RpdmVTbGlkZUlkKTtcbiAgICBjb25zdCBuZXh0QWN0aXZlU2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQobmV4dEFjdGl2ZVNsaWRlSWQpO1xuXG4gICAgcmV0dXJuIGN1cnJlbnRBY3RpdmVTbGlkZUlkeCA+IG5leHRBY3RpdmVTbGlkZUlkeCA/IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uUklHSFQgOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLkxFRlQ7XG4gIH1cblxuICBwcml2YXRlIF9nZXRTbGlkZUJ5SWQoc2xpZGVJZDogc3RyaW5nKTogTmdiU2xpZGUgeyByZXR1cm4gdGhpcy5zbGlkZXMuZmluZChzbGlkZSA9PiBzbGlkZS5pZCA9PT0gc2xpZGVJZCk7IH1cblxuICBwcml2YXRlIF9nZXRTbGlkZUlkeEJ5SWQoc2xpZGVJZDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zbGlkZXMudG9BcnJheSgpLmluZGV4T2YodGhpcy5fZ2V0U2xpZGVCeUlkKHNsaWRlSWQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldE5leHRTbGlkZShjdXJyZW50U2xpZGVJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzbGlkZUFyciA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudFNsaWRlSWQpO1xuICAgIGNvbnN0IGlzTGFzdFNsaWRlID0gY3VycmVudFNsaWRlSWR4ID09PSBzbGlkZUFyci5sZW5ndGggLSAxO1xuXG4gICAgcmV0dXJuIGlzTGFzdFNsaWRlID8gKHRoaXMud3JhcCA/IHNsaWRlQXJyWzBdLmlkIDogc2xpZGVBcnJbc2xpZGVBcnIubGVuZ3RoIC0gMV0uaWQpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZUFycltjdXJyZW50U2xpZGVJZHggKyAxXS5pZDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFByZXZTbGlkZShjdXJyZW50U2xpZGVJZDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBzbGlkZUFyciA9IHRoaXMuc2xpZGVzLnRvQXJyYXkoKTtcbiAgICBjb25zdCBjdXJyZW50U2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudFNsaWRlSWQpO1xuICAgIGNvbnN0IGlzRmlyc3RTbGlkZSA9IGN1cnJlbnRTbGlkZUlkeCA9PT0gMDtcblxuICAgIHJldHVybiBpc0ZpcnN0U2xpZGUgPyAodGhpcy53cmFwID8gc2xpZGVBcnJbc2xpZGVBcnIubGVuZ3RoIC0gMV0uaWQgOiBzbGlkZUFyclswXS5pZCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZUFycltjdXJyZW50U2xpZGVJZHggLSAxXS5pZDtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBzbGlkZSBldmVudCBmaXJlZCB3aGVuIHRoZSBzbGlkZSB0cmFuc2l0aW9uIGlzIGNvbXBsZXRlZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE5nYlNsaWRlRXZlbnQge1xuICAvKipcbiAgICogUHJldmlvdXMgc2xpZGUgaWRcbiAgICovXG4gIHByZXY6IHN0cmluZztcblxuICAvKipcbiAgICogTmV3IHNsaWRlIGlkc1xuICAgKi9cbiAgY3VycmVudDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBTbGlkZSBldmVudCBkaXJlY3Rpb25cbiAgICovXG4gIGRpcmVjdGlvbjogTmdiU2xpZGVFdmVudERpcmVjdGlvbjtcbn1cblxuLyoqXG4gKiBFbnVtIHRvIGRlZmluZSB0aGUgY2Fyb3VzZWwgc2xpZGUgZXZlbnQgZGlyZWN0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIE5nYlNsaWRlRXZlbnREaXJlY3Rpb24ge1xuICBMRUZUID0gPGFueT4nbGVmdCcsXG4gIFJJR0hUID0gPGFueT4ncmlnaHQnXG59XG5cbmV4cG9ydCBjb25zdCBOR0JfQ0FST1VTRUxfRElSRUNUSVZFUyA9IFtOZ2JDYXJvdXNlbCwgTmdiU2xpZGVdO1xuIiwiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOR0JfQ0FST1VTRUxfRElSRUNUSVZFU30gZnJvbSAnLi9jYXJvdXNlbCc7XG5cbmV4cG9ydCB7TmdiQ2Fyb3VzZWwsIE5nYlNsaWRlLCBOZ2JTbGlkZUV2ZW50fSBmcm9tICcuL2Nhcm91c2VsJztcbmV4cG9ydCB7TmdiQ2Fyb3VzZWxDb25maWd9IGZyb20gJy4vY2Fyb3VzZWwtY29uZmlnJztcblxuQE5nTW9kdWxlKHtkZWNsYXJhdGlvbnM6IE5HQl9DQVJPVVNFTF9ESVJFQ1RJVkVTLCBleHBvcnRzOiBOR0JfQ0FST1VTRUxfRElSRUNUSVZFUywgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYkNhcm91c2VsTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYkNhcm91c2VsTW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtEaXJlY3RpdmUsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBUaGUgTmdiQ29sbGFwc2UgZGlyZWN0aXZlIHByb3ZpZGVzIGEgc2ltcGxlIHdheSB0byBoaWRlIGFuZCBzaG93IGFuIGVsZW1lbnQgd2l0aCBhbmltYXRpb25zLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiQ29sbGFwc2VdJyxcbiAgZXhwb3J0QXM6ICduZ2JDb2xsYXBzZScsXG4gIGhvc3Q6IHsnW2NsYXNzLmNvbGxhcHNlXSc6ICd0cnVlJywgJ1tjbGFzcy5zaG93XSc6ICchY29sbGFwc2VkJ31cbn0pXG5leHBvcnQgY2xhc3MgTmdiQ29sbGFwc2Uge1xuICAvKipcbiAgICogQSBmbGFnIGluZGljYXRpbmcgY29sbGFwc2VkICh0cnVlKSBvciBvcGVuIChmYWxzZSkgc3RhdGUuXG4gICAqL1xuICBASW5wdXQoJ25nYkNvbGxhcHNlJykgY29sbGFwc2VkID0gZmFsc2U7XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiQ29sbGFwc2V9IGZyb20gJy4vY29sbGFwc2UnO1xuXG5leHBvcnQge05nYkNvbGxhcHNlfSBmcm9tICcuL2NvbGxhcHNlJztcblxuQE5nTW9kdWxlKHtkZWNsYXJhdGlvbnM6IFtOZ2JDb2xsYXBzZV0sIGV4cG9ydHM6IFtOZ2JDb2xsYXBzZV19KVxuZXhwb3J0IGNsYXNzIE5nYkNvbGxhcHNlTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYkNvbGxhcHNlTW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge2lzSW50ZWdlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBTaW1wbGUgY2xhc3MgdXNlZCBmb3IgYSBkYXRlIHJlcHJlc2VudGF0aW9uIHRoYXQgZGF0ZXBpY2tlciBhbHNvIHVzZXMgaW50ZXJuYWxseVxuICpcbiAqIEBzaW5jZSAzLjAuMFxuICovXG5leHBvcnQgY2xhc3MgTmdiRGF0ZSBpbXBsZW1lbnRzIE5nYkRhdGVTdHJ1Y3Qge1xuICAvKipcbiAgICogVGhlIHllYXIsIGZvciBleGFtcGxlIDIwMTZcbiAgICovXG4gIHllYXI6IG51bWJlcjtcblxuICAvKipcbiAgICogVGhlIG1vbnRoLCBmb3IgZXhhbXBsZSAxPUphbiAuLi4gMTI9RGVjIGFzIGluIElTTyA4NjAxXG4gICAqL1xuICBtb250aDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF5IG9mIG1vbnRoLCBzdGFydGluZyB3aXRoIDFcbiAgICovXG4gIGRheTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTdGF0aWMgbWV0aG9kLiBDcmVhdGVzIGEgbmV3IGRhdGUgb2JqZWN0IGZyb20gdGhlIE5nYkRhdGVTdHJ1Y3QsIGV4LiBOZ2JEYXRlLmZyb20oe3llYXI6IDIwMDAsXG4gICAqIG1vbnRoOiA1LCBkYXk6IDF9KS4gSWYgdGhlICdkYXRlJyBpcyBhbHJlYWR5IG9mIE5nYkRhdGUsIHRoZSBtZXRob2Qgd2lsbCByZXR1cm4gdGhlIHNhbWUgb2JqZWN0XG4gICAqL1xuICBzdGF0aWMgZnJvbShkYXRlOiBOZ2JEYXRlU3RydWN0KTogTmdiRGF0ZSB7XG4gICAgaWYgKGRhdGUgaW5zdGFuY2VvZiBOZ2JEYXRlKSB7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGUgPyBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KSA6IG51bGw7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcih5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXIsIGRheTogbnVtYmVyKSB7XG4gICAgdGhpcy55ZWFyID0gaXNJbnRlZ2VyKHllYXIpID8geWVhciA6IG51bGw7XG4gICAgdGhpcy5tb250aCA9IGlzSW50ZWdlcihtb250aCkgPyBtb250aCA6IG51bGw7XG4gICAgdGhpcy5kYXkgPSBpc0ludGVnZXIoZGF5KSA/IGRheSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGN1cnJlbnQgZGF0ZSBpcyBlcXVhbCB0byBhbm90aGVyIGRhdGVcbiAgICovXG4gIGVxdWFscyhvdGhlcjogTmdiRGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBvdGhlciAmJiB0aGlzLnllYXIgPT09IG90aGVyLnllYXIgJiYgdGhpcy5tb250aCA9PT0gb3RoZXIubW9udGggJiYgdGhpcy5kYXkgPT09IG90aGVyLmRheTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgY3VycmVudCBkYXRlIGlzIGJlZm9yZSBhbm90aGVyIGRhdGVcbiAgICovXG4gIGJlZm9yZShvdGhlcjogTmdiRGF0ZSk6IGJvb2xlYW4ge1xuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy55ZWFyID09PSBvdGhlci55ZWFyKSB7XG4gICAgICBpZiAodGhpcy5tb250aCA9PT0gb3RoZXIubW9udGgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF5ID09PSBvdGhlci5kYXkgPyBmYWxzZSA6IHRoaXMuZGF5IDwgb3RoZXIuZGF5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubW9udGggPCBvdGhlci5tb250aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMueWVhciA8IG90aGVyLnllYXI7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiBjdXJyZW50IGRhdGUgaXMgYWZ0ZXIgYW5vdGhlciBkYXRlXG4gICAqL1xuICBhZnRlcihvdGhlcjogTmdiRGF0ZSk6IGJvb2xlYW4ge1xuICAgIGlmICghb3RoZXIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMueWVhciA9PT0gb3RoZXIueWVhcikge1xuICAgICAgaWYgKHRoaXMubW9udGggPT09IG90aGVyLm1vbnRoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRheSA9PT0gb3RoZXIuZGF5ID8gZmFsc2UgOiB0aGlzLmRheSA+IG90aGVyLmRheTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vbnRoID4gb3RoZXIubW9udGg7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnllYXIgPiBvdGhlci55ZWFyO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzSW50ZWdlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuZnVuY3Rpb24gZnJvbUpTRGF0ZShqc0RhdGU6IERhdGUpIHtcbiAgcmV0dXJuIG5ldyBOZ2JEYXRlKGpzRGF0ZS5nZXRGdWxsWWVhcigpLCBqc0RhdGUuZ2V0TW9udGgoKSArIDEsIGpzRGF0ZS5nZXREYXRlKCkpO1xufVxuZnVuY3Rpb24gdG9KU0RhdGUoZGF0ZTogTmdiRGF0ZSkge1xuICBjb25zdCBqc0RhdGUgPSBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRheSwgMTIpO1xuICAvLyB0aGlzIGlzIGRvbmUgYXZvaWQgMzAgLT4gMTkzMCBjb252ZXJzaW9uXG4gIGlmICghaXNOYU4oanNEYXRlLmdldFRpbWUoKSkpIHtcbiAgICBqc0RhdGUuc2V0RnVsbFllYXIoZGF0ZS55ZWFyKTtcbiAgfVxuICByZXR1cm4ganNEYXRlO1xufVxuXG5leHBvcnQgdHlwZSBOZ2JQZXJpb2QgPSAneScgfCAnbScgfCAnZCc7XG5cbi8qKlxuICogQ2FsZW5kYXIgdXNlZCBieSB0aGUgZGF0ZXBpY2tlci5cbiAqIERlZmF1bHQgaW1wbGVtZW50YXRpb24gdXNlcyBHcmVnb3JpYW4gY2FsZW5kYXIuXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JDYWxlbmRhciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIG51bWJlciBvZiBkYXlzIHBlciB3ZWVrLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0RGF5c1BlcldlZWsoKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIG1vbnRocyBwZXIgeWVhci5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMSBhbmQgcmV0dXJuIFsxLCAyLCAuLi4sIDEyXTtcbiAgICovXG4gIGFic3RyYWN0IGdldE1vbnRocygpOiBudW1iZXJbXTtcblxuICAvKipcbiAgICogUmV0dXJucyBudW1iZXIgb2Ygd2Vla3MgcGVyIG1vbnRoLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0V2Vla3NQZXJNb250aCgpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2Vla2RheSBudW1iZXIgZm9yIGEgZ2l2ZW4gZGF5LlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnd2Vla2RheScgaXMgMT1Nb24gLi4uIDc9U3VuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRXZWVrZGF5KGRhdGU6IE5nYkRhdGUpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBudW1iZXIgb2YgeWVhcnMsIG1vbnRocyBvciBkYXlzIHRvIGEgZ2l2ZW4gZGF0ZS5cbiAgICogUGVyaW9kIGNhbiBiZSAneScsICdtJyBvciAnZCcgYW5kIGRlZmF1bHRzIHRvIGRheS5cbiAgICogTnVtYmVyIGRlZmF1bHRzIHRvIDEuXG4gICAqL1xuICBhYnN0cmFjdCBnZXROZXh0KGRhdGU6IE5nYkRhdGUsIHBlcmlvZD86IE5nYlBlcmlvZCwgbnVtYmVyPzogbnVtYmVyKTogTmdiRGF0ZTtcblxuICAvKipcbiAgICogU3VidHJhY3RzIGEgbnVtYmVyIG9mIHllYXJzLCBtb250aHMgb3IgZGF5cyBmcm9tIGEgZ2l2ZW4gZGF0ZS5cbiAgICogUGVyaW9kIGNhbiBiZSAneScsICdtJyBvciAnZCcgYW5kIGRlZmF1bHRzIHRvIGRheS5cbiAgICogTnVtYmVyIGRlZmF1bHRzIHRvIDEuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRQcmV2KGRhdGU6IE5nYkRhdGUsIHBlcmlvZD86IE5nYlBlcmlvZCwgbnVtYmVyPzogbnVtYmVyKTogTmdiRGF0ZTtcblxuICAvKipcbiAgICogUmV0dXJucyB3ZWVrIG51bWJlciBmb3IgYSBnaXZlbiB3ZWVrLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0V2Vla051bWJlcih3ZWVrOiBOZ2JEYXRlW10sIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXIpOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdG9kYXkncyBkYXRlLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0VG9kYXkoKTogTmdiRGF0ZTtcblxuICAvKipcbiAgICogQ2hlY2tzIGlmIGEgZGF0ZSBpcyB2YWxpZCBmb3IgYSBjdXJyZW50IGNhbGVuZGFyLlxuICAgKi9cbiAgYWJzdHJhY3QgaXNWYWxpZChkYXRlOiBOZ2JEYXRlKTogYm9vbGVhbjtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkNhbGVuZGFyR3JlZ29yaWFuIGV4dGVuZHMgTmdiQ2FsZW5kYXIge1xuICBnZXREYXlzUGVyV2VlaygpIHsgcmV0dXJuIDc7IH1cblxuICBnZXRNb250aHMoKSB7IHJldHVybiBbMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMl07IH1cblxuICBnZXRXZWVrc1Blck1vbnRoKCkgeyByZXR1cm4gNjsgfVxuXG4gIGdldE5leHQoZGF0ZTogTmdiRGF0ZSwgcGVyaW9kOiBOZ2JQZXJpb2QgPSAnZCcsIG51bWJlciA9IDEpIHtcbiAgICBsZXQganNEYXRlID0gdG9KU0RhdGUoZGF0ZSk7XG5cbiAgICBzd2l0Y2ggKHBlcmlvZCkge1xuICAgICAgY2FzZSAneSc6XG4gICAgICAgIHJldHVybiBuZXcgTmdiRGF0ZShkYXRlLnllYXIgKyBudW1iZXIsIDEsIDEpO1xuICAgICAgY2FzZSAnbSc6XG4gICAgICAgIGpzRGF0ZSA9IG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCArIG51bWJlciAtIDEsIDEsIDEyKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdkJzpcbiAgICAgICAganNEYXRlLnNldERhdGUoanNEYXRlLmdldERhdGUoKSArIG51bWJlcik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZyb21KU0RhdGUoanNEYXRlKTtcbiAgfVxuXG4gIGdldFByZXYoZGF0ZTogTmdiRGF0ZSwgcGVyaW9kOiBOZ2JQZXJpb2QgPSAnZCcsIG51bWJlciA9IDEpIHsgcmV0dXJuIHRoaXMuZ2V0TmV4dChkYXRlLCBwZXJpb2QsIC1udW1iZXIpOyB9XG5cbiAgZ2V0V2Vla2RheShkYXRlOiBOZ2JEYXRlKSB7XG4gICAgbGV0IGpzRGF0ZSA9IHRvSlNEYXRlKGRhdGUpO1xuICAgIGxldCBkYXkgPSBqc0RhdGUuZ2V0RGF5KCk7XG4gICAgLy8gaW4gSlMgRGF0ZSBTdW49MCwgaW4gSVNPIDg2MDEgU3VuPTdcbiAgICByZXR1cm4gZGF5ID09PSAwID8gNyA6IGRheTtcbiAgfVxuXG4gIGdldFdlZWtOdW1iZXIod2VlazogTmdiRGF0ZVtdLCBmaXJzdERheU9mV2VlazogbnVtYmVyKSB7XG4gICAgLy8gaW4gSlMgRGF0ZSBTdW49MCwgaW4gSVNPIDg2MDEgU3VuPTdcbiAgICBpZiAoZmlyc3REYXlPZldlZWsgPT09IDcpIHtcbiAgICAgIGZpcnN0RGF5T2ZXZWVrID0gMDtcbiAgICB9XG5cbiAgICBjb25zdCB0aHVyc2RheUluZGV4ID0gKDQgKyA3IC0gZmlyc3REYXlPZldlZWspICUgNztcbiAgICBsZXQgZGF0ZSA9IHdlZWtbdGh1cnNkYXlJbmRleF07XG5cbiAgICBjb25zdCBqc0RhdGUgPSB0b0pTRGF0ZShkYXRlKTtcbiAgICBqc0RhdGUuc2V0RGF0ZShqc0RhdGUuZ2V0RGF0ZSgpICsgNCAtIChqc0RhdGUuZ2V0RGF5KCkgfHwgNykpOyAgLy8gVGh1cnNkYXlcbiAgICBjb25zdCB0aW1lID0ganNEYXRlLmdldFRpbWUoKTtcbiAgICBqc0RhdGUuc2V0TW9udGgoMCk7ICAvLyBDb21wYXJlIHdpdGggSmFuIDFcbiAgICBqc0RhdGUuc2V0RGF0ZSgxKTtcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJvdW5kKCh0aW1lIC0ganNEYXRlLmdldFRpbWUoKSkgLyA4NjQwMDAwMCkgLyA3KSArIDE7XG4gIH1cblxuICBnZXRUb2RheSgpOiBOZ2JEYXRlIHsgcmV0dXJuIGZyb21KU0RhdGUobmV3IERhdGUoKSk7IH1cblxuICBpc1ZhbGlkKGRhdGU6IE5nYkRhdGUpOiBib29sZWFuIHtcbiAgICBpZiAoIWRhdGUgfHwgIWlzSW50ZWdlcihkYXRlLnllYXIpIHx8ICFpc0ludGVnZXIoZGF0ZS5tb250aCkgfHwgIWlzSW50ZWdlcihkYXRlLmRheSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBqc0RhdGUgPSB0b0pTRGF0ZShkYXRlKTtcblxuICAgIHJldHVybiAhaXNOYU4oanNEYXRlLmdldFRpbWUoKSkgJiYganNEYXRlLmdldEZ1bGxZZWFyKCkgPT09IGRhdGUueWVhciAmJiBqc0RhdGUuZ2V0TW9udGgoKSArIDEgPT09IGRhdGUubW9udGggJiZcbiAgICAgICAganNEYXRlLmdldERhdGUoKSA9PT0gZGF0ZS5kYXk7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge0RhdGVwaWNrZXJWaWV3TW9kZWwsIERheVZpZXdNb2RlbCwgTW9udGhWaWV3TW9kZWx9IGZyb20gJy4vZGF0ZXBpY2tlci12aWV3LW1vZGVsJztcbmltcG9ydCB7TmdiQ2FsZW5kYXJ9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7aXNEZWZpbmVkfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGFuZ2VkRGF0ZShwcmV2OiBOZ2JEYXRlLCBuZXh0OiBOZ2JEYXRlKSB7XG4gIHJldHVybiAhZGF0ZUNvbXBhcmF0b3IocHJldiwgbmV4dCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkYXRlQ29tcGFyYXRvcihwcmV2OiBOZ2JEYXRlLCBuZXh0OiBOZ2JEYXRlKSB7XG4gIHJldHVybiAoIXByZXYgJiYgIW5leHQpIHx8ICghIXByZXYgJiYgISFuZXh0ICYmIHByZXYuZXF1YWxzKG5leHQpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTWluQmVmb3JlTWF4KG1pbkRhdGU6IE5nYkRhdGUsIG1heERhdGU6IE5nYkRhdGUpIHtcbiAgaWYgKG1heERhdGUgJiYgbWluRGF0ZSAmJiBtYXhEYXRlLmJlZm9yZShtaW5EYXRlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJ21heERhdGUnICR7bWF4RGF0ZX0gc2hvdWxkIGJlIGdyZWF0ZXIgdGhhbiAnbWluRGF0ZScgJHttaW5EYXRlfWApO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0RhdGVJblJhbmdlKGRhdGU6IE5nYkRhdGUsIG1pbkRhdGU6IE5nYkRhdGUsIG1heERhdGU6IE5nYkRhdGUpOiBOZ2JEYXRlIHtcbiAgaWYgKGRhdGUgJiYgbWluRGF0ZSAmJiBkYXRlLmJlZm9yZShtaW5EYXRlKSkge1xuICAgIHJldHVybiBtaW5EYXRlO1xuICB9XG4gIGlmIChkYXRlICYmIG1heERhdGUgJiYgZGF0ZS5hZnRlcihtYXhEYXRlKSkge1xuICAgIHJldHVybiBtYXhEYXRlO1xuICB9XG5cbiAgcmV0dXJuIGRhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGVTZWxlY3RhYmxlKGRhdGU6IE5nYkRhdGUsIHN0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsKSB7XG4gIGNvbnN0IHttaW5EYXRlLCBtYXhEYXRlLCBkaXNhYmxlZCwgbWFya0Rpc2FibGVkfSA9IHN0YXRlO1xuICAvLyBjbGFuZy1mb3JtYXQgb2ZmXG4gIHJldHVybiAhKFxuICAgICFpc0RlZmluZWQoZGF0ZSkgfHxcbiAgICBkaXNhYmxlZCB8fFxuICAgIChtYXJrRGlzYWJsZWQgJiYgbWFya0Rpc2FibGVkKGRhdGUsIHt5ZWFyOiBkYXRlLnllYXIsIG1vbnRoOiBkYXRlLm1vbnRofSkpIHx8XG4gICAgKG1pbkRhdGUgJiYgZGF0ZS5iZWZvcmUobWluRGF0ZSkpIHx8XG4gICAgKG1heERhdGUgJiYgZGF0ZS5hZnRlcihtYXhEYXRlKSlcbiAgKTtcbiAgLy8gY2xhbmctZm9ybWF0IG9uXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVNlbGVjdEJveE1vbnRocyhjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIGRhdGU6IE5nYkRhdGUsIG1pbkRhdGU6IE5nYkRhdGUsIG1heERhdGU6IE5nYkRhdGUpIHtcbiAgaWYgKCFkYXRlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgbGV0IG1vbnRocyA9IGNhbGVuZGFyLmdldE1vbnRocygpO1xuXG4gIGlmIChtaW5EYXRlICYmIGRhdGUueWVhciA9PT0gbWluRGF0ZS55ZWFyKSB7XG4gICAgY29uc3QgaW5kZXggPSBtb250aHMuZmluZEluZGV4KG1vbnRoID0+IG1vbnRoID09PSBtaW5EYXRlLm1vbnRoKTtcbiAgICBtb250aHMgPSBtb250aHMuc2xpY2UoaW5kZXgpO1xuICB9XG5cbiAgaWYgKG1heERhdGUgJiYgZGF0ZS55ZWFyID09PSBtYXhEYXRlLnllYXIpIHtcbiAgICBjb25zdCBpbmRleCA9IG1vbnRocy5maW5kSW5kZXgobW9udGggPT4gbW9udGggPT09IG1heERhdGUubW9udGgpO1xuICAgIG1vbnRocyA9IG1vbnRocy5zbGljZSgwLCBpbmRleCArIDEpO1xuICB9XG5cbiAgcmV0dXJuIG1vbnRocztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlU2VsZWN0Qm94WWVhcnMoZGF0ZTogTmdiRGF0ZSwgbWluRGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSkge1xuICBpZiAoIWRhdGUpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBzdGFydCA9IG1pbkRhdGUgJiYgbWluRGF0ZS55ZWFyIHx8IGRhdGUueWVhciAtIDEwO1xuICBjb25zdCBlbmQgPSBtYXhEYXRlICYmIG1heERhdGUueWVhciB8fCBkYXRlLnllYXIgKyAxMDtcblxuICByZXR1cm4gQXJyYXkuZnJvbSh7bGVuZ3RoOiBlbmQgLSBzdGFydCArIDF9LCAoZSwgaSkgPT4gc3RhcnQgKyBpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5leHRNb250aERpc2FibGVkKGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgbWF4RGF0ZTogTmdiRGF0ZSkge1xuICByZXR1cm4gbWF4RGF0ZSAmJiBjYWxlbmRhci5nZXROZXh0KGRhdGUsICdtJykuYWZ0ZXIobWF4RGF0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmV2TW9udGhEaXNhYmxlZChjYWxlbmRhcjogTmdiQ2FsZW5kYXIsIGRhdGU6IE5nYkRhdGUsIG1pbkRhdGU6IE5nYkRhdGUpIHtcbiAgY29uc3QgcHJldkRhdGUgPSBjYWxlbmRhci5nZXRQcmV2KGRhdGUsICdtJyk7XG4gIHJldHVybiBtaW5EYXRlICYmIChwcmV2RGF0ZS55ZWFyID09PSBtaW5EYXRlLnllYXIgJiYgcHJldkRhdGUubW9udGggPCBtaW5EYXRlLm1vbnRoIHx8XG4gICAgICAgICAgICAgICAgICAgICBwcmV2RGF0ZS55ZWFyIDwgbWluRGF0ZS55ZWFyICYmIG1pbkRhdGUubW9udGggPT09IDEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRNb250aHMoXG4gICAgY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBkYXRlOiBOZ2JEYXRlLCBzdGF0ZTogRGF0ZXBpY2tlclZpZXdNb2RlbCwgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4sXG4gICAgZm9yY2U6IGJvb2xlYW4pOiBNb250aFZpZXdNb2RlbFtdIHtcbiAgY29uc3Qge2Rpc3BsYXlNb250aHMsIG1vbnRoc30gPSBzdGF0ZTtcbiAgLy8gbW92ZSBvbGQgbW9udGhzIHRvIGEgdGVtcG9yYXJ5IGFycmF5XG4gIGNvbnN0IG1vbnRoc1RvUmV1c2UgPSBtb250aHMuc3BsaWNlKDAsIG1vbnRocy5sZW5ndGgpO1xuXG4gIC8vIGdlbmVyYXRlIG5ldyBmaXJzdCBkYXRlcywgbnVsbGlmeSBvciByZXVzZSBtb250aHNcbiAgY29uc3QgZmlyc3REYXRlcyA9IEFycmF5LmZyb20oe2xlbmd0aDogZGlzcGxheU1vbnRoc30sIChfLCBpKSA9PiB7XG4gICAgY29uc3QgZmlyc3REYXRlID0gY2FsZW5kYXIuZ2V0TmV4dChkYXRlLCAnbScsIGkpO1xuICAgIG1vbnRoc1tpXSA9IG51bGw7XG5cbiAgICBpZiAoIWZvcmNlKSB7XG4gICAgICBjb25zdCByZXVzZWRJbmRleCA9IG1vbnRoc1RvUmV1c2UuZmluZEluZGV4KG1vbnRoID0+IG1vbnRoLmZpcnN0RGF0ZS5lcXVhbHMoZmlyc3REYXRlKSk7XG4gICAgICAvLyBtb3ZlIHJldXNlZCBtb250aCBiYWNrIHRvIG1vbnRoc1xuICAgICAgaWYgKHJldXNlZEluZGV4ICE9PSAtMSkge1xuICAgICAgICBtb250aHNbaV0gPSBtb250aHNUb1JldXNlLnNwbGljZShyZXVzZWRJbmRleCwgMSlbMF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpcnN0RGF0ZTtcbiAgfSk7XG5cbiAgLy8gcmVidWlsZCBudWxsaWZpZWQgbW9udGhzXG4gIGZpcnN0RGF0ZXMuZm9yRWFjaCgoZmlyc3REYXRlLCBpKSA9PiB7XG4gICAgaWYgKG1vbnRoc1tpXSA9PT0gbnVsbCkge1xuICAgICAgbW9udGhzW2ldID0gYnVpbGRNb250aChjYWxlbmRhciwgZmlyc3REYXRlLCBzdGF0ZSwgaTE4biwgbW9udGhzVG9SZXVzZS5zaGlmdCgpIHx8IHt9IGFzIE1vbnRoVmlld01vZGVsKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBtb250aHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZE1vbnRoKFxuICAgIGNhbGVuZGFyOiBOZ2JDYWxlbmRhciwgZGF0ZTogTmdiRGF0ZSwgc3RhdGU6IERhdGVwaWNrZXJWaWV3TW9kZWwsIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuLFxuICAgIG1vbnRoOiBNb250aFZpZXdNb2RlbCA9IHt9IGFzIE1vbnRoVmlld01vZGVsKTogTW9udGhWaWV3TW9kZWwge1xuICBjb25zdCB7bWluRGF0ZSwgbWF4RGF0ZSwgZmlyc3REYXlPZldlZWssIG1hcmtEaXNhYmxlZCwgb3V0c2lkZURheXN9ID0gc3RhdGU7XG5cbiAgbW9udGguZmlyc3REYXRlID0gbnVsbDtcbiAgbW9udGgubGFzdERhdGUgPSBudWxsO1xuICBtb250aC5udW1iZXIgPSBkYXRlLm1vbnRoO1xuICBtb250aC55ZWFyID0gZGF0ZS55ZWFyO1xuICBtb250aC53ZWVrcyA9IG1vbnRoLndlZWtzIHx8IFtdO1xuICBtb250aC53ZWVrZGF5cyA9IG1vbnRoLndlZWtkYXlzIHx8IFtdO1xuXG4gIGRhdGUgPSBnZXRGaXJzdFZpZXdEYXRlKGNhbGVuZGFyLCBkYXRlLCBmaXJzdERheU9mV2Vlayk7XG5cbiAgLy8gbW9udGggaGFzIHdlZWtzXG4gIGZvciAobGV0IHdlZWsgPSAwOyB3ZWVrIDwgY2FsZW5kYXIuZ2V0V2Vla3NQZXJNb250aCgpOyB3ZWVrKyspIHtcbiAgICBsZXQgd2Vla09iamVjdCA9IG1vbnRoLndlZWtzW3dlZWtdO1xuICAgIGlmICghd2Vla09iamVjdCkge1xuICAgICAgd2Vla09iamVjdCA9IG1vbnRoLndlZWtzW3dlZWtdID0ge251bWJlcjogMCwgZGF5czogW10sIGNvbGxhcHNlZDogdHJ1ZX07XG4gICAgfVxuICAgIGNvbnN0IGRheXMgPSB3ZWVrT2JqZWN0LmRheXM7XG5cbiAgICAvLyB3ZWVrIGhhcyBkYXlzXG4gICAgZm9yIChsZXQgZGF5ID0gMDsgZGF5IDwgY2FsZW5kYXIuZ2V0RGF5c1BlcldlZWsoKTsgZGF5KyspIHtcbiAgICAgIGlmICh3ZWVrID09PSAwKSB7XG4gICAgICAgIG1vbnRoLndlZWtkYXlzW2RheV0gPSBjYWxlbmRhci5nZXRXZWVrZGF5KGRhdGUpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdEYXRlID0gbmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoLCBkYXRlLmRheSk7XG4gICAgICBjb25zdCBuZXh0RGF0ZSA9IGNhbGVuZGFyLmdldE5leHQobmV3RGF0ZSk7XG5cbiAgICAgIGNvbnN0IGFyaWFMYWJlbCA9IGkxOG4uZ2V0RGF5QXJpYUxhYmVsKG5ld0RhdGUpO1xuXG4gICAgICAvLyBtYXJraW5nIGRhdGUgYXMgZGlzYWJsZWRcbiAgICAgIGxldCBkaXNhYmxlZCA9ICEhKChtaW5EYXRlICYmIG5ld0RhdGUuYmVmb3JlKG1pbkRhdGUpKSB8fCAobWF4RGF0ZSAmJiBuZXdEYXRlLmFmdGVyKG1heERhdGUpKSk7XG4gICAgICBpZiAoIWRpc2FibGVkICYmIG1hcmtEaXNhYmxlZCkge1xuICAgICAgICBkaXNhYmxlZCA9IG1hcmtEaXNhYmxlZChuZXdEYXRlLCB7bW9udGg6IG1vbnRoLm51bWJlciwgeWVhcjogbW9udGgueWVhcn0pO1xuICAgICAgfVxuXG4gICAgICAvLyBzYXZpbmcgZmlyc3QgZGF0ZSBvZiB0aGUgbW9udGhcbiAgICAgIGlmIChtb250aC5maXJzdERhdGUgPT09IG51bGwgJiYgbmV3RGF0ZS5tb250aCA9PT0gbW9udGgubnVtYmVyKSB7XG4gICAgICAgIG1vbnRoLmZpcnN0RGF0ZSA9IG5ld0RhdGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHNhdmluZyBsYXN0IGRhdGUgb2YgdGhlIG1vbnRoXG4gICAgICBpZiAobmV3RGF0ZS5tb250aCA9PT0gbW9udGgubnVtYmVyICYmIG5leHREYXRlLm1vbnRoICE9PSBtb250aC5udW1iZXIpIHtcbiAgICAgICAgbW9udGgubGFzdERhdGUgPSBuZXdEYXRlO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF5T2JqZWN0ID0gZGF5c1tkYXldO1xuICAgICAgaWYgKCFkYXlPYmplY3QpIHtcbiAgICAgICAgZGF5T2JqZWN0ID0gZGF5c1tkYXldID0ge30gYXMgRGF5Vmlld01vZGVsO1xuICAgICAgfVxuICAgICAgZGF5T2JqZWN0LmRhdGUgPSBuZXdEYXRlO1xuICAgICAgZGF5T2JqZWN0LmNvbnRleHQgPSBPYmplY3QuYXNzaWduKFxuICAgICAgICAgIGRheU9iamVjdC5jb250ZXh0IHx8IHt9LFxuICAgICAgICAgIHtkYXRlOiBuZXdEYXRlLCBjdXJyZW50TW9udGg6IG1vbnRoLm51bWJlciwgZGlzYWJsZWQsIGZvY3VzZWQ6IGZhbHNlLCBzZWxlY3RlZDogZmFsc2V9KTtcbiAgICAgIGRheU9iamVjdC50YWJpbmRleCA9IC0xO1xuICAgICAgZGF5T2JqZWN0LmFyaWFMYWJlbCA9IGFyaWFMYWJlbDtcbiAgICAgIGRheU9iamVjdC5oaWRkZW4gPSBmYWxzZTtcblxuICAgICAgZGF0ZSA9IG5leHREYXRlO1xuICAgIH1cblxuICAgIHdlZWtPYmplY3QubnVtYmVyID0gY2FsZW5kYXIuZ2V0V2Vla051bWJlcihkYXlzLm1hcChkYXkgPT4gZGF5LmRhdGUpLCBmaXJzdERheU9mV2Vlayk7XG5cbiAgICAvLyBtYXJraW5nIHdlZWsgYXMgY29sbGFwc2VkXG4gICAgd2Vla09iamVjdC5jb2xsYXBzZWQgPSBvdXRzaWRlRGF5cyA9PT0gJ2NvbGxhcHNlZCcgJiYgZGF5c1swXS5kYXRlLm1vbnRoICE9PSBtb250aC5udW1iZXIgJiZcbiAgICAgICAgZGF5c1tkYXlzLmxlbmd0aCAtIDFdLmRhdGUubW9udGggIT09IG1vbnRoLm51bWJlcjtcbiAgfVxuXG4gIHJldHVybiBtb250aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEZpcnN0Vmlld0RhdGUoY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBkYXRlOiBOZ2JEYXRlLCBmaXJzdERheU9mV2VlazogbnVtYmVyKTogTmdiRGF0ZSB7XG4gIGNvbnN0IGRheXNQZXJXZWVrID0gY2FsZW5kYXIuZ2V0RGF5c1BlcldlZWsoKTtcbiAgY29uc3QgZmlyc3RNb250aERhdGUgPSBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIDEpO1xuICBjb25zdCBkYXlPZldlZWsgPSBjYWxlbmRhci5nZXRXZWVrZGF5KGZpcnN0TW9udGhEYXRlKSAlIGRheXNQZXJXZWVrO1xuICByZXR1cm4gY2FsZW5kYXIuZ2V0UHJldihmaXJzdE1vbnRoRGF0ZSwgJ2QnLCAoZGF5c1BlcldlZWsgKyBkYXlPZldlZWsgLSBmaXJzdERheU9mV2VlaykgJSBkYXlzUGVyV2Vlayk7XG59XG4iLCJpbXBvcnQge0luamVjdCwgSW5qZWN0YWJsZSwgTE9DQUxFX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Rm9ybVN0eWxlLCBnZXRMb2NhbGVEYXlOYW1lcywgZ2V0TG9jYWxlTW9udGhOYW1lcywgVHJhbnNsYXRpb25XaWR0aCwgZm9ybWF0RGF0ZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuXG4vKipcbiAqIFR5cGUgb2YgdGhlIHNlcnZpY2Ugc3VwcGx5aW5nIG1vbnRoIGFuZCB3ZWVrZGF5IG5hbWVzIHRvIHRvIE5nYkRhdGVwaWNrZXIgY29tcG9uZW50LlxuICogVGhlIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBzZXJ2aWNlIGhvbm9ycyB0aGUgQW5ndWxhciBsb2NhbGUsIGFuZCB1c2VzIHRoZSByZWdpc3RlcmVkIGxvY2FsZSBkYXRhLFxuICogYXMgZXhwbGFpbmVkIGluIHRoZSBBbmd1bGFyIGkxOG4gZ3VpZGUuXG4gKiBTZWUgdGhlIGkxOG4gZGVtbyBmb3IgaG93IHRvIGV4dGVuZCB0aGlzIGNsYXNzIGFuZCBkZWZpbmUgYSBjdXN0b20gcHJvdmlkZXIgZm9yIGkxOG4uXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaG9ydCB3ZWVrZGF5IG5hbWUgdG8gZGlzcGxheSBpbiB0aGUgaGVhZGluZyBvZiB0aGUgbW9udGggdmlldy5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ3dlZWtkYXknIGlzIDE9TW9uIC4uLiA3PVN1blxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0V2Vla2RheVNob3J0TmFtZSh3ZWVrZGF5OiBudW1iZXIpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNob3J0IG1vbnRoIG5hbWUgdG8gZGlzcGxheSBpbiB0aGUgZGF0ZSBwaWNrZXIgbmF2aWdhdGlvbi5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbiAuLi4gMTI9RGVjXG4gICAqL1xuICBhYnN0cmFjdCBnZXRNb250aFNob3J0TmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBmdWxsIG1vbnRoIG5hbWUgdG8gZGlzcGxheSBpbiB0aGUgZGF0ZSBwaWNrZXIgbmF2aWdhdGlvbi5cbiAgICogV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogJ21vbnRoJyBpcyAxPUphbnVhcnkgLi4uIDEyPURlY2VtYmVyXG4gICAqL1xuICBhYnN0cmFjdCBnZXRNb250aEZ1bGxOYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIHRoZSAnYXJpYS1sYWJlbCcgYXR0cmlidXRlIGZvciBhIHNwZWNpZmljIGRhdGVcbiAgICpcbiAgICogQHNpbmNlIDIuMC4wXG4gICAqL1xuICBhYnN0cmFjdCBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIGRheSB0aGF0IGlzIHJlbmRlcmVkIGluIGEgZGF5IGNlbGxcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBnZXREYXlOdW1lcmFscyhkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHsgcmV0dXJuIGAke2RhdGUuZGF5fWA7IH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIHdlZWsgbnVtYmVyIHJlbmRlcmVkIGJ5IGRhdGUgcGlja2VyXG4gICAqXG4gICAqIEBzaW5jZSAzLjAuMFxuICAgKi9cbiAgZ2V0V2Vla051bWVyYWxzKHdlZWtOdW1iZXI6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiBgJHt3ZWVrTnVtYmVyfWA7IH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdGV4dHVhbCByZXByZXNlbnRhdGlvbiBvZiBhIHllYXIgdGhhdCBpcyByZW5kZXJlZFxuICAgKiBpbiBkYXRlIHBpY2tlciB5ZWFyIHNlbGVjdCBib3hcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBnZXRZZWFyTnVtZXJhbHMoeWVhcjogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIGAke3llYXJ9YDsgfVxufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckkxOG5EZWZhdWx0IGV4dGVuZHMgTmdiRGF0ZXBpY2tlckkxOG4ge1xuICBwcml2YXRlIF93ZWVrZGF5c1Nob3J0OiBBcnJheTxzdHJpbmc+O1xuICBwcml2YXRlIF9tb250aHNTaG9ydDogQXJyYXk8c3RyaW5nPjtcbiAgcHJpdmF0ZSBfbW9udGhzRnVsbDogQXJyYXk8c3RyaW5nPjtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KExPQ0FMRV9JRCkgcHJpdmF0ZSBfbG9jYWxlOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgY29uc3Qgd2Vla2RheXNTdGFydGluZ09uU3VuZGF5ID0gZ2V0TG9jYWxlRGF5TmFtZXMoX2xvY2FsZSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguU2hvcnQpO1xuICAgIHRoaXMuX3dlZWtkYXlzU2hvcnQgPSB3ZWVrZGF5c1N0YXJ0aW5nT25TdW5kYXkubWFwKChkYXksIGluZGV4KSA9PiB3ZWVrZGF5c1N0YXJ0aW5nT25TdW5kYXlbKGluZGV4ICsgMSkgJSA3XSk7XG5cbiAgICB0aGlzLl9tb250aHNTaG9ydCA9IGdldExvY2FsZU1vbnRoTmFtZXMoX2xvY2FsZSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguQWJicmV2aWF0ZWQpO1xuICAgIHRoaXMuX21vbnRoc0Z1bGwgPSBnZXRMb2NhbGVNb250aE5hbWVzKF9sb2NhbGUsIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpO1xuICB9XG5cbiAgZ2V0V2Vla2RheVNob3J0TmFtZSh3ZWVrZGF5OiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fd2Vla2RheXNTaG9ydFt3ZWVrZGF5IC0gMV07IH1cblxuICBnZXRNb250aFNob3J0TmFtZShtb250aDogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuX21vbnRoc1Nob3J0W21vbnRoIC0gMV07IH1cblxuICBnZXRNb250aEZ1bGxOYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbW9udGhzRnVsbFttb250aCAtIDFdOyB9XG5cbiAgZ2V0RGF5QXJpYUxhYmVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIGNvbnN0IGpzRGF0ZSA9IG5ldyBEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCAtIDEsIGRhdGUuZGF5KTtcbiAgICByZXR1cm4gZm9ybWF0RGF0ZShqc0RhdGUsICdmdWxsRGF0ZScsIHRoaXMuX2xvY2FsZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiQ2FsZW5kYXIsIE5nYlBlcmlvZH0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHtEYXRlcGlja2VyVmlld01vZGVsLCBOZ2JNYXJrRGlzYWJsZWR9IGZyb20gJy4vZGF0ZXBpY2tlci12aWV3LW1vZGVsJztcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzSW50ZWdlciwgdG9JbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtPYnNlcnZhYmxlLCBTdWJqZWN0fSBmcm9tICdyeGpzJztcbmltcG9ydCB7XG4gIGJ1aWxkTW9udGhzLFxuICBjaGVja0RhdGVJblJhbmdlLFxuICBjaGVja01pbkJlZm9yZU1heCxcbiAgaXNDaGFuZ2VkRGF0ZSxcbiAgaXNEYXRlU2VsZWN0YWJsZSxcbiAgZ2VuZXJhdGVTZWxlY3RCb3hZZWFycyxcbiAgZ2VuZXJhdGVTZWxlY3RCb3hNb250aHMsXG4gIHByZXZNb250aERpc2FibGVkLFxuICBuZXh0TW9udGhEaXNhYmxlZFxufSBmcm9tICcuL2RhdGVwaWNrZXItdG9vbHMnO1xuXG5pbXBvcnQge2ZpbHRlcn0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlclNlcnZpY2Uge1xuICBwcml2YXRlIF9tb2RlbCQgPSBuZXcgU3ViamVjdDxEYXRlcGlja2VyVmlld01vZGVsPigpO1xuXG4gIHByaXZhdGUgX3NlbGVjdCQgPSBuZXcgU3ViamVjdDxOZ2JEYXRlPigpO1xuXG4gIHByaXZhdGUgX3N0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsID0ge1xuICAgIGRpc2FibGVkOiBmYWxzZSxcbiAgICBkaXNwbGF5TW9udGhzOiAxLFxuICAgIGZpcnN0RGF5T2ZXZWVrOiAxLFxuICAgIGZvY3VzVmlzaWJsZTogZmFsc2UsXG4gICAgbW9udGhzOiBbXSxcbiAgICBuYXZpZ2F0aW9uOiAnc2VsZWN0JyxcbiAgICBvdXRzaWRlRGF5czogJ3Zpc2libGUnLFxuICAgIHByZXZEaXNhYmxlZDogZmFsc2UsXG4gICAgbmV4dERpc2FibGVkOiBmYWxzZSxcbiAgICBzZWxlY3RCb3hlczoge3llYXJzOiBbXSwgbW9udGhzOiBbXX0sXG4gICAgc2VsZWN0ZWREYXRlOiBudWxsXG4gIH07XG5cbiAgZ2V0IG1vZGVsJCgpOiBPYnNlcnZhYmxlPERhdGVwaWNrZXJWaWV3TW9kZWw+IHsgcmV0dXJuIHRoaXMuX21vZGVsJC5waXBlKGZpbHRlcihtb2RlbCA9PiBtb2RlbC5tb250aHMubGVuZ3RoID4gMCkpOyB9XG5cbiAgZ2V0IHNlbGVjdCQoKTogT2JzZXJ2YWJsZTxOZ2JEYXRlPiB7IHJldHVybiB0aGlzLl9zZWxlY3QkLnBpcGUoZmlsdGVyKGRhdGUgPT4gZGF0ZSAhPT0gbnVsbCkpOyB9XG5cbiAgc2V0IGRpc2FibGVkKGRpc2FibGVkOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlLmRpc2FibGVkICE9PSBkaXNhYmxlZCkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtkaXNhYmxlZH0pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBkaXNwbGF5TW9udGhzKGRpc3BsYXlNb250aHM6IG51bWJlcikge1xuICAgIGRpc3BsYXlNb250aHMgPSB0b0ludGVnZXIoZGlzcGxheU1vbnRocyk7XG4gICAgaWYgKGlzSW50ZWdlcihkaXNwbGF5TW9udGhzKSAmJiBkaXNwbGF5TW9udGhzID4gMCAmJiB0aGlzLl9zdGF0ZS5kaXNwbGF5TW9udGhzICE9PSBkaXNwbGF5TW9udGhzKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe2Rpc3BsYXlNb250aHN9KTtcbiAgICB9XG4gIH1cblxuICBzZXQgZmlyc3REYXlPZldlZWsoZmlyc3REYXlPZldlZWs6IG51bWJlcikge1xuICAgIGZpcnN0RGF5T2ZXZWVrID0gdG9JbnRlZ2VyKGZpcnN0RGF5T2ZXZWVrKTtcbiAgICBpZiAoaXNJbnRlZ2VyKGZpcnN0RGF5T2ZXZWVrKSAmJiBmaXJzdERheU9mV2VlayA+PSAwICYmIHRoaXMuX3N0YXRlLmZpcnN0RGF5T2ZXZWVrICE9PSBmaXJzdERheU9mV2Vlaykge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtmaXJzdERheU9mV2Vla30pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBmb2N1c1Zpc2libGUoZm9jdXNWaXNpYmxlOiBib29sZWFuKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlLmZvY3VzVmlzaWJsZSAhPT0gZm9jdXNWaXNpYmxlICYmICF0aGlzLl9zdGF0ZS5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5fbmV4dFN0YXRlKHtmb2N1c1Zpc2libGV9KTtcbiAgICB9XG4gIH1cblxuICBzZXQgbWF4RGF0ZShkYXRlOiBOZ2JEYXRlKSB7XG4gICAgY29uc3QgbWF4RGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG4gICAgaWYgKGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUubWF4RGF0ZSwgbWF4RGF0ZSkpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7bWF4RGF0ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBtYXJrRGlzYWJsZWQobWFya0Rpc2FibGVkOiBOZ2JNYXJrRGlzYWJsZWQpIHtcbiAgICBpZiAodGhpcy5fc3RhdGUubWFya0Rpc2FibGVkICE9PSBtYXJrRGlzYWJsZWQpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7bWFya0Rpc2FibGVkfSk7XG4gICAgfVxuICB9XG5cbiAgc2V0IG1pbkRhdGUoZGF0ZTogTmdiRGF0ZSkge1xuICAgIGNvbnN0IG1pbkRhdGUgPSB0aGlzLnRvVmFsaWREYXRlKGRhdGUsIG51bGwpO1xuICAgIGlmIChpc0NoYW5nZWREYXRlKHRoaXMuX3N0YXRlLm1pbkRhdGUsIG1pbkRhdGUpKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe21pbkRhdGV9KTtcbiAgICB9XG4gIH1cblxuICBzZXQgbmF2aWdhdGlvbihuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnKSB7XG4gICAgaWYgKHRoaXMuX3N0YXRlLm5hdmlnYXRpb24gIT09IG5hdmlnYXRpb24pIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7bmF2aWdhdGlvbn0pO1xuICAgIH1cbiAgfVxuXG4gIHNldCBvdXRzaWRlRGF5cyhvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJykge1xuICAgIGlmICh0aGlzLl9zdGF0ZS5vdXRzaWRlRGF5cyAhPT0gb3V0c2lkZURheXMpIHtcbiAgICAgIHRoaXMuX25leHRTdGF0ZSh7b3V0c2lkZURheXN9KTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jYWxlbmRhcjogTmdiQ2FsZW5kYXIsIHByaXZhdGUgX2kxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxuXG4gIGZvY3VzKGRhdGU6IE5nYkRhdGUpIHtcbiAgICBpZiAoIXRoaXMuX3N0YXRlLmRpc2FibGVkICYmIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQoZGF0ZSkgJiYgaXNDaGFuZ2VkRGF0ZSh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIGRhdGUpKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe2ZvY3VzRGF0ZTogZGF0ZX0pO1xuICAgIH1cbiAgfVxuXG4gIGZvY3VzTW92ZShwZXJpb2Q/OiBOZ2JQZXJpb2QsIG51bWJlcj86IG51bWJlcikge1xuICAgIHRoaXMuZm9jdXModGhpcy5fY2FsZW5kYXIuZ2V0TmV4dCh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIHBlcmlvZCwgbnVtYmVyKSk7XG4gIH1cblxuICBmb2N1c1NlbGVjdCgpIHtcbiAgICBpZiAoaXNEYXRlU2VsZWN0YWJsZSh0aGlzLl9zdGF0ZS5mb2N1c0RhdGUsIHRoaXMuX3N0YXRlKSkge1xuICAgICAgdGhpcy5zZWxlY3QodGhpcy5fc3RhdGUuZm9jdXNEYXRlLCB7ZW1pdEV2ZW50OiB0cnVlfSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbihkYXRlOiBOZ2JEYXRlKSB7XG4gICAgY29uc3QgZmlyc3REYXRlID0gdGhpcy50b1ZhbGlkRGF0ZShkYXRlLCB0aGlzLl9jYWxlbmRhci5nZXRUb2RheSgpKTtcbiAgICBpZiAoIXRoaXMuX3N0YXRlLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl9uZXh0U3RhdGUoe2ZpcnN0RGF0ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdChkYXRlOiBOZ2JEYXRlLCBvcHRpb25zOiB7ZW1pdEV2ZW50PzogYm9vbGVhbn0gPSB7fSkge1xuICAgIGNvbnN0IHNlbGVjdGVkRGF0ZSA9IHRoaXMudG9WYWxpZERhdGUoZGF0ZSwgbnVsbCk7XG4gICAgaWYgKCF0aGlzLl9zdGF0ZS5kaXNhYmxlZCkge1xuICAgICAgaWYgKGlzQ2hhbmdlZERhdGUodGhpcy5fc3RhdGUuc2VsZWN0ZWREYXRlLCBzZWxlY3RlZERhdGUpKSB7XG4gICAgICAgIHRoaXMuX25leHRTdGF0ZSh7c2VsZWN0ZWREYXRlfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmVtaXRFdmVudCAmJiBpc0RhdGVTZWxlY3RhYmxlKHNlbGVjdGVkRGF0ZSwgdGhpcy5fc3RhdGUpKSB7XG4gICAgICAgIHRoaXMuX3NlbGVjdCQubmV4dChzZWxlY3RlZERhdGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvVmFsaWREYXRlKGRhdGU6IE5nYkRhdGVTdHJ1Y3QsIGRlZmF1bHRWYWx1ZT86IE5nYkRhdGUpOiBOZ2JEYXRlIHtcbiAgICBjb25zdCBuZ2JEYXRlID0gTmdiRGF0ZS5mcm9tKGRhdGUpO1xuICAgIGlmIChkZWZhdWx0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmYXVsdFZhbHVlID0gdGhpcy5fY2FsZW5kYXIuZ2V0VG9kYXkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkgPyBuZ2JEYXRlIDogZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBfbmV4dFN0YXRlKHBhdGNoOiBQYXJ0aWFsPERhdGVwaWNrZXJWaWV3TW9kZWw+KSB7XG4gICAgY29uc3QgbmV3U3RhdGUgPSB0aGlzLl91cGRhdGVTdGF0ZShwYXRjaCk7XG4gICAgdGhpcy5fcGF0Y2hDb250ZXh0cyhuZXdTdGF0ZSk7XG4gICAgdGhpcy5fc3RhdGUgPSBuZXdTdGF0ZTtcbiAgICB0aGlzLl9tb2RlbCQubmV4dCh0aGlzLl9zdGF0ZSk7XG4gIH1cblxuICBwcml2YXRlIF9wYXRjaENvbnRleHRzKHN0YXRlOiBEYXRlcGlja2VyVmlld01vZGVsKSB7XG4gICAgY29uc3Qge21vbnRocywgZGlzcGxheU1vbnRocywgc2VsZWN0ZWREYXRlLCBmb2N1c0RhdGUsIGZvY3VzVmlzaWJsZSwgZGlzYWJsZWQsIG91dHNpZGVEYXlzfSA9IHN0YXRlO1xuICAgIHN0YXRlLm1vbnRocy5mb3JFYWNoKG1vbnRoID0+IHtcbiAgICAgIG1vbnRoLndlZWtzLmZvckVhY2god2VlayA9PiB7XG4gICAgICAgIHdlZWsuZGF5cy5mb3JFYWNoKGRheSA9PiB7XG5cbiAgICAgICAgICAvLyBwYXRjaCBmb2N1cyBmbGFnXG4gICAgICAgICAgaWYgKGZvY3VzRGF0ZSkge1xuICAgICAgICAgICAgZGF5LmNvbnRleHQuZm9jdXNlZCA9IGZvY3VzRGF0ZS5lcXVhbHMoZGF5LmRhdGUpICYmIGZvY3VzVmlzaWJsZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjYWxjdWxhdGluZyB0YWJpbmRleFxuICAgICAgICAgIGRheS50YWJpbmRleCA9ICFkaXNhYmxlZCAmJiBkYXkuZGF0ZS5lcXVhbHMoZm9jdXNEYXRlKSAmJiBmb2N1c0RhdGUubW9udGggPT09IG1vbnRoLm51bWJlciA/IDAgOiAtMTtcblxuICAgICAgICAgIC8vIG92ZXJyaWRlIGNvbnRleHQgZGlzYWJsZWRcbiAgICAgICAgICBpZiAoZGlzYWJsZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRheS5jb250ZXh0LmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBwYXRjaCBzZWxlY3Rpb24gZmxhZ1xuICAgICAgICAgIGlmIChzZWxlY3RlZERhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZGF5LmNvbnRleHQuc2VsZWN0ZWQgPSBzZWxlY3RlZERhdGUgIT09IG51bGwgJiYgc2VsZWN0ZWREYXRlLmVxdWFscyhkYXkuZGF0ZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gdmlzaWJpbGl0eVxuICAgICAgICAgIGlmIChtb250aC5udW1iZXIgIT09IGRheS5kYXRlLm1vbnRoKSB7XG4gICAgICAgICAgICBkYXkuaGlkZGVuID0gb3V0c2lkZURheXMgPT09ICdoaWRkZW4nIHx8IG91dHNpZGVEYXlzID09PSAnY29sbGFwc2VkJyB8fFxuICAgICAgICAgICAgICAgIChkaXNwbGF5TW9udGhzID4gMSAmJiBkYXkuZGF0ZS5hZnRlcihtb250aHNbMF0uZmlyc3REYXRlKSAmJlxuICAgICAgICAgICAgICAgICBkYXkuZGF0ZS5iZWZvcmUobW9udGhzW2Rpc3BsYXlNb250aHMgLSAxXS5sYXN0RGF0ZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVN0YXRlKHBhdGNoOiBQYXJ0aWFsPERhdGVwaWNrZXJWaWV3TW9kZWw+KTogRGF0ZXBpY2tlclZpZXdNb2RlbCB7XG4gICAgLy8gcGF0Y2hpbmcgZmllbGRzXG4gICAgY29uc3Qgc3RhdGUgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLl9zdGF0ZSwgcGF0Y2gpO1xuXG4gICAgbGV0IHN0YXJ0RGF0ZSA9IHN0YXRlLmZpcnN0RGF0ZTtcblxuICAgIC8vIG1pbi9tYXggZGF0ZXMgY2hhbmdlZFxuICAgIGlmICgnbWluRGF0ZScgaW4gcGF0Y2ggfHwgJ21heERhdGUnIGluIHBhdGNoKSB7XG4gICAgICBjaGVja01pbkJlZm9yZU1heChzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXRlLmZvY3VzRGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZm9jdXNEYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXRlLmZpcnN0RGF0ZSA9IGNoZWNrRGF0ZUluUmFuZ2Uoc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgIHN0YXJ0RGF0ZSA9IHN0YXRlLmZvY3VzRGF0ZTtcbiAgICB9XG5cbiAgICAvLyBkaXNhYmxlZFxuICAgIGlmICgnZGlzYWJsZWQnIGluIHBhdGNoKSB7XG4gICAgICBzdGF0ZS5mb2N1c1Zpc2libGUgPSBmYWxzZTtcbiAgICB9XG5cbiAgICAvLyBpbml0aWFsIHJlYnVpbGQgdmlhICdzZWxlY3QoKSdcbiAgICBpZiAoJ3NlbGVjdGVkRGF0ZScgaW4gcGF0Y2ggJiYgdGhpcy5fc3RhdGUubW9udGhzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgc3RhcnREYXRlID0gc3RhdGUuc2VsZWN0ZWREYXRlO1xuICAgIH1cblxuICAgIC8vIGZvY3VzIGRhdGUgY2hhbmdlZFxuICAgIGlmICgnZm9jdXNEYXRlJyBpbiBwYXRjaCkge1xuICAgICAgc3RhdGUuZm9jdXNEYXRlID0gY2hlY2tEYXRlSW5SYW5nZShzdGF0ZS5mb2N1c0RhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgc3RhcnREYXRlID0gc3RhdGUuZm9jdXNEYXRlO1xuXG4gICAgICAvLyBub3RoaW5nIHRvIHJlYnVpbGQgaWYgb25seSBmb2N1cyBjaGFuZ2VkIGFuZCBpdCBpcyBzdGlsbCB2aXNpYmxlXG4gICAgICBpZiAoc3RhdGUubW9udGhzLmxlbmd0aCAhPT0gMCAmJiAhc3RhdGUuZm9jdXNEYXRlLmJlZm9yZShzdGF0ZS5maXJzdERhdGUpICYmXG4gICAgICAgICAgIXN0YXRlLmZvY3VzRGF0ZS5hZnRlcihzdGF0ZS5sYXN0RGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpcnN0IGRhdGUgY2hhbmdlZFxuICAgIGlmICgnZmlyc3REYXRlJyBpbiBwYXRjaCkge1xuICAgICAgc3RhdGUuZmlyc3REYXRlID0gY2hlY2tEYXRlSW5SYW5nZShzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgc3RhcnREYXRlID0gc3RhdGUuZmlyc3REYXRlO1xuICAgIH1cblxuICAgIC8vIHJlYnVpbGRpbmcgbW9udGhzXG4gICAgaWYgKHN0YXJ0RGF0ZSkge1xuICAgICAgY29uc3QgZm9yY2VSZWJ1aWxkID0gJ2ZpcnN0RGF5T2ZXZWVrJyBpbiBwYXRjaCB8fCAnbWFya0Rpc2FibGVkJyBpbiBwYXRjaCB8fCAnbWluRGF0ZScgaW4gcGF0Y2ggfHxcbiAgICAgICAgICAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgJ2Rpc2FibGVkJyBpbiBwYXRjaCB8fCAnb3V0c2lkZURheXMnIGluIHBhdGNoO1xuXG4gICAgICBjb25zdCBtb250aHMgPSBidWlsZE1vbnRocyh0aGlzLl9jYWxlbmRhciwgc3RhcnREYXRlLCBzdGF0ZSwgdGhpcy5faTE4biwgZm9yY2VSZWJ1aWxkKTtcblxuICAgICAgLy8gdXBkYXRpbmcgbW9udGhzIGFuZCBib3VuZGFyeSBkYXRlc1xuICAgICAgc3RhdGUubW9udGhzID0gbW9udGhzO1xuICAgICAgc3RhdGUuZmlyc3REYXRlID0gbW9udGhzLmxlbmd0aCA+IDAgPyBtb250aHNbMF0uZmlyc3REYXRlIDogdW5kZWZpbmVkO1xuICAgICAgc3RhdGUubGFzdERhdGUgPSBtb250aHMubGVuZ3RoID4gMCA/IG1vbnRoc1ttb250aHMubGVuZ3RoIC0gMV0ubGFzdERhdGUgOiB1bmRlZmluZWQ7XG5cbiAgICAgIC8vIHJlc2V0IHNlbGVjdGVkIGRhdGUgaWYgJ21hcmtEaXNhYmxlZCcgcmV0dXJucyB0cnVlXG4gICAgICBpZiAoJ3NlbGVjdGVkRGF0ZScgaW4gcGF0Y2ggJiYgIWlzRGF0ZVNlbGVjdGFibGUoc3RhdGUuc2VsZWN0ZWREYXRlLCBzdGF0ZSkpIHtcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWREYXRlID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gYWRqdXN0aW5nIGZvY3VzIGFmdGVyIG1vbnRocyB3ZXJlIGJ1aWx0XG4gICAgICBpZiAoJ2ZpcnN0RGF0ZScgaW4gcGF0Y2gpIHtcbiAgICAgICAgaWYgKHN0YXRlLmZvY3VzRGF0ZSA9PT0gdW5kZWZpbmVkIHx8IHN0YXRlLmZvY3VzRGF0ZS5iZWZvcmUoc3RhdGUuZmlyc3REYXRlKSB8fFxuICAgICAgICAgICAgc3RhdGUuZm9jdXNEYXRlLmFmdGVyKHN0YXRlLmxhc3REYXRlKSkge1xuICAgICAgICAgIHN0YXRlLmZvY3VzRGF0ZSA9IHN0YXJ0RGF0ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBhZGp1c3RpbmcgbW9udGhzL3llYXJzIGZvciB0aGUgc2VsZWN0IGJveCBuYXZpZ2F0aW9uXG4gICAgICBjb25zdCB5ZWFyQ2hhbmdlZCA9ICF0aGlzLl9zdGF0ZS5maXJzdERhdGUgfHwgdGhpcy5fc3RhdGUuZmlyc3REYXRlLnllYXIgIT09IHN0YXRlLmZpcnN0RGF0ZS55ZWFyO1xuICAgICAgY29uc3QgbW9udGhDaGFuZ2VkID0gIXRoaXMuX3N0YXRlLmZpcnN0RGF0ZSB8fCB0aGlzLl9zdGF0ZS5maXJzdERhdGUubW9udGggIT09IHN0YXRlLmZpcnN0RGF0ZS5tb250aDtcbiAgICAgIGlmIChzdGF0ZS5uYXZpZ2F0aW9uID09PSAnc2VsZWN0Jykge1xuICAgICAgICAvLyB5ZWFycyAtPiAgYm91bmRhcmllcyAobWluL21heCB3ZXJlIGNoYW5nZWQpXG4gICAgICAgIGlmICgnbWluRGF0ZScgaW4gcGF0Y2ggfHwgJ21heERhdGUnIGluIHBhdGNoIHx8IHN0YXRlLnNlbGVjdEJveGVzLnllYXJzLmxlbmd0aCA9PT0gMCB8fCB5ZWFyQ2hhbmdlZCkge1xuICAgICAgICAgIHN0YXRlLnNlbGVjdEJveGVzLnllYXJzID0gZ2VuZXJhdGVTZWxlY3RCb3hZZWFycyhzdGF0ZS5maXJzdERhdGUsIHN0YXRlLm1pbkRhdGUsIHN0YXRlLm1heERhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbW9udGhzIC0+IHdoZW4gY3VycmVudCB5ZWFyIG9yIGJvdW5kYXJpZXMgY2hhbmdlXG4gICAgICAgIGlmICgnbWluRGF0ZScgaW4gcGF0Y2ggfHwgJ21heERhdGUnIGluIHBhdGNoIHx8IHN0YXRlLnNlbGVjdEJveGVzLm1vbnRocy5sZW5ndGggPT09IDAgfHwgeWVhckNoYW5nZWQpIHtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RCb3hlcy5tb250aHMgPVxuICAgICAgICAgICAgICBnZW5lcmF0ZVNlbGVjdEJveE1vbnRocyh0aGlzLl9jYWxlbmRhciwgc3RhdGUuZmlyc3REYXRlLCBzdGF0ZS5taW5EYXRlLCBzdGF0ZS5tYXhEYXRlKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUuc2VsZWN0Qm94ZXMgPSB7eWVhcnM6IFtdLCBtb250aHM6IFtdfTtcbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRpbmcgbmF2aWdhdGlvbiBhcnJvd3MgLT4gYm91bmRhcmllcyBjaGFuZ2UgKG1pbi9tYXgpIG9yIG1vbnRoL3llYXIgY2hhbmdlc1xuICAgICAgaWYgKChzdGF0ZS5uYXZpZ2F0aW9uID09PSAnYXJyb3dzJyB8fCBzdGF0ZS5uYXZpZ2F0aW9uID09PSAnc2VsZWN0JykgJiZcbiAgICAgICAgICAobW9udGhDaGFuZ2VkIHx8IHllYXJDaGFuZ2VkIHx8ICdtaW5EYXRlJyBpbiBwYXRjaCB8fCAnbWF4RGF0ZScgaW4gcGF0Y2ggfHwgJ2Rpc2FibGVkJyBpbiBwYXRjaCkpIHtcbiAgICAgICAgc3RhdGUucHJldkRpc2FibGVkID0gc3RhdGUuZGlzYWJsZWQgfHwgcHJldk1vbnRoRGlzYWJsZWQodGhpcy5fY2FsZW5kYXIsIHN0YXRlLmZpcnN0RGF0ZSwgc3RhdGUubWluRGF0ZSk7XG4gICAgICAgIHN0YXRlLm5leHREaXNhYmxlZCA9IHN0YXRlLmRpc2FibGVkIHx8IG5leHRNb250aERpc2FibGVkKHRoaXMuX2NhbGVuZGFyLCBzdGF0ZS5sYXN0RGF0ZSwgc3RhdGUubWF4RGF0ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG59XG4iLCJleHBvcnQgZW51bSBLZXkge1xuICBUYWIgPSA5LFxuICBFbnRlciA9IDEzLFxuICBFc2NhcGUgPSAyNyxcbiAgU3BhY2UgPSAzMixcbiAgUGFnZVVwID0gMzMsXG4gIFBhZ2VEb3duID0gMzQsXG4gIEVuZCA9IDM1LFxuICBIb21lID0gMzYsXG4gIEFycm93TGVmdCA9IDM3LFxuICBBcnJvd1VwID0gMzgsXG4gIEFycm93UmlnaHQgPSAzOSxcbiAgQXJyb3dEb3duID0gNDBcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJTZXJ2aWNlfSBmcm9tICcuL2RhdGVwaWNrZXItc2VydmljZSc7XG5pbXBvcnQge05nYkNhbGVuZGFyfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQge3RvU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyS2V5TWFwU2VydmljZSB7XG4gIHByaXZhdGUgX21pbkRhdGU6IE5nYkRhdGU7XG4gIHByaXZhdGUgX21heERhdGU6IE5nYkRhdGU7XG4gIHByaXZhdGUgX2ZpcnN0Vmlld0RhdGU6IE5nYkRhdGU7XG4gIHByaXZhdGUgX2xhc3RWaWV3RGF0ZTogTmdiRGF0ZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9zZXJ2aWNlOiBOZ2JEYXRlcGlja2VyU2VydmljZSwgcHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyKSB7XG4gICAgX3NlcnZpY2UubW9kZWwkLnN1YnNjcmliZShtb2RlbCA9PiB7XG4gICAgICB0aGlzLl9taW5EYXRlID0gbW9kZWwubWluRGF0ZTtcbiAgICAgIHRoaXMuX21heERhdGUgPSBtb2RlbC5tYXhEYXRlO1xuICAgICAgdGhpcy5fZmlyc3RWaWV3RGF0ZSA9IG1vZGVsLmZpcnN0RGF0ZTtcbiAgICAgIHRoaXMuX2xhc3RWaWV3RGF0ZSA9IG1vZGVsLmxhc3REYXRlO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc0tleShldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmIChLZXlbdG9TdHJpbmcoZXZlbnQud2hpY2gpXSkge1xuICAgICAgc3dpdGNoIChldmVudC53aGljaCkge1xuICAgICAgICBjYXNlIEtleS5QYWdlVXA6XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1c01vdmUoZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIC0xKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuUGFnZURvd246XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1c01vdmUoZXZlbnQuc2hpZnRLZXkgPyAneScgOiAnbScsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1cyhldmVudC5zaGlmdEtleSA/IHRoaXMuX21heERhdGUgOiB0aGlzLl9sYXN0Vmlld0RhdGUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZm9jdXMoZXZlbnQuc2hpZnRLZXkgPyB0aGlzLl9taW5EYXRlIDogdGhpcy5fZmlyc3RWaWV3RGF0ZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgS2V5LkFycm93TGVmdDpcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmZvY3VzTW92ZSgnZCcsIC0xKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmZvY3VzTW92ZSgnZCcsIC10aGlzLl9jYWxlbmRhci5nZXREYXlzUGVyV2VlaygpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dSaWdodDpcbiAgICAgICAgICB0aGlzLl9zZXJ2aWNlLmZvY3VzTW92ZSgnZCcsIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd0Rvd246XG4gICAgICAgICAgdGhpcy5fc2VydmljZS5mb2N1c01vdmUoJ2QnLCB0aGlzLl9jYWxlbmRhci5nZXREYXlzUGVyV2VlaygpKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuRW50ZXI6XG4gICAgICAgIGNhc2UgS2V5LlNwYWNlOlxuICAgICAgICAgIHRoaXMuX3NlcnZpY2UuZm9jdXNTZWxlY3QoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmltcG9ydCB7RGF5VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuXG5leHBvcnQgdHlwZSBOZ2JNYXJrRGlzYWJsZWQgPSAoZGF0ZTogTmdiRGF0ZVN0cnVjdCwgY3VycmVudDoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn0pID0+IGJvb2xlYW47XG5cbmV4cG9ydCB0eXBlIERheVZpZXdNb2RlbCA9IHtcbiAgZGF0ZTogTmdiRGF0ZSxcbiAgY29udGV4dDogRGF5VGVtcGxhdGVDb250ZXh0LFxuICB0YWJpbmRleDogbnVtYmVyLFxuICBhcmlhTGFiZWw6IHN0cmluZyxcbiAgaGlkZGVuOiBib29sZWFuXG59O1xuXG5leHBvcnQgdHlwZSBXZWVrVmlld01vZGVsID0ge1xuICBudW1iZXI6IG51bWJlcixcbiAgZGF5czogRGF5Vmlld01vZGVsW10sXG4gIGNvbGxhcHNlZDogYm9vbGVhblxufTtcblxuZXhwb3J0IHR5cGUgTW9udGhWaWV3TW9kZWwgPSB7XG4gIGZpcnN0RGF0ZTogTmdiRGF0ZSxcbiAgbGFzdERhdGU6IE5nYkRhdGUsXG4gIG51bWJlcjogbnVtYmVyLFxuICB5ZWFyOiBudW1iZXIsXG4gIHdlZWtzOiBXZWVrVmlld01vZGVsW10sXG4gIHdlZWtkYXlzOiBudW1iZXJbXVxufTtcblxuLy8gY2xhbmctZm9ybWF0IG9mZlxuZXhwb3J0IHR5cGUgRGF0ZXBpY2tlclZpZXdNb2RlbCA9IHtcbiAgZGlzYWJsZWQ6IGJvb2xlYW4sXG4gIGRpc3BsYXlNb250aHM6IG51bWJlcixcbiAgZmlyc3REYXRlPzogTmdiRGF0ZSxcbiAgZmlyc3REYXlPZldlZWs6IG51bWJlcixcbiAgZm9jdXNEYXRlPzogTmdiRGF0ZSxcbiAgZm9jdXNWaXNpYmxlOiBib29sZWFuLFxuICBsYXN0RGF0ZT86IE5nYkRhdGUsXG4gIG1hcmtEaXNhYmxlZD86IE5nYk1hcmtEaXNhYmxlZCxcbiAgbWF4RGF0ZT86IE5nYkRhdGUsXG4gIG1pbkRhdGU/OiBOZ2JEYXRlLFxuICBtb250aHM6IE1vbnRoVmlld01vZGVsW10sXG4gIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZScsXG4gIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nLFxuICBwcmV2RGlzYWJsZWQ6IGJvb2xlYW4sXG4gIG5leHREaXNhYmxlZDogYm9vbGVhbixcbiAgc2VsZWN0Qm94ZXM6IHtcbiAgICB5ZWFyczogbnVtYmVyW10sXG4gICAgbW9udGhzOiBudW1iZXJbXVxuICB9LFxuICBzZWxlY3RlZERhdGU6IE5nYkRhdGVcbn07XG4vLyBjbGFuZy1mb3JtYXQgb25cblxuZXhwb3J0IGVudW0gTmF2aWdhdGlvbkV2ZW50IHtcbiAgUFJFVixcbiAgTkVYVFxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlLCBUZW1wbGF0ZVJlZn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RheVRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYkRhdGVwaWNrZXIgY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGRhdGVwaWNrZXJzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyQ29uZmlnIHtcbiAgZGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPERheVRlbXBsYXRlQ29udGV4dD47XG4gIGRpc3BsYXlNb250aHMgPSAxO1xuICBmaXJzdERheU9mV2VlayA9IDE7XG4gIG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGVTdHJ1Y3QsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBib29sZWFuO1xuICBtaW5EYXRlOiBOZ2JEYXRlU3RydWN0O1xuICBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuICBuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnID0gJ3NlbGVjdCc7XG4gIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nID0gJ3Zpc2libGUnO1xuICBzaG93V2Vla2RheXMgPSB0cnVlO1xuICBzaG93V2Vla051bWJlcnMgPSBmYWxzZTtcbiAgc3RhcnREYXRlOiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4uL25nYi1kYXRlLXN0cnVjdCc7XG5cbi8qKlxuICogQWJzdHJhY3QgdHlwZSBzZXJ2aW5nIGFzIGEgREkgdG9rZW4gZm9yIHRoZSBzZXJ2aWNlIGNvbnZlcnRpbmcgZnJvbSB5b3VyIGFwcGxpY2F0aW9uIERhdGUgbW9kZWwgdG8gaW50ZXJuYWxcbiAqIE5nYkRhdGVTdHJ1Y3QgbW9kZWwuXG4gKiBBIGRlZmF1bHQgaW1wbGVtZW50YXRpb24gY29udmVydGluZyBmcm9tIGFuZCB0byBOZ2JEYXRlU3RydWN0IGlzIHByb3ZpZGVkIGZvciByZXRyby1jb21wYXRpYmlsaXR5LFxuICogYnV0IHlvdSBjYW4gcHJvdmlkZSBhbm90aGVyIGltcGxlbWVudGF0aW9uIHRvIHVzZSBhbiBhbHRlcm5hdGl2ZSBmb3JtYXQsIGllIGZvciB1c2luZyB3aXRoIG5hdGl2ZSBEYXRlIE9iamVjdC5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nYkRhdGVBZGFwdGVyPEQ+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIHVzZXItbW9kZWwgZGF0ZSBpbnRvIGFuIE5nYkRhdGVTdHJ1Y3QgZm9yIGludGVybmFsIHVzZSBpbiB0aGUgbGlicmFyeVxuICAgKi9cbiAgYWJzdHJhY3QgZnJvbU1vZGVsKHZhbHVlOiBEKTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogQ29udmVydHMgaW50ZXJuYWwgZGF0ZSB2YWx1ZSBOZ2JEYXRlU3RydWN0IHRvIHVzZXItbW9kZWwgZGF0ZVxuICAgKiBUaGUgcmV0dXJuZWQgdHlwZSBpcyBzdXBvc2VkIHRvIGJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgZnJvbU1vZGVsKCkgaW5wdXQtdmFsdWUgcGFyYW1cbiAgICovXG4gIGFic3RyYWN0IHRvTW9kZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IEQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlU3RydWN0QWRhcHRlciBleHRlbmRzIE5nYkRhdGVBZGFwdGVyPE5nYkRhdGVTdHJ1Y3Q+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgTmdiRGF0ZVN0cnVjdCB2YWx1ZSBpbnRvIE5nYkRhdGVTdHJ1Y3QgdmFsdWVcbiAgICovXG4gIGZyb21Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogTmdiRGF0ZVN0cnVjdCB7XG4gICAgcmV0dXJuIChkYXRlICYmIGRhdGUueWVhciAmJiBkYXRlLm1vbnRoICYmIGRhdGUuZGF5KSA/IHt5ZWFyOiBkYXRlLnllYXIsIG1vbnRoOiBkYXRlLm1vbnRoLCBkYXk6IGRhdGUuZGF5fSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JEYXRlU3RydWN0IHZhbHVlIGludG8gTmdiRGF0ZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgdG9Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogTmdiRGF0ZVN0cnVjdCB7XG4gICAgcmV0dXJuIChkYXRlICYmIGRhdGUueWVhciAmJiBkYXRlLm1vbnRoICYmIGRhdGUuZGF5KSA/IHt5ZWFyOiBkYXRlLnllYXIsIG1vbnRoOiBkYXRlLm1vbnRoLCBkYXk6IGRhdGUuZGF5fSA6IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7U3Vic2NyaXB0aW9ufSBmcm9tICdyeGpzJztcbmltcG9ydCB7dGFrZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBmb3J3YXJkUmVmLFxuICBPbkluaXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBPbkRlc3Ryb3ksXG4gIEVsZW1lbnRSZWYsXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge05nYkNhbGVuZGFyfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyU2VydmljZX0gZnJvbSAnLi9kYXRlcGlja2VyLXNlcnZpY2UnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyS2V5TWFwU2VydmljZX0gZnJvbSAnLi9kYXRlcGlja2VyLWtleW1hcC1zZXJ2aWNlJztcbmltcG9ydCB7RGF0ZXBpY2tlclZpZXdNb2RlbCwgTmF2aWdhdGlvbkV2ZW50fSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQge0RheVRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckNvbmZpZ30gZnJvbSAnLi9kYXRlcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5pbXBvcnQge2lzQ2hhbmdlZERhdGV9IGZyb20gJy4vZGF0ZXBpY2tlci10b29scyc7XG5cbmNvbnN0IE5HQl9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiRGF0ZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBkYXRlcGlja2VyIG5hdmlnYXRpb24gZXZlbnRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCB7XG4gIC8qKlxuICAgKiBDdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoXG4gICAqL1xuICBjdXJyZW50OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfTtcblxuICAvKipcbiAgICogTW9udGggd2UncmUgbmF2aWdhdGluZyB0b1xuICAgKi9cbiAgbmV4dDoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn07XG59XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCBhbmQgaGlnaGx5IGNvbmZpZ3VyYWJsZSBkYXRlcGlja2VyIGRpcmVjdGl2ZVxuICovXG5AQ29tcG9uZW50KHtcbiAgZXhwb3J0QXM6ICduZ2JEYXRlcGlja2VyJyxcbiAgc2VsZWN0b3I6ICduZ2ItZGF0ZXBpY2tlcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3Qge1xuICAgICAgYm9yZGVyOiAxcHggc29saWQgI2RmZGZkZjtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgfVxuICAgIC5uZ2ItZHAtbW9udGgge1xuICAgICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgfVxuICAgIC5uZ2ItZHAtaGVhZGVyIHtcbiAgICAgIGJvcmRlci1ib3R0b206IDA7XG4gICAgICBib3JkZXItcmFkaXVzOiAwLjI1cmVtIDAuMjVyZW0gMCAwO1xuICAgICAgcGFkZGluZy10b3A6IDAuMjVyZW07XG4gICAgfVxuICAgIG5nYi1kYXRlcGlja2VyLW1vbnRoLXZpZXcge1xuICAgICAgcG9pbnRlci1ldmVudHM6IGF1dG87XG4gICAgfVxuICAgIC5uZ2ItZHAtbW9udGgtbmFtZSB7XG4gICAgICBmb250LXNpemU6IGxhcmdlcjtcbiAgICAgIGhlaWdodDogMnJlbTtcbiAgICAgIGxpbmUtaGVpZ2h0OiAycmVtO1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbiAgICAvZGVlcC8gLm5nYi1kcC1tb250aCArIC5uZ2ItZHAtbW9udGggPiBuZ2ItZGF0ZXBpY2tlci1tb250aC12aWV3ID4gLm5nYi1kcC13ZWVrIHtcbiAgICAgIHBhZGRpbmctbGVmdDogMXJlbTtcbiAgICB9XG4gICAgL2RlZXAvIC5uZ2ItZHAtbW9udGggKyAubmdiLWRwLW1vbnRoID4gLm5nYi1kcC1tb250aC1uYW1lIHtcbiAgICAgIHBhZGRpbmctbGVmdDogMXJlbTtcbiAgICB9XG4gICAgL2RlZXAvIC5uZ2ItZHAtbW9udGg6bGFzdC1jaGlsZCAubmdiLWRwLXdlZWsge1xuICAgICAgcGFkZGluZy1yaWdodDogLjI1cmVtO1xuICAgIH1cbiAgICAvZGVlcC8gLm5nYi1kcC1tb250aDpmaXJzdC1jaGlsZCAubmdiLWRwLXdlZWsge1xuICAgICAgcGFkZGluZy1sZWZ0OiAuMjVyZW07XG4gICAgfVxuICAgIC9kZWVwLyAubmdiLWRwLW1vbnRoID4gbmdiLWRhdGVwaWNrZXItbW9udGgtdmlldyA+IC5uZ2ItZHAtd2VlazpsYXN0LWNoaWxkIHtcbiAgICAgIHBhZGRpbmctYm90dG9tOiAuMjVyZW07XG4gICAgfVxuICAgIC5uZ2ItZHAtbW9udGhzIHtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjZHQgbGV0LWRhdGU9XCJkYXRlXCIgbGV0LWN1cnJlbnRNb250aD1cImN1cnJlbnRNb250aFwiIGxldC1zZWxlY3RlZD1cInNlbGVjdGVkXCIgbGV0LWRpc2FibGVkPVwiZGlzYWJsZWRcIiBsZXQtZm9jdXNlZD1cImZvY3VzZWRcIj5cbiAgICAgIDxkaXYgbmdiRGF0ZXBpY2tlckRheVZpZXdcbiAgICAgICAgW2RhdGVdPVwiZGF0ZVwiXG4gICAgICAgIFtjdXJyZW50TW9udGhdPVwiY3VycmVudE1vbnRoXCJcbiAgICAgICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgW2ZvY3VzZWRdPVwiZm9jdXNlZFwiPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxkaXYgY2xhc3M9XCJuZ2ItZHAtaGVhZGVyIGJnLWxpZ2h0XCI+XG4gICAgICA8bmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbiAqbmdJZj1cIm5hdmlnYXRpb24gIT09ICdub25lJ1wiXG4gICAgICAgIFtkYXRlXT1cIm1vZGVsLmZpcnN0RGF0ZVwiXG4gICAgICAgIFttb250aHNdPVwibW9kZWwubW9udGhzXCJcbiAgICAgICAgW2Rpc2FibGVkXT1cIm1vZGVsLmRpc2FibGVkXCJcbiAgICAgICAgW3Nob3dTZWxlY3RdPVwibW9kZWwubmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCdcIlxuICAgICAgICBbcHJldkRpc2FibGVkXT1cIm1vZGVsLnByZXZEaXNhYmxlZFwiXG4gICAgICAgIFtuZXh0RGlzYWJsZWRdPVwibW9kZWwubmV4dERpc2FibGVkXCJcbiAgICAgICAgW3NlbGVjdEJveGVzXT1cIm1vZGVsLnNlbGVjdEJveGVzXCJcbiAgICAgICAgKG5hdmlnYXRlKT1cIm9uTmF2aWdhdGVFdmVudCgkZXZlbnQpXCJcbiAgICAgICAgKHNlbGVjdCk9XCJvbk5hdmlnYXRlRGF0ZVNlbGVjdCgkZXZlbnQpXCI+XG4gICAgICA8L25nYi1kYXRlcGlja2VyLW5hdmlnYXRpb24+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLW1vbnRoc1wiIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQpXCIgKGZvY3VzaW4pPVwic2hvd0ZvY3VzKHRydWUpXCIgKGZvY3Vzb3V0KT1cInNob3dGb2N1cyhmYWxzZSlcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtbW9udGggW25nRm9yT2ZdPVwibW9kZWwubW9udGhzXCIgbGV0LWk9XCJpbmRleFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLW1vbnRoXCI+XG4gICAgICAgICAgPGRpdiAqbmdJZj1cIm5hdmlnYXRpb24gPT09ICdub25lJyB8fCAoZGlzcGxheU1vbnRocyA+IDEgJiYgbmF2aWdhdGlvbiA9PT0gJ3NlbGVjdCcpXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cIm5nYi1kcC1tb250aC1uYW1lIGJnLWxpZ2h0XCI+XG4gICAgICAgICAgICB7eyBpMThuLmdldE1vbnRoRnVsbE5hbWUobW9udGgubnVtYmVyKSB9fSB7eyBpMThuLmdldFllYXJOdW1lcmFscyhtb250aC55ZWFyKSB9fVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxuZ2ItZGF0ZXBpY2tlci1tb250aC12aWV3XG4gICAgICAgICAgICBbbW9udGhdPVwibW9udGhcIlxuICAgICAgICAgICAgW2RheVRlbXBsYXRlXT1cImRheVRlbXBsYXRlIHx8IGR0XCJcbiAgICAgICAgICAgIFtzaG93V2Vla2RheXNdPVwic2hvd1dlZWtkYXlzXCJcbiAgICAgICAgICAgIFtzaG93V2Vla051bWJlcnNdPVwic2hvd1dlZWtOdW1iZXJzXCJcbiAgICAgICAgICAgIChzZWxlY3QpPVwib25EYXRlU2VsZWN0KCRldmVudClcIj5cbiAgICAgICAgICA8L25nYi1kYXRlcGlja2VyLW1vbnRoLXZpZXc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgcHJvdmlkZXJzOiBbTkdCX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IsIE5nYkRhdGVwaWNrZXJTZXJ2aWNlLCBOZ2JEYXRlcGlja2VyS2V5TWFwU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlciBpbXBsZW1lbnRzIE9uRGVzdHJveSxcbiAgICBPbkNoYW5nZXMsIE9uSW5pdCwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xuICBtb2RlbDogRGF0ZXBpY2tlclZpZXdNb2RlbDtcblxuICBwcml2YXRlIF9zdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfc2VsZWN0U3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIC8qKlxuICAgKiBSZWZlcmVuY2UgZm9yIHRoZSBjdXN0b20gdGVtcGxhdGUgZm9yIHRoZSBkYXkgZGlzcGxheVxuICAgKi9cbiAgQElucHV0KCkgZGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPERheVRlbXBsYXRlQ29udGV4dD47XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBtb250aHMgdG8gZGlzcGxheVxuICAgKi9cbiAgQElucHV0KCkgZGlzcGxheU1vbnRoczogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGaXJzdCBkYXkgb2YgdGhlIHdlZWsuIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICd3ZWVrZGF5JyBpcyAxPU1vbiAuLi4gNz1TdW5cbiAgICovXG4gIEBJbnB1dCgpIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIG1hcmsgYSBnaXZlbiBkYXRlIGFzIGRpc2FibGVkLlxuICAgKiAnQ3VycmVudCcgY29udGFpbnMgdGhlIG1vbnRoIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdGhlIHZpZXdcbiAgICovXG4gIEBJbnB1dCgpIG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBNYXggZGF0ZSBmb3IgdGhlIG5hdmlnYXRpb24uIElmIG5vdCBwcm92aWRlZCwgJ3llYXInIHNlbGVjdCBib3ggd2lsbCBkaXNwbGF5IDEwIHllYXJzIGFmdGVyIGN1cnJlbnQgbW9udGhcbiAgICovXG4gIEBJbnB1dCgpIG1heERhdGU6IE5nYkRhdGVTdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIE1pbiBkYXRlIGZvciB0aGUgbmF2aWdhdGlvbi4gSWYgbm90IHByb3ZpZGVkLCAneWVhcicgc2VsZWN0IGJveCB3aWxsIGRpc3BsYXkgMTAgeWVhcnMgYmVmb3JlIGN1cnJlbnQgbW9udGhcbiAgICovXG4gIEBJbnB1dCgpIG1pbkRhdGU6IE5nYkRhdGVTdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRpb24gdHlwZTogYHNlbGVjdGAgKGRlZmF1bHQgd2l0aCBzZWxlY3QgYm94ZXMgZm9yIG1vbnRoIGFuZCB5ZWFyKSwgYGFycm93c2BcbiAgICogKHdpdGhvdXQgc2VsZWN0IGJveGVzLCBvbmx5IG5hdmlnYXRpb24gYXJyb3dzKSBvciBgbm9uZWAgKG5vIG5hdmlnYXRpb24gYXQgYWxsKVxuICAgKi9cbiAgQElucHV0KCkgbmF2aWdhdGlvbjogJ3NlbGVjdCcgfCAnYXJyb3dzJyB8ICdub25lJztcblxuICAvKipcbiAgICogVGhlIHdheSB0byBkaXNwbGF5IGRheXMgdGhhdCBkb24ndCBiZWxvbmcgdG8gY3VycmVudCBtb250aDogYHZpc2libGVgIChkZWZhdWx0KSxcbiAgICogYGhpZGRlbmAgKG5vdCBkaXNwbGF5ZWQpIG9yIGBjb2xsYXBzZWRgIChub3QgZGlzcGxheWVkIHdpdGggZW1wdHkgc3BhY2UgY29sbGFwc2VkKVxuICAgKi9cbiAgQElucHV0KCkgb3V0c2lkZURheXM6ICd2aXNpYmxlJyB8ICdjb2xsYXBzZWQnIHwgJ2hpZGRlbic7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSBkYXlzIG9mIHRoZSB3ZWVrXG4gICAqL1xuICBASW5wdXQoKSBzaG93V2Vla2RheXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSB3ZWVrIG51bWJlcnNcbiAgICovXG4gIEBJbnB1dCgpIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGF0ZSB0byBvcGVuIGNhbGVuZGFyIHdpdGguXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgcHJvdmlkZWQsIGNhbGVuZGFyIHdpbGwgb3BlbiB3aXRoIGN1cnJlbnQgbW9udGguXG4gICAqIFVzZSAnbmF2aWdhdGVUbyhkYXRlKScgYXMgYW4gYWx0ZXJuYXRpdmVcbiAgICovXG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZToge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn07XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gbmF2aWdhdGlvbiBoYXBwZW5zIGFuZCBjdXJyZW50bHkgZGlzcGxheWVkIG1vbnRoIGNoYW5nZXMuXG4gICAqIFNlZSBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudCBmb3IgdGhlIHBheWxvYWQgaW5mby5cbiAgICovXG4gIEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQ+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gdXNlciBzZWxlY3RzIGEgZGF0ZSB1c2luZyBrZXlib2FyZCBvciBtb3VzZS5cbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIGN1cnJlbnRseSBzZWxlY3RlZCBOZ2JEYXRlLlxuICAgKi9cbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2tleU1hcFNlcnZpY2U6IE5nYkRhdGVwaWNrZXJLZXlNYXBTZXJ2aWNlLCBwdWJsaWMgX3NlcnZpY2U6IE5nYkRhdGVwaWNrZXJTZXJ2aWNlLFxuICAgICAgcHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyLCBwdWJsaWMgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4sIGNvbmZpZzogTmdiRGF0ZXBpY2tlckNvbmZpZyxcbiAgICAgIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9uZ2JEYXRlQWRhcHRlcjogTmdiRGF0ZUFkYXB0ZXI8YW55PiwgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUpIHtcbiAgICBbJ2RheVRlbXBsYXRlJywgJ2Rpc3BsYXlNb250aHMnLCAnZmlyc3REYXlPZldlZWsnLCAnbWFya0Rpc2FibGVkJywgJ21pbkRhdGUnLCAnbWF4RGF0ZScsICduYXZpZ2F0aW9uJyxcbiAgICAgJ291dHNpZGVEYXlzJywgJ3Nob3dXZWVrZGF5cycsICdzaG93V2Vla051bWJlcnMnLCAnc3RhcnREYXRlJ11cbiAgICAgICAgLmZvckVhY2goaW5wdXQgPT4gdGhpc1tpbnB1dF0gPSBjb25maWdbaW5wdXRdKTtcblxuICAgIHRoaXMuX3NlbGVjdFN1YnNjcmlwdGlvbiA9IF9zZXJ2aWNlLnNlbGVjdCQuc3Vic2NyaWJlKGRhdGUgPT4geyB0aGlzLnNlbGVjdC5lbWl0KGRhdGUpOyB9KTtcblxuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IF9zZXJ2aWNlLm1vZGVsJC5zdWJzY3JpYmUobW9kZWwgPT4ge1xuICAgICAgY29uc3QgbmV3RGF0ZSA9IG1vZGVsLmZpcnN0RGF0ZTtcbiAgICAgIGNvbnN0IG9sZERhdGUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5maXJzdERhdGUgOiBudWxsO1xuICAgICAgY29uc3QgbmV3U2VsZWN0ZWREYXRlID0gbW9kZWwuc2VsZWN0ZWREYXRlO1xuICAgICAgY29uc3Qgb2xkU2VsZWN0ZWREYXRlID0gdGhpcy5tb2RlbCA/IHRoaXMubW9kZWwuc2VsZWN0ZWREYXRlIDogbnVsbDtcbiAgICAgIGNvbnN0IG5ld0ZvY3VzZWREYXRlID0gbW9kZWwuZm9jdXNEYXRlO1xuICAgICAgY29uc3Qgb2xkRm9jdXNlZERhdGUgPSB0aGlzLm1vZGVsID8gdGhpcy5tb2RlbC5mb2N1c0RhdGUgOiBudWxsO1xuXG4gICAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG5cbiAgICAgIC8vIGhhbmRsaW5nIHNlbGVjdGlvbiBjaGFuZ2VcbiAgICAgIGlmIChpc0NoYW5nZWREYXRlKG5ld1NlbGVjdGVkRGF0ZSwgb2xkU2VsZWN0ZWREYXRlKSkge1xuICAgICAgICB0aGlzLm9uVG91Y2hlZCgpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuX25nYkRhdGVBZGFwdGVyLnRvTW9kZWwobmV3U2VsZWN0ZWREYXRlKSk7XG4gICAgICB9XG5cbiAgICAgIC8vIGhhbmRsaW5nIGZvY3VzIGNoYW5nZVxuICAgICAgaWYgKGlzQ2hhbmdlZERhdGUobmV3Rm9jdXNlZERhdGUsIG9sZEZvY3VzZWREYXRlKSAmJiBvbGRGb2N1c2VkRGF0ZSAmJiBtb2RlbC5mb2N1c1Zpc2libGUpIHtcbiAgICAgICAgdGhpcy5mb2N1cygpO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0dGluZyBuYXZpZ2F0aW9uIGV2ZW50IGlmIHRoZSBmaXJzdCBtb250aCBjaGFuZ2VzXG4gICAgICBpZiAoIW5ld0RhdGUuZXF1YWxzKG9sZERhdGUpKSB7XG4gICAgICAgIHRoaXMubmF2aWdhdGUuZW1pdCh7XG4gICAgICAgICAgY3VycmVudDogb2xkRGF0ZSA/IHt5ZWFyOiBvbGREYXRlLnllYXIsIG1vbnRoOiBvbGREYXRlLm1vbnRofSA6IG51bGwsXG4gICAgICAgICAgbmV4dDoge3llYXI6IG5ld0RhdGUueWVhciwgbW9udGg6IG5ld0RhdGUubW9udGh9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgX2NkLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IGZvY3VzIHRoZSBmb2N1c2FibGUgZGF5IGluIHRoZSBkYXRlcGlja2VyXG4gICAqL1xuICBmb2N1cygpIHtcbiAgICB0aGlzLl9uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgY29uc3QgZWxlbWVudFRvRm9jdXMgPVxuICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5xdWVyeVNlbGVjdG9yPEhUTUxEaXZFbGVtZW50PignZGl2Lm5nYi1kcC1kYXlbdGFiaW5kZXg9XCIwXCJdJyk7XG4gICAgICBpZiAoZWxlbWVudFRvRm9jdXMpIHtcbiAgICAgICAgZWxlbWVudFRvRm9jdXMuZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgY3VycmVudCB2aWV3IHRvIHByb3ZpZGVkIGRhdGUuXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgcHJvdmlkZWQgY2FsZW5kYXIgd2lsbCBvcGVuIGN1cnJlbnQgbW9udGguXG4gICAqIFVzZSAnc3RhcnREYXRlJyBpbnB1dCBhcyBhbiBhbHRlcm5hdGl2ZVxuICAgKi9cbiAgbmF2aWdhdGVUbyhkYXRlPzoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn0pIHtcbiAgICB0aGlzLl9zZXJ2aWNlLm9wZW4oTmdiRGF0ZS5mcm9tKGRhdGUgPyB7Li4uZGF0ZSwgZGF5OiAxfSA6IG51bGwpKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuX3NlbGVjdFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgaWYgKHRoaXMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgWydkaXNwbGF5TW9udGhzJywgJ21hcmtEaXNhYmxlZCcsICdmaXJzdERheU9mV2VlaycsICduYXZpZ2F0aW9uJywgJ21pbkRhdGUnLCAnbWF4RGF0ZScsICdvdXRzaWRlRGF5cyddLmZvckVhY2goXG4gICAgICAgICAgaW5wdXQgPT4gdGhpcy5fc2VydmljZVtpbnB1dF0gPSB0aGlzW2lucHV0XSk7XG4gICAgICB0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGFydERhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBbJ2Rpc3BsYXlNb250aHMnLCAnbWFya0Rpc2FibGVkJywgJ2ZpcnN0RGF5T2ZXZWVrJywgJ25hdmlnYXRpb24nLCAnbWluRGF0ZScsICdtYXhEYXRlJywgJ291dHNpZGVEYXlzJ11cbiAgICAgICAgLmZpbHRlcihpbnB1dCA9PiBpbnB1dCBpbiBjaGFuZ2VzKVxuICAgICAgICAuZm9yRWFjaChpbnB1dCA9PiB0aGlzLl9zZXJ2aWNlW2lucHV0XSA9IHRoaXNbaW5wdXRdKTtcblxuICAgIGlmICgnc3RhcnREYXRlJyBpbiBjaGFuZ2VzKSB7XG4gICAgICB0aGlzLm5hdmlnYXRlVG8odGhpcy5zdGFydERhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG9uRGF0ZVNlbGVjdChkYXRlOiBOZ2JEYXRlKSB7XG4gICAgdGhpcy5fc2VydmljZS5mb2N1cyhkYXRlKTtcbiAgICB0aGlzLl9zZXJ2aWNlLnNlbGVjdChkYXRlLCB7ZW1pdEV2ZW50OiB0cnVlfSk7XG4gIH1cblxuICBvbktleURvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpIHsgdGhpcy5fa2V5TWFwU2VydmljZS5wcm9jZXNzS2V5KGV2ZW50KTsgfVxuXG4gIG9uTmF2aWdhdGVEYXRlU2VsZWN0KGRhdGU6IE5nYkRhdGUpIHsgdGhpcy5fc2VydmljZS5vcGVuKGRhdGUpOyB9XG5cbiAgb25OYXZpZ2F0ZUV2ZW50KGV2ZW50OiBOYXZpZ2F0aW9uRXZlbnQpIHtcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlIE5hdmlnYXRpb25FdmVudC5QUkVWOlxuICAgICAgICB0aGlzLl9zZXJ2aWNlLm9wZW4odGhpcy5fY2FsZW5kYXIuZ2V0UHJldih0aGlzLm1vZGVsLmZpcnN0RGF0ZSwgJ20nLCAxKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBOYXZpZ2F0aW9uRXZlbnQuTkVYVDpcbiAgICAgICAgdGhpcy5fc2VydmljZS5vcGVuKHRoaXMuX2NhbGVuZGFyLmdldE5leHQodGhpcy5tb2RlbC5maXJzdERhdGUsICdtJywgMSkpO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikgeyB0aGlzLl9zZXJ2aWNlLmRpc2FibGVkID0gaXNEaXNhYmxlZDsgfVxuXG4gIHNob3dGb2N1cyhmb2N1c1Zpc2libGU6IGJvb2xlYW4pIHsgdGhpcy5fc2VydmljZS5mb2N1c1Zpc2libGUgPSBmb2N1c1Zpc2libGU7IH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7IHRoaXMuX3NlcnZpY2Uuc2VsZWN0KE5nYkRhdGUuZnJvbSh0aGlzLl9uZ2JEYXRlQWRhcHRlci5mcm9tTW9kZWwodmFsdWUpKSk7IH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYsIE91dHB1dCwgRXZlbnRFbWl0dGVyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TW9udGhWaWV3TW9kZWwsIERheVZpZXdNb2RlbH0gZnJvbSAnLi9kYXRlcGlja2VyLXZpZXctbW9kZWwnO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG59IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7RGF5VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItZGF0ZXBpY2tlci1tb250aC12aWV3JyxcbiAgaG9zdDogeydyb2xlJzogJ2dyaWQnfSxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0IHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cbiAgICAubmdiLWRwLXdlZWtkYXksIC5uZ2ItZHAtd2Vlay1udW1iZXIge1xuICAgICAgbGluZS1oZWlnaHQ6IDJyZW07XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBmb250LXN0eWxlOiBpdGFsaWM7XG4gICAgfVxuICAgIC5uZ2ItZHAtd2Vla2RheSB7XG4gICAgICBjb2xvcjogIzViYzBkZTtcbiAgICAgIGNvbG9yOiB2YXIoLS1pbmZvKTtcbiAgICB9XG4gICAgLm5nYi1kcC13ZWVrIHtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG4gICAgICBkaXNwbGF5OiAtbXMtZmxleGJveDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuICAgIC5uZ2ItZHAtd2Vla2RheXMge1xuICAgICAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHJnYmEoMCwgMCwgMCwgMC4xMjUpO1xuICAgICAgYm9yZGVyLXJhZGl1czogMDtcbiAgICB9XG4gICAgLm5nYi1kcC1kYXksIC5uZ2ItZHAtd2Vla2RheSwgLm5nYi1kcC13ZWVrLW51bWJlciB7XG4gICAgICB3aWR0aDogMnJlbTtcbiAgICAgIGhlaWdodDogMnJlbTtcbiAgICB9XG4gICAgLm5nYi1kcC1kYXkge1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgICAubmdiLWRwLWRheS5kaXNhYmxlZCwgLm5nYi1kcC1kYXkuaGlkZGVuIHtcbiAgICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nSWY9XCJzaG93V2Vla2RheXNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrIG5nYi1kcC13ZWVrZGF5cyBiZy1saWdodFwiPlxuICAgICAgPGRpdiAqbmdJZj1cInNob3dXZWVrTnVtYmVyc1wiIGNsYXNzPVwibmdiLWRwLXdlZWtkYXkgbmdiLWRwLXNob3d3ZWVrXCI+PC9kaXY+XG4gICAgICA8ZGl2ICpuZ0Zvcj1cImxldCB3IG9mIG1vbnRoLndlZWtkYXlzXCIgY2xhc3M9XCJuZ2ItZHAtd2Vla2RheSBzbWFsbFwiPlxuICAgICAgICB7eyBpMThuLmdldFdlZWtkYXlTaG9ydE5hbWUodykgfX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtd2VlayBbbmdGb3JPZl09XCJtb250aC53ZWVrc1wiPlxuICAgICAgPGRpdiAqbmdJZj1cIiF3ZWVrLmNvbGxhcHNlZFwiIGNsYXNzPVwibmdiLWRwLXdlZWtcIiByb2xlPVwicm93XCI+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJzaG93V2Vla051bWJlcnNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrLW51bWJlciBzbWFsbCB0ZXh0LW11dGVkXCI+e3sgaTE4bi5nZXRXZWVrTnVtZXJhbHMod2Vlay5udW1iZXIpIH19PC9kaXY+XG4gICAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGRheSBvZiB3ZWVrLmRheXNcIiAoY2xpY2spPVwiZG9TZWxlY3QoZGF5KVwiIGNsYXNzPVwibmdiLWRwLWRheVwiIHJvbGU9XCJncmlkY2VsbFwiXG4gICAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cImRheS5jb250ZXh0LmRpc2FibGVkXCJcbiAgICAgICAgICBbdGFiaW5kZXhdPVwiZGF5LnRhYmluZGV4XCJcbiAgICAgICAgICBbY2xhc3MuaGlkZGVuXT1cImRheS5oaWRkZW5cIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiZGF5LmFyaWFMYWJlbFwiPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCIhZGF5LmhpZGRlblwiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImRheVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImRheS5jb250ZXh0XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck1vbnRoVmlldyB7XG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuICBASW5wdXQoKSBtb250aDogTW9udGhWaWV3TW9kZWw7XG4gIEBJbnB1dCgpIHNob3dXZWVrZGF5cztcbiAgQElucHV0KCkgc2hvd1dlZWtOdW1iZXJzO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxuXG4gIGRvU2VsZWN0KGRheTogRGF5Vmlld01vZGVsKSB7XG4gICAgaWYgKCFkYXkuY29udGV4dC5kaXNhYmxlZCAmJiAhZGF5LmhpZGRlbikge1xuICAgICAgdGhpcy5zZWxlY3QuZW1pdChkYXkuZGF0ZSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05hdmlnYXRpb25FdmVudCwgTW9udGhWaWV3TW9kZWx9IGZyb20gJy4vZGF0ZXBpY2tlci12aWV3LW1vZGVsJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5cbi8vIFRoZSAtbXMtIGFuZCAtd2Via2l0LSBlbGVtZW50IGZvciB0aGUgQ1NTIGNhbiBiZSByZW1vdmVkIGlmIHdlIGFyZSBnZW5lcmF0aW5nIHRoZSBDU1MgdXNpbmcgU0FTUy5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyLW5hdmlnYXRpb24nLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0IHtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgfVxuICAgIC5uZ2ItZHAtbmF2aWdhdGlvbi1jaGV2cm9uIHtcbiAgICAgIGJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgICBib3JkZXItd2lkdGg6IDAuMmVtIDAuMmVtIDAgMDtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIHdpZHRoOiAwLjc1ZW07XG4gICAgICBoZWlnaHQ6IDAuNzVlbTtcbiAgICAgIG1hcmdpbi1sZWZ0OiAwLjI1ZW07XG4gICAgICBtYXJnaW4tcmlnaHQ6IDAuMTVlbTtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKC0xMzVkZWcpO1xuICAgICAgLW1zLXRyYW5zZm9ybTogcm90YXRlKC0xMzVkZWcpO1xuICAgIH1cbiAgICAucmlnaHQgLm5nYi1kcC1uYXZpZ2F0aW9uLWNoZXZyb24ge1xuICAgICAgLW1zLXRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcbiAgICAgIHRyYW5zZm9ybTogcm90YXRlKDQ1ZGVnKTtcbiAgICAgIG1hcmdpbi1sZWZ0OiAwLjE1ZW07XG4gICAgICBtYXJnaW4tcmlnaHQ6IDAuMjVlbTtcbiAgICB9XG4gICAgLm5nYi1kcC1hcnJvdyB7XG4gICAgICBkaXNwbGF5OiAtbXMtZmxleGJveDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAtbXMtZmxleDogMSAxIGF1dG87XG4gICAgICBmbGV4LWdyb3c6IDE7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiAwO1xuICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgICAgbWFyZ2luOiAwO1xuICAgICAgd2lkdGg6IDJyZW07XG4gICAgICBoZWlnaHQ6IDJyZW07XG4gICAgfVxuICAgIC5uZ2ItZHAtYXJyb3cucmlnaHQge1xuICAgICAgLW1zLWZsZXgtcGFjazogZW5kO1xuICAgICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgICB9XG4gICAgLm5nYi1kcC1hcnJvdy1idG4ge1xuICAgICAgcGFkZGluZzogMCAwLjI1cmVtO1xuICAgICAgbWFyZ2luOiAwIDAuNXJlbTtcbiAgICAgIGJvcmRlcjogbm9uZTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuICAgICAgei1pbmRleDogMTtcbiAgICB9XG4gICAgLm5nYi1kcC1hcnJvdy1idG46Zm9jdXMge1xuICAgICAgb3V0bGluZTogYXV0byAxcHg7XG4gICAgfVxuICAgIC5uZ2ItZHAtbW9udGgtbmFtZSB7XG4gICAgICBmb250LXNpemU6IGxhcmdlcjtcbiAgICAgIGhlaWdodDogMnJlbTtcbiAgICAgIGxpbmUtaGVpZ2h0OiAycmVtO1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbiAgICAubmdiLWRwLW5hdmlnYXRpb24tc2VsZWN0IHtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIC1tcy1mbGV4OiAxIDEgOXJlbTtcbiAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgIGZsZXgtYmFzaXM6IDlyZW07XG4gICAgfVxuICBgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLWFycm93XCI+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGluayBuZ2ItZHAtYXJyb3ctYnRuXCIgKGNsaWNrKT1cIiEhbmF2aWdhdGUuZW1pdChuYXZpZ2F0aW9uLlBSRVYpXCIgW2Rpc2FibGVkXT1cInByZXZEaXNhYmxlZFwiXG4gICAgICAgICAgICAgIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLmRhdGVwaWNrZXIucHJldmlvdXMtbW9udGhcIiBhcmlhLWxhYmVsPVwiUHJldmlvdXMgbW9udGhcIlxuICAgICAgICAgICAgICBpMThuLXRpdGxlPVwiQEBuZ2IuZGF0ZXBpY2tlci5wcmV2aW91cy1tb250aFwiIHRpdGxlPVwiUHJldmlvdXMgbW9udGhcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJuZ2ItZHAtbmF2aWdhdGlvbi1jaGV2cm9uXCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgPG5nYi1kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0ICpuZ0lmPVwic2hvd1NlbGVjdFwiIGNsYXNzPVwibmdiLWRwLW5hdmlnYXRpb24tc2VsZWN0XCJcbiAgICAgIFtkYXRlXT1cImRhdGVcIlxuICAgICAgW2Rpc2FibGVkXSA9IFwiZGlzYWJsZWRcIlxuICAgICAgW21vbnRoc109XCJzZWxlY3RCb3hlcy5tb250aHNcIlxuICAgICAgW3llYXJzXT1cInNlbGVjdEJveGVzLnllYXJzXCJcbiAgICAgIChzZWxlY3QpPVwic2VsZWN0LmVtaXQoJGV2ZW50KVwiPlxuICAgIDwvbmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3Q+XG5cbiAgICA8bmctdGVtcGxhdGUgKm5nSWY9XCIhc2hvd1NlbGVjdFwiIG5nRm9yIGxldC1tb250aCBbbmdGb3JPZl09XCJtb250aHNcIiBsZXQtaT1cImluZGV4XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLWFycm93XCIgKm5nSWY9XCJpID4gMFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1tb250aC1uYW1lXCI+XG4gICAgICAgIHt7IGkxOG4uZ2V0TW9udGhGdWxsTmFtZShtb250aC5udW1iZXIpIH19IHt7IG1vbnRoLnllYXIgfX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1hcnJvd1wiICpuZ0lmPVwiaSAhPT0gbW9udGhzLmxlbmd0aCAtIDFcIj48L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICAgIDxkaXYgY2xhc3M9XCJuZ2ItZHAtYXJyb3cgcmlnaHRcIj5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rIG5nYi1kcC1hcnJvdy1idG5cIiAoY2xpY2spPVwiISFuYXZpZ2F0ZS5lbWl0KG5hdmlnYXRpb24uTkVYVClcIiBbZGlzYWJsZWRdPVwibmV4dERpc2FibGVkXCJcbiAgICAgICAgICAgICAgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IuZGF0ZXBpY2tlci5uZXh0LW1vbnRoXCIgYXJpYS1sYWJlbD1cIk5leHQgbW9udGhcIlxuICAgICAgICAgICAgICBpMThuLXRpdGxlPVwiQEBuZ2IuZGF0ZXBpY2tlci5uZXh0LW1vbnRoXCIgdGl0bGU9XCJOZXh0IG1vbnRoXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzPVwibmdiLWRwLW5hdmlnYXRpb24tY2hldnJvblwiPjwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb24ge1xuICBuYXZpZ2F0aW9uID0gTmF2aWdhdGlvbkV2ZW50O1xuXG4gIEBJbnB1dCgpIGRhdGU6IE5nYkRhdGU7XG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBtb250aHM6IE1vbnRoVmlld01vZGVsW10gPSBbXTtcbiAgQElucHV0KCkgc2hvd1NlbGVjdDogYm9vbGVhbjtcbiAgQElucHV0KCkgcHJldkRpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBuZXh0RGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNlbGVjdEJveGVzOiB7eWVhcnM6IG51bWJlcltdLCBtb250aHM6IG51bWJlcltdfTtcblxuICBAT3V0cHV0KCkgbmF2aWdhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPE5hdmlnYXRpb25FdmVudD4oKTtcbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4pIHt9XG59XG4iLCJpbXBvcnQge3BhZE51bWJlciwgdG9JbnRlZ2VyLCBpc051bWJlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuXG4vKipcbiAqIEFic3RyYWN0IHR5cGUgc2VydmluZyBhcyBhIERJIHRva2VuIGZvciB0aGUgc2VydmljZSBwYXJzaW5nIGFuZCBmb3JtYXR0aW5nIGRhdGVzIGZvciB0aGUgTmdiSW5wdXREYXRlcGlja2VyXG4gKiBkaXJlY3RpdmUuIEEgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiB1c2luZyB0aGUgSVNPIDg2MDEgZm9ybWF0IGlzIHByb3ZpZGVkLCBidXQgeW91IGNhbiBwcm92aWRlIGFub3RoZXIgaW1wbGVtZW50YXRpb25cbiAqIHRvIHVzZSBhbiBhbHRlcm5hdGl2ZSBmb3JtYXQuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyIHtcbiAgLyoqXG4gICAqIFBhcnNlcyB0aGUgZ2l2ZW4gdmFsdWUgdG8gYW4gTmdiRGF0ZVN0cnVjdC4gSW1wbGVtZW50YXRpb25zIHNob3VsZCB0cnkgdGhlaXIgYmVzdCB0byBwcm92aWRlIGEgcmVzdWx0LCBldmVuXG4gICAqIHBhcnRpYWwuIFRoZXkgbXVzdCByZXR1cm4gbnVsbCBpZiB0aGUgdmFsdWUgY2FuJ3QgYmUgcGFyc2VkLlxuICAgKiBAcGFyYW0gdmFsdWUgdGhlIHZhbHVlIHRvIHBhcnNlXG4gICAqL1xuICBhYnN0cmFjdCBwYXJzZSh2YWx1ZTogc3RyaW5nKTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogRm9ybWF0cyB0aGUgZ2l2ZW4gZGF0ZSB0byBhIHN0cmluZy4gSW1wbGVtZW50YXRpb25zIHNob3VsZCByZXR1cm4gYW4gZW1wdHkgc3RyaW5nIGlmIHRoZSBnaXZlbiBkYXRlIGlzIG51bGwsXG4gICAqIGFuZCB0cnkgdGhlaXIgYmVzdCB0byBwcm92aWRlIGEgcGFydGlhbCByZXN1bHQgaWYgdGhlIGdpdmVuIGRhdGUgaXMgaW5jb21wbGV0ZSBvciBpbnZhbGlkLlxuICAgKiBAcGFyYW0gZGF0ZSB0aGUgZGF0ZSB0byBmb3JtYXQgYXMgYSBzdHJpbmdcbiAgICovXG4gIGFic3RyYWN0IGZvcm1hdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgTmdiRGF0ZUlTT1BhcnNlckZvcm1hdHRlciBleHRlbmRzIE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIge1xuICBwYXJzZSh2YWx1ZTogc3RyaW5nKTogTmdiRGF0ZVN0cnVjdCB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICBjb25zdCBkYXRlUGFydHMgPSB2YWx1ZS50cmltKCkuc3BsaXQoJy0nKTtcbiAgICAgIGlmIChkYXRlUGFydHMubGVuZ3RoID09PSAxICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1swXSkpIHtcbiAgICAgICAgcmV0dXJuIHt5ZWFyOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzBdKSwgbW9udGg6IG51bGwsIGRheTogbnVsbH07XG4gICAgICB9IGVsc2UgaWYgKGRhdGVQYXJ0cy5sZW5ndGggPT09IDIgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzBdKSAmJiBpc051bWJlcihkYXRlUGFydHNbMV0pKSB7XG4gICAgICAgIHJldHVybiB7eWVhcjogdG9JbnRlZ2VyKGRhdGVQYXJ0c1swXSksIG1vbnRoOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzFdKSwgZGF5OiBudWxsfTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0ZVBhcnRzLmxlbmd0aCA9PT0gMyAmJiBpc051bWJlcihkYXRlUGFydHNbMF0pICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1sxXSkgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzJdKSkge1xuICAgICAgICByZXR1cm4ge3llYXI6IHRvSW50ZWdlcihkYXRlUGFydHNbMF0pLCBtb250aDogdG9JbnRlZ2VyKGRhdGVQYXJ0c1sxXSksIGRheTogdG9JbnRlZ2VyKGRhdGVQYXJ0c1syXSl9O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGZvcm1hdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nIHtcbiAgICByZXR1cm4gZGF0ZSA/XG4gICAgICAgIGAke2RhdGUueWVhcn0tJHtpc051bWJlcihkYXRlLm1vbnRoKSA/IHBhZE51bWJlcihkYXRlLm1vbnRoKSA6ICcnfS0ke2lzTnVtYmVyKGRhdGUuZGF5KSA/IHBhZE51bWJlcihkYXRlLmRheSkgOiAnJ31gIDpcbiAgICAgICAgJyc7XG4gIH1cbn1cbiIsIi8vIHByZXZpb3VzIHZlcnNpb246XG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci11aS9ib290c3RyYXAvYmxvYi8wN2MzMWQwNzMxZjdjYjA2OGExOTMyYjhlMDFkMjMxMmI3OTZiNGVjL3NyYy9wb3NpdGlvbi9wb3NpdGlvbi5qc1xuZXhwb3J0IGNsYXNzIFBvc2l0aW9uaW5nIHtcbiAgcHJpdmF0ZSBnZXRBbGxTdHlsZXMoZWxlbWVudDogSFRNTEVsZW1lbnQpIHsgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpOyB9XG5cbiAgcHJpdmF0ZSBnZXRTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgcHJvcDogc3RyaW5nKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuZ2V0QWxsU3R5bGVzKGVsZW1lbnQpW3Byb3BdOyB9XG5cbiAgcHJpdmF0ZSBpc1N0YXRpY1Bvc2l0aW9uZWQoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMuZ2V0U3R5bGUoZWxlbWVudCwgJ3Bvc2l0aW9uJykgfHwgJ3N0YXRpYycpID09PSAnc3RhdGljJztcbiAgfVxuXG4gIHByaXZhdGUgb2Zmc2V0UGFyZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGxldCBvZmZzZXRQYXJlbnRFbCA9IDxIVE1MRWxlbWVudD5lbGVtZW50Lm9mZnNldFBhcmVudCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cbiAgICB3aGlsZSAob2Zmc2V0UGFyZW50RWwgJiYgb2Zmc2V0UGFyZW50RWwgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiB0aGlzLmlzU3RhdGljUG9zaXRpb25lZChvZmZzZXRQYXJlbnRFbCkpIHtcbiAgICAgIG9mZnNldFBhcmVudEVsID0gPEhUTUxFbGVtZW50Pm9mZnNldFBhcmVudEVsLm9mZnNldFBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gb2Zmc2V0UGFyZW50RWwgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICB9XG5cbiAgcG9zaXRpb24oZWxlbWVudDogSFRNTEVsZW1lbnQsIHJvdW5kID0gdHJ1ZSk6IENsaWVudFJlY3Qge1xuICAgIGxldCBlbFBvc2l0aW9uOiBDbGllbnRSZWN0O1xuICAgIGxldCBwYXJlbnRPZmZzZXQ6IENsaWVudFJlY3QgPSB7d2lkdGg6IDAsIGhlaWdodDogMCwgdG9wOiAwLCBib3R0b206IDAsIGxlZnQ6IDAsIHJpZ2h0OiAwfTtcblxuICAgIGlmICh0aGlzLmdldFN0eWxlKGVsZW1lbnQsICdwb3NpdGlvbicpID09PSAnZml4ZWQnKSB7XG4gICAgICBlbFBvc2l0aW9uID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3Qgb2Zmc2V0UGFyZW50RWwgPSB0aGlzLm9mZnNldFBhcmVudChlbGVtZW50KTtcblxuICAgICAgZWxQb3NpdGlvbiA9IHRoaXMub2Zmc2V0KGVsZW1lbnQsIGZhbHNlKTtcblxuICAgICAgaWYgKG9mZnNldFBhcmVudEVsICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgcGFyZW50T2Zmc2V0ID0gdGhpcy5vZmZzZXQob2Zmc2V0UGFyZW50RWwsIGZhbHNlKTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50T2Zmc2V0LnRvcCArPSBvZmZzZXRQYXJlbnRFbC5jbGllbnRUb3A7XG4gICAgICBwYXJlbnRPZmZzZXQubGVmdCArPSBvZmZzZXRQYXJlbnRFbC5jbGllbnRMZWZ0O1xuICAgIH1cblxuICAgIGVsUG9zaXRpb24udG9wIC09IHBhcmVudE9mZnNldC50b3A7XG4gICAgZWxQb3NpdGlvbi5ib3R0b20gLT0gcGFyZW50T2Zmc2V0LnRvcDtcbiAgICBlbFBvc2l0aW9uLmxlZnQgLT0gcGFyZW50T2Zmc2V0LmxlZnQ7XG4gICAgZWxQb3NpdGlvbi5yaWdodCAtPSBwYXJlbnRPZmZzZXQubGVmdDtcblxuICAgIGlmIChyb3VuZCkge1xuICAgICAgZWxQb3NpdGlvbi50b3AgPSBNYXRoLnJvdW5kKGVsUG9zaXRpb24udG9wKTtcbiAgICAgIGVsUG9zaXRpb24uYm90dG9tID0gTWF0aC5yb3VuZChlbFBvc2l0aW9uLmJvdHRvbSk7XG4gICAgICBlbFBvc2l0aW9uLmxlZnQgPSBNYXRoLnJvdW5kKGVsUG9zaXRpb24ubGVmdCk7XG4gICAgICBlbFBvc2l0aW9uLnJpZ2h0ID0gTWF0aC5yb3VuZChlbFBvc2l0aW9uLnJpZ2h0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gZWxQb3NpdGlvbjtcbiAgfVxuXG4gIG9mZnNldChlbGVtZW50OiBIVE1MRWxlbWVudCwgcm91bmQgPSB0cnVlKTogQ2xpZW50UmVjdCB7XG4gICAgY29uc3QgZWxCY3IgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHZpZXdwb3J0T2Zmc2V0ID0ge1xuICAgICAgdG9wOiB3aW5kb3cucGFnZVlPZmZzZXQgLSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50VG9wLFxuICAgICAgbGVmdDogd2luZG93LnBhZ2VYT2Zmc2V0IC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudExlZnRcbiAgICB9O1xuXG4gICAgbGV0IGVsT2Zmc2V0ID0ge1xuICAgICAgaGVpZ2h0OiBlbEJjci5oZWlnaHQgfHwgZWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICB3aWR0aDogZWxCY3Iud2lkdGggfHwgZWxlbWVudC5vZmZzZXRXaWR0aCxcbiAgICAgIHRvcDogZWxCY3IudG9wICsgdmlld3BvcnRPZmZzZXQudG9wLFxuICAgICAgYm90dG9tOiBlbEJjci5ib3R0b20gKyB2aWV3cG9ydE9mZnNldC50b3AsXG4gICAgICBsZWZ0OiBlbEJjci5sZWZ0ICsgdmlld3BvcnRPZmZzZXQubGVmdCxcbiAgICAgIHJpZ2h0OiBlbEJjci5yaWdodCArIHZpZXdwb3J0T2Zmc2V0LmxlZnRcbiAgICB9O1xuXG4gICAgaWYgKHJvdW5kKSB7XG4gICAgICBlbE9mZnNldC5oZWlnaHQgPSBNYXRoLnJvdW5kKGVsT2Zmc2V0LmhlaWdodCk7XG4gICAgICBlbE9mZnNldC53aWR0aCA9IE1hdGgucm91bmQoZWxPZmZzZXQud2lkdGgpO1xuICAgICAgZWxPZmZzZXQudG9wID0gTWF0aC5yb3VuZChlbE9mZnNldC50b3ApO1xuICAgICAgZWxPZmZzZXQuYm90dG9tID0gTWF0aC5yb3VuZChlbE9mZnNldC5ib3R0b20pO1xuICAgICAgZWxPZmZzZXQubGVmdCA9IE1hdGgucm91bmQoZWxPZmZzZXQubGVmdCk7XG4gICAgICBlbE9mZnNldC5yaWdodCA9IE1hdGgucm91bmQoZWxPZmZzZXQucmlnaHQpO1xuICAgIH1cblxuICAgIHJldHVybiBlbE9mZnNldDtcbiAgfVxuXG4gIHBvc2l0aW9uRWxlbWVudHMoaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50LCB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCwgcGxhY2VtZW50OiBzdHJpbmcsIGFwcGVuZFRvQm9keT86IGJvb2xlYW4pOlxuICAgICAgQ2xpZW50UmVjdCB7XG4gICAgY29uc3QgaG9zdEVsUG9zaXRpb24gPSBhcHBlbmRUb0JvZHkgPyB0aGlzLm9mZnNldChob3N0RWxlbWVudCwgZmFsc2UpIDogdGhpcy5wb3NpdGlvbihob3N0RWxlbWVudCwgZmFsc2UpO1xuICAgIGNvbnN0IHRhcmdldEVsU3R5bGVzID0gdGhpcy5nZXRBbGxTdHlsZXModGFyZ2V0RWxlbWVudCk7XG4gICAgY29uc3QgdGFyZ2V0RWxCQ1IgPSB0YXJnZXRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IHBsYWNlbWVudFByaW1hcnkgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVswXSB8fCAndG9wJztcbiAgICBjb25zdCBwbGFjZW1lbnRTZWNvbmRhcnkgPSBwbGFjZW1lbnQuc3BsaXQoJy0nKVsxXSB8fCAnY2VudGVyJztcblxuICAgIGxldCB0YXJnZXRFbFBvc2l0aW9uOiBDbGllbnRSZWN0ID0ge1xuICAgICAgJ2hlaWdodCc6IHRhcmdldEVsQkNSLmhlaWdodCB8fCB0YXJnZXRFbGVtZW50Lm9mZnNldEhlaWdodCxcbiAgICAgICd3aWR0aCc6IHRhcmdldEVsQkNSLndpZHRoIHx8IHRhcmdldEVsZW1lbnQub2Zmc2V0V2lkdGgsXG4gICAgICAndG9wJzogMCxcbiAgICAgICdib3R0b20nOiB0YXJnZXRFbEJDUi5oZWlnaHQgfHwgdGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQsXG4gICAgICAnbGVmdCc6IDAsXG4gICAgICAncmlnaHQnOiB0YXJnZXRFbEJDUi53aWR0aCB8fCB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoXG4gICAgfTtcblxuICAgIHN3aXRjaCAocGxhY2VtZW50UHJpbWFyeSkge1xuICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgdGFyZ2V0RWxQb3NpdGlvbi50b3AgPVxuICAgICAgICAgICAgaG9zdEVsUG9zaXRpb24udG9wIC0gKHRhcmdldEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgcGFyc2VGbG9hdCh0YXJnZXRFbFN0eWxlcy5tYXJnaW5Cb3R0b20pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLnRvcCA9IGhvc3RFbFBvc2l0aW9uLnRvcCArIGhvc3RFbFBvc2l0aW9uLmhlaWdodDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgdGFyZ2V0RWxQb3NpdGlvbi5sZWZ0ID1cbiAgICAgICAgICAgIGhvc3RFbFBvc2l0aW9uLmxlZnQgLSAodGFyZ2V0RWxlbWVudC5vZmZzZXRXaWR0aCArIHBhcnNlRmxvYXQodGFyZ2V0RWxTdHlsZXMubWFyZ2luUmlnaHQpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIHRhcmdldEVsUG9zaXRpb24ubGVmdCA9IGhvc3RFbFBvc2l0aW9uLmxlZnQgKyBob3N0RWxQb3NpdGlvbi53aWR0aDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3dpdGNoIChwbGFjZW1lbnRTZWNvbmRhcnkpIHtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHRhcmdldEVsUG9zaXRpb24udG9wID0gaG9zdEVsUG9zaXRpb24udG9wO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHRhcmdldEVsUG9zaXRpb24udG9wID0gaG9zdEVsUG9zaXRpb24udG9wICsgaG9zdEVsUG9zaXRpb24uaGVpZ2h0IC0gdGFyZ2V0RWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIHRhcmdldEVsUG9zaXRpb24ubGVmdCA9IGhvc3RFbFBvc2l0aW9uLmxlZnQ7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLmxlZnQgPSBob3N0RWxQb3NpdGlvbi5sZWZ0ICsgaG9zdEVsUG9zaXRpb24ud2lkdGggLSB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2NlbnRlcic6XG4gICAgICAgIGlmIChwbGFjZW1lbnRQcmltYXJ5ID09PSAndG9wJyB8fCBwbGFjZW1lbnRQcmltYXJ5ID09PSAnYm90dG9tJykge1xuICAgICAgICAgIHRhcmdldEVsUG9zaXRpb24ubGVmdCA9IGhvc3RFbFBvc2l0aW9uLmxlZnQgKyBob3N0RWxQb3NpdGlvbi53aWR0aCAvIDIgLSB0YXJnZXRFbGVtZW50Lm9mZnNldFdpZHRoIC8gMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXRFbFBvc2l0aW9uLnRvcCA9IGhvc3RFbFBvc2l0aW9uLnRvcCArIGhvc3RFbFBvc2l0aW9uLmhlaWdodCAvIDIgLSB0YXJnZXRFbGVtZW50Lm9mZnNldEhlaWdodCAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGFyZ2V0RWxQb3NpdGlvbi50b3AgPSBNYXRoLnJvdW5kKHRhcmdldEVsUG9zaXRpb24udG9wKTtcbiAgICB0YXJnZXRFbFBvc2l0aW9uLmJvdHRvbSA9IE1hdGgucm91bmQodGFyZ2V0RWxQb3NpdGlvbi5ib3R0b20pO1xuICAgIHRhcmdldEVsUG9zaXRpb24ubGVmdCA9IE1hdGgucm91bmQodGFyZ2V0RWxQb3NpdGlvbi5sZWZ0KTtcbiAgICB0YXJnZXRFbFBvc2l0aW9uLnJpZ2h0ID0gTWF0aC5yb3VuZCh0YXJnZXRFbFBvc2l0aW9uLnJpZ2h0KTtcblxuICAgIHJldHVybiB0YXJnZXRFbFBvc2l0aW9uO1xuICB9XG5cbiAgLy8gZ2V0IHRoZSBhdmFpbGJsZSBwbGFjZW1lbnRzIG9mIHRoZSB0YXJnZXQgZWxlbWVudCBpbiB0aGUgdmlld3BvcnQgZGVwZW5kZWluZyBvbiB0aGUgaG9zdCBlbGVtZW50XG4gIGdldEF2YWlsYWJsZVBsYWNlbWVudHMoaG9zdEVsZW1lbnQ6IEhUTUxFbGVtZW50LCB0YXJnZXRFbGVtZW50OiBIVE1MRWxlbWVudCk6IHN0cmluZ1tdIHtcbiAgICBsZXQgYXZhaWxhYmxlUGxhY2VtZW50czogQXJyYXk8c3RyaW5nPiA9IFtdO1xuICAgIGxldCBob3N0RWxlbUNsaWVudFJlY3QgPSBob3N0RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgdGFyZ2V0RWxlbUNsaWVudFJlY3QgPSB0YXJnZXRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgaHRtbC5jbGllbnRIZWlnaHQ7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGggfHwgaHRtbC5jbGllbnRXaWR0aDtcbiAgICBsZXQgaG9zdEVsZW1DbGllbnRSZWN0SG9yQ2VudGVyID0gaG9zdEVsZW1DbGllbnRSZWN0LmxlZnQgKyBob3N0RWxlbUNsaWVudFJlY3Qud2lkdGggLyAyO1xuICAgIGxldCBob3N0RWxlbUNsaWVudFJlY3RWZXJDZW50ZXIgPSBob3N0RWxlbUNsaWVudFJlY3QudG9wICsgaG9zdEVsZW1DbGllbnRSZWN0LmhlaWdodCAvIDI7XG5cbiAgICAvLyBsZWZ0OiBjaGVjayBpZiB0YXJnZXQgd2lkdGggY2FuIGJlIHBsYWNlZCBiZXR3ZWVuIGhvc3QgbGVmdCBhbmQgdmlld3BvcnQgc3RhcnQgYW5kIGFsc28gaGVpZ2h0IG9mIHRhcmdldCBpc1xuICAgIC8vIGluc2lkZSB2aWV3cG9ydFxuICAgIGlmICh0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCA8IGhvc3RFbGVtQ2xpZW50UmVjdC5sZWZ0KSB7XG4gICAgICAvLyBjaGVjayBmb3IgbGVmdCBvbmx5XG4gICAgICBpZiAoaG9zdEVsZW1DbGllbnRSZWN0VmVyQ2VudGVyID4gdGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0IC8gMiAmJlxuICAgICAgICAgIHdpbmRvd0hlaWdodCAtIGhvc3RFbGVtQ2xpZW50UmVjdFZlckNlbnRlciA+IHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCAvIDIpIHtcbiAgICAgICAgYXZhaWxhYmxlUGxhY2VtZW50cy5zcGxpY2UoYXZhaWxhYmxlUGxhY2VtZW50cy5sZW5ndGgsIDEsICdsZWZ0Jyk7XG4gICAgICB9XG4gICAgICAvLyBjaGVjayBmb3IgbGVmdC10b3AgYW5kIGxlZnQtYm90dG9tXG4gICAgICB0aGlzLnNldFNlY29uZGFyeVBsYWNlbWVudEZvckxlZnRSaWdodChob3N0RWxlbUNsaWVudFJlY3QsIHRhcmdldEVsZW1DbGllbnRSZWN0LCAnbGVmdCcsIGF2YWlsYWJsZVBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIC8vIHRvcDogdGFyZ2V0IGhlaWdodCBpcyBsZXNzIHRoYW4gaG9zdCB0b3BcbiAgICBpZiAodGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0IDwgaG9zdEVsZW1DbGllbnRSZWN0LnRvcCkge1xuICAgICAgaWYgKGhvc3RFbGVtQ2xpZW50UmVjdEhvckNlbnRlciA+IHRhcmdldEVsZW1DbGllbnRSZWN0LndpZHRoIC8gMiAmJlxuICAgICAgICAgIHdpbmRvd1dpZHRoIC0gaG9zdEVsZW1DbGllbnRSZWN0SG9yQ2VudGVyID4gdGFyZ2V0RWxlbUNsaWVudFJlY3Qud2lkdGggLyAyKSB7XG4gICAgICAgIGF2YWlsYWJsZVBsYWNlbWVudHMuc3BsaWNlKGF2YWlsYWJsZVBsYWNlbWVudHMubGVuZ3RoLCAxLCAndG9wJyk7XG4gICAgICB9XG4gICAgICB0aGlzLnNldFNlY29uZGFyeVBsYWNlbWVudEZvclRvcEJvdHRvbShob3N0RWxlbUNsaWVudFJlY3QsIHRhcmdldEVsZW1DbGllbnRSZWN0LCAndG9wJywgYXZhaWxhYmxlUGxhY2VtZW50cyk7XG4gICAgfVxuXG4gICAgLy8gcmlnaHQ6IGNoZWNrIGlmIHRhcmdldCB3aWR0aCBjYW4gYmUgcGxhY2VkIGJldHdlZW4gaG9zdCByaWdodCBhbmQgdmlld3BvcnQgZW5kIGFuZCBhbHNvIGhlaWdodCBvZiB0YXJnZXQgaXNcbiAgICAvLyBpbnNpZGUgdmlld3BvcnRcbiAgICBpZiAod2luZG93V2lkdGggLSBob3N0RWxlbUNsaWVudFJlY3QucmlnaHQgPiB0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCkge1xuICAgICAgLy8gY2hlY2sgZm9yIHJpZ2h0IG9ubHlcbiAgICAgIGlmIChob3N0RWxlbUNsaWVudFJlY3RWZXJDZW50ZXIgPiB0YXJnZXRFbGVtQ2xpZW50UmVjdC5oZWlnaHQgLyAyICYmXG4gICAgICAgICAgd2luZG93SGVpZ2h0IC0gaG9zdEVsZW1DbGllbnRSZWN0VmVyQ2VudGVyID4gdGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0IC8gMikge1xuICAgICAgICBhdmFpbGFibGVQbGFjZW1lbnRzLnNwbGljZShhdmFpbGFibGVQbGFjZW1lbnRzLmxlbmd0aCwgMSwgJ3JpZ2h0Jyk7XG4gICAgICB9XG4gICAgICAvLyBjaGVjayBmb3IgcmlnaHQtdG9wIGFuZCByaWdodC1ib3R0b21cbiAgICAgIHRoaXMuc2V0U2Vjb25kYXJ5UGxhY2VtZW50Rm9yTGVmdFJpZ2h0KGhvc3RFbGVtQ2xpZW50UmVjdCwgdGFyZ2V0RWxlbUNsaWVudFJlY3QsICdyaWdodCcsIGF2YWlsYWJsZVBsYWNlbWVudHMpO1xuICAgIH1cblxuICAgIC8vIGJvdHRvbTogY2hlY2sgaWYgdGhlcmUgaXMgZW5vdWdoIHNwYWNlIGJldHdlZW4gaG9zdCBib3R0b20gYW5kIHZpZXdwb3J0IGVuZCBmb3IgdGFyZ2V0IGhlaWdodFxuICAgIGlmICh3aW5kb3dIZWlnaHQgLSBob3N0RWxlbUNsaWVudFJlY3QuYm90dG9tID4gdGFyZ2V0RWxlbUNsaWVudFJlY3QuaGVpZ2h0KSB7XG4gICAgICBpZiAoaG9zdEVsZW1DbGllbnRSZWN0SG9yQ2VudGVyID4gdGFyZ2V0RWxlbUNsaWVudFJlY3Qud2lkdGggLyAyICYmXG4gICAgICAgICAgd2luZG93V2lkdGggLSBob3N0RWxlbUNsaWVudFJlY3RIb3JDZW50ZXIgPiB0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCAvIDIpIHtcbiAgICAgICAgYXZhaWxhYmxlUGxhY2VtZW50cy5zcGxpY2UoYXZhaWxhYmxlUGxhY2VtZW50cy5sZW5ndGgsIDEsICdib3R0b20nKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U2Vjb25kYXJ5UGxhY2VtZW50Rm9yVG9wQm90dG9tKGhvc3RFbGVtQ2xpZW50UmVjdCwgdGFyZ2V0RWxlbUNsaWVudFJlY3QsICdib3R0b20nLCBhdmFpbGFibGVQbGFjZW1lbnRzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gYXZhaWxhYmxlUGxhY2VtZW50cztcbiAgfVxuXG4gIC8qKlxuICAgKiBjaGVjayBpZiBzZWNvbmRhcnkgcGxhY2VtZW50IGZvciBsZWZ0IGFuZCByaWdodCBhcmUgYXZhaWxhYmxlIGkuZS4gbGVmdC10b3AsIGxlZnQtYm90dG9tLCByaWdodC10b3AsIHJpZ2h0LWJvdHRvbVxuICAgKiBwcmltYXJ5cGxhY2VtZW50OiBsZWZ0fHJpZ2h0XG4gICAqIGF2YWlsYWJsZVBsYWNlbWVudEFycjogYXJyYXkgaW4gd2hpY2ggYXZhaWxhYmxlIHBsYWNlbWV0cyB0byBiZSBzZXRcbiAgICovXG4gIHByaXZhdGUgc2V0U2Vjb25kYXJ5UGxhY2VtZW50Rm9yTGVmdFJpZ2h0KFxuICAgICAgaG9zdEVsZW1DbGllbnRSZWN0OiBDbGllbnRSZWN0LCB0YXJnZXRFbGVtQ2xpZW50UmVjdDogQ2xpZW50UmVjdCwgcHJpbWFyeVBsYWNlbWVudDogc3RyaW5nLFxuICAgICAgYXZhaWxhYmxlUGxhY2VtZW50QXJyOiBBcnJheTxzdHJpbmc+KSB7XG4gICAgbGV0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgLy8gY2hlY2sgZm9yIGxlZnQtYm90dG9tXG4gICAgaWYgKHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCA8PSBob3N0RWxlbUNsaWVudFJlY3QuYm90dG9tKSB7XG4gICAgICBhdmFpbGFibGVQbGFjZW1lbnRBcnIuc3BsaWNlKGF2YWlsYWJsZVBsYWNlbWVudEFyci5sZW5ndGgsIDEsIHByaW1hcnlQbGFjZW1lbnQgKyAnLWJvdHRvbScpO1xuICAgIH1cbiAgICBpZiAoKHdpbmRvdy5pbm5lckhlaWdodCB8fCBodG1sLmNsaWVudEhlaWdodCkgLSBob3N0RWxlbUNsaWVudFJlY3QudG9wID49IHRhcmdldEVsZW1DbGllbnRSZWN0LmhlaWdodCkge1xuICAgICAgYXZhaWxhYmxlUGxhY2VtZW50QXJyLnNwbGljZShhdmFpbGFibGVQbGFjZW1lbnRBcnIubGVuZ3RoLCAxLCBwcmltYXJ5UGxhY2VtZW50ICsgJy10b3AnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogY2hlY2sgaWYgc2Vjb25kYXJ5IHBsYWNlbWVudCBmb3IgdG9wIGFuZCBib3R0b20gYXJlIGF2YWlsYWJsZSBpLmUuIHRvcC1sZWZ0LCB0b3AtcmlnaHQsIGJvdHRvbS1sZWZ0LCBib3R0b20tcmlnaHRcbiAgICogcHJpbWFyeXBsYWNlbWVudDogdG9wfGJvdHRvbVxuICAgKiBhdmFpbGFibGVQbGFjZW1lbnRBcnI6IGFycmF5IGluIHdoaWNoIGF2YWlsYWJsZSBwbGFjZW1ldHMgdG8gYmUgc2V0XG4gICAqL1xuICBwcml2YXRlIHNldFNlY29uZGFyeVBsYWNlbWVudEZvclRvcEJvdHRvbShcbiAgICAgIGhvc3RFbGVtQ2xpZW50UmVjdDogQ2xpZW50UmVjdCwgdGFyZ2V0RWxlbUNsaWVudFJlY3Q6IENsaWVudFJlY3QsIHByaW1hcnlQbGFjZW1lbnQ6IHN0cmluZyxcbiAgICAgIGF2YWlsYWJsZVBsYWNlbWVudEFycjogQXJyYXk8c3RyaW5nPikge1xuICAgIGxldCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgIC8vIGNoZWNrIGZvciBsZWZ0LWJvdHRvbVxuICAgIGlmICgod2luZG93LmlubmVyV2lkdGggfHwgaHRtbC5jbGllbnRXaWR0aCkgLSBob3N0RWxlbUNsaWVudFJlY3QubGVmdCA+PSB0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCkge1xuICAgICAgYXZhaWxhYmxlUGxhY2VtZW50QXJyLnNwbGljZShhdmFpbGFibGVQbGFjZW1lbnRBcnIubGVuZ3RoLCAxLCBwcmltYXJ5UGxhY2VtZW50ICsgJy1sZWZ0Jyk7XG4gICAgfVxuICAgIGlmICh0YXJnZXRFbGVtQ2xpZW50UmVjdC53aWR0aCA8PSBob3N0RWxlbUNsaWVudFJlY3QucmlnaHQpIHtcbiAgICAgIGF2YWlsYWJsZVBsYWNlbWVudEFyci5zcGxpY2UoYXZhaWxhYmxlUGxhY2VtZW50QXJyLmxlbmd0aCwgMSwgcHJpbWFyeVBsYWNlbWVudCArICctcmlnaHQnKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3QgcG9zaXRpb25TZXJ2aWNlID0gbmV3IFBvc2l0aW9uaW5nKCk7XG5cbi8qXG4gKiBBY2NlcHQgdGhlIHBsYWNlbWVudCBhcnJheSBhbmQgYXBwbGllcyB0aGUgYXBwcm9wcmlhdGUgcGxhY2VtZW50IGRlcGVuZGVudCBvbiB0aGUgdmlld3BvcnQuXG4gKiBSZXR1cm5zIHRoZSBhcHBsaWVkIHBsYWNlbWVudC5cbiAqIEluIGNhc2Ugb2YgYXV0byBwbGFjZW1lbnQsIHBsYWNlbWVudHMgYXJlIHNlbGVjdGVkIGluIG9yZGVyXG4gKiAgICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLFxuICogICAndG9wLWxlZnQnLCAndG9wLXJpZ2h0JyxcbiAqICAgJ2JvdHRvbS1sZWZ0JywgJ2JvdHRvbS1yaWdodCcsXG4gKiAgICdsZWZ0LXRvcCcsICdsZWZ0LWJvdHRvbScsXG4gKiAgICdyaWdodC10b3AnLCAncmlnaHQtYm90dG9tJy5cbiAqICovXG5leHBvcnQgZnVuY3Rpb24gcG9zaXRpb25FbGVtZW50cyhcbiAgICBob3N0RWxlbWVudDogSFRNTEVsZW1lbnQsIHRhcmdldEVsZW1lbnQ6IEhUTUxFbGVtZW50LCBwbGFjZW1lbnQ6IHN0cmluZyB8IFBsYWNlbWVudCB8IFBsYWNlbWVudEFycmF5LFxuICAgIGFwcGVuZFRvQm9keT86IGJvb2xlYW4pOiBQbGFjZW1lbnQge1xuICBsZXQgcGxhY2VtZW50VmFsczogQXJyYXk8UGxhY2VtZW50PiA9IEFycmF5LmlzQXJyYXkocGxhY2VtZW50KSA/IHBsYWNlbWVudCA6IFtwbGFjZW1lbnQgYXMgUGxhY2VtZW50XTtcblxuICAvLyByZXBsYWNlIGF1dG8gcGxhY2VtZW50IHdpdGggb3RoZXIgcGxhY2VtZW50c1xuICBsZXQgaGFzQXV0byA9IHBsYWNlbWVudFZhbHMuZmluZEluZGV4KHZhbCA9PiB2YWwgPT09ICdhdXRvJyk7XG4gIGlmIChoYXNBdXRvID49IDApIHtcbiAgICBbJ3RvcCcsICdib3R0b20nLCAnbGVmdCcsICdyaWdodCcsICd0b3AtbGVmdCcsICd0b3AtcmlnaHQnLCAnYm90dG9tLWxlZnQnLCAnYm90dG9tLXJpZ2h0JywgJ2xlZnQtdG9wJyxcbiAgICAgJ2xlZnQtYm90dG9tJywgJ3JpZ2h0LXRvcCcsICdyaWdodC1ib3R0b20nLFxuICAgIF0uZm9yRWFjaChmdW5jdGlvbihvYmopIHtcbiAgICAgIGlmIChwbGFjZW1lbnRWYWxzLmZpbmQodmFsID0+IHZhbC5zZWFyY2goJ14nICsgb2JqKSAhPT0gLTEpID09IG51bGwpIHtcbiAgICAgICAgcGxhY2VtZW50VmFscy5zcGxpY2UoaGFzQXV0bysrLCAxLCBvYmogYXMgUGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIGNvb3JkaW5hdGVzIHdoZXJlIHRvIHBvc2l0aW9uXG4gIGxldCB0b3BWYWwgPSAwLCBsZWZ0VmFsID0gMDtcbiAgbGV0IGFwcGxpZWRQbGFjZW1lbnQ6IFBsYWNlbWVudDtcbiAgLy8gZ2V0IGF2YWlsYWJsZSBwbGFjZW1lbnRzXG4gIGxldCBhdmFpbGFibGVQbGFjZW1lbnRzID0gcG9zaXRpb25TZXJ2aWNlLmdldEF2YWlsYWJsZVBsYWNlbWVudHMoaG9zdEVsZW1lbnQsIHRhcmdldEVsZW1lbnQpO1xuICAvLyBpdGVyYXRlIG92ZXIgYWxsIHRoZSBwYXNzZWQgcGxhY2VtZW50c1xuICBmb3IgKGxldCB7IGl0ZW0sIGluZGV4IH0gb2YgdG9JdGVtSW5kZXhlcyhwbGFjZW1lbnRWYWxzKSkge1xuICAgIC8vIGNoZWNrIGlmIHBhc3NlZCBwbGFjZW1lbnQgaXMgcHJlc2VudCBpbiB0aGUgYXZhaWxhYmxlIHBsYWNlbWVudCBvciBvdGhlcndpc2UgYXBwbHkgdGhlIGxhc3QgcGxhY2VtZW50IGluIHRoZVxuICAgIC8vIHBhc3NlZCBwbGFjZW1lbnQgbGlzdFxuICAgIGlmICgoYXZhaWxhYmxlUGxhY2VtZW50cy5maW5kKHZhbCA9PiB2YWwgPT09IGl0ZW0pICE9IG51bGwpIHx8IChwbGFjZW1lbnRWYWxzLmxlbmd0aCA9PT0gaW5kZXggKyAxKSkge1xuICAgICAgYXBwbGllZFBsYWNlbWVudCA9IDxQbGFjZW1lbnQ+aXRlbTtcbiAgICAgIGNvbnN0IHBvcyA9IHBvc2l0aW9uU2VydmljZS5wb3NpdGlvbkVsZW1lbnRzKGhvc3RFbGVtZW50LCB0YXJnZXRFbGVtZW50LCBpdGVtLCBhcHBlbmRUb0JvZHkpO1xuICAgICAgdG9wVmFsID0gcG9zLnRvcDtcbiAgICAgIGxlZnRWYWwgPSBwb3MubGVmdDtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB0YXJnZXRFbGVtZW50LnN0eWxlLnRvcCA9IGAke3RvcFZhbH1weGA7XG4gIHRhcmdldEVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2xlZnRWYWx9cHhgO1xuICByZXR1cm4gYXBwbGllZFBsYWNlbWVudDtcbn1cblxuLy8gZnVuY3Rpb24gdG8gZ2V0IGluZGV4IGFuZCBpdGVtIG9mIGFuIGFycmF5XG5mdW5jdGlvbiB0b0l0ZW1JbmRleGVzPFQ+KGE6IFRbXSkge1xuICByZXR1cm4gYS5tYXAoKGl0ZW0sIGluZGV4KSA9PiAoe2l0ZW0sIGluZGV4fSkpO1xufVxuXG5leHBvcnQgdHlwZSBQbGFjZW1lbnQgPSAnYXV0bycgfCAndG9wJyB8ICdib3R0b20nIHwgJ2xlZnQnIHwgJ3JpZ2h0JyB8ICd0b3AtbGVmdCcgfCAndG9wLXJpZ2h0JyB8ICdib3R0b20tbGVmdCcgfFxuICAgICdib3R0b20tcmlnaHQnIHwgJ2xlZnQtdG9wJyB8ICdsZWZ0LWJvdHRvbScgfCAncmlnaHQtdG9wJyB8ICdyaWdodC1ib3R0b20nO1xuXG5leHBvcnQgdHlwZSBQbGFjZW1lbnRBcnJheSA9IFBsYWNlbWVudCB8IEFycmF5PFBsYWNlbWVudD47XG4iLCJpbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2ZpbHRlciwgbWFwLCB0YWtlVW50aWwsIHdpdGhMYXRlc3RGcm9tfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5jb25zdCBGT0NVU0FCTEVfRUxFTUVOVFNfU0VMRUNUT1IgPSBbXG4gICdhW2hyZWZdJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pOm5vdChbdHlwZT1cImhpZGRlblwiXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsXG4gICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJ1xuXS5qb2luKCcsICcpO1xuXG4vKipcbiAqIFJldHVybnMgZmlyc3QgYW5kIGxhc3QgZm9jdXNhYmxlIGVsZW1lbnRzIGluc2lkZSBvZiBhIGdpdmVuIGVsZW1lbnQgYmFzZWQgb24gc3BlY2lmaWMgQ1NTIHNlbGVjdG9yXG4gKi9cbmZ1bmN0aW9uIGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudFtdIHtcbiAgY29uc3QgbGlzdDogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoRk9DVVNBQkxFX0VMRU1FTlRTX1NFTEVDVE9SKTtcbiAgcmV0dXJuIFtsaXN0WzBdLCBsaXN0W2xpc3QubGVuZ3RoIC0gMV1dO1xufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHRoYXQgZW5mb3JjZXMgYnJvd3NlciBmb2N1cyB0byBiZSB0cmFwcGVkIGluc2lkZSBhIERPTSBlbGVtZW50LlxuICpcbiAqIFdvcmtzIG9ubHkgZm9yIGNsaWNrcyBpbnNpZGUgdGhlIGVsZW1lbnQgYW5kIG5hdmlnYXRpb24gd2l0aCAnVGFiJywgaWdub3JpbmcgY2xpY2tzIG91dHNpZGUgb2YgdGhlIGVsZW1lbnRcbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBUaGUgZWxlbWVudCBhcm91bmQgd2hpY2ggZm9jdXMgd2lsbCBiZSB0cmFwcGVkIGluc2lkZVxuICogQHBhcmFtIHN0b3BGb2N1c1RyYXAkIFRoZSBvYnNlcnZhYmxlIHN0cmVhbS4gV2hlbiBjb21wbGV0ZWQgdGhlIGZvY3VzIHRyYXAgd2lsbCBjbGVhbiB1cCBsaXN0ZW5lcnNcbiAqIGFuZCBmcmVlIGludGVybmFsIHJlc291cmNlc1xuICovXG5leHBvcnQgY29uc3QgbmdiRm9jdXNUcmFwID0gKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBzdG9wRm9jdXNUcmFwJDogT2JzZXJ2YWJsZTxhbnk+KSA9PiB7XG4gIC8vIGxhc3QgZm9jdXNlZCBlbGVtZW50XG4gIGNvbnN0IGxhc3RGb2N1c2VkRWxlbWVudCQgPVxuICAgICAgZnJvbUV2ZW50PEZvY3VzRXZlbnQ+KGVsZW1lbnQsICdmb2N1c2luJykucGlwZSh0YWtlVW50aWwoc3RvcEZvY3VzVHJhcCQpLCBtYXAoZSA9PiBlLnRhcmdldCkpO1xuXG4gIC8vICd0YWInIC8gJ3NoaWZ0K3RhYicgc3RyZWFtXG4gIGZyb21FdmVudDxLZXlib2FyZEV2ZW50PihlbGVtZW50LCAna2V5ZG93bicpXG4gICAgICAucGlwZSh0YWtlVW50aWwoc3RvcEZvY3VzVHJhcCQpLCBmaWx0ZXIoZSA9PiBlLndoaWNoID09PSBLZXkuVGFiKSwgd2l0aExhdGVzdEZyb20obGFzdEZvY3VzZWRFbGVtZW50JCkpXG4gICAgICAuc3Vic2NyaWJlKChbdGFiRXZlbnQsIGZvY3VzZWRFbGVtZW50XSkgPT4ge1xuICAgICAgICBjb25zdFtmaXJzdCwgbGFzdF0gPSBnZXRGb2N1c2FibGVCb3VuZGFyeUVsZW1lbnRzKGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChmb2N1c2VkRWxlbWVudCA9PT0gZmlyc3QgJiYgdGFiRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICBsYXN0LmZvY3VzKCk7XG4gICAgICAgICAgdGFiRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmb2N1c2VkRWxlbWVudCA9PT0gbGFzdCAmJiAhdGFiRXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICBmaXJzdC5mb2N1cygpO1xuICAgICAgICAgIHRhYkV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIC8vIGluc2lkZSBjbGlja1xuICBmcm9tRXZlbnQoZWxlbWVudCwgJ2NsaWNrJylcbiAgICAgIC5waXBlKHRha2VVbnRpbChzdG9wRm9jdXNUcmFwJCksIHdpdGhMYXRlc3RGcm9tKGxhc3RGb2N1c2VkRWxlbWVudCQpLCBtYXAoYXJyID0+IGFyclsxXSBhcyBIVE1MRWxlbWVudCkpXG4gICAgICAuc3Vic2NyaWJlKGxhc3RGb2N1c2VkRWxlbWVudCA9PiBsYXN0Rm9jdXNlZEVsZW1lbnQuZm9jdXMoKSk7XG59O1xuIiwiaW1wb3J0IHtcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgQ29tcG9uZW50UmVmLFxuICBFbGVtZW50UmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBSZW5kZXJlcjIsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgTmdab25lLFxuICBUZW1wbGF0ZVJlZixcbiAgZm9yd2FyZFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBPdXRwdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBJbmplY3Rcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0Fic3RyYWN0Q29udHJvbCwgQ29udHJvbFZhbHVlQWNjZXNzb3IsIFZhbGlkYXRvciwgTkdfVkFMVUVfQUNDRVNTT1IsIE5HX1ZBTElEQVRPUlN9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXIsIE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50fSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHtEYXlUZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdGVtcGxhdGUtY29udGV4dCc7XG5pbXBvcnQge05nYkRhdGVQYXJzZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5cbmltcG9ydCB7cG9zaXRpb25FbGVtZW50cywgUGxhY2VtZW50QXJyYXl9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuaW1wb3J0IHtuZ2JGb2N1c1RyYXB9IGZyb20gJy4uL3V0aWwvZm9jdXMtdHJhcCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5pbXBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtOZ2JDYWxlbmRhcn0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyU2VydmljZX0gZnJvbSAnLi9kYXRlcGlja2VyLXNlcnZpY2UnO1xuXG5pbXBvcnQge1N1YmplY3QsIGZyb21FdmVudCwgcmFjZSwgTkVWRVJ9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5jb25zdCBOR0JfREFURVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYklucHV0RGF0ZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG5jb25zdCBOR0JfREFURVBJQ0tFUl9WQUxJREFUT1IgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTElEQVRPUlMsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYklucHV0RGF0ZXBpY2tlciksXG4gIG11bHRpOiB0cnVlXG59O1xuXG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgbWFrZXMgaXQgcG9zc2libGUgdG8gaGF2ZSBkYXRlcGlja2VycyBvbiBpbnB1dCBmaWVsZHMuXG4gKiBNYW5hZ2VzIGludGVncmF0aW9uIHdpdGggdGhlIGlucHV0IGZpZWxkIGl0c2VsZiAoZGF0YSBlbnRyeSkgYW5kIG5nTW9kZWwgKHZhbGlkYXRpb24gZXRjLikuXG4gKi9cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2lucHV0W25nYkRhdGVwaWNrZXJdJyxcbiAgZXhwb3J0QXM6ICduZ2JEYXRlcGlja2VyJyxcbiAgaG9zdDoge1xuICAgICcoaW5wdXQpJzogJ21hbnVhbERhdGVDaGFuZ2UoJGV2ZW50LnRhcmdldC52YWx1ZSknLFxuICAgICcoY2hhbmdlKSc6ICdtYW51YWxEYXRlQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUsIHRydWUpJyxcbiAgICAnKGJsdXIpJzogJ29uQmx1cigpJyxcbiAgICAnW2Rpc2FibGVkXSc6ICdkaXNhYmxlZCdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbTkdCX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IsIE5HQl9EQVRFUElDS0VSX1ZBTElEQVRPUiwgTmdiRGF0ZXBpY2tlclNlcnZpY2VdXG59KVxuZXhwb3J0IGNsYXNzIE5nYklucHV0RGF0ZXBpY2tlciBpbXBsZW1lbnRzIE9uQ2hhbmdlcyxcbiAgICBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBWYWxpZGF0b3Ige1xuICBwcml2YXRlIF9jbG9zZWQkID0gbmV3IFN1YmplY3QoKTtcbiAgcHJpdmF0ZSBfY1JlZjogQ29tcG9uZW50UmVmPE5nYkRhdGVwaWNrZXI+ID0gbnVsbDtcbiAgcHJpdmF0ZSBfZGlzYWJsZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfbW9kZWw6IE5nYkRhdGU7XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcblxuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGNsb3NlZCBhdXRvbWF0aWNhbGx5IGFmdGVyIGRhdGUgc2VsZWN0aW9uIC8gb3V0c2lkZSBjbGljayBvciBub3QuXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQgdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb24gYm90aCBkYXRlIHNlbGVjdGlvbiBhbmQgb3V0c2lkZSBjbGljay4gSWYgdGhlIHZhbHVlIGlzICdmYWxzZScgdGhlIHBvcHVwIGhhcyB0b1xuICAgKiBiZSBjbG9zZWQgbWFudWFsbHkgdmlhICcuY2xvc2UoKScgb3IgJy50b2dnbGUoKScgbWV0aG9kcy4gSWYgdGhlIHZhbHVlIGlzIHNldCB0byAnaW5zaWRlJyB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvblxuICAgKiBkYXRlIHNlbGVjdGlvbiBvbmx5LiBGb3IgdGhlICdvdXRzaWRlJyB0aGUgcG9wdXAgd2lsbCBjbG9zZSBvbmx5IG9uIHRoZSBvdXRzaWRlIGNsaWNrLlxuICAgKlxuICAgKiBAc2luY2UgMy4wLjBcbiAgICovXG4gIEBJbnB1dCgpIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdpbnNpZGUnIHwgJ291dHNpZGUnID0gdHJ1ZTtcblxuICAvKipcbiAgICogUmVmZXJlbmNlIGZvciB0aGUgY3VzdG9tIHRlbXBsYXRlIGZvciB0aGUgZGF5IGRpc3BsYXlcbiAgICovXG4gIEBJbnB1dCgpIGRheVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxEYXlUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgbW9udGhzIHRvIGRpc3BsYXlcbiAgICovXG4gIEBJbnB1dCgpIGRpc3BsYXlNb250aHM6IG51bWJlcjtcblxuICAvKipcbiAgICogRmlyc3QgZGF5IG9mIHRoZSB3ZWVrLiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAxPU1vbiAuLi4gNz1TdW5cbiAgICovXG4gIEBJbnB1dCgpIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIHRvIG1hcmsgYSBnaXZlbiBkYXRlIGFzIGRpc2FibGVkLlxuICAgKiAnQ3VycmVudCcgY29udGFpbnMgdGhlIG1vbnRoIHRoYXQgd2lsbCBiZSBkaXNwbGF5ZWQgaW4gdGhlIHZpZXdcbiAgICovXG4gIEBJbnB1dCgpIG1hcmtEaXNhYmxlZDogKGRhdGU6IE5nYkRhdGUsIGN1cnJlbnQ6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSA9PiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBNaW4gZGF0ZSBmb3IgdGhlIG5hdmlnYXRpb24uIElmIG5vdCBwcm92aWRlZCB3aWxsIGJlIDEwIHllYXJzIGJlZm9yZSB0b2RheSBvciBgc3RhcnREYXRlYFxuICAgKi9cbiAgQElucHV0KCkgbWluRGF0ZTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogTWF4IGRhdGUgZm9yIHRoZSBuYXZpZ2F0aW9uLiBJZiBub3QgcHJvdmlkZWQgd2lsbCBiZSAxMCB5ZWFycyBmcm9tIHRvZGF5IG9yIGBzdGFydERhdGVgXG4gICAqL1xuICBASW5wdXQoKSBtYXhEYXRlOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBOYXZpZ2F0aW9uIHR5cGU6IGBzZWxlY3RgIChkZWZhdWx0IHdpdGggc2VsZWN0IGJveGVzIGZvciBtb250aCBhbmQgeWVhciksIGBhcnJvd3NgXG4gICAqICh3aXRob3V0IHNlbGVjdCBib3hlcywgb25seSBuYXZpZ2F0aW9uIGFycm93cykgb3IgYG5vbmVgIChubyBuYXZpZ2F0aW9uIGF0IGFsbClcbiAgICovXG4gIEBJbnB1dCgpIG5hdmlnYXRpb246ICdzZWxlY3QnIHwgJ2Fycm93cycgfCAnbm9uZSc7XG5cbiAgLyoqXG4gICAqIFRoZSB3YXkgdG8gZGlzcGxheSBkYXlzIHRoYXQgZG9uJ3QgYmVsb25nIHRvIGN1cnJlbnQgbW9udGg6IGB2aXNpYmxlYCAoZGVmYXVsdCksXG4gICAqIGBoaWRkZW5gIChub3QgZGlzcGxheWVkKSBvciBgY29sbGFwc2VkYCAobm90IGRpc3BsYXllZCB3aXRoIGVtcHR5IHNwYWNlIGNvbGxhcHNlZClcbiAgICovXG4gIEBJbnB1dCgpIG91dHNpZGVEYXlzOiAndmlzaWJsZScgfCAnY29sbGFwc2VkJyB8ICdoaWRkZW4nO1xuXG4gIC8qKlxuICAgKiBQbGFjZW1lbnQgb2YgYSBkYXRlcGlja2VyIHBvcHVwIGFjY2VwdHM6XG4gICAqICAgIFwidG9wXCIsIFwidG9wLWxlZnRcIiwgXCJ0b3AtcmlnaHRcIiwgXCJib3R0b21cIiwgXCJib3R0b20tbGVmdFwiLCBcImJvdHRvbS1yaWdodFwiLFxuICAgKiAgICBcImxlZnRcIiwgXCJsZWZ0LXRvcFwiLCBcImxlZnQtYm90dG9tXCIsIFwicmlnaHRcIiwgXCJyaWdodC10b3BcIiwgXCJyaWdodC1ib3R0b21cIlxuICAgKiBhbmQgYXJyYXkgb2YgYWJvdmUgdmFsdWVzLlxuICAgKi9cbiAgQElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICdib3R0b20tbGVmdCc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSBkYXlzIG9mIHRoZSB3ZWVrXG4gICAqL1xuICBASW5wdXQoKSBzaG93V2Vla2RheXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSB3ZWVrIG51bWJlcnNcbiAgICovXG4gIEBJbnB1dCgpIHNob3dXZWVrTnVtYmVyczogYm9vbGVhbjtcblxuICAvKipcbiAgICogRGF0ZSB0byBvcGVuIGNhbGVuZGFyIHdpdGguXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgcHJvdmlkZWQsIGNhbGVuZGFyIHdpbGwgb3BlbiB3aXRoIGN1cnJlbnQgbW9udGguXG4gICAqIFVzZSAnbmF2aWdhdGVUbyhkYXRlKScgYXMgYW4gYWx0ZXJuYXRpdmVcbiAgICovXG4gIEBJbnB1dCgpIHN0YXJ0RGF0ZToge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn07XG5cbiAgLyoqXG4gICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgZGF0ZXBpY2tlciBwb3B1cCBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFwiYm9keVwiLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gdXNlciBzZWxlY3RzIGEgZGF0ZSB1c2luZyBrZXlib2FyZCBvciBtb3VzZS5cbiAgICogVGhlIHBheWxvYWQgb2YgdGhlIGV2ZW50IGlzIGN1cnJlbnRseSBzZWxlY3RlZCBOZ2JEYXRlLlxuICAgKlxuICAgKiBAc2luY2UgMS4xLjFcbiAgICovXG4gIEBPdXRwdXQoKSBkYXRlU2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBmaXJlZCB3aGVuIG5hdmlnYXRpb24gaGFwcGVucyBhbmQgY3VycmVudGx5IGRpc3BsYXllZCBtb250aCBjaGFuZ2VzLlxuICAgKiBTZWUgTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnQgZm9yIHRoZSBwYXlsb2FkIGluZm8uXG4gICAqL1xuICBAT3V0cHV0KCkgbmF2aWdhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50PigpO1xuXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gIH1cbiAgc2V0IGRpc2FibGVkKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlZCA9IHZhbHVlID09PSAnJyB8fCAodmFsdWUgJiYgdmFsdWUgIT09ICdmYWxzZScpO1xuXG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uuc2V0RGlzYWJsZWRTdGF0ZSh0aGlzLl9kaXNhYmxlZCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG4gIHByaXZhdGUgX3ZhbGlkYXRvckNoYW5nZSA9ICgpID0+IHt9O1xuXG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9wYXJzZXJGb3JtYXR0ZXI6IE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIsIHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuICAgICAgcHJpdmF0ZSBfdmNSZWY6IFZpZXdDb250YWluZXJSZWYsIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgX2NmcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgX3NlcnZpY2U6IE5nYkRhdGVwaWNrZXJTZXJ2aWNlLCBwcml2YXRlIF9jYWxlbmRhcjogTmdiQ2FsZW5kYXIsXG4gICAgICBwcml2YXRlIF9kYXRlQWRhcHRlcjogTmdiRGF0ZUFkYXB0ZXI8YW55PiwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSkge1xuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24gPSBfbmdab25lLm9uU3RhYmxlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fY1JlZikge1xuICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCwgdGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLnBsYWNlbWVudCwgdGhpcy5jb250YWluZXIgPT09ICdib2R5Jyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMuX29uQ2hhbmdlID0gZm47IH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4gYW55KTogdm9pZCB7IHRoaXMuX29uVG91Y2hlZCA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblZhbGlkYXRvckNoYW5nZShmbjogKCkgPT4gdm9pZCk6IHZvaWQgeyB0aGlzLl92YWxpZGF0b3JDaGFuZ2UgPSBmbjsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQgeyB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDsgfVxuXG4gIHZhbGlkYXRlKGM6IEFic3RyYWN0Q29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgICBjb25zdCB2YWx1ZSA9IGMudmFsdWU7XG5cbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgbmdiRGF0ZSA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX2RhdGVBZGFwdGVyLmZyb21Nb2RlbCh2YWx1ZSkpO1xuXG4gICAgaWYgKCF0aGlzLl9jYWxlbmRhci5pc1ZhbGlkKG5nYkRhdGUpKSB7XG4gICAgICByZXR1cm4geyduZ2JEYXRlJzoge2ludmFsaWQ6IGMudmFsdWV9fTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5taW5EYXRlICYmIG5nYkRhdGUuYmVmb3JlKE5nYkRhdGUuZnJvbSh0aGlzLm1pbkRhdGUpKSkge1xuICAgICAgcmV0dXJuIHsnbmdiRGF0ZSc6IHtyZXF1aXJlZEJlZm9yZTogdGhpcy5taW5EYXRlfX07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWF4RGF0ZSAmJiBuZ2JEYXRlLmFmdGVyKE5nYkRhdGUuZnJvbSh0aGlzLm1heERhdGUpKSkge1xuICAgICAgcmV0dXJuIHsnbmdiRGF0ZSc6IHtyZXF1aXJlZEFmdGVyOiB0aGlzLm1heERhdGV9fTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy5fbW9kZWwgPSB0aGlzLl9mcm9tRGF0ZVN0cnVjdCh0aGlzLl9kYXRlQWRhcHRlci5mcm9tTW9kZWwodmFsdWUpKTtcbiAgICB0aGlzLl93cml0ZU1vZGVsVmFsdWUodGhpcy5fbW9kZWwpO1xuICB9XG5cbiAgbWFudWFsRGF0ZUNoYW5nZSh2YWx1ZTogc3RyaW5nLCB1cGRhdGVWaWV3ID0gZmFsc2UpIHtcbiAgICB0aGlzLl9tb2RlbCA9IHRoaXMuX2Zyb21EYXRlU3RydWN0KHRoaXMuX3BhcnNlckZvcm1hdHRlci5wYXJzZSh2YWx1ZSkpO1xuICAgIHRoaXMuX29uQ2hhbmdlKHRoaXMuX21vZGVsID8gdGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkgOiAodmFsdWUgPT09ICcnID8gbnVsbCA6IHZhbHVlKSk7XG4gICAgaWYgKHVwZGF0ZVZpZXcgJiYgdGhpcy5fbW9kZWwpIHtcbiAgICAgIHRoaXMuX3dyaXRlTW9kZWxWYWx1ZSh0aGlzLl9tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgaXNPcGVuKCkgeyByZXR1cm4gISF0aGlzLl9jUmVmOyB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIHRoZSBkYXRlcGlja2VyIHdpdGggdGhlIHNlbGVjdGVkIGRhdGUgaW5kaWNhdGVkIGJ5IHRoZSBuZ01vZGVsIHZhbHVlLlxuICAgKi9cbiAgb3BlbigpIHtcbiAgICBpZiAoIXRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIGNvbnN0IGNmID0gdGhpcy5fY2ZyLnJlc29sdmVDb21wb25lbnRGYWN0b3J5KE5nYkRhdGVwaWNrZXIpO1xuICAgICAgdGhpcy5fY1JlZiA9IHRoaXMuX3ZjUmVmLmNyZWF0ZUNvbXBvbmVudChjZik7XG5cbiAgICAgIHRoaXMuX2FwcGx5UG9wdXBTdHlsaW5nKHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB0aGlzLl9hcHBseURhdGVwaWNrZXJJbnB1dHModGhpcy5fY1JlZi5pbnN0YW5jZSk7XG4gICAgICB0aGlzLl9zdWJzY3JpYmVGb3JEYXRlcGlja2VyT3V0cHV0cyh0aGlzLl9jUmVmLmluc3RhbmNlKTtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2UubmdPbkluaXQoKTtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uud3JpdGVWYWx1ZSh0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKHRoaXMuX21vZGVsKSk7XG5cbiAgICAgIC8vIGRhdGUgc2VsZWN0aW9uIGV2ZW50IGhhbmRsaW5nXG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLnJlZ2lzdGVyT25DaGFuZ2UoKHNlbGVjdGVkRGF0ZSkgPT4ge1xuICAgICAgICB0aGlzLndyaXRlVmFsdWUoc2VsZWN0ZWREYXRlKTtcbiAgICAgICAgdGhpcy5fb25DaGFuZ2Uoc2VsZWN0ZWREYXRlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9jUmVmLmNoYW5nZURldGVjdG9yUmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5zZXREaXNhYmxlZFN0YXRlKHRoaXMuZGlzYWJsZWQpO1xuXG4gICAgICBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgICB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gZm9jdXMgaGFuZGxpbmdcbiAgICAgIG5nYkZvY3VzVHJhcCh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX2Nsb3NlZCQpO1xuXG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLmZvY3VzKCk7XG5cbiAgICAgIC8vIGNsb3Npbmcgb24gRVNDIGFuZCBvdXRzaWRlIGNsaWNrc1xuICAgICAgdGhpcy5fbmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcblxuICAgICAgICBjb25zdCBlc2NhcGVzJCA9IGZyb21FdmVudDxLZXlib2FyZEV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2tleXVwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLCBmaWx0ZXIoZSA9PiBlLndoaWNoID09PSBLZXkuRXNjYXBlKSk7XG5cbiAgICAgICAgbGV0IG91dHNpZGVDbGlja3MkO1xuICAgICAgICBpZiAodGhpcy5hdXRvQ2xvc2UgPT09IHRydWUgfHwgdGhpcy5hdXRvQ2xvc2UgPT09ICdvdXRzaWRlJykge1xuICAgICAgICAgIC8vIHdlIGRvbid0IGtub3cgaG93IHRoZSBwb3B1cCB3YXMgb3BlbmVkLCBzbyBpZiBpdCB3YXMgb3BlbmVkIHdpdGggYSBjbGljayxcbiAgICAgICAgICAvLyB3ZSBoYXZlIHRvIHNraXAgdGhlIGZpcnN0IG9uZSB0byBhdm9pZCBjbG9zaW5nIGl0IGltbWVkaWF0ZWx5XG4gICAgICAgICAgbGV0IGlzT3BlbmluZyA9IHRydWU7XG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IGlzT3BlbmluZyA9IGZhbHNlKTtcblxuICAgICAgICAgIG91dHNpZGVDbGlja3MkID1cbiAgICAgICAgICAgICAgZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKVxuICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLCBmaWx0ZXIoZXZlbnQgPT4gIWlzT3BlbmluZyAmJiB0aGlzLl9zaG91bGRDbG9zZU9uT3V0c2lkZUNsaWNrKGV2ZW50KSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dHNpZGVDbGlja3MkID0gTkVWRVI7XG4gICAgICAgIH1cblxuICAgICAgICByYWNlPEV2ZW50PihbZXNjYXBlcyQsIG91dHNpZGVDbGlja3MkXSkuc3Vic2NyaWJlKCgpID0+IHRoaXMuX25nWm9uZS5ydW4oKCkgPT4gdGhpcy5jbG9zZSgpKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBkYXRlcGlja2VyIHBvcHVwLlxuICAgKi9cbiAgY2xvc2UoKSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX3ZjUmVmLnJlbW92ZSh0aGlzLl92Y1JlZi5pbmRleE9mKHRoaXMuX2NSZWYuaG9zdFZpZXcpKTtcbiAgICAgIHRoaXMuX2NSZWYgPSBudWxsO1xuICAgICAgdGhpcy5fY2xvc2VkJC5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgdGhlIGRhdGVwaWNrZXIgcG9wdXAgKG9wZW5zIHdoZW4gY2xvc2VkIGFuZCBjbG9zZXMgd2hlbiBvcGVuZWQpLlxuICAgKi9cbiAgdG9nZ2xlKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOYXZpZ2F0ZXMgY3VycmVudCB2aWV3IHRvIHByb3ZpZGVkIGRhdGUuXG4gICAqIFdpdGggZGVmYXVsdCBjYWxlbmRhciB3ZSB1c2UgSVNPIDg2MDE6ICdtb250aCcgaXMgMT1KYW4gLi4uIDEyPURlYy5cbiAgICogSWYgbm90aGluZyBvciBpbnZhbGlkIGRhdGUgcHJvdmlkZWQgY2FsZW5kYXIgd2lsbCBvcGVuIGN1cnJlbnQgbW9udGguXG4gICAqIFVzZSAnc3RhcnREYXRlJyBpbnB1dCBhcyBhbiBhbHRlcm5hdGl2ZVxuICAgKi9cbiAgbmF2aWdhdGVUbyhkYXRlPzoge3llYXI6IG51bWJlciwgbW9udGg6IG51bWJlcn0pIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5uYXZpZ2F0ZVRvKGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG9uQmx1cigpIHsgdGhpcy5fb25Ub3VjaGVkKCk7IH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXNbJ21pbkRhdGUnXSB8fCBjaGFuZ2VzWydtYXhEYXRlJ10pIHtcbiAgICAgIHRoaXMuX3ZhbGlkYXRvckNoYW5nZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseURhdGVwaWNrZXJJbnB1dHMoZGF0ZXBpY2tlckluc3RhbmNlOiBOZ2JEYXRlcGlja2VyKTogdm9pZCB7XG4gICAgWydkYXlUZW1wbGF0ZScsICdkaXNwbGF5TW9udGhzJywgJ2ZpcnN0RGF5T2ZXZWVrJywgJ21hcmtEaXNhYmxlZCcsICdtaW5EYXRlJywgJ21heERhdGUnLCAnbmF2aWdhdGlvbicsXG4gICAgICdvdXRzaWRlRGF5cycsICdzaG93TmF2aWdhdGlvbicsICdzaG93V2Vla2RheXMnLCAnc2hvd1dlZWtOdW1iZXJzJ11cbiAgICAgICAgLmZvckVhY2goKG9wdGlvbk5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgIGlmICh0aGlzW29wdGlvbk5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRhdGVwaWNrZXJJbnN0YW5jZVtvcHRpb25OYW1lXSA9IHRoaXNbb3B0aW9uTmFtZV07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICBkYXRlcGlja2VySW5zdGFuY2Uuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUgfHwgdGhpcy5fbW9kZWw7XG4gIH1cblxuICBwcml2YXRlIF9hcHBseVBvcHVwU3R5bGluZyhuYXRpdmVFbGVtZW50OiBhbnkpIHtcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhuYXRpdmVFbGVtZW50LCAnZHJvcGRvd24tbWVudScpO1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFN0eWxlKG5hdGl2ZUVsZW1lbnQsICdwYWRkaW5nJywgJzAnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyhuYXRpdmVFbGVtZW50LCAnc2hvdycpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2hvdWxkQ2xvc2VPbk91dHNpZGVDbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIHJldHVybiAhW3RoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudF0uc29tZShlbCA9PiBlbC5jb250YWlucyhldmVudC50YXJnZXQpKTtcbiAgfVxuXG4gIHByaXZhdGUgX3N1YnNjcmliZUZvckRhdGVwaWNrZXJPdXRwdXRzKGRhdGVwaWNrZXJJbnN0YW5jZTogTmdiRGF0ZXBpY2tlcikge1xuICAgIGRhdGVwaWNrZXJJbnN0YW5jZS5uYXZpZ2F0ZS5zdWJzY3JpYmUoZGF0ZSA9PiB0aGlzLm5hdmlnYXRlLmVtaXQoZGF0ZSkpO1xuICAgIGRhdGVwaWNrZXJJbnN0YW5jZS5zZWxlY3Quc3Vic2NyaWJlKGRhdGUgPT4ge1xuICAgICAgdGhpcy5kYXRlU2VsZWN0LmVtaXQoZGF0ZSk7XG4gICAgICBpZiAodGhpcy5hdXRvQ2xvc2UgPT09IHRydWUgfHwgdGhpcy5hdXRvQ2xvc2UgPT09ICdpbnNpZGUnKSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX3dyaXRlTW9kZWxWYWx1ZShtb2RlbDogTmdiRGF0ZSkge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsICd2YWx1ZScsIHRoaXMuX3BhcnNlckZvcm1hdHRlci5mb3JtYXQobW9kZWwpKTtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS53cml0ZVZhbHVlKHRoaXMuX2RhdGVBZGFwdGVyLnRvTW9kZWwobW9kZWwpKTtcbiAgICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Zyb21EYXRlU3RydWN0KGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBOZ2JEYXRlIHtcbiAgICBjb25zdCBuZ2JEYXRlID0gZGF0ZSA/IG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgZGF0ZS5tb250aCwgZGF0ZS5kYXkpIDogbnVsbDtcbiAgICByZXR1cm4gdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChuZ2JEYXRlKSA/IG5nYkRhdGUgOiBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQge0NoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1tuZ2JEYXRlcGlja2VyRGF5Vmlld10nLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIHdpZHRoOiAycmVtO1xuICAgICAgaGVpZ2h0OiAycmVtO1xuICAgICAgbGluZS1oZWlnaHQ6IDJyZW07XG4gICAgICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xuICAgICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgfVxuICAgIDpob3N0Lm91dHNpZGUge1xuICAgICAgb3BhY2l0eTogMC41O1xuICAgIH1cbiAgYF0sXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnYnRuLWxpZ2h0JyxcbiAgICAnW2NsYXNzLmJnLXByaW1hcnldJzogJ3NlbGVjdGVkJyxcbiAgICAnW2NsYXNzLnRleHQtd2hpdGVdJzogJ3NlbGVjdGVkJyxcbiAgICAnW2NsYXNzLnRleHQtbXV0ZWRdJzogJ2lzTXV0ZWQoKScsXG4gICAgJ1tjbGFzcy5vdXRzaWRlXSc6ICdpc011dGVkKCknLFxuICAgICdbY2xhc3MuYWN0aXZlXSc6ICdmb2N1c2VkJ1xuICB9LFxuICB0ZW1wbGF0ZTogYHt7IGkxOG4uZ2V0RGF5TnVtZXJhbHMoZGF0ZSkgfX1gXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJEYXlWaWV3IHtcbiAgQElucHV0KCkgY3VycmVudE1vbnRoOiBudW1iZXI7XG4gIEBJbnB1dCgpIGRhdGU6IE5nYkRhdGU7XG4gIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuICBASW5wdXQoKSBmb2N1c2VkOiBib29sZWFuO1xuICBASW5wdXQoKSBzZWxlY3RlZDogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4pIHt9XG5cbiAgaXNNdXRlZCgpIHsgcmV0dXJuICF0aGlzLnNlbGVjdGVkICYmICh0aGlzLmRhdGUubW9udGggIT09IHRoaXMuY3VycmVudE1vbnRoIHx8IHRoaXMuZGlzYWJsZWQpOyB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHt0b0ludGVnZXJ9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdD5zZWxlY3Qge1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgLW1zLWZsZXg6IDEgMSBhdXRvO1xuICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICBwYWRkaW5nOiAwIDAuNXJlbTtcbiAgICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gICAgICBoZWlnaHQ6IDEuODVyZW07XG4gICAgfVxuICBgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8c2VsZWN0XG4gICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgY2xhc3M9XCJjdXN0b20tc2VsZWN0XCJcbiAgICAgIFt2YWx1ZV09XCJkYXRlPy5tb250aFwiXG4gICAgICAoY2hhbmdlKT1cImNoYW5nZU1vbnRoKCRldmVudC50YXJnZXQudmFsdWUpXCI+XG4gICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IG0gb2YgbW9udGhzXCIgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmdldE1vbnRoRnVsbE5hbWUobSlcIiBbdmFsdWVdPVwibVwiPnt7IGkxOG4uZ2V0TW9udGhTaG9ydE5hbWUobSkgfX08L29wdGlvbj5cbiAgICA8L3NlbGVjdD48c2VsZWN0XG4gICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgY2xhc3M9XCJjdXN0b20tc2VsZWN0XCJcbiAgICAgIFt2YWx1ZV09XCJkYXRlPy55ZWFyXCJcbiAgICAgIChjaGFuZ2UpPVwiY2hhbmdlWWVhcigkZXZlbnQudGFyZ2V0LnZhbHVlKVwiPlxuICAgICAgICA8b3B0aW9uICpuZ0Zvcj1cImxldCB5IG9mIHllYXJzXCIgW3ZhbHVlXT1cInlcIj57eyBpMThuLmdldFllYXJOdW1lcmFscyh5KSB9fTwvb3B0aW9uPlxuICAgIDwvc2VsZWN0PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uU2VsZWN0IHtcbiAgQElucHV0KCkgZGF0ZTogTmdiRGF0ZTtcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1vbnRoczogbnVtYmVyW107XG4gIEBJbnB1dCgpIHllYXJzOiBudW1iZXJbXTtcblxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4bikge31cblxuICBjaGFuZ2VNb250aChtb250aDogc3RyaW5nKSB7IHRoaXMuc2VsZWN0LmVtaXQobmV3IE5nYkRhdGUodGhpcy5kYXRlLnllYXIsIHRvSW50ZWdlcihtb250aCksIDEpKTsgfVxuXG4gIGNoYW5nZVllYXIoeWVhcjogc3RyaW5nKSB7IHRoaXMuc2VsZWN0LmVtaXQobmV3IE5nYkRhdGUodG9JbnRlZ2VyKHllYXIpLCB0aGlzLmRhdGUubW9udGgsIDEpKTsgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYlBlcmlvZCwgTmdiQ2FsZW5kYXJ9IGZyb20gJy4uL25nYi1jYWxlbmRhcic7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtpc051bWJlcn0gZnJvbSAnLi4vLi4vdXRpbC91dGlsJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nYkNhbGVuZGFySGlqcmkgZXh0ZW5kcyBOZ2JDYWxlbmRhciB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgZGF5cyBpbiBhIHNwZWNpZmljIEhpanJpIG1vbnRoLlxuICAgKiBgbW9udGhgIGlzIDEgZm9yIE11aGFycmFtLCAyIGZvciBTYWZhciwgZXRjLlxuICAgKiBgeWVhcmAgaXMgYW55IEhpanJpIHllYXIuXG4gICAqL1xuICBhYnN0cmFjdCBnZXREYXlzUGVyTW9udGgobW9udGg6IG51bWJlciwgeWVhcjogbnVtYmVyKTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBlcXVpdmFsZW50IEhpanJpIGRhdGUgdmFsdWUgZm9yIGEgZ2l2ZSBpbnB1dCBHcmVnb3JpYW4gZGF0ZS5cbiAgICogYGdEYXRlYCBpcyBzIEpTIERhdGUgdG8gYmUgY29udmVydGVkIHRvIEhpanJpLlxuICAgKi9cbiAgYWJzdHJhY3QgZnJvbUdyZWdvcmlhbihnRGF0ZTogRGF0ZSk6IE5nYkRhdGU7XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBjdXJyZW50IEhpanJpIGRhdGUgdG8gR3JlZ29yaWFuLlxuICAgKi9cbiAgYWJzdHJhY3QgdG9HcmVnb3JpYW4oaERhdGU6IE5nYkRhdGUpOiBEYXRlO1xuXG4gIGdldERheXNQZXJXZWVrKCkgeyByZXR1cm4gNzsgfVxuXG4gIGdldE1vbnRocygpIHsgcmV0dXJuIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXTsgfVxuXG4gIGdldFdlZWtzUGVyTW9udGgoKSB7IHJldHVybiA2OyB9XG5cbiAgZ2V0TmV4dChkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q6IE5nYlBlcmlvZCA9ICdkJywgbnVtYmVyID0gMSkge1xuICAgIGRhdGUgPSBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KTtcblxuICAgIHN3aXRjaCAocGVyaW9kKSB7XG4gICAgICBjYXNlICd5JzpcbiAgICAgICAgZGF0ZSA9IHRoaXMuX3NldFllYXIoZGF0ZSwgZGF0ZS55ZWFyICsgbnVtYmVyKTtcbiAgICAgICAgZGF0ZS5tb250aCA9IDE7XG4gICAgICAgIGRhdGUuZGF5ID0gMTtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICBjYXNlICdtJzpcbiAgICAgICAgZGF0ZSA9IHRoaXMuX3NldE1vbnRoKGRhdGUsIGRhdGUubW9udGggKyBudW1iZXIpO1xuICAgICAgICBkYXRlLmRheSA9IDE7XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgY2FzZSAnZCc6XG4gICAgICAgIHJldHVybiB0aGlzLl9zZXREYXkoZGF0ZSwgZGF0ZS5kYXkgKyBudW1iZXIpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJldihkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q6IE5nYlBlcmlvZCA9ICdkJywgbnVtYmVyID0gMSkgeyByZXR1cm4gdGhpcy5nZXROZXh0KGRhdGUsIHBlcmlvZCwgLW51bWJlcik7IH1cblxuICBnZXRXZWVrZGF5KGRhdGU6IE5nYkRhdGUpIHtcbiAgICBjb25zdCBkYXkgPSB0aGlzLnRvR3JlZ29yaWFuKGRhdGUpLmdldERheSgpO1xuICAgIC8vIGluIEpTIERhdGUgU3VuPTAsIGluIElTTyA4NjAxIFN1bj03XG4gICAgcmV0dXJuIGRheSA9PT0gMCA/IDcgOiBkYXk7XG4gIH1cblxuICBnZXRXZWVrTnVtYmVyKHdlZWs6IE5nYkRhdGVbXSwgZmlyc3REYXlPZldlZWs6IG51bWJlcikge1xuICAgIC8vIGluIEpTIERhdGUgU3VuPTAsIGluIElTTyA4NjAxIFN1bj03XG4gICAgaWYgKGZpcnN0RGF5T2ZXZWVrID09PSA3KSB7XG4gICAgICBmaXJzdERheU9mV2VlayA9IDA7XG4gICAgfVxuXG4gICAgY29uc3QgdGh1cnNkYXlJbmRleCA9ICg0ICsgNyAtIGZpcnN0RGF5T2ZXZWVrKSAlIDc7XG4gICAgY29uc3QgZGF0ZSA9IHdlZWtbdGh1cnNkYXlJbmRleF07XG5cbiAgICBjb25zdCBqc0RhdGUgPSB0aGlzLnRvR3JlZ29yaWFuKGRhdGUpO1xuICAgIGpzRGF0ZS5zZXREYXRlKGpzRGF0ZS5nZXREYXRlKCkgKyA0IC0gKGpzRGF0ZS5nZXREYXkoKSB8fCA3KSk7ICAvLyBUaHVyc2RheVxuICAgIGNvbnN0IHRpbWUgPSBqc0RhdGUuZ2V0VGltZSgpO1xuICAgIGNvbnN0IE11aERhdGUgPSB0aGlzLnRvR3JlZ29yaWFuKG5ldyBOZ2JEYXRlKGRhdGUueWVhciwgMSwgMSkpOyAgLy8gQ29tcGFyZSB3aXRoIE11aGFycmFtIDFcbiAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJvdW5kKCh0aW1lIC0gTXVoRGF0ZS5nZXRUaW1lKCkpIC8gODY0MDAwMDApIC8gNykgKyAxO1xuICB9XG5cbiAgZ2V0VG9kYXkoKTogTmdiRGF0ZSB7IHJldHVybiB0aGlzLmZyb21HcmVnb3JpYW4obmV3IERhdGUoKSk7IH1cblxuXG4gIGlzVmFsaWQoZGF0ZTogTmdiRGF0ZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBkYXRlICYmIGlzTnVtYmVyKGRhdGUueWVhcikgJiYgaXNOdW1iZXIoZGF0ZS5tb250aCkgJiYgaXNOdW1iZXIoZGF0ZS5kYXkpICYmXG4gICAgICAgICFpc05hTih0aGlzLnRvR3JlZ29yaWFuKGRhdGUpLmdldFRpbWUoKSk7XG4gIH1cblxuICBwcml2YXRlIF9zZXREYXkoZGF0ZTogTmdiRGF0ZSwgZGF5OiBudW1iZXIpOiBOZ2JEYXRlIHtcbiAgICBkYXkgPSArZGF5O1xuICAgIGxldCBtRGF5cyA9IHRoaXMuZ2V0RGF5c1Blck1vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgaWYgKGRheSA8PSAwKSB7XG4gICAgICB3aGlsZSAoZGF5IDw9IDApIHtcbiAgICAgICAgZGF0ZSA9IHRoaXMuX3NldE1vbnRoKGRhdGUsIGRhdGUubW9udGggLSAxKTtcbiAgICAgICAgbURheXMgPSB0aGlzLmdldERheXNQZXJNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpO1xuICAgICAgICBkYXkgKz0gbURheXM7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXkgPiBtRGF5cykge1xuICAgICAgd2hpbGUgKGRheSA+IG1EYXlzKSB7XG4gICAgICAgIGRheSAtPSBtRGF5cztcbiAgICAgICAgZGF0ZSA9IHRoaXMuX3NldE1vbnRoKGRhdGUsIGRhdGUubW9udGggKyAxKTtcbiAgICAgICAgbURheXMgPSB0aGlzLmdldERheXNQZXJNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBkYXRlLmRheSA9IGRheTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldE1vbnRoKGRhdGU6IE5nYkRhdGUsIG1vbnRoOiBudW1iZXIpOiBOZ2JEYXRlIHtcbiAgICBtb250aCA9ICttb250aDtcbiAgICBkYXRlLnllYXIgPSBkYXRlLnllYXIgKyBNYXRoLmZsb29yKChtb250aCAtIDEpIC8gMTIpO1xuICAgIGRhdGUubW9udGggPSBNYXRoLmZsb29yKCgobW9udGggLSAxKSAlIDEyICsgMTIpICUgMTIpICsgMTtcbiAgICByZXR1cm4gZGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFllYXIoZGF0ZTogTmdiRGF0ZSwgeWVhcjogbnVtYmVyKTogTmdiRGF0ZSB7XG4gICAgZGF0ZS55ZWFyID0gK3llYXI7XG4gICAgcmV0dXJuIGRhdGU7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiQ2FsZW5kYXJIaWpyaX0gZnJvbSAnLi9uZ2ItY2FsZW5kYXItaGlqcmknO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENoZWNrcyBpZiBpc2xhbWljIHllYXIgaXMgYSBsZWFwIHllYXJcbiAqL1xuZnVuY3Rpb24gaXNJc2xhbWljTGVhcFllYXIoaFllYXI6IG51bWJlcik6IGJvb2xlYW4ge1xuICByZXR1cm4gKDE0ICsgMTEgKiBoWWVhcikgJSAzMCA8IDExO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBncmVnb3JpYW4geWVhcnMgaXMgYSBsZWFwIHllYXJcbiAqL1xuZnVuY3Rpb24gaXNHcmVnb3JpYW5MZWFwWWVhcihnRGF0ZTogRGF0ZSk6IGJvb2xlYW4ge1xuICBjb25zdCB5ZWFyID0gZ0RhdGUuZ2V0RnVsbFllYXIoKTtcbiAgcmV0dXJuIHllYXIgJSA0ID09PSAwICYmIHllYXIgJSAxMDAgIT09IDAgfHwgeWVhciAlIDQwMCA9PT0gMDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdGFydCBvZiBIaWpyaSBNb250aC5cbiAqIGBoTW9udGhgIGlzIDAgZm9yIE11aGFycmFtLCAxIGZvciBTYWZhciwgZXRjLlxuICogYGhZZWFyYCBpcyBhbnkgSGlqcmkgaFllYXIuXG4gKi9cbmZ1bmN0aW9uIGdldElzbGFtaWNNb250aFN0YXJ0KGhZZWFyOiBudW1iZXIsIGhNb250aDogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIE1hdGguY2VpbCgyOS41ICogaE1vbnRoKSArIChoWWVhciAtIDEpICogMzU0ICsgTWF0aC5mbG9vcigoMyArIDExICogaFllYXIpIC8gMzAuMCk7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3RhcnQgb2YgSGlqcmkgeWVhci5cbiAqIGB5ZWFyYCBpcyBhbnkgSGlqcmkgeWVhci5cbiAqL1xuZnVuY3Rpb24gZ2V0SXNsYW1pY1llYXJTdGFydCh5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gKHllYXIgLSAxKSAqIDM1NCArIE1hdGguZmxvb3IoKDMgKyAxMSAqIHllYXIpIC8gMzAuMCk7XG59XG5cbmZ1bmN0aW9uIG1vZChhOiBudW1iZXIsIGI6IG51bWJlcik6IG51bWJlciB7XG4gIHJldHVybiBhIC0gYiAqIE1hdGguZmxvb3IoYSAvIGIpO1xufVxuXG4vKipcbiAqIFRoZSBjaXZpbCBjYWxlbmRhciBpcyBvbmUgdHlwZSBvZiBIaWpyaSBjYWxlbmRhcnMgdXNlZCBpbiBpc2xhbWljIGNvdW50cmllcy5cbiAqIFVzZXMgYSBmaXhlZCBjeWNsZSBvZiBhbHRlcm5hdGluZyAyOS0gYW5kIDMwLWRheSBtb250aHMsXG4gKiB3aXRoIGEgbGVhcCBkYXkgYWRkZWQgdG8gdGhlIGxhc3QgbW9udGggb2YgMTEgb3V0IG9mIGV2ZXJ5IDMwIHllYXJzLlxuICogaHR0cDovL2NsZHIudW5pY29kZS5vcmcvZGV2ZWxvcG1lbnQvZGV2ZWxvcG1lbnQtcHJvY2Vzcy9kZXNpZ24tcHJvcG9zYWxzL2lzbGFtaWMtY2FsZW5kYXItdHlwZXNcbiAqIEFsbCB0aGUgY2FsY3VsYXRpb25zIGhlcmUgYXJlIGJhc2VkIG9uIHRoZSBlcXVhdGlvbnMgZnJvbSBcIkNhbGVuZHJpY2FsIENhbGN1bGF0aW9uc1wiIEJ5IEVkd2FyZCBNLiBSZWluZ29sZCwgTmFjaHVtXG4gKiBEZXJzaG93aXR6LlxuICovXG5cbmNvbnN0IEdSRUdPUklBTl9FUE9DSCA9IDE3MjE0MjUuNTtcbmNvbnN0IElTTEFNSUNfRVBPQ0ggPSAxOTQ4NDM5LjU7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JDYWxlbmRhcklzbGFtaWNDaXZpbCBleHRlbmRzIE5nYkNhbGVuZGFySGlqcmkge1xuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXF1aXZhbGVudCBpc2xhbWljKGNpdmlsKSBkYXRlIHZhbHVlIGZvciBhIGdpdmUgaW5wdXQgR3JlZ29yaWFuIGRhdGUuXG4gICAqIGBnRGF0ZWAgaXMgYSBKUyBEYXRlIHRvIGJlIGNvbnZlcnRlZCB0byBIaWpyaS5cbiAgICovXG4gIGZyb21HcmVnb3JpYW4oZ0RhdGU6IERhdGUpOiBOZ2JEYXRlIHtcbiAgICBjb25zdCBnWWVhciA9IGdEYXRlLmdldEZ1bGxZZWFyKCksIGdNb250aCA9IGdEYXRlLmdldE1vbnRoKCksIGdEYXkgPSBnRGF0ZS5nZXREYXRlKCk7XG5cbiAgICBsZXQganVsaWFuRGF5ID0gR1JFR09SSUFOX0VQT0NIIC0gMSArIDM2NSAqIChnWWVhciAtIDEpICsgTWF0aC5mbG9vcigoZ1llYXIgLSAxKSAvIDQpICtcbiAgICAgICAgLU1hdGguZmxvb3IoKGdZZWFyIC0gMSkgLyAxMDApICsgTWF0aC5mbG9vcigoZ1llYXIgLSAxKSAvIDQwMCkgK1xuICAgICAgICBNYXRoLmZsb29yKFxuICAgICAgICAgICAgKDM2NyAqIChnTW9udGggKyAxKSAtIDM2MikgLyAxMiArIChnTW9udGggKyAxIDw9IDIgPyAwIDogaXNHcmVnb3JpYW5MZWFwWWVhcihnRGF0ZSkgPyAtMSA6IC0yKSArIGdEYXkpO1xuICAgIGp1bGlhbkRheSA9IE1hdGguZmxvb3IoanVsaWFuRGF5KSArIDAuNTtcblxuICAgIGNvbnN0IGRheXMgPSBqdWxpYW5EYXkgLSBJU0xBTUlDX0VQT0NIO1xuICAgIGNvbnN0IGhZZWFyID0gTWF0aC5mbG9vcigoMzAgKiBkYXlzICsgMTA2NDYpIC8gMTA2MzEuMCk7XG4gICAgbGV0IGhNb250aCA9IE1hdGguY2VpbCgoZGF5cyAtIDI5IC0gZ2V0SXNsYW1pY1llYXJTdGFydChoWWVhcikpIC8gMjkuNSk7XG4gICAgaE1vbnRoID0gTWF0aC5taW4oaE1vbnRoLCAxMSk7XG4gICAgY29uc3QgaERheSA9IE1hdGguY2VpbChkYXlzIC0gZ2V0SXNsYW1pY01vbnRoU3RhcnQoaFllYXIsIGhNb250aCkpICsgMTtcbiAgICByZXR1cm4gbmV3IE5nYkRhdGUoaFllYXIsIGhNb250aCArIDEsIGhEYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgSlMgZGF0ZSB2YWx1ZSBmb3IgYSBnaXZlIGlucHV0IGlzbGFtaWMoY2l2aWwpIGRhdGUuXG4gICAqIGBoRGF0ZWAgaXMgYW4gaXNsYW1pYyhjaXZpbCkgZGF0ZSB0byBiZSBjb252ZXJ0ZWQgdG8gR3JlZ29yaWFuLlxuICAgKi9cbiAgdG9HcmVnb3JpYW4oaERhdGU6IE5nYkRhdGUpOiBEYXRlIHtcbiAgICBjb25zdCBoWWVhciA9IGhEYXRlLnllYXI7XG4gICAgY29uc3QgaE1vbnRoID0gaERhdGUubW9udGggLSAxO1xuICAgIGNvbnN0IGhEYXkgPSBoRGF0ZS5kYXk7XG4gICAgY29uc3QganVsaWFuRGF5ID1cbiAgICAgICAgaERheSArIE1hdGguY2VpbCgyOS41ICogaE1vbnRoKSArIChoWWVhciAtIDEpICogMzU0ICsgTWF0aC5mbG9vcigoMyArIDExICogaFllYXIpIC8gMzApICsgSVNMQU1JQ19FUE9DSCAtIDE7XG5cbiAgICBjb25zdCB3amQgPSBNYXRoLmZsb29yKGp1bGlhbkRheSAtIDAuNSkgKyAwLjUsIGRlcG9jaCA9IHdqZCAtIEdSRUdPUklBTl9FUE9DSCxcbiAgICAgICAgICBxdWFkcmljZW50ID0gTWF0aC5mbG9vcihkZXBvY2ggLyAxNDYwOTcpLCBkcWMgPSBtb2QoZGVwb2NoLCAxNDYwOTcpLCBjZW50ID0gTWF0aC5mbG9vcihkcWMgLyAzNjUyNCksXG4gICAgICAgICAgZGNlbnQgPSBtb2QoZHFjLCAzNjUyNCksIHF1YWQgPSBNYXRoLmZsb29yKGRjZW50IC8gMTQ2MSksIGRxdWFkID0gbW9kKGRjZW50LCAxNDYxKSxcbiAgICAgICAgICB5aW5kZXggPSBNYXRoLmZsb29yKGRxdWFkIC8gMzY1KTtcbiAgICBsZXQgeWVhciA9IHF1YWRyaWNlbnQgKiA0MDAgKyBjZW50ICogMTAwICsgcXVhZCAqIDQgKyB5aW5kZXg7XG4gICAgaWYgKCEoY2VudCA9PT0gNCB8fCB5aW5kZXggPT09IDQpKSB7XG4gICAgICB5ZWFyKys7XG4gICAgfVxuXG4gICAgY29uc3QgZ1llYXJTdGFydCA9IEdSRUdPUklBTl9FUE9DSCArIDM2NSAqICh5ZWFyIC0gMSkgKyBNYXRoLmZsb29yKCh5ZWFyIC0gMSkgLyA0KSAtIE1hdGguZmxvb3IoKHllYXIgLSAxKSAvIDEwMCkgK1xuICAgICAgICBNYXRoLmZsb29yKCh5ZWFyIC0gMSkgLyA0MDApO1xuXG4gICAgY29uc3QgeWVhcmRheSA9IHdqZCAtIGdZZWFyU3RhcnQ7XG5cbiAgICBjb25zdCB0amQgPSBHUkVHT1JJQU5fRVBPQ0ggLSAxICsgMzY1ICogKHllYXIgLSAxKSArIE1hdGguZmxvb3IoKHllYXIgLSAxKSAvIDQpIC0gTWF0aC5mbG9vcigoeWVhciAtIDEpIC8gMTAwKSArXG4gICAgICAgIE1hdGguZmxvb3IoKHllYXIgLSAxKSAvIDQwMCkgKyBNYXRoLmZsb29yKDczOSAvIDEyICsgKGlzR3JlZ29yaWFuTGVhcFllYXIobmV3IERhdGUoeWVhciwgMywgMSkpID8gLTEgOiAtMikgKyAxKTtcblxuICAgIGNvbnN0IGxlYXBhZGogPSB3amQgPCB0amQgPyAwIDogaXNHcmVnb3JpYW5MZWFwWWVhcihuZXcgRGF0ZSh5ZWFyLCAzLCAxKSkgPyAxIDogMjtcblxuICAgIGNvbnN0IG1vbnRoID0gTWF0aC5mbG9vcigoKHllYXJkYXkgKyBsZWFwYWRqKSAqIDEyICsgMzczKSAvIDM2Nyk7XG4gICAgY29uc3QgdGpkMiA9IEdSRUdPUklBTl9FUE9DSCAtIDEgKyAzNjUgKiAoeWVhciAtIDEpICsgTWF0aC5mbG9vcigoeWVhciAtIDEpIC8gNCkgLSBNYXRoLmZsb29yKCh5ZWFyIC0gMSkgLyAxMDApICtcbiAgICAgICAgTWF0aC5mbG9vcigoeWVhciAtIDEpIC8gNDAwKSArXG4gICAgICAgIE1hdGguZmxvb3IoXG4gICAgICAgICAgICAoMzY3ICogbW9udGggLSAzNjIpIC8gMTIgKyAobW9udGggPD0gMiA/IDAgOiBpc0dyZWdvcmlhbkxlYXBZZWFyKG5ldyBEYXRlKHllYXIsIG1vbnRoIC0gMSwgMSkpID8gLTEgOiAtMikgK1xuICAgICAgICAgICAgMSk7XG5cbiAgICBjb25zdCBkYXkgPSB3amQgLSB0amQyICsgMTtcblxuICAgIHJldHVybiBuZXcgRGF0ZSh5ZWFyLCBtb250aCAtIDEsIGRheSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gYSBzcGVjaWZpYyBIaWpyaSBtb250aC5cbiAgICogYG1vbnRoYCBpcyAxIGZvciBNdWhhcnJhbSwgMiBmb3IgU2FmYXIsIGV0Yy5cbiAgICogYHllYXJgIGlzIGFueSBIaWpyaSB5ZWFyLlxuICAgKi9cbiAgZ2V0RGF5c1Blck1vbnRoKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlcik6IG51bWJlciB7XG4gICAgeWVhciA9IHllYXIgKyBNYXRoLmZsb29yKG1vbnRoIC8gMTMpO1xuICAgIG1vbnRoID0gKChtb250aCAtIDEpICUgMTIpICsgMTtcbiAgICBsZXQgbGVuZ3RoID0gMjkgKyBtb250aCAlIDI7XG4gICAgaWYgKG1vbnRoID09PSAxMiAmJiBpc0lzbGFtaWNMZWFwWWVhcih5ZWFyKSkge1xuICAgICAgbGVuZ3RoKys7XG4gICAgfVxuICAgIHJldHVybiBsZW5ndGg7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdiQ2FsZW5kYXJJc2xhbWljQ2l2aWx9IGZyb20gJy4vbmdiLWNhbGVuZGFyLWlzbGFtaWMtY2l2aWwnO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIFVtYWxxdXJhIGNhbGVuZGFyIGlzIG9uZSB0eXBlIG9mIEhpanJpIGNhbGVuZGFycyB1c2VkIGluIGlzbGFtaWMgY291bnRyaWVzLlxuICogVGhpcyBDYWxlbmRhciBpcyB1c2VkIGJ5IFNhdWRpIEFyYWJpYSBmb3IgYWRtaW5pc3RyYXRpdmUgcHVycG9zZS5cbiAqIFVubGlrZSB0YWJ1bGFyIGNhbGVuZGFycywgdGhlIGFsZ29yaXRobSBpbnZvbHZlcyBhc3Ryb25vbWljYWwgY2FsY3VsYXRpb24sIGJ1dCBpdCdzIHN0aWxsIGRldGVybWluaXN0aWMuXG4gKiBodHRwOi8vY2xkci51bmljb2RlLm9yZy9kZXZlbG9wbWVudC9kZXZlbG9wbWVudC1wcm9jZXNzL2Rlc2lnbi1wcm9wb3NhbHMvaXNsYW1pYy1jYWxlbmRhci10eXBlc1xuICovXG5cbmNvbnN0IEdSRUdPUklBTl9GSVJTVF9EQVRFID0gbmV3IERhdGUoMTg4MiwgMTAsIDEyKTtcbmNvbnN0IEdSRUdPUklBTl9MQVNUX0RBVEUgPSBuZXcgRGF0ZSgyMTc0LCAxMCwgMjUpO1xuY29uc3QgSElKUklfQkVHSU4gPSAxMzAwO1xuY29uc3QgSElKUklfRU5EID0gMTYwMDtcbmNvbnN0IE9ORV9EQVkgPSAxMDAwICogNjAgKiA2MCAqIDI0O1xuXG5jb25zdCBNT05USF9MRU5HVEggPSBbXG4gIC8vIDEzMDAtMTMwNFxuICAnMTAxMDEwMTAxMDEwJywgJzExMDEwMTAxMDEwMCcsICcxMTEwMTEwMDEwMDEnLCAnMDExMDExMDEwMTAwJywgJzAxMTAxMTEwMTAxMCcsXG4gIC8vIDEzMDUtMTMwOVxuICAnMDAxMTAxMTAxMTAwJywgJzEwMTAxMDEwMTEwMScsICcwMTAxMDEwMTAxMDEnLCAnMDExMDEwMTAxMDAxJywgJzAxMTExMDAxMDAxMCcsXG4gIC8vIDEzMTAtMTMxNFxuICAnMTAxMTEwMTAxMDAxJywgJzAxMDExMTAxMDEwMCcsICcxMDEwMTEwMTEwMTAnLCAnMDEwMTAxMDExMTAwJywgJzExMDEwMDEwMTEwMScsXG4gIC8vIDEzMTUtMTMxOVxuICAnMDExMDEwMDEwMTAxJywgJzAxMTEwMTAwMTAxMCcsICcxMDExMDEwMTAxMDAnLCAnMTAxMTAxMTAxMDEwJywgJzAxMDExMDEwMTEwMScsXG4gIC8vIDEzMjAtMTMyNFxuICAnMDEwMDEwMTAxMTEwJywgJzEwMTAwMTAwMTExMScsICcwMTAxMDAwMTAxMTEnLCAnMDExMDEwMDAxMDExJywgJzAxMTAxMDEwMDEwMScsXG4gIC8vIDEzMjUtMTMyOVxuICAnMTAxMDExMDEwMTAxJywgJzAwMTAxMTAxMDExMCcsICcxMDAxMDEwMTEwMTEnLCAnMDEwMDEwMDExMTAxJywgJzEwMTAwMTAwMTEwMScsXG4gIC8vIDEzMzAtMTMzNFxuICAnMTEwMTAwMTAwMTEwJywgJzExMDExMDAxMDEwMScsICcwMTAxMTAxMDExMDAnLCAnMTAwMTEwMTEwMTEwJywgJzAwMTAxMDExMTAxMCcsXG4gIC8vIDEzMzUtMTMzOVxuICAnMTAxMDAxMDExMDExJywgJzAxMDEwMDEwMTAxMScsICcxMDEwMTAwMTAxMDEnLCAnMDExMDExMDAxMDEwJywgJzEwMTAxMTEwMTAwMScsXG4gIC8vIDEzNDAtMTM0NFxuICAnMDAxMDExMTEwMTAwJywgJzEwMDEwMTExMDExMCcsICcwMDEwMTAxMTAxMTAnLCAnMTAwMTAxMDEwMTEwJywgJzEwMTAxMTAwMTAxMCcsXG4gIC8vIDEzNDUtMTM0OVxuICAnMTAxMTEwMTAwMTAwJywgJzEwMTExMTAxMDAxMCcsICcwMTAxMTEwMTEwMDEnLCAnMDAxMDExMDExMTAwJywgJzEwMDEwMTEwMTEwMScsXG4gIC8vIDEzNTAtMTM1NFxuICAnMDEwMTAxMDAxMTAxJywgJzEwMTAxMDEwMDEwMScsICcxMDExMDEwMTAwMTAnLCAnMTAxMTEwMTAwMTAxJywgJzAxMDExMDExMDEwMCcsXG4gIC8vIDEzNTUtMTM1OVxuICAnMTAwMTEwMTEwMTEwJywgJzAxMDEwMTAxMDExMScsICcwMDEwMTAwMTAxMTEnLCAnMDEwMTAxMDAxMDExJywgJzAxMTAxMDEwMDAxMScsXG4gIC8vIDEzNjAtMTM2NFxuICAnMDExMTAxMDEwMDEwJywgJzEwMTEwMTEwMDEwMScsICcwMTAxMDExMDEwMTAnLCAnMTAxMDEwMTAxMDExJywgJzAxMDEwMDEwMTAxMScsXG4gIC8vIDEzNjUtMTM2OVxuICAnMTEwMDEwMDEwMTAxJywgJzExMDEwMTAwMTAxMCcsICcxMTAxMTAxMDAxMDEnLCAnMDEwMTExMDAxMDEwJywgJzEwMTAxMTAxMDExMCcsXG4gIC8vIDEzNzAtMTM3NFxuICAnMTAwMTAxMDEwMTExJywgJzAxMDAxMDEwMTAxMScsICcxMDAxMDEwMDEwMTEnLCAnMTAxMDEwMTAwMTAxJywgJzEwMTEwMTAxMDAxMCcsXG4gIC8vIDEzNzUtMTM3OVxuICAnMTAxMTAxMTAxMDEwJywgJzAxMDEwMTExMDEwMScsICcwMDEwMDExMTAxMTAnLCAnMTAwMDEwMTEwMTExJywgJzAxMDAwMTAxMTAxMScsXG4gIC8vIDEzODAtMTM4NFxuICAnMDEwMTAxMDEwMTAxJywgJzAxMDExMDEwMTAwMScsICcwMTAxMTAxMTAxMDAnLCAnMTAwMTExMDExMDEwJywgJzAxMDAxMTAxMTEwMScsXG4gIC8vIDEzODUtMTM4OVxuICAnMDAxMDAxMTAxMTEwJywgJzEwMDEwMDExMDExMCcsICcxMDEwMTAxMDEwMTAnLCAnMTEwMTAxMDEwMTAwJywgJzExMDExMDExMDAxMCcsXG4gIC8vIDEzOTAtMTM5NFxuICAnMDEwMTExMDEwMTAxJywgJzAwMTAxMTAxMTAxMCcsICcxMDAxMDEwMTEwMTEnLCAnMDEwMDEwMTAxMDExJywgJzEwMTAwMTAxMDEwMScsXG4gIC8vIDEzOTUtMTM5OVxuICAnMTAxMTAxMDAxMDAxJywgJzEwMTEwMTEwMDEwMCcsICcxMDExMDExMTAwMDEnLCAnMDEwMTEwMTEwMTAwJywgJzEwMTAxMDExMDEwMScsXG4gIC8vIDE0MDAtMTQwNFxuICAnMTAxMDAxMDEwMTAxJywgJzExMDEwMDEwMDEwMScsICcxMTEwMTAwMTAwMTAnLCAnMTExMDExMDAxMDAxJywgJzAxMTAxMTAxMDEwMCcsXG4gIC8vIDE0MDUtMTQwOVxuICAnMTAxMDExMTAxMDAxJywgJzEwMDEwMTEwMTAxMScsICcwMTAwMTAxMDEwMTEnLCAnMTAxMDEwMDEwMDExJywgJzExMDEwMTAwMTAwMScsXG4gIC8vIDE0MTAtMTQxNFxuICAnMTEwMTEwMTAwMTAwJywgJzExMDExMDExMDAxMCcsICcxMDEwMTAxMTEwMDEnLCAnMDEwMDEwMTExMDEwJywgJzEwMTAwMTAxMTAxMScsXG4gIC8vIDE0MTUtMTQxOVxuICAnMDEwMTAwMTAxMDExJywgJzEwMTAxMDAxMDEwMScsICcxMDExMDAxMDEwMTAnLCAnMTAxMTAxMDEwMTAxJywgJzAxMDEwMTAxMTEwMCcsXG4gIC8vIDE0MjAtMTQyNFxuICAnMDEwMDEwMTExMTAxJywgJzAwMTAwMDExMTEwMScsICcxMDAxMDAwMTExMDEnLCAnMTAxMDEwMDEwMTAxJywgJzEwMTEwMTAwMTAxMCcsXG4gIC8vIDE0MjUtMTQyOVxuICAnMTAxMTAxMDExMDEwJywgJzAxMDEwMTEwMTEwMScsICcwMDEwMTAxMTAxMTAnLCAnMTAwMTAwMTExMDExJywgJzAxMDAxMDAxMTAxMScsXG4gIC8vIDE0MzAtMTQzNFxuICAnMDExMDAxMDEwMTAxJywgJzAxMTAxMDEwMTAwMScsICcwMTExMDEwMTAxMDAnLCAnMTAxMTAxMTAxMDEwJywgJzAxMDEwMTEwMTEwMCcsXG4gIC8vIDE0MzUtMTQzOVxuICAnMTAxMDEwMTAxMTAxJywgJzAxMDEwMTAxMDEwMScsICcxMDExMDAxMDEwMDEnLCAnMTAxMTEwMDEwMDEwJywgJzEwMTExMDEwMTAwMScsXG4gIC8vIDE0NDAtMTQ0NFxuICAnMDEwMTExMDEwMTAwJywgJzEwMTAxMTAxMTAxMCcsICcwMTAxMDEwMTEwMTAnLCAnMTAxMDEwMTAxMDExJywgJzAxMDExMDAxMDEwMScsXG4gIC8vIDE0NDUtMTQ0OVxuICAnMDExMTAxMDAxMDAxJywgJzAxMTEwMTEwMDEwMCcsICcxMDExMTAxMDEwMTAnLCAnMDEwMTEwMTEwMTAxJywgJzAwMTAxMDExMDExMCcsXG4gIC8vIDE0NTAtMTQ1NFxuICAnMTAxMDAxMDEwMTEwJywgJzExMTAwMTAwMTEwMScsICcxMDExMDAxMDAxMDEnLCAnMTAxMTAxMDEwMDEwJywgJzEwMTEwMTEwMTAxMCcsXG4gIC8vIDE0NTUtMTQ1OVxuICAnMDEwMTEwMTAxMTAxJywgJzAwMTAxMDEwMTExMCcsICcxMDAxMDAxMDExMTEnLCAnMDEwMDEwMDEwMTExJywgJzAxMTAwMTAwMTAxMScsXG4gIC8vIDE0NjAtMTQ2NFxuICAnMDExMDEwMTAwMTAxJywgJzAxMTAxMDEwMTEwMCcsICcxMDEwMTEwMTAxMTAnLCAnMDEwMTAxMDExMTAxJywgJzAxMDAxMDAxMTEwMScsXG4gIC8vIDE0NjUtMTQ2OVxuICAnMTAxMDAxMDAxMTAxJywgJzExMDEwMDAxMDExMCcsICcxMTAxMTAwMTAxMDEnLCAnMDEwMTEwMTAxMDEwJywgJzAxMDExMDExMDEwMScsXG4gIC8vIDE0NzAtMTQ3NFxuICAnMDAxMDExMDExMDEwJywgJzEwMDEwMTAxMTAxMScsICcwMTAwMTAxMDExMDEnLCAnMDEwMTEwMDEwMTAxJywgJzAxMTAxMTAwMTAxMCcsXG4gIC8vIDE0NzUtMTQ3OVxuICAnMDExMDExMTAwMTAwJywgJzEwMTAxMTEwMTAxMCcsICcwMTAwMTExMTAxMDEnLCAnMDAxMDEwMTEwMTEwJywgJzEwMDEwMTAxMDExMCcsXG4gIC8vIDE0ODAtMTQ4NFxuICAnMTAxMDEwMTAxMDEwJywgJzEwMTEwMTAxMDEwMCcsICcxMDExMTEwMTAwMTAnLCAnMDEwMTExMDExMDAxJywgJzAwMTAxMTEwMTAxMCcsXG4gIC8vIDE0ODUtMTQ4OVxuICAnMTAwMTAxMTAxMTAxJywgJzAxMDAxMDEwMTEwMScsICcxMDEwMTAwMTAxMDEnLCAnMTAxMTAxMDAxMDEwJywgJzEwMTExMDEwMDEwMScsXG4gIC8vIDE0OTAtMTQ5NFxuICAnMDEwMTEwMTEwMDEwJywgJzEwMDExMDExMDEwMScsICcwMTAwMTEwMTAxMTAnLCAnMTAxMDEwMDEwMTExJywgJzAxMDEwMTAwMDExMScsXG4gIC8vIDE0OTUtMTQ5OVxuICAnMDExMDEwMDEwMDExJywgJzAxMTEwMTAwMTAwMScsICcxMDExMDEwMTAxMDEnLCAnMDEwMTAxMTAxMDEwJywgJzEwMTAwMTEwMTAxMScsXG4gIC8vIDE1MDAtMTUwNFxuICAnMDEwMTAwMTAxMDExJywgJzEwMTAxMDAwMTAxMScsICcxMTAxMDEwMDAxMTAnLCAnMTEwMTEwMTAwMDExJywgJzAxMDExMTAwMTAxMCcsXG4gIC8vIDE1MDUtMTUwOVxuICAnMTAxMDExMDEwMTEwJywgJzAxMDAxMTAxMTAxMScsICcwMDEwMDExMDEwMTEnLCAnMTAwMTAxMDAxMDExJywgJzEwMTAxMDEwMDEwMScsXG4gIC8vIDE1MTAtMTUxNFxuICAnMTAxMTAxMDEwMDEwJywgJzEwMTEwMTEwMTAwMScsICcwMTAxMDExMTAxMDEnLCAnMDAwMTAxMTEwMTEwJywgJzEwMDAxMDExMDExMScsXG4gIC8vIDE1MTUtMTUxOVxuICAnMDAxMDAxMDExMDExJywgJzAxMDEwMDEwMTAxMScsICcwMTAxMDExMDAxMDEnLCAnMDEwMTEwMTEwMTAwJywgJzEwMDExMTAxMTAxMCcsXG4gIC8vIDE1MjAtMTUyNFxuICAnMDEwMDExMTAxMTAxJywgJzAwMDEwMTEwMTEwMScsICcxMDAwMTAxMTAxMTAnLCAnMTAxMDEwMTAwMTEwJywgJzExMDEwMTAxMDAxMCcsXG4gIC8vIDE1MjUtMTUyOVxuICAnMTEwMTEwMTAxMDAxJywgJzAxMDExMTAxMDEwMCcsICcxMDEwMTEwMTEwMTAnLCAnMTAwMTAxMDExMDExJywgJzAxMDAxMDEwMTAxMScsXG4gIC8vIDE1MzAtMTUzNFxuICAnMDExMDAxMDEwMDExJywgJzAxMTEwMDEwMTAwMScsICcwMTExMDExMDAwMTAnLCAnMTAxMTEwMTAxMDAxJywgJzAxMDExMDExMDAxMCcsXG4gIC8vIDE1MzUtMTUzOVxuICAnMTAxMDEwMTEwMTAxJywgJzAxMDEwMTAxMDEwMScsICcxMDExMDAxMDAxMDEnLCAnMTEwMTEwMDEwMDEwJywgJzExMTAxMTAwMTAwMScsXG4gIC8vIDE1NDAtMTU0NFxuICAnMDExMDExMDEwMDEwJywgJzEwMTAxMTEwMTAwMScsICcwMTAxMDExMDEwMTEnLCAnMDEwMDEwMTAxMDExJywgJzEwMTAwMTAxMDEwMScsXG4gIC8vIDE1NDUtMTU0OVxuICAnMTEwMTAwMTAxMDAxJywgJzExMDEwMTAxMDEwMCcsICcxMTAxMTAxMDEwMTAnLCAnMTAwMTEwMTEwMTAxJywgJzAxMDAxMDExMTAxMCcsXG4gIC8vIDE1NTAtMTU1NFxuICAnMTAxMDAwMTExMDExJywgJzAxMDAxMDAxMTAxMScsICcxMDEwMDEwMDExMDEnLCAnMTAxMDEwMTAxMDEwJywgJzEwMTAxMTAxMDEwMScsXG4gIC8vIDE1NTUtMTU1OVxuICAnMDAxMDExMDExMDEwJywgJzEwMDEwMTAxMTEwMScsICcwMTAwMDEwMTExMTAnLCAnMTAxMDAwMTAxMTEwJywgJzExMDAxMDAxMTAxMCcsXG4gIC8vIDE1NjAtMTU2NFxuICAnMTEwMTAxMDEwMTAxJywgJzAxMTAxMDExMDAxMCcsICcwMTEwMTAxMTEwMDEnLCAnMDEwMDEwMTExMDEwJywgJzEwMTAwMTAxMTEwMScsXG4gIC8vIDE1NjUtMTU2OVxuICAnMDEwMTAwMTAxMTAxJywgJzEwMTAxMDAxMDEwMScsICcxMDExMDEwMTAwMTAnLCAnMTAxMTEwMTAxMDAwJywgJzEwMTExMDExMDEwMCcsXG4gIC8vIDE1NzAtMTU3NFxuICAnMDEwMTEwMTExMDAxJywgJzAwMTAxMTAxMTAxMCcsICcxMDAxMDEwMTEwMTAnLCAnMTAxMTAxMDAxMDEwJywgJzExMDExMDEwMDEwMCcsXG4gIC8vIDE1NzUtMTU3OVxuICAnMTExMDExMDEwMDAxJywgJzAxMTAxMTEwMTAwMCcsICcxMDExMDExMDEwMTAnLCAnMDEwMTAxMTAxMTAxJywgJzAxMDEwMDExMDEwMScsXG4gIC8vIDE1ODAtMTU4NFxuICAnMDExMDEwMDEwMTAxJywgJzExMDEwMTAwMTAxMCcsICcxMTAxMTAxMDEwMDAnLCAnMTEwMTExMDEwMTAwJywgJzAxMTAxMTAxMTAxMCcsXG4gIC8vIDE1ODUtMTU4OVxuICAnMDEwMTAxMDExMDExJywgJzAwMTAxMDAxMTEwMScsICcwMTEwMDAxMDEwMTEnLCAnMTAxMTAwMDEwMTAxJywgJzEwMTEwMTAwMTAxMCcsXG4gIC8vIDE1OTAtMTU5NFxuICAnMTAxMTEwMDEwMTAxJywgJzAxMDExMDEwMTAxMCcsICcxMDEwMTAxMDExMTAnLCAnMTAwMTAwMTAxMTEwJywgJzExMDAxMDAwMTExMScsXG4gIC8vIDE1OTUtMTU5OVxuICAnMDEwMTAwMTAwMTExJywgJzAxMTAxMDAxMDEwMScsICcwMTEwMTAxMDEwMTAnLCAnMTAxMDExMDEwMTEwJywgJzAxMDEwMTAxMTEwMScsXG4gIC8vIDE2MDBcbiAgJzAwMTAxMDAxMTEwMSdcbl07XG5cbmZ1bmN0aW9uIGdldERheXNEaWZmKGRhdGUxOiBEYXRlLCBkYXRlMjogRGF0ZSk6IG51bWJlciB7XG4gIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhkYXRlMS5nZXRUaW1lKCkgLSBkYXRlMi5nZXRUaW1lKCkpO1xuICByZXR1cm4gTWF0aC5yb3VuZChkaWZmIC8gT05FX0RBWSk7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JDYWxlbmRhcklzbGFtaWNVbWFscXVyYSBleHRlbmRzIE5nYkNhbGVuZGFySXNsYW1pY0NpdmlsIHtcbiAgLyoqXG4gICogUmV0dXJucyB0aGUgZXF1aXZhbGVudCBpc2xhbWljKFVtYWxxdXJhKSBkYXRlIHZhbHVlIGZvciBhIGdpdmUgaW5wdXQgR3JlZ29yaWFuIGRhdGUuXG4gICogYGdkYXRlYCBpcyBzIEpTIERhdGUgdG8gYmUgY29udmVydGVkIHRvIEhpanJpLlxuICAqL1xuICBmcm9tR3JlZ29yaWFuKGdEYXRlOiBEYXRlKTogTmdiRGF0ZSB7XG4gICAgbGV0IGhEYXkgPSAxLCBoTW9udGggPSAwLCBoWWVhciA9IDEzMDA7XG4gICAgbGV0IGRheXNEaWZmID0gZ2V0RGF5c0RpZmYoZ0RhdGUsIEdSRUdPUklBTl9GSVJTVF9EQVRFKTtcbiAgICBpZiAoZ0RhdGUuZ2V0VGltZSgpIC0gR1JFR09SSUFOX0ZJUlNUX0RBVEUuZ2V0VGltZSgpID49IDAgJiYgZ0RhdGUuZ2V0VGltZSgpIC0gR1JFR09SSUFOX0xBU1RfREFURS5nZXRUaW1lKCkgPD0gMCkge1xuICAgICAgbGV0IHllYXIgPSAxMzAwO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNT05USF9MRU5HVEgubGVuZ3RoOyBpKyssIHllYXIrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBsZXQgbnVtT2ZEYXlzID0gK01PTlRIX0xFTkdUSFtpXVtqXSArIDI5O1xuICAgICAgICAgIGlmIChkYXlzRGlmZiA8PSBudW1PZkRheXMpIHtcbiAgICAgICAgICAgIGhEYXkgPSBkYXlzRGlmZiArIDE7XG4gICAgICAgICAgICBpZiAoaERheSA+IG51bU9mRGF5cykge1xuICAgICAgICAgICAgICBoRGF5ID0gMTtcbiAgICAgICAgICAgICAgaisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGogPiAxMSkge1xuICAgICAgICAgICAgICBqID0gMDtcbiAgICAgICAgICAgICAgeWVhcisrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaE1vbnRoID0gajtcbiAgICAgICAgICAgIGhZZWFyID0geWVhcjtcbiAgICAgICAgICAgIHJldHVybiBuZXcgTmdiRGF0ZShoWWVhciwgaE1vbnRoICsgMSwgaERheSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGRheXNEaWZmID0gZGF5c0RpZmYgLSBudW1PZkRheXM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLmZyb21HcmVnb3JpYW4oZ0RhdGUpO1xuICAgIH1cbiAgfVxuICAvKipcbiAgKiBDb252ZXJ0cyB0aGUgY3VycmVudCBIaWpyaSBkYXRlIHRvIEdyZWdvcmlhbi5cbiAgKi9cbiAgdG9HcmVnb3JpYW4oaERhdGU6IE5nYkRhdGUpOiBEYXRlIHtcbiAgICBjb25zdCBoWWVhciA9IGhEYXRlLnllYXI7XG4gICAgY29uc3QgaE1vbnRoID0gaERhdGUubW9udGggLSAxO1xuICAgIGNvbnN0IGhEYXkgPSBoRGF0ZS5kYXk7XG4gICAgbGV0IGdEYXRlID0gbmV3IERhdGUoR1JFR09SSUFOX0ZJUlNUX0RBVEUpO1xuICAgIGxldCBkYXlEaWZmID0gaERheSAtIDE7XG4gICAgaWYgKGhZZWFyID49IEhJSlJJX0JFR0lOICYmIGhZZWFyIDw9IEhJSlJJX0VORCkge1xuICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBoWWVhciAtIEhJSlJJX0JFR0lOOyB5KyspIHtcbiAgICAgICAgZm9yIChsZXQgbSA9IDA7IG0gPCAxMjsgbSsrKSB7XG4gICAgICAgICAgZGF5RGlmZiArPSArTU9OVEhfTEVOR1RIW3ldW21dICsgMjk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgaE1vbnRoOyBtKyspIHtcbiAgICAgICAgZGF5RGlmZiArPSArTU9OVEhfTEVOR1RIW2hZZWFyIC0gSElKUklfQkVHSU5dW21dICsgMjk7XG4gICAgICB9XG4gICAgICBnRGF0ZS5zZXREYXRlKEdSRUdPUklBTl9GSVJTVF9EQVRFLmdldERhdGUoKSArIGRheURpZmYpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnRGF0ZSA9IHN1cGVyLnRvR3JlZ29yaWFuKGhEYXRlKTtcbiAgICB9XG4gICAgcmV0dXJuIGdEYXRlO1xuICB9XG4gIC8qKlxuICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBkYXlzIGluIGEgc3BlY2lmaWMgSGlqcmkgaE1vbnRoLlxuICAqIGBoTW9udGhgIGlzIDEgZm9yIE11aGFycmFtLCAyIGZvciBTYWZhciwgZXRjLlxuICAqIGBoWWVhcmAgaXMgYW55IEhpanJpIGhZZWFyLlxuICAqL1xuICBnZXREYXlzUGVyTW9udGgoaE1vbnRoOiBudW1iZXIsIGhZZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGlmIChoWWVhciA+PSBISUpSSV9CRUdJTiAmJiBoWWVhciA8PSBISUpSSV9FTkQpIHtcbiAgICAgIGNvbnN0IHBvcyA9IGhZZWFyIC0gSElKUklfQkVHSU47XG4gICAgICByZXR1cm4gK01PTlRIX0xFTkdUSFtwb3NdW2hNb250aCAtIDFdICsgMjk7XG4gICAgfVxuICAgIHJldHVybiBzdXBlci5nZXREYXlzUGVyTW9udGgoaE1vbnRoLCBoWWVhcik7XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTmdiRGF0ZU5hdGl2ZUFkYXB0ZXIgZXh0ZW5kcyBOZ2JEYXRlQWRhcHRlcjxEYXRlPiB7XG4gIGZyb21Nb2RlbChkYXRlOiBEYXRlKTogTmdiRGF0ZVN0cnVjdCB7XG4gICAgcmV0dXJuIChkYXRlICYmIGRhdGUuZ2V0RnVsbFllYXIpID8ge3llYXI6IGRhdGUuZ2V0RnVsbFllYXIoKSwgbW9udGg6IGRhdGUuZ2V0TW9udGgoKSArIDEsIGRheTogZGF0ZS5nZXREYXRlKCl9IDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsO1xuICB9XG5cbiAgdG9Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogRGF0ZSB7XG4gICAgcmV0dXJuIGRhdGUgJiYgZGF0ZS55ZWFyICYmIGRhdGUubW9udGggPyBuZXcgRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGggLSAxLCBkYXRlLmRheSwgMTIpIDogbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuLi9uZ2ItZGF0ZSc7XG5cbi8qKlxuICogUmV0dXJucyB0aGUgZXF1aXZhbGVudCBKUyBkYXRlIHZhbHVlIGZvciBhIGdpdmUgaW5wdXQgSmFsYWxpIGRhdGUuXG4gKiBgamFsYWxpRGF0ZWAgaXMgYW4gSmFsYWxpIGRhdGUgdG8gYmUgY29udmVydGVkIHRvIEdyZWdvcmlhbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvR3JlZ29yaWFuKGphbGFsaURhdGU6IE5nYkRhdGUpOiBEYXRlIHtcbiAgbGV0IGpkbiA9IGphbGFsaVRvSnVsaWFuKGphbGFsaURhdGUueWVhciwgamFsYWxpRGF0ZS5tb250aCwgamFsYWxpRGF0ZS5kYXkpO1xuICBsZXQgZGF0ZSA9IGp1bGlhblRvR3JlZ29yaWFuKGpkbik7XG4gIGRhdGUuc2V0SG91cnMoNiwgMzAsIDMsIDIwMCk7XG4gIHJldHVybiBkYXRlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIGVxdWl2YWxlbnQgamFsYWxpIGRhdGUgdmFsdWUgZm9yIGEgZ2l2ZSBpbnB1dCBHcmVnb3JpYW4gZGF0ZS5cbiAqIGBnZGF0ZWAgaXMgYSBKUyBEYXRlIHRvIGJlIGNvbnZlcnRlZCB0byBqYWxhbGkuXG4gKiB1dGMgdG8gbG9jYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21HcmVnb3JpYW4oZ2RhdGU6IERhdGUpOiBOZ2JEYXRlIHtcbiAgbGV0IGcyZCA9IGdyZWdvcmlhblRvSnVsaWFuKGdkYXRlLmdldEZ1bGxZZWFyKCksIGdkYXRlLmdldE1vbnRoKCkgKyAxLCBnZGF0ZS5nZXREYXRlKCkpO1xuICByZXR1cm4ganVsaWFuVG9KYWxhbGkoZzJkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldEphbGFsaVllYXIoZGF0ZTogTmdiRGF0ZSwgeWVhclZhbHVlOiBudW1iZXIpOiBOZ2JEYXRlIHtcbiAgZGF0ZS55ZWFyID0gK3llYXJWYWx1ZTtcbiAgcmV0dXJuIGRhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRKYWxhbGlNb250aChkYXRlOiBOZ2JEYXRlLCBtb250aDogbnVtYmVyKTogTmdiRGF0ZSB7XG4gIG1vbnRoID0gK21vbnRoO1xuICBkYXRlLnllYXIgPSBkYXRlLnllYXIgKyBNYXRoLmZsb29yKChtb250aCAtIDEpIC8gMTIpO1xuICBkYXRlLm1vbnRoID0gTWF0aC5mbG9vcigoKG1vbnRoIC0gMSkgJSAxMiArIDEyKSAlIDEyKSArIDE7XG4gIHJldHVybiBkYXRlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SmFsYWxpRGF5KGRhdGU6IE5nYkRhdGUsIGRheTogbnVtYmVyKTogTmdiRGF0ZSB7XG4gIGxldCBtRGF5cyA9IGdldERheXNQZXJNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpO1xuICBpZiAoZGF5IDw9IDApIHtcbiAgICB3aGlsZSAoZGF5IDw9IDApIHtcbiAgICAgIGRhdGUgPSBzZXRKYWxhbGlNb250aChkYXRlLCBkYXRlLm1vbnRoIC0gMSk7XG4gICAgICBtRGF5cyA9IGdldERheXNQZXJNb250aChkYXRlLm1vbnRoLCBkYXRlLnllYXIpO1xuICAgICAgZGF5ICs9IG1EYXlzO1xuICAgIH1cbiAgfSBlbHNlIGlmIChkYXkgPiBtRGF5cykge1xuICAgIHdoaWxlIChkYXkgPiBtRGF5cykge1xuICAgICAgZGF5IC09IG1EYXlzO1xuICAgICAgZGF0ZSA9IHNldEphbGFsaU1vbnRoKGRhdGUsIGRhdGUubW9udGggKyAxKTtcbiAgICAgIG1EYXlzID0gZ2V0RGF5c1Blck1vbnRoKGRhdGUubW9udGgsIGRhdGUueWVhcik7XG4gICAgfVxuICB9XG4gIGRhdGUuZGF5ID0gZGF5O1xuICByZXR1cm4gZGF0ZTtcbn1cblxuZnVuY3Rpb24gbW9kKGE6IG51bWJlciwgYjogbnVtYmVyKTogbnVtYmVyIHtcbiAgcmV0dXJuIGEgLSBiICogTWF0aC5mbG9vcihhIC8gYik7XG59XG5cbmZ1bmN0aW9uIGRpdihhOiBudW1iZXIsIGI6IG51bWJlcikge1xuICByZXR1cm4gTWF0aC50cnVuYyhhIC8gYik7XG59XG5cbi8qXG4gVGhpcyBmdW5jdGlvbiBkZXRlcm1pbmVzIGlmIHRoZSBKYWxhbGkgKFBlcnNpYW4pIHllYXIgaXNcbiBsZWFwICgzNjYtZGF5IGxvbmcpIG9yIGlzIHRoZSBjb21tb24geWVhciAoMzY1IGRheXMpLCBhbmRcbiBmaW5kcyB0aGUgZGF5IGluIE1hcmNoIChHcmVnb3JpYW4gY2FsZW5kYXIpIG9mIHRoZSBmaXJzdFxuIGRheSBvZiB0aGUgSmFsYWxpIHllYXIgKGphbGFsaVllYXIpLlxuIEBwYXJhbSBqYWxhbGlZZWFyIEphbGFsaSBjYWxlbmRhciB5ZWFyICgtNjEgdG8gMzE3NylcbiBAcmV0dXJuXG4gbGVhcDogbnVtYmVyIG9mIHllYXJzIHNpbmNlIHRoZSBsYXN0IGxlYXAgeWVhciAoMCB0byA0KVxuIGdZZWFyOiBHcmVnb3JpYW4geWVhciBvZiB0aGUgYmVnaW5uaW5nIG9mIEphbGFsaSB5ZWFyXG4gbWFyY2g6IHRoZSBNYXJjaCBkYXkgb2YgRmFydmFyZGluIHRoZSAxc3QgKDFzdCBkYXkgb2YgamFsYWxpWWVhcilcbiBAc2VlOiBodHRwOi8vd3d3LmFzdHJvLnVuaS50b3J1bi5wbC9+a2IvUGFwZXJzL0VNUC9QZXJzaWFuQy1FTVAuaHRtXG4gQHNlZTogaHR0cDovL3d3dy5mb3VybWlsYWIuY2gvZG9jdW1lbnRzL2NhbGVuZGFyL1xuICovXG5mdW5jdGlvbiBqYWxDYWwoamFsYWxpWWVhcjogbnVtYmVyKSB7XG4gIC8vIEphbGFsaSB5ZWFycyBzdGFydGluZyB0aGUgMzMteWVhciBydWxlLlxuICBsZXQgYnJlYWtzID1cbiAgICAgIFstNjEsIDksIDM4LCAxOTksIDQyNiwgNjg2LCA3NTYsIDgxOCwgMTExMSwgMTE4MSwgMTIxMCwgMTYzNSwgMjA2MCwgMjA5NywgMjE5MiwgMjI2MiwgMjMyNCwgMjM5NCwgMjQ1NiwgMzE3OF07XG4gIGNvbnN0IGJyZWFrc0xlbmd0aCA9IGJyZWFrcy5sZW5ndGg7XG4gIGNvbnN0IGdZZWFyID0gamFsYWxpWWVhciArIDYyMTtcbiAgbGV0IGxlYXBKID0gLTE0O1xuICBsZXQganAgPSBicmVha3NbMF07XG5cbiAgaWYgKGphbGFsaVllYXIgPCBqcCB8fCBqYWxhbGlZZWFyID49IGJyZWFrc1ticmVha3NMZW5ndGggLSAxXSkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBKYWxhbGkgeWVhciAnICsgamFsYWxpWWVhcik7XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsaW1pdGluZyB5ZWFycyBmb3IgdGhlIEphbGFsaSB5ZWFyIGphbGFsaVllYXIuXG4gIGxldCBqdW1wO1xuICBmb3IgKGxldCBpID0gMTsgaSA8IGJyZWFrc0xlbmd0aDsgaSArPSAxKSB7XG4gICAgY29uc3Qgam0gPSBicmVha3NbaV07XG4gICAganVtcCA9IGptIC0ganA7XG4gICAgaWYgKGphbGFsaVllYXIgPCBqbSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGxlYXBKID0gbGVhcEogKyBkaXYoanVtcCwgMzMpICogOCArIGRpdihtb2QoanVtcCwgMzMpLCA0KTtcbiAgICBqcCA9IGptO1xuICB9XG4gIGxldCBuID0gamFsYWxpWWVhciAtIGpwO1xuXG4gIC8vIEZpbmQgdGhlIG51bWJlciBvZiBsZWFwIHllYXJzIGZyb20gQUQgNjIxIHRvIHRoZSBiZWdpbm5pbmdcbiAgLy8gb2YgdGhlIGN1cnJlbnQgSmFsYWxpIHllYXIgaW4gdGhlIFBlcnNpYW4gY2FsZW5kYXIuXG4gIGxlYXBKID0gbGVhcEogKyBkaXYobiwgMzMpICogOCArIGRpdihtb2QobiwgMzMpICsgMywgNCk7XG4gIGlmIChtb2QoanVtcCwgMzMpID09PSA0ICYmIGp1bXAgLSBuID09PSA0KSB7XG4gICAgbGVhcEogKz0gMTtcbiAgfVxuXG4gIC8vIEFuZCB0aGUgc2FtZSBpbiB0aGUgR3JlZ29yaWFuIGNhbGVuZGFyICh1bnRpbCB0aGUgeWVhciBnWWVhcikuXG4gIGNvbnN0IGxlYXBHID0gZGl2KGdZZWFyLCA0KSAtIGRpdigoZGl2KGdZZWFyLCAxMDApICsgMSkgKiAzLCA0KSAtIDE1MDtcblxuICAvLyBEZXRlcm1pbmUgdGhlIEdyZWdvcmlhbiBkYXRlIG9mIEZhcnZhcmRpbiB0aGUgMXN0LlxuICBjb25zdCBtYXJjaCA9IDIwICsgbGVhcEogLSBsZWFwRztcblxuICAvLyBGaW5kIGhvdyBtYW55IHllYXJzIGhhdmUgcGFzc2VkIHNpbmNlIHRoZSBsYXN0IGxlYXAgeWVhci5cbiAgaWYgKGp1bXAgLSBuIDwgNikge1xuICAgIG4gPSBuIC0ganVtcCArIGRpdihqdW1wICsgNCwgMzMpICogMzM7XG4gIH1cbiAgbGV0IGxlYXAgPSBtb2QobW9kKG4gKyAxLCAzMykgLSAxLCA0KTtcbiAgaWYgKGxlYXAgPT09IC0xKSB7XG4gICAgbGVhcCA9IDQ7XG4gIH1cblxuICByZXR1cm4ge2xlYXA6IGxlYXAsIGd5OiBnWWVhciwgbWFyY2g6IG1hcmNofTtcbn1cblxuLypcbiBDYWxjdWxhdGVzIEdyZWdvcmlhbiBhbmQgSnVsaWFuIGNhbGVuZGFyIGRhdGVzIGZyb20gdGhlIEp1bGlhbiBEYXkgbnVtYmVyXG4gKGpkbikgZm9yIHRoZSBwZXJpb2Qgc2luY2UgamRuPS0zNDgzOTY1NSAoaS5lLiB0aGUgeWVhciAtMTAwMTAwIG9mIGJvdGhcbiBjYWxlbmRhcnMpIHRvIHNvbWUgbWlsbGlvbnMgeWVhcnMgYWhlYWQgb2YgdGhlIHByZXNlbnQuXG4gQHBhcmFtIGpkbiBKdWxpYW4gRGF5IG51bWJlclxuIEByZXR1cm5cbiBnWWVhcjogQ2FsZW5kYXIgeWVhciAoeWVhcnMgQkMgbnVtYmVyZWQgMCwgLTEsIC0yLCAuLi4pXG4gZ01vbnRoOiBDYWxlbmRhciBtb250aCAoMSB0byAxMilcbiBnRGF5OiBDYWxlbmRhciBkYXkgb2YgdGhlIG1vbnRoIE0gKDEgdG8gMjgvMjkvMzAvMzEpXG4gKi9cbmZ1bmN0aW9uIGp1bGlhblRvR3JlZ29yaWFuKGp1bGlhbkRheU51bWJlcjogbnVtYmVyKSB7XG4gIGxldCBqID0gNCAqIGp1bGlhbkRheU51bWJlciArIDEzOTM2MTYzMTtcbiAgaiA9IGogKyBkaXYoZGl2KDQgKiBqdWxpYW5EYXlOdW1iZXIgKyAxODMxODc3MjAsIDE0NjA5NykgKiAzLCA0KSAqIDQgLSAzOTA4O1xuICBjb25zdCBpID0gZGl2KG1vZChqLCAxNDYxKSwgNCkgKiA1ICsgMzA4O1xuICBjb25zdCBnRGF5ID0gZGl2KG1vZChpLCAxNTMpLCA1KSArIDE7XG4gIGNvbnN0IGdNb250aCA9IG1vZChkaXYoaSwgMTUzKSwgMTIpICsgMTtcbiAgY29uc3QgZ1llYXIgPSBkaXYoaiwgMTQ2MSkgLSAxMDAxMDAgKyBkaXYoOCAtIGdNb250aCwgNik7XG5cbiAgcmV0dXJuIG5ldyBEYXRlKGdZZWFyLCBnTW9udGggLSAxLCBnRGF5KTtcbn1cblxuLypcbiBDb252ZXJ0cyBhIGRhdGUgb2YgdGhlIEphbGFsaSBjYWxlbmRhciB0byB0aGUgSnVsaWFuIERheSBudW1iZXIuXG4gQHBhcmFtIGp5IEphbGFsaSB5ZWFyICgxIHRvIDMxMDApXG4gQHBhcmFtIGptIEphbGFsaSBtb250aCAoMSB0byAxMilcbiBAcGFyYW0gamQgSmFsYWxpIGRheSAoMSB0byAyOS8zMSlcbiBAcmV0dXJuIEp1bGlhbiBEYXkgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGdyZWdvcmlhblRvSnVsaWFuKGd5OiBudW1iZXIsIGdtOiBudW1iZXIsIGdkOiBudW1iZXIpIHtcbiAgbGV0IGQgPSBkaXYoKGd5ICsgZGl2KGdtIC0gOCwgNikgKyAxMDAxMDApICogMTQ2MSwgNCkgKyBkaXYoMTUzICogbW9kKGdtICsgOSwgMTIpICsgMiwgNSkgKyBnZCAtIDM0ODQwNDA4O1xuICBkID0gZCAtIGRpdihkaXYoZ3kgKyAxMDAxMDAgKyBkaXYoZ20gLSA4LCA2KSwgMTAwKSAqIDMsIDQpICsgNzUyO1xuICByZXR1cm4gZDtcbn1cblxuLypcbiBDb252ZXJ0cyB0aGUgSnVsaWFuIERheSBudW1iZXIgdG8gYSBkYXRlIGluIHRoZSBKYWxhbGkgY2FsZW5kYXIuXG4gQHBhcmFtIGp1bGlhbkRheU51bWJlciBKdWxpYW4gRGF5IG51bWJlclxuIEByZXR1cm5cbiBqYWxhbGlZZWFyOiBKYWxhbGkgeWVhciAoMSB0byAzMTAwKVxuIGphbGFsaU1vbnRoOiBKYWxhbGkgbW9udGggKDEgdG8gMTIpXG4gamFsYWxpRGF5OiBKYWxhbGkgZGF5ICgxIHRvIDI5LzMxKVxuICovXG5mdW5jdGlvbiBqdWxpYW5Ub0phbGFsaShqdWxpYW5EYXlOdW1iZXI6IG51bWJlcikge1xuICBsZXQgZ3kgPSBqdWxpYW5Ub0dyZWdvcmlhbihqdWxpYW5EYXlOdW1iZXIpLmdldEZ1bGxZZWFyKCkgIC8vIENhbGN1bGF0ZSBHcmVnb3JpYW4geWVhciAoZ3kpLlxuICAgICAgLFxuICAgICAgamFsYWxpWWVhciA9IGd5IC0gNjIxLCByID0gamFsQ2FsKGphbGFsaVllYXIpLCBncmVnb3JpYW5EYXkgPSBncmVnb3JpYW5Ub0p1bGlhbihneSwgMywgci5tYXJjaCksIGphbGFsaURheSxcbiAgICAgIGphbGFsaU1vbnRoLCBudW1iZXJPZkRheXM7XG5cbiAgLy8gRmluZCBudW1iZXIgb2YgZGF5cyB0aGF0IHBhc3NlZCBzaW5jZSAxIEZhcnZhcmRpbi5cbiAgbnVtYmVyT2ZEYXlzID0ganVsaWFuRGF5TnVtYmVyIC0gZ3JlZ29yaWFuRGF5O1xuICBpZiAobnVtYmVyT2ZEYXlzID49IDApIHtcbiAgICBpZiAobnVtYmVyT2ZEYXlzIDw9IDE4NSkge1xuICAgICAgLy8gVGhlIGZpcnN0IDYgbW9udGhzLlxuICAgICAgamFsYWxpTW9udGggPSAxICsgZGl2KG51bWJlck9mRGF5cywgMzEpO1xuICAgICAgamFsYWxpRGF5ID0gbW9kKG51bWJlck9mRGF5cywgMzEpICsgMTtcbiAgICAgIHJldHVybiBuZXcgTmdiRGF0ZShqYWxhbGlZZWFyLCBqYWxhbGlNb250aCwgamFsYWxpRGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhlIHJlbWFpbmluZyBtb250aHMuXG4gICAgICBudW1iZXJPZkRheXMgLT0gMTg2O1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBQcmV2aW91cyBKYWxhbGkgeWVhci5cbiAgICBqYWxhbGlZZWFyIC09IDE7XG4gICAgbnVtYmVyT2ZEYXlzICs9IDE3OTtcbiAgICBpZiAoci5sZWFwID09PSAxKSB7XG4gICAgICBudW1iZXJPZkRheXMgKz0gMTtcbiAgICB9XG4gIH1cbiAgamFsYWxpTW9udGggPSA3ICsgZGl2KG51bWJlck9mRGF5cywgMzApO1xuICBqYWxhbGlEYXkgPSBtb2QobnVtYmVyT2ZEYXlzLCAzMCkgKyAxO1xuXG4gIHJldHVybiBuZXcgTmdiRGF0ZShqYWxhbGlZZWFyLCBqYWxhbGlNb250aCwgamFsYWxpRGF5KTtcbn1cblxuLypcbiBDb252ZXJ0cyBhIGRhdGUgb2YgdGhlIEphbGFsaSBjYWxlbmRhciB0byB0aGUgSnVsaWFuIERheSBudW1iZXIuXG4gQHBhcmFtIGpZZWFyIEphbGFsaSB5ZWFyICgxIHRvIDMxMDApXG4gQHBhcmFtIGpNb250aCBKYWxhbGkgbW9udGggKDEgdG8gMTIpXG4gQHBhcmFtIGpEYXkgSmFsYWxpIGRheSAoMSB0byAyOS8zMSlcbiBAcmV0dXJuIEp1bGlhbiBEYXkgbnVtYmVyXG4gKi9cbmZ1bmN0aW9uIGphbGFsaVRvSnVsaWFuKGpZZWFyOiBudW1iZXIsIGpNb250aDogbnVtYmVyLCBqRGF5OiBudW1iZXIpIHtcbiAgbGV0IHIgPSBqYWxDYWwoalllYXIpO1xuICByZXR1cm4gZ3JlZ29yaWFuVG9KdWxpYW4oci5neSwgMywgci5tYXJjaCkgKyAoak1vbnRoIC0gMSkgKiAzMSAtIGRpdihqTW9udGgsIDcpICogKGpNb250aCAtIDcpICsgakRheSAtIDE7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGRheXMgaW4gYSBzcGVjaWZpYyBqYWxhbGkgbW9udGguXG4gKi9cbmZ1bmN0aW9uIGdldERheXNQZXJNb250aChtb250aDogbnVtYmVyLCB5ZWFyOiBudW1iZXIpOiBudW1iZXIge1xuICBpZiAobW9udGggPD0gNikge1xuICAgIHJldHVybiAzMTtcbiAgfVxuICBpZiAobW9udGggPD0gMTEpIHtcbiAgICByZXR1cm4gMzA7XG4gIH1cbiAgaWYgKGphbENhbCh5ZWFyKS5sZWFwID09PSAwKSB7XG4gICAgcmV0dXJuIDMwO1xuICB9XG4gIHJldHVybiAyOTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4uL25nYi1kYXRlJztcbmltcG9ydCB7TmdiQ2FsZW5kYXIsIE5nYlBlcmlvZH0gZnJvbSAnLi4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi8uLi91dGlsL3V0aWwnO1xuXG5pbXBvcnQge2Zyb21HcmVnb3JpYW4sIHNldEphbGFsaURheSwgc2V0SmFsYWxpTW9udGgsIHNldEphbGFsaVllYXIsIHRvR3JlZ29yaWFufSBmcm9tICcuL2phbGFsaSc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JDYWxlbmRhclBlcnNpYW4gZXh0ZW5kcyBOZ2JDYWxlbmRhciB7XG4gIGdldERheXNQZXJXZWVrKCkgeyByZXR1cm4gNzsgfVxuXG4gIGdldE1vbnRocygpIHsgcmV0dXJuIFsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5LCAxMCwgMTEsIDEyXTsgfVxuXG4gIGdldFdlZWtzUGVyTW9udGgoKSB7IHJldHVybiA2OyB9XG5cbiAgZ2V0TmV4dChkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q6IE5nYlBlcmlvZCA9ICdkJywgbnVtYmVyID0gMSkge1xuICAgIGRhdGUgPSBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KTtcblxuICAgIHN3aXRjaCAocGVyaW9kKSB7XG4gICAgICBjYXNlICd5JzpcbiAgICAgICAgZGF0ZSA9IHNldEphbGFsaVllYXIoZGF0ZSwgZGF0ZS55ZWFyICsgbnVtYmVyKTtcbiAgICAgICAgZGF0ZS5tb250aCA9IDE7XG4gICAgICAgIGRhdGUuZGF5ID0gMTtcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICBjYXNlICdtJzpcbiAgICAgICAgZGF0ZSA9IHNldEphbGFsaU1vbnRoKGRhdGUsIGRhdGUubW9udGggKyBudW1iZXIpO1xuICAgICAgICBkYXRlLmRheSA9IDE7XG4gICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgY2FzZSAnZCc6XG4gICAgICAgIHJldHVybiBzZXRKYWxhbGlEYXkoZGF0ZSwgZGF0ZS5kYXkgKyBudW1iZXIpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0UHJldihkYXRlOiBOZ2JEYXRlLCBwZXJpb2Q6IE5nYlBlcmlvZCA9ICdkJywgbnVtYmVyID0gMSkgeyByZXR1cm4gdGhpcy5nZXROZXh0KGRhdGUsIHBlcmlvZCwgLW51bWJlcik7IH1cblxuICBnZXRXZWVrZGF5KGRhdGU6IE5nYkRhdGUpIHtcbiAgICBjb25zdCBkYXkgPSB0b0dyZWdvcmlhbihkYXRlKS5nZXREYXkoKTtcbiAgICAvLyBpbiBKUyBEYXRlIFN1bj0wLCBpbiBJU08gODYwMSBTdW49N1xuICAgIHJldHVybiBkYXkgPT09IDAgPyA3IDogZGF5O1xuICB9XG5cbiAgZ2V0V2Vla051bWJlcih3ZWVrOiBOZ2JEYXRlW10sIGZpcnN0RGF5T2ZXZWVrOiBudW1iZXIpIHtcbiAgICAvLyBpbiBKUyBEYXRlIFN1bj0wLCBpbiBJU08gODYwMSBTdW49N1xuICAgIGlmIChmaXJzdERheU9mV2VlayA9PT0gNykge1xuICAgICAgZmlyc3REYXlPZldlZWsgPSAwO1xuICAgIH1cblxuICAgIGNvbnN0IHRodXJzZGF5SW5kZXggPSAoNCArIDcgLSBmaXJzdERheU9mV2VlaykgJSA3O1xuICAgIGNvbnN0IGRhdGUgPSB3ZWVrW3RodXJzZGF5SW5kZXhdO1xuXG4gICAgY29uc3QganNEYXRlID0gdG9HcmVnb3JpYW4oZGF0ZSk7XG4gICAganNEYXRlLnNldERhdGUoanNEYXRlLmdldERhdGUoKSArIDQgLSAoanNEYXRlLmdldERheSgpIHx8IDcpKTsgIC8vIFRodXJzZGF5XG4gICAgY29uc3QgdGltZSA9IGpzRGF0ZS5nZXRUaW1lKCk7XG4gICAgY29uc3Qgc3RhcnREYXRlID0gdG9HcmVnb3JpYW4obmV3IE5nYkRhdGUoZGF0ZS55ZWFyLCAxLCAxKSk7XG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yb3VuZCgodGltZSAtIHN0YXJ0RGF0ZS5nZXRUaW1lKCkpIC8gODY0MDAwMDApIC8gNykgKyAxO1xuICB9XG5cbiAgZ2V0VG9kYXkoKTogTmdiRGF0ZSB7IHJldHVybiBmcm9tR3JlZ29yaWFuKG5ldyBEYXRlKCkpOyB9XG5cbiAgaXNWYWxpZChkYXRlOiBOZ2JEYXRlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGRhdGUgJiYgaXNJbnRlZ2VyKGRhdGUueWVhcikgJiYgaXNJbnRlZ2VyKGRhdGUubW9udGgpICYmIGlzSW50ZWdlcihkYXRlLmRheSkgJiZcbiAgICAgICAgIWlzTmFOKHRvR3JlZ29yaWFuKGRhdGUpLmdldFRpbWUoKSk7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge0Zvcm1zTW9kdWxlfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJ9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJNb250aFZpZXd9IGZyb20gJy4vZGF0ZXBpY2tlci1tb250aC12aWV3JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb259IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uJztcbmltcG9ydCB7TmdiSW5wdXREYXRlcGlja2VyfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyRGF5Vmlld30gZnJvbSAnLi9kYXRlcGlja2VyLWRheS12aWV3JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG4sIE5nYkRhdGVwaWNrZXJJMThuRGVmYXVsdH0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuaW1wb3J0IHtOZ2JDYWxlbmRhciwgTmdiQ2FsZW5kYXJHcmVnb3JpYW59IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7TmdiRGF0ZVBhcnNlckZvcm1hdHRlciwgTmdiRGF0ZUlTT1BhcnNlckZvcm1hdHRlcn0gZnJvbSAnLi9uZ2ItZGF0ZS1wYXJzZXItZm9ybWF0dGVyJztcbmltcG9ydCB7TmdiRGF0ZUFkYXB0ZXIsIE5nYkRhdGVTdHJ1Y3RBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyTmF2aWdhdGlvblNlbGVjdH0gZnJvbSAnLi9kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0JztcblxuZXhwb3J0IHtOZ2JEYXRlcGlja2VyLCBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudH0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmV4cG9ydCB7TmdiSW5wdXREYXRlcGlja2VyfSBmcm9tICcuL2RhdGVwaWNrZXItaW5wdXQnO1xuZXhwb3J0IHtOZ2JDYWxlbmRhciwgTmdiUGVyaW9kfSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5leHBvcnQge05nYkNhbGVuZGFySXNsYW1pY0NpdmlsfSBmcm9tICcuL2hpanJpL25nYi1jYWxlbmRhci1pc2xhbWljLWNpdmlsJztcbmV4cG9ydCB7TmdiQ2FsZW5kYXJJc2xhbWljVW1hbHF1cmF9IGZyb20gJy4vaGlqcmkvbmdiLWNhbGVuZGFyLWlzbGFtaWMtdW1hbHF1cmEnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VyTW9udGhWaWV3fSBmcm9tICcuL2RhdGVwaWNrZXItbW9udGgtdmlldyc7XG5leHBvcnQge05nYkRhdGVwaWNrZXJEYXlWaWV3fSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXZpZXcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VyTmF2aWdhdGlvbn0gZnJvbSAnLi9kYXRlcGlja2VyLW5hdmlnYXRpb24nO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VyTmF2aWdhdGlvblNlbGVjdH0gZnJvbSAnLi9kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0JztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlckNvbmZpZ30gZnJvbSAnLi9kYXRlcGlja2VyLWNvbmZpZyc7XG5leHBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5leHBvcnQge05nYkRhdGVTdHJ1Y3R9IGZyb20gJy4vbmdiLWRhdGUtc3RydWN0JztcbmV4cG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5leHBvcnQge05nYkRhdGVBZGFwdGVyfSBmcm9tICcuL2FkYXB0ZXJzL25nYi1kYXRlLWFkYXB0ZXInO1xuZXhwb3J0IHtOZ2JEYXRlTmF0aXZlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1uYXRpdmUtYWRhcHRlcic7XG5leHBvcnQge05nYkRhdGVQYXJzZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5leHBvcnQge05nYkNhbGVuZGFyUGVyc2lhbn0gZnJvbSAnLi9qYWxhbGkvbmdiLWNhbGVuZGFyLXBlcnNpYW4nO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOZ2JEYXRlcGlja2VyLCBOZ2JEYXRlcGlja2VyTW9udGhWaWV3LCBOZ2JEYXRlcGlja2VyTmF2aWdhdGlvbiwgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3QsIE5nYkRhdGVwaWNrZXJEYXlWaWV3LFxuICAgIE5nYklucHV0RGF0ZXBpY2tlclxuICBdLFxuICBleHBvcnRzOiBbTmdiRGF0ZXBpY2tlciwgTmdiSW5wdXREYXRlcGlja2VyXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRm9ybXNNb2R1bGVdLFxuICBwcm92aWRlcnM6IFtcbiAgICB7cHJvdmlkZTogTmdiQ2FsZW5kYXIsIHVzZUNsYXNzOiBOZ2JDYWxlbmRhckdyZWdvcmlhbn0sXG4gICAge3Byb3ZpZGU6IE5nYkRhdGVwaWNrZXJJMThuLCB1c2VDbGFzczogTmdiRGF0ZXBpY2tlckkxOG5EZWZhdWx0fSxcbiAgICB7cHJvdmlkZTogTmdiRGF0ZVBhcnNlckZvcm1hdHRlciwgdXNlQ2xhc3M6IE5nYkRhdGVJU09QYXJzZXJGb3JtYXR0ZXJ9LFxuICAgIHtwcm92aWRlOiBOZ2JEYXRlQWRhcHRlciwgdXNlQ2xhc3M6IE5nYkRhdGVTdHJ1Y3RBZGFwdGVyfVxuICBdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtOZ2JEYXRlcGlja2VyXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYkRhdGVwaWNrZXJNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiRHJvcGRvd24gZGlyZWN0aXZlLlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIGRyb3Bkb3ducyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd25Db25maWcge1xuICBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnb3V0c2lkZScgfCAnaW5zaWRlJyA9IHRydWU7XG4gIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYm90dG9tLWxlZnQnO1xufVxuIiwiaW1wb3J0IHtcbiAgZm9yd2FyZFJlZixcbiAgSW5qZWN0LFxuICBEaXJlY3RpdmUsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgRWxlbWVudFJlZixcbiAgQ29udGVudENoaWxkLFxuICBOZ1pvbmUsXG4gIFJlbmRlcmVyMixcbiAgT25Jbml0LFxuICBPbkRlc3Ryb3ksXG4gIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7ZnJvbUV2ZW50LCByYWNlLCBTdWJqZWN0LCBTdWJzY3JpcHRpb259IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIHRha2VVbnRpbH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtOZ2JEcm9wZG93bkNvbmZpZ30gZnJvbSAnLi9kcm9wZG93bi1jb25maWcnO1xuaW1wb3J0IHtwb3NpdGlvbkVsZW1lbnRzLCBQbGFjZW1lbnRBcnJheSwgUGxhY2VtZW50fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5cbi8qKlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiRHJvcGRvd25NZW51XScsXG4gIGhvc3Q6IHsnW2NsYXNzLmRyb3Bkb3duLW1lbnVdJzogJ3RydWUnLCAnW2NsYXNzLnNob3ddJzogJ2Ryb3Bkb3duLmlzT3BlbigpJywgJ1thdHRyLngtcGxhY2VtZW50XSc6ICdwbGFjZW1lbnQnfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEcm9wZG93bk1lbnUge1xuICBwbGFjZW1lbnQ6IFBsYWNlbWVudCA9ICdib3R0b20nO1xuICBpc09wZW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBOZ2JEcm9wZG93bikpIHB1YmxpYyBkcm9wZG93biwgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sXG4gICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyKSB7fVxuXG4gIGlzRXZlbnRGcm9tKCRldmVudCkgeyByZXR1cm4gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKCRldmVudC50YXJnZXQpOyB9XG5cbiAgcG9zaXRpb24odHJpZ2dlckVsLCBwbGFjZW1lbnQpIHtcbiAgICB0aGlzLmFwcGx5UGxhY2VtZW50KHBvc2l0aW9uRWxlbWVudHModHJpZ2dlckVsLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHBsYWNlbWVudCkpO1xuICB9XG5cbiAgYXBwbHlQbGFjZW1lbnQoX3BsYWNlbWVudDogUGxhY2VtZW50KSB7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBsYWNlbWVudCBjbGFzc2VzXG4gICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudE5vZGUsICdkcm9wdXAnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSwgJ2Ryb3Bkb3duJyk7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBfcGxhY2VtZW50O1xuICAgIC8qKlxuICAgICAqIGFwcGx5IHRoZSBuZXcgcGxhY2VtZW50XG4gICAgICogaW4gY2FzZSBvZiB0b3AgdXNlIHVwLWFycm93IG9yIGRvd24tYXJyb3cgb3RoZXJ3aXNlXG4gICAgICovXG4gICAgaWYgKF9wbGFjZW1lbnQuc2VhcmNoKCdedG9wJykgIT09IC0xKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSwgJ2Ryb3B1cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZSwgJ2Ryb3Bkb3duJyk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogTWFya3MgYW4gZWxlbWVudCB0byB3aGljaCBkcm9wZG93biBtZW51IHdpbGwgYmUgYW5jaG9yZWQuIFRoaXMgaXMgYSBzaW1wbGUgdmVyc2lvblxuICogb2YgdGhlIE5nYkRyb3Bkb3duVG9nZ2xlIGRpcmVjdGl2ZS4gSXQgcGxheXMgdGhlIHNhbWUgcm9sZSBhcyBOZ2JEcm9wZG93blRvZ2dsZSBidXRcbiAqIGRvZXNuJ3QgbGlzdGVuIHRvIGNsaWNrIGV2ZW50cyB0byB0b2dnbGUgZHJvcGRvd24gbWVudSB0aHVzIGVuYWJsaW5nIHN1cHBvcnQgZm9yXG4gKiBldmVudHMgb3RoZXIgdGhhbiBjbGljay5cbiAqXG4gKiBAc2luY2UgMS4xLjBcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nYkRyb3Bkb3duQW5jaG9yXScsXG4gIGhvc3Q6IHsnY2xhc3MnOiAnZHJvcGRvd24tdG9nZ2xlJywgJ2FyaWEtaGFzcG9wdXAnOiAndHJ1ZScsICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdkcm9wZG93bi5pc09wZW4oKSd9XG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duQW5jaG9yIHtcbiAgYW5jaG9yRWw7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duKSkgcHVibGljIGRyb3Bkb3duLCBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50Pikge1xuICAgIHRoaXMuYW5jaG9yRWwgPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgaXNFdmVudEZyb20oJGV2ZW50KSB7IHJldHVybiB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoJGV2ZW50LnRhcmdldCk7IH1cbn1cblxuLyoqXG4gKiBBbGxvd3MgdGhlIGRyb3Bkb3duIHRvIGJlIHRvZ2dsZWQgdmlhIGNsaWNrLiBUaGlzIGRpcmVjdGl2ZSBpcyBvcHRpb25hbDogeW91IGNhbiB1c2UgTmdiRHJvcGRvd25BbmNob3IgYXMgYW5cbiAqIGFsdGVybmF0aXZlLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdiRHJvcGRvd25Ub2dnbGVdJyxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdkcm9wZG93bi10b2dnbGUnLFxuICAgICdhcmlhLWhhc3BvcHVwJzogJ3RydWUnLFxuICAgICdbYXR0ci5hcmlhLWV4cGFuZGVkXSc6ICdkcm9wZG93bi5pc09wZW4oKScsXG4gICAgJyhjbGljayknOiAndG9nZ2xlT3BlbigpJ1xuICB9LFxuICBwcm92aWRlcnM6IFt7cHJvdmlkZTogTmdiRHJvcGRvd25BbmNob3IsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYkRyb3Bkb3duVG9nZ2xlKX1dXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duVG9nZ2xlIGV4dGVuZHMgTmdiRHJvcGRvd25BbmNob3Ige1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KGZvcndhcmRSZWYoKCkgPT4gTmdiRHJvcGRvd24pKSBkcm9wZG93biwgZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4pIHtcbiAgICBzdXBlcihkcm9wZG93biwgZWxlbWVudFJlZik7XG4gIH1cblxuICB0b2dnbGVPcGVuKCkgeyB0aGlzLmRyb3Bkb3duLnRvZ2dsZSgpOyB9XG59XG5cbi8qKlxuICogVHJhbnNmb3JtcyBhIG5vZGUgaW50byBhIGRyb3Bkb3duLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ1tuZ2JEcm9wZG93bl0nLCBleHBvcnRBczogJ25nYkRyb3Bkb3duJywgaG9zdDogeydbY2xhc3Muc2hvd10nOiAnaXNPcGVuKCknfX0pXG5leHBvcnQgY2xhc3MgTmdiRHJvcGRvd24gaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHByaXZhdGUgX2Nsb3NlZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgQENvbnRlbnRDaGlsZChOZ2JEcm9wZG93bk1lbnUpIHByaXZhdGUgX21lbnU6IE5nYkRyb3Bkb3duTWVudTtcblxuICBAQ29udGVudENoaWxkKE5nYkRyb3Bkb3duQW5jaG9yKSBwcml2YXRlIF9hbmNob3I6IE5nYkRyb3Bkb3duQW5jaG9yO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhhdCBkcm9wZG93biBzaG91bGQgYmUgY2xvc2VkIHdoZW4gc2VsZWN0aW5nIG9uZSBvZiBkcm9wZG93biBpdGVtcyAoY2xpY2spIG9yIHByZXNzaW5nIEVTQy5cbiAgICogV2hlbiBpdCBpcyB0cnVlIChkZWZhdWx0KSBkcm9wZG93bnMgYXJlIGF1dG9tYXRpY2FsbHkgY2xvc2VkIG9uIGJvdGggb3V0c2lkZSBhbmQgaW5zaWRlIChtZW51KSBjbGlja3MuXG4gICAqIFdoZW4gaXQgaXMgZmFsc2UgZHJvcGRvd25zIGFyZSBuZXZlciBhdXRvbWF0aWNhbGx5IGNsb3NlZC5cbiAgICogV2hlbiBpdCBpcyAnb3V0c2lkZScgZHJvcGRvd25zIGFyZSBhdXRvbWF0aWNhbGx5IGNsb3NlZCBvbiBvdXRzaWRlIGNsaWNrcyBidXQgbm90IG9uIG1lbnUgY2xpY2tzLlxuICAgKiBXaGVuIGl0IGlzICdpbnNpZGUnIGRyb3Bkb3ducyBhcmUgYXV0b21hdGljYWxseSBvbiBtZW51IGNsaWNrcyBidXQgbm90IG9uIG91dHNpZGUgY2xpY2tzLlxuICAgKi9cbiAgQElucHV0KCkgYXV0b0Nsb3NlOiBib29sZWFuIHwgJ291dHNpZGUnIHwgJ2luc2lkZSc7XG5cbiAgLyoqXG4gICAqICBEZWZpbmVzIHdoZXRoZXIgb3Igbm90IHRoZSBkcm9wZG93bi1tZW51IGlzIG9wZW4gaW5pdGlhbGx5LlxuICAgKi9cbiAgQElucHV0KCdvcGVuJykgX29wZW4gPSBmYWxzZTtcblxuICAvKipcbiAgICogUGxhY2VtZW50IG9mIGEgcG9wb3ZlciBhY2NlcHRzOlxuICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICogICAgXCJsZWZ0XCIsIFwibGVmdC10b3BcIiwgXCJsZWZ0LWJvdHRvbVwiLCBcInJpZ2h0XCIsIFwicmlnaHQtdG9wXCIsIFwicmlnaHQtYm90dG9tXCJcbiAgICogYW5kIGFycmF5IG9mIGFib3ZlIHZhbHVlcy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG5cbiAgLyoqXG4gICAqICBBbiBldmVudCBmaXJlZCB3aGVuIHRoZSBkcm9wZG93biBpcyBvcGVuZWQgb3IgY2xvc2VkLlxuICAgKiAgRXZlbnQncyBwYXlsb2FkIGVxdWFscyB3aGV0aGVyIGRyb3Bkb3duIGlzIG9wZW4uXG4gICAqL1xuICBAT3V0cHV0KCkgb3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgX2NoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZiwgY29uZmlnOiBOZ2JEcm9wZG93bkNvbmZpZywgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSxcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lKSB7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4geyB0aGlzLl9wb3NpdGlvbk1lbnUoKTsgfSk7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5fbWVudSkge1xuICAgICAgdGhpcy5fbWVudS5hcHBseVBsYWNlbWVudChBcnJheS5pc0FycmF5KHRoaXMucGxhY2VtZW50KSA/ICh0aGlzLnBsYWNlbWVudFswXSkgOiB0aGlzLnBsYWNlbWVudCBhcyBQbGFjZW1lbnQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9vcGVuKSB7XG4gICAgICB0aGlzLl9zZXRDbG9zZUhhbmRsZXJzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyBpZiB0aGUgZHJvcGRvd24gbWVudSBpcyBvcGVuIG9yIG5vdC5cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX29wZW47IH1cblxuICAvKipcbiAgICogT3BlbnMgdGhlIGRyb3Bkb3duIG1lbnUgb2YgYSBnaXZlbiBuYXZiYXIgb3IgdGFiYmVkIG5hdmlnYXRpb24uXG4gICAqL1xuICBvcGVuKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5fb3Blbikge1xuICAgICAgdGhpcy5fb3BlbiA9IHRydWU7XG4gICAgICB0aGlzLl9wb3NpdGlvbk1lbnUoKTtcbiAgICAgIHRoaXMub3BlbkNoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgdGhpcy5fc2V0Q2xvc2VIYW5kbGVycygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NldENsb3NlSGFuZGxlcnMoKSB7XG4gICAgaWYgKHRoaXMuYXV0b0Nsb3NlKSB7XG4gICAgICB0aGlzLl9uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBjb25zdCBlc2NhcGVzJCA9IGZyb21FdmVudDxLZXlib2FyZEV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2tleXVwJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpLCBmaWx0ZXIoZXZlbnQgPT4gZXZlbnQud2hpY2ggPT09IEtleS5Fc2NhcGUpKTtcblxuICAgICAgICBjb25zdCBjbGlja3MkID0gZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSwgZmlsdGVyKGV2ZW50ID0+IHRoaXMuX3Nob3VsZENsb3NlRnJvbUNsaWNrKGV2ZW50KSkpO1xuXG4gICAgICAgIHJhY2U8RXZlbnQ+KFtlc2NhcGVzJCwgY2xpY2tzJF0pLnBpcGUodGFrZVVudGlsKHRoaXMuX2Nsb3NlZCQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xvc2VzIHRoZSBkcm9wZG93biBtZW51IG9mIGEgZ2l2ZW4gbmF2YmFyIG9yIHRhYmJlZCBuYXZpZ2F0aW9uLlxuICAgKi9cbiAgY2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX29wZW4pIHtcbiAgICAgIHRoaXMuX29wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuICAgICAgdGhpcy5vcGVuQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkcm9wZG93biBtZW51IG9mIGEgZ2l2ZW4gbmF2YmFyIG9yIHRhYmJlZCBuYXZpZ2F0aW9uLlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3Nob3VsZENsb3NlRnJvbUNsaWNrKGV2ZW50OiBNb3VzZUV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmJ1dHRvbiAhPT0gMiAmJiAhdGhpcy5faXNFdmVudEZyb21Ub2dnbGUoZXZlbnQpKSB7XG4gICAgICBpZiAodGhpcy5hdXRvQ2xvc2UgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJyAmJiB0aGlzLl9pc0V2ZW50RnJvbU1lbnUoZXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gJ291dHNpZGUnICYmICF0aGlzLl9pc0V2ZW50RnJvbU1lbnUoZXZlbnQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLl9jbG9zZWQkLm5leHQoKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9pc0V2ZW50RnJvbVRvZ2dsZSgkZXZlbnQpIHsgcmV0dXJuIHRoaXMuX2FuY2hvci5pc0V2ZW50RnJvbSgkZXZlbnQpOyB9XG5cbiAgcHJpdmF0ZSBfaXNFdmVudEZyb21NZW51KCRldmVudCkgeyByZXR1cm4gdGhpcy5fbWVudSA/IHRoaXMuX21lbnUuaXNFdmVudEZyb20oJGV2ZW50KSA6IGZhbHNlOyB9XG5cbiAgcHJpdmF0ZSBfcG9zaXRpb25NZW51KCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpICYmIHRoaXMuX21lbnUpIHtcbiAgICAgIHRoaXMuX21lbnUucG9zaXRpb24odGhpcy5fYW5jaG9yLmFuY2hvckVsLCB0aGlzLnBsYWNlbWVudCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRHJvcGRvd24sIE5nYkRyb3Bkb3duQW5jaG9yLCBOZ2JEcm9wZG93blRvZ2dsZSwgTmdiRHJvcGRvd25NZW51fSBmcm9tICcuL2Ryb3Bkb3duJztcblxuZXhwb3J0IHtOZ2JEcm9wZG93biwgTmdiRHJvcGRvd25Ub2dnbGUsIE5nYkRyb3Bkb3duTWVudX0gZnJvbSAnLi9kcm9wZG93bic7XG5leHBvcnQge05nYkRyb3Bkb3duQ29uZmlnfSBmcm9tICcuL2Ryb3Bkb3duLWNvbmZpZyc7XG5cbmNvbnN0IE5HQl9EUk9QRE9XTl9ESVJFQ1RJVkVTID0gW05nYkRyb3Bkb3duLCBOZ2JEcm9wZG93bkFuY2hvciwgTmdiRHJvcGRvd25Ub2dnbGUsIE5nYkRyb3Bkb3duTWVudV07XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBOR0JfRFJPUERPV05fRElSRUNUSVZFUywgZXhwb3J0czogTkdCX0RST1BET1dOX0RJUkVDVElWRVN9KVxuZXhwb3J0IGNsYXNzIE5nYkRyb3Bkb3duTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYkRyb3Bkb3duTW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLW1vZGFsLWJhY2tkcm9wJyxcbiAgdGVtcGxhdGU6ICcnLFxuICBob3N0OiB7J1tjbGFzc10nOiAnXCJtb2RhbC1iYWNrZHJvcCBmYWRlIHNob3dcIiArIChiYWNrZHJvcENsYXNzID8gXCIgXCIgKyBiYWNrZHJvcENsYXNzIDogXCJcIiknfVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbEJhY2tkcm9wIHtcbiAgQElucHV0KCkgYmFja2Ryb3BDbGFzczogc3RyaW5nO1xufVxuIiwiZXhwb3J0IGVudW0gTW9kYWxEaXNtaXNzUmVhc29ucyB7XG4gIEJBQ0tEUk9QX0NMSUNLLFxuICBFU0Ncbn1cbiIsImltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDb21wb25lbnQsXG4gIE91dHB1dCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgSW5qZWN0LFxuICBFbGVtZW50UmVmLFxuICBSZW5kZXJlcjIsXG4gIE9uSW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgT25EZXN0cm95XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge01vZGFsRGlzbWlzc1JlYXNvbnN9IGZyb20gJy4vbW9kYWwtZGlzbWlzcy1yZWFzb25zJztcbmltcG9ydCB7bmdiRm9jdXNUcmFwfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItbW9kYWwtd2luZG93JyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3NdJzogJ1wibW9kYWwgZmFkZSBzaG93IGQtYmxvY2tcIiArICh3aW5kb3dDbGFzcyA/IFwiIFwiICsgd2luZG93Q2xhc3MgOiBcIlwiKScsXG4gICAgJ3JvbGUnOiAnZGlhbG9nJyxcbiAgICAndGFiaW5kZXgnOiAnLTEnLFxuICAgICcoa2V5dXAuZXNjKSc6ICdlc2NLZXkoJGV2ZW50KScsXG4gICAgJyhjbGljayknOiAnYmFja2Ryb3BDbGljaygkZXZlbnQpJyxcbiAgICAnW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XSc6ICdhcmlhTGFiZWxsZWRCeScsXG4gIH0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBbY2xhc3NdPVwiJ21vZGFsLWRpYWxvZycgKyAoc2l6ZSA/ICcgbW9kYWwtJyArIHNpemUgOiAnJykgKyAoY2VudGVyZWQgPyAnIG1vZGFsLWRpYWxvZy1jZW50ZXJlZCcgOiAnJylcIiByb2xlPVwiZG9jdW1lbnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj48bmctY29udGVudD48L25nLWNvbnRlbnQ+PC9kaXY+XG4gICAgPC9kaXY+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JNb2RhbFdpbmRvdyBpbXBsZW1lbnRzIE9uSW5pdCxcbiAgICBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICBwcml2YXRlIF9kb2N1bWVudDogYW55O1xuICBwcml2YXRlIF9lbFdpdGhGb2N1czogRWxlbWVudDsgIC8vIGVsZW1lbnQgdGhhdCBpcyBmb2N1c2VkIHByaW9yIHRvIG1vZGFsIG9wZW5pbmdcblxuICBASW5wdXQoKSBhcmlhTGFiZWxsZWRCeTogc3RyaW5nO1xuICBASW5wdXQoKSBiYWNrZHJvcDogYm9vbGVhbiB8IHN0cmluZyA9IHRydWU7XG4gIEBJbnB1dCgpIGNlbnRlcmVkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGtleWJvYXJkID0gdHJ1ZTtcbiAgQElucHV0KCkgc2l6ZTogc3RyaW5nO1xuICBASW5wdXQoKSB3aW5kb3dDbGFzczogc3RyaW5nO1xuXG4gIEBPdXRwdXQoJ2Rpc21pc3MnKSBkaXNtaXNzRXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQsIHByaXZhdGUgX2VsUmVmOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHRoaXMuX2RvY3VtZW50ID0gZG9jdW1lbnQ7XG4gICAgbmdiRm9jdXNUcmFwKHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuZGlzbWlzc0V2ZW50KTtcbiAgfVxuXG4gIGJhY2tkcm9wQ2xpY2soJGV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYmFja2Ryb3AgPT09IHRydWUgJiYgdGhpcy5fZWxSZWYubmF0aXZlRWxlbWVudCA9PT0gJGV2ZW50LnRhcmdldCkge1xuICAgICAgdGhpcy5kaXNtaXNzKE1vZGFsRGlzbWlzc1JlYXNvbnMuQkFDS0RST1BfQ0xJQ0spO1xuICAgIH1cbiAgfVxuXG4gIGVzY0tleSgkZXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5rZXlib2FyZCAmJiAhJGV2ZW50LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgIHRoaXMuZGlzbWlzcyhNb2RhbERpc21pc3NSZWFzb25zLkVTQyk7XG4gICAgfVxuICB9XG5cbiAgZGlzbWlzcyhyZWFzb24pOiB2b2lkIHsgdGhpcy5kaXNtaXNzRXZlbnQuZW1pdChyZWFzb24pOyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fZWxXaXRoRm9jdXMgPSB0aGlzLl9kb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2RvY3VtZW50LmJvZHksICdtb2RhbC1vcGVuJyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCF0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpKSB7XG4gICAgICB0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50Wydmb2N1cyddLmFwcGx5KHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsIFtdKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCBlbFdpdGhGb2N1cyA9IHRoaXMuX2VsV2l0aEZvY3VzO1xuXG4gICAgbGV0IGVsZW1lbnRUb0ZvY3VzO1xuICAgIGlmIChlbFdpdGhGb2N1cyAmJiBlbFdpdGhGb2N1c1snZm9jdXMnXSAmJiBib2R5LmNvbnRhaW5zKGVsV2l0aEZvY3VzKSkge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBlbFdpdGhGb2N1cztcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbWVudFRvRm9jdXMgPSBib2R5O1xuICAgIH1cbiAgICBlbGVtZW50VG9Gb2N1c1snZm9jdXMnXS5hcHBseShlbGVtZW50VG9Gb2N1cywgW10pO1xuXG4gICAgdGhpcy5fZWxXaXRoRm9jdXMgPSBudWxsO1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKGJvZHksICdtb2RhbC1vcGVuJyk7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIEluamVjdG9yLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld1JlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgUmVuZGVyZXIyLFxuICBDb21wb25lbnRSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IGNsYXNzIENvbnRlbnRSZWYge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbm9kZXM6IGFueVtdLCBwdWJsaWMgdmlld1JlZj86IFZpZXdSZWYsIHB1YmxpYyBjb21wb25lbnRSZWY/OiBDb21wb25lbnRSZWY8YW55Pikge31cbn1cblxuZXhwb3J0IGNsYXNzIFBvcHVwU2VydmljZTxUPiB7XG4gIHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPFQ+O1xuICBwcml2YXRlIF9jb250ZW50UmVmOiBDb250ZW50UmVmO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfdHlwZTogYW55LCBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXG4gICAgICBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge31cblxuICBvcGVuKGNvbnRlbnQ/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+LCBjb250ZXh0PzogYW55KTogQ29tcG9uZW50UmVmPFQ+IHtcbiAgICBpZiAoIXRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgdGhpcy5fY29udGVudFJlZiA9IHRoaXMuX2dldENvbnRlbnRSZWYoY29udGVudCwgY29udGV4dCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSB0aGlzLl92aWV3Q29udGFpbmVyUmVmLmNyZWF0ZUNvbXBvbmVudChcbiAgICAgICAgICB0aGlzLl9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3Rvcnk8VD4odGhpcy5fdHlwZSksIDAsIHRoaXMuX2luamVjdG9yLFxuICAgICAgICAgIHRoaXMuX2NvbnRlbnRSZWYubm9kZXMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl93aW5kb3dSZWY7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICBpZiAodGhpcy5fd2luZG93UmVmKSB7XG4gICAgICB0aGlzLl92aWV3Q29udGFpbmVyUmVmLnJlbW92ZSh0aGlzLl92aWV3Q29udGFpbmVyUmVmLmluZGV4T2YodGhpcy5fd2luZG93UmVmLmhvc3RWaWV3KSk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSBudWxsO1xuXG4gICAgICBpZiAodGhpcy5fY29udGVudFJlZi52aWV3UmVmKSB7XG4gICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYucmVtb3ZlKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLl9jb250ZW50UmVmLnZpZXdSZWYpKTtcbiAgICAgICAgdGhpcy5fY29udGVudFJlZiA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0Q29udGVudFJlZihjb250ZW50OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+LCBjb250ZXh0PzogYW55KTogQ29udGVudFJlZiB7XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW10pO1xuICAgIH0gZWxzZSBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICBjb25zdCB2aWV3UmVmID0gdGhpcy5fdmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXcoPFRlbXBsYXRlUmVmPFQ+PmNvbnRlbnQsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFt2aWV3UmVmLnJvb3ROb2Rlc10sIHZpZXdSZWYpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW1t0aGlzLl9yZW5kZXJlci5jcmVhdGVUZXh0KGAke2NvbnRlbnR9YCldXSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGUsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuXG5cbi8qKiBUeXBlIGZvciB0aGUgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIHNjcm9sbGJhciBjb21wZW5zYXRpb24uICovXG5leHBvcnQgdHlwZSBDb21wZW5zYXRpb25SZXZlcnRlciA9ICgpID0+IHZvaWQ7XG5cblxuXG4vKipcbiAqIFV0aWxpdHkgdG8gaGFuZGxlIHRoZSBzY3JvbGxiYXIuXG4gKlxuICogSXQgYWxsb3dzIHRvIGNvbXBlbnNhdGUgdGhlIGxhY2sgb2YgYSB2ZXJ0aWNhbCBzY3JvbGxiYXIgYnkgYWRkaW5nIGFuXG4gKiBlcXVpdmFsZW50IHBhZGRpbmcgb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LCBhbmQgdG8gcmVtb3ZlIHRoaXMgY29tcGVuc2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxCYXIge1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudCkge31cblxuICAvKipcbiAgICogRGV0ZWN0cyBpZiBhIHNjcm9sbGJhciBpcyBwcmVzZW50IGFuZCBpZiB5ZXMsIGFscmVhZHkgY29tcGVuc2F0ZXMgZm9yIGl0c1xuICAgKiByZW1vdmFsIGJ5IGFkZGluZyBhbiBlcXVpdmFsZW50IHBhZGRpbmcgb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LlxuICAgKlxuICAgKiBAcmV0dXJuIGEgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIGNvbXBlbnNhdGlvbiAobm9vcCBpZiB0aGVyZSB3YXMgbm9uZSxcbiAgICogb3RoZXJ3aXNlIGEgZnVuY3Rpb24gcmVtb3ZpbmcgdGhlIHBhZGRpbmcpXG4gICAqL1xuICBjb21wZW5zYXRlKCk6IENvbXBlbnNhdGlvblJldmVydGVyIHsgcmV0dXJuICF0aGlzLl9pc1ByZXNlbnQoKSA/IG5vb3AgOiB0aGlzLl9hZGp1c3RCb2R5KHRoaXMuX2dldFdpZHRoKCkpOyB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwYWRkaW5nIG9mIHRoZSBnaXZlbiB3aWR0aCBvbiB0aGUgcmlnaHQgb2YgdGhlIGJvZHkuXG4gICAqXG4gICAqIEByZXR1cm4gYSBjYWxsYmFjayB1c2VkIHRvIHJldmVydCB0aGUgcGFkZGluZyB0byBpdHMgcHJldmlvdXMgdmFsdWVcbiAgICovXG4gIHByaXZhdGUgX2FkanVzdEJvZHkod2lkdGg6IG51bWJlcik6IENvbXBlbnNhdGlvblJldmVydGVyIHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCB1c2VyU2V0UGFkZGluZyA9IGJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0O1xuICAgIGNvbnN0IHBhZGRpbmdBbW91bnQgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJvZHkpWydwYWRkaW5nLXJpZ2h0J10pO1xuICAgIGJvZHkuc3R5bGVbJ3BhZGRpbmctcmlnaHQnXSA9IGAke3BhZGRpbmdBbW91bnQgKyB3aWR0aH1weGA7XG4gICAgcmV0dXJuICgpID0+IGJvZHkuc3R5bGVbJ3BhZGRpbmctcmlnaHQnXSA9IHVzZXJTZXRQYWRkaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlbGxzIHdoZXRoZXIgYSBzY3JvbGxiYXIgaXMgY3VycmVudGx5IHByZXNlbnQgb24gdGhlIGJvZHkuXG4gICAqXG4gICAqIEByZXR1cm4gdHJ1ZSBpZiBzY3JvbGxiYXIgaXMgcHJlc2VudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBwcml2YXRlIF9pc1ByZXNlbnQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMuX2RvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHJlY3QubGVmdCArIHJlY3QucmlnaHQgPCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSB3aWR0aCBvZiBhIHNjcm9sbGJhci5cbiAgICpcbiAgICogQHJldHVybiB0aGUgd2lkdGggb2YgYSBzY3JvbGxiYXIgb24gdGhpcyBwYWdlXG4gICAqL1xuICBwcml2YXRlIF9nZXRXaWR0aCgpOiBudW1iZXIge1xuICAgIGNvbnN0IG1lYXN1cmVyID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWVhc3VyZXIuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJztcblxuICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQobWVhc3VyZXIpO1xuICAgIGNvbnN0IHdpZHRoID0gbWVhc3VyZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBtZWFzdXJlci5jbGllbnRXaWR0aDtcbiAgICBib2R5LnJlbW92ZUNoaWxkKG1lYXN1cmVyKTtcblxuICAgIHJldHVybiB3aWR0aDtcbiAgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnRSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYk1vZGFsQmFja2Ryb3B9IGZyb20gJy4vbW9kYWwtYmFja2Ryb3AnO1xuaW1wb3J0IHtOZ2JNb2RhbFdpbmRvd30gZnJvbSAnLi9tb2RhbC13aW5kb3cnO1xuXG5pbXBvcnQge0NvbnRlbnRSZWZ9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuXG4vKipcbiAqIEEgcmVmZXJlbmNlIHRvIGFuIGFjdGl2ZSAoY3VycmVudGx5IG9wZW5lZCkgbW9kYWwuIEluc3RhbmNlcyBvZiB0aGlzIGNsYXNzXG4gKiBjYW4gYmUgaW5qZWN0ZWQgaW50byBjb21wb25lbnRzIHBhc3NlZCBhcyBtb2RhbCBjb250ZW50LlxuICovXG5leHBvcnQgY2xhc3MgTmdiQWN0aXZlTW9kYWwge1xuICAvKipcbiAgICogQ2FuIGJlIHVzZWQgdG8gY2xvc2UgYSBtb2RhbCwgcGFzc2luZyBhbiBvcHRpb25hbCByZXN1bHQuXG4gICAqL1xuICBjbG9zZShyZXN1bHQ/OiBhbnkpOiB2b2lkIHt9XG5cbiAgLyoqXG4gICAqIENhbiBiZSB1c2VkIHRvIGRpc21pc3MgYSBtb2RhbCwgcGFzc2luZyBhbiBvcHRpb25hbCByZWFzb24uXG4gICAqL1xuICBkaXNtaXNzKHJlYXNvbj86IGFueSk6IHZvaWQge31cbn1cblxuLyoqXG4gKiBBIHJlZmVyZW5jZSB0byBhIG5ld2x5IG9wZW5lZCBtb2RhbC5cbiAqL1xuZXhwb3J0IGNsYXNzIE5nYk1vZGFsUmVmIHtcbiAgcHJpdmF0ZSBfcmVzb2x2ZTogKHJlc3VsdD86IGFueSkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBfcmVqZWN0OiAocmVhc29uPzogYW55KSA9PiB2b2lkO1xuXG4gIC8qKlxuICAgKiBUaGUgaW5zdGFuY2Ugb2YgY29tcG9uZW50IHVzZWQgYXMgbW9kYWwncyBjb250ZW50LlxuICAgKiBVbmRlZmluZWQgd2hlbiBhIFRlbXBsYXRlUmVmIGlzIHVzZWQgYXMgbW9kYWwncyBjb250ZW50LlxuICAgKi9cbiAgZ2V0IGNvbXBvbmVudEluc3RhbmNlKCk6IGFueSB7XG4gICAgaWYgKHRoaXMuX2NvbnRlbnRSZWYuY29tcG9uZW50UmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29udGVudFJlZi5jb21wb25lbnRSZWYuaW5zdGFuY2U7XG4gICAgfVxuICB9XG5cbiAgLy8gb25seSBuZWVkZWQgdG8ga2VlcCBUUzEuOCBjb21wYXRpYmlsaXR5XG4gIHNldCBjb21wb25lbnRJbnN0YW5jZShpbnN0YW5jZTogYW55KSB7fVxuXG4gIC8qKlxuICAgKiBBIHByb21pc2UgdGhhdCBpcyByZXNvbHZlZCB3aGVuIGEgbW9kYWwgaXMgY2xvc2VkIGFuZCByZWplY3RlZCB3aGVuIGEgbW9kYWwgaXMgZGlzbWlzc2VkLlxuICAgKi9cbiAgcmVzdWx0OiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF93aW5kb3dDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+LCBwcml2YXRlIF9jb250ZW50UmVmOiBDb250ZW50UmVmLFxuICAgICAgcHJpdmF0ZSBfYmFja2Ryb3BDbXB0UmVmPzogQ29tcG9uZW50UmVmPE5nYk1vZGFsQmFja2Ryb3A+LCBwcml2YXRlIF9iZWZvcmVEaXNtaXNzPzogRnVuY3Rpb24pIHtcbiAgICBfd2luZG93Q21wdFJlZi5pbnN0YW5jZS5kaXNtaXNzRXZlbnQuc3Vic2NyaWJlKChyZWFzb246IGFueSkgPT4geyB0aGlzLmRpc21pc3MocmVhc29uKTsgfSk7XG5cbiAgICB0aGlzLnJlc3VsdCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRoaXMuX3Jlc29sdmUgPSByZXNvbHZlO1xuICAgICAgdGhpcy5fcmVqZWN0ID0gcmVqZWN0O1xuICAgIH0pO1xuICAgIHRoaXMucmVzdWx0LnRoZW4obnVsbCwgKCkgPT4ge30pO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbiBiZSB1c2VkIHRvIGNsb3NlIGEgbW9kYWwsIHBhc3NpbmcgYW4gb3B0aW9uYWwgcmVzdWx0LlxuICAgKi9cbiAgY2xvc2UocmVzdWx0PzogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3dpbmRvd0NtcHRSZWYpIHtcbiAgICAgIHRoaXMuX3Jlc29sdmUocmVzdWx0KTtcbiAgICAgIHRoaXMuX3JlbW92ZU1vZGFsRWxlbWVudHMoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9kaXNtaXNzKHJlYXNvbj86IGFueSkge1xuICAgIHRoaXMuX3JlamVjdChyZWFzb24pO1xuICAgIHRoaXMuX3JlbW92ZU1vZGFsRWxlbWVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW4gYmUgdXNlZCB0byBkaXNtaXNzIGEgbW9kYWwsIHBhc3NpbmcgYW4gb3B0aW9uYWwgcmVhc29uLlxuICAgKi9cbiAgZGlzbWlzcyhyZWFzb24/OiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93Q21wdFJlZikge1xuICAgICAgaWYgKCF0aGlzLl9iZWZvcmVEaXNtaXNzKSB7XG4gICAgICAgIHRoaXMuX2Rpc21pc3MocmVhc29uKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGRpc21pc3MgPSB0aGlzLl9iZWZvcmVEaXNtaXNzKCk7XG4gICAgICAgIGlmIChkaXNtaXNzICYmIGRpc21pc3MudGhlbikge1xuICAgICAgICAgIGRpc21pc3MudGhlbihcbiAgICAgICAgICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgdGhpcy5fZGlzbWlzcyhyZWFzb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKCkgPT4ge30pO1xuICAgICAgICB9IGVsc2UgaWYgKGRpc21pc3MgIT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy5fZGlzbWlzcyhyZWFzb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfcmVtb3ZlTW9kYWxFbGVtZW50cygpIHtcbiAgICBjb25zdCB3aW5kb3dOYXRpdmVFbCA9IHRoaXMuX3dpbmRvd0NtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICB3aW5kb3dOYXRpdmVFbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHdpbmRvd05hdGl2ZUVsKTtcbiAgICB0aGlzLl93aW5kb3dDbXB0UmVmLmRlc3Ryb3koKTtcblxuICAgIGlmICh0aGlzLl9iYWNrZHJvcENtcHRSZWYpIHtcbiAgICAgIGNvbnN0IGJhY2tkcm9wTmF0aXZlRWwgPSB0aGlzLl9iYWNrZHJvcENtcHRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudDtcbiAgICAgIGJhY2tkcm9wTmF0aXZlRWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChiYWNrZHJvcE5hdGl2ZUVsKTtcbiAgICAgIHRoaXMuX2JhY2tkcm9wQ21wdFJlZi5kZXN0cm95KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2NvbnRlbnRSZWYgJiYgdGhpcy5fY29udGVudFJlZi52aWV3UmVmKSB7XG4gICAgICB0aGlzLl9jb250ZW50UmVmLnZpZXdSZWYuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuX3dpbmRvd0NtcHRSZWYgPSBudWxsO1xuICAgIHRoaXMuX2JhY2tkcm9wQ21wdFJlZiA9IG51bGw7XG4gICAgdGhpcy5fY29udGVudFJlZiA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBcHBsaWNhdGlvblJlZixcbiAgSW5qZWN0YWJsZSxcbiAgSW5qZWN0b3IsXG4gIEluamVjdCxcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBDb21wb25lbnRSZWYsXG4gIFRlbXBsYXRlUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge0NvbnRlbnRSZWZ9IGZyb20gJy4uL3V0aWwvcG9wdXAnO1xuaW1wb3J0IHtpc0RlZmluZWQsIGlzU3RyaW5nfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtTY3JvbGxCYXJ9IGZyb20gJy4uL3V0aWwvc2Nyb2xsYmFyJztcblxuaW1wb3J0IHtOZ2JNb2RhbEJhY2tkcm9wfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7TmdiTW9kYWxXaW5kb3d9IGZyb20gJy4vbW9kYWwtd2luZG93JztcbmltcG9ydCB7TmdiQWN0aXZlTW9kYWwsIE5nYk1vZGFsUmVmfSBmcm9tICcuL21vZGFsLXJlZic7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsU3RhY2sge1xuICBwcml2YXRlIF93aW5kb3dBdHRyaWJ1dGVzID0gWydhcmlhTGFiZWxsZWRCeScsICdiYWNrZHJvcCcsICdjZW50ZXJlZCcsICdrZXlib2FyZCcsICdzaXplJywgJ3dpbmRvd0NsYXNzJ107XG4gIHByaXZhdGUgX2JhY2tkcm9wQXR0cmlidXRlcyA9IFsnYmFja2Ryb3BDbGFzcyddO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfYXBwbGljYXRpb25SZWY6IEFwcGxpY2F0aW9uUmVmLCBwcml2YXRlIF9pbmplY3RvcjogSW5qZWN0b3IsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50LFxuICAgICAgcHJpdmF0ZSBfc2Nyb2xsQmFyOiBTY3JvbGxCYXIpIHt9XG5cbiAgb3Blbihtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LCBvcHRpb25zKTogTmdiTW9kYWxSZWYge1xuICAgIGNvbnN0IGNvbnRhaW5lckVsID1cbiAgICAgICAgaXNEZWZpbmVkKG9wdGlvbnMuY29udGFpbmVyKSA/IHRoaXMuX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3Iob3B0aW9ucy5jb250YWluZXIpIDogdGhpcy5fZG9jdW1lbnQuYm9keTtcblxuICAgIGNvbnN0IHJldmVydFBhZGRpbmdGb3JTY3JvbGxCYXIgPSB0aGlzLl9zY3JvbGxCYXIuY29tcGVuc2F0ZSgpO1xuXG4gICAgaWYgKCFjb250YWluZXJFbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgc3BlY2lmaWVkIG1vZGFsIGNvbnRhaW5lciBcIiR7b3B0aW9ucy5jb250YWluZXIgfHwgJ2JvZHknfVwiIHdhcyBub3QgZm91bmQgaW4gdGhlIERPTS5gKTtcbiAgICB9XG5cbiAgICBjb25zdCBhY3RpdmVNb2RhbCA9IG5ldyBOZ2JBY3RpdmVNb2RhbCgpO1xuICAgIGNvbnN0IGNvbnRlbnRSZWYgPSB0aGlzLl9nZXRDb250ZW50UmVmKG1vZHVsZUNGUiwgb3B0aW9ucy5pbmplY3RvciB8fCBjb250ZW50SW5qZWN0b3IsIGNvbnRlbnQsIGFjdGl2ZU1vZGFsKTtcblxuICAgIGxldCBiYWNrZHJvcENtcHRSZWY6IENvbXBvbmVudFJlZjxOZ2JNb2RhbEJhY2tkcm9wPiA9XG4gICAgICAgIG9wdGlvbnMuYmFja2Ryb3AgIT09IGZhbHNlID8gdGhpcy5fYXR0YWNoQmFja2Ryb3AobW9kdWxlQ0ZSLCBjb250YWluZXJFbCkgOiBudWxsO1xuICAgIGxldCB3aW5kb3dDbXB0UmVmOiBDb21wb25lbnRSZWY8TmdiTW9kYWxXaW5kb3c+ID0gdGhpcy5fYXR0YWNoV2luZG93Q29tcG9uZW50KG1vZHVsZUNGUiwgY29udGFpbmVyRWwsIGNvbnRlbnRSZWYpO1xuICAgIGxldCBuZ2JNb2RhbFJlZjogTmdiTW9kYWxSZWYgPSBuZXcgTmdiTW9kYWxSZWYod2luZG93Q21wdFJlZiwgY29udGVudFJlZiwgYmFja2Ryb3BDbXB0UmVmLCBvcHRpb25zLmJlZm9yZURpc21pc3MpO1xuXG4gICAgbmdiTW9kYWxSZWYucmVzdWx0LnRoZW4ocmV2ZXJ0UGFkZGluZ0ZvclNjcm9sbEJhciwgcmV2ZXJ0UGFkZGluZ0ZvclNjcm9sbEJhcik7XG4gICAgYWN0aXZlTW9kYWwuY2xvc2UgPSAocmVzdWx0OiBhbnkpID0+IHsgbmdiTW9kYWxSZWYuY2xvc2UocmVzdWx0KTsgfTtcbiAgICBhY3RpdmVNb2RhbC5kaXNtaXNzID0gKHJlYXNvbjogYW55KSA9PiB7IG5nYk1vZGFsUmVmLmRpc21pc3MocmVhc29uKTsgfTtcblxuICAgIHRoaXMuX2FwcGx5V2luZG93T3B0aW9ucyh3aW5kb3dDbXB0UmVmLmluc3RhbmNlLCBvcHRpb25zKTtcblxuICAgIGlmIChiYWNrZHJvcENtcHRSZWYgJiYgYmFja2Ryb3BDbXB0UmVmLmluc3RhbmNlKSB7XG4gICAgICB0aGlzLl9hcHBseUJhY2tkcm9wT3B0aW9ucyhiYWNrZHJvcENtcHRSZWYuaW5zdGFuY2UsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gbmdiTW9kYWxSZWY7XG4gIH1cblxuICBwcml2YXRlIF9hdHRhY2hCYWNrZHJvcChtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGFpbmVyRWw6IGFueSk6IENvbXBvbmVudFJlZjxOZ2JNb2RhbEJhY2tkcm9wPiB7XG4gICAgbGV0IGJhY2tkcm9wRmFjdG9yeSA9IG1vZHVsZUNGUi5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ2JNb2RhbEJhY2tkcm9wKTtcbiAgICBsZXQgYmFja2Ryb3BDbXB0UmVmID0gYmFja2Ryb3BGYWN0b3J5LmNyZWF0ZSh0aGlzLl9pbmplY3Rvcik7XG4gICAgdGhpcy5fYXBwbGljYXRpb25SZWYuYXR0YWNoVmlldyhiYWNrZHJvcENtcHRSZWYuaG9zdFZpZXcpO1xuICAgIGNvbnRhaW5lckVsLmFwcGVuZENoaWxkKGJhY2tkcm9wQ21wdFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICByZXR1cm4gYmFja2Ryb3BDbXB0UmVmO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXR0YWNoV2luZG93Q29tcG9uZW50KG1vZHVsZUNGUjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCBjb250YWluZXJFbDogYW55LCBjb250ZW50UmVmOiBhbnkpOlxuICAgICAgQ29tcG9uZW50UmVmPE5nYk1vZGFsV2luZG93PiB7XG4gICAgbGV0IHdpbmRvd0ZhY3RvcnkgPSBtb2R1bGVDRlIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoTmdiTW9kYWxXaW5kb3cpO1xuICAgIGxldCB3aW5kb3dDbXB0UmVmID0gd2luZG93RmFjdG9yeS5jcmVhdGUodGhpcy5faW5qZWN0b3IsIGNvbnRlbnRSZWYubm9kZXMpO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcod2luZG93Q21wdFJlZi5ob3N0Vmlldyk7XG4gICAgY29udGFpbmVyRWwuYXBwZW5kQ2hpbGQod2luZG93Q21wdFJlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50KTtcbiAgICByZXR1cm4gd2luZG93Q21wdFJlZjtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5V2luZG93T3B0aW9ucyh3aW5kb3dJbnN0YW5jZTogTmdiTW9kYWxXaW5kb3csIG9wdGlvbnM6IE9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMuX3dpbmRvd0F0dHJpYnV0ZXMuZm9yRWFjaCgob3B0aW9uTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICBpZiAoaXNEZWZpbmVkKG9wdGlvbnNbb3B0aW9uTmFtZV0pKSB7XG4gICAgICAgIHdpbmRvd0luc3RhbmNlW29wdGlvbk5hbWVdID0gb3B0aW9uc1tvcHRpb25OYW1lXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgX2FwcGx5QmFja2Ryb3BPcHRpb25zKGJhY2tkcm9wSW5zdGFuY2U6IE5nYk1vZGFsQmFja2Ryb3AsIG9wdGlvbnM6IE9iamVjdCk6IHZvaWQge1xuICAgIHRoaXMuX2JhY2tkcm9wQXR0cmlidXRlcy5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChpc0RlZmluZWQob3B0aW9uc1tvcHRpb25OYW1lXSkpIHtcbiAgICAgICAgYmFja2Ryb3BJbnN0YW5jZVtvcHRpb25OYW1lXSA9IG9wdGlvbnNbb3B0aW9uTmFtZV07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF9nZXRDb250ZW50UmVmKFxuICAgICAgbW9kdWxlQ0ZSOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIGNvbnRlbnRJbmplY3RvcjogSW5qZWN0b3IsIGNvbnRlbnQ6IGFueSxcbiAgICAgIGNvbnRleHQ6IE5nYkFjdGl2ZU1vZGFsKTogQ29udGVudFJlZiB7XG4gICAgaWYgKCFjb250ZW50KSB7XG4gICAgICByZXR1cm4gbmV3IENvbnRlbnRSZWYoW10pO1xuICAgIH0gZWxzZSBpZiAoY29udGVudCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlRnJvbVRlbXBsYXRlUmVmKGNvbnRlbnQsIGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoY29udGVudCkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jcmVhdGVGcm9tU3RyaW5nKGNvbnRlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fY3JlYXRlRnJvbUNvbXBvbmVudChtb2R1bGVDRlIsIGNvbnRlbnRJbmplY3RvciwgY29udGVudCwgY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRnJvbVRlbXBsYXRlUmVmKGNvbnRlbnQ6IFRlbXBsYXRlUmVmPGFueT4sIGNvbnRleHQ6IE5nYkFjdGl2ZU1vZGFsKTogQ29udGVudFJlZiB7XG4gICAgY29uc3Qgdmlld1JlZiA9IGNvbnRlbnQuY3JlYXRlRW1iZWRkZWRWaWV3KGNvbnRleHQpO1xuICAgIHRoaXMuX2FwcGxpY2F0aW9uUmVmLmF0dGFjaFZpZXcodmlld1JlZik7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFt2aWV3UmVmLnJvb3ROb2Rlc10sIHZpZXdSZWYpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlRnJvbVN0cmluZyhjb250ZW50OiBzdHJpbmcpOiBDb250ZW50UmVmIHtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShgJHtjb250ZW50fWApO1xuICAgIHJldHVybiBuZXcgQ29udGVudFJlZihbW2NvbXBvbmVudF1dKTtcbiAgfVxuXG4gIHByaXZhdGUgX2NyZWF0ZUZyb21Db21wb25lbnQoXG4gICAgICBtb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgY29udGVudEluamVjdG9yOiBJbmplY3RvciwgY29udGVudDogYW55LFxuICAgICAgY29udGV4dDogTmdiQWN0aXZlTW9kYWwpOiBDb250ZW50UmVmIHtcbiAgICBjb25zdCBjb250ZW50Q21wdEZhY3RvcnkgPSBtb2R1bGVDRlIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkoY29udGVudCk7XG4gICAgY29uc3QgbW9kYWxDb250ZW50SW5qZWN0b3IgPVxuICAgICAgICBJbmplY3Rvci5jcmVhdGUoe3Byb3ZpZGVyczogW3twcm92aWRlOiBOZ2JBY3RpdmVNb2RhbCwgdXNlVmFsdWU6IGNvbnRleHR9XSwgcGFyZW50OiBjb250ZW50SW5qZWN0b3J9KTtcbiAgICBjb25zdCBjb21wb25lbnRSZWYgPSBjb250ZW50Q21wdEZhY3RvcnkuY3JlYXRlKG1vZGFsQ29udGVudEluamVjdG9yKTtcbiAgICB0aGlzLl9hcHBsaWNhdGlvblJlZi5hdHRhY2hWaWV3KGNvbXBvbmVudFJlZi5ob3N0Vmlldyk7XG4gICAgcmV0dXJuIG5ldyBDb250ZW50UmVmKFtbY29tcG9uZW50UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnRdXSwgY29tcG9uZW50UmVmLmhvc3RWaWV3LCBjb21wb25lbnRSZWYpO1xuICB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGUsIEluamVjdG9yLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQge05nYk1vZGFsU3RhY2t9IGZyb20gJy4vbW9kYWwtc3RhY2snO1xuaW1wb3J0IHtOZ2JNb2RhbFJlZn0gZnJvbSAnLi9tb2RhbC1yZWYnO1xuXG4vKipcbiAqIFJlcHJlc2VudCBvcHRpb25zIGF2YWlsYWJsZSB3aGVuIG9wZW5pbmcgbmV3IG1vZGFsIHdpbmRvd3MuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiTW9kYWxPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNldHMgdGhlIGFyaWEgYXR0cmlidXRlIGFyaWEtbGFiZWxsZWRieSB0byBhIG1vZGFsIHdpbmRvdy5cbiAgICpcbiAgICogQHNpbmNlIDIuMi4wXG4gICAqL1xuICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZztcblxuICAvKipcbiAgICogV2hldGhlciBhIGJhY2tkcm9wIGVsZW1lbnQgc2hvdWxkIGJlIGNyZWF0ZWQgZm9yIGEgZ2l2ZW4gbW9kYWwgKHRydWUgYnkgZGVmYXVsdCkuXG4gICAqIEFsdGVybmF0aXZlbHksIHNwZWNpZnkgJ3N0YXRpYycgZm9yIGEgYmFja2Ryb3Agd2hpY2ggZG9lc24ndCBjbG9zZSB0aGUgbW9kYWwgb24gY2xpY2suXG4gICAqL1xuICBiYWNrZHJvcD86IGJvb2xlYW4gfCAnc3RhdGljJztcblxuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBtb2RhbCB3aWxsIGJlIGRpc21pc3NlZC5cbiAgICogSWYgdGhpcyBmdW5jdGlvbiByZXR1cm5zIGZhbHNlLCB0aGUgcHJvbWlzZSBpcyByZXNvbHZlZCB3aXRoIGZhbHNlIG9yIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkLCB0aGUgbW9kYWwgaXMgbm90XG4gICAqIGRpc21pc3NlZC5cbiAgICovXG4gIGJlZm9yZURpc21pc3M/OiAoKSA9PiBib29sZWFuIHwgUHJvbWlzZTxib29sZWFuPjtcblxuICAvKipcbiAgICogVG8gY2VudGVyIHRoZSBtb2RhbCB2ZXJ0aWNhbGx5IChmYWxzZSBieSBkZWZhdWx0KS5cbiAgICpcbiAgICogQHNpbmNlIDEuMS4wXG4gICAqL1xuICBjZW50ZXJlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEFuIGVsZW1lbnQgdG8gd2hpY2ggdG8gYXR0YWNoIG5ld2x5IG9wZW5lZCBtb2RhbCB3aW5kb3dzLlxuICAgKi9cbiAgY29udGFpbmVyPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmplY3RvciB0byB1c2UgZm9yIG1vZGFsIGNvbnRlbnQuXG4gICAqL1xuICBpbmplY3Rvcj86IEluamVjdG9yO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNsb3NlIHRoZSBtb2RhbCB3aGVuIGVzY2FwZSBrZXkgaXMgcHJlc3NlZCAodHJ1ZSBieSBkZWZhdWx0KS5cbiAgICovXG4gIGtleWJvYXJkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogU2l6ZSBvZiBhIG5ldyBtb2RhbCB3aW5kb3cuXG4gICAqL1xuICBzaXplPzogJ3NtJyB8ICdsZyc7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBjbGFzcyB0byBhcHBlbmQgdG8gdGhlIG1vZGFsIHdpbmRvd1xuICAgKi9cbiAgd2luZG93Q2xhc3M/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBjbGFzcyB0byBhcHBlbmQgdG8gdGhlIG1vZGFsIGJhY2tkcm9wXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgYmFja2Ryb3BDbGFzcz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBBIHNlcnZpY2UgdG8gb3BlbiBtb2RhbCB3aW5kb3dzLiBDcmVhdGluZyBhIG1vZGFsIGlzIHN0cmFpZ2h0Zm9yd2FyZDogY3JlYXRlIGEgdGVtcGxhdGUgYW5kIHBhc3MgaXQgYXMgYW4gYXJndW1lbnQgdG9cbiAqIHRoZSBcIm9wZW5cIiBtZXRob2QhXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsIHtcbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9tb2R1bGVDRlI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLCBwcml2YXRlIF9tb2RhbFN0YWNrOiBOZ2JNb2RhbFN0YWNrKSB7fVxuXG4gIC8qKlxuICAgKiBPcGVucyBhIG5ldyBtb2RhbCB3aW5kb3cgd2l0aCB0aGUgc3BlY2lmaWVkIGNvbnRlbnQgYW5kIHVzaW5nIHN1cHBsaWVkIG9wdGlvbnMuIENvbnRlbnQgY2FuIGJlIHByb3ZpZGVkXG4gICAqIGFzIGEgVGVtcGxhdGVSZWYgb3IgYSBjb21wb25lbnQgdHlwZS4gSWYgeW91IHBhc3MgYSBjb21wb25lbnQgdHlwZSBhcyBjb250ZW50IHRoYW4gaW5zdGFuY2VzIG9mIHRob3NlXG4gICAqIGNvbXBvbmVudHMgY2FuIGJlIGluamVjdGVkIHdpdGggYW4gaW5zdGFuY2Ugb2YgdGhlIE5nYkFjdGl2ZU1vZGFsIGNsYXNzLiBZb3UgY2FuIHVzZSBtZXRob2RzIG9uIHRoZVxuICAgKiBOZ2JBY3RpdmVNb2RhbCBjbGFzcyB0byBjbG9zZSAvIGRpc21pc3MgbW9kYWxzIGZyb20gXCJpbnNpZGVcIiBvZiBhIGNvbXBvbmVudC5cbiAgICovXG4gIG9wZW4oY29udGVudDogYW55LCBvcHRpb25zOiBOZ2JNb2RhbE9wdGlvbnMgPSB7fSk6IE5nYk1vZGFsUmVmIHtcbiAgICByZXR1cm4gdGhpcy5fbW9kYWxTdGFjay5vcGVuKHRoaXMuX21vZHVsZUNGUiwgdGhpcy5faW5qZWN0b3IsIGNvbnRlbnQsIG9wdGlvbnMpO1xuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JNb2RhbEJhY2tkcm9wfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7TmdiTW9kYWxXaW5kb3d9IGZyb20gJy4vbW9kYWwtd2luZG93JztcbmltcG9ydCB7TmdiTW9kYWx9IGZyb20gJy4vbW9kYWwnO1xuXG5leHBvcnQge05nYk1vZGFsLCBOZ2JNb2RhbE9wdGlvbnN9IGZyb20gJy4vbW9kYWwnO1xuZXhwb3J0IHtOZ2JNb2RhbFJlZiwgTmdiQWN0aXZlTW9kYWx9IGZyb20gJy4vbW9kYWwtcmVmJztcbmV4cG9ydCB7TW9kYWxEaXNtaXNzUmVhc29uc30gZnJvbSAnLi9tb2RhbC1kaXNtaXNzLXJlYXNvbnMnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtOZ2JNb2RhbEJhY2tkcm9wLCBOZ2JNb2RhbFdpbmRvd10sXG4gIGVudHJ5Q29tcG9uZW50czogW05nYk1vZGFsQmFja2Ryb3AsIE5nYk1vZGFsV2luZG93XSxcbiAgcHJvdmlkZXJzOiBbTmdiTW9kYWxdXG59KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYk1vZGFsTW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JQYWdpbmF0aW9uIGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBwYWdpbmF0aW9ucyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiUGFnaW5hdGlvbkNvbmZpZyB7XG4gIGRpc2FibGVkID0gZmFsc2U7XG4gIGJvdW5kYXJ5TGlua3MgPSBmYWxzZTtcbiAgZGlyZWN0aW9uTGlua3MgPSB0cnVlO1xuICBlbGxpcHNlcyA9IHRydWU7XG4gIG1heFNpemUgPSAwO1xuICBwYWdlU2l6ZSA9IDEwO1xuICByb3RhdGUgPSBmYWxzZTtcbiAgc2l6ZTogJ3NtJyB8ICdsZyc7XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Z2V0VmFsdWVJblJhbmdlLCBpc051bWJlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiUGFnaW5hdGlvbkNvbmZpZ30gZnJvbSAnLi9wYWdpbmF0aW9uLWNvbmZpZyc7XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCB3aWxsIHRha2UgY2FyZSBvZiB2aXN1YWxpc2luZyBhIHBhZ2luYXRpb24gYmFyIGFuZCBlbmFibGUgLyBkaXNhYmxlIGJ1dHRvbnMgY29ycmVjdGx5IVxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItcGFnaW5hdGlvbicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7J3JvbGUnOiAnbmF2aWdhdGlvbid9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDx1bCBbY2xhc3NdPVwiJ3BhZ2luYXRpb24nICsgKHNpemUgPyAnIHBhZ2luYXRpb24tJyArIHNpemUgOiAnJylcIj5cbiAgICAgIDxsaSAqbmdJZj1cImJvdW5kYXJ5TGlua3NcIiBjbGFzcz1cInBhZ2UtaXRlbVwiXG4gICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCIhaGFzUHJldmlvdXMoKSB8fCBkaXNhYmxlZFwiPlxuICAgICAgICA8YSBhcmlhLWxhYmVsPVwiRmlyc3RcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLmZpcnN0LWFyaWFcIiBjbGFzcz1cInBhZ2UtbGlua1wiIGhyZWZcbiAgICAgICAgICAoY2xpY2spPVwiISFzZWxlY3RQYWdlKDEpXCIgW2F0dHIudGFiaW5kZXhdPVwiKGhhc1ByZXZpb3VzKCkgPyBudWxsIDogJy0xJylcIj5cbiAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5maXJzdFwiPiZsYXF1bzsmbGFxdW87PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuXG4gICAgICA8bGkgKm5nSWY9XCJkaXJlY3Rpb25MaW5rc1wiIGNsYXNzPVwicGFnZS1pdGVtXCJcbiAgICAgICAgW2NsYXNzLmRpc2FibGVkXT1cIiFoYXNQcmV2aW91cygpIHx8IGRpc2FibGVkXCI+XG4gICAgICAgIDxhIGFyaWEtbGFiZWw9XCJQcmV2aW91c1wiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnBhZ2luYXRpb24ucHJldmlvdXMtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCIhIXNlbGVjdFBhZ2UocGFnZS0xKVwiIFthdHRyLnRhYmluZGV4XT1cIihoYXNQcmV2aW91cygpID8gbnVsbCA6ICctMScpXCI+XG4gICAgICAgICAgPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgaTE4bj1cIkBAbmdiLnBhZ2luYXRpb24ucHJldmlvdXNcIj4mbGFxdW87PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICAgPGxpICpuZ0Zvcj1cImxldCBwYWdlTnVtYmVyIG9mIHBhZ2VzXCIgY2xhc3M9XCJwYWdlLWl0ZW1cIiBbY2xhc3MuYWN0aXZlXT1cInBhZ2VOdW1iZXIgPT09IHBhZ2VcIlxuICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiaXNFbGxpcHNpcyhwYWdlTnVtYmVyKSB8fCBkaXNhYmxlZFwiPlxuICAgICAgICA8YSAqbmdJZj1cImlzRWxsaXBzaXMocGFnZU51bWJlcilcIiBjbGFzcz1cInBhZ2UtbGlua1wiPi4uLjwvYT5cbiAgICAgICAgPGEgKm5nSWY9XCIhaXNFbGxpcHNpcyhwYWdlTnVtYmVyKVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZiAoY2xpY2spPVwiISFzZWxlY3RQYWdlKHBhZ2VOdW1iZXIpXCI+XG4gICAgICAgICAge3twYWdlTnVtYmVyfX1cbiAgICAgICAgICA8c3BhbiAqbmdJZj1cInBhZ2VOdW1iZXIgPT09IHBhZ2VcIiBjbGFzcz1cInNyLW9ubHlcIj4oY3VycmVudCk8L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgICA8bGkgKm5nSWY9XCJkaXJlY3Rpb25MaW5rc1wiIGNsYXNzPVwicGFnZS1pdGVtXCIgW2NsYXNzLmRpc2FibGVkXT1cIiFoYXNOZXh0KCkgfHwgZGlzYWJsZWRcIj5cbiAgICAgICAgPGEgYXJpYS1sYWJlbD1cIk5leHRcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLm5leHQtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCIhIXNlbGVjdFBhZ2UocGFnZSsxKVwiIFthdHRyLnRhYmluZGV4XT1cIihoYXNOZXh0KCkgPyBudWxsIDogJy0xJylcIj5cbiAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5uZXh0XCI+JnJhcXVvOzwvc3Bhbj5cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cblxuICAgICAgPGxpICpuZ0lmPVwiYm91bmRhcnlMaW5rc1wiIGNsYXNzPVwicGFnZS1pdGVtXCIgW2NsYXNzLmRpc2FibGVkXT1cIiFoYXNOZXh0KCkgfHwgZGlzYWJsZWRcIj5cbiAgICAgICAgPGEgYXJpYS1sYWJlbD1cIkxhc3RcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5wYWdpbmF0aW9uLmxhc3QtYXJpYVwiIGNsYXNzPVwicGFnZS1saW5rXCIgaHJlZlxuICAgICAgICAgIChjbGljayk9XCIhIXNlbGVjdFBhZ2UocGFnZUNvdW50KVwiIFthdHRyLnRhYmluZGV4XT1cIihoYXNOZXh0KCkgPyBudWxsIDogJy0xJylcIj5cbiAgICAgICAgICA8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIiBpMThuPVwiQEBuZ2IucGFnaW5hdGlvbi5sYXN0XCI+JnJhcXVvOyZyYXF1bzs8L3NwYW4+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JQYWdpbmF0aW9uIGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgcGFnZUNvdW50ID0gMDtcbiAgcGFnZXM6IG51bWJlcltdID0gW107XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzYWJsZSBidXR0b25zIGZyb20gdXNlciBpbnB1dFxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqICBXaGV0aGVyIHRvIHNob3cgdGhlIFwiRmlyc3RcIiBhbmQgXCJMYXN0XCIgcGFnZSBsaW5rc1xuICAgKi9cbiAgQElucHV0KCkgYm91bmRhcnlMaW5rczogYm9vbGVhbjtcblxuICAvKipcbiAgICogIFdoZXRoZXIgdG8gc2hvdyB0aGUgXCJOZXh0XCIgYW5kIFwiUHJldmlvdXNcIiBwYWdlIGxpbmtzXG4gICAqL1xuICBASW5wdXQoKSBkaXJlY3Rpb25MaW5rczogYm9vbGVhbjtcblxuICAvKipcbiAgICogIFdoZXRoZXIgdG8gc2hvdyBlbGxpcHNpcyBzeW1ib2xzIGFuZCBmaXJzdC9sYXN0IHBhZ2UgbnVtYmVycyB3aGVuIG1heFNpemUgPiBudW1iZXIgb2YgcGFnZXNcbiAgICovXG4gIEBJbnB1dCgpIGVsbGlwc2VzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiAgV2hldGhlciB0byByb3RhdGUgcGFnZXMgd2hlbiBtYXhTaXplID4gbnVtYmVyIG9mIHBhZ2VzLlxuICAgKiAgQ3VycmVudCBwYWdlIHdpbGwgYmUgaW4gdGhlIG1pZGRsZVxuICAgKi9cbiAgQElucHV0KCkgcm90YXRlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiAgTnVtYmVyIG9mIGl0ZW1zIGluIGNvbGxlY3Rpb24uXG4gICAqL1xuICBASW5wdXQoKSBjb2xsZWN0aW9uU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiAgTWF4aW11bSBudW1iZXIgb2YgcGFnZXMgdG8gZGlzcGxheS5cbiAgICovXG4gIEBJbnB1dCgpIG1heFNpemU6IG51bWJlcjtcblxuICAvKipcbiAgICogIEN1cnJlbnQgcGFnZS4gUGFnZSBudW1iZXJzIHN0YXJ0IHdpdGggMVxuICAgKi9cbiAgQElucHV0KCkgcGFnZSA9IDE7XG5cbiAgLyoqXG4gICAqICBOdW1iZXIgb2YgaXRlbXMgcGVyIHBhZ2UuXG4gICAqL1xuICBASW5wdXQoKSBwYWdlU2l6ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiAgQW4gZXZlbnQgZmlyZWQgd2hlbiB0aGUgcGFnZSBpcyBjaGFuZ2VkLlxuICAgKiAgRXZlbnQncyBwYXlsb2FkIGVxdWFscyB0byB0aGUgbmV3bHkgc2VsZWN0ZWQgcGFnZS5cbiAgICogIFdpbGwgZmlyZSBvbmx5IGlmIGNvbGxlY3Rpb24gc2l6ZSBpcyBzZXQgYW5kIGFsbCB2YWx1ZXMgYXJlIHZhbGlkLlxuICAgKiAgUGFnZSBudW1iZXJzIHN0YXJ0IHdpdGggMVxuICAgKi9cbiAgQE91dHB1dCgpIHBhZ2VDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4odHJ1ZSk7XG5cbiAgLyoqXG4gICAqIFBhZ2luYXRpb24gZGlzcGxheSBzaXplOiBzbWFsbCBvciBsYXJnZVxuICAgKi9cbiAgQElucHV0KCkgc2l6ZTogJ3NtJyB8ICdsZyc7XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JQYWdpbmF0aW9uQ29uZmlnKSB7XG4gICAgdGhpcy5kaXNhYmxlZCA9IGNvbmZpZy5kaXNhYmxlZDtcbiAgICB0aGlzLmJvdW5kYXJ5TGlua3MgPSBjb25maWcuYm91bmRhcnlMaW5rcztcbiAgICB0aGlzLmRpcmVjdGlvbkxpbmtzID0gY29uZmlnLmRpcmVjdGlvbkxpbmtzO1xuICAgIHRoaXMuZWxsaXBzZXMgPSBjb25maWcuZWxsaXBzZXM7XG4gICAgdGhpcy5tYXhTaXplID0gY29uZmlnLm1heFNpemU7XG4gICAgdGhpcy5wYWdlU2l6ZSA9IGNvbmZpZy5wYWdlU2l6ZTtcbiAgICB0aGlzLnJvdGF0ZSA9IGNvbmZpZy5yb3RhdGU7XG4gICAgdGhpcy5zaXplID0gY29uZmlnLnNpemU7XG4gIH1cblxuICBoYXNQcmV2aW91cygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZSA+IDE7IH1cblxuICBoYXNOZXh0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5wYWdlIDwgdGhpcy5wYWdlQ291bnQ7IH1cblxuICBzZWxlY3RQYWdlKHBhZ2VOdW1iZXI6IG51bWJlcik6IHZvaWQgeyB0aGlzLl91cGRhdGVQYWdlcyhwYWdlTnVtYmVyKTsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHsgdGhpcy5fdXBkYXRlUGFnZXModGhpcy5wYWdlKTsgfVxuXG4gIGlzRWxsaXBzaXMocGFnZU51bWJlcik6IGJvb2xlYW4geyByZXR1cm4gcGFnZU51bWJlciA9PT0gLTE7IH1cblxuICAvKipcbiAgICogQXBwZW5kcyBlbGxpcHNlcyBhbmQgZmlyc3QvbGFzdCBwYWdlIG51bWJlciB0byB0aGUgZGlzcGxheWVkIHBhZ2VzXG4gICAqL1xuICBwcml2YXRlIF9hcHBseUVsbGlwc2VzKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuZWxsaXBzZXMpIHtcbiAgICAgIGlmIChzdGFydCA+IDApIHtcbiAgICAgICAgaWYgKHN0YXJ0ID4gMSkge1xuICAgICAgICAgIHRoaXMucGFnZXMudW5zaGlmdCgtMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlcy51bnNoaWZ0KDEpO1xuICAgICAgfVxuICAgICAgaWYgKGVuZCA8IHRoaXMucGFnZUNvdW50KSB7XG4gICAgICAgIGlmIChlbmQgPCAodGhpcy5wYWdlQ291bnQgLSAxKSkge1xuICAgICAgICAgIHRoaXMucGFnZXMucHVzaCgtMSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wYWdlcy5wdXNoKHRoaXMucGFnZUNvdW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUm90YXRlcyBwYWdlIG51bWJlcnMgYmFzZWQgb24gbWF4U2l6ZSBpdGVtcyB2aXNpYmxlLlxuICAgKiBDdXJyZW50bHkgc2VsZWN0ZWQgcGFnZSBzdGF5cyBpbiB0aGUgbWlkZGxlOlxuICAgKlxuICAgKiBFeC4gZm9yIHNlbGVjdGVkIHBhZ2UgPSA2OlxuICAgKiBbNSwqNiosN10gZm9yIG1heFNpemUgPSAzXG4gICAqIFs0LDUsKjYqLDddIGZvciBtYXhTaXplID0gNFxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlSb3RhdGlvbigpOiBbbnVtYmVyLCBudW1iZXJdIHtcbiAgICBsZXQgc3RhcnQgPSAwO1xuICAgIGxldCBlbmQgPSB0aGlzLnBhZ2VDb3VudDtcbiAgICBsZXQgbGVmdE9mZnNldCA9IE1hdGguZmxvb3IodGhpcy5tYXhTaXplIC8gMik7XG4gICAgbGV0IHJpZ2h0T2Zmc2V0ID0gdGhpcy5tYXhTaXplICUgMiA9PT0gMCA/IGxlZnRPZmZzZXQgLSAxIDogbGVmdE9mZnNldDtcblxuICAgIGlmICh0aGlzLnBhZ2UgPD0gbGVmdE9mZnNldCkge1xuICAgICAgLy8gdmVyeSBiZWdpbm5pbmcsIG5vIHJvdGF0aW9uIC0+IFswLi5tYXhTaXplXVxuICAgICAgZW5kID0gdGhpcy5tYXhTaXplO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wYWdlQ291bnQgLSB0aGlzLnBhZ2UgPCBsZWZ0T2Zmc2V0KSB7XG4gICAgICAvLyB2ZXJ5IGVuZCwgbm8gcm90YXRpb24gLT4gW2xlbi1tYXhTaXplLi5sZW5dXG4gICAgICBzdGFydCA9IHRoaXMucGFnZUNvdW50IC0gdGhpcy5tYXhTaXplO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyByb3RhdGVcbiAgICAgIHN0YXJ0ID0gdGhpcy5wYWdlIC0gbGVmdE9mZnNldCAtIDE7XG4gICAgICBlbmQgPSB0aGlzLnBhZ2UgKyByaWdodE9mZnNldDtcbiAgICB9XG5cbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhZ2luYXRlcyBwYWdlIG51bWJlcnMgYmFzZWQgb24gbWF4U2l6ZSBpdGVtcyBwZXIgcGFnZVxuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlQYWdpbmF0aW9uKCk6IFtudW1iZXIsIG51bWJlcl0ge1xuICAgIGxldCBwYWdlID0gTWF0aC5jZWlsKHRoaXMucGFnZSAvIHRoaXMubWF4U2l6ZSkgLSAxO1xuICAgIGxldCBzdGFydCA9IHBhZ2UgKiB0aGlzLm1heFNpemU7XG4gICAgbGV0IGVuZCA9IHN0YXJ0ICsgdGhpcy5tYXhTaXplO1xuXG4gICAgcmV0dXJuIFtzdGFydCwgZW5kXTtcbiAgfVxuXG4gIHByaXZhdGUgX3NldFBhZ2VJblJhbmdlKG5ld1BhZ2VObykge1xuICAgIGNvbnN0IHByZXZQYWdlTm8gPSB0aGlzLnBhZ2U7XG4gICAgdGhpcy5wYWdlID0gZ2V0VmFsdWVJblJhbmdlKG5ld1BhZ2VObywgdGhpcy5wYWdlQ291bnQsIDEpO1xuXG4gICAgaWYgKHRoaXMucGFnZSAhPT0gcHJldlBhZ2VObyAmJiBpc051bWJlcih0aGlzLmNvbGxlY3Rpb25TaXplKSkge1xuICAgICAgdGhpcy5wYWdlQ2hhbmdlLmVtaXQodGhpcy5wYWdlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVQYWdlcyhuZXdQYWdlOiBudW1iZXIpIHtcbiAgICB0aGlzLnBhZ2VDb3VudCA9IE1hdGguY2VpbCh0aGlzLmNvbGxlY3Rpb25TaXplIC8gdGhpcy5wYWdlU2l6ZSk7XG5cbiAgICBpZiAoIWlzTnVtYmVyKHRoaXMucGFnZUNvdW50KSkge1xuICAgICAgdGhpcy5wYWdlQ291bnQgPSAwO1xuICAgIH1cblxuICAgIC8vIGZpbGwtaW4gbW9kZWwgbmVlZGVkIHRvIHJlbmRlciBwYWdlc1xuICAgIHRoaXMucGFnZXMubGVuZ3RoID0gMDtcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8PSB0aGlzLnBhZ2VDb3VudDsgaSsrKSB7XG4gICAgICB0aGlzLnBhZ2VzLnB1c2goaSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IHBhZ2Ugd2l0aGluIDEuLm1heCByYW5nZVxuICAgIHRoaXMuX3NldFBhZ2VJblJhbmdlKG5ld1BhZ2UpO1xuXG4gICAgLy8gYXBwbHkgbWF4U2l6ZSBpZiBuZWNlc3NhcnlcbiAgICBpZiAodGhpcy5tYXhTaXplID4gMCAmJiB0aGlzLnBhZ2VDb3VudCA+IHRoaXMubWF4U2l6ZSkge1xuICAgICAgbGV0IHN0YXJ0ID0gMDtcbiAgICAgIGxldCBlbmQgPSB0aGlzLnBhZ2VDb3VudDtcblxuICAgICAgLy8gZWl0aGVyIHBhZ2luYXRpbmcgb3Igcm90YXRpbmcgcGFnZSBudW1iZXJzXG4gICAgICBpZiAodGhpcy5yb3RhdGUpIHtcbiAgICAgICAgW3N0YXJ0LCBlbmRdID0gdGhpcy5fYXBwbHlSb3RhdGlvbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgW3N0YXJ0LCBlbmRdID0gdGhpcy5fYXBwbHlQYWdpbmF0aW9uKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucGFnZXMgPSB0aGlzLnBhZ2VzLnNsaWNlKHN0YXJ0LCBlbmQpO1xuXG4gICAgICAvLyBhZGRpbmcgZWxsaXBzZXNcbiAgICAgIHRoaXMuX2FwcGx5RWxsaXBzZXMoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYlBhZ2luYXRpb259IGZyb20gJy4vcGFnaW5hdGlvbic7XG5cbmV4cG9ydCB7TmdiUGFnaW5hdGlvbn0gZnJvbSAnLi9wYWdpbmF0aW9uJztcbmV4cG9ydCB7TmdiUGFnaW5hdGlvbkNvbmZpZ30gZnJvbSAnLi9wYWdpbmF0aW9uLWNvbmZpZyc7XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBbTmdiUGFnaW5hdGlvbl0sIGV4cG9ydHM6IFtOZ2JQYWdpbmF0aW9uXSwgaW1wb3J0czogW0NvbW1vbk1vZHVsZV19KVxuZXhwb3J0IGNsYXNzIE5nYlBhZ2luYXRpb25Nb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiUGFnaW5hdGlvbk1vZHVsZX07IH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUcmlnZ2VyIHtcbiAgY29uc3RydWN0b3IocHVibGljIG9wZW46IHN0cmluZywgcHVibGljIGNsb3NlPzogc3RyaW5nKSB7XG4gICAgaWYgKCFjbG9zZSkge1xuICAgICAgdGhpcy5jbG9zZSA9IG9wZW47XG4gICAgfVxuICB9XG5cbiAgaXNNYW51YWwoKSB7IHJldHVybiB0aGlzLm9wZW4gPT09ICdtYW51YWwnIHx8IHRoaXMuY2xvc2UgPT09ICdtYW51YWwnOyB9XG59XG5cbmNvbnN0IERFRkFVTFRfQUxJQVNFUyA9IHtcbiAgJ2hvdmVyJzogWydtb3VzZWVudGVyJywgJ21vdXNlbGVhdmUnXVxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJpZ2dlcnModHJpZ2dlcnM6IHN0cmluZywgYWxpYXNlcyA9IERFRkFVTFRfQUxJQVNFUyk6IFRyaWdnZXJbXSB7XG4gIGNvbnN0IHRyaW1tZWRUcmlnZ2VycyA9ICh0cmlnZ2VycyB8fCAnJykudHJpbSgpO1xuXG4gIGlmICh0cmltbWVkVHJpZ2dlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgY29uc3QgcGFyc2VkVHJpZ2dlcnMgPSB0cmltbWVkVHJpZ2dlcnMuc3BsaXQoL1xccysvKS5tYXAodHJpZ2dlciA9PiB0cmlnZ2VyLnNwbGl0KCc6JykpLm1hcCgodHJpZ2dlclBhaXIpID0+IHtcbiAgICBsZXQgYWxpYXMgPSBhbGlhc2VzW3RyaWdnZXJQYWlyWzBdXSB8fCB0cmlnZ2VyUGFpcjtcbiAgICByZXR1cm4gbmV3IFRyaWdnZXIoYWxpYXNbMF0sIGFsaWFzWzFdKTtcbiAgfSk7XG5cbiAgY29uc3QgbWFudWFsVHJpZ2dlcnMgPSBwYXJzZWRUcmlnZ2Vycy5maWx0ZXIodHJpZ2dlclBhaXIgPT4gdHJpZ2dlclBhaXIuaXNNYW51YWwoKSk7XG5cbiAgaWYgKG1hbnVhbFRyaWdnZXJzLmxlbmd0aCA+IDEpIHtcbiAgICB0aHJvdyAnVHJpZ2dlcnMgcGFyc2UgZXJyb3I6IG9ubHkgb25lIG1hbnVhbCB0cmlnZ2VyIGlzIGFsbG93ZWQnO1xuICB9XG5cbiAgaWYgKG1hbnVhbFRyaWdnZXJzLmxlbmd0aCA9PT0gMSAmJiBwYXJzZWRUcmlnZ2Vycy5sZW5ndGggPiAxKSB7XG4gICAgdGhyb3cgJ1RyaWdnZXJzIHBhcnNlIGVycm9yOiBtYW51YWwgdHJpZ2dlciBjYW5cXCd0IGJlIG1peGVkIHdpdGggb3RoZXIgdHJpZ2dlcnMnO1xuICB9XG5cbiAgcmV0dXJuIHBhcnNlZFRyaWdnZXJzO1xufVxuXG5jb25zdCBub29wRm4gPSAoKSA9PiB7fTtcblxuZXhwb3J0IGZ1bmN0aW9uIGxpc3RlblRvVHJpZ2dlcnMocmVuZGVyZXI6IGFueSwgbmF0aXZlRWxlbWVudDogYW55LCB0cmlnZ2Vyczogc3RyaW5nLCBvcGVuRm4sIGNsb3NlRm4sIHRvZ2dsZUZuKSB7XG4gIGNvbnN0IHBhcnNlZFRyaWdnZXJzID0gcGFyc2VUcmlnZ2Vycyh0cmlnZ2Vycyk7XG4gIGNvbnN0IGxpc3RlbmVycyA9IFtdO1xuXG4gIGlmIChwYXJzZWRUcmlnZ2Vycy5sZW5ndGggPT09IDEgJiYgcGFyc2VkVHJpZ2dlcnNbMF0uaXNNYW51YWwoKSkge1xuICAgIHJldHVybiBub29wRm47XG4gIH1cblxuICBwYXJzZWRUcmlnZ2Vycy5mb3JFYWNoKCh0cmlnZ2VyOiBUcmlnZ2VyKSA9PiB7XG4gICAgaWYgKHRyaWdnZXIub3BlbiA9PT0gdHJpZ2dlci5jbG9zZSkge1xuICAgICAgbGlzdGVuZXJzLnB1c2gocmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIHRyaWdnZXIub3BlbiwgdG9nZ2xlRm4pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdGVuZXJzLnB1c2goXG4gICAgICAgICAgcmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIHRyaWdnZXIub3Blbiwgb3BlbkZuKSwgcmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIHRyaWdnZXIuY2xvc2UsIGNsb3NlRm4pKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiAoKSA9PiB7IGxpc3RlbmVycy5mb3JFYWNoKHVuc3Vic2NyaWJlRm4gPT4gdW5zdWJzY3JpYmVGbigpKTsgfTtcbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JQb3BvdmVyIGRpcmVjdGl2ZS5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBwb3BvdmVycyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiUG9wb3ZlckNvbmZpZyB7XG4gIGF1dG9DbG9zZTogYm9vbGVhbiB8ICdpbnNpZGUnIHwgJ291dHNpZGUnID0gdHJ1ZTtcbiAgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICd0b3AnO1xuICB0cmlnZ2VycyA9ICdjbGljayc7XG4gIGNvbnRhaW5lcjogc3RyaW5nO1xuICBkaXNhYmxlUG9wb3ZlciA9IGZhbHNlO1xuICBwb3BvdmVyQ2xhc3M6IHN0cmluZztcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgT25DaGFuZ2VzLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBSZW5kZXJlcjIsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDb250YWluZXJSZWYsXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgTmdab25lLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7ZnJvbUV2ZW50LCByYWNlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtsaXN0ZW5Ub1RyaWdnZXJzfSBmcm9tICcuLi91dGlsL3RyaWdnZXJzJztcbmltcG9ydCB7cG9zaXRpb25FbGVtZW50cywgUGxhY2VtZW50LCBQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQge1BvcHVwU2VydmljZX0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5pbXBvcnQge05nYlBvcG92ZXJDb25maWd9IGZyb20gJy4vcG9wb3Zlci1jb25maWcnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXBvcG92ZXItd2luZG93JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzXSc6XG4gICAgICAgICdcInBvcG92ZXIgYnMtcG9wb3Zlci1cIiArIHBsYWNlbWVudC5zcGxpdChcIi1cIilbMF0rXCIgYnMtcG9wb3Zlci1cIiArIHBsYWNlbWVudCArIChwb3BvdmVyQ2xhc3MgPyBcIiBcIiArIHBvcG92ZXJDbGFzcyA6IFwiXCIpJyxcbiAgICAncm9sZSc6ICd0b29sdGlwJyxcbiAgICAnW2lkXSc6ICdpZCdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj5cbiAgICA8aDMgY2xhc3M9XCJwb3BvdmVyLWhlYWRlclwiPnt7dGl0bGV9fTwvaDM+PGRpdiBjbGFzcz1cInBvcG92ZXItYm9keVwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5gLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3QuYnMtcG9wb3Zlci10b3AgLmFycm93LCA6aG9zdC5icy1wb3BvdmVyLWJvdHRvbSAuYXJyb3cge1xuICAgICAgbGVmdDogNTAlO1xuICAgICAgbWFyZ2luLWxlZnQ6IC01cHg7XG4gICAgfVxuXG4gICAgOmhvc3QuYnMtcG9wb3Zlci10b3AtbGVmdCAuYXJyb3csIDpob3N0LmJzLXBvcG92ZXItYm90dG9tLWxlZnQgLmFycm93IHtcbiAgICAgIGxlZnQ6IDJlbTtcbiAgICB9XG5cbiAgICA6aG9zdC5icy1wb3BvdmVyLXRvcC1yaWdodCAuYXJyb3csIDpob3N0LmJzLXBvcG92ZXItYm90dG9tLXJpZ2h0IC5hcnJvdyB7XG4gICAgICBsZWZ0OiBhdXRvO1xuICAgICAgcmlnaHQ6IDJlbTtcbiAgICB9XG5cbiAgICA6aG9zdC5icy1wb3BvdmVyLWxlZnQgLmFycm93LCA6aG9zdC5icy1wb3BvdmVyLXJpZ2h0IC5hcnJvdyB7XG4gICAgICB0b3A6IDUwJTtcbiAgICAgIG1hcmdpbi10b3A6IC01cHg7XG4gICAgfVxuXG4gICAgOmhvc3QuYnMtcG9wb3Zlci1sZWZ0LXRvcCAuYXJyb3csIDpob3N0LmJzLXBvcG92ZXItcmlnaHQtdG9wIC5hcnJvdyB7XG4gICAgICB0b3A6IDAuN2VtO1xuICAgIH1cblxuICAgIDpob3N0LmJzLXBvcG92ZXItbGVmdC1ib3R0b20gLmFycm93LCA6aG9zdC5icy1wb3BvdmVyLXJpZ2h0LWJvdHRvbSAuYXJyb3cge1xuICAgICAgdG9wOiBhdXRvO1xuICAgICAgYm90dG9tOiAwLjdlbTtcbiAgICB9XG4gIGBdXG59KVxuZXhwb3J0IGNsYXNzIE5nYlBvcG92ZXJXaW5kb3cge1xuICBASW5wdXQoKSBwbGFjZW1lbnQ6IFBsYWNlbWVudCA9ICd0b3AnO1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xuICBASW5wdXQoKSBpZDogc3RyaW5nO1xuICBASW5wdXQoKSBwb3BvdmVyQ2xhc3M6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9lbGVtZW50OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMikge31cblxuICBhcHBseVBsYWNlbWVudChfcGxhY2VtZW50OiBQbGFjZW1lbnQpIHtcbiAgICAvLyByZW1vdmUgdGhlIGN1cnJlbnQgcGxhY2VtZW50IGNsYXNzZXNcbiAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdicy1wb3BvdmVyLScgKyB0aGlzLnBsYWNlbWVudC50b1N0cmluZygpLnNwbGl0KCctJylbMF0pO1xuICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JzLXBvcG92ZXItJyArIHRoaXMucGxhY2VtZW50LnRvU3RyaW5nKCkpO1xuXG4gICAgLy8gc2V0IHRoZSBuZXcgcGxhY2VtZW50IGNsYXNzZXNcbiAgICB0aGlzLnBsYWNlbWVudCA9IF9wbGFjZW1lbnQ7XG5cbiAgICAvLyBhcHBseSB0aGUgbmV3IHBsYWNlbWVudFxuICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JzLXBvcG92ZXItJyArIHRoaXMucGxhY2VtZW50LnRvU3RyaW5nKCkuc3BsaXQoJy0nKVswXSk7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnYnMtcG9wb3Zlci0nICsgdGhpcy5wbGFjZW1lbnQudG9TdHJpbmcoKSk7XG4gIH1cblxuICAvKipcbiAgICogVGVsbHMgd2hldGhlciB0aGUgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGZyb20gdGhpcyBjb21wb25lbnQncyBzdWJ0cmVlIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50IHRoZSBldmVudCB0byBjaGVja1xuICAgKlxuICAgKiBAcmV0dXJuIHdoZXRoZXIgdGhlIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZCBmcm9tIHRoaXMgY29tcG9uZW50J3Mgc3VidHJlZSBvciBub3QuXG4gICAqL1xuICBpc0V2ZW50RnJvbShldmVudDogRXZlbnQpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQgYXMgSFRNTEVsZW1lbnQpOyB9XG59XG5cbi8qKlxuICogQSBsaWdodHdlaWdodCwgZXh0ZW5zaWJsZSBkaXJlY3RpdmUgZm9yIGZhbmN5IHBvcG92ZXIgY3JlYXRpb24uXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nYlBvcG92ZXJdJywgZXhwb3J0QXM6ICduZ2JQb3BvdmVyJ30pXG5leHBvcnQgY2xhc3MgTmdiUG9wb3ZlciBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHBvcG92ZXIgc2hvdWxkIGJlIGNsb3NlZCBvbiBFc2NhcGUga2V5IGFuZCBpbnNpZGUvb3V0c2lkZSBjbGlja3MuXG4gICAqXG4gICAqIC0gdHJ1ZSAoZGVmYXVsdCk6IGNsb3NlcyBvbiBib3RoIG91dHNpZGUgYW5kIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtIGZhbHNlOiBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcbiAgICogLSAnaW5zaWRlJzogY2xvc2VzIG9uIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtICdvdXRzaWRlJzogY2xvc2VzIG9uIG91dHNpZGUgY2xpY2tzIChzb21ldGltZXMgYWxzbyBhY2hpZXZhYmxlIHRocm91Z2ggdHJpZ2dlcnMpXG4gICAqIGFzIHdlbGwgYXMgRXNjYXBlIHByZXNzZXNcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcbiAgLyoqXG4gICAqIENvbnRlbnQgdG8gYmUgZGlzcGxheWVkIGFzIHBvcG92ZXIuIElmIHRpdGxlIGFuZCBjb250ZW50IGFyZSBlbXB0eSwgdGhlIHBvcG92ZXIgd29uJ3Qgb3Blbi5cbiAgICovXG4gIEBJbnB1dCgpIG5nYlBvcG92ZXI6IHN0cmluZyB8IFRlbXBsYXRlUmVmPGFueT47XG4gIC8qKlxuICAgKiBUaXRsZSBvZiBhIHBvcG92ZXIuIElmIHRpdGxlIGFuZCBjb250ZW50IGFyZSBlbXB0eSwgdGhlIHBvcG92ZXIgd29uJ3Qgb3Blbi5cbiAgICovXG4gIEBJbnB1dCgpIHBvcG92ZXJUaXRsZTogc3RyaW5nO1xuICAvKipcbiAgICogUGxhY2VtZW50IG9mIGEgcG9wb3ZlciBhY2NlcHRzOlxuICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICogICAgXCJsZWZ0XCIsIFwibGVmdC10b3BcIiwgXCJsZWZ0LWJvdHRvbVwiLCBcInJpZ2h0XCIsIFwicmlnaHQtdG9wXCIsIFwicmlnaHQtYm90dG9tXCJcbiAgICogYW5kIGFycmF5IG9mIGFib3ZlIHZhbHVlcy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIuIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXMuXG4gICAqL1xuICBASW5wdXQoKSB0cmlnZ2Vyczogc3RyaW5nO1xuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSBwb3BvdmVyIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG4gICAqL1xuICBASW5wdXQoKSBjb250YWluZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIGEgZ2l2ZW4gcG9wb3ZlciBpcyBkaXNhYmxlZCBhbmQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZVBvcG92ZXI6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBjbGFzcyBhcHBsaWVkIHRvIG5nYi1wb3BvdmVyLXdpbmRvd1xuICAgKlxuICAgKiBAc2luY2UgMi4yLjBcbiAgICovXG4gIEBJbnB1dCgpIHBvcG92ZXJDbGFzczogc3RyaW5nO1xuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgcG9wb3ZlciBpcyBzaG93blxuICAgKi9cbiAgQE91dHB1dCgpIHNob3duID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAvKipcbiAgICogRW1pdHMgYW4gZXZlbnQgd2hlbiB0aGUgcG9wb3ZlciBpcyBoaWRkZW5cbiAgICovXG4gIEBPdXRwdXQoKSBoaWRkZW4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHJpdmF0ZSBfbmdiUG9wb3ZlcldpbmRvd0lkID0gYG5nYi1wb3BvdmVyLSR7bmV4dElkKyt9YDtcbiAgcHJpdmF0ZSBfcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2U8TmdiUG9wb3ZlcldpbmRvdz47XG4gIHByaXZhdGUgX3dpbmRvd1JlZjogQ29tcG9uZW50UmVmPE5nYlBvcG92ZXJXaW5kb3c+O1xuICBwcml2YXRlIF91bnJlZ2lzdGVyTGlzdGVuZXJzRm47XG4gIHByaXZhdGUgX3pvbmVTdWJzY3JpcHRpb246IGFueTtcbiAgcHJpdmF0ZSBfaXNEaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5kaXNhYmxlUG9wb3Zlcikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghdGhpcy5uZ2JQb3BvdmVyICYmICF0aGlzLnBvcG92ZXJUaXRsZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBjb25maWc6IE5nYlBvcG92ZXJDb25maWcsXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSkge1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG4gICAgdGhpcy50cmlnZ2VycyA9IGNvbmZpZy50cmlnZ2VycztcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXI7XG4gICAgdGhpcy5kaXNhYmxlUG9wb3ZlciA9IGNvbmZpZy5kaXNhYmxlUG9wb3ZlcjtcbiAgICB0aGlzLnBvcG92ZXJDbGFzcyA9IGNvbmZpZy5wb3BvdmVyQ2xhc3M7XG4gICAgdGhpcy5fcG9wdXBTZXJ2aWNlID0gbmV3IFBvcHVwU2VydmljZTxOZ2JQb3BvdmVyV2luZG93PihcbiAgICAgICAgTmdiUG9wb3ZlcldpbmRvdywgaW5qZWN0b3IsIHZpZXdDb250YWluZXJSZWYsIF9yZW5kZXJlciwgY29tcG9uZW50RmFjdG9yeVJlc29sdmVyKTtcblxuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24gPSBfbmdab25lLm9uU3RhYmxlLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICBpZiAodGhpcy5fd2luZG93UmVmKSB7XG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5hcHBseVBsYWNlbWVudChcbiAgICAgICAgICAgIHBvc2l0aW9uRWxlbWVudHMoXG4gICAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5jb250YWluZXIgPT09ICdib2R5JykpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIE9wZW5zIGFuIGVsZW1lbnTDosKAwplzIHBvcG92ZXIuIFRoaXMgaXMgY29uc2lkZXJlZCBhIMOiwoDCnG1hbnVhbMOiwoDCnSB0cmlnZ2VyaW5nIG9mIHRoZSBwb3BvdmVyLlxuICAgKiBUaGUgY29udGV4dCBpcyBhbiBvcHRpb25hbCB2YWx1ZSB0byBiZSBpbmplY3RlZCBpbnRvIHRoZSBwb3BvdmVyIHRlbXBsYXRlIHdoZW4gaXQgaXMgY3JlYXRlZC5cbiAgICovXG4gIG9wZW4oY29udGV4dD86IGFueSkge1xuICAgIGlmICghdGhpcy5fd2luZG93UmVmICYmICF0aGlzLl9pc0Rpc2FibGVkKCkpIHtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IHRoaXMuX3BvcHVwU2VydmljZS5vcGVuKHRoaXMubmdiUG9wb3ZlciwgY29udGV4dCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UudGl0bGUgPSB0aGlzLnBvcG92ZXJUaXRsZTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5wb3BvdmVyQ2xhc3MgPSB0aGlzLnBvcG92ZXJDbGFzcztcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5pZCA9IHRoaXMuX25nYlBvcG92ZXJXaW5kb3dJZDtcblxuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FyaWEtZGVzY3JpYmVkYnknLCB0aGlzLl9uZ2JQb3BvdmVyV2luZG93SWQpO1xuXG4gICAgICBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGFwcGx5IHN0eWxpbmcgdG8gc2V0IGJhc2ljIGNzcy1jbGFzc2VzIG9uIHRhcmdldCBlbGVtZW50LCBiZWZvcmUgZ29pbmcgZm9yIHBvc2l0aW9uaW5nXG4gICAgICB0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICAvLyBwb3NpdGlvbiBwb3BvdmVyIGFsb25nIHRoZSBlbGVtZW50XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuYXBwbHlQbGFjZW1lbnQoXG4gICAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpKTtcblxuICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlKSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgLy8gcHJldmVudHMgYXV0b21hdGljIGNsb3NpbmcgcmlnaHQgYWZ0ZXIgYW4gb3BlbmluZyBieSBwdXR0aW5nIGEgZ3VhcmQgZm9yIHRoZSB0aW1lIG9mIG9uZSBldmVudCBoYW5kbGluZ1xuICAgICAgICAgIC8vIHBhc3NcbiAgICAgICAgICAvLyB1c2UgY2FzZTogY2xpY2sgZXZlbnQgd291bGQgcmVhY2ggYW4gZWxlbWVudCBvcGVuaW5nIHRoZSBwb3BvdmVyIGZpcnN0LCB0aGVuIHJlYWNoIHRoZSBhdXRvQ2xvc2UgaGFuZGxlclxuICAgICAgICAgIC8vIHdoaWNoIHdvdWxkIGNsb3NlIGl0XG4gICAgICAgICAgbGV0IGp1c3RPcGVuZWQgPSB0cnVlO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBqdXN0T3BlbmVkID0gZmFsc2UpO1xuXG4gICAgICAgICAgY29uc3QgZXNjYXBlcyQgPSBmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4odGhpcy5fZG9jdW1lbnQsICdrZXl1cCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuaGlkZGVuKSwgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LndoaWNoID09PSBLZXkuRXNjYXBlKSk7XG5cbiAgICAgICAgICBjb25zdCBjbGlja3MkID0gZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuaGlkZGVuKSwgZmlsdGVyKCgpID0+ICFqdXN0T3BlbmVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gdGhpcy5fc2hvdWxkQ2xvc2VGcm9tQ2xpY2soZXZlbnQpKSk7XG5cbiAgICAgICAgICByYWNlPEV2ZW50PihbZXNjYXBlcyQsIGNsaWNrcyRdKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmNsb3NlKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd24uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgYW4gZWxlbWVudMOiwoDCmXMgcG9wb3Zlci4gVGhpcyBpcyBjb25zaWRlcmVkIGEgw6LCgMKcbWFudWFsw6LCgMKdIHRyaWdnZXJpbmcgb2YgdGhlIHBvcG92ZXIuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93UmVmKSB7XG4gICAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVBdHRyaWJ1dGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYXJpYS1kZXNjcmliZWRieScpO1xuICAgICAgdGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKCk7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSBudWxsO1xuICAgICAgdGhpcy5oaWRkZW4uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIGFuIGVsZW1lbnTDosKAwplzIHBvcG92ZXIuIFRoaXMgaXMgY29uc2lkZXJlZCBhIMOiwoDCnG1hbnVhbMOiwoDCnSB0cmlnZ2VyaW5nIG9mIHRoZSBwb3BvdmVyLlxuICAgKi9cbiAgdG9nZ2xlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl93aW5kb3dSZWYpIHtcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vcGVuKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgd2hldGhlciBvciBub3QgdGhlIHBvcG92ZXIgaXMgY3VycmVudGx5IGJlaW5nIHNob3duXG4gICAqL1xuICBpc09wZW4oKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLl93aW5kb3dSZWYgIT0gbnVsbDsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbiA9IGxpc3RlblRvVHJpZ2dlcnMoXG4gICAgICAgIHRoaXMuX3JlbmRlcmVyLCB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMudHJpZ2dlcnMsIHRoaXMub3Blbi5iaW5kKHRoaXMpLCB0aGlzLmNsb3NlLmJpbmQodGhpcyksXG4gICAgICAgIHRoaXMudG9nZ2xlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIC8vIGNsb3NlIHBvcG92ZXIgaWYgdGl0bGUgYW5kIGNvbnRlbnQgYmVjb21lIGVtcHR5LCBvciBkaXNhYmxlUG9wb3ZlciBzZXQgdG8gdHJ1ZVxuICAgIGlmICgoY2hhbmdlc1snbmdiUG9wb3ZlciddIHx8IGNoYW5nZXNbJ3BvcG92ZXJUaXRsZSddIHx8IGNoYW5nZXNbJ2Rpc2FibGVQb3BvdmVyJ10pICYmIHRoaXMuX2lzRGlzYWJsZWQoKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLl91bnJlZ2lzdGVyTGlzdGVuZXJzRm4oKTtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9zaG91bGRDbG9zZUZyb21DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmIChldmVudC5idXR0b24gIT09IDIpIHtcbiAgICAgIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvQ2xvc2UgPT09ICdpbnNpZGUnICYmIHRoaXMuX2lzRXZlbnRGcm9tUG9wb3ZlcihldmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSAnb3V0c2lkZScgJiYgIXRoaXMuX2lzRXZlbnRGcm9tUG9wb3ZlcihldmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzRXZlbnRGcm9tUG9wb3ZlcihldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHBvcHVwID0gdGhpcy5fd2luZG93UmVmLmluc3RhbmNlO1xuICAgIHJldHVybiBwb3B1cCA/IHBvcHVwLmlzRXZlbnRGcm9tKGV2ZW50KSA6IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JQb3BvdmVyLCBOZ2JQb3BvdmVyV2luZG93fSBmcm9tICcuL3BvcG92ZXInO1xuXG5leHBvcnQge05nYlBvcG92ZXJ9IGZyb20gJy4vcG9wb3Zlcic7XG5leHBvcnQge05nYlBvcG92ZXJDb25maWd9IGZyb20gJy4vcG9wb3Zlci1jb25maWcnO1xuZXhwb3J0IHtQbGFjZW1lbnR9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogW05nYlBvcG92ZXIsIE5nYlBvcG92ZXJXaW5kb3ddLCBleHBvcnRzOiBbTmdiUG9wb3Zlcl0sIGVudHJ5Q29tcG9uZW50czogW05nYlBvcG92ZXJXaW5kb3ddfSlcbmV4cG9ydCBjbGFzcyBOZ2JQb3BvdmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYlBvcG92ZXJNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYlByb2dyZXNzYmFyIGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSBwcm9ncmVzcyBiYXJzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JQcm9ncmVzc2JhckNvbmZpZyB7XG4gIG1heCA9IDEwMDtcbiAgYW5pbWF0ZWQgPSBmYWxzZTtcbiAgc3RyaXBlZCA9IGZhbHNlO1xuICB0eXBlOiBzdHJpbmc7XG4gIHNob3dWYWx1ZSA9IGZhbHNlO1xuICBoZWlnaHQ6IHN0cmluZztcbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtnZXRWYWx1ZUluUmFuZ2V9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge05nYlByb2dyZXNzYmFyQ29uZmlnfSBmcm9tICcuL3Byb2dyZXNzYmFyLWNvbmZpZyc7XG5cbi8qKlxuICogRGlyZWN0aXZlIHRoYXQgY2FuIGJlIHVzZWQgdG8gcHJvdmlkZSBmZWVkYmFjayBvbiB0aGUgcHJvZ3Jlc3Mgb2YgYSB3b3JrZmxvdyBvciBhbiBhY3Rpb24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1wcm9ncmVzc2JhcicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiIFtzdHlsZS5oZWlnaHRdPVwiaGVpZ2h0XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFye3t0eXBlID8gJyBiZy0nICsgdHlwZSA6ICcnfX17e2FuaW1hdGVkID8gJyBwcm9ncmVzcy1iYXItYW5pbWF0ZWQnIDogJyd9fXt7c3RyaXBlZCA/XG4gICAgJyBwcm9ncmVzcy1iYXItc3RyaXBlZCcgOiAnJ319XCIgcm9sZT1cInByb2dyZXNzYmFyXCIgW3N0eWxlLndpZHRoLiVdPVwiZ2V0UGVyY2VudFZhbHVlKClcIlxuICAgIFthdHRyLmFyaWEtdmFsdWVub3ddPVwiZ2V0VmFsdWUoKVwiIGFyaWEtdmFsdWVtaW49XCIwXCIgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIj5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJzaG93VmFsdWVcIiBpMThuPVwiQEBuZ2IucHJvZ3Jlc3NiYXIudmFsdWVcIj57e2dldFBlcmNlbnRWYWx1ZSgpfX0lPC9zcGFuPjxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYlByb2dyZXNzYmFyIHtcbiAgLyoqXG4gICAqIE1heGltYWwgdmFsdWUgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBwcm9ncmVzc2Jhci5cbiAgICovXG4gIEBJbnB1dCgpIG1heDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiB0aGUgc3RyaXBlcyBvZiB0aGUgcHJvZ3Jlc3MgYmFyIHNob3VsZCBiZSBhbmltYXRlZC4gVGFrZXMgZWZmZWN0IG9ubHkgZm9yIGJyb3dzZXJzXG4gICAqIHN1cHBvcnRpbmcgQ1NTMyBhbmltYXRpb25zLCBhbmQgaWYgc3RyaXBlZCBpcyB0cnVlLlxuICAgKi9cbiAgQElucHV0KCkgYW5pbWF0ZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIGEgcHJvZ3Jlc3MgYmFyIHNob3VsZCBiZSBkaXNwbGF5ZWQgYXMgc3RyaXBlZC5cbiAgICovXG4gIEBJbnB1dCgpIHN0cmlwZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBjdXJyZW50IHBlcmNlbnRhZ2UgdmFsdWUgc2hvdWxkIGJlIHNob3duLlxuICAgKi9cbiAgQElucHV0KCkgc2hvd1ZhbHVlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHByb2dyZXNzIGJhciwgY2FuIGJlIG9uZSBvZiBcInN1Y2Nlc3NcIiwgXCJpbmZvXCIsIFwid2FybmluZ1wiIG9yIFwiZGFuZ2VyXCIuXG4gICAqL1xuICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgdmFsdWUgdG8gYmUgZGlzcGxheWVkIGluIHRoZSBwcm9ncmVzc2Jhci4gU2hvdWxkIGJlIHNtYWxsZXIgb3IgZXF1YWwgdG8gXCJtYXhcIiB2YWx1ZS5cbiAgICovXG4gIEBJbnB1dCgpIHZhbHVlID0gMDtcblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSBwcm9ncmVzcyBiYXIuIEFjY2VwdHMgYW55IHZhbGlkIENTUyBoZWlnaHQgdmFsdWVzLCBleC4gJzJyZW0nXG4gICAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZztcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYlByb2dyZXNzYmFyQ29uZmlnKSB7XG4gICAgdGhpcy5tYXggPSBjb25maWcubWF4O1xuICAgIHRoaXMuYW5pbWF0ZWQgPSBjb25maWcuYW5pbWF0ZWQ7XG4gICAgdGhpcy5zdHJpcGVkID0gY29uZmlnLnN0cmlwZWQ7XG4gICAgdGhpcy50eXBlID0gY29uZmlnLnR5cGU7XG4gICAgdGhpcy5zaG93VmFsdWUgPSBjb25maWcuc2hvd1ZhbHVlO1xuICAgIHRoaXMuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcbiAgfVxuXG4gIGdldFZhbHVlKCkgeyByZXR1cm4gZ2V0VmFsdWVJblJhbmdlKHRoaXMudmFsdWUsIHRoaXMubWF4KTsgfVxuXG4gIGdldFBlcmNlbnRWYWx1ZSgpIHsgcmV0dXJuIDEwMCAqIHRoaXMuZ2V0VmFsdWUoKSAvIHRoaXMubWF4OyB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYlByb2dyZXNzYmFyfSBmcm9tICcuL3Byb2dyZXNzYmFyJztcblxuZXhwb3J0IHtOZ2JQcm9ncmVzc2Jhcn0gZnJvbSAnLi9wcm9ncmVzc2Jhcic7XG5leHBvcnQge05nYlByb2dyZXNzYmFyQ29uZmlnfSBmcm9tICcuL3Byb2dyZXNzYmFyLWNvbmZpZyc7XG5cbkBOZ01vZHVsZSh7ZGVjbGFyYXRpb25zOiBbTmdiUHJvZ3Jlc3NiYXJdLCBleHBvcnRzOiBbTmdiUHJvZ3Jlc3NiYXJdLCBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXX0pXG5leHBvcnQgY2xhc3MgTmdiUHJvZ3Jlc3NiYXJNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiUHJvZ3Jlc3NiYXJNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYlJhdGluZyBjb21wb25lbnQuXG4gKiBZb3UgY2FuIGluamVjdCB0aGlzIHNlcnZpY2UsIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgY29tcG9uZW50LCBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW5cbiAqIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCB0aGUgcmF0aW5ncyB1c2VkIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTmdiUmF0aW5nQ29uZmlnIHtcbiAgbWF4ID0gMTA7XG4gIHJlYWRvbmx5ID0gZmFsc2U7XG4gIHJlc2V0dGFibGUgPSBmYWxzZTtcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlcixcbiAgT25Jbml0LFxuICBUZW1wbGF0ZVJlZixcbiAgT25DaGFuZ2VzLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBDb250ZW50Q2hpbGQsXG4gIGZvcndhcmRSZWYsXG4gIENoYW5nZURldGVjdG9yUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JSYXRpbmdDb25maWd9IGZyb20gJy4vcmF0aW5nLWNvbmZpZyc7XG5pbXBvcnQge3RvU3RyaW5nLCBnZXRWYWx1ZUluUmFuZ2V9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuLyoqXG4gKiBDb250ZXh0IGZvciB0aGUgY3VzdG9tIHN0YXIgZGlzcGxheSB0ZW1wbGF0ZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YXJUZW1wbGF0ZUNvbnRleHQge1xuICAvKipcbiAgICogU3RhciBmaWxsIHBlcmNlbnRhZ2UuIEFuIGludGVnZXIgdmFsdWUgYmV0d2VlbiAwIGFuZCAxMDBcbiAgICovXG4gIGZpbGw6IG51bWJlcjtcblxuICAvKipcbiAgICogSW5kZXggb2YgdGhlIHN0YXIuXG4gICAqL1xuICBpbmRleDogbnVtYmVyO1xufVxuXG5jb25zdCBOR0JfUkFUSU5HX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiUmF0aW5nKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogUmF0aW5nIGRpcmVjdGl2ZSB0aGF0IHdpbGwgdGFrZSBjYXJlIG9mIHZpc3VhbGlzaW5nIGEgc3RhciByYXRpbmcgYmFyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItcmF0aW5nJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnY2xhc3MnOiAnZC1pbmxpbmUtZmxleCcsXG4gICAgJ3RhYmluZGV4JzogJzAnLFxuICAgICdyb2xlJzogJ3NsaWRlcicsXG4gICAgJ2FyaWEtdmFsdWVtaW4nOiAnMCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVtYXhdJzogJ21heCcsXG4gICAgJ1thdHRyLmFyaWEtdmFsdWVub3ddJzogJ25leHRSYXRlJyxcbiAgICAnW2F0dHIuYXJpYS12YWx1ZXRleHRdJzogJ2FyaWFWYWx1ZVRleHQoKScsXG4gICAgJ1thdHRyLmFyaWEtZGlzYWJsZWRdJzogJ3JlYWRvbmx5ID8gdHJ1ZSA6IG51bGwnLFxuICAgICcoYmx1ciknOiAnaGFuZGxlQmx1cigpJyxcbiAgICAnKGtleWRvd24pJzogJ2hhbmRsZUtleURvd24oJGV2ZW50KScsXG4gICAgJyhtb3VzZWxlYXZlKSc6ICdyZXNldCgpJ1xuICB9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjdCBsZXQtZmlsbD1cImZpbGxcIj57eyBmaWxsID09PSAxMDAgPyAnJiM5NzMzOycgOiAnJiM5NzM0OycgfX08L25nLXRlbXBsYXRlPlxuICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBbbmdGb3JPZl09XCJjb250ZXh0c1wiIGxldC1pbmRleD1cImluZGV4XCI+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIj4oe3sgaW5kZXggPCBuZXh0UmF0ZSA/ICcqJyA6ICcgJyB9fSk8L3NwYW4+XG4gICAgICA8c3BhbiAobW91c2VlbnRlcik9XCJlbnRlcihpbmRleCArIDEpXCIgKGNsaWNrKT1cImhhbmRsZUNsaWNrKGluZGV4ICsgMSlcIiBbc3R5bGUuY3Vyc29yXT1cInJlYWRvbmx5IHx8IGRpc2FibGVkID8gJ2RlZmF1bHQnIDogJ3BvaW50ZXInXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJzdGFyVGVtcGxhdGUgfHwgdFwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJjb250ZXh0c1tpbmRleF1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgPC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIHByb3ZpZGVyczogW05HQl9SQVRJTkdfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE5nYlJhdGluZyBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgY29udGV4dHM6IFN0YXJUZW1wbGF0ZUNvbnRleHRbXSA9IFtdO1xuICBkaXNhYmxlZCA9IGZhbHNlO1xuICBuZXh0UmF0ZTogbnVtYmVyO1xuXG5cbiAgLyoqXG4gICAqIE1heGltYWwgcmF0aW5nIHRoYXQgY2FuIGJlIGdpdmVuIHVzaW5nIHRoaXMgd2lkZ2V0LlxuICAgKi9cbiAgQElucHV0KCkgbWF4OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEN1cnJlbnQgcmF0aW5nLiBDYW4gYmUgYSBkZWNpbWFsIHZhbHVlIGxpa2UgMy43NVxuICAgKi9cbiAgQElucHV0KCkgcmF0ZTogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgaW5kaWNhdGluZyBpZiByYXRpbmcgY2FuIGJlIHVwZGF0ZWQuXG4gICAqL1xuICBASW5wdXQoKSByZWFkb25seTogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIGluZGljYXRpbmcgaWYgcmF0aW5nIGNhbiBiZSByZXNldCB0byAwIG9uIG1vdXNlIGNsaWNrXG4gICAqL1xuICBASW5wdXQoKSByZXNldHRhYmxlOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIHRlbXBsYXRlIHRvIG92ZXJyaWRlIHN0YXIgZGlzcGxheS5cbiAgICogQWx0ZXJuYXRpdmVseSBwdXQgYSA8bmctdGVtcGxhdGU+IGFzIHRoZSBvbmx5IGNoaWxkIG9mIDxuZ2ItcmF0aW5nPiBlbGVtZW50XG4gICAqL1xuICBASW5wdXQoKSBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmKSBzdGFyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPFN0YXJUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBmaXJlZCB3aGVuIGEgdXNlciBpcyBob3ZlcmluZyBvdmVyIGEgZ2l2ZW4gcmF0aW5nLlxuICAgKiBFdmVudCdzIHBheWxvYWQgZXF1YWxzIHRvIHRoZSByYXRpbmcgYmVpbmcgaG92ZXJlZCBvdmVyLlxuICAgKi9cbiAgQE91dHB1dCgpIGhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGZpcmVkIHdoZW4gYSB1c2VyIHN0b3BzIGhvdmVyaW5nIG92ZXIgYSBnaXZlbiByYXRpbmcuXG4gICAqIEV2ZW50J3MgcGF5bG9hZCBlcXVhbHMgdG8gdGhlIHJhdGluZyBvZiB0aGUgbGFzdCBpdGVtIGJlaW5nIGhvdmVyZWQgb3Zlci5cbiAgICovXG4gIEBPdXRwdXQoKSBsZWF2ZSA9IG5ldyBFdmVudEVtaXR0ZXI8bnVtYmVyPigpO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBmaXJlZCB3aGVuIGEgdXNlciBzZWxlY3RzIGEgbmV3IHJhdGluZy5cbiAgICogRXZlbnQncyBwYXlsb2FkIGVxdWFscyB0byB0aGUgbmV3bHkgc2VsZWN0ZWQgcmF0aW5nLlxuICAgKi9cbiAgQE91dHB1dCgpIHJhdGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4odHJ1ZSk7XG5cbiAgb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7fTtcbiAgb25Ub3VjaGVkID0gKCkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoY29uZmlnOiBOZ2JSYXRpbmdDb25maWcsIHByaXZhdGUgX2NoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMubWF4ID0gY29uZmlnLm1heDtcbiAgICB0aGlzLnJlYWRvbmx5ID0gY29uZmlnLnJlYWRvbmx5O1xuICB9XG5cbiAgYXJpYVZhbHVlVGV4dCgpIHsgcmV0dXJuIGAke3RoaXMubmV4dFJhdGV9IG91dCBvZiAke3RoaXMubWF4fWA7IH1cblxuICBlbnRlcih2YWx1ZTogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJlYWRvbmx5ICYmICF0aGlzLmRpc2FibGVkKSB7XG4gICAgICB0aGlzLl91cGRhdGVTdGF0ZSh2YWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuaG92ZXIuZW1pdCh2YWx1ZSk7XG4gIH1cblxuICBoYW5kbGVCbHVyKCkgeyB0aGlzLm9uVG91Y2hlZCgpOyB9XG5cbiAgaGFuZGxlQ2xpY2sodmFsdWU6IG51bWJlcikgeyB0aGlzLnVwZGF0ZSh0aGlzLnJlc2V0dGFibGUgJiYgdGhpcy5yYXRlID09PSB2YWx1ZSA/IDAgOiB2YWx1ZSk7IH1cblxuICBoYW5kbGVLZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KSB7XG4gICAgaWYgKEtleVt0b1N0cmluZyhldmVudC53aGljaCldKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG4gICAgICAgIGNhc2UgS2V5LkFycm93RG93bjpcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dMZWZ0OlxuICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSAtIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5BcnJvd1VwOlxuICAgICAgICBjYXNlIEtleS5BcnJvd1JpZ2h0OlxuICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucmF0ZSArIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Ib21lOlxuICAgICAgICAgIHRoaXMudXBkYXRlKDApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5FbmQ6XG4gICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5tYXgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncmF0ZSddKSB7XG4gICAgICB0aGlzLnVwZGF0ZSh0aGlzLnJhdGUpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY29udGV4dHMgPSBBcnJheS5mcm9tKHtsZW5ndGg6IHRoaXMubWF4fSwgKHYsIGspID0+ICh7ZmlsbDogMCwgaW5kZXg6IGt9KSk7XG4gICAgdGhpcy5fdXBkYXRlU3RhdGUodGhpcy5yYXRlKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLm9uVG91Y2hlZCA9IGZuOyB9XG5cbiAgcmVzZXQoKTogdm9pZCB7XG4gICAgdGhpcy5sZWF2ZS5lbWl0KHRoaXMubmV4dFJhdGUpO1xuICAgIHRoaXMuX3VwZGF0ZVN0YXRlKHRoaXMucmF0ZSk7XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pIHsgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7IH1cblxuICB1cGRhdGUodmFsdWU6IG51bWJlciwgaW50ZXJuYWxDaGFuZ2UgPSB0cnVlKTogdm9pZCB7XG4gICAgY29uc3QgbmV3UmF0ZSA9IGdldFZhbHVlSW5SYW5nZSh2YWx1ZSwgdGhpcy5tYXgsIDApO1xuICAgIGlmICghdGhpcy5yZWFkb25seSAmJiAhdGhpcy5kaXNhYmxlZCAmJiB0aGlzLnJhdGUgIT09IG5ld1JhdGUpIHtcbiAgICAgIHRoaXMucmF0ZSA9IG5ld1JhdGU7XG4gICAgICB0aGlzLnJhdGVDaGFuZ2UuZW1pdCh0aGlzLnJhdGUpO1xuICAgIH1cbiAgICBpZiAoaW50ZXJuYWxDaGFuZ2UpIHtcbiAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5yYXRlKTtcbiAgICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gICAgfVxuICAgIHRoaXMuX3VwZGF0ZVN0YXRlKHRoaXMucmF0ZSk7XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgdGhpcy51cGRhdGUodmFsdWUsIGZhbHNlKTtcbiAgICB0aGlzLl9jaGFuZ2VEZXRlY3RvclJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldEZpbGxWYWx1ZShpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICBjb25zdCBkaWZmID0gdGhpcy5uZXh0UmF0ZSAtIGluZGV4O1xuXG4gICAgaWYgKGRpZmYgPj0gMSkge1xuICAgICAgcmV0dXJuIDEwMDtcbiAgICB9XG4gICAgaWYgKGRpZmYgPCAxICYmIGRpZmYgPiAwKSB7XG4gICAgICByZXR1cm4gTnVtYmVyLnBhcnNlSW50KChkaWZmICogMTAwKS50b0ZpeGVkKDIpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHByaXZhdGUgX3VwZGF0ZVN0YXRlKG5leHRWYWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5uZXh0UmF0ZSA9IG5leHRWYWx1ZTtcbiAgICB0aGlzLmNvbnRleHRzLmZvckVhY2goKGNvbnRleHQsIGluZGV4KSA9PiBjb250ZXh0LmZpbGwgPSB0aGlzLl9nZXRGaWxsVmFsdWUoaW5kZXgpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtOZ01vZHVsZSwgTW9kdWxlV2l0aFByb3ZpZGVyc30gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0NvbW1vbk1vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuaW1wb3J0IHtOZ2JSYXRpbmd9IGZyb20gJy4vcmF0aW5nJztcblxuZXhwb3J0IHtOZ2JSYXRpbmd9IGZyb20gJy4vcmF0aW5nJztcbmV4cG9ydCB7TmdiUmF0aW5nQ29uZmlnfSBmcm9tICcuL3JhdGluZy1jb25maWcnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogW05nYlJhdGluZ10sIGV4cG9ydHM6IFtOZ2JSYXRpbmddLCBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXX0pXG5leHBvcnQgY2xhc3MgTmdiUmF0aW5nTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYlJhdGluZ01vZHVsZX07IH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiVGFic2V0IGNvbXBvbmVudC5cbiAqIFlvdSBjYW4gaW5qZWN0IHRoaXMgc2VydmljZSwgdHlwaWNhbGx5IGluIHlvdXIgcm9vdCBjb21wb25lbnQsIGFuZCBjdXN0b21pemUgdGhlIHZhbHVlcyBvZiBpdHMgcHJvcGVydGllcyBpblxuICogb3JkZXIgdG8gcHJvdmlkZSBkZWZhdWx0IHZhbHVlcyBmb3IgYWxsIHRoZSB0YWJzZXRzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWJzZXRDb25maWcge1xuICBqdXN0aWZ5OiAnc3RhcnQnIHwgJ2NlbnRlcicgfCAnZW5kJyB8ICdmaWxsJyB8ICdqdXN0aWZpZWQnID0gJ3N0YXJ0JztcbiAgb3JpZW50YXRpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG4gIHR5cGU6ICd0YWJzJyB8ICdwaWxscycgPSAndGFicyc7XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIFF1ZXJ5TGlzdCxcbiAgRGlyZWN0aXZlLFxuICBUZW1wbGF0ZVJlZixcbiAgQ29udGVudENoaWxkLFxuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBPdXRwdXQsXG4gIEV2ZW50RW1pdHRlclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiVGFic2V0Q29uZmlnfSBmcm9tICcuL3RhYnNldC1jb25maWcnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBzaG91bGQgYmUgdXNlZCB0byB3cmFwIHRhYiB0aXRsZXMgdGhhdCBuZWVkIHRvIGNvbnRhaW4gSFRNTCBtYXJrdXAgb3Igb3RoZXIgZGlyZWN0aXZlcy5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JUYWJUaXRsZV0nfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWJUaXRsZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBtdXN0IGJlIHVzZWQgdG8gd3JhcCBjb250ZW50IHRvIGJlIGRpc3BsYXllZCBpbiBhIHRhYi5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JUYWJDb250ZW50XSd9KVxuZXhwb3J0IGNsYXNzIE5nYlRhYkNvbnRlbnQge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogQSBkaXJlY3RpdmUgcmVwcmVzZW50aW5nIGFuIGluZGl2aWR1YWwgdGFiLlxuICovXG5ARGlyZWN0aXZlKHtzZWxlY3RvcjogJ25nYi10YWInfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWIge1xuICAvKipcbiAgICogVW5pcXVlIHRhYiBpZGVudGlmaWVyLiBNdXN0IGJlIHVuaXF1ZSBmb3IgdGhlIGVudGlyZSBkb2N1bWVudCBmb3IgcHJvcGVyIGFjY2Vzc2liaWxpdHkgc3VwcG9ydC5cbiAgICovXG4gIEBJbnB1dCgpIGlkID0gYG5nYi10YWItJHtuZXh0SWQrK31gO1xuICAvKipcbiAgICogU2ltcGxlIChzdHJpbmcgb25seSkgdGl0bGUuIFVzZSB0aGUgXCJOZ2JUYWJUaXRsZVwiIGRpcmVjdGl2ZSBmb3IgbW9yZSBjb21wbGV4IHVzZS1jYXNlcy5cbiAgICovXG4gIEBJbnB1dCgpIHRpdGxlOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBBbGxvd3MgdG9nZ2xpbmcgZGlzYWJsZWQgc3RhdGUgb2YgYSBnaXZlbiBzdGF0ZS4gRGlzYWJsZWQgdGFicyBjYW4ndCBiZSBzZWxlY3RlZC5cbiAgICovXG4gIEBJbnB1dCgpIGRpc2FibGVkID0gZmFsc2U7XG5cbiAgdGl0bGVUcGw6IE5nYlRhYlRpdGxlIHwgbnVsbDtcbiAgY29udGVudFRwbDogTmdiVGFiQ29udGVudCB8IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JUYWJUaXRsZSwge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIHRpdGxlVHBsczogUXVlcnlMaXN0PE5nYlRhYlRpdGxlPjtcbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JUYWJDb250ZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JUYWJDb250ZW50PjtcblxuICBuZ0FmdGVyQ29udGVudENoZWNrZWQoKSB7XG4gICAgLy8gV2UgYXJlIHVzaW5nIEBDb250ZW50Q2hpbGRyZW4gaW5zdGVhZCBvZiBAQ29udGFudENoaWxkIGFzIGluIHRoZSBBbmd1bGFyIHZlcnNpb24gYmVpbmcgdXNlZFxuICAgIC8vIG9ubHkgQENvbnRlbnRDaGlsZHJlbiBhbGxvd3MgdXMgdG8gc3BlY2lmeSB0aGUge2Rlc2NlbmRhbnRzOiBmYWxzZX0gb3B0aW9uLlxuICAgIC8vIFdpdGhvdXQge2Rlc2NlbmRhbnRzOiBmYWxzZX0gd2UgYXJlIGhpdHRpbmcgYnVncyBkZXNjcmliZWQgaW46XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvaXNzdWVzLzIyNDBcbiAgICB0aGlzLnRpdGxlVHBsID0gdGhpcy50aXRsZVRwbHMuZmlyc3Q7XG4gICAgdGhpcy5jb250ZW50VHBsID0gdGhpcy5jb250ZW50VHBscy5maXJzdDtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBwYXlsb2FkIG9mIHRoZSBjaGFuZ2UgZXZlbnQgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSB0YWIgY2hhbmdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiVGFiQ2hhbmdlRXZlbnQge1xuICAvKipcbiAgICogSWQgb2YgdGhlIGN1cnJlbnRseSBhY3RpdmUgdGFiXG4gICAqL1xuICBhY3RpdmVJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgbmV3bHkgc2VsZWN0ZWQgdGFiXG4gICAqL1xuICBuZXh0SWQ6IHN0cmluZztcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIHByZXZlbnQgdGFiIHN3aXRjaCBpZiBjYWxsZWRcbiAgICovXG4gIHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuXG4vKipcbiAqIEEgY29tcG9uZW50IHRoYXQgbWFrZXMgaXQgZWFzeSB0byBjcmVhdGUgdGFiYmVkIGludGVyZmFjZS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXRhYnNldCcsXG4gIGV4cG9ydEFzOiAnbmdiVGFic2V0JyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8dWwgW2NsYXNzXT1cIiduYXYgbmF2LScgKyB0eXBlICsgKG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJz8gICcgJyArIGp1c3RpZnlDbGFzcyA6ICcgZmxleC1jb2x1bW4nKVwiIHJvbGU9XCJ0YWJsaXN0XCI+XG4gICAgICA8bGkgY2xhc3M9XCJuYXYtaXRlbVwiICpuZ0Zvcj1cImxldCB0YWIgb2YgdGFic1wiPlxuICAgICAgICA8YSBbaWRdPVwidGFiLmlkXCIgY2xhc3M9XCJuYXYtbGlua1wiIFtjbGFzcy5hY3RpdmVdPVwidGFiLmlkID09PSBhY3RpdmVJZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJ0YWIuZGlzYWJsZWRcIlxuICAgICAgICAgIGhyZWYgKGNsaWNrKT1cIiEhc2VsZWN0KHRhYi5pZClcIiByb2xlPVwidGFiXCIgW2F0dHIudGFiaW5kZXhdPVwiKHRhYi5kaXNhYmxlZCA/ICctMSc6IHVuZGVmaW5lZClcIlxuICAgICAgICAgIFthdHRyLmFyaWEtY29udHJvbHNdPVwiKCFkZXN0cm95T25IaWRlIHx8IHRhYi5pZCA9PT0gYWN0aXZlSWQgPyB0YWIuaWQgKyAnLXBhbmVsJyA6IG51bGwpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cInRhYi5pZCA9PT0gYWN0aXZlSWRcIiBbYXR0ci5hcmlhLWRpc2FibGVkXT1cInRhYi5kaXNhYmxlZFwiPlxuICAgICAgICAgIHt7dGFiLnRpdGxlfX08bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidGFiLnRpdGxlVHBsPy50ZW1wbGF0ZVJlZlwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgPC91bD5cbiAgICA8ZGl2IGNsYXNzPVwidGFiLWNvbnRlbnRcIj5cbiAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtdGFiIFtuZ0Zvck9mXT1cInRhYnNcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzPVwidGFiLXBhbmUge3t0YWIuaWQgPT09IGFjdGl2ZUlkID8gJ2FjdGl2ZScgOiBudWxsfX1cIlxuICAgICAgICAgICpuZ0lmPVwiIWRlc3Ryb3lPbkhpZGUgfHwgdGFiLmlkID09PSBhY3RpdmVJZFwiXG4gICAgICAgICAgcm9sZT1cInRhYnBhbmVsXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwidGFiLmlkXCIgaWQ9XCJ7e3RhYi5pZH19LXBhbmVsXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWV4cGFuZGVkXT1cInRhYi5pZCA9PT0gYWN0aXZlSWRcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidGFiLmNvbnRlbnRUcGw/LnRlbXBsYXRlUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYlRhYnNldCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQge1xuICBqdXN0aWZ5Q2xhc3M6IHN0cmluZztcblxuICBAQ29udGVudENoaWxkcmVuKE5nYlRhYikgdGFiczogUXVlcnlMaXN0PE5nYlRhYj47XG5cbiAgLyoqXG4gICAqIEFuIGlkZW50aWZpZXIgb2YgYW4gaW5pdGlhbGx5IHNlbGVjdGVkIChhY3RpdmUpIHRhYi4gVXNlIHRoZSBcInNlbGVjdFwiIG1ldGhvZCB0byBzd2l0Y2ggYSB0YWIgcHJvZ3JhbW1hdGljYWxseS5cbiAgICovXG4gIEBJbnB1dCgpIGFjdGl2ZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGNsb3NlZCB0YWJzIHNob3VsZCBiZSBoaWRkZW4gd2l0aG91dCBkZXN0cm95aW5nIHRoZW1cbiAgICovXG4gIEBJbnB1dCgpIGRlc3Ryb3lPbkhpZGUgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUaGUgaG9yaXpvbnRhbCBhbGlnbm1lbnQgb2YgdGhlIG5hdiB3aXRoIGZsZXhib3ggdXRpbGl0aWVzLiBDYW4gYmUgb25lIG9mICdzdGFydCcsICdjZW50ZXInLCAnZW5kJywgJ2ZpbGwnIG9yXG4gICAqICdqdXN0aWZpZWQnXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzICdzdGFydCcuXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQganVzdGlmeShjbGFzc05hbWU6ICdzdGFydCcgfCAnY2VudGVyJyB8ICdlbmQnIHwgJ2ZpbGwnIHwgJ2p1c3RpZmllZCcpIHtcbiAgICBpZiAoY2xhc3NOYW1lID09PSAnZmlsbCcgfHwgY2xhc3NOYW1lID09PSAnanVzdGlmaWVkJykge1xuICAgICAgdGhpcy5qdXN0aWZ5Q2xhc3MgPSBgbmF2LSR7Y2xhc3NOYW1lfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuanVzdGlmeUNsYXNzID0gYGp1c3RpZnktY29udGVudC0ke2NsYXNzTmFtZX1gO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgb3JpZW50YXRpb24gb2YgdGhlIG5hdiAoaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCkuXG4gICAqIFRoZSBkZWZhdWx0IHZhbHVlIGlzICdob3Jpem9udGFsJy5cbiAgICovXG4gIEBJbnB1dCgpIG9yaWVudGF0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnO1xuXG4gIC8qKlxuICAgKiBUeXBlIG9mIG5hdmlnYXRpb24gdG8gYmUgdXNlZCBmb3IgdGFicy4gQ2FuIGJlIG9uZSBvZiBCb290c3RyYXAgZGVmaW5lZCB0eXBlcyAoJ3RhYnMnIG9yICdwaWxscycpLlxuICAgKiBTaW5jZSAzLjAuMCBjYW4gYWxzbyBiZSBhbiBhcmJpdHJhcnkgc3RyaW5nIChmb3IgY3VzdG9tIHRoZW1lcykuXG4gICAqL1xuICBASW5wdXQoKSB0eXBlOiAndGFicycgfCAncGlsbHMnIHwgc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIHRhYiBjaGFuZ2UgZXZlbnQgZmlyZWQgcmlnaHQgYmVmb3JlIHRoZSB0YWIgc2VsZWN0aW9uIGhhcHBlbnMuIFNlZSBOZ2JUYWJDaGFuZ2VFdmVudCBmb3IgcGF5bG9hZCBkZXRhaWxzXG4gICAqL1xuICBAT3V0cHV0KCkgdGFiQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JUYWJDaGFuZ2VFdmVudD4oKTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYlRhYnNldENvbmZpZykge1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICAgIHRoaXMuanVzdGlmeSA9IGNvbmZpZy5qdXN0aWZ5O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBjb25maWcub3JpZW50YXRpb247XG4gIH1cblxuICAvKipcbiAgICogU2VsZWN0cyB0aGUgdGFiIHdpdGggdGhlIGdpdmVuIGlkIGFuZCBzaG93cyBpdHMgYXNzb2NpYXRlZCBwYW5lLlxuICAgKiBBbnkgb3RoZXIgdGFiIHRoYXQgd2FzIHByZXZpb3VzbHkgc2VsZWN0ZWQgYmVjb21lcyB1bnNlbGVjdGVkIGFuZCBpdHMgYXNzb2NpYXRlZCBwYW5lIGlzIGhpZGRlbi5cbiAgICovXG4gIHNlbGVjdCh0YWJJZDogc3RyaW5nKSB7XG4gICAgbGV0IHNlbGVjdGVkVGFiID0gdGhpcy5fZ2V0VGFiQnlJZCh0YWJJZCk7XG4gICAgaWYgKHNlbGVjdGVkVGFiICYmICFzZWxlY3RlZFRhYi5kaXNhYmxlZCAmJiB0aGlzLmFjdGl2ZUlkICE9PSBzZWxlY3RlZFRhYi5pZCkge1xuICAgICAgbGV0IGRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcblxuICAgICAgdGhpcy50YWJDaGFuZ2UuZW1pdChcbiAgICAgICAgICB7YWN0aXZlSWQ6IHRoaXMuYWN0aXZlSWQsIG5leHRJZDogc2VsZWN0ZWRUYWIuaWQsIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7IGRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlOyB9fSk7XG5cbiAgICAgIGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUlkID0gc2VsZWN0ZWRUYWIuaWQ7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIGF1dG8tY29ycmVjdCBhY3RpdmVJZCB0aGF0IG1pZ2h0IGhhdmUgYmVlbiBzZXQgaW5jb3JyZWN0bHkgYXMgaW5wdXRcbiAgICBsZXQgYWN0aXZlVGFiID0gdGhpcy5fZ2V0VGFiQnlJZCh0aGlzLmFjdGl2ZUlkKTtcbiAgICB0aGlzLmFjdGl2ZUlkID0gYWN0aXZlVGFiID8gYWN0aXZlVGFiLmlkIDogKHRoaXMudGFicy5sZW5ndGggPyB0aGlzLnRhYnMuZmlyc3QuaWQgOiBudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFRhYkJ5SWQoaWQ6IHN0cmluZyk6IE5nYlRhYiB7XG4gICAgbGV0IHRhYnNXaXRoSWQ6IE5nYlRhYltdID0gdGhpcy50YWJzLmZpbHRlcih0YWIgPT4gdGFiLmlkID09PSBpZCk7XG4gICAgcmV0dXJuIHRhYnNXaXRoSWQubGVuZ3RoID8gdGFic1dpdGhJZFswXSA6IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiVGFic2V0LCBOZ2JUYWIsIE5nYlRhYkNvbnRlbnQsIE5nYlRhYlRpdGxlfSBmcm9tICcuL3RhYnNldCc7XG5cbmV4cG9ydCB7TmdiVGFic2V0LCBOZ2JUYWIsIE5nYlRhYkNvbnRlbnQsIE5nYlRhYlRpdGxlLCBOZ2JUYWJDaGFuZ2VFdmVudH0gZnJvbSAnLi90YWJzZXQnO1xuZXhwb3J0IHtOZ2JUYWJzZXRDb25maWd9IGZyb20gJy4vdGFic2V0LWNvbmZpZyc7XG5cbmNvbnN0IE5HQl9UQUJTRVRfRElSRUNUSVZFUyA9IFtOZ2JUYWJzZXQsIE5nYlRhYiwgTmdiVGFiQ29udGVudCwgTmdiVGFiVGl0bGVdO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogTkdCX1RBQlNFVF9ESVJFQ1RJVkVTLCBleHBvcnRzOiBOR0JfVEFCU0VUX0RJUkVDVElWRVMsIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdfSlcbmV4cG9ydCBjbGFzcyBOZ2JUYWJzZXRNb2R1bGUge1xuICAvKipcbiAgICogSW1wb3J0aW5nIHdpdGggJy5mb3JSb290KCknIGlzIG5vIGxvbmdlciBuZWNlc3NhcnksIHlvdSBjYW4gc2ltcGx5IGltcG9ydCB0aGUgbW9kdWxlLlxuICAgKiBXaWxsIGJlIHJlbW92ZWQgaW4gNC4wLjAuXG4gICAqXG4gICAqIEBkZXByZWNhdGVkIDMuMC4wXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdCgpOiBNb2R1bGVXaXRoUHJvdmlkZXJzIHsgcmV0dXJuIHtuZ01vZHVsZTogTmdiVGFic2V0TW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtpc051bWJlciwgdG9JbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG5leHBvcnQgY2xhc3MgTmdiVGltZSB7XG4gIGhvdXI6IG51bWJlcjtcbiAgbWludXRlOiBudW1iZXI7XG4gIHNlY29uZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGhvdXI/OiBudW1iZXIsIG1pbnV0ZT86IG51bWJlciwgc2Vjb25kPzogbnVtYmVyKSB7XG4gICAgdGhpcy5ob3VyID0gdG9JbnRlZ2VyKGhvdXIpO1xuICAgIHRoaXMubWludXRlID0gdG9JbnRlZ2VyKG1pbnV0ZSk7XG4gICAgdGhpcy5zZWNvbmQgPSB0b0ludGVnZXIoc2Vjb25kKTtcbiAgfVxuXG4gIGNoYW5nZUhvdXIoc3RlcCA9IDEpIHsgdGhpcy51cGRhdGVIb3VyKChpc05hTih0aGlzLmhvdXIpID8gMCA6IHRoaXMuaG91cikgKyBzdGVwKTsgfVxuXG4gIHVwZGF0ZUhvdXIoaG91cjogbnVtYmVyKSB7XG4gICAgaWYgKGlzTnVtYmVyKGhvdXIpKSB7XG4gICAgICB0aGlzLmhvdXIgPSAoaG91ciA8IDAgPyAyNCArIGhvdXIgOiBob3VyKSAlIDI0O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhvdXIgPSBOYU47XG4gICAgfVxuICB9XG5cbiAgY2hhbmdlTWludXRlKHN0ZXAgPSAxKSB7IHRoaXMudXBkYXRlTWludXRlKChpc05hTih0aGlzLm1pbnV0ZSkgPyAwIDogdGhpcy5taW51dGUpICsgc3RlcCk7IH1cblxuICB1cGRhdGVNaW51dGUobWludXRlOiBudW1iZXIpIHtcbiAgICBpZiAoaXNOdW1iZXIobWludXRlKSkge1xuICAgICAgdGhpcy5taW51dGUgPSBtaW51dGUgJSA2MCA8IDAgPyA2MCArIG1pbnV0ZSAlIDYwIDogbWludXRlICUgNjA7XG4gICAgICB0aGlzLmNoYW5nZUhvdXIoTWF0aC5mbG9vcihtaW51dGUgLyA2MCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1pbnV0ZSA9IE5hTjtcbiAgICB9XG4gIH1cblxuICBjaGFuZ2VTZWNvbmQoc3RlcCA9IDEpIHsgdGhpcy51cGRhdGVTZWNvbmQoKGlzTmFOKHRoaXMuc2Vjb25kKSA/IDAgOiB0aGlzLnNlY29uZCkgKyBzdGVwKTsgfVxuXG4gIHVwZGF0ZVNlY29uZChzZWNvbmQ6IG51bWJlcikge1xuICAgIGlmIChpc051bWJlcihzZWNvbmQpKSB7XG4gICAgICB0aGlzLnNlY29uZCA9IHNlY29uZCA8IDAgPyA2MCArIHNlY29uZCAlIDYwIDogc2Vjb25kICUgNjA7XG4gICAgICB0aGlzLmNoYW5nZU1pbnV0ZShNYXRoLmZsb29yKHNlY29uZCAvIDYwKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2Vjb25kID0gTmFOO1xuICAgIH1cbiAgfVxuXG4gIGlzVmFsaWQoY2hlY2tTZWNzID0gdHJ1ZSkge1xuICAgIHJldHVybiBpc051bWJlcih0aGlzLmhvdXIpICYmIGlzTnVtYmVyKHRoaXMubWludXRlKSAmJiAoY2hlY2tTZWNzID8gaXNOdW1iZXIodGhpcy5zZWNvbmQpIDogdHJ1ZSk7XG4gIH1cblxuICB0b1N0cmluZygpIHsgcmV0dXJuIGAke3RoaXMuaG91ciB8fCAwfToke3RoaXMubWludXRlIHx8IDB9OiR7dGhpcy5zZWNvbmQgfHwgMH1gOyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gc2VydmljZSBmb3IgdGhlIE5nYlRpbWVwaWNrZXIgY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIHRpbWVwaWNrZXJzIHVzZWQgaW4gdGhlIGFwcGxpY2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUaW1lcGlja2VyQ29uZmlnIHtcbiAgbWVyaWRpYW4gPSBmYWxzZTtcbiAgc3Bpbm5lcnMgPSB0cnVlO1xuICBzZWNvbmRzID0gZmFsc2U7XG4gIGhvdXJTdGVwID0gMTtcbiAgbWludXRlU3RlcCA9IDE7XG4gIHNlY29uZFN0ZXAgPSAxO1xuICBkaXNhYmxlZCA9IGZhbHNlO1xuICByZWFkb25seUlucHV0cyA9IGZhbHNlO1xuICBzaXplOiAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnID0gJ21lZGl1bSc7XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JUaW1lU3RydWN0fSBmcm9tICcuL25nYi10aW1lLXN0cnVjdCc7XG5pbXBvcnQge2lzSW50ZWdlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBBYnN0cmFjdCB0eXBlIHNlcnZpbmcgYXMgYSBESSB0b2tlbiBmb3IgdGhlIHNlcnZpY2UgY29udmVydGluZyBmcm9tIHlvdXIgYXBwbGljYXRpb24gVGltZSBtb2RlbCB0byBpbnRlcm5hbFxuICogTmdiVGltZVN0cnVjdCBtb2RlbC5cbiAqIEEgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjb252ZXJ0aW5nIGZyb20gYW5kIHRvIE5nYlRpbWVTdHJ1Y3QgaXMgcHJvdmlkZWQgZm9yIHJldHJvLWNvbXBhdGliaWxpdHksXG4gKiBidXQgeW91IGNhbiBwcm92aWRlIGFub3RoZXIgaW1wbGVtZW50YXRpb24gdG8gdXNlIGFuIGFsdGVybmF0aXZlIGZvcm1hdCwgaWUgZm9yIHVzaW5nIHdpdGggbmF0aXZlIERhdGUgT2JqZWN0LlxuICpcbiAqIEBzaW5jZSAyLjIuMFxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTmdiVGltZUFkYXB0ZXI8VD4ge1xuICAvKipcbiAgICogQ29udmVydHMgdXNlci1tb2RlbCBkYXRlIGludG8gYW4gTmdiVGltZVN0cnVjdCBmb3IgaW50ZXJuYWwgdXNlIGluIHRoZSBsaWJyYXJ5XG4gICAqL1xuICBhYnN0cmFjdCBmcm9tTW9kZWwodmFsdWU6IFQpOiBOZ2JUaW1lU3RydWN0O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBpbnRlcm5hbCB0aW1lIHZhbHVlIE5nYlRpbWVTdHJ1Y3QgdG8gdXNlci1tb2RlbCBkYXRlXG4gICAqIFRoZSByZXR1cm5lZCB0eXBlIGlzIHN1cHBvc2VkIHRvIGJlIG9mIHRoZSBzYW1lIHR5cGUgYXMgZnJvbU1vZGVsKCkgaW5wdXQtdmFsdWUgcGFyYW1cbiAgICovXG4gIGFic3RyYWN0IHRvTW9kZWwodGltZTogTmdiVGltZVN0cnVjdCk6IFQ7XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JUaW1lU3RydWN0QWRhcHRlciBleHRlbmRzIE5nYlRpbWVBZGFwdGVyPE5nYlRpbWVTdHJ1Y3Q+IHtcbiAgLyoqXG4gICAqIENvbnZlcnRzIGEgTmdiVGltZVN0cnVjdCB2YWx1ZSBpbnRvIE5nYlRpbWVTdHJ1Y3QgdmFsdWVcbiAgICovXG4gIGZyb21Nb2RlbCh0aW1lOiBOZ2JUaW1lU3RydWN0KTogTmdiVGltZVN0cnVjdCB7XG4gICAgcmV0dXJuICh0aW1lICYmIGlzSW50ZWdlcih0aW1lLmhvdXIpICYmIGlzSW50ZWdlcih0aW1lLm1pbnV0ZSkpID9cbiAgICAgICAge2hvdXI6IHRpbWUuaG91ciwgbWludXRlOiB0aW1lLm1pbnV0ZSwgc2Vjb25kOiBpc0ludGVnZXIodGltZS5zZWNvbmQpID8gdGltZS5zZWNvbmQgOiBudWxsfSA6XG4gICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JUaW1lU3RydWN0IHZhbHVlIGludG8gTmdiVGltZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgdG9Nb2RlbCh0aW1lOiBOZ2JUaW1lU3RydWN0KTogTmdiVGltZVN0cnVjdCB7XG4gICAgcmV0dXJuICh0aW1lICYmIGlzSW50ZWdlcih0aW1lLmhvdXIpICYmIGlzSW50ZWdlcih0aW1lLm1pbnV0ZSkpID9cbiAgICAgICAge2hvdXI6IHRpbWUuaG91ciwgbWludXRlOiB0aW1lLm1pbnV0ZSwgc2Vjb25kOiBpc0ludGVnZXIodGltZS5zZWNvbmQpID8gdGltZS5zZWNvbmQgOiBudWxsfSA6XG4gICAgICAgIG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCB7Q29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7aXNOdW1iZXIsIHBhZE51bWJlciwgdG9JbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JUaW1lfSBmcm9tICcuL25nYi10aW1lJztcbmltcG9ydCB7TmdiVGltZXBpY2tlckNvbmZpZ30gZnJvbSAnLi90aW1lcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQge05nYlRpbWVBZGFwdGVyfSBmcm9tICcuL25nYi10aW1lLWFkYXB0ZXInO1xuXG5jb25zdCBOR0JfVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYlRpbWVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0ICYgY29uZmlndXJhYmxlIHRpbWVwaWNrZXIgZGlyZWN0aXZlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdGltZXBpY2tlcicsXG4gIHN0eWxlczogW2BcblxuICAgIDpob3N0IHtcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICB9XG5cbiAgICAubmdiLXRwIHtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgIC5uZ2ItdHAtaW5wdXQtY29udGFpbmVyIHtcbiAgICAgIHdpZHRoOiA0ZW07XG4gICAgfVxuXG4gICAgLm5nYi10cC1ob3VyLCAubmdiLXRwLW1pbnV0ZSwgLm5nYi10cC1zZWNvbmQsIC5uZ2ItdHAtbWVyaWRpYW4ge1xuICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgLW1zLWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAtbXMtZmxleC1wYWNrOiBkaXN0cmlidXRlO1xuICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgfVxuXG4gICAgLm5nYi10cC1zcGFjZXIge1xuICAgICAgd2lkdGg6IDFlbTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAuY2hldnJvbjo6YmVmb3JlIHtcbiAgICAgIGJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgICBib3JkZXItd2lkdGg6IDAuMjllbSAwLjI5ZW0gMCAwO1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBoZWlnaHQ6IDAuNjllbTtcbiAgICAgIGxlZnQ6IDAuMDVlbTtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIHRvcDogMC4xNWVtO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKTtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKTtcbiAgICAgIC1tcy10cmFuc2Zvcm06IHJvdGF0ZSgtNDVkZWcpO1xuICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgIHdpZHRoOiAwLjcxZW07XG4gICAgfVxuXG4gICAgLmNoZXZyb24uYm90dG9tOmJlZm9yZSB7XG4gICAgICB0b3A6IC0uM2VtO1xuICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgxMzVkZWcpO1xuICAgICAgLW1zLXRyYW5zZm9ybTogcm90YXRlKDEzNWRlZyk7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxMzVkZWcpO1xuICAgIH1cblxuICAgIGlucHV0IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxmaWVsZHNldCBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItdHBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLWhvdXJcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbbmdDbGFzc109XCJzZXRCdXR0b25TaXplKClcIiAoY2xpY2spPVwiY2hhbmdlSG91cihob3VyU3RlcClcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtaG91cnNcIj5JbmNyZW1lbnQgaG91cnM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBbbmdDbGFzc109XCJzZXRGb3JtQ29udHJvbFNpemUoKVwiIG1heGxlbmd0aD1cIjJcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJISFwiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLkhIXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRIb3VyKG1vZGVsPy5ob3VyKVwiIChjaGFuZ2UpPVwidXBkYXRlSG91cigkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiSG91cnNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLmhvdXJzXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW25nQ2xhc3NdPVwic2V0QnV0dG9uU2l6ZSgpXCIgKGNsaWNrKT1cImNoYW5nZUhvdXIoLWhvdXJTdGVwKVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBib3R0b21cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5kZWNyZW1lbnQtaG91cnNcIj5EZWNyZW1lbnQgaG91cnM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmdiLXRwLXNwYWNlclwiPjo8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLW1pbnV0ZVwiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiIFtuZ0NsYXNzXT1cInNldEJ1dHRvblNpemUoKVwiIChjbGljayk9XCJjaGFuZ2VNaW51dGUobWludXRlU3RlcClcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtbWludXRlc1wiPkluY3JlbWVudCBtaW51dGVzPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgW25nQ2xhc3NdPVwic2V0Rm9ybUNvbnRyb2xTaXplKClcIiBtYXhsZW5ndGg9XCIyXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTU1cIiBpMThuLXBsYWNlaG9sZGVyPVwiQEBuZ2IudGltZXBpY2tlci5NTVwiXG4gICAgICAgICAgICBbdmFsdWVdPVwiZm9ybWF0TWluU2VjKG1vZGVsPy5taW51dGUpXCIgKGNoYW5nZSk9XCJ1cGRhdGVNaW51dGUoJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAgICAgICAgICAgW3JlYWRvbmx5XT1cInJlYWRvbmx5SW5wdXRzXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIk1pbnV0ZXNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLm1pbnV0ZXNcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbbmdDbGFzc109XCJzZXRCdXR0b25TaXplKClcIiAoY2xpY2spPVwiY2hhbmdlTWludXRlKC1taW51dGVTdGVwKVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBib3R0b21cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiAgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuZGVjcmVtZW50LW1pbnV0ZXNcIj5EZWNyZW1lbnQgbWludXRlczwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJzZWNvbmRzXCIgY2xhc3M9XCJuZ2ItdHAtc3BhY2VyXCI+OjwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2Vjb25kc1wiIGNsYXNzPVwibmdiLXRwLWlucHV0LWNvbnRhaW5lciBuZ2ItdHAtc2Vjb25kXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW25nQ2xhc3NdPVwic2V0QnV0dG9uU2l6ZSgpXCIgKGNsaWNrKT1cImNoYW5nZVNlY29uZChzZWNvbmRTdGVwKVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmluY3JlbWVudC1zZWNvbmRzXCI+SW5jcmVtZW50IHNlY29uZHM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBbbmdDbGFzc109XCJzZXRGb3JtQ29udHJvbFNpemUoKVwiIG1heGxlbmd0aD1cIjJcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTU1wiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLlNTXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRNaW5TZWMobW9kZWw/LnNlY29uZClcIiAoY2hhbmdlKT1cInVwZGF0ZVNlY29uZCgkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiU2Vjb25kc1wiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnRpbWVwaWNrZXIuc2Vjb25kc1wiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiIFtuZ0NsYXNzXT1cInNldEJ1dHRvblNpemUoKVwiIChjbGljayk9XCJjaGFuZ2VTZWNvbmQoLXNlY29uZFN0ZXApXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGV2cm9uIGJvdHRvbVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmRlY3JlbWVudC1zZWNvbmRzXCI+RGVjcmVtZW50IHNlY29uZHM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwibWVyaWRpYW5cIiBjbGFzcz1cIm5nYi10cC1zcGFjZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cIm1lcmlkaWFuXCIgY2xhc3M9XCJuZ2ItdHAtbWVyaWRpYW5cIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XCIgW25nQ2xhc3NdPVwic2V0QnV0dG9uU2l6ZSgpXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlTWVyaWRpYW4oKVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm1vZGVsPy5ob3VyID49IDEyOyBlbHNlIGFtXCIgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuUE1cIj5QTTwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNhbSBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5BTVwiPkFNPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgLFxuICBwcm92aWRlcnM6IFtOR0JfVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiVGltZXBpY2tlciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBtb2RlbDogTmdiVGltZTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNwbGF5IDEySCBvciAyNEggbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpIG1lcmlkaWFuOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgdGhlIHNwaW5uZXJzIGFib3ZlIGFuZCBiZWxvdyB0aGUgaW5wdXRzLlxuICAgKi9cbiAgQElucHV0KCkgc3Bpbm5lcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSBzZWNvbmRzIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCkgc2Vjb25kczogYm9vbGVhbjtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIGhvdXJzIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHdoZW4gdXNpbmcgYSBidXR0b24uXG4gICAqL1xuICBASW5wdXQoKSBob3VyU3RlcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgbWludXRlcyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB3aGVuIHVzaW5nIGEgYnV0dG9uLlxuICAgKi9cbiAgQElucHV0KCkgbWludXRlU3RlcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2Ygc2Vjb25kcyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB3aGVuIHVzaW5nIGEgYnV0dG9uLlxuICAgKi9cbiAgQElucHV0KCkgc2Vjb25kU3RlcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUbyBtYWtlIHRpbWVwaWNrZXIgcmVhZG9ubHlcbiAgICovXG4gIEBJbnB1dCgpIHJlYWRvbmx5SW5wdXRzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUbyBzZXQgdGhlIHNpemUgb2YgdGhlIGlucHV0cyBhbmQgYnV0dG9uXG4gICAqL1xuICBASW5wdXQoKSBzaXplOiAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiVGltZXBpY2tlckNvbmZpZywgcHJpdmF0ZSBfbmdiVGltZUFkYXB0ZXI6IE5nYlRpbWVBZGFwdGVyPGFueT4pIHtcbiAgICB0aGlzLm1lcmlkaWFuID0gY29uZmlnLm1lcmlkaWFuO1xuICAgIHRoaXMuc3Bpbm5lcnMgPSBjb25maWcuc3Bpbm5lcnM7XG4gICAgdGhpcy5zZWNvbmRzID0gY29uZmlnLnNlY29uZHM7XG4gICAgdGhpcy5ob3VyU3RlcCA9IGNvbmZpZy5ob3VyU3RlcDtcbiAgICB0aGlzLm1pbnV0ZVN0ZXAgPSBjb25maWcubWludXRlU3RlcDtcbiAgICB0aGlzLnNlY29uZFN0ZXAgPSBjb25maWcuc2Vjb25kU3RlcDtcbiAgICB0aGlzLmRpc2FibGVkID0gY29uZmlnLmRpc2FibGVkO1xuICAgIHRoaXMucmVhZG9ubHlJbnB1dHMgPSBjb25maWcucmVhZG9ubHlJbnB1dHM7XG4gICAgdGhpcy5zaXplID0gY29uZmlnLnNpemU7XG4gIH1cblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgY29uc3Qgc3RydWN0VmFsdWUgPSB0aGlzLl9uZ2JUaW1lQWRhcHRlci5mcm9tTW9kZWwodmFsdWUpO1xuICAgIHRoaXMubW9kZWwgPSBzdHJ1Y3RWYWx1ZSA/IG5ldyBOZ2JUaW1lKHN0cnVjdFZhbHVlLmhvdXIsIHN0cnVjdFZhbHVlLm1pbnV0ZSwgc3RydWN0VmFsdWUuc2Vjb25kKSA6IG5ldyBOZ2JUaW1lKCk7XG4gICAgaWYgKCF0aGlzLnNlY29uZHMgJiYgKCFzdHJ1Y3RWYWx1ZSB8fCAhaXNOdW1iZXIoc3RydWN0VmFsdWUuc2Vjb25kKSkpIHtcbiAgICAgIHRoaXMubW9kZWwuc2Vjb25kID0gMDtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikgeyB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDsgfVxuXG4gIGNoYW5nZUhvdXIoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5tb2RlbC5jaGFuZ2VIb3VyKHN0ZXApO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIGNoYW5nZU1pbnV0ZShzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLm1vZGVsLmNoYW5nZU1pbnV0ZShzdGVwKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICBjaGFuZ2VTZWNvbmQoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5tb2RlbC5jaGFuZ2VTZWNvbmQoc3RlcCk7XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgdXBkYXRlSG91cihuZXdWYWw6IHN0cmluZykge1xuICAgIGNvbnN0IGlzUE0gPSB0aGlzLm1vZGVsLmhvdXIgPj0gMTI7XG4gICAgY29uc3QgZW50ZXJlZEhvdXIgPSB0b0ludGVnZXIobmV3VmFsKTtcbiAgICBpZiAodGhpcy5tZXJpZGlhbiAmJiAoaXNQTSAmJiBlbnRlcmVkSG91ciA8IDEyIHx8ICFpc1BNICYmIGVudGVyZWRIb3VyID09PSAxMikpIHtcbiAgICAgIHRoaXMubW9kZWwudXBkYXRlSG91cihlbnRlcmVkSG91ciArIDEyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb2RlbC51cGRhdGVIb3VyKGVudGVyZWRIb3VyKTtcbiAgICB9XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgdXBkYXRlTWludXRlKG5ld1ZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5tb2RlbC51cGRhdGVNaW51dGUodG9JbnRlZ2VyKG5ld1ZhbCkpO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIHVwZGF0ZVNlY29uZChuZXdWYWw6IHN0cmluZykge1xuICAgIHRoaXMubW9kZWwudXBkYXRlU2Vjb25kKHRvSW50ZWdlcihuZXdWYWwpKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICB0b2dnbGVNZXJpZGlhbigpIHtcbiAgICBpZiAodGhpcy5tZXJpZGlhbikge1xuICAgICAgdGhpcy5jaGFuZ2VIb3VyKDEyKTtcbiAgICB9XG4gIH1cblxuICBmb3JtYXRIb3VyKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICBpZiAodGhpcy5tZXJpZGlhbikge1xuICAgICAgICByZXR1cm4gcGFkTnVtYmVyKHZhbHVlICUgMTIgPT09IDAgPyAxMiA6IHZhbHVlICUgMTIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhZE51bWJlcih2YWx1ZSAlIDI0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhZE51bWJlcihOYU4pO1xuICAgIH1cbiAgfVxuXG4gIGZvcm1hdE1pblNlYyh2YWx1ZTogbnVtYmVyKSB7IHJldHVybiBwYWROdW1iZXIodmFsdWUpOyB9XG5cbiAgc2V0Rm9ybUNvbnRyb2xTaXplKCkgeyByZXR1cm4geydmb3JtLWNvbnRyb2wtc20nOiB0aGlzLnNpemUgPT09ICdzbWFsbCcsICdmb3JtLWNvbnRyb2wtbGcnOiB0aGlzLnNpemUgPT09ICdsYXJnZSd9OyB9XG5cbiAgc2V0QnV0dG9uU2l6ZSgpIHsgcmV0dXJuIHsnYnRuLXNtJzogdGhpcy5zaXplID09PSAnc21hbGwnLCAnYnRuLWxnJzogdGhpcy5zaXplID09PSAnbGFyZ2UnfTsgfVxuXG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydzZWNvbmRzJ10gJiYgIXRoaXMuc2Vjb25kcyAmJiB0aGlzLm1vZGVsICYmICFpc051bWJlcih0aGlzLm1vZGVsLnNlY29uZCkpIHtcbiAgICAgIHRoaXMubW9kZWwuc2Vjb25kID0gMDtcbiAgICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcHJvcGFnYXRlTW9kZWxDaGFuZ2UodG91Y2hlZCA9IHRydWUpIHtcbiAgICBpZiAodG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kZWwuaXNWYWxpZCh0aGlzLnNlY29uZHMpKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKFxuICAgICAgICAgIHRoaXMuX25nYlRpbWVBZGFwdGVyLnRvTW9kZWwoe2hvdXI6IHRoaXMubW9kZWwuaG91ciwgbWludXRlOiB0aGlzLm1vZGVsLm1pbnV0ZSwgc2Vjb25kOiB0aGlzLm1vZGVsLnNlY29uZH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLl9uZ2JUaW1lQWRhcHRlci50b01vZGVsKG51bGwpKTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7TmdNb2R1bGUsIE1vZHVsZVdpdGhQcm92aWRlcnN9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb21tb25Nb2R1bGV9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7TmdiVGltZXBpY2tlcn0gZnJvbSAnLi90aW1lcGlja2VyJztcbmltcG9ydCB7TmdiVGltZUFkYXB0ZXIsIE5nYlRpbWVTdHJ1Y3RBZGFwdGVyfSBmcm9tICcuL25nYi10aW1lLWFkYXB0ZXInO1xuXG5leHBvcnQge05nYlRpbWVwaWNrZXJ9IGZyb20gJy4vdGltZXBpY2tlcic7XG5leHBvcnQge05nYlRpbWVwaWNrZXJDb25maWd9IGZyb20gJy4vdGltZXBpY2tlci1jb25maWcnO1xuZXhwb3J0IHtOZ2JUaW1lU3RydWN0fSBmcm9tICcuL25nYi10aW1lLXN0cnVjdCc7XG5leHBvcnQge05nYlRpbWVBZGFwdGVyfSBmcm9tICcuL25nYi10aW1lLWFkYXB0ZXInO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtOZ2JUaW1lcGlja2VyXSxcbiAgZXhwb3J0czogW05nYlRpbWVwaWNrZXJdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IE5nYlRpbWVBZGFwdGVyLCB1c2VDbGFzczogTmdiVGltZVN0cnVjdEFkYXB0ZXJ9XVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JUaW1lcGlja2VyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYlRpbWVwaWNrZXJNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge0luamVjdGFibGV9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBzZXJ2aWNlIGZvciB0aGUgTmdiVG9vbHRpcCBkaXJlY3RpdmUuXG4gKiBZb3UgY2FuIGluamVjdCB0aGlzIHNlcnZpY2UsIHR5cGljYWxseSBpbiB5b3VyIHJvb3QgY29tcG9uZW50LCBhbmQgY3VzdG9taXplIHRoZSB2YWx1ZXMgb2YgaXRzIHByb3BlcnRpZXMgaW5cbiAqIG9yZGVyIHRvIHByb3ZpZGUgZGVmYXVsdCB2YWx1ZXMgZm9yIGFsbCB0aGUgdG9vbHRpcHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlRvb2x0aXBDb25maWcge1xuICBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJyA9IHRydWU7XG4gIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAndG9wJztcbiAgdHJpZ2dlcnMgPSAnaG92ZXInO1xuICBjb250YWluZXI6IHN0cmluZztcbiAgZGlzYWJsZVRvb2x0aXAgPSBmYWxzZTtcbn1cbiIsImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgRGlyZWN0aXZlLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxuICBFdmVudEVtaXR0ZXIsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBPbkluaXQsXG4gIE9uRGVzdHJveSxcbiAgSW5qZWN0LFxuICBJbmplY3RvcixcbiAgUmVuZGVyZXIyLFxuICBDb21wb25lbnRSZWYsXG4gIEVsZW1lbnRSZWYsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE5nWm9uZVxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DVU1FTlR9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7ZnJvbUV2ZW50LCByYWNlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtsaXN0ZW5Ub1RyaWdnZXJzfSBmcm9tICcuLi91dGlsL3RyaWdnZXJzJztcbmltcG9ydCB7cG9zaXRpb25FbGVtZW50cywgUGxhY2VtZW50LCBQbGFjZW1lbnRBcnJheX0gZnJvbSAnLi4vdXRpbC9wb3NpdGlvbmluZyc7XG5pbXBvcnQge1BvcHVwU2VydmljZX0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuXG5pbXBvcnQge05nYlRvb2x0aXBDb25maWd9IGZyb20gJy4vdG9vbHRpcC1jb25maWcnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLXRvb2x0aXAtd2luZG93JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzXSc6ICdcInRvb2x0aXAgc2hvdyBicy10b29sdGlwLVwiICsgcGxhY2VtZW50LnNwbGl0KFwiLVwiKVswXStcIiBicy10b29sdGlwLVwiICsgcGxhY2VtZW50JyxcbiAgICAncm9sZSc6ICd0b29sdGlwJyxcbiAgICAnW2lkXSc6ICdpZCdcbiAgfSxcbiAgdGVtcGxhdGU6IGA8ZGl2IGNsYXNzPVwiYXJyb3dcIj48L2Rpdj48ZGl2IGNsYXNzPVwidG9vbHRpcC1pbm5lclwiPjxuZy1jb250ZW50PjwvbmctY29udGVudD48L2Rpdj5gLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3QuYnMtdG9vbHRpcC10b3AgLmFycm93LCA6aG9zdC5icy10b29sdGlwLWJvdHRvbSAuYXJyb3cge1xuICAgICAgbGVmdDogY2FsYyg1MCUgLSAwLjRyZW0pO1xuICAgIH1cblxuICAgIDpob3N0LmJzLXRvb2x0aXAtdG9wLWxlZnQgLmFycm93LCA6aG9zdC5icy10b29sdGlwLWJvdHRvbS1sZWZ0IC5hcnJvdyB7XG4gICAgICBsZWZ0OiAxZW07XG4gICAgfVxuXG4gICAgOmhvc3QuYnMtdG9vbHRpcC10b3AtcmlnaHQgLmFycm93LCA6aG9zdC5icy10b29sdGlwLWJvdHRvbS1yaWdodCAuYXJyb3cge1xuICAgICAgbGVmdDogYXV0bztcbiAgICAgIHJpZ2h0OiAwLjhyZW07XG4gICAgfVxuXG4gICAgOmhvc3QuYnMtdG9vbHRpcC1sZWZ0IC5hcnJvdywgOmhvc3QuYnMtdG9vbHRpcC1yaWdodCAuYXJyb3cge1xuICAgICAgdG9wOiBjYWxjKDUwJSAtIDAuNHJlbSk7XG4gICAgfVxuXG4gICAgOmhvc3QuYnMtdG9vbHRpcC1sZWZ0LXRvcCAuYXJyb3csIDpob3N0LmJzLXRvb2x0aXAtcmlnaHQtdG9wIC5hcnJvdyB7XG4gICAgICB0b3A6IDAuNHJlbTtcbiAgICB9XG5cbiAgICA6aG9zdC5icy10b29sdGlwLWxlZnQtYm90dG9tIC5hcnJvdywgOmhvc3QuYnMtdG9vbHRpcC1yaWdodC1ib3R0b20gLmFycm93IHtcbiAgICAgIHRvcDogYXV0bztcbiAgICAgIGJvdHRvbTogMC40cmVtO1xuICAgIH1cbiAgYF1cbn0pXG5leHBvcnQgY2xhc3MgTmdiVG9vbHRpcFdpbmRvdyB7XG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50ID0gJ3RvcCc7XG4gIEBJbnB1dCgpIGlkOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfZWxlbWVudDogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIpIHt9XG5cbiAgYXBwbHlQbGFjZW1lbnQoX3BsYWNlbWVudDogUGxhY2VtZW50KSB7XG4gICAgLy8gcmVtb3ZlIHRoZSBjdXJyZW50IHBsYWNlbWVudCBjbGFzc2VzXG4gICAgdGhpcy5fcmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LCAnYnMtdG9vbHRpcC0nICsgdGhpcy5wbGFjZW1lbnQudG9TdHJpbmcoKS5zcGxpdCgnLScpWzBdKTtcbiAgICB0aGlzLl9yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdicy10b29sdGlwLScgKyB0aGlzLnBsYWNlbWVudC50b1N0cmluZygpKTtcblxuICAgIC8vIHNldCB0aGUgbmV3IHBsYWNlbWVudCBjbGFzc2VzXG4gICAgdGhpcy5wbGFjZW1lbnQgPSBfcGxhY2VtZW50O1xuXG4gICAgLy8gYXBwbHkgdGhlIG5ldyBwbGFjZW1lbnRcbiAgICB0aGlzLl9yZW5kZXJlci5hZGRDbGFzcyh0aGlzLl9lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdicy10b29sdGlwLScgKyB0aGlzLnBsYWNlbWVudC50b1N0cmluZygpLnNwbGl0KCctJylbMF0pO1xuICAgIHRoaXMuX3JlbmRlcmVyLmFkZENsYXNzKHRoaXMuX2VsZW1lbnQubmF0aXZlRWxlbWVudCwgJ2JzLXRvb2x0aXAtJyArIHRoaXMucGxhY2VtZW50LnRvU3RyaW5nKCkpO1xuICB9XG4gIC8qKlxuICAgKiBUZWxscyB3aGV0aGVyIHRoZSBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQgZnJvbSB0aGlzIGNvbXBvbmVudCdzIHN1YnRyZWUgb3Igbm90LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnQgdGhlIGV2ZW50IHRvIGNoZWNrXG4gICAqXG4gICAqIEByZXR1cm4gd2hldGhlciB0aGUgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGZyb20gdGhpcyBjb21wb25lbnQncyBzdWJ0cmVlIG9yIG5vdC5cbiAgICovXG4gIGlzRXZlbnRGcm9tKGV2ZW50OiBFdmVudCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5fZWxlbWVudC5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7IH1cbn1cblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0LCBleHRlbnNpYmxlIGRpcmVjdGl2ZSBmb3IgZmFuY3kgdG9vbHRpcCBjcmVhdGlvbi5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdiVG9vbHRpcF0nLCBleHBvcnRBczogJ25nYlRvb2x0aXAnfSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAvKipcbiAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHRvb2x0aXAgc2hvdWxkIGJlIGNsb3NlZCBvbiBFc2NhcGUga2V5IGFuZCBpbnNpZGUvb3V0c2lkZSBjbGlja3MuXG4gICAqXG4gICAqIC0gdHJ1ZSAoZGVmYXVsdCk6IGNsb3NlcyBvbiBib3RoIG91dHNpZGUgYW5kIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtIGZhbHNlOiBkaXNhYmxlcyB0aGUgYXV0b0Nsb3NlIGZlYXR1cmUgKE5COiB0cmlnZ2VycyBzdGlsbCBhcHBseSlcbiAgICogLSAnaW5zaWRlJzogY2xvc2VzIG9uIGluc2lkZSBjbGlja3MgYXMgd2VsbCBhcyBFc2NhcGUgcHJlc3Nlc1xuICAgKiAtICdvdXRzaWRlJzogY2xvc2VzIG9uIG91dHNpZGUgY2xpY2tzIChzb21ldGltZXMgYWxzbyBhY2hpZXZhYmxlIHRocm91Z2ggdHJpZ2dlcnMpXG4gICAqIGFzIHdlbGwgYXMgRXNjYXBlIHByZXNzZXNcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJztcbiAgLyoqXG4gICAgKiBQbGFjZW1lbnQgb2YgYSB0b29sdGlwIGFjY2VwdHM6XG4gICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICAqICAgIFwibGVmdFwiLCBcImxlZnQtdG9wXCIsIFwibGVmdC1ib3R0b21cIiwgXCJyaWdodFwiLCBcInJpZ2h0LXRvcFwiLCBcInJpZ2h0LWJvdHRvbVwiXG4gICAgKiBhbmQgYXJyYXkgb2YgYWJvdmUgdmFsdWVzLlxuICAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXk7XG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgZXZlbnRzIHRoYXQgc2hvdWxkIHRyaWdnZXIuIFN1cHBvcnRzIGEgc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgbmFtZXMuXG4gICAqL1xuICBASW5wdXQoKSB0cmlnZ2Vyczogc3RyaW5nO1xuICAvKipcbiAgICogQSBzZWxlY3RvciBzcGVjaWZ5aW5nIHRoZSBlbGVtZW50IHRoZSB0b29sdGlwIHNob3VsZCBiZSBhcHBlbmRlZCB0by5cbiAgICogQ3VycmVudGx5IG9ubHkgc3VwcG9ydHMgXCJib2R5XCIuXG4gICAqL1xuICBASW5wdXQoKSBjb250YWluZXI6IHN0cmluZztcbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIGEgZ2l2ZW4gdG9vbHRpcCBpcyBkaXNhYmxlZCBhbmQgc2hvdWxkIG5vdCBiZSBkaXNwbGF5ZWQuXG4gICAqXG4gICAqIEBzaW5jZSAxLjEuMFxuICAgKi9cbiAgQElucHV0KCkgZGlzYWJsZVRvb2x0aXA6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSB0b29sdGlwIGlzIHNob3duXG4gICAqL1xuICBAT3V0cHV0KCkgc2hvd24gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIC8qKlxuICAgKiBFbWl0cyBhbiBldmVudCB3aGVuIHRoZSB0b29sdGlwIGlzIGhpZGRlblxuICAgKi9cbiAgQE91dHB1dCgpIGhpZGRlbiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICBwcml2YXRlIF9uZ2JUb29sdGlwOiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+O1xuICBwcml2YXRlIF9uZ2JUb29sdGlwV2luZG93SWQgPSBgbmdiLXRvb2x0aXAtJHtuZXh0SWQrK31gO1xuICBwcml2YXRlIF9wb3B1cFNlcnZpY2U6IFBvcHVwU2VydmljZTxOZ2JUb29sdGlwV2luZG93PjtcbiAgcHJpdmF0ZSBfd2luZG93UmVmOiBDb21wb25lbnRSZWY8TmdiVG9vbHRpcFdpbmRvdz47XG4gIHByaXZhdGUgX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbjtcbiAgcHJpdmF0ZSBfem9uZVN1YnNjcmlwdGlvbjogYW55O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfZWxlbWVudFJlZjogRWxlbWVudFJlZjxIVE1MRWxlbWVudD4sIHByaXZhdGUgX3JlbmRlcmVyOiBSZW5kZXJlcjIsIGluamVjdG9yOiBJbmplY3RvcixcbiAgICAgIGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLCB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBjb25maWc6IE5nYlRvb2x0aXBDb25maWcsXG4gICAgICBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSwgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSkge1xuICAgIHRoaXMuYXV0b0Nsb3NlID0gY29uZmlnLmF1dG9DbG9zZTtcbiAgICB0aGlzLnBsYWNlbWVudCA9IGNvbmZpZy5wbGFjZW1lbnQ7XG4gICAgdGhpcy50cmlnZ2VycyA9IGNvbmZpZy50cmlnZ2VycztcbiAgICB0aGlzLmNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXI7XG4gICAgdGhpcy5kaXNhYmxlVG9vbHRpcCA9IGNvbmZpZy5kaXNhYmxlVG9vbHRpcDtcbiAgICB0aGlzLl9wb3B1cFNlcnZpY2UgPSBuZXcgUG9wdXBTZXJ2aWNlPE5nYlRvb2x0aXBXaW5kb3c+KFxuICAgICAgICBOZ2JUb29sdGlwV2luZG93LCBpbmplY3Rvciwgdmlld0NvbnRhaW5lclJlZiwgX3JlbmRlcmVyLCBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IF9uZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGlmICh0aGlzLl93aW5kb3dSZWYpIHtcbiAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmFwcGx5UGxhY2VtZW50KFxuICAgICAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX3dpbmRvd1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLnBsYWNlbWVudCxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udGVudCB0byBiZSBkaXNwbGF5ZWQgYXMgdG9vbHRpcC4gSWYgZmFsc3ksIHRoZSB0b29sdGlwIHdvbid0IG9wZW4uXG4gICAqL1xuICBASW5wdXQoKVxuICBzZXQgbmdiVG9vbHRpcCh2YWx1ZTogc3RyaW5nIHwgVGVtcGxhdGVSZWY8YW55Pikge1xuICAgIHRoaXMuX25nYlRvb2x0aXAgPSB2YWx1ZTtcbiAgICBpZiAoIXZhbHVlICYmIHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuZ2JUb29sdGlwKCkgeyByZXR1cm4gdGhpcy5fbmdiVG9vbHRpcDsgfVxuXG4gIC8qKlxuICAgKiBPcGVucyBhbiBlbGVtZW50w6LCgMKZcyB0b29sdGlwLiBUaGlzIGlzIGNvbnNpZGVyZWQgYSDDosKAwpxtYW51YWzDosKAwp0gdHJpZ2dlcmluZyBvZiB0aGUgdG9vbHRpcC5cbiAgICogVGhlIGNvbnRleHQgaXMgYW4gb3B0aW9uYWwgdmFsdWUgdG8gYmUgaW5qZWN0ZWQgaW50byB0aGUgdG9vbHRpcCB0ZW1wbGF0ZSB3aGVuIGl0IGlzIGNyZWF0ZWQuXG4gICAqL1xuICBvcGVuKGNvbnRleHQ/OiBhbnkpIHtcbiAgICBpZiAoIXRoaXMuX3dpbmRvd1JlZiAmJiB0aGlzLl9uZ2JUb29sdGlwICYmICF0aGlzLmRpc2FibGVUb29sdGlwKSB7XG4gICAgICB0aGlzLl93aW5kb3dSZWYgPSB0aGlzLl9wb3B1cFNlcnZpY2Uub3Blbih0aGlzLl9uZ2JUb29sdGlwLCBjb250ZXh0KTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5pZCA9IHRoaXMuX25nYlRvb2x0aXBXaW5kb3dJZDtcblxuICAgICAgdGhpcy5fcmVuZGVyZXIuc2V0QXR0cmlidXRlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FyaWEtZGVzY3JpYmVkYnknLCB0aGlzLl9uZ2JUb29sdGlwV2luZG93SWQpO1xuXG4gICAgICBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgICB0aGlzLl9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMuY29udGFpbmVyKS5hcHBlbmRDaGlsZCh0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5wbGFjZW1lbnQgPSBBcnJheS5pc0FycmF5KHRoaXMucGxhY2VtZW50KSA/IHRoaXMucGxhY2VtZW50WzBdIDogdGhpcy5wbGFjZW1lbnQ7XG5cbiAgICAgIC8vIGFwcGx5IHN0eWxpbmcgdG8gc2V0IGJhc2ljIGNzcy1jbGFzc2VzIG9uIHRhcmdldCBlbGVtZW50LCBiZWZvcmUgZ29pbmcgZm9yIHBvc2l0aW9uaW5nXG4gICAgICB0aGlzLl93aW5kb3dSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuXG4gICAgICAvLyBwb3NpdGlvbiB0b29sdGlwIGFsb25nIHRoZSBlbGVtZW50XG4gICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuYXBwbHlQbGFjZW1lbnQoXG4gICAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICAgIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpKTtcblxuICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlKSB7XG4gICAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgLy8gcHJldmVudHMgYXV0b21hdGljIGNsb3NpbmcgcmlnaHQgYWZ0ZXIgYW4gb3BlbmluZyBieSBwdXR0aW5nIGEgZ3VhcmQgZm9yIHRoZSB0aW1lIG9mIG9uZSBldmVudCBoYW5kbGluZ1xuICAgICAgICAgIC8vIHBhc3NcbiAgICAgICAgICAvLyB1c2UgY2FzZTogY2xpY2sgZXZlbnQgd291bGQgcmVhY2ggYW4gZWxlbWVudCBvcGVuaW5nIHRoZSB0b29sdGlwIGZpcnN0LCB0aGVuIHJlYWNoIHRoZSBhdXRvQ2xvc2UgaGFuZGxlclxuICAgICAgICAgIC8vIHdoaWNoIHdvdWxkIGNsb3NlIGl0XG4gICAgICAgICAgbGV0IGp1c3RPcGVuZWQgPSB0cnVlO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBqdXN0T3BlbmVkID0gZmFsc2UpO1xuXG4gICAgICAgICAgY29uc3QgZXNjYXBlcyQgPSBmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4odGhpcy5fZG9jdW1lbnQsICdrZXl1cCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuaGlkZGVuKSwgZmlsdGVyKGV2ZW50ID0+IGV2ZW50LndoaWNoID09PSBLZXkuRXNjYXBlKSk7XG5cbiAgICAgICAgICBjb25zdCBjbGlja3MkID0gZnJvbUV2ZW50PE1vdXNlRXZlbnQ+KHRoaXMuX2RvY3VtZW50LCAnY2xpY2snKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFrZVVudGlsKHRoaXMuaGlkZGVuKSwgZmlsdGVyKCgpID0+ICFqdXN0T3BlbmVkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIoZXZlbnQgPT4gdGhpcy5fc2hvdWxkQ2xvc2VGcm9tQ2xpY2soZXZlbnQpKSk7XG5cbiAgICAgICAgICByYWNlPEV2ZW50PihbZXNjYXBlcyQsIGNsaWNrcyRdKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5fbmdab25lLnJ1bigoKSA9PiB0aGlzLmNsb3NlKCkpKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2hvd24uZW1pdCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDbG9zZXMgYW4gZWxlbWVudMOiwoDCmXMgdG9vbHRpcC4gVGhpcyBpcyBjb25zaWRlcmVkIGEgw6LCgMKcbWFudWFsw6LCgMKdIHRyaWdnZXJpbmcgb2YgdGhlIHRvb2x0aXAuXG4gICAqL1xuICBjbG9zZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5fd2luZG93UmVmICE9IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbmRlcmVyLnJlbW92ZUF0dHJpYnV0ZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhcmlhLWRlc2NyaWJlZGJ5Jyk7XG4gICAgICB0aGlzLl9wb3B1cFNlcnZpY2UuY2xvc2UoKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZiA9IG51bGw7XG4gICAgICB0aGlzLmhpZGRlbi5lbWl0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRvZ2dsZXMgYW4gZWxlbWVudMOiwoDCmXMgdG9vbHRpcC4gVGhpcyBpcyBjb25zaWRlcmVkIGEgw6LCgMKcbWFudWFsw6LCgMKdIHRyaWdnZXJpbmcgb2YgdGhlIHRvb2x0aXAuXG4gICAqL1xuICB0b2dnbGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX3dpbmRvd1JlZikge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgdG9vbHRpcCBpcyBjdXJyZW50bHkgYmVpbmcgc2hvd25cbiAgICovXG4gIGlzT3BlbigpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuX3dpbmRvd1JlZiAhPSBudWxsOyB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5fdW5yZWdpc3Rlckxpc3RlbmVyc0ZuID0gbGlzdGVuVG9UcmlnZ2VycyhcbiAgICAgICAgdGhpcy5fcmVuZGVyZXIsIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgdGhpcy50cmlnZ2VycywgdGhpcy5vcGVuLmJpbmQodGhpcyksIHRoaXMuY2xvc2UuYmluZCh0aGlzKSxcbiAgICAgICAgdGhpcy50b2dnbGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgLy8gVGhpcyBjaGVjayBpcyBuZWVkZWQgYXMgaXQgbWlnaHQgaGFwcGVuIHRoYXQgbmdPbkRlc3Ryb3kgaXMgY2FsbGVkIGJlZm9yZSBuZ09uSW5pdFxuICAgIC8vIHVuZGVyIGNlcnRhaW4gY29uZGl0aW9ucywgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjE5OVxuICAgIGlmICh0aGlzLl91bnJlZ2lzdGVyTGlzdGVuZXJzRm4pIHtcbiAgICAgIHRoaXMuX3VucmVnaXN0ZXJMaXN0ZW5lcnNGbigpO1xuICAgIH1cbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIF9zaG91bGRDbG9zZUZyb21DbGljayhldmVudDogTW91c2VFdmVudCkge1xuICAgIGlmIChldmVudC5idXR0b24gIT09IDIpIHtcbiAgICAgIGlmICh0aGlzLmF1dG9DbG9zZSA9PT0gdHJ1ZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5hdXRvQ2xvc2UgPT09ICdpbnNpZGUnICYmIHRoaXMuX2lzRXZlbnRGcm9tVG9vbHRpcChldmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSAnb3V0c2lkZScgJiYgIXRoaXMuX2lzRXZlbnRGcm9tVG9vbHRpcChldmVudCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHByaXZhdGUgX2lzRXZlbnRGcm9tVG9vbHRpcChldmVudDogTW91c2VFdmVudCkge1xuICAgIGNvbnN0IHBvcHVwID0gdGhpcy5fd2luZG93UmVmLmluc3RhbmNlO1xuICAgIHJldHVybiBwb3B1cCA/IHBvcHVwLmlzRXZlbnRGcm9tKGV2ZW50KSA6IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JUb29sdGlwLCBOZ2JUb29sdGlwV2luZG93fSBmcm9tICcuL3Rvb2x0aXAnO1xuXG5leHBvcnQge05nYlRvb2x0aXBDb25maWd9IGZyb20gJy4vdG9vbHRpcC1jb25maWcnO1xuZXhwb3J0IHtOZ2JUb29sdGlwfSBmcm9tICcuL3Rvb2x0aXAnO1xuZXhwb3J0IHtQbGFjZW1lbnR9IGZyb20gJy4uL3V0aWwvcG9zaXRpb25pbmcnO1xuXG5ATmdNb2R1bGUoe2RlY2xhcmF0aW9uczogW05nYlRvb2x0aXAsIE5nYlRvb2x0aXBXaW5kb3ddLCBleHBvcnRzOiBbTmdiVG9vbHRpcF0sIGVudHJ5Q29tcG9uZW50czogW05nYlRvb2x0aXBXaW5kb3ddfSlcbmV4cG9ydCBjbGFzcyBOZ2JUb29sdGlwTW9kdWxlIHtcbiAgLyoqXG4gICAqIE5vIG5lZWQgaW4gZm9yUm9vdCBhbnltb3JlIHdpdGggdHJlZS1zaGFrZWFibGUgc2VydmljZXNcbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JUb29sdGlwTW9kdWxlfTsgfVxufVxuIiwiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7cmVnRXhwRXNjYXBlLCB0b1N0cmluZ30gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IGNhbiBiZSB1c2VkIGluc2lkZSBhIGN1c3RvbSByZXN1bHQgdGVtcGxhdGUgaW4gb3JkZXIgdG8gaGlnaGxpZ2h0IHRoZSB0ZXJtIGluc2lkZSB0aGUgdGV4dCBvZiB0aGVcbiAqIHJlc3VsdFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItaGlnaGxpZ2h0JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cInBhcnRzXCIgbGV0LXBhcnQgbGV0LWlzT2RkPVwib2RkXCI+YCArXG4gICAgICBgPHNwYW4gKm5nSWY9XCJpc09kZDsgZWxzZSBldmVuXCIgW2NsYXNzXT1cImhpZ2hsaWdodENsYXNzXCI+e3twYXJ0fX08L3NwYW4+PG5nLXRlbXBsYXRlICNldmVuPnt7cGFydH19PC9uZy10ZW1wbGF0ZT5gICtcbiAgICAgIGA8L25nLXRlbXBsYXRlPmAsICAvLyB0ZW1wbGF0ZSBuZWVkcyB0byBiZSBmb3JtYXR0ZWQgaW4gYSBjZXJ0YWluIHdheSBzbyB3ZSBkb24ndCBhZGQgZW1wdHkgdGV4dCBub2Rlc1xuICBzdHlsZXM6IFtgXG4gICAgLm5nYi1oaWdobGlnaHQge1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuICBgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JIaWdobGlnaHQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBwYXJ0czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBDU1MgY2xhc3Mgb2YgdGhlIHNwYW4gZWxlbWVudHMgd3JhcHBpbmcgdGhlIHRlcm0gaW5zaWRlIHRoZSByZXN1bHRcbiAgICovXG4gIEBJbnB1dCgpIGhpZ2hsaWdodENsYXNzID0gJ25nYi1oaWdobGlnaHQnO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzdWx0IHRleHQgdG8gZGlzcGxheS4gSWYgdGhlIHRlcm0gaXMgZm91bmQgaW5zaWRlIHRoaXMgdGV4dCwgaXQncyBoaWdobGlnaHRlZFxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzZWFyY2hlZCB0ZXJtXG4gICAqL1xuICBASW5wdXQoKSB0ZXJtOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHJlc3VsdFN0ciA9IHRvU3RyaW5nKHRoaXMucmVzdWx0KTtcbiAgICBjb25zdCByZXN1bHRMQyA9IHJlc3VsdFN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IHRlcm1MQyA9IHRvU3RyaW5nKHRoaXMudGVybSkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgY3VycmVudElkeCA9IDA7XG5cbiAgICBpZiAodGVybUxDLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucGFydHMgPSByZXN1bHRMQy5zcGxpdChuZXcgUmVnRXhwKGAoJHtyZWdFeHBFc2NhcGUodGVybUxDKX0pYCkpLm1hcCgocGFydCkgPT4ge1xuICAgICAgICBjb25zdCBvcmlnaW5hbFBhcnQgPSByZXN1bHRTdHIuc3Vic3RyKGN1cnJlbnRJZHgsIHBhcnQubGVuZ3RoKTtcbiAgICAgICAgY3VycmVudElkeCArPSBwYXJ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUGFydDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRzID0gW3Jlc3VsdFN0cl07XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIE91dHB1dCwgRXZlbnRFbWl0dGVyLCBUZW1wbGF0ZVJlZiwgT25Jbml0fSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHt0b1N0cmluZ30gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBDb250ZXh0IGZvciB0aGUgdHlwZWFoZWFkIHJlc3VsdCB0ZW1wbGF0ZSBpbiBjYXNlIHlvdSB3YW50IHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IG9uZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFJlc3VsdFRlbXBsYXRlQ29udGV4dCB7XG4gIC8qKlxuICAgKiBZb3VyIHR5cGVhaGVhZCByZXN1bHQgZGF0YSBtb2RlbFxuICAgKi9cbiAgcmVzdWx0OiBhbnk7XG5cbiAgLyoqXG4gICAqIFNlYXJjaCB0ZXJtIGZyb20gdGhlIGlucHV0IHVzZWQgdG8gZ2V0IGN1cnJlbnQgcmVzdWx0XG4gICAqL1xuICB0ZXJtOiBzdHJpbmc7XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi10eXBlYWhlYWQtd2luZG93JyxcbiAgZXhwb3J0QXM6ICduZ2JUeXBlYWhlYWRXaW5kb3cnLFxuICBob3N0OiB7J2NsYXNzJzogJ2Ryb3Bkb3duLW1lbnUgc2hvdycsICdyb2xlJzogJ2xpc3Rib3gnLCAnW2lkXSc6ICdpZCd9LFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjcnQgbGV0LXJlc3VsdD1cInJlc3VsdFwiIGxldC10ZXJtPVwidGVybVwiIGxldC1mb3JtYXR0ZXI9XCJmb3JtYXR0ZXJcIj5cbiAgICAgIDxuZ2ItaGlnaGxpZ2h0IFtyZXN1bHRdPVwiZm9ybWF0dGVyKHJlc3VsdClcIiBbdGVybV09XCJ0ZXJtXCI+PC9uZ2ItaGlnaGxpZ2h0PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cInJlc3VsdHNcIiBsZXQtcmVzdWx0IGxldC1pZHg9XCJpbmRleFwiPlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJkcm9wZG93bi1pdGVtXCIgcm9sZT1cIm9wdGlvblwiXG4gICAgICAgIFtpZF09XCJpZCArICctJyArIGlkeFwiXG4gICAgICAgIFtjbGFzcy5hY3RpdmVdPVwiaWR4ID09PSBhY3RpdmVJZHhcIlxuICAgICAgICAobW91c2VlbnRlcik9XCJtYXJrQWN0aXZlKGlkeClcIlxuICAgICAgICAoY2xpY2spPVwic2VsZWN0KHJlc3VsdClcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwicmVzdWx0VGVtcGxhdGUgfHwgcnRcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7cmVzdWx0OiByZXN1bHQsIHRlcm06IHRlcm0sIGZvcm1hdHRlcjogZm9ybWF0dGVyfVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZFdpbmRvdyBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGFjdGl2ZUlkeCA9IDA7XG5cbiAgLyoqXG4gICAqICBUaGUgaWQgZm9yIHRoZSB0eXBlYWhlYWQgd2lkbm93LiBUaGUgaWQgc2hvdWxkIGJlIHVuaXF1ZSBhbmQgdGhlIHNhbWVcbiAgICogIGFzIHRoZSBhc3NvY2lhdGVkIHR5cGVhaGVhZCdzIGlkLlxuICAgKi9cbiAgQElucHV0KCkgaWQ6IHN0cmluZztcblxuICAvKipcbiAgICogRmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBmaXJzdCByb3cgc2hvdWxkIGJlIGFjdGl2ZSBpbml0aWFsbHlcbiAgICovXG4gIEBJbnB1dCgpIGZvY3VzRmlyc3QgPSB0cnVlO1xuXG4gIC8qKlxuICAgKiBUeXBlYWhlYWQgbWF0Y2ggcmVzdWx0cyB0byBiZSBkaXNwbGF5ZWRcbiAgICovXG4gIEBJbnB1dCgpIHJlc3VsdHM7XG5cbiAgLyoqXG4gICAqIFNlYXJjaCB0ZXJtIHVzZWQgdG8gZ2V0IGN1cnJlbnQgcmVzdWx0c1xuICAgKi9cbiAgQElucHV0KCkgdGVybTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHVzZWQgdG8gZm9ybWF0IGEgZ2l2ZW4gcmVzdWx0IGJlZm9yZSBkaXNwbGF5LiBUaGlzIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBmb3JtYXR0ZWQgc3RyaW5nIHdpdGhvdXQgYW55XG4gICAqIEhUTUwgbWFya3VwXG4gICAqL1xuICBASW5wdXQoKSBmb3JtYXR0ZXIgPSB0b1N0cmluZztcblxuICAvKipcbiAgICogQSB0ZW1wbGF0ZSB0byBvdmVycmlkZSBhIG1hdGNoaW5nIHJlc3VsdCBkZWZhdWx0IGRpc3BsYXlcbiAgICovXG4gIEBJbnB1dCgpIHJlc3VsdFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxSZXN1bHRUZW1wbGF0ZUNvbnRleHQ+O1xuXG4gIC8qKlxuICAgKiBFdmVudCByYWlzZWQgd2hlbiB1c2VyIHNlbGVjdHMgYSBwYXJ0aWN1bGFyIHJlc3VsdCByb3dcbiAgICovXG4gIEBPdXRwdXQoJ3NlbGVjdCcpIHNlbGVjdEV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBPdXRwdXQoJ2FjdGl2ZUNoYW5nZScpIGFjdGl2ZUNoYW5nZUV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIGhhc0FjdGl2ZSgpIHsgcmV0dXJuIHRoaXMuYWN0aXZlSWR4ID4gLTEgJiYgdGhpcy5hY3RpdmVJZHggPCB0aGlzLnJlc3VsdHMubGVuZ3RoOyB9XG5cbiAgZ2V0QWN0aXZlKCkgeyByZXR1cm4gdGhpcy5yZXN1bHRzW3RoaXMuYWN0aXZlSWR4XTsgfVxuXG4gIG1hcmtBY3RpdmUoYWN0aXZlSWR4OiBudW1iZXIpIHtcbiAgICB0aGlzLmFjdGl2ZUlkeCA9IGFjdGl2ZUlkeDtcbiAgICB0aGlzLl9hY3RpdmVDaGFuZ2VkKCk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIGlmICh0aGlzLmFjdGl2ZUlkeCA9PT0gdGhpcy5yZXN1bHRzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHRoaXMuYWN0aXZlSWR4ID0gdGhpcy5mb2N1c0ZpcnN0ID8gKHRoaXMuYWN0aXZlSWR4ICsgMSkgJSB0aGlzLnJlc3VsdHMubGVuZ3RoIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZlSWR4Kys7XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcbiAgfVxuXG4gIHByZXYoKSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlSWR4IDwgMCkge1xuICAgICAgdGhpcy5hY3RpdmVJZHggPSB0aGlzLnJlc3VsdHMubGVuZ3RoIC0gMTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZlSWR4ID09PSAwKSB7XG4gICAgICB0aGlzLmFjdGl2ZUlkeCA9IHRoaXMuZm9jdXNGaXJzdCA/IHRoaXMucmVzdWx0cy5sZW5ndGggLSAxIDogLTE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWN0aXZlSWR4LS07XG4gICAgfVxuICAgIHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcbiAgfVxuXG4gIHJlc2V0QWN0aXZlKCkge1xuICAgIHRoaXMuYWN0aXZlSWR4ID0gdGhpcy5mb2N1c0ZpcnN0ID8gMCA6IC0xO1xuICAgIHRoaXMuX2FjdGl2ZUNoYW5nZWQoKTtcbiAgfVxuXG4gIHNlbGVjdChpdGVtKSB7IHRoaXMuc2VsZWN0RXZlbnQuZW1pdChpdGVtKTsgfVxuXG4gIG5nT25Jbml0KCkgeyB0aGlzLnJlc2V0QWN0aXZlKCk7IH1cblxuICBwcml2YXRlIF9hY3RpdmVDaGFuZ2VkKCkge1xuICAgIHRoaXMuYWN0aXZlQ2hhbmdlRXZlbnQuZW1pdCh0aGlzLmFjdGl2ZUlkeCA+PSAwID8gdGhpcy5pZCArICctJyArIHRoaXMuYWN0aXZlSWR4IDogdW5kZWZpbmVkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtJbmplY3RhYmxlLCBJbmplY3QsIEluamVjdGlvblRva2VuLCBPbkRlc3Ryb3l9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtET0NVTUVOVH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuXG5cbi8vIHVzZWZ1bG5lc3MgKGFuZCBkZWZhdWx0IHZhbHVlKSBvZiBkZWxheSBkb2N1bWVudGVkIGluIE1hdGVyaWFsJ3MgQ0RLXG4vLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9tYXRlcmlhbDIvYmxvYi82NDA1ZGE5YjhlODUzMmE3ZTVjODU0YzkyMGVlMTgxNWMyNzVkNzM0L3NyYy9jZGsvYTExeS9saXZlLWFubm91bmNlci9saXZlLWFubm91bmNlci50cyNMNTBcbmV4cG9ydCB0eXBlIEFSSUFfTElWRV9ERUxBWV9UWVBFID0gbnVtYmVyIHwgbnVsbDtcbmV4cG9ydCBjb25zdCBBUklBX0xJVkVfREVMQVkgPSBuZXcgSW5qZWN0aW9uVG9rZW48QVJJQV9MSVZFX0RFTEFZX1RZUEU+KFxuICAgICdsaXZlIGFubm91bmNlciBkZWxheScsIHtwcm92aWRlZEluOiAncm9vdCcsIGZhY3Rvcnk6IEFSSUFfTElWRV9ERUxBWV9GQUNUT1JZfSk7XG5leHBvcnQgZnVuY3Rpb24gQVJJQV9MSVZFX0RFTEFZX0ZBQ1RPUlkoKTogbnVtYmVyIHtcbiAgcmV0dXJuIDEwMDtcbn1cblxuXG5mdW5jdGlvbiBnZXRMaXZlRWxlbWVudChkb2N1bWVudDogYW55LCBsYXp5Q3JlYXRlID0gZmFsc2UpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICBsZXQgZWxlbWVudCA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcignI25nYi1saXZlJykgYXMgSFRNTEVsZW1lbnQ7XG5cbiAgaWYgKGVsZW1lbnQgPT0gbnVsbCAmJiBsYXp5Q3JlYXRlKSB7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgJ25nYi1saXZlJyk7XG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGl2ZScsICdwb2xpdGUnKTtcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1hdG9taWMnLCAndHJ1ZScpO1xuXG4gICAgZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdzci1vbmx5Jyk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICB9XG5cbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cblxuXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBMaXZlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgY29uc3RydWN0b3IoQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IGFueSwgQEluamVjdChBUklBX0xJVkVfREVMQVkpIHByaXZhdGUgX2RlbGF5OiBhbnkpIHt9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGdldExpdmVFbGVtZW50KHRoaXMuX2RvY3VtZW50KTtcbiAgICBpZiAoZWxlbWVudCkge1xuICAgICAgZWxlbWVudC5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHNheShtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZ2V0TGl2ZUVsZW1lbnQodGhpcy5fZG9jdW1lbnQsIHRydWUpO1xuICAgIGNvbnN0IGRlbGF5ID0gdGhpcy5fZGVsYXk7XG5cbiAgICBlbGVtZW50LnRleHRDb250ZW50ID0gJyc7XG4gICAgY29uc3Qgc2V0VGV4dCA9ICgpID0+IGVsZW1lbnQudGV4dENvbnRlbnQgPSBtZXNzYWdlO1xuICAgIGlmIChkZWxheSA9PT0gbnVsbCkge1xuICAgICAgc2V0VGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KHNldFRleHQsIGRlbGF5KTtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1BsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIHNlcnZpY2UgZm9yIHRoZSBOZ2JUeXBlYWhlYWQgY29tcG9uZW50LlxuICogWW91IGNhbiBpbmplY3QgdGhpcyBzZXJ2aWNlLCB0eXBpY2FsbHkgaW4geW91ciByb290IGNvbXBvbmVudCwgYW5kIGN1c3RvbWl6ZSB0aGUgdmFsdWVzIG9mIGl0cyBwcm9wZXJ0aWVzIGluXG4gKiBvcmRlciB0byBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGZvciBhbGwgdGhlIHR5cGVhaGVhZHMgdXNlZCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZENvbmZpZyB7XG4gIGNvbnRhaW5lcjtcbiAgZWRpdGFibGUgPSB0cnVlO1xuICBmb2N1c0ZpcnN0ID0gdHJ1ZTtcbiAgc2hvd0hpbnQgPSBmYWxzZTtcbiAgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICdib3R0b20tbGVmdCc7XG59XG4iLCJpbXBvcnQge1xuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIENvbXBvbmVudFJlZixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIGZvcndhcmRSZWYsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1J9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0LCBTdWJzY3JpcHRpb24sIGZyb21FdmVudH0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Bvc2l0aW9uRWxlbWVudHMsIFBsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7TmdiVHlwZWFoZWFkV2luZG93LCBSZXN1bHRUZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vdHlwZWFoZWFkLXdpbmRvdyc7XG5pbXBvcnQge1BvcHVwU2VydmljZX0gZnJvbSAnLi4vdXRpbC9wb3B1cCc7XG5pbXBvcnQge3RvU3RyaW5nLCBpc0RlZmluZWR9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5pbXBvcnQge0tleX0gZnJvbSAnLi4vdXRpbC9rZXknO1xuaW1wb3J0IHtMaXZlfSBmcm9tICcuLi91dGlsL2FjY2Vzc2liaWxpdHkvbGl2ZSc7XG5pbXBvcnQge05nYlR5cGVhaGVhZENvbmZpZ30gZnJvbSAnLi90eXBlYWhlYWQtY29uZmlnJztcbmltcG9ydCB7bWFwLCBzd2l0Y2hNYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5jb25zdCBOR0JfVFlQRUFIRUFEX1ZBTFVFX0FDQ0VTU09SID0ge1xuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gTmdiVHlwZWFoZWFkKSxcbiAgbXVsdGk6IHRydWVcbn07XG5cbi8qKlxuICogUGF5bG9hZCBvZiB0aGUgc2VsZWN0SXRlbSBldmVudC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnQge1xuICAvKipcbiAgICogQW4gaXRlbSBhYm91dCB0byBiZSBzZWxlY3RlZFxuICAgKi9cbiAgaXRlbTogYW55O1xuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiB0aGF0IHdpbGwgcHJldmVudCBpdGVtIHNlbGVjdGlvbiBpZiBjYWxsZWRcbiAgICovXG4gIHByZXZlbnREZWZhdWx0OiAoKSA9PiB2b2lkO1xufVxuXG5sZXQgbmV4dFdpbmRvd0lkID0gMDtcblxuLyoqXG4gKiBOZ2JUeXBlYWhlYWQgZGlyZWN0aXZlIHByb3ZpZGVzIGEgc2ltcGxlIHdheSBvZiBjcmVhdGluZyBwb3dlcmZ1bCB0eXBlYWhlYWRzIGZyb20gYW55IHRleHQgaW5wdXRcbiAqL1xuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnaW5wdXRbbmdiVHlwZWFoZWFkXScsXG4gIGV4cG9ydEFzOiAnbmdiVHlwZWFoZWFkJyxcbiAgaG9zdDoge1xuICAgICcoYmx1ciknOiAnaGFuZGxlQmx1cigpJyxcbiAgICAnW2NsYXNzLm9wZW5dJzogJ2lzUG9wdXBPcGVuKCknLFxuICAgICcoZG9jdW1lbnQ6Y2xpY2spJzogJ29uRG9jdW1lbnRDbGljaygkZXZlbnQpJyxcbiAgICAnKGtleWRvd24pJzogJ2hhbmRsZUtleURvd24oJGV2ZW50KScsXG4gICAgJ1thdXRvY29tcGxldGVdJzogJ2F1dG9jb21wbGV0ZScsXG4gICAgJ2F1dG9jYXBpdGFsaXplJzogJ29mZicsXG4gICAgJ2F1dG9jb3JyZWN0JzogJ29mZicsXG4gICAgJ3JvbGUnOiAnY29tYm9ib3gnLFxuICAgICdhcmlhLW11bHRpbGluZSc6ICdmYWxzZScsXG4gICAgJ1thdHRyLmFyaWEtYXV0b2NvbXBsZXRlXSc6ICdzaG93SGludCA/IFwiYm90aFwiIDogXCJsaXN0XCInLFxuICAgICdbYXR0ci5hcmlhLWFjdGl2ZWRlc2NlbmRhbnRdJzogJ2FjdGl2ZURlc2NlbmRhbnQnLFxuICAgICdbYXR0ci5hcmlhLW93bnNdJzogJ2lzUG9wdXBPcGVuKCkgPyBwb3B1cElkIDogbnVsbCcsXG4gICAgJ1thdHRyLmFyaWEtZXhwYW5kZWRdJzogJ2lzUG9wdXBPcGVuKCknXG4gIH0sXG4gIHByb3ZpZGVyczogW05HQl9UWVBFQUhFQURfVkFMVUVfQUNDRVNTT1JdXG59KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBfcG9wdXBTZXJ2aWNlOiBQb3B1cFNlcnZpY2U8TmdiVHlwZWFoZWFkV2luZG93PjtcbiAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2lucHV0VmFsdWVCYWNrdXA6IHN0cmluZztcbiAgcHJpdmF0ZSBfdmFsdWVDaGFuZ2VzOiBPYnNlcnZhYmxlPHN0cmluZz47XG4gIHByaXZhdGUgX3Jlc3Vic2NyaWJlVHlwZWFoZWFkOiBCZWhhdmlvclN1YmplY3Q8YW55PjtcbiAgcHJpdmF0ZSBfd2luZG93UmVmOiBDb21wb25lbnRSZWY8TmdiVHlwZWFoZWFkV2luZG93PjtcbiAgcHJpdmF0ZSBfem9uZVN1YnNjcmlwdGlvbjogYW55O1xuXG4gIC8qKlxuICAgKiBWYWx1ZSBmb3IgdGhlIGNvbmZpZ3VyYWJsZSBhdXRvY29tcGxldGUgYXR0cmlidXRlLlxuICAgKiBEZWZhdWx0cyB0byAnb2ZmJyB0byBkaXNhYmxlIHRoZSBuYXRpdmUgYnJvd3NlciBhdXRvY29tcGxldGUsIGJ1dCB0aGlzIHN0YW5kYXJkIHZhbHVlIGRvZXMgbm90IHNlZW1cbiAgICogdG8gYmUgYWx3YXlzIGNvcnJlY3RseSB0YWtlbiBpbnRvIGFjY291bnQuXG4gICAqXG4gICAqIEBzaW5jZSAyLjEuMFxuICAgKi9cbiAgQElucHV0KCkgYXV0b2NvbXBsZXRlID0gJ29mZic7XG5cbiAgLyoqXG4gICAqIEEgc2VsZWN0b3Igc3BlY2lmeWluZyB0aGUgZWxlbWVudCB0aGUgdG9vbHRpcCBzaG91bGQgYmUgYXBwZW5kZWQgdG8uXG4gICAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIFwiYm9keVwiLlxuICAgKi9cbiAgQElucHV0KCkgY29udGFpbmVyOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIG1vZGVsIHZhbHVlcyBzaG91bGQgYmUgcmVzdHJpY3RlZCB0byB0aGUgb25lcyBzZWxlY3RlZCBmcm9tIHRoZSBwb3B1cCBvbmx5LlxuICAgKi9cbiAgQElucHV0KCkgZWRpdGFibGU6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBmaXJzdCBtYXRjaCBzaG91bGQgYXV0b21hdGljYWxseSBiZSBmb2N1c2VkIGFzIHlvdSB0eXBlLlxuICAgKi9cbiAgQElucHV0KCkgZm9jdXNGaXJzdDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmdW5jdGlvbiB0byBjb252ZXJ0IGEgZ2l2ZW4gdmFsdWUgaW50byBzdHJpbmcgdG8gZGlzcGxheSBpbiB0aGUgaW5wdXQgZmllbGRcbiAgICovXG4gIEBJbnB1dCgpIGlucHV0Rm9ybWF0dGVyOiAodmFsdWU6IGFueSkgPT4gc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBIGZ1bmN0aW9uIHRvIHRyYW5zZm9ybSB0aGUgcHJvdmlkZWQgb2JzZXJ2YWJsZSB0ZXh0IGludG8gdGhlIGFycmF5IG9mIHJlc3VsdHMuICBOb3RlIHRoYXQgdGhlIFwidGhpc1wiIGFyZ3VtZW50XG4gICAqIGlzIHVuZGVmaW5lZCBzbyB5b3UgbmVlZCB0byBleHBsaWNpdGx5IGJpbmQgaXQgdG8gYSBkZXNpcmVkIFwidGhpc1wiIHRhcmdldC5cbiAgICovXG4gIEBJbnB1dCgpIG5nYlR5cGVhaGVhZDogKHRleHQ6IE9ic2VydmFibGU8c3RyaW5nPikgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gdG8gZm9ybWF0IGEgZ2l2ZW4gcmVzdWx0IGJlZm9yZSBkaXNwbGF5LiBUaGlzIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gYSBmb3JtYXR0ZWQgc3RyaW5nIHdpdGhvdXQgYW55XG4gICAqIEhUTUwgbWFya3VwXG4gICAqL1xuICBASW5wdXQoKSByZXN1bHRGb3JtYXR0ZXI6ICh2YWx1ZTogYW55KSA9PiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgdGVtcGxhdGUgdG8gb3ZlcnJpZGUgYSBtYXRjaGluZyByZXN1bHQgZGVmYXVsdCBkaXNwbGF5XG4gICAqL1xuICBASW5wdXQoKSByZXN1bHRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8UmVzdWx0VGVtcGxhdGVDb250ZXh0PjtcblxuICAvKipcbiAgICogU2hvdyBoaW50IHdoZW4gYW4gb3B0aW9uIGluIHRoZSByZXN1bHQgbGlzdCBtYXRjaGVzLlxuICAgKi9cbiAgQElucHV0KCkgc2hvd0hpbnQ6IGJvb2xlYW47XG5cbiAgLyoqIFBsYWNlbWVudCBvZiBhIHR5cGVhaGVhZCBhY2NlcHRzOlxuICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICogICAgXCJsZWZ0XCIsIFwibGVmdC10b3BcIiwgXCJsZWZ0LWJvdHRvbVwiLCBcInJpZ2h0XCIsIFwicmlnaHQtdG9wXCIsIFwicmlnaHQtYm90dG9tXCJcbiAgICogYW5kIGFycmF5IG9mIGFib3ZlIHZhbHVlcy5cbiAgKi9cbiAgQElucHV0KCkgcGxhY2VtZW50OiBQbGFjZW1lbnRBcnJheSA9ICdib3R0b20tbGVmdCc7XG5cbiAgLyoqXG4gICAqIEFuIGV2ZW50IGVtaXR0ZWQgd2hlbiBhIG1hdGNoIGlzIHNlbGVjdGVkLiBFdmVudCBwYXlsb2FkIGlzIG9mIHR5cGUgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50LlxuICAgKi9cbiAgQE91dHB1dCgpIHNlbGVjdEl0ZW0gPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlR5cGVhaGVhZFNlbGVjdEl0ZW1FdmVudD4oKTtcblxuICBhY3RpdmVEZXNjZW5kYW50OiBzdHJpbmc7XG4gIHBvcHVwSWQgPSBgbmdiLXR5cGVhaGVhZC0ke25leHRXaW5kb3dJZCsrfWA7XG5cbiAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge307XG4gIHByaXZhdGUgX29uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBwcml2YXRlIF9lbGVtZW50UmVmOiBFbGVtZW50UmVmPEhUTUxJbnB1dEVsZW1lbnQ+LCBwcml2YXRlIF92aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgICAgcHJpdmF0ZSBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBfaW5qZWN0b3I6IEluamVjdG9yLCBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgIGNvbmZpZzogTmdiVHlwZWFoZWFkQ29uZmlnLCBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBfbGl2ZTogTGl2ZSkge1xuICAgIHRoaXMuY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lcjtcbiAgICB0aGlzLmVkaXRhYmxlID0gY29uZmlnLmVkaXRhYmxlO1xuICAgIHRoaXMuZm9jdXNGaXJzdCA9IGNvbmZpZy5mb2N1c0ZpcnN0O1xuICAgIHRoaXMuc2hvd0hpbnQgPSBjb25maWcuc2hvd0hpbnQ7XG4gICAgdGhpcy5wbGFjZW1lbnQgPSBjb25maWcucGxhY2VtZW50O1xuXG4gICAgdGhpcy5fdmFsdWVDaGFuZ2VzID0gZnJvbUV2ZW50PEV2ZW50PihfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnaW5wdXQnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucGlwZShtYXAoJGV2ZW50ID0+ICgkZXZlbnQudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlKSk7XG5cbiAgICB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZCA9IG5ldyBCZWhhdmlvclN1YmplY3QobnVsbCk7XG5cbiAgICB0aGlzLl9wb3B1cFNlcnZpY2UgPSBuZXcgUG9wdXBTZXJ2aWNlPE5nYlR5cGVhaGVhZFdpbmRvdz4oXG4gICAgICAgIE5nYlR5cGVhaGVhZFdpbmRvdywgX2luamVjdG9yLCBfdmlld0NvbnRhaW5lclJlZiwgX3JlbmRlcmVyLCBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIpO1xuXG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbiA9IG5nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgICBwb3NpdGlvbkVsZW1lbnRzKFxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl93aW5kb3dSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsXG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lciA9PT0gJ2JvZHknKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0VmFsdWVzJCA9IHRoaXMuX3ZhbHVlQ2hhbmdlcy5waXBlKHRhcCh2YWx1ZSA9PiB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlQmFja3VwID0gdmFsdWU7XG4gICAgICBpZiAodGhpcy5lZGl0YWJsZSkge1xuICAgICAgICB0aGlzLl9vbkNoYW5nZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSkpO1xuICAgIGNvbnN0IHJlc3VsdHMkID0gaW5wdXRWYWx1ZXMkLnBpcGUodGhpcy5uZ2JUeXBlYWhlYWQpO1xuICAgIGNvbnN0IHByb2Nlc3NlZFJlc3VsdHMkID0gcmVzdWx0cyQucGlwZSh0YXAoKCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmVkaXRhYmxlKSB7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSkpO1xuICAgIGNvbnN0IHVzZXJJbnB1dCQgPSB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5waXBlKHN3aXRjaE1hcCgoKSA9PiBwcm9jZXNzZWRSZXN1bHRzJCkpO1xuICAgIHRoaXMuX3N1YnNjcmlwdGlvbiA9IHRoaXMuX3N1YnNjcmliZVRvVXNlcklucHV0KHVzZXJJbnB1dCQpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5fY2xvc2VQb3B1cCgpO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlRnJvbVVzZXJJbnB1dCgpO1xuICAgIHRoaXMuX3pvbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyT25DaGFuZ2UoZm46ICh2YWx1ZTogYW55KSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5fb25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5fb25Ub3VjaGVkID0gZm47IH1cblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7IHRoaXMuX3dyaXRlSW5wdXRWYWx1ZSh0aGlzLl9mb3JtYXRJdGVtRm9ySW5wdXQodmFsdWUpKTsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuX3JlbmRlcmVyLnNldFByb3BlcnR5KHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2Rpc2FibGVkJywgaXNEaXNhYmxlZCk7XG4gIH1cblxuICBvbkRvY3VtZW50Q2xpY2soZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ICE9PSB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZGlzbWlzc1BvcHVwKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc21pc3NlcyB0eXBlYWhlYWQgcG9wdXAgd2luZG93XG4gICAqL1xuICBkaXNtaXNzUG9wdXAoKSB7XG4gICAgaWYgKHRoaXMuaXNQb3B1cE9wZW4oKSkge1xuICAgICAgdGhpcy5fY2xvc2VQb3B1cCgpO1xuICAgICAgdGhpcy5fd3JpdGVJbnB1dFZhbHVlKHRoaXMuX2lucHV0VmFsdWVCYWNrdXApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHR5cGVhaGVhZCBwb3B1cCB3aW5kb3cgaXMgZGlzcGxheWVkXG4gICAqL1xuICBpc1BvcHVwT3BlbigpIHsgcmV0dXJuIHRoaXMuX3dpbmRvd1JlZiAhPSBudWxsOyB9XG5cbiAgaGFuZGxlQmx1cigpIHtcbiAgICB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5uZXh0KG51bGwpO1xuICAgIHRoaXMuX29uVG91Y2hlZCgpO1xuICB9XG5cbiAgaGFuZGxlS2V5RG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgIGlmICghdGhpcy5pc1BvcHVwT3BlbigpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKEtleVt0b1N0cmluZyhldmVudC53aGljaCldKSB7XG4gICAgICBzd2l0Y2ggKGV2ZW50LndoaWNoKSB7XG4gICAgICAgIGNhc2UgS2V5LkFycm93RG93bjpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5uZXh0KCk7XG4gICAgICAgICAgdGhpcy5fc2hvd0hpbnQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuQXJyb3dVcDpcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5wcmV2KCk7XG4gICAgICAgICAgdGhpcy5fc2hvd0hpbnQoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBLZXkuRW50ZXI6XG4gICAgICAgIGNhc2UgS2V5LlRhYjpcbiAgICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuZ2V0QWN0aXZlKCk7XG4gICAgICAgICAgaWYgKGlzRGVmaW5lZChyZXN1bHQpKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5fY2xvc2VQb3B1cCgpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIEtleS5Fc2NhcGU6XG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aGlzLl9yZXN1YnNjcmliZVR5cGVhaGVhZC5uZXh0KG51bGwpO1xuICAgICAgICAgIHRoaXMuZGlzbWlzc1BvcHVwKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfb3BlblBvcHVwKCkge1xuICAgIGlmICghdGhpcy5pc1BvcHVwT3BlbigpKSB7XG4gICAgICB0aGlzLl9pbnB1dFZhbHVlQmFja3VwID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgdGhpcy5fd2luZG93UmVmID0gdGhpcy5fcG9wdXBTZXJ2aWNlLm9wZW4oKTtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5pZCA9IHRoaXMucG9wdXBJZDtcbiAgICAgIHRoaXMuX3dpbmRvd1JlZi5pbnN0YW5jZS5zZWxlY3RFdmVudC5zdWJzY3JpYmUoKHJlc3VsdDogYW55KSA9PiB0aGlzLl9zZWxlY3RSZXN1bHRDbG9zZVBvcHVwKHJlc3VsdCkpO1xuICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmFjdGl2ZUNoYW5nZUV2ZW50LnN1YnNjcmliZSgoYWN0aXZlSWQ6IHN0cmluZykgPT4gdGhpcy5hY3RpdmVEZXNjZW5kYW50ID0gYWN0aXZlSWQpO1xuXG4gICAgICBpZiAodGhpcy5jb250YWluZXIgPT09ICdib2R5Jykge1xuICAgICAgICB3aW5kb3cuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLmNvbnRhaW5lcikuYXBwZW5kQ2hpbGQodGhpcy5fd2luZG93UmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Nsb3NlUG9wdXAoKSB7XG4gICAgdGhpcy5fcG9wdXBTZXJ2aWNlLmNsb3NlKCk7XG4gICAgdGhpcy5fd2luZG93UmVmID0gbnVsbDtcbiAgICB0aGlzLmFjdGl2ZURlc2NlbmRhbnQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwcml2YXRlIF9zZWxlY3RSZXN1bHQocmVzdWx0OiBhbnkpIHtcbiAgICBsZXQgZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuc2VsZWN0SXRlbS5lbWl0KHtpdGVtOiByZXN1bHQsIHByZXZlbnREZWZhdWx0OiAoKSA9PiB7IGRlZmF1bHRQcmV2ZW50ZWQgPSB0cnVlOyB9fSk7XG4gICAgdGhpcy5fcmVzdWJzY3JpYmVUeXBlYWhlYWQubmV4dChudWxsKTtcblxuICAgIGlmICghZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgdGhpcy53cml0ZVZhbHVlKHJlc3VsdCk7XG4gICAgICB0aGlzLl9vbkNoYW5nZShyZXN1bHQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NlbGVjdFJlc3VsdENsb3NlUG9wdXAocmVzdWx0OiBhbnkpIHtcbiAgICB0aGlzLl9zZWxlY3RSZXN1bHQocmVzdWx0KTtcbiAgICB0aGlzLl9jbG9zZVBvcHVwKCk7XG4gIH1cblxuICBwcml2YXRlIF9zaG93SGludCgpIHtcbiAgICBpZiAodGhpcy5zaG93SGludCAmJiB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuaGFzQWN0aXZlKCkgJiYgdGhpcy5faW5wdXRWYWx1ZUJhY2t1cCAhPSBudWxsKSB7XG4gICAgICBjb25zdCB1c2VySW5wdXRMb3dlckNhc2UgPSB0aGlzLl9pbnB1dFZhbHVlQmFja3VwLnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBmb3JtYXR0ZWRWYWwgPSB0aGlzLl9mb3JtYXRJdGVtRm9ySW5wdXQodGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmdldEFjdGl2ZSgpKTtcblxuICAgICAgaWYgKHVzZXJJbnB1dExvd2VyQ2FzZSA9PT0gZm9ybWF0dGVkVmFsLnN1YnN0cigwLCB0aGlzLl9pbnB1dFZhbHVlQmFja3VwLmxlbmd0aCkudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICB0aGlzLl93cml0ZUlucHV0VmFsdWUodGhpcy5faW5wdXRWYWx1ZUJhY2t1cCArIGZvcm1hdHRlZFZhbC5zdWJzdHIodGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgpKTtcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50WydzZXRTZWxlY3Rpb25SYW5nZSddLmFwcGx5KFxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBbdGhpcy5faW5wdXRWYWx1ZUJhY2t1cC5sZW5ndGgsIGZvcm1hdHRlZFZhbC5sZW5ndGhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMud3JpdGVWYWx1ZSh0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuZ2V0QWN0aXZlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2Zvcm1hdEl0ZW1Gb3JJbnB1dChpdGVtOiBhbnkpOiBzdHJpbmcge1xuICAgIHJldHVybiBpdGVtICE9IG51bGwgJiYgdGhpcy5pbnB1dEZvcm1hdHRlciA/IHRoaXMuaW5wdXRGb3JtYXR0ZXIoaXRlbSkgOiB0b1N0cmluZyhpdGVtKTtcbiAgfVxuXG4gIHByaXZhdGUgX3dyaXRlSW5wdXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fcmVuZGVyZXIuc2V0UHJvcGVydHkodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB0b1N0cmluZyh2YWx1ZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc3Vic2NyaWJlVG9Vc2VySW5wdXQodXNlcklucHV0JDogT2JzZXJ2YWJsZTxhbnlbXT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB1c2VySW5wdXQkLnN1YnNjcmliZSgocmVzdWx0cykgPT4ge1xuICAgICAgaWYgKCFyZXN1bHRzIHx8IHJlc3VsdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRoaXMuX2Nsb3NlUG9wdXAoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX29wZW5Qb3B1cCgpO1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UuZm9jdXNGaXJzdCA9IHRoaXMuZm9jdXNGaXJzdDtcbiAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnJlc3VsdHMgPSByZXN1bHRzO1xuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UudGVybSA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMucmVzdWx0Rm9ybWF0dGVyKSB7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLmZvcm1hdHRlciA9IHRoaXMucmVzdWx0Rm9ybWF0dGVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlc3VsdFRlbXBsYXRlKSB7XG4gICAgICAgICAgdGhpcy5fd2luZG93UmVmLmluc3RhbmNlLnJlc3VsdFRlbXBsYXRlID0gdGhpcy5yZXN1bHRUZW1wbGF0ZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl93aW5kb3dSZWYuaW5zdGFuY2UucmVzZXRBY3RpdmUoKTtcblxuICAgICAgICAvLyBUaGUgb2JzZXJ2YWJsZSBzdHJlYW0gd2UgYXJlIHN1YnNjcmliaW5nIHRvIG1pZ2h0IGhhdmUgYXN5bmMgc3RlcHNcbiAgICAgICAgLy8gYW5kIGlmIGEgY29tcG9uZW50IGNvbnRhaW5pbmcgdHlwZWFoZWFkIGlzIHVzaW5nIHRoZSBPblB1c2ggc3RyYXRlZ3lcbiAgICAgICAgLy8gdGhlIGNoYW5nZSBkZXRlY3Rpb24gdHVybiB3b3VsZG4ndCBiZSBpbnZva2VkIGF1dG9tYXRpY2FsbHkuXG4gICAgICAgIHRoaXMuX3dpbmRvd1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgICAgdGhpcy5fc2hvd0hpbnQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gbGl2ZSBhbm5vdW5jZXJcbiAgICAgIGNvbnN0IGNvdW50ID0gcmVzdWx0cyA/IHJlc3VsdHMubGVuZ3RoIDogMDtcbiAgICAgIHRoaXMuX2xpdmUuc2F5KGNvdW50ID09PSAwID8gJ05vIHJlc3VsdHMgYXZhaWxhYmxlJyA6IGAke2NvdW50fSByZXN1bHQke2NvdW50ID09PSAxID8gJycgOiAncyd9IGF2YWlsYWJsZWApO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBfdW5zdWJzY3JpYmVGcm9tVXNlcklucHV0KCkge1xuICAgIGlmICh0aGlzLl9zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX3N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYkhpZ2hsaWdodH0gZnJvbSAnLi9oaWdobGlnaHQnO1xuaW1wb3J0IHtOZ2JUeXBlYWhlYWRXaW5kb3d9IGZyb20gJy4vdHlwZWFoZWFkLXdpbmRvdyc7XG5pbXBvcnQge05nYlR5cGVhaGVhZH0gZnJvbSAnLi90eXBlYWhlYWQnO1xuXG5leHBvcnQge05nYkhpZ2hsaWdodH0gZnJvbSAnLi9oaWdobGlnaHQnO1xuZXhwb3J0IHtOZ2JUeXBlYWhlYWRXaW5kb3d9IGZyb20gJy4vdHlwZWFoZWFkLXdpbmRvdyc7XG5leHBvcnQge05nYlR5cGVhaGVhZENvbmZpZ30gZnJvbSAnLi90eXBlYWhlYWQtY29uZmlnJztcbmV4cG9ydCB7TmdiVHlwZWFoZWFkLCBOZ2JUeXBlYWhlYWRTZWxlY3RJdGVtRXZlbnR9IGZyb20gJy4vdHlwZWFoZWFkJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbTmdiVHlwZWFoZWFkLCBOZ2JIaWdobGlnaHQsIE5nYlR5cGVhaGVhZFdpbmRvd10sXG4gIGV4cG9ydHM6IFtOZ2JUeXBlYWhlYWQsIE5nYkhpZ2hsaWdodF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBlbnRyeUNvbXBvbmVudHM6IFtOZ2JUeXBlYWhlYWRXaW5kb3ddXG59KVxuZXhwb3J0IGNsYXNzIE5nYlR5cGVhaGVhZE1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JUeXBlYWhlYWRNb2R1bGV9OyB9XG59XG4iLCJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JBY2NvcmRpb25Nb2R1bGUsIE5nYlBhbmVsQ2hhbmdlRXZlbnR9IGZyb20gJy4vYWNjb3JkaW9uL2FjY29yZGlvbi5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JBbGVydE1vZHVsZX0gZnJvbSAnLi9hbGVydC9hbGVydC5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JCdXR0b25zTW9kdWxlfSBmcm9tICcuL2J1dHRvbnMvYnV0dG9ucy5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JDYXJvdXNlbE1vZHVsZX0gZnJvbSAnLi9jYXJvdXNlbC9jYXJvdXNlbC5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JDb2xsYXBzZU1vZHVsZX0gZnJvbSAnLi9jb2xsYXBzZS9jb2xsYXBzZS5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyTW9kdWxlfSBmcm9tICcuL2RhdGVwaWNrZXIvZGF0ZXBpY2tlci5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JEcm9wZG93bk1vZHVsZX0gZnJvbSAnLi9kcm9wZG93bi9kcm9wZG93bi5tb2R1bGUnO1xuaW1wb3J0IHtOZ2JNb2RhbE1vZHVsZSwgTmdiTW9kYWwsIE5nYk1vZGFsT3B0aW9ucywgTmdiTW9kYWxSZWYsIE1vZGFsRGlzbWlzc1JlYXNvbnN9IGZyb20gJy4vbW9kYWwvbW9kYWwubW9kdWxlJztcbmltcG9ydCB7TmdiUGFnaW5hdGlvbk1vZHVsZX0gZnJvbSAnLi9wYWdpbmF0aW9uL3BhZ2luYXRpb24ubW9kdWxlJztcbmltcG9ydCB7TmdiUG9wb3Zlck1vZHVsZX0gZnJvbSAnLi9wb3BvdmVyL3BvcG92ZXIubW9kdWxlJztcbmltcG9ydCB7TmdiUHJvZ3Jlc3NiYXJNb2R1bGV9IGZyb20gJy4vcHJvZ3Jlc3NiYXIvcHJvZ3Jlc3NiYXIubW9kdWxlJztcbmltcG9ydCB7TmdiUmF0aW5nTW9kdWxlfSBmcm9tICcuL3JhdGluZy9yYXRpbmcubW9kdWxlJztcbmltcG9ydCB7TmdiVGFic2V0TW9kdWxlLCBOZ2JUYWJDaGFuZ2VFdmVudH0gZnJvbSAnLi90YWJzZXQvdGFic2V0Lm1vZHVsZSc7XG5pbXBvcnQge05nYlRpbWVwaWNrZXJNb2R1bGV9IGZyb20gJy4vdGltZXBpY2tlci90aW1lcGlja2VyLm1vZHVsZSc7XG5pbXBvcnQge05nYlRvb2x0aXBNb2R1bGV9IGZyb20gJy4vdG9vbHRpcC90b29sdGlwLm1vZHVsZSc7XG5pbXBvcnQge05nYlR5cGVhaGVhZE1vZHVsZSwgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50fSBmcm9tICcuL3R5cGVhaGVhZC90eXBlYWhlYWQubW9kdWxlJztcblxuZXhwb3J0IHtcbiAgTmdiQWNjb3JkaW9uTW9kdWxlLFxuICBOZ2JQYW5lbENoYW5nZUV2ZW50LFxuICBOZ2JBY2NvcmRpb25Db25maWcsXG4gIE5nYkFjY29yZGlvbixcbiAgTmdiUGFuZWwsXG4gIE5nYlBhbmVsVGl0bGUsXG4gIE5nYlBhbmVsQ29udGVudFxufSBmcm9tICcuL2FjY29yZGlvbi9hY2NvcmRpb24ubW9kdWxlJztcbmV4cG9ydCB7TmdiQWxlcnRNb2R1bGUsIE5nYkFsZXJ0Q29uZmlnLCBOZ2JBbGVydH0gZnJvbSAnLi9hbGVydC9hbGVydC5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JCdXR0b25zTW9kdWxlLCBOZ2JDaGVja0JveCwgTmdiUmFkaW9Hcm91cH0gZnJvbSAnLi9idXR0b25zL2J1dHRvbnMubW9kdWxlJztcbmV4cG9ydCB7TmdiQ2Fyb3VzZWxNb2R1bGUsIE5nYkNhcm91c2VsQ29uZmlnLCBOZ2JDYXJvdXNlbCwgTmdiU2xpZGV9IGZyb20gJy4vY2Fyb3VzZWwvY2Fyb3VzZWwubW9kdWxlJztcbmV4cG9ydCB7TmdiQ29sbGFwc2VNb2R1bGUsIE5nYkNvbGxhcHNlfSBmcm9tICcuL2NvbGxhcHNlL2NvbGxhcHNlLm1vZHVsZSc7XG5leHBvcnQge1xuICBOZ2JDYWxlbmRhcixcbiAgTmdiUGVyaW9kLFxuICBOZ2JDYWxlbmRhcklzbGFtaWNDaXZpbCxcbiAgTmdiQ2FsZW5kYXJJc2xhbWljVW1hbHF1cmEsXG4gIE5nYkNhbGVuZGFyUGVyc2lhbixcbiAgTmdiRGF0ZXBpY2tlck1vZHVsZSxcbiAgTmdiRGF0ZXBpY2tlckkxOG4sXG4gIE5nYkRhdGVwaWNrZXJDb25maWcsXG4gIE5nYkRhdGVTdHJ1Y3QsXG4gIE5nYkRhdGUsXG4gIE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIsXG4gIE5nYkRhdGVBZGFwdGVyLFxuICBOZ2JEYXRlTmF0aXZlQWRhcHRlcixcbiAgTmdiRGF0ZXBpY2tlcixcbiAgTmdiSW5wdXREYXRlcGlja2VyXG59IGZyb20gJy4vZGF0ZXBpY2tlci9kYXRlcGlja2VyLm1vZHVsZSc7XG5leHBvcnQge05nYkRyb3Bkb3duTW9kdWxlLCBOZ2JEcm9wZG93bkNvbmZpZywgTmdiRHJvcGRvd259IGZyb20gJy4vZHJvcGRvd24vZHJvcGRvd24ubW9kdWxlJztcbmV4cG9ydCB7XG4gIE5nYk1vZGFsTW9kdWxlLFxuICBOZ2JNb2RhbCxcbiAgTmdiTW9kYWxPcHRpb25zLFxuICBOZ2JBY3RpdmVNb2RhbCxcbiAgTmdiTW9kYWxSZWYsXG4gIE1vZGFsRGlzbWlzc1JlYXNvbnNcbn0gZnJvbSAnLi9tb2RhbC9tb2RhbC5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JQYWdpbmF0aW9uTW9kdWxlLCBOZ2JQYWdpbmF0aW9uQ29uZmlnLCBOZ2JQYWdpbmF0aW9ufSBmcm9tICcuL3BhZ2luYXRpb24vcGFnaW5hdGlvbi5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JQb3BvdmVyTW9kdWxlLCBOZ2JQb3BvdmVyQ29uZmlnLCBOZ2JQb3BvdmVyfSBmcm9tICcuL3BvcG92ZXIvcG9wb3Zlci5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JQcm9ncmVzc2Jhck1vZHVsZSwgTmdiUHJvZ3Jlc3NiYXJDb25maWcsIE5nYlByb2dyZXNzYmFyfSBmcm9tICcuL3Byb2dyZXNzYmFyL3Byb2dyZXNzYmFyLm1vZHVsZSc7XG5leHBvcnQge05nYlJhdGluZ01vZHVsZSwgTmdiUmF0aW5nQ29uZmlnLCBOZ2JSYXRpbmd9IGZyb20gJy4vcmF0aW5nL3JhdGluZy5tb2R1bGUnO1xuZXhwb3J0IHtcbiAgTmdiVGFic2V0TW9kdWxlLFxuICBOZ2JUYWJDaGFuZ2VFdmVudCxcbiAgTmdiVGFic2V0Q29uZmlnLFxuICBOZ2JUYWJzZXQsXG4gIE5nYlRhYixcbiAgTmdiVGFiQ29udGVudCxcbiAgTmdiVGFiVGl0bGVcbn0gZnJvbSAnLi90YWJzZXQvdGFic2V0Lm1vZHVsZSc7XG5leHBvcnQge1xuICBOZ2JUaW1lcGlja2VyTW9kdWxlLFxuICBOZ2JUaW1lcGlja2VyQ29uZmlnLFxuICBOZ2JUaW1lU3RydWN0LFxuICBOZ2JUaW1lcGlja2VyLFxuICBOZ2JUaW1lQWRhcHRlclxufSBmcm9tICcuL3RpbWVwaWNrZXIvdGltZXBpY2tlci5tb2R1bGUnO1xuZXhwb3J0IHtOZ2JUb29sdGlwTW9kdWxlLCBOZ2JUb29sdGlwQ29uZmlnLCBOZ2JUb29sdGlwfSBmcm9tICcuL3Rvb2x0aXAvdG9vbHRpcC5tb2R1bGUnO1xuZXhwb3J0IHtcbiAgTmdiSGlnaGxpZ2h0LFxuICBOZ2JUeXBlYWhlYWRNb2R1bGUsXG4gIE5nYlR5cGVhaGVhZENvbmZpZyxcbiAgTmdiVHlwZWFoZWFkU2VsZWN0SXRlbUV2ZW50LFxuICBOZ2JUeXBlYWhlYWRcbn0gZnJvbSAnLi90eXBlYWhlYWQvdHlwZWFoZWFkLm1vZHVsZSc7XG5cbmV4cG9ydCB7UGxhY2VtZW50fSBmcm9tICcuL3V0aWwvcG9zaXRpb25pbmcnO1xuXG5jb25zdCBOR0JfTU9EVUxFUyA9IFtcbiAgTmdiQWNjb3JkaW9uTW9kdWxlLCBOZ2JBbGVydE1vZHVsZSwgTmdiQnV0dG9uc01vZHVsZSwgTmdiQ2Fyb3VzZWxNb2R1bGUsIE5nYkNvbGxhcHNlTW9kdWxlLCBOZ2JEYXRlcGlja2VyTW9kdWxlLFxuICBOZ2JEcm9wZG93bk1vZHVsZSwgTmdiTW9kYWxNb2R1bGUsIE5nYlBhZ2luYXRpb25Nb2R1bGUsIE5nYlBvcG92ZXJNb2R1bGUsIE5nYlByb2dyZXNzYmFyTW9kdWxlLCBOZ2JSYXRpbmdNb2R1bGUsXG4gIE5nYlRhYnNldE1vZHVsZSwgTmdiVGltZXBpY2tlck1vZHVsZSwgTmdiVG9vbHRpcE1vZHVsZSwgTmdiVHlwZWFoZWFkTW9kdWxlXG5dO1xuXG4vKipcbiAqIE5nYlJvb3RNb2R1bGUgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IE5nYk1vZHVsZVxuICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICpcbiAqIEBkZXByZWNhdGVkIDMuMC4wXG4gKi9cbkBOZ01vZHVsZSh7aW1wb3J0czogW05HQl9NT0RVTEVTXSwgZXhwb3J0czogTkdCX01PRFVMRVN9KVxuZXhwb3J0IGNsYXNzIE5nYlJvb3RNb2R1bGUge1xufVxuXG5ATmdNb2R1bGUoe2ltcG9ydHM6IE5HQl9NT0RVTEVTLCBleHBvcnRzOiBOR0JfTU9EVUxFU30pXG5leHBvcnQgY2xhc3MgTmdiTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYlJvb3RNb2R1bGV9OyB9XG59XG4iXSwibmFtZXMiOlsibmV4dElkIiwiTkdCX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IiLCJtb2QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsbUJBQTBCLEtBQVU7SUFDbEMsT0FBTyxRQUFRLENBQUMsR0FBRyxLQUFLLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztDQUNqQzs7Ozs7QUFFRCxrQkFBeUIsS0FBVTtJQUNqQyxP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RSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxjQUFjO0lBRTlFLGNBQWMsRUFBRSxjQUFjLEVBQUUsY0FB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Q0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7O0lBQzVFLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQ0EsS0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDOztJQUN6QyxNQUFNLElBQUksR0FBRyxHQUFHLENBQUNBLEtBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUNyQyxNQUFNLE1BQU0sR0FBR0EsS0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztJQUN4QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6RCxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0NBQzFDOzs7Ozs7O0FBU0QsMkJBQTJCLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVTs7SUFDM0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBR0EsS0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxRQUFRLENBQUM7SUFDMUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUNqRSxPQUFPLENBQUMsQ0FBQztDQUNWOzs7OztBQVVELHdCQUF3QixlQUF1Qjs7SUFDN0MsSUFBSSxFQUFFLEdBQUcsaUJBQWlCLENBQUMsZUFBZSxDQUFDLENBQUMsV0FBVyxFQUFFLENBRzNCOztJQUg5QixJQUVJLFVBQVUsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUNLOztJQUg5QixJQUUyQixDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUNuQjs7SUFIOUIsSUFFbUQsWUFBWSxHQUFHLGlCQUFpQixDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUNyRTs7SUFIOUIsSUFFcUcsU0FBUyxDQUNoRjs7SUFIOUIsSUFHSSxXQUFXLENBQWU7O0lBSDlCLElBR2lCLFlBQVksQ0FBQzs7SUFHOUIsWUFBWSxHQUFHLGVBQWUsR0FBRyxZQUFZLENBQUM7SUFDOUMsSUFBSSxZQUFZLElBQUksQ0FBQyxFQUFFO1FBQ3JCLElBQUksWUFBWSxJQUFJLEdBQUcsRUFBRTs7WUFFdkIsV0FBVyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLFNBQVMsR0FBR0EsS0FBRyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3hEO2FBQU07O1lBRUwsWUFBWSxJQUFJLEdBQUcsQ0FBQztTQUNyQjtLQUNGO1NBQU07O1FBRUwsVUFBVSxJQUFJLENBQUMsQ0FBQztRQUNoQixZQUFZLElBQUksR0FBRyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7WUFDaEIsWUFBWSxJQUFJLENBQUMsQ0FBQztTQUNuQjtLQUNGO0lBQ0QsV0FBVyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLFNBQVMsR0FBR0EsS0FBRyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdEMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0NBQ3hEOzs7Ozs7O0FBU0Qsd0JBQXdCLEtBQWEsRUFBRSxNQUFjLEVBQUUsSUFBWTs7SUFDakUsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RCLE9BQU8saUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztDQUMzRzs7Ozs7OztBQUtELHlCQUF5QixLQUFhLEVBQUUsSUFBWTtJQUNsRCxJQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDZCxPQUFPLEVBQUUsQ0FBQztLQUNYO0lBQ0QsSUFBSSxLQUFLLElBQUksRUFBRSxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7UUFDM0IsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUNELE9BQU8sRUFBRSxDQUFDO0NBQ1g7Ozs7OztBQ2xPRCx3QkFRZ0MsU0FBUSxXQUFXOzs7O0lBQ2pELGNBQWMsS0FBSyxPQUFPLENBQUMsQ0FBQyxFQUFFOzs7O0lBRTlCLFNBQVMsS0FBSyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFOzs7O0lBRS9ELGdCQUFnQixLQUFLLE9BQU8sQ0FBQyxDQUFDLEVBQUU7Ozs7Ozs7SUFFaEMsT0FBTyxDQUFDLElBQWEsRUFBRSxTQUFvQixHQUFHLEVBQUUsTUFBTSxHQUFHLENBQUM7UUFDeEQsSUFBSSxHQUFHLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFcEQsUUFBUSxNQUFNO1lBQ1osS0FBSyxHQUFHO2dCQUNOLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQy9DLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sSUFBSSxDQUFDO1lBQ2QsS0FBSyxHQUFHO2dCQUNOLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUM7Z0JBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDO2dCQUNiLE9BQU8sSUFBSSxDQUFDO1lBQ2QsS0FBSyxHQUFHO2dCQUNOLE9BQU8sWUFBWSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxDQUFDO1lBQy9DO2dCQUNFLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7S0FDRjs7Ozs7OztJQUVELE9BQU8sQ0FBQyxJQUFhLEVBQUUsU0FBb0IsR0FBRyxFQUFFLE1BQU0sR0FBRyxDQUFDLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFOzs7OztJQUUzRyxVQUFVLENBQUMsSUFBYTs7UUFDdEIsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOztRQUV2QyxPQUFPLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUM1Qjs7Ozs7O0lBRUQsYUFBYSxDQUFDLElBQWUsRUFBRSxjQUFzQjs7UUFFbkQsSUFBSSxjQUFjLEtBQUssQ0FBQyxFQUFFO1lBQ3hCLGNBQWMsR0FBRyxDQUFDLENBQUM7U0FDcEI7O1FBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsSUFBSSxDQUFDLENBQUM7O1FBQ25ELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7UUFFakMsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7UUFDOUQsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDOztRQUM5QixNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2hGOzs7O0lBRUQsUUFBUSxLQUFjLE9BQU8sYUFBYSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFOzs7OztJQUV6RCxPQUFPLENBQUMsSUFBYTtRQUNuQixPQUFPLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDL0UsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDekM7OztZQXpERixVQUFVOzs7Ozs7O0FDUFg7Ozs7Ozs7O0lBc0RFLE9BQU8sT0FBTyxLQUEwQixPQUFPLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUMsRUFBRTs7O1lBdEJsRixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGFBQWEsRUFBRSxzQkFBc0IsRUFBRSx1QkFBdUIsRUFBRSw2QkFBNkIsRUFBRSxvQkFBb0I7b0JBQ25ILGtCQUFrQjtpQkFDbkI7Z0JBQ0QsT0FBTyxFQUFFLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDO2dCQUM1QyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDO2dCQUNwQyxTQUFTLEVBQUU7b0JBQ1QsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBQztvQkFDdEQsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxFQUFFLHdCQUF3QixFQUFDO29CQUNoRSxFQUFDLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxRQUFRLEVBQUUseUJBQXlCLEVBQUM7b0JBQ3RFLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsb0JBQW9CLEVBQUM7aUJBQzFEO2dCQUNELGVBQWUsRUFBRSxDQUFDLGFBQWEsQ0FBQzthQUNqQzs7Ozs7OztBQzlDRDs7Ozs7QUFTQTs7eUJBQzhDLElBQUk7eUJBQ3BCLGFBQWE7Ozs7WUFIMUMsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs7Ozs7QUNSaEM7OztBQTRCQTs7Ozs7O0lBSUUsWUFDa0QsUUFBUSxFQUFVLFdBQW9DLEVBQzVGO1FBRHNDLGFBQVEsR0FBUixRQUFRLENBQUE7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDNUYsY0FBUyxHQUFULFNBQVM7eUJBTEUsUUFBUTtzQkFDdEIsS0FBSztLQUlzQjs7Ozs7SUFFcEMsV0FBVyxDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTs7Ozs7O0lBRXRGLFFBQVEsQ0FBQyxTQUFTLEVBQUUsU0FBUztRQUMzQixJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQzdGOzs7OztJQUVELGNBQWMsQ0FBQyxVQUFxQjs7UUFFbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsRixJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7Ozs7UUFLNUIsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5RTthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQ2hGO0tBQ0Y7OztZQWhDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtnQkFDN0IsSUFBSSxFQUFFLEVBQUMsdUJBQXVCLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsRUFBRSxXQUFXLEVBQUM7YUFDaEg7Ozs7NENBTU0sTUFBTSxTQUFDLFVBQVUsQ0FBQyxNQUFNLFdBQVcsQ0FBQztZQTFCekMsVUFBVTtZQUdWLFNBQVM7Ozs7Ozs7Ozs7QUE2RFg7Ozs7O0lBR0UsWUFBMEQsUUFBUSxFQUFVLFdBQW9DO1FBQXRELGFBQVEsR0FBUixRQUFRLENBQUE7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFDOUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDO0tBQzNDOzs7OztJQUVELFdBQVcsQ0FBQyxNQUFNLElBQUksT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUU7OztZQVh2RixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLEVBQUM7YUFDekc7Ozs7NENBSWMsTUFBTSxTQUFDLFVBQVUsQ0FBQyxNQUFNLFdBQVcsQ0FBQztZQW5FakQsVUFBVTs7Ozs7O0FBd0ZaLHVCQUErQixTQUFRLGlCQUFpQjs7Ozs7SUFDdEQsWUFBbUQsUUFBUSxFQUFFLFVBQW1DO1FBQzlGLEtBQUssQ0FBQyxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDN0I7Ozs7SUFFRCxVQUFVLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFOzs7WUFmekMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLElBQUksRUFBRTtvQkFDSixPQUFPLEVBQUUsaUJBQWlCO29CQUMxQixlQUFlLEVBQUUsTUFBTTtvQkFDdkIsc0JBQXNCLEVBQUUsbUJBQW1CO29CQUMzQyxTQUFTLEVBQUUsY0FBYztpQkFDMUI7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxNQUFNLGlCQUFpQixDQUFDLEVBQUMsQ0FBQzthQUM1Rjs7Ozs0Q0FFYyxNQUFNLFNBQUMsVUFBVSxDQUFDLE1BQU0sV0FBVyxDQUFDO1lBekZqRCxVQUFVOzs7OztBQW9HWjs7Ozs7OztJQW9DRSxZQUNZLGlCQUFvQyxNQUF5QixFQUE0QixTQUFjLEVBQ3ZHO1FBREEsb0JBQWUsR0FBZixlQUFlO1FBQTBFLGNBQVMsR0FBVCxTQUFTLENBQUs7UUFDdkcsWUFBTyxHQUFQLE9BQU87d0JBckNBLElBQUksT0FBTyxFQUFROzs7O3FCQW1CZixLQUFLOzs7OzswQkFjTCxJQUFJLFlBQVksRUFBRTtRQUt2QyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUN0Rjs7OztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxzQkFBSSxJQUFJLENBQUMsU0FBc0IsQ0FBQSxDQUFDLENBQUM7U0FDOUc7UUFFRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtLQUNGOzs7OztJQUtELE1BQU0sS0FBYyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTs7Ozs7SUFLeEMsSUFBSTtRQUNGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1NBQzFCO0tBQ0Y7Ozs7SUFFTyxpQkFBaUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7O2dCQUM3QixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQWdCLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDO3FCQUM1QyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O2dCQUVsRyxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQWEsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7cUJBQ3pDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFFeEcsSUFBSSxDQUFRLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztvQkFDL0YsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUM7aUJBQ3JDLENBQUMsQ0FBQyxDQUFDO2FBQ0wsQ0FBQyxDQUFDO1NBQ0o7Ozs7OztJQU1ILEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO0tBQ0Y7Ozs7O0lBS0QsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtLQUNGOzs7OztJQUVPLHFCQUFxQixDQUFDLEtBQWlCO1FBQzdDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDekQsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDdEUsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN4RSxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQzs7Ozs7SUFHZixXQUFXO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDdEM7Ozs7O0lBRU8sa0JBQWtCLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Ozs7O0lBRXJFLGdCQUFnQixDQUFDLE1BQU0sSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDOzs7O0lBRXRGLGFBQWE7UUFDbkIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMvQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDNUQ7Ozs7WUF4SUosU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUMsRUFBQzs7OztZQTdGakcsaUJBQWlCO1lBS1gsaUJBQWlCOzRDQThIcUQsTUFBTSxTQUFDLFFBQVE7WUF2STNGLE1BQU07OztvQkFzR0wsWUFBWSxTQUFDLGVBQWU7c0JBRTVCLFlBQVksU0FBQyxpQkFBaUI7d0JBUzlCLEtBQUs7b0JBS0wsS0FBSyxTQUFDLE1BQU07d0JBUVosS0FBSzt5QkFNTCxNQUFNOzs7Ozs7O0FDN0lUO0FBTUEsTUFBTSx1QkFBdUIsR0FBRyxDQUFDLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUdyRzs7Ozs7Ozs7SUFPRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQyxDQUFDLEVBQUU7OztZQVJoRixRQUFRLFNBQUMsRUFBQyxZQUFZLEVBQUUsdUJBQXVCLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFDOzs7Ozs7O0FDUm5GOzs7WUFFQyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osSUFBSSxFQUFFLEVBQUMsU0FBUyxFQUFFLHlFQUF5RSxFQUFDO2FBQzdGOzs7NEJBRUUsS0FBSzs7Ozs7Ozs7O0lDUE4saUJBQWM7SUFDZCxNQUFHOzt3Q0FESCxjQUFjO3dDQUNkLEdBQUc7Ozs7OztBQ0ZMOzs7Ozs7SUErQ0UsWUFBOEIsUUFBUSxFQUFVLE1BQStCLEVBQVUsU0FBb0I7UUFBN0QsV0FBTSxHQUFOLE1BQU0sQ0FBeUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFXO3dCQVJ2RSxJQUFJO3dCQUV0QixJQUFJOzRCQUlVLElBQUksWUFBWSxFQUFFO1FBR2xELElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDNUQ7Ozs7O0lBRUQsYUFBYSxDQUFDLE1BQU07UUFDbEIsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsS0FBSyxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ3pFLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDbEQ7S0FDRjs7Ozs7SUFFRCxNQUFNLENBQUMsTUFBTTtRQUNYLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRTtZQUM3QyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7Ozs7O0lBRUQsT0FBTyxDQUFDLE1BQU0sSUFBVSxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFOzs7O0lBRXpELFFBQVE7UUFDTixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDO1FBQ2pELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO0tBQzVEOzs7O0lBRUQsZUFBZTtRQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQy9ELElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN6RTtLQUNGOzs7O0lBRUQsV0FBVzs7UUFDVCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs7UUFDakMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQzs7UUFFdEMsSUFBSSxjQUFjLENBQUM7UUFDbkIsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7WUFDckUsY0FBYyxHQUFHLFdBQVcsQ0FBQztTQUM5QjthQUFNO1lBQ0wsY0FBYyxHQUFHLElBQUksQ0FBQztTQUN2QjtRQUNELGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWxELElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztLQUNoRDs7O1lBMUVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsa0JBQWtCO2dCQUM1QixJQUFJLEVBQUU7b0JBQ0osU0FBUyxFQUFFLG9FQUFvRTtvQkFDL0UsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixhQUFhLEVBQUUsZ0JBQWdCO29CQUMvQixTQUFTLEVBQUUsdUJBQXVCO29CQUNsQyx3QkFBd0IsRUFBRSxnQkFBZ0I7aUJBQzNDO2dCQUNELFFBQVEsRUFBRTs7OztLQUlQO2FBQ0o7Ozs7NENBZWMsTUFBTSxTQUFDLFFBQVE7WUF4QzVCLFVBQVU7WUFDVixTQUFTOzs7NkJBOEJSLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7bUJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUVMLE1BQU0sU0FBQyxTQUFTOzs7Ozs7O0FDN0NuQjs7Ozs7O0lBV0UsWUFBbUIsS0FBWSxFQUFTLE9BQWlCLEVBQVMsWUFBZ0M7UUFBL0UsVUFBSyxHQUFMLEtBQUssQ0FBTztRQUFTLFlBQU8sR0FBUCxPQUFPLENBQVU7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBb0I7S0FBSTtDQUN2Rzs7OztBQUVEOzs7Ozs7OztJQUlFLFlBQ1ksT0FBb0IsU0FBbUIsRUFBVSxpQkFBbUMsRUFDcEYsV0FBOEIseUJBQW1EO1FBRGpGLFVBQUssR0FBTCxLQUFLO1FBQWUsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUFVLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7UUFDcEYsY0FBUyxHQUFULFNBQVM7UUFBcUIsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtLQUFJOzs7Ozs7SUFFakcsSUFBSSxDQUFDLE9BQW1DLEVBQUUsT0FBYTtRQUNyRCxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FDcEQsSUFBSSxDQUFDLHlCQUF5QixDQUFDLHVCQUF1QixDQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFDeEYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjtRQUVELE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4Qjs7OztJQUVELEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUN4RixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUV2QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFO2dCQUM1QixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUN4RixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzthQUN6QjtTQUNGO0tBQ0Y7Ozs7OztJQUVPLGNBQWMsQ0FBQyxPQUFrQyxFQUFFLE9BQWE7UUFDdEUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDM0I7YUFBTSxJQUFJLE9BQU8sWUFBWSxXQUFXLEVBQUU7O1lBQ3pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsbUJBQWlCLE9BQU8sR0FBRSxPQUFPLENBQUMsQ0FBQztZQUM1RixPQUFPLElBQUksVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxPQUFPLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDcEU7O0NBRUo7Ozs7OztBQ3ZERDtBQUlBLE1BQU0sSUFBSSxHQUFHLFNBQVEsQ0FBQzs7Ozs7OztBQWdCdEI7Ozs7SUFDRSxZQUFzQyxTQUFTO1FBQVQsY0FBUyxHQUFULFNBQVMsQ0FBQTtLQUFJOzs7Ozs7OztJQVNuRCxVQUFVLEtBQTJCLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRTs7Ozs7OztJQU9yRyxXQUFXLENBQUMsS0FBYTs7UUFDL0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7O1FBQ2pDLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDOztRQUMvQyxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDakYsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxHQUFHLGFBQWEsR0FBRyxLQUFLLElBQUksQ0FBQztRQUMzRCxPQUFPLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxjQUFjLENBQUM7Ozs7Ozs7SUFRcEQsVUFBVTs7UUFDaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN6RCxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDOzs7Ozs7O0lBUTVDLFNBQVM7O1FBQ2YsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckQsUUFBUSxDQUFDLFNBQVMsR0FBRyx5QkFBeUIsQ0FBQzs7UUFFL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7UUFDM0IsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLHFCQUFxQixFQUFFLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDNUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUUzQixPQUFPLEtBQUssQ0FBQzs7OztZQWxEaEIsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs0Q0FFakIsTUFBTSxTQUFDLFFBQVE7Ozs7Ozs7Ozs7OztBQ1Y5Qjs7Ozs7O0lBSUUsS0FBSyxDQUFDLE1BQVksS0FBVTs7Ozs7O0lBSzVCLE9BQU8sQ0FBQyxNQUFZLEtBQVU7Q0FDL0I7Ozs7QUFLRDs7Ozs7OztJQXNCRSxZQUNZLGdCQUFzRCxXQUF1QixFQUM3RSxrQkFBMkQsY0FBeUI7UUFEcEYsbUJBQWMsR0FBZCxjQUFjO1FBQXdDLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQzdFLHFCQUFnQixHQUFoQixnQkFBZ0I7UUFBMkMsbUJBQWMsR0FBZCxjQUFjLENBQVc7UUFDOUYsY0FBYyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBVyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFM0YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFRLENBQUMsQ0FBQztLQUNsQzs7Ozs7O0lBeEJELElBQUksaUJBQWlCO1FBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLEVBQUU7WUFDakMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUM7U0FDL0M7S0FDRjs7Ozs7SUFHRCxJQUFJLGlCQUFpQixDQUFDLFFBQWEsS0FBSTs7Ozs7O0lBc0J2QyxLQUFLLENBQUMsTUFBWTtRQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztTQUM3QjtLQUNGOzs7OztJQUVPLFFBQVEsQ0FBQyxNQUFZO1FBQzNCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7Ozs7Ozs7SUFNOUIsT0FBTyxDQUFDLE1BQVk7UUFDbEIsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFO2dCQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZCO2lCQUFNOztnQkFDTCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7Z0JBQ3RDLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7b0JBQzNCLE9BQU8sQ0FBQyxJQUFJLENBQ1IsTUFBTTt3QkFDSixJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7NEJBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7eUJBQ3ZCO3FCQUNGLEVBQ0QsU0FBUSxDQUFDLENBQUM7aUJBQ2Y7cUJBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxFQUFFO29CQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUN2QjthQUNGO1NBQ0Y7S0FDRjs7OztJQUVPLG9CQUFvQjs7UUFDMUIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQ2xFLGNBQWMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUM7UUFFOUIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7O1lBQ3pCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUM7WUFDdEUsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzFELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNqQztRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRTtZQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNwQztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7O0NBRTNCOzs7Ozs7QUN0SEQ7Ozs7Ozs7SUF5QkUsWUFDWSxpQkFBeUMsU0FBbUIsRUFBNEIsU0FBUyxFQUNqRztRQURBLG9CQUFlLEdBQWYsZUFBZTtRQUEwQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQTRCLGNBQVMsR0FBVCxTQUFTLENBQUE7UUFDakcsZUFBVSxHQUFWLFVBQVU7aUNBTE0sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDO21DQUMzRSxDQUFDLGVBQWUsQ0FBQztLQUlWOzs7Ozs7OztJQUVyQyxJQUFJLENBQUMsU0FBbUMsRUFBRSxlQUF5QixFQUFFLE9BQVksRUFBRSxPQUFPOztRQUN4RixNQUFNLFdBQVcsR0FDYixTQUFTLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs7UUFFekcsTUFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBRS9ELElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQ0FBa0MsT0FBTyxDQUFDLFNBQVMsSUFBSSxNQUFNLDZCQUE2QixDQUFDLENBQUM7U0FDN0c7O1FBRUQsTUFBTSxXQUFXLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQzs7UUFDekMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFFBQVEsSUFBSSxlQUFlLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDOztRQUU3RyxJQUFJLGVBQWUsR0FDZixPQUFPLENBQUMsUUFBUSxLQUFLLEtBQUssR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsR0FBRyxJQUFJLENBQUM7O1FBQ3JGLElBQUksYUFBYSxHQUFpQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQzs7UUFDbEgsSUFBSSxXQUFXLEdBQWdCLElBQUksV0FBVyxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVsSCxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO1FBQzlFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFXLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDcEUsV0FBVyxDQUFDLE9BQU8sR0FBRyxDQUFDLE1BQVcsT0FBTyxXQUFXLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV4RSxJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUUxRCxJQUFJLGVBQWUsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFO1lBQy9DLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxXQUFXLENBQUM7S0FDcEI7Ozs7OztJQUVPLGVBQWUsQ0FBQyxTQUFtQyxFQUFFLFdBQWdCOztRQUMzRSxJQUFJLGVBQWUsR0FBRyxTQUFTLENBQUMsdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7UUFDMUUsSUFBSSxlQUFlLEdBQUcsZUFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFELFdBQVcsQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRSxPQUFPLGVBQWUsQ0FBQzs7Ozs7Ozs7SUFHakIsc0JBQXNCLENBQUMsU0FBbUMsRUFBRSxXQUFnQixFQUFFLFVBQWU7O1FBRW5HLElBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxjQUFjLENBQUMsQ0FBQzs7UUFDdEUsSUFBSSxhQUFhLEdBQUcsYUFBYSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEQsV0FBVyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzlELE9BQU8sYUFBYSxDQUFDOzs7Ozs7O0lBR2YsbUJBQW1CLENBQUMsY0FBOEIsRUFBRSxPQUFlO1FBQ3pFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxVQUFrQjtZQUNoRCxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTtnQkFDbEMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNsRDtTQUNGLENBQUMsQ0FBQzs7Ozs7OztJQUdHLHFCQUFxQixDQUFDLGdCQUFrQyxFQUFFLE9BQWU7UUFDL0UsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQWtCO1lBQ2xELElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO2dCQUNsQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDcEQ7U0FDRixDQUFDLENBQUM7Ozs7Ozs7OztJQUdHLGNBQWMsQ0FDbEIsU0FBbUMsRUFBRSxlQUF5QixFQUFFLE9BQVksRUFDNUUsT0FBdUI7UUFDekIsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNaLE9BQU8sSUFBSSxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDM0I7YUFBTSxJQUFJLE9BQU8sWUFBWSxXQUFXLEVBQUU7WUFDekMsT0FBTyxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3REO2FBQU0sSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDNUIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDeEM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2hGOzs7Ozs7O0lBR0ssc0JBQXNCLENBQUMsT0FBeUIsRUFBRSxPQUF1Qjs7UUFDL0UsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7OztJQUc5QyxpQkFBaUIsQ0FBQyxPQUFlOztRQUN2QyxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxHQUFHLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7SUFHL0Isb0JBQW9CLENBQ3hCLFNBQW1DLEVBQUUsZUFBeUIsRUFBRSxPQUFZLEVBQzVFLE9BQXVCOztRQUN6QixNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7UUFDdEUsTUFBTSxvQkFBb0IsR0FDdEIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLFNBQVMsRUFBRSxDQUFDLEVBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQzs7UUFDMUcsTUFBTSxZQUFZLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELE9BQU8sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDOzs7O1lBekd2RyxVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7O1lBbEI5QixjQUFjO1lBRWQsUUFBUTs0Q0FzQm1FLE1BQU0sU0FBQyxRQUFRO1lBWnBGLFNBQVM7Ozs7Ozs7O0FDZGpCOzs7O0FBMEVBOzs7Ozs7SUFDRSxZQUNZLFlBQThDLFNBQW1CLEVBQVUsV0FBMEI7UUFBckcsZUFBVSxHQUFWLFVBQVU7UUFBb0MsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFlO0tBQUk7Ozs7Ozs7Ozs7SUFRckgsSUFBSSxDQUFDLE9BQVksRUFBRSxVQUEyQixFQUFFO1FBQzlDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNqRjs7O1lBYkYsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7OztZQXpFRix3QkFBd0I7WUFBbEMsUUFBUTtZQUVwQixhQUFhOzs7Ozs7OztBQ0ZyQjs7Ozs7Ozs7SUFzQkUsT0FBTyxPQUFPLEtBQTBCLE9BQU8sRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFDLENBQUMsRUFBRTs7O1lBWjdFLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7Z0JBQ2hELGVBQWUsRUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQztnQkFDbkQsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO2FBQ3RCOzs7Ozs7O0FDZEQ7Ozs7O0FBUUE7O3dCQUNhLEtBQUs7NkJBQ0EsS0FBSzs4QkFDSixJQUFJO3dCQUNWLElBQUk7dUJBQ0wsQ0FBQzt3QkFDQSxFQUFFO3NCQUNKLEtBQUs7Ozs7WUFSZixVQUFVLFNBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzs7Ozs7OztBQ1BoQzs7O0FBb0RBOzs7O0lBK0RFLFlBQVksTUFBMkI7eUJBOUQzQixDQUFDO3FCQUNLLEVBQUU7Ozs7b0JBeUNKLENBQUM7Ozs7Ozs7MEJBYU0sSUFBSSxZQUFZLENBQVMsSUFBSSxDQUFDO1FBUW5ELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUM7UUFDMUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzVDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7S0FDekI7Ozs7SUFFRCxXQUFXLEtBQWMsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFOzs7O0lBRWhELE9BQU8sS0FBYyxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFOzs7OztJQUV6RCxVQUFVLENBQUMsVUFBa0IsSUFBVSxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUU7Ozs7O0lBRXZFLFdBQVcsQ0FBQyxPQUFzQixJQUFVLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7Ozs7O0lBRTNFLFVBQVUsQ0FBQyxVQUFVLElBQWEsT0FBTyxVQUFVLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7OztJQUtyRCxjQUFjLENBQUMsS0FBYSxFQUFFLEdBQVc7UUFDL0MsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDYixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDeEI7Z0JBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDdkI7WUFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUN4QixJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUM5QixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNyQjtnQkFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDakM7U0FDRjs7Ozs7Ozs7Ozs7SUFXSyxjQUFjOztRQUNwQixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7O1FBQ2QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7UUFDekIsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDOztRQUM5QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUM7UUFFdkUsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLFVBQVUsRUFBRTs7WUFFM0IsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDcEI7YUFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEVBQUU7O1lBRWxELEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7U0FDdkM7YUFBTTs7WUFFTCxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztTQUMvQjtRQUVELE9BQU8sQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7Ozs7OztJQU1kLGdCQUFnQjs7UUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7O1FBQ25ELElBQUksS0FBSyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDOztRQUNoQyxJQUFJLEdBQUcsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUUvQixPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7SUFHZCxlQUFlLENBQUMsU0FBUzs7UUFDL0IsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUUxRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2pDOzs7Ozs7SUFHSyxZQUFZLENBQUMsT0FBZTtRQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDcEI7O1FBR0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3BCOztRQUdELElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7O1FBRzlCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFOztZQUNyRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7O1lBQ2QsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7WUFHekIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUN0QztpQkFBTTtnQkFDTCxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQzthQUN4QztZQUVELElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDOztZQUcxQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNqQzs7OztZQXRPSixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUM7Z0JBQzVCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUNUO2FBQ0Y7Ozs7WUFqRE8sbUJBQW1COzs7dUJBeUR4QixLQUFLOzRCQUtMLEtBQUs7NkJBS0wsS0FBSzt1QkFLTCxLQUFLO3FCQU1MLEtBQUs7NkJBS0wsS0FBSztzQkFLTCxLQUFLO21CQUtMLEtBQUs7dUJBS0wsS0FBSzt5QkFRTCxNQUFNO21CQUtOLEtBQUs7Ozs7Ozs7QUNqSFI7Ozs7Ozs7O0lBZ0JFLE9BQU8sT0FBTyxLQUEwQixPQUFPLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUMsRUFBRTs7O1lBUmxGLFFBQVEsU0FBQyxFQUFDLFlBQVksRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDOzs7Ozs7O0FDUjVGOzs7OztJQUNFLFlBQW1CLElBQVksRUFBUyxLQUFjO1FBQW5DLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFTO1FBQ3BELElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztTQUNuQjtLQUNGOzs7O0lBRUQsUUFBUSxLQUFLLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxRQUFRLENBQUMsRUFBRTtDQUN6RTs7QUFFRCxNQUFNLGVBQWUsR0FBRztJQUN0QixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO0NBQ3RDLENBQUM7Ozs7OztBQUVGLHVCQUE4QixRQUFnQixFQUFFLE9BQU8sR0FBRyxlQUFlOztJQUN2RSxNQUFNLGVBQWUsR0FBRyxDQUFDLFFBQVEsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFFaEQsSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNoQyxPQUFPLEVBQUUsQ0FBQztLQUNYOztJQUVELE1BQU0sY0FBYyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVzs7UUFDckcsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQztRQUNuRCxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QyxDQUFDLENBQUM7O0lBRUgsTUFBTSxjQUFjLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFcEYsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM3QixNQUFNLDBEQUEwRCxDQUFDO0tBQ2xFO0lBRUQsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUM1RCxNQUFNLDBFQUEwRSxDQUFDO0tBQ2xGO0lBRUQsT0FBTyxjQUFjLENBQUM7Q0FDdkI7O0FBRUQsTUFBTSxNQUFNLEdBQUcsU0FBUSxDQUFDOzs7Ozs7Ozs7O0FBRXhCLDBCQUFpQyxRQUFhLEVBQUUsYUFBa0IsRUFBRSxRQUFnQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUTs7SUFDN0csTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztJQUMvQyxNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7SUFFckIsSUFBSSxjQUFjLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7UUFDL0QsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUVELGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFnQjtRQUN0QyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLEtBQUssRUFBRTtZQUNsQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUN4RTthQUFNO1lBQ0wsU0FBUyxDQUFDLElBQUksQ0FDVixRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNuSDtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sUUFBUSxTQUFTLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxhQUFhLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztDQUN2RTs7Ozs7O0FDM0REOzs7OztBQVNBOzt5QkFDOEMsSUFBSTt5QkFDcEIsS0FBSzt3QkFDdEIsT0FBTzs4QkFFRCxLQUFLOzs7O1lBTnZCLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7Ozs7O0FDUmhDO0FBZ0NBLElBQUlGLFFBQU0sR0FBRyxDQUFDLENBQUM7QUE0Q2Y7Ozs7O0lBTUUsWUFBb0IsUUFBaUMsRUFBVSxTQUFvQjtRQUEvRCxhQUFRLEdBQVIsUUFBUSxDQUF5QjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQVc7eUJBTG5ELEtBQUs7S0FLa0Q7Ozs7O0lBRXZGLGNBQWMsQ0FBQyxVQUFxQjs7UUFFbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzs7UUFHbkcsSUFBSSxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7O1FBRzVCLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDakc7Ozs7Ozs7O0lBU0QsV0FBVyxDQUFDLEtBQVksSUFBYSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsbUJBQUMsS0FBSyxDQUFDLE1BQXFCLEVBQUMsQ0FBQyxFQUFFOzs7WUF0RWpILFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLFNBQVMsRUFDTCx1SEFBdUg7b0JBQzNILE1BQU0sRUFBRSxTQUFTO29CQUNqQixNQUFNLEVBQUUsSUFBSTtpQkFDYjtnQkFDRCxRQUFRLEVBQUU7O3VHQUUyRjtnQkFDckcsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0QlIsQ0FBQzthQUNIOzs7O1lBN0RDLFVBQVU7WUFGVixTQUFTOzs7d0JBaUVSLEtBQUs7b0JBQ0wsS0FBSztpQkFDTCxLQUFLOzJCQUNMLEtBQUs7Ozs7O0FBK0JSOzs7Ozs7Ozs7OztJQXlFRSxZQUNZLGFBQThDLFNBQW9CLEVBQUUsUUFBa0IsRUFDOUYsd0JBQWtELEVBQUUsZ0JBQWtDLEVBQUUsTUFBd0IsRUFDeEcsU0FBMkMsU0FBYztRQUZ6RCxnQkFBVyxHQUFYLFdBQVc7UUFBbUMsY0FBUyxHQUFULFNBQVMsQ0FBVztRQUVsRSxZQUFPLEdBQVAsT0FBTztRQUFvQyxjQUFTLEdBQVQsU0FBUyxDQUFLOzs7O3FCQXhCbkQsSUFBSSxZQUFZLEVBQUU7Ozs7c0JBSWpCLElBQUksWUFBWSxFQUFFO21DQUVQLGVBQWVBLFFBQU0sRUFBRSxFQUFFO1FBbUJyRCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzVDLElBQUksQ0FBQyxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQztRQUN4QyxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksWUFBWSxDQUNqQyxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLHdCQUF3QixDQUFDLENBQUM7UUFFdkYsSUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1lBQ2xELElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUNuQyxnQkFBZ0IsQ0FDWixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFDdEYsSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7SUEvQk8sV0FBVztRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLEVBQUU7WUFDdkIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUMxQyxPQUFPLElBQUksQ0FBQztTQUNiO1FBQ0QsT0FBTyxLQUFLLENBQUM7Ozs7Ozs7O0lBOEJmLElBQUksQ0FBQyxPQUFhO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNwRSxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUNuRCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztZQUMxRCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1lBRXZELElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRTFHLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLEVBQUU7Z0JBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbEc7O1lBR0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDOztZQUdqRCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQ25DLGdCQUFnQixDQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUN0RixJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFcEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDOztvQkFLN0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUN0QixxQkFBcUIsQ0FBQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQzs7b0JBRWhELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBZ0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7eUJBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7b0JBRWhHLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBYSxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQzt5QkFDekMsSUFBSSxDQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFDakQsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU1RSxJQUFJLENBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3hGLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQjtLQUNGOzs7OztJQUtELEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztZQUNuRixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDcEI7S0FDRjs7Ozs7SUFLRCxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtLQUNGOzs7OztJQUtELE1BQU0sS0FBYyxPQUFPLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLEVBQUU7Ozs7SUFFckQsUUFBUTtRQUNOLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxnQkFBZ0IsQ0FDMUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUMxRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQzdCOzs7OztJQUVELFdBQVcsQ0FBQyxPQUFzQjs7UUFFaEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3pHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0tBQ0Y7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3RDOzs7OztJQUVPLHFCQUFxQixDQUFDLEtBQWlCO1FBQzdDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekUsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMzRSxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQzs7Ozs7O0lBR1AsbUJBQW1CLENBQUMsS0FBaUI7O1FBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLE9BQU8sS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDOzs7O1lBbk5uRCxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUM7Ozs7WUFoRzNELFVBQVU7WUFGVixTQUFTO1lBRFQsUUFBUTtZQU1SLHdCQUF3QjtZQUR4QixnQkFBZ0I7WUFjVixnQkFBZ0I7WUFadEIsTUFBTTs0Q0F5S3dCLE1BQU0sU0FBQyxRQUFROzs7d0JBaEU1QyxLQUFLO3lCQUlMLEtBQUs7MkJBSUwsS0FBSzt3QkFPTCxLQUFLO3VCQUlMLEtBQUs7d0JBS0wsS0FBSzs2QkFNTCxLQUFLOzJCQU1MLEtBQUs7b0JBSUwsTUFBTTtxQkFJTixNQUFNOzs7Ozs7O0FDdktUOzs7Ozs7OztJQWdCRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDLEVBQUU7OztZQVIvRSxRQUFRLFNBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxlQUFlLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFDOzs7Ozs7O0FDUnBIOzs7OztBQVFBOzttQkFDUSxHQUFHO3dCQUNFLEtBQUs7dUJBQ04sS0FBSzt5QkFFSCxLQUFLOzs7O1lBTmxCLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7Ozs7O0FDUGhDOzs7QUFvQkE7Ozs7SUFxQ0UsWUFBWSxNQUE0Qjs7OztxQkFQdkIsQ0FBQztRQVFoQixJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztLQUM3Qjs7OztJQUVELFFBQVEsS0FBSyxPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFOzs7O0lBRTVELGVBQWUsS0FBSyxPQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFOzs7WUE3RC9ELFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsUUFBUSxFQUFFOzs7Ozs7OztHQVFUO2FBQ0Y7Ozs7WUFqQk8sb0JBQW9COzs7a0JBc0J6QixLQUFLO3VCQU1MLEtBQUs7c0JBS0wsS0FBSzt3QkFLTCxLQUFLO21CQUtMLEtBQUs7b0JBS0wsS0FBSztxQkFLTCxLQUFLOzs7Ozs7O0FDdkRSOzs7Ozs7OztJQWdCRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBQyxDQUFDLEVBQUU7OztZQVJuRixRQUFRLFNBQUMsRUFBQyxZQUFZLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBQzs7Ozs7OztBQ1I5Rjs7Ozs7QUFRQTs7bUJBQ1EsRUFBRTt3QkFDRyxLQUFLOzBCQUNILEtBQUs7Ozs7WUFKbkIsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs7Ozs7QUNQaEM7QUFrQ0EsTUFBTSx5QkFBeUIsR0FBRztJQUNoQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsTUFBTSxTQUFTLENBQUM7SUFDeEMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOzs7O0FBZ0NGOzs7OztJQXNERSxZQUFZLE1BQXVCLEVBQVUsa0JBQXFDO1FBQXJDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBbUI7d0JBcERoRCxFQUFFO3dCQUN6QixLQUFLOzs7OztxQkFrQ0UsSUFBSSxZQUFZLEVBQVU7Ozs7O3FCQU0xQixJQUFJLFlBQVksRUFBVTs7Ozs7MEJBTXJCLElBQUksWUFBWSxDQUFTLElBQUksQ0FBQzt3QkFFMUMsQ0FBQyxDQUFNLFFBQU87eUJBQ2IsU0FBUTtRQUdsQixJQUFJLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO0tBQ2pDOzs7O0lBRUQsYUFBYSxLQUFLLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxXQUFXLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFOzs7OztJQUVqRSxLQUFLLENBQUMsS0FBYTtRQUNqQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMxQjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hCOzs7O0lBRUQsVUFBVSxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFOzs7OztJQUVsQyxXQUFXLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsRUFBRTs7Ozs7SUFFL0YsYUFBYSxDQUFDLEtBQW9CO1FBQ2hDLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM5QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFFdkIsUUFBUSxLQUFLLENBQUMsS0FBSztnQkFDakIsS0FBSyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUNuQixLQUFLLEdBQUcsQ0FBQyxTQUFTO29CQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLE1BQU07Z0JBQ1IsS0FBSyxHQUFHLENBQUMsT0FBTyxDQUFDO2dCQUNqQixLQUFLLEdBQUcsQ0FBQyxVQUFVO29CQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLE1BQU07Z0JBQ1IsS0FBSyxHQUFHLENBQUMsSUFBSTtvQkFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNmLE1BQU07Z0JBQ1IsS0FBSyxHQUFHLENBQUMsR0FBRztvQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsTUFBTTthQUNUO1NBQ0Y7S0FDRjs7Ozs7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7S0FDRjs7OztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztRQUNoRixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5Qjs7Ozs7SUFFRCxnQkFBZ0IsQ0FBQyxFQUF1QixJQUFVLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUU7Ozs7O0lBRXZFLGlCQUFpQixDQUFDLEVBQWEsSUFBVSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFOzs7O0lBRS9ELEtBQUs7UUFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDOUI7Ozs7O0lBRUQsZ0JBQWdCLENBQUMsVUFBbUIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFOzs7Ozs7SUFFckUsTUFBTSxDQUFDLEtBQWEsRUFBRSxjQUFjLEdBQUcsSUFBSTs7UUFDekMsTUFBTSxPQUFPLEdBQUcsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRTtZQUM3RCxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakM7UUFDRCxJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5Qjs7Ozs7SUFFRCxVQUFVLENBQUMsS0FBSztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQzFCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUN4Qzs7Ozs7SUFFTyxhQUFhLENBQUMsS0FBYTs7UUFDakMsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7UUFFbkMsSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFO1lBQ2IsT0FBTyxHQUFHLENBQUM7U0FDWjtRQUNELElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakQ7UUFFRCxPQUFPLENBQUMsQ0FBQzs7Ozs7O0lBR0gsWUFBWSxDQUFDLFNBQWlCO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO1FBQzFCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssS0FBSyxPQUFPLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7OztZQWpMdkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxlQUFlO29CQUN4QixVQUFVLEVBQUUsR0FBRztvQkFDZixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsZUFBZSxFQUFFLEdBQUc7b0JBQ3BCLHNCQUFzQixFQUFFLEtBQUs7b0JBQzdCLHNCQUFzQixFQUFFLFVBQVU7b0JBQ2xDLHVCQUF1QixFQUFFLGlCQUFpQjtvQkFDMUMsc0JBQXNCLEVBQUUsd0JBQXdCO29CQUNoRCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsV0FBVyxFQUFFLHVCQUF1QjtvQkFDcEMsY0FBYyxFQUFFLFNBQVM7aUJBQzFCO2dCQUNELFFBQVEsRUFBRTs7Ozs7Ozs7R0FRVDtnQkFDRCxTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQzthQUN2Qzs7OztZQXZETyxlQUFlO1lBRnJCLGlCQUFpQjs7O2tCQW9FaEIsS0FBSzttQkFLTCxLQUFLO3VCQUtMLEtBQUs7eUJBS0wsS0FBSzsyQkFNTCxLQUFLLFlBQUksWUFBWSxTQUFDLFdBQVc7b0JBTWpDLE1BQU07b0JBTU4sTUFBTTt5QkFNTixNQUFNOzs7Ozs7O0FDdkhUOzs7Ozs7OztJQWdCRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQyxFQUFFOzs7WUFSOUUsUUFBUSxTQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUM7Ozs7Ozs7QUNScEY7Ozs7O0FBUUE7O3VCQUMrRCxPQUFPOzJCQUMzQixZQUFZO29CQUM1QixNQUFNOzs7O1lBSmhDLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7Ozs7O0FDUGhDO0FBY0EsSUFBSUEsUUFBTSxHQUFHLENBQUMsQ0FBQzs7OztBQU1mOzs7O0lBQ0UsWUFBbUIsV0FBNkI7UUFBN0IsZ0JBQVcsR0FBWCxXQUFXLENBQWtCO0tBQUk7OztZQUZyRCxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsMEJBQTBCLEVBQUM7Ozs7WUFiL0MsV0FBVzs7Ozs7QUFzQmI7Ozs7SUFDRSxZQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7S0FBSTs7O1lBRnJELFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSw0QkFBNEIsRUFBQzs7OztZQXJCakQsV0FBVzs7Ozs7QUE4QmI7Ozs7O2tCQUlnQixXQUFXQSxRQUFNLEVBQUUsRUFBRTs7Ozt3QkFRZixLQUFLOzs7OztJQVF6QixxQkFBcUI7Ozs7O1FBS25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztLQUMxQzs7O1lBNUJGLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUM7OztpQkFLN0IsS0FBSztvQkFJTCxLQUFLO3VCQUlMLEtBQUs7d0JBS0wsZUFBZSxTQUFDLFdBQVcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUM7MEJBQ2pELGVBQWUsU0FBQyxhQUFhLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFDOzs7OztBQStEdEQ7Ozs7SUE4Q0UsWUFBWSxNQUF1Qjs7Ozs2QkFqQ1YsSUFBSTs7Ozt5QkErQlAsSUFBSSxZQUFZLEVBQXFCO1FBR3pELElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQ3ZDOzs7Ozs7OztJQTlCRCxJQUNJLE9BQU8sQ0FBQyxTQUE0RDtRQUN0RSxJQUFJLFNBQVMsS0FBSyxNQUFNLElBQUksU0FBUyxLQUFLLFdBQVcsRUFBRTtZQUNyRCxJQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sU0FBUyxFQUFFLENBQUM7U0FDeEM7YUFBTTtZQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsbUJBQW1CLFNBQVMsRUFBRSxDQUFDO1NBQ3BEO0tBQ0Y7Ozs7Ozs7SUE2QkQsTUFBTSxDQUFDLEtBQWE7O1FBQ2xCLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsSUFBSSxXQUFXLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssV0FBVyxDQUFDLEVBQUUsRUFBRTs7WUFDNUUsSUFBSSxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7WUFFN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQ2YsRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLEVBQUUsRUFBRSxjQUFjLEVBQUUsUUFBUSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUUzRyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxDQUFDLEVBQUUsQ0FBQzthQUNoQztTQUNGO0tBQ0Y7Ozs7SUFFRCxxQkFBcUI7O1FBRW5CLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxHQUFHLFNBQVMsQ0FBQyxFQUFFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0tBQzNGOzs7OztJQUVPLFdBQVcsQ0FBQyxFQUFVOztRQUM1QixJQUFJLFVBQVUsR0FBYSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUNsRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQzs7OztZQTFHbkQsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCVDthQUNGOzs7O1lBeEdPLGVBQWU7OzttQkE0R3BCLGVBQWUsU0FBQyxNQUFNO3VCQUt0QixLQUFLOzRCQUtMLEtBQUs7c0JBT0wsS0FBSzswQkFhTCxLQUFLO21CQU1MLEtBQUs7d0JBS0wsTUFBTTs7Ozs7OztBQ2pLVDtBQVFBLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUc5RTs7Ozs7Ozs7SUFPRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxlQUFlLEVBQUMsQ0FBQyxFQUFFOzs7WUFSOUUsUUFBUSxTQUFDLEVBQUMsWUFBWSxFQUFFLHFCQUFxQixFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBQzs7Ozs7OztBQ1Z4Rzs7Ozs7O0lBT0UsWUFBWSxJQUFhLEVBQUUsTUFBZSxFQUFFLE1BQWU7UUFDekQsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakM7Ozs7O0lBRUQsVUFBVSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRTs7Ozs7SUFFcEYsVUFBVSxDQUFDLElBQVk7UUFDckIsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO1NBQ2hEO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztTQUNqQjtLQUNGOzs7OztJQUVELFlBQVksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUU7Ozs7O0lBRTVGLFlBQVksQ0FBQyxNQUFjO1FBQ3pCLElBQUksUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUMvRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1NBQ25CO0tBQ0Y7Ozs7O0lBRUQsWUFBWSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRTs7Ozs7SUFFNUYsWUFBWSxDQUFDLE1BQWM7UUFDekIsSUFBSSxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDMUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzVDO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztTQUNuQjtLQUNGOzs7OztJQUVELE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSTtRQUN0QixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNuRzs7OztJQUVELFFBQVEsS0FBSyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO0NBQ25GOzs7Ozs7QUNsREQ7Ozs7O0FBUUE7O3dCQUNhLEtBQUs7d0JBQ0wsSUFBSTt1QkFDTCxLQUFLO3dCQUNKLENBQUM7MEJBQ0MsQ0FBQzswQkFDRCxDQUFDO3dCQUNILEtBQUs7OEJBQ0MsS0FBSztvQkFDZSxRQUFROzs7O1lBVjlDLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7Ozs7O0FDUGhDOzs7Ozs7Ozs7O0FBYUE7OztZQURDLFVBQVU7OzBCQWV1QixTQUFRLGNBQTZCOzs7Ozs7SUFJckUsU0FBUyxDQUFDLElBQW1CO1FBQzNCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUMxRCxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxFQUFDO1lBQzNGLElBQUksQ0FBQztLQUNWOzs7Ozs7SUFLRCxPQUFPLENBQUMsSUFBbUI7UUFDekIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzFELEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUM7WUFDM0YsSUFBSSxDQUFDO0tBQ1Y7OztZQWxCRixVQUFVOzs7Ozs7O0FDMUJYO0FBUUEsTUFBTSw2QkFBNkIsR0FBRztJQUNwQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsTUFBTSxhQUFhLENBQUM7SUFDNUMsS0FBSyxFQUFFLElBQUk7Q0FDWixDQUFDOzs7O0FBc0lGOzs7OztJQTZDRSxZQUFZLE1BQTJCLEVBQVUsZUFBb0M7UUFBcEMsb0JBQWUsR0FBZixlQUFlLENBQXFCO3dCQVkxRSxDQUFDLENBQU0sUUFBTzt5QkFDYixTQUFRO1FBWmxCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDcEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7UUFDNUMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0tBQ3pCOzs7OztJQUtELFVBQVUsQ0FBQyxLQUFLOztRQUNkLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFELElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxHQUFHLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUNqSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRTtZQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDdkI7S0FDRjs7Ozs7SUFFRCxnQkFBZ0IsQ0FBQyxFQUF1QixJQUFVLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUU7Ozs7O0lBRXZFLGlCQUFpQixDQUFDLEVBQWEsSUFBVSxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFOzs7OztJQUUvRCxnQkFBZ0IsQ0FBQyxVQUFtQixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLEVBQUU7Ozs7O0lBRXJFLFVBQVUsQ0FBQyxJQUFZO1FBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0tBQzdCOzs7OztJQUVELFlBQVksQ0FBQyxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0tBQzdCOzs7OztJQUVELFlBQVksQ0FBQyxJQUFZO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0tBQzdCOzs7OztJQUVELFVBQVUsQ0FBQyxNQUFjOztRQUN2QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7O1FBQ25DLE1BQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxJQUFJLFdBQVcsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksV0FBVyxLQUFLLEVBQUUsQ0FBQyxFQUFFO1lBQzlFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUMsQ0FBQztTQUN6QzthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7U0FDcEM7UUFDRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztLQUM3Qjs7Ozs7SUFFRCxZQUFZLENBQUMsTUFBYztRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztLQUM3Qjs7Ozs7SUFFRCxZQUFZLENBQUMsTUFBYztRQUN6QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztLQUM3Qjs7OztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUNyQjtLQUNGOzs7OztJQUVELFVBQVUsQ0FBQyxLQUFhO1FBQ3RCLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ25CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsT0FBTyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQzthQUN0RDtpQkFBTTtnQkFDTCxPQUFPLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDLENBQUM7YUFDOUI7U0FDRjthQUFNO1lBQ0wsT0FBTyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7S0FDRjs7Ozs7SUFFRCxZQUFZLENBQUMsS0FBYSxJQUFJLE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Ozs7SUFFeEQsa0JBQWtCLEtBQUssT0FBTyxFQUFDLGlCQUFpQixFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFFLGlCQUFpQixFQUFFLElBQUksQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFDLENBQUMsRUFBRTs7OztJQUVySCxhQUFhLEtBQUssT0FBTyxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUMsQ0FBQyxFQUFFOzs7OztJQUc5RixXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNyRixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDdEIsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xDO0tBQ0Y7Ozs7O0lBRU8sb0JBQW9CLENBQUMsT0FBTyxHQUFHLElBQUk7UUFDekMsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUNwQyxJQUFJLENBQUMsUUFBUSxDQUNULElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEg7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNuRDs7OztZQXhSSixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGdCQUFnQjtnQkFDMUIsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkRSLENBQUM7Z0JBQ0YsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0VUO2dCQUNELFNBQVMsRUFBRSxDQUFDLDZCQUE2QixDQUFDO2FBQzNDOzs7O1lBNUlPLG1CQUFtQjtZQUNuQixjQUFjOzs7dUJBb0puQixLQUFLO3VCQUtMLEtBQUs7c0JBS0wsS0FBSzt1QkFLTCxLQUFLO3lCQUtMLEtBQUs7eUJBS0wsS0FBSzs2QkFLTCxLQUFLO21CQUtMLEtBQUs7Ozs7Ozs7QUM3TFI7Ozs7Ozs7O0lBd0JFLE9BQU8sT0FBTyxLQUEwQixPQUFPLEVBQUMsUUFBUSxFQUFFLG1CQUFtQixFQUFDLENBQUMsRUFBRTs7O1lBYmxGLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzdCLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDeEIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFDLENBQUM7YUFDdkU7Ozs7Ozs7QUNoQkQ7Ozs7O0FBU0E7O3lCQUM4QyxJQUFJO3lCQUNwQixLQUFLO3dCQUN0QixPQUFPOzhCQUVELEtBQUs7Ozs7WUFOdkIsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs7Ozs7QUNSaEM7QUErQkEsSUFBSUEsUUFBTSxHQUFHLENBQUMsQ0FBQztBQXVDZjs7Ozs7SUFJRSxZQUFvQixRQUFpQyxFQUFVLFNBQW9CO1FBQS9ELGFBQVEsR0FBUixRQUFRLENBQXlCO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBVzt5QkFIbkQsS0FBSztLQUdrRDs7Ozs7SUFFdkYsY0FBYyxDQUFDLFVBQXFCOztRQUVsQyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNqSCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxhQUFhLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDOztRQUduRyxJQUFJLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQzs7UUFHNUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUNqRzs7Ozs7Ozs7SUFRRCxXQUFXLENBQUMsS0FBWSxJQUFhLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxtQkFBQyxLQUFLLENBQUMsTUFBcUIsRUFBQyxDQUFDLEVBQUU7OztZQTlEakgsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxJQUFJLEVBQUU7b0JBQ0osU0FBUyxFQUFFLGlGQUFpRjtvQkFDNUYsTUFBTSxFQUFFLFNBQVM7b0JBQ2pCLE1BQU0sRUFBRSxJQUFJO2lCQUNiO2dCQUNELFFBQVEsRUFBRSxxRkFBcUY7Z0JBQy9GLE1BQU0sRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCUixDQUFDO2FBQ0g7Ozs7WUF4REMsVUFBVTtZQUZWLFNBQVM7Ozt3QkE0RFIsS0FBSztpQkFDTCxLQUFLOzs7OztBQThCUjs7Ozs7Ozs7Ozs7SUFtREUsWUFDWSxhQUE4QyxTQUFvQixFQUFFLFFBQWtCLEVBQzlGLHdCQUFrRCxFQUFFLGdCQUFrQyxFQUFFLE1BQXdCLEVBQ3hHLFNBQTJDLFNBQWM7UUFGekQsZ0JBQVcsR0FBWCxXQUFXO1FBQW1DLGNBQVMsR0FBVCxTQUFTLENBQVc7UUFFbEUsWUFBTyxHQUFQLE9BQU87UUFBb0MsY0FBUyxHQUFULFNBQVMsQ0FBSzs7OztxQkFoQm5ELElBQUksWUFBWSxFQUFFOzs7O3NCQUlqQixJQUFJLFlBQVksRUFBRTttQ0FHUCxlQUFlQSxRQUFNLEVBQUUsRUFBRTtRQVVyRCxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO1FBQzVDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQ2pDLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUV2RixJQUFJLENBQUMsaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDbEQsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQ25DLGdCQUFnQixDQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUN0RixJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDckM7U0FDRixDQUFDLENBQUM7S0FDSjs7Ozs7O0lBS0QsSUFDSSxVQUFVLENBQUMsS0FBZ0M7UUFDN0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDekIsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0tBQ0Y7Ozs7SUFFRCxJQUFJLFVBQVUsS0FBSyxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRTs7Ozs7OztJQU03QyxJQUFJLENBQUMsT0FBYTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNoRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUV2RCxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxrQkFBa0IsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUUxRyxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssTUFBTSxFQUFFO2dCQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQ2xHO1lBRUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQzs7WUFHeEcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUNsRCxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLFlBQVksRUFBRSxDQUFDOztZQUdqRCxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQ25DLGdCQUFnQixDQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUN0RixJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFFcEMsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDOztvQkFLN0IsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUN0QixxQkFBcUIsQ0FBQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQzs7b0JBRWhELE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBZ0IsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7eUJBQzVDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7b0JBRWhHLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBYSxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQzt5QkFDekMsSUFBSSxDQUNELFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFDakQsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUU1RSxJQUFJLENBQVEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3hGLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQjtLQUNGOzs7OztJQUtELEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxFQUFFO1lBQzNCLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLGtCQUFrQixDQUFDLENBQUM7WUFDbkYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO0tBQ0Y7Ozs7O0lBS0QsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDZDthQUFNO1lBQ0wsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ2I7S0FDRjs7Ozs7SUFLRCxNQUFNLEtBQWMsT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxFQUFFOzs7O0lBRXJELFFBQVE7UUFDTixJQUFJLENBQUMsc0JBQXNCLEdBQUcsZ0JBQWdCLENBQzFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFDMUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUM3Qjs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7OztRQUdiLElBQUksSUFBSSxDQUFDLHNCQUFzQixFQUFFO1lBQy9CLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3RDOzs7OztJQUVPLHFCQUFxQixDQUFDLEtBQWlCO1FBQzdDLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLElBQUksRUFBRTtnQkFDM0IsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDekUsT0FBTyxJQUFJLENBQUM7YUFDYjtpQkFBTSxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUMzRSxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQzs7Ozs7O0lBR1AsbUJBQW1CLENBQUMsS0FBaUI7O1FBQzNDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLE9BQU8sS0FBSyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDOzs7O1lBdE1uRCxTQUFTLFNBQUMsRUFBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUM7Ozs7WUF4RjNELFVBQVU7WUFGVixTQUFTO1lBRFQsUUFBUTtZQU1SLHdCQUF3QjtZQUR4QixnQkFBZ0I7WUFjVixnQkFBZ0I7WUFadEIsTUFBTTs0Q0EySXdCLE1BQU0sU0FBQyxRQUFROzs7d0JBMUM1QyxLQUFLO3dCQU9MLEtBQUs7dUJBSUwsS0FBSzt3QkFLTCxLQUFLOzZCQU1MLEtBQUs7b0JBSUwsTUFBTTtxQkFJTixNQUFNO3lCQWtDTixLQUFLOzs7Ozs7O0FDbExSOzs7Ozs7O0lBZUUsT0FBTyxPQUFPLEtBQTBCLE9BQU8sRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUMsQ0FBQyxFQUFFOzs7WUFQL0UsUUFBUSxTQUFDLEVBQUMsWUFBWSxFQUFFLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsZUFBZSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBQzs7Ozs7OztBQ1JwSDs7OztBQW1CQTs7Ozs7OEJBTTRCLGVBQWU7Ozs7OztJQVl6QyxXQUFXLENBQUMsT0FBc0I7O1FBQ2hDLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O1FBQ3hDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7UUFDekMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7UUFDakQsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUk7O2dCQUM1RSxNQUFNLFlBQVksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQy9ELFVBQVUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUMxQixPQUFPLFlBQVksQ0FBQzthQUNyQixDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzFCO0tBQ0Y7OztZQTdDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGVBQWU7Z0JBQ3pCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUUsZ0VBQWdFO29CQUN0RSxrSEFBa0g7b0JBQ2xILGdCQUFnQjs7Z0JBQ3BCLE1BQU0sRUFBRSxDQUFDOzs7O0dBSVIsQ0FBQzthQUNIOzs7NkJBT0UsS0FBSztxQkFLTCxLQUFLO21CQUtMLEtBQUs7Ozs7Ozs7QUNuQ1I7O3lCQXdDYyxDQUFDOzs7OzBCQVdTLElBQUk7Ozs7O3lCQWdCTCxRQUFROzs7OzJCQVVHLElBQUksWUFBWSxFQUFFO2lDQUVOLElBQUksWUFBWSxFQUFFOzs7OztJQUU5RCxTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTs7OztJQUVuRixTQUFTLEtBQUssT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFOzs7OztJQUVwRCxVQUFVLENBQUMsU0FBaUI7UUFDMUIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDM0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQ3ZCOzs7O0lBRUQsSUFBSTtRQUNGLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDcEY7YUFBTTtZQUNMLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNsQjtRQUNELElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7OztJQUVELElBQUk7UUFDRixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLENBQUMsRUFBRTtZQUMvQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDbEI7UUFDRCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDdkI7Ozs7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7S0FDdkI7Ozs7O0lBRUQsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFOzs7O0lBRTdDLFFBQVEsS0FBSyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRTs7OztJQUUxQixjQUFjO1FBQ3BCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQzs7OztZQXJHakcsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUM7Z0JBQ3RFLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7R0FjVDthQUNGOzs7aUJBUUUsS0FBSzt5QkFLTCxLQUFLO3NCQUtMLEtBQUs7bUJBS0wsS0FBSzt3QkFNTCxLQUFLOzZCQUtMLEtBQUs7MEJBS0wsTUFBTSxTQUFDLFFBQVE7Z0NBRWYsTUFBTSxTQUFDLGNBQWM7Ozs7Ozs7QUMvRXhCO0FBUUEsTUFBYSxlQUFlLEdBQUcsSUFBSSxjQUFjLENBQzdDLHNCQUFzQixFQUFFLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsdUJBQXVCLEVBQUMsQ0FBQyxDQUFDOzs7O0FBQ3BGO0lBQ0UsT0FBTyxHQUFHLENBQUM7Q0FDWjs7Ozs7O0FBR0Qsd0JBQXdCLFFBQWEsRUFBRSxVQUFVLEdBQUcsS0FBSzs7SUFDdkQsSUFBSSxPQUFPLHFCQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBZ0IsRUFBQztJQUV0RSxJQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksVUFBVSxFQUFFO1FBQ2pDLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXhDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3ZDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTVDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3BDO0lBRUQsT0FBTyxPQUFPLENBQUM7Q0FDaEI7QUFLRDs7Ozs7SUFDRSxZQUFzQyxTQUFjLEVBQW1DLE1BQVc7UUFBNUQsY0FBUyxHQUFULFNBQVMsQ0FBSztRQUFtQyxXQUFNLEdBQU4sTUFBTSxDQUFLO0tBQUk7Ozs7SUFFdEcsV0FBVzs7UUFDVCxNQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDNUM7S0FDRjs7Ozs7SUFFRCxHQUFHLENBQUMsT0FBZTs7UUFDakIsTUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7O1FBQ3JELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFFMUIsT0FBTyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O1FBQ3pCLE1BQU0sT0FBTyxHQUFHLE1BQU0sT0FBTyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7UUFDcEQsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE9BQU8sRUFBRSxDQUFDO1NBQ1g7YUFBTTtZQUNMLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUI7S0FDRjs7O1lBdEJGLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7NENBRWpCLE1BQU0sU0FBQyxRQUFROzRDQUEyQixNQUFNLFNBQUMsZUFBZTs7Ozs7Ozs7QUNyQy9FOzs7OztBQVNBOzt3QkFFYSxJQUFJOzBCQUNGLElBQUk7d0JBQ04sS0FBSzt5QkFDWSxhQUFhOzs7O1lBTjFDLFVBQVUsU0FBQyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUM7Ozs7Ozs7O0FDUmhDO0FBNEJBLE1BQU0sNEJBQTRCLEdBQUc7SUFDbkMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLE1BQU0sWUFBWSxDQUFDO0lBQzNDLEtBQUssRUFBRSxJQUFJO0NBQ1osQ0FBQzs7QUFpQkYsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDOzs7O0FBeUJyQjs7Ozs7Ozs7Ozs7SUFnRkUsWUFDWSxhQUFtRCxpQkFBbUMsRUFDdEYsV0FBOEIsU0FBbUIsRUFBRSx3QkFBa0QsRUFDN0csTUFBMEIsRUFBRSxNQUFjLEVBQVUsS0FBVztRQUZ2RCxnQkFBVyxHQUFYLFdBQVc7UUFBd0Msc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFrQjtRQUN0RixjQUFTLEdBQVQsU0FBUztRQUFxQixjQUFTLEdBQVQsU0FBUyxDQUFVO1FBQ0wsVUFBSyxHQUFMLEtBQUssQ0FBTTs7Ozs7Ozs7NEJBbEUzQyxLQUFLOzs7Ozs7O3lCQWtEUSxhQUFhOzs7OzBCQUszQixJQUFJLFlBQVksRUFBK0I7dUJBRzVELGlCQUFpQixZQUFZLEVBQUUsRUFBRTswQkFFdEIsU0FBUTt5QkFDVCxDQUFDLENBQU0sUUFBTztRQU1oQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDO1FBRWxDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFRLFdBQVcsQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2FBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLG1CQUFDLE1BQU0sQ0FBQyxNQUEwQixHQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFekYsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZELElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxZQUFZLENBQ2pDLGtCQUFrQixFQUFFLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUUzRixJQUFJLENBQUMsaUJBQWlCLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7WUFDakQsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7Z0JBQ3RCLGdCQUFnQixDQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUN0RixJQUFJLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxDQUFDO2FBQ2hDO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7Ozs7SUFFRCxRQUFROztRQUNOLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLO1lBQ3BELElBQUksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7WUFDL0IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDLENBQUM7O1FBQ0osTUFBTSxRQUFRLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7O1FBQ3RELE1BQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7WUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDM0I7U0FDRixDQUFDLENBQUMsQ0FBQzs7UUFDSixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUN2RixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUM3RDs7OztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ3RDOzs7OztJQUVELGdCQUFnQixDQUFDLEVBQXVCLElBQVUsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRTs7Ozs7SUFFeEUsaUJBQWlCLENBQUMsRUFBYSxJQUFVLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDLEVBQUU7Ozs7O0lBRWhFLFVBQVUsQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7Ozs7O0lBRTdFLGdCQUFnQixDQUFDLFVBQW1CO1FBQ2xDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNwRjs7Ozs7SUFFRCxlQUFlLENBQUMsS0FBSztRQUNuQixJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1NBQ3JCO0tBQ0Y7Ozs7O0lBS0QsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQ3RCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDL0M7S0FDRjs7Ozs7SUFLRCxXQUFXLEtBQUssT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxFQUFFOzs7O0lBRWpELFVBQVU7UUFDUixJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjs7Ozs7SUFFRCxhQUFhLENBQUMsS0FBb0I7UUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN2QixPQUFPO1NBQ1I7UUFFRCxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDOUIsUUFBUSxLQUFLLENBQUMsS0FBSztnQkFDakIsS0FBSyxHQUFHLENBQUMsU0FBUztvQkFDaEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQixNQUFNO2dCQUNSLEtBQUssR0FBRyxDQUFDLE9BQU87b0JBQ2QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUN2QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO29CQUNqQixNQUFNO2dCQUNSLEtBQUssR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFDZixLQUFLLEdBQUcsQ0FBQyxHQUFHOztvQkFDVixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztvQkFDcEQsSUFBSSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7d0JBQ3JCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQzt3QkFDdkIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO3dCQUN4QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO3FCQUM1QjtvQkFDRCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQ25CLE1BQU07Z0JBQ1IsS0FBSyxHQUFHLENBQUMsTUFBTTtvQkFDYixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3ZCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3RDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDcEIsTUFBTTthQUNUO1NBQ0Y7S0FDRjs7OztJQUVPLFVBQVU7UUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUN2QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1lBQzlELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUMzQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBVyxLQUFLLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3RHLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQWdCLEtBQUssSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBRTdHLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxNQUFNLEVBQUU7Z0JBQzdCLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7YUFDbkc7U0FDRjs7Ozs7SUFHSyxXQUFXO1FBQ2pCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQzs7Ozs7O0lBRzVCLGFBQWEsQ0FBQyxNQUFXOztRQUMvQixJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLFFBQVEsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7UUFDekYsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV0QyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDckIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3hCOzs7Ozs7SUFHSyx1QkFBdUIsQ0FBQyxNQUFXO1FBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOzs7OztJQUdiLFNBQVM7UUFDZixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksSUFBSSxDQUFDLGlCQUFpQixJQUFJLElBQUksRUFBRTs7WUFDM0YsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7O1lBQ2hFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1lBRXBGLElBQUksa0JBQWtCLEtBQUssWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUFFO2dCQUM5RixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25HLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUMsS0FBSyxDQUNyRCxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDM0Y7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0Y7Ozs7OztJQUdLLG1CQUFtQixDQUFDLElBQVM7UUFDbkMsT0FBTyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7OztJQUdsRixnQkFBZ0IsQ0FBQyxLQUFhO1FBQ3BDLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0lBRy9FLHFCQUFxQixDQUFDLFVBQTZCO1FBQ3pELE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU87WUFDbEMsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3JFLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7aUJBQzNEO2dCQUNELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtvQkFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7aUJBQy9EO2dCQUNELElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDOzs7O2dCQUt2QyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUVsRCxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7YUFDbEI7O1lBR0QsTUFBTSxLQUFLLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsc0JBQXNCLEdBQUcsR0FBRyxLQUFLLFVBQVUsS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQztTQUM3RyxDQUFDLENBQUM7Ozs7O0lBR0cseUJBQXlCO1FBQy9CLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7Ozs7WUE1VDdCLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUscUJBQXFCO2dCQUMvQixRQUFRLEVBQUUsY0FBYztnQkFDeEIsSUFBSSxFQUFFO29CQUNKLFFBQVEsRUFBRSxjQUFjO29CQUN4QixjQUFjLEVBQUUsZUFBZTtvQkFDL0Isa0JBQWtCLEVBQUUseUJBQXlCO29CQUM3QyxXQUFXLEVBQUUsdUJBQXVCO29CQUNwQyxnQkFBZ0IsRUFBRSxjQUFjO29CQUNoQyxnQkFBZ0IsRUFBRSxLQUFLO29CQUN2QixhQUFhLEVBQUUsS0FBSztvQkFDcEIsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLGdCQUFnQixFQUFFLE9BQU87b0JBQ3pCLDBCQUEwQixFQUFFLDRCQUE0QjtvQkFDeEQsOEJBQThCLEVBQUUsa0JBQWtCO29CQUNsRCxrQkFBa0IsRUFBRSxnQ0FBZ0M7b0JBQ3BELHNCQUFzQixFQUFFLGVBQWU7aUJBQ3hDO2dCQUNELFNBQVMsRUFBRSxDQUFDLDRCQUE0QixDQUFDO2FBQzFDOzs7O1lBckVDLFVBQVU7WUFXVixnQkFBZ0I7WUFGaEIsU0FBUztZQU5ULFFBQVE7WUFOUix3QkFBd0I7WUF3QmxCLGtCQUFrQjtZQWhCeEIsTUFBTTtZQWVBLElBQUk7OzsyQkFtRVQsS0FBSzt3QkFNTCxLQUFLO3VCQUtMLEtBQUs7eUJBS0wsS0FBSzs2QkFLTCxLQUFLOzJCQU1MLEtBQUs7OEJBTUwsS0FBSzs2QkFLTCxLQUFLO3VCQUtMLEtBQUs7d0JBT0wsS0FBSzt5QkFLTCxNQUFNOzs7Ozs7O0FDbEpUOzs7Ozs7OztJQXlCRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxrQkFBa0IsRUFBQyxDQUFDLEVBQUU7OztZQWJqRixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsQ0FBQztnQkFDOUQsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztnQkFDckMsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUN2QixlQUFlLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQzthQUN0Qzs7Ozs7OztBQ2pCRDtBQXlGQSxNQUFNLFdBQVcsR0FBRztJQUNsQixrQkFBa0IsRUFBRSxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CO0lBQy9HLGlCQUFpQixFQUFFLGNBQWMsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxvQkFBb0IsRUFBRSxlQUFlO0lBQy9HLGVBQWUsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxrQkFBa0I7Q0FDM0UsQ0FBQzs7Ozs7OztBQVNGOzs7WUFEQyxRQUFRLFNBQUMsRUFBQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFDOztBQUt4RDs7Ozs7Ozs7SUFPRSxPQUFPLE9BQU8sS0FBMEIsT0FBTyxFQUFDLFFBQVEsRUFBRSxhQUFhLEVBQUMsQ0FBQyxFQUFFOzs7WUFSNUUsUUFBUSxTQUFDLEVBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFDOzs7Ozs7Ozs7OyJ9