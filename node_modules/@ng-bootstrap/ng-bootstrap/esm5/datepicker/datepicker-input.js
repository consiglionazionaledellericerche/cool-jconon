/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, Input, ElementRef, ViewContainerRef, Renderer2, ComponentFactoryResolver, NgZone, TemplateRef, forwardRef, EventEmitter, Output, Inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { NgbDate } from './ngb-date';
import { NgbDatepicker } from './datepicker';
import { NgbDateParserFormatter } from './ngb-date-parser-formatter';
import { positionElements } from '../util/positioning';
import { ngbFocusTrap } from '../util/focus-trap';
import { Key } from '../util/key';
import { NgbDateAdapter } from './adapters/ngb-date-adapter';
import { NgbCalendar } from './ngb-calendar';
import { NgbDatepickerService } from './datepicker-service';
import { Subject, fromEvent, race, NEVER } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
/** @type {?} */
var NGB_DATEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(function () { return NgbInputDatepicker; }),
    multi: true
};
/** @type {?} */
var NGB_DATEPICKER_VALIDATOR = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(function () { return NgbInputDatepicker; }),
    multi: true
};
/**
 * A directive that makes it possible to have datepickers on input fields.
 * Manages integration with the input field itself (data entry) and ngModel (validation etc.).
 */
var NgbInputDatepicker = /** @class */ (function () {
    function NgbInputDatepicker(_parserFormatter, _elRef, _vcRef, _renderer, _cfr, _ngZone, _service, _calendar, _dateAdapter, _document) {
        var _this = this;
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
        this._onChange = function (_) { };
        this._onTouched = function () { };
        this._validatorChange = function () { };
        this._zoneSubscription = _ngZone.onStable.subscribe(function () {
            if (_this._cRef) {
                positionElements(_this._elRef.nativeElement, _this._cRef.location.nativeElement, _this.placement, _this.container === 'body');
            }
        });
    }
    Object.defineProperty(NgbInputDatepicker.prototype, "disabled", {
        get: /**
         * @return {?}
         */
        function () {
            return this._disabled;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._disabled = value === '' || (value && value !== 'false');
            if (this.isOpen()) {
                this._cRef.instance.setDisabledState(this._disabled);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onChange = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnTouched = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._onTouched = fn; };
    /**
     * @param {?} fn
     * @return {?}
     */
    NgbInputDatepicker.prototype.registerOnValidatorChange = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) { this._validatorChange = fn; };
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    NgbInputDatepicker.prototype.setDisabledState = /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) { this.disabled = isDisabled; };
    /**
     * @param {?} c
     * @return {?}
     */
    NgbInputDatepicker.prototype.validate = /**
     * @param {?} c
     * @return {?}
     */
    function (c) {
        /** @type {?} */
        var value = c.value;
        if (value === null || value === undefined) {
            return null;
        }
        /** @type {?} */
        var ngbDate = this._fromDateStruct(this._dateAdapter.fromModel(value));
        if (!this._calendar.isValid(ngbDate)) {
            return { 'ngbDate': { invalid: c.value } };
        }
        if (this.minDate && ngbDate.before(NgbDate.from(this.minDate))) {
            return { 'ngbDate': { requiredBefore: this.minDate } };
        }
        if (this.maxDate && ngbDate.after(NgbDate.from(this.maxDate))) {
            return { 'ngbDate': { requiredAfter: this.maxDate } };
        }
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NgbInputDatepicker.prototype.writeValue = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        this._model = this._fromDateStruct(this._dateAdapter.fromModel(value));
        this._writeModelValue(this._model);
    };
    /**
     * @param {?} value
     * @param {?=} updateView
     * @return {?}
     */
    NgbInputDatepicker.prototype.manualDateChange = /**
     * @param {?} value
     * @param {?=} updateView
     * @return {?}
     */
    function (value, updateView) {
        if (updateView === void 0) { updateView = false; }
        this._model = this._fromDateStruct(this._parserFormatter.parse(value));
        this._onChange(this._model ? this._dateAdapter.toModel(this._model) : (value === '' ? null : value));
        if (updateView && this._model) {
            this._writeModelValue(this._model);
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.isOpen = /**
     * @return {?}
     */
    function () { return !!this._cRef; };
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     */
    /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     * @return {?}
     */
    NgbInputDatepicker.prototype.open = /**
     * Opens the datepicker with the selected date indicated by the ngModel value.
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.isOpen()) {
            /** @type {?} */
            var cf = this._cfr.resolveComponentFactory(NgbDatepicker);
            this._cRef = this._vcRef.createComponent(cf);
            this._applyPopupStyling(this._cRef.location.nativeElement);
            this._applyDatepickerInputs(this._cRef.instance);
            this._subscribeForDatepickerOutputs(this._cRef.instance);
            this._cRef.instance.ngOnInit();
            this._cRef.instance.writeValue(this._dateAdapter.toModel(this._model));
            // date selection event handling
            this._cRef.instance.registerOnChange(function (selectedDate) {
                _this.writeValue(selectedDate);
                _this._onChange(selectedDate);
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
            this._ngZone.runOutsideAngular(function () {
                /** @type {?} */
                var escapes$ = fromEvent(_this._document, 'keyup')
                    .pipe(takeUntil(_this._closed$), filter(function (e) { return e.which === Key.Escape; }));
                /** @type {?} */
                var outsideClicks$;
                if (_this.autoClose === true || _this.autoClose === 'outside') {
                    /** @type {?} */
                    var isOpening_1 = true;
                    requestAnimationFrame(function () { return isOpening_1 = false; });
                    outsideClicks$ =
                        fromEvent(_this._document, 'click')
                            .pipe(takeUntil(_this._closed$), filter(function (event) { return !isOpening_1 && _this._shouldCloseOnOutsideClick(event); }));
                }
                else {
                    outsideClicks$ = NEVER;
                }
                race([escapes$, outsideClicks$]).subscribe(function () { return _this._ngZone.run(function () { return _this.close(); }); });
            });
        }
    };
    /**
     * Closes the datepicker popup.
     */
    /**
     * Closes the datepicker popup.
     * @return {?}
     */
    NgbInputDatepicker.prototype.close = /**
     * Closes the datepicker popup.
     * @return {?}
     */
    function () {
        if (this.isOpen()) {
            this._vcRef.remove(this._vcRef.indexOf(this._cRef.hostView));
            this._cRef = null;
            this._closed$.next();
        }
    };
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     */
    /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     * @return {?}
     */
    NgbInputDatepicker.prototype.toggle = /**
     * Toggles the datepicker popup (opens when closed and closes when opened).
     * @return {?}
     */
    function () {
        if (this.isOpen()) {
            this.close();
        }
        else {
            this.open();
        }
    };
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     */
    /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    NgbInputDatepicker.prototype.navigateTo = /**
     * Navigates current view to provided date.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided calendar will open current month.
     * Use 'startDate' input as an alternative
     * @param {?=} date
     * @return {?}
     */
    function (date) {
        if (this.isOpen()) {
            this._cRef.instance.navigateTo(date);
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.onBlur = /**
     * @return {?}
     */
    function () { this._onTouched(); };
    /**
     * @param {?} changes
     * @return {?}
     */
    NgbInputDatepicker.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes['minDate'] || changes['maxDate']) {
            this._validatorChange();
        }
    };
    /**
     * @return {?}
     */
    NgbInputDatepicker.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.close();
        this._zoneSubscription.unsubscribe();
    };
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    NgbInputDatepicker.prototype._applyDatepickerInputs = /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    function (datepickerInstance) {
        var _this = this;
        ['dayTemplate', 'displayMonths', 'firstDayOfWeek', 'markDisabled', 'minDate', 'maxDate', 'navigation',
            'outsideDays', 'showNavigation', 'showWeekdays', 'showWeekNumbers']
            .forEach(function (optionName) {
            if (_this[optionName] !== undefined) {
                datepickerInstance[optionName] = _this[optionName];
            }
        });
        datepickerInstance.startDate = this.startDate || this._model;
    };
    /**
     * @param {?} nativeElement
     * @return {?}
     */
    NgbInputDatepicker.prototype._applyPopupStyling = /**
     * @param {?} nativeElement
     * @return {?}
     */
    function (nativeElement) {
        this._renderer.addClass(nativeElement, 'dropdown-menu');
        this._renderer.setStyle(nativeElement, 'padding', '0');
        this._renderer.addClass(nativeElement, 'show');
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgbInputDatepicker.prototype._shouldCloseOnOutsideClick = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        return ![this._elRef.nativeElement, this._cRef.location.nativeElement].some(function (el) { return el.contains(event.target); });
    };
    /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    NgbInputDatepicker.prototype._subscribeForDatepickerOutputs = /**
     * @param {?} datepickerInstance
     * @return {?}
     */
    function (datepickerInstance) {
        var _this = this;
        datepickerInstance.navigate.subscribe(function (date) { return _this.navigate.emit(date); });
        datepickerInstance.select.subscribe(function (date) {
            _this.dateSelect.emit(date);
            if (_this.autoClose === true || _this.autoClose === 'inside') {
                _this.close();
            }
        });
    };
    /**
     * @param {?} model
     * @return {?}
     */
    NgbInputDatepicker.prototype._writeModelValue = /**
     * @param {?} model
     * @return {?}
     */
    function (model) {
        this._renderer.setProperty(this._elRef.nativeElement, 'value', this._parserFormatter.format(model));
        if (this.isOpen()) {
            this._cRef.instance.writeValue(this._dateAdapter.toModel(model));
            this._onTouched();
        }
    };
    /**
     * @param {?} date
     * @return {?}
     */
    NgbInputDatepicker.prototype._fromDateStruct = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        /** @type {?} */
        var ngbDate = date ? new NgbDate(date.year, date.month, date.day) : null;
        return this._calendar.isValid(ngbDate) ? ngbDate : null;
    };
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
                    providers: [NGB_DATEPICKER_VALUE_ACCESSOR, NGB_DATEPICKER_VALIDATOR, NgbDatepickerService]
                },] },
    ];
    /** @nocollapse */
    NgbInputDatepicker.ctorParameters = function () { return [
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
    ]; };
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
    return NgbInputDatepicker;
}());
export { NgbInputDatepicker };
if (false) {
    /** @type {?} */
    NgbInputDatepicker.prototype._closed$;
    /** @type {?} */
    NgbInputDatepicker.prototype._cRef;
    /** @type {?} */
    NgbInputDatepicker.prototype._disabled;
    /** @type {?} */
    NgbInputDatepicker.prototype._model;
    /** @type {?} */
    NgbInputDatepicker.prototype._zoneSubscription;
    /**
     * Indicates whether the datepicker popup should be closed automatically after date selection / outside click or not.
     *
     * By default the popup will close on both date selection and outside click. If the value is 'false' the popup has to
     * be closed manually via '.close()' or '.toggle()' methods. If the value is set to 'inside' the popup will close on
     * date selection only. For the 'outside' the popup will close only on the outside click.
     *
     * \@since 3.0.0
     * @type {?}
     */
    NgbInputDatepicker.prototype.autoClose;
    /**
     * Reference for the custom template for the day display
     * @type {?}
     */
    NgbInputDatepicker.prototype.dayTemplate;
    /**
     * Number of months to display
     * @type {?}
     */
    NgbInputDatepicker.prototype.displayMonths;
    /**
     * First day of the week. With default calendar we use ISO 8601: 1=Mon ... 7=Sun
     * @type {?}
     */
    NgbInputDatepicker.prototype.firstDayOfWeek;
    /**
     * Callback to mark a given date as disabled.
     * 'Current' contains the month that will be displayed in the view
     * @type {?}
     */
    NgbInputDatepicker.prototype.markDisabled;
    /**
     * Min date for the navigation. If not provided will be 10 years before today or `startDate`
     * @type {?}
     */
    NgbInputDatepicker.prototype.minDate;
    /**
     * Max date for the navigation. If not provided will be 10 years from today or `startDate`
     * @type {?}
     */
    NgbInputDatepicker.prototype.maxDate;
    /**
     * Navigation type: `select` (default with select boxes for month and year), `arrows`
     * (without select boxes, only navigation arrows) or `none` (no navigation at all)
     * @type {?}
     */
    NgbInputDatepicker.prototype.navigation;
    /**
     * The way to display days that don't belong to current month: `visible` (default),
     * `hidden` (not displayed) or `collapsed` (not displayed with empty space collapsed)
     * @type {?}
     */
    NgbInputDatepicker.prototype.outsideDays;
    /**
     * Placement of a datepicker popup accepts:
     *    "top", "top-left", "top-right", "bottom", "bottom-left", "bottom-right",
     *    "left", "left-top", "left-bottom", "right", "right-top", "right-bottom"
     * and array of above values.
     * @type {?}
     */
    NgbInputDatepicker.prototype.placement;
    /**
     * Whether to display days of the week
     * @type {?}
     */
    NgbInputDatepicker.prototype.showWeekdays;
    /**
     * Whether to display week numbers
     * @type {?}
     */
    NgbInputDatepicker.prototype.showWeekNumbers;
    /**
     * Date to open calendar with.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
     * If nothing or invalid date provided, calendar will open with current month.
     * Use 'navigateTo(date)' as an alternative
     * @type {?}
     */
    NgbInputDatepicker.prototype.startDate;
    /**
     * A selector specifying the element the datepicker popup should be appended to.
     * Currently only supports "body".
     * @type {?}
     */
    NgbInputDatepicker.prototype.container;
    /**
     * An event fired when user selects a date using keyboard or mouse.
     * The payload of the event is currently selected NgbDate.
     *
     * \@since 1.1.1
     * @type {?}
     */
    NgbInputDatepicker.prototype.dateSelect;
    /**
     * An event fired when navigation happens and currently displayed month changes.
     * See NgbDatepickerNavigateEvent for the payload info.
     * @type {?}
     */
    NgbInputDatepicker.prototype.navigate;
    /** @type {?} */
    NgbInputDatepicker.prototype._onChange;
    /** @type {?} */
    NgbInputDatepicker.prototype._onTouched;
    /** @type {?} */
    NgbInputDatepicker.prototype._validatorChange;
    /** @type {?} */
    NgbInputDatepicker.prototype._parserFormatter;
    /** @type {?} */
    NgbInputDatepicker.prototype._elRef;
    /** @type {?} */
    NgbInputDatepicker.prototype._vcRef;
    /** @type {?} */
    NgbInputDatepicker.prototype._renderer;
    /** @type {?} */
    NgbInputDatepicker.prototype._cfr;
    /** @type {?} */
    NgbInputDatepicker.prototype._ngZone;
    /** @type {?} */
    NgbInputDatepicker.prototype._service;
    /** @type {?} */
    NgbInputDatepicker.prototype._calendar;
    /** @type {?} */
    NgbInputDatepicker.prototype._dateAdapter;
    /** @type {?} */
    NgbInputDatepicker.prototype._document;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pbnB1dC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9kYXRlcGlja2VyLWlucHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUNULEtBQUssRUFFTCxVQUFVLEVBQ1YsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCx3QkFBd0IsRUFDeEIsTUFBTSxFQUNOLFdBQVcsRUFDWCxVQUFVLEVBQ1YsWUFBWSxFQUNaLE1BQU0sRUFJTixNQUFNLEVBQ1AsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFtRCxpQkFBaUIsRUFBRSxhQUFhLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsSCxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsYUFBYSxFQUE2QixNQUFNLGNBQWMsQ0FBQztBQUV2RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUVuRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQWlCLE1BQU0scUJBQXFCLENBQUM7QUFDckUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxHQUFHLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFFaEMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzNELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxzQkFBc0IsQ0FBQztBQUUxRCxPQUFPLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBQyxNQUFNLEVB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SUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQzs7O2dCQXJWM0QsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLFFBQVEsRUFBRSxlQUFlO29CQUN6QixJQUFJLEVBQUU7d0JBQ0osU0FBUyxFQUFFLHVDQUF1Qzt3QkFDbEQsVUFBVSxFQUFFLDZDQUE2Qzt3QkFDekQsUUFBUSxFQUFFLFVBQVU7d0JBQ3BCLFlBQVksRUFBRSxVQUFVO3FCQUN6QjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyw2QkFBNkIsRUFBRSx3QkFBd0IsRUFBRSxvQkFBb0IsQ0FBQztpQkFDM0Y7Ozs7Z0JBdkNPLHNCQUFzQjtnQkFwQjVCLFVBQVU7Z0JBQ1YsZ0JBQWdCO2dCQUNoQixTQUFTO2dCQUNULHdCQUF3QjtnQkFDeEIsTUFBTTtnQkF3QkEsb0JBQW9CO2dCQURwQixXQUFXO2dCQURYLGNBQWM7Z0RBbUs0QixNQUFNLFNBQUMsUUFBUTs7OzRCQWhIOUQsS0FBSzs4QkFLTCxLQUFLO2dDQUtMLEtBQUs7aUNBS0wsS0FBSzsrQkFNTCxLQUFLOzBCQUtMLEtBQUs7MEJBS0wsS0FBSzs2QkFNTCxLQUFLOzhCQU1MLEtBQUs7NEJBUUwsS0FBSzsrQkFLTCxLQUFLO2tDQUtMLEtBQUs7NEJBUUwsS0FBSzs0QkFNTCxLQUFLOzZCQVFMLE1BQU07MkJBTU4sTUFBTTsyQkFFTixLQUFLOzs2QkE1S1I7O1NBZ0VhLGtCQUFrQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSxcbiAgSW5wdXQsXG4gIENvbXBvbmVudFJlZixcbiAgRWxlbWVudFJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgUmVuZGVyZXIyLFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIE5nWm9uZSxcbiAgVGVtcGxhdGVSZWYsXG4gIGZvcndhcmRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgSW5qZWN0XG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtBYnN0cmFjdENvbnRyb2wsIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBWYWxpZGF0b3IsIE5HX1ZBTFVFX0FDQ0VTU09SLCBOR19WQUxJREFUT1JTfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyLCBOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudH0gZnJvbSAnLi9kYXRlcGlja2VyJztcbmltcG9ydCB7RGF5VGVtcGxhdGVDb250ZXh0fSBmcm9tICcuL2RhdGVwaWNrZXItZGF5LXRlbXBsYXRlLWNvbnRleHQnO1xuaW1wb3J0IHtOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyfSBmcm9tICcuL25nYi1kYXRlLXBhcnNlci1mb3JtYXR0ZXInO1xuXG5pbXBvcnQge3Bvc2l0aW9uRWxlbWVudHMsIFBsYWNlbWVudEFycmF5fSBmcm9tICcuLi91dGlsL3Bvc2l0aW9uaW5nJztcbmltcG9ydCB7bmdiRm9jdXNUcmFwfSBmcm9tICcuLi91dGlsL2ZvY3VzLXRyYXAnO1xuaW1wb3J0IHtLZXl9IGZyb20gJy4uL3V0aWwva2V5JztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi9uZ2ItZGF0ZS1zdHJ1Y3QnO1xuaW1wb3J0IHtOZ2JEYXRlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7TmdiQ2FsZW5kYXJ9IGZyb20gJy4vbmdiLWNhbGVuZGFyJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlclNlcnZpY2V9IGZyb20gJy4vZGF0ZXBpY2tlci1zZXJ2aWNlJztcblxuaW1wb3J0IHtTdWJqZWN0LCBmcm9tRXZlbnQsIHJhY2UsIE5FVkVSfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuY29uc3QgTkdCX0RBVEVQSUNLRVJfVkFMVUVfQUNDRVNTT1IgPSB7XG4gIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuY29uc3QgTkdCX0RBVEVQSUNLRVJfVkFMSURBVE9SID0ge1xuICBwcm92aWRlOiBOR19WQUxJREFUT1JTLFxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOZ2JJbnB1dERhdGVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IG1ha2VzIGl0IHBvc3NpYmxlIHRvIGhhdmUgZGF0ZXBpY2tlcnMgb24gaW5wdXQgZmllbGRzLlxuICogTWFuYWdlcyBpbnRlZ3JhdGlvbiB3aXRoIHRoZSBpbnB1dCBmaWVsZCBpdHNlbGYgKGRhdGEgZW50cnkpIGFuZCBuZ01vZGVsICh2YWxpZGF0aW9uIGV0Yy4pLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdpbnB1dFtuZ2JEYXRlcGlja2VyXScsXG4gIGV4cG9ydEFzOiAnbmdiRGF0ZXBpY2tlcicsXG4gIGhvc3Q6IHtcbiAgICAnKGlucHV0KSc6ICdtYW51YWxEYXRlQ2hhbmdlKCRldmVudC50YXJnZXQudmFsdWUpJyxcbiAgICAnKGNoYW5nZSknOiAnbWFudWFsRGF0ZUNoYW5nZSgkZXZlbnQudGFyZ2V0LnZhbHVlLCB0cnVlKScsXG4gICAgJyhibHVyKSc6ICdvbkJsdXIoKScsXG4gICAgJ1tkaXNhYmxlZF0nOiAnZGlzYWJsZWQnXG4gIH0sXG4gIHByb3ZpZGVyczogW05HQl9EQVRFUElDS0VSX1ZBTFVFX0FDQ0VTU09SLCBOR0JfREFURVBJQ0tFUl9WQUxJREFUT1IsIE5nYkRhdGVwaWNrZXJTZXJ2aWNlXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JJbnB1dERhdGVwaWNrZXIgaW1wbGVtZW50cyBPbkNoYW5nZXMsXG4gICAgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciwgVmFsaWRhdG9yIHtcbiAgcHJpdmF0ZSBfY2xvc2VkJCA9IG5ldyBTdWJqZWN0KCk7XG4gIHByaXZhdGUgX2NSZWY6IENvbXBvbmVudFJlZjxOZ2JEYXRlcGlja2VyPiA9IG51bGw7XG4gIHByaXZhdGUgX2Rpc2FibGVkID0gZmFsc2U7XG4gIHByaXZhdGUgX21vZGVsOiBOZ2JEYXRlO1xuICBwcml2YXRlIF96b25lU3Vic2NyaXB0aW9uOiBhbnk7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBkYXRlcGlja2VyIHBvcHVwIHNob3VsZCBiZSBjbG9zZWQgYXV0b21hdGljYWxseSBhZnRlciBkYXRlIHNlbGVjdGlvbiAvIG91dHNpZGUgY2xpY2sgb3Igbm90LlxuICAgKlxuICAgKiBCeSBkZWZhdWx0IHRoZSBwb3B1cCB3aWxsIGNsb3NlIG9uIGJvdGggZGF0ZSBzZWxlY3Rpb24gYW5kIG91dHNpZGUgY2xpY2suIElmIHRoZSB2YWx1ZSBpcyAnZmFsc2UnIHRoZSBwb3B1cCBoYXMgdG9cbiAgICogYmUgY2xvc2VkIG1hbnVhbGx5IHZpYSAnLmNsb3NlKCknIG9yICcudG9nZ2xlKCknIG1ldGhvZHMuIElmIHRoZSB2YWx1ZSBpcyBzZXQgdG8gJ2luc2lkZScgdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb25cbiAgICogZGF0ZSBzZWxlY3Rpb24gb25seS4gRm9yIHRoZSAnb3V0c2lkZScgdGhlIHBvcHVwIHdpbGwgY2xvc2Ugb25seSBvbiB0aGUgb3V0c2lkZSBjbGljay5cbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBASW5wdXQoKSBhdXRvQ2xvc2U6IGJvb2xlYW4gfCAnaW5zaWRlJyB8ICdvdXRzaWRlJyA9IHRydWU7XG5cbiAgLyoqXG4gICAqIFJlZmVyZW5jZSBmb3IgdGhlIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgdGhlIGRheSBkaXNwbGF5XG4gICAqL1xuICBASW5wdXQoKSBkYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RGF5VGVtcGxhdGVDb250ZXh0PjtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIG1vbnRocyB0byBkaXNwbGF5XG4gICAqL1xuICBASW5wdXQoKSBkaXNwbGF5TW9udGhzOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEZpcnN0IGRheSBvZiB0aGUgd2Vlay4gV2l0aCBkZWZhdWx0IGNhbGVuZGFyIHdlIHVzZSBJU08gODYwMTogMT1Nb24gLi4uIDc9U3VuXG4gICAqL1xuICBASW5wdXQoKSBmaXJzdERheU9mV2VlazogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB0byBtYXJrIGEgZ2l2ZW4gZGF0ZSBhcyBkaXNhYmxlZC5cbiAgICogJ0N1cnJlbnQnIGNvbnRhaW5zIHRoZSBtb250aCB0aGF0IHdpbGwgYmUgZGlzcGxheWVkIGluIHRoZSB2aWV3XG4gICAqL1xuICBASW5wdXQoKSBtYXJrRGlzYWJsZWQ6IChkYXRlOiBOZ2JEYXRlLCBjdXJyZW50OiB7eWVhcjogbnVtYmVyLCBtb250aDogbnVtYmVyfSkgPT4gYm9vbGVhbjtcblxuICAvKipcbiAgICogTWluIGRhdGUgZm9yIHRoZSBuYXZpZ2F0aW9uLiBJZiBub3QgcHJvdmlkZWQgd2lsbCBiZSAxMCB5ZWFycyBiZWZvcmUgdG9kYXkgb3IgYHN0YXJ0RGF0ZWBcbiAgICovXG4gIEBJbnB1dCgpIG1pbkRhdGU6IE5nYkRhdGVTdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIE1heCBkYXRlIGZvciB0aGUgbmF2aWdhdGlvbi4gSWYgbm90IHByb3ZpZGVkIHdpbGwgYmUgMTAgeWVhcnMgZnJvbSB0b2RheSBvciBgc3RhcnREYXRlYFxuICAgKi9cbiAgQElucHV0KCkgbWF4RGF0ZTogTmdiRGF0ZVN0cnVjdDtcblxuICAvKipcbiAgICogTmF2aWdhdGlvbiB0eXBlOiBgc2VsZWN0YCAoZGVmYXVsdCB3aXRoIHNlbGVjdCBib3hlcyBmb3IgbW9udGggYW5kIHllYXIpLCBgYXJyb3dzYFxuICAgKiAod2l0aG91dCBzZWxlY3QgYm94ZXMsIG9ubHkgbmF2aWdhdGlvbiBhcnJvd3MpIG9yIGBub25lYCAobm8gbmF2aWdhdGlvbiBhdCBhbGwpXG4gICAqL1xuICBASW5wdXQoKSBuYXZpZ2F0aW9uOiAnc2VsZWN0JyB8ICdhcnJvd3MnIHwgJ25vbmUnO1xuXG4gIC8qKlxuICAgKiBUaGUgd2F5IHRvIGRpc3BsYXkgZGF5cyB0aGF0IGRvbid0IGJlbG9uZyB0byBjdXJyZW50IG1vbnRoOiBgdmlzaWJsZWAgKGRlZmF1bHQpLFxuICAgKiBgaGlkZGVuYCAobm90IGRpc3BsYXllZCkgb3IgYGNvbGxhcHNlZGAgKG5vdCBkaXNwbGF5ZWQgd2l0aCBlbXB0eSBzcGFjZSBjb2xsYXBzZWQpXG4gICAqL1xuICBASW5wdXQoKSBvdXRzaWRlRGF5czogJ3Zpc2libGUnIHwgJ2NvbGxhcHNlZCcgfCAnaGlkZGVuJztcblxuICAvKipcbiAgICogUGxhY2VtZW50IG9mIGEgZGF0ZXBpY2tlciBwb3B1cCBhY2NlcHRzOlxuICAgKiAgICBcInRvcFwiLCBcInRvcC1sZWZ0XCIsIFwidG9wLXJpZ2h0XCIsIFwiYm90dG9tXCIsIFwiYm90dG9tLWxlZnRcIiwgXCJib3R0b20tcmlnaHRcIixcbiAgICogICAgXCJsZWZ0XCIsIFwibGVmdC10b3BcIiwgXCJsZWZ0LWJvdHRvbVwiLCBcInJpZ2h0XCIsIFwicmlnaHQtdG9wXCIsIFwicmlnaHQtYm90dG9tXCJcbiAgICogYW5kIGFycmF5IG9mIGFib3ZlIHZhbHVlcy5cbiAgICovXG4gIEBJbnB1dCgpIHBsYWNlbWVudDogUGxhY2VtZW50QXJyYXkgPSAnYm90dG9tLWxlZnQnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgZGF5cyBvZiB0aGUgd2Vla1xuICAgKi9cbiAgQElucHV0KCkgc2hvd1dlZWtkYXlzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgd2VlayBudW1iZXJzXG4gICAqL1xuICBASW5wdXQoKSBzaG93V2Vla051bWJlcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERhdGUgdG8gb3BlbiBjYWxlbmRhciB3aXRoLlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG4gICAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkLCBjYWxlbmRhciB3aWxsIG9wZW4gd2l0aCBjdXJyZW50IG1vbnRoLlxuICAgKiBVc2UgJ25hdmlnYXRlVG8oZGF0ZSknIGFzIGFuIGFsdGVybmF0aXZlXG4gICAqL1xuICBASW5wdXQoKSBzdGFydERhdGU6IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9O1xuXG4gIC8qKlxuICAgKiBBIHNlbGVjdG9yIHNwZWNpZnlpbmcgdGhlIGVsZW1lbnQgdGhlIGRhdGVwaWNrZXIgcG9wdXAgc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgKiBDdXJyZW50bHkgb25seSBzdXBwb3J0cyBcImJvZHlcIi5cbiAgICovXG4gIEBJbnB1dCgpIGNvbnRhaW5lcjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBbiBldmVudCBmaXJlZCB3aGVuIHVzZXIgc2VsZWN0cyBhIGRhdGUgdXNpbmcga2V5Ym9hcmQgb3IgbW91c2UuXG4gICAqIFRoZSBwYXlsb2FkIG9mIHRoZSBldmVudCBpcyBjdXJyZW50bHkgc2VsZWN0ZWQgTmdiRGF0ZS5cbiAgICpcbiAgICogQHNpbmNlIDEuMS4xXG4gICAqL1xuICBAT3V0cHV0KCkgZGF0ZVNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuICAvKipcbiAgICogQW4gZXZlbnQgZmlyZWQgd2hlbiBuYXZpZ2F0aW9uIGhhcHBlbnMgYW5kIGN1cnJlbnRseSBkaXNwbGF5ZWQgbW9udGggY2hhbmdlcy5cbiAgICogU2VlIE5nYkRhdGVwaWNrZXJOYXZpZ2F0ZUV2ZW50IGZvciB0aGUgcGF5bG9hZCBpbmZvLlxuICAgKi9cbiAgQE91dHB1dCgpIG5hdmlnYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlcGlja2VyTmF2aWdhdGVFdmVudD4oKTtcblxuICBASW5wdXQoKVxuICBnZXQgZGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICB9XG4gIHNldCBkaXNhYmxlZCh2YWx1ZTogYW55KSB7XG4gICAgdGhpcy5fZGlzYWJsZWQgPSB2YWx1ZSA9PT0gJycgfHwgKHZhbHVlICYmIHZhbHVlICE9PSAnZmFsc2UnKTtcblxuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLnNldERpc2FibGVkU3RhdGUodGhpcy5fZGlzYWJsZWQpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX29uQ2hhbmdlID0gKF86IGFueSkgPT4ge307XG4gIHByaXZhdGUgX29uVG91Y2hlZCA9ICgpID0+IHt9O1xuICBwcml2YXRlIF92YWxpZGF0b3JDaGFuZ2UgPSAoKSA9PiB7fTtcblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBfcGFyc2VyRm9ybWF0dGVyOiBOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyLCBwcml2YXRlIF9lbFJlZjogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PixcbiAgICAgIHByaXZhdGUgX3ZjUmVmOiBWaWV3Q29udGFpbmVyUmVmLCBwcml2YXRlIF9yZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIF9jZnI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgIHByaXZhdGUgX25nWm9uZTogTmdab25lLCBwcml2YXRlIF9zZXJ2aWNlOiBOZ2JEYXRlcGlja2VyU2VydmljZSwgcHJpdmF0ZSBfY2FsZW5kYXI6IE5nYkNhbGVuZGFyLFxuICAgICAgcHJpdmF0ZSBfZGF0ZUFkYXB0ZXI6IE5nYkRhdGVBZGFwdGVyPGFueT4sIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBhbnkpIHtcbiAgICB0aGlzLl96b25lU3Vic2NyaXB0aW9uID0gX25nWm9uZS5vblN0YWJsZS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuX2NSZWYpIHtcbiAgICAgICAgcG9zaXRpb25FbGVtZW50cyhcbiAgICAgICAgICAgIHRoaXMuX2VsUmVmLm5hdGl2ZUVsZW1lbnQsIHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCwgdGhpcy5wbGFjZW1lbnQsIHRoaXMuY29udGFpbmVyID09PSAnYm9keScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBhbnkpID0+IGFueSk6IHZvaWQgeyB0aGlzLl9vbkNoYW5nZSA9IGZuOyB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IGFueSk6IHZvaWQgeyB0aGlzLl9vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25WYWxpZGF0b3JDaGFuZ2UoZm46ICgpID0+IHZvaWQpOiB2b2lkIHsgdGhpcy5fdmFsaWRhdG9yQ2hhbmdlID0gZm47IH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHsgdGhpcy5kaXNhYmxlZCA9IGlzRGlzYWJsZWQ7IH1cblxuICB2YWxpZGF0ZShjOiBBYnN0cmFjdENvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gICAgY29uc3QgdmFsdWUgPSBjLnZhbHVlO1xuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IG5nYkRhdGUgPSB0aGlzLl9mcm9tRGF0ZVN0cnVjdCh0aGlzLl9kYXRlQWRhcHRlci5mcm9tTW9kZWwodmFsdWUpKTtcblxuICAgIGlmICghdGhpcy5fY2FsZW5kYXIuaXNWYWxpZChuZ2JEYXRlKSkge1xuICAgICAgcmV0dXJuIHsnbmdiRGF0ZSc6IHtpbnZhbGlkOiBjLnZhbHVlfX07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWluRGF0ZSAmJiBuZ2JEYXRlLmJlZm9yZShOZ2JEYXRlLmZyb20odGhpcy5taW5EYXRlKSkpIHtcbiAgICAgIHJldHVybiB7J25nYkRhdGUnOiB7cmVxdWlyZWRCZWZvcmU6IHRoaXMubWluRGF0ZX19O1xuICAgIH1cblxuICAgIGlmICh0aGlzLm1heERhdGUgJiYgbmdiRGF0ZS5hZnRlcihOZ2JEYXRlLmZyb20odGhpcy5tYXhEYXRlKSkpIHtcbiAgICAgIHJldHVybiB7J25nYkRhdGUnOiB7cmVxdWlyZWRBZnRlcjogdGhpcy5tYXhEYXRlfX07XG4gICAgfVxuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZSkge1xuICAgIHRoaXMuX21vZGVsID0gdGhpcy5fZnJvbURhdGVTdHJ1Y3QodGhpcy5fZGF0ZUFkYXB0ZXIuZnJvbU1vZGVsKHZhbHVlKSk7XG4gICAgdGhpcy5fd3JpdGVNb2RlbFZhbHVlKHRoaXMuX21vZGVsKTtcbiAgfVxuXG4gIG1hbnVhbERhdGVDaGFuZ2UodmFsdWU6IHN0cmluZywgdXBkYXRlVmlldyA9IGZhbHNlKSB7XG4gICAgdGhpcy5fbW9kZWwgPSB0aGlzLl9mcm9tRGF0ZVN0cnVjdCh0aGlzLl9wYXJzZXJGb3JtYXR0ZXIucGFyc2UodmFsdWUpKTtcbiAgICB0aGlzLl9vbkNoYW5nZSh0aGlzLl9tb2RlbCA/IHRoaXMuX2RhdGVBZGFwdGVyLnRvTW9kZWwodGhpcy5fbW9kZWwpIDogKHZhbHVlID09PSAnJyA/IG51bGwgOiB2YWx1ZSkpO1xuICAgIGlmICh1cGRhdGVWaWV3ICYmIHRoaXMuX21vZGVsKSB7XG4gICAgICB0aGlzLl93cml0ZU1vZGVsVmFsdWUodGhpcy5fbW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIGlzT3BlbigpIHsgcmV0dXJuICEhdGhpcy5fY1JlZjsgfVxuXG4gIC8qKlxuICAgKiBPcGVucyB0aGUgZGF0ZXBpY2tlciB3aXRoIHRoZSBzZWxlY3RlZCBkYXRlIGluZGljYXRlZCBieSB0aGUgbmdNb2RlbCB2YWx1ZS5cbiAgICovXG4gIG9wZW4oKSB7XG4gICAgaWYgKCF0aGlzLmlzT3BlbigpKSB7XG4gICAgICBjb25zdCBjZiA9IHRoaXMuX2Nmci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOZ2JEYXRlcGlja2VyKTtcbiAgICAgIHRoaXMuX2NSZWYgPSB0aGlzLl92Y1JlZi5jcmVhdGVDb21wb25lbnQoY2YpO1xuXG4gICAgICB0aGlzLl9hcHBseVBvcHVwU3R5bGluZyh0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgdGhpcy5fYXBwbHlEYXRlcGlja2VySW5wdXRzKHRoaXMuX2NSZWYuaW5zdGFuY2UpO1xuICAgICAgdGhpcy5fc3Vic2NyaWJlRm9yRGF0ZXBpY2tlck91dHB1dHModGhpcy5fY1JlZi5pbnN0YW5jZSk7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLm5nT25Jbml0KCk7XG4gICAgICB0aGlzLl9jUmVmLmluc3RhbmNlLndyaXRlVmFsdWUodGhpcy5fZGF0ZUFkYXB0ZXIudG9Nb2RlbCh0aGlzLl9tb2RlbCkpO1xuXG4gICAgICAvLyBkYXRlIHNlbGVjdGlvbiBldmVudCBoYW5kbGluZ1xuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5yZWdpc3Rlck9uQ2hhbmdlKChzZWxlY3RlZERhdGUpID0+IHtcbiAgICAgICAgdGhpcy53cml0ZVZhbHVlKHNlbGVjdGVkRGF0ZSk7XG4gICAgICAgIHRoaXMuX29uQ2hhbmdlKHNlbGVjdGVkRGF0ZSk7XG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fY1JlZi5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG5cbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uuc2V0RGlzYWJsZWRTdGF0ZSh0aGlzLmRpc2FibGVkKTtcblxuICAgICAgaWYgKHRoaXMuY29udGFpbmVyID09PSAnYm9keScpIHtcbiAgICAgICAgd2luZG93LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb250YWluZXIpLmFwcGVuZENoaWxkKHRoaXMuX2NSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIGZvY3VzIGhhbmRsaW5nXG4gICAgICBuZ2JGb2N1c1RyYXAodGhpcy5fY1JlZi5sb2NhdGlvbi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jbG9zZWQkKTtcblxuICAgICAgdGhpcy5fY1JlZi5pbnN0YW5jZS5mb2N1cygpO1xuXG4gICAgICAvLyBjbG9zaW5nIG9uIEVTQyBhbmQgb3V0c2lkZSBjbGlja3NcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG5cbiAgICAgICAgY29uc3QgZXNjYXBlcyQgPSBmcm9tRXZlbnQ8S2V5Ym9hcmRFdmVudD4odGhpcy5fZG9jdW1lbnQsICdrZXl1cCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSwgZmlsdGVyKGUgPT4gZS53aGljaCA9PT0gS2V5LkVzY2FwZSkpO1xuXG4gICAgICAgIGxldCBvdXRzaWRlQ2xpY2tzJDtcbiAgICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlIHx8IHRoaXMuYXV0b0Nsb3NlID09PSAnb3V0c2lkZScpIHtcbiAgICAgICAgICAvLyB3ZSBkb24ndCBrbm93IGhvdyB0aGUgcG9wdXAgd2FzIG9wZW5lZCwgc28gaWYgaXQgd2FzIG9wZW5lZCB3aXRoIGEgY2xpY2ssXG4gICAgICAgICAgLy8gd2UgaGF2ZSB0byBza2lwIHRoZSBmaXJzdCBvbmUgdG8gYXZvaWQgY2xvc2luZyBpdCBpbW1lZGlhdGVseVxuICAgICAgICAgIGxldCBpc09wZW5pbmcgPSB0cnVlO1xuICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiBpc09wZW5pbmcgPSBmYWxzZSk7XG5cbiAgICAgICAgICBvdXRzaWRlQ2xpY2tzJCA9XG4gICAgICAgICAgICAgIGZyb21FdmVudDxNb3VzZUV2ZW50Pih0aGlzLl9kb2N1bWVudCwgJ2NsaWNrJylcbiAgICAgICAgICAgICAgICAgIC5waXBlKFxuICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLl9jbG9zZWQkKSwgZmlsdGVyKGV2ZW50ID0+ICFpc09wZW5pbmcgJiYgdGhpcy5fc2hvdWxkQ2xvc2VPbk91dHNpZGVDbGljayhldmVudCkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvdXRzaWRlQ2xpY2tzJCA9IE5FVkVSO1xuICAgICAgICB9XG5cbiAgICAgICAgcmFjZTxFdmVudD4oW2VzY2FwZXMkLCBvdXRzaWRlQ2xpY2tzJF0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHRoaXMuY2xvc2UoKSkpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENsb3NlcyB0aGUgZGF0ZXBpY2tlciBwb3B1cC5cbiAgICovXG4gIGNsb3NlKCkge1xuICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICB0aGlzLl92Y1JlZi5yZW1vdmUodGhpcy5fdmNSZWYuaW5kZXhPZih0aGlzLl9jUmVmLmhvc3RWaWV3KSk7XG4gICAgICB0aGlzLl9jUmVmID0gbnVsbDtcbiAgICAgIHRoaXMuX2Nsb3NlZCQubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUb2dnbGVzIHRoZSBkYXRlcGlja2VyIHBvcHVwIChvcGVucyB3aGVuIGNsb3NlZCBhbmQgY2xvc2VzIHdoZW4gb3BlbmVkKS5cbiAgICovXG4gIHRvZ2dsZSgpIHtcbiAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgdGhpcy5jbG9zZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGVzIGN1cnJlbnQgdmlldyB0byBwcm92aWRlZCBkYXRlLlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWMuXG4gICAqIElmIG5vdGhpbmcgb3IgaW52YWxpZCBkYXRlIHByb3ZpZGVkIGNhbGVuZGFyIHdpbGwgb3BlbiBjdXJyZW50IG1vbnRoLlxuICAgKiBVc2UgJ3N0YXJ0RGF0ZScgaW5wdXQgYXMgYW4gYWx0ZXJuYXRpdmVcbiAgICovXG4gIG5hdmlnYXRlVG8oZGF0ZT86IHt5ZWFyOiBudW1iZXIsIG1vbnRoOiBudW1iZXJ9KSB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2UubmF2aWdhdGVUbyhkYXRlKTtcbiAgICB9XG4gIH1cblxuICBvbkJsdXIoKSB7IHRoaXMuX29uVG91Y2hlZCgpOyB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydtaW5EYXRlJ10gfHwgY2hhbmdlc1snbWF4RGF0ZSddKSB7XG4gICAgICB0aGlzLl92YWxpZGF0b3JDaGFuZ2UoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpIHtcbiAgICB0aGlzLmNsb3NlKCk7XG4gICAgdGhpcy5fem9uZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlEYXRlcGlja2VySW5wdXRzKGRhdGVwaWNrZXJJbnN0YW5jZTogTmdiRGF0ZXBpY2tlcik6IHZvaWQge1xuICAgIFsnZGF5VGVtcGxhdGUnLCAnZGlzcGxheU1vbnRocycsICdmaXJzdERheU9mV2VlaycsICdtYXJrRGlzYWJsZWQnLCAnbWluRGF0ZScsICdtYXhEYXRlJywgJ25hdmlnYXRpb24nLFxuICAgICAnb3V0c2lkZURheXMnLCAnc2hvd05hdmlnYXRpb24nLCAnc2hvd1dlZWtkYXlzJywgJ3Nob3dXZWVrTnVtYmVycyddXG4gICAgICAgIC5mb3JFYWNoKChvcHRpb25OYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBpZiAodGhpc1tvcHRpb25OYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBkYXRlcGlja2VySW5zdGFuY2Vbb3B0aW9uTmFtZV0gPSB0aGlzW29wdGlvbk5hbWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgZGF0ZXBpY2tlckluc3RhbmNlLnN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnREYXRlIHx8IHRoaXMuX21vZGVsO1xuICB9XG5cbiAgcHJpdmF0ZSBfYXBwbHlQb3B1cFN0eWxpbmcobmF0aXZlRWxlbWVudDogYW55KSB7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ2Ryb3Bkb3duLW1lbnUnKTtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRTdHlsZShuYXRpdmVFbGVtZW50LCAncGFkZGluZycsICcwJyk7XG4gICAgdGhpcy5fcmVuZGVyZXIuYWRkQ2xhc3MobmF0aXZlRWxlbWVudCwgJ3Nob3cnKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Nob3VsZENsb3NlT25PdXRzaWRlQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICByZXR1cm4gIVt0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCB0aGlzLl9jUmVmLmxvY2F0aW9uLm5hdGl2ZUVsZW1lbnRdLnNvbWUoZWwgPT4gZWwuY29udGFpbnMoZXZlbnQudGFyZ2V0KSk7XG4gIH1cblxuICBwcml2YXRlIF9zdWJzY3JpYmVGb3JEYXRlcGlja2VyT3V0cHV0cyhkYXRlcGlja2VySW5zdGFuY2U6IE5nYkRhdGVwaWNrZXIpIHtcbiAgICBkYXRlcGlja2VySW5zdGFuY2UubmF2aWdhdGUuc3Vic2NyaWJlKGRhdGUgPT4gdGhpcy5uYXZpZ2F0ZS5lbWl0KGRhdGUpKTtcbiAgICBkYXRlcGlja2VySW5zdGFuY2Uuc2VsZWN0LnN1YnNjcmliZShkYXRlID0+IHtcbiAgICAgIHRoaXMuZGF0ZVNlbGVjdC5lbWl0KGRhdGUpO1xuICAgICAgaWYgKHRoaXMuYXV0b0Nsb3NlID09PSB0cnVlIHx8IHRoaXMuYXV0b0Nsb3NlID09PSAnaW5zaWRlJykge1xuICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF93cml0ZU1vZGVsVmFsdWUobW9kZWw6IE5nYkRhdGUpIHtcbiAgICB0aGlzLl9yZW5kZXJlci5zZXRQcm9wZXJ0eSh0aGlzLl9lbFJlZi5uYXRpdmVFbGVtZW50LCAndmFsdWUnLCB0aGlzLl9wYXJzZXJGb3JtYXR0ZXIuZm9ybWF0KG1vZGVsKSk7XG4gICAgaWYgKHRoaXMuaXNPcGVuKCkpIHtcbiAgICAgIHRoaXMuX2NSZWYuaW5zdGFuY2Uud3JpdGVWYWx1ZSh0aGlzLl9kYXRlQWRhcHRlci50b01vZGVsKG1vZGVsKSk7XG4gICAgICB0aGlzLl9vblRvdWNoZWQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9mcm9tRGF0ZVN0cnVjdChkYXRlOiBOZ2JEYXRlU3RydWN0KTogTmdiRGF0ZSB7XG4gICAgY29uc3QgbmdiRGF0ZSA9IGRhdGUgPyBuZXcgTmdiRGF0ZShkYXRlLnllYXIsIGRhdGUubW9udGgsIGRhdGUuZGF5KSA6IG51bGw7XG4gICAgcmV0dXJuIHRoaXMuX2NhbGVuZGFyLmlzVmFsaWQobmdiRGF0ZSkgPyBuZ2JEYXRlIDogbnVsbDtcbiAgfVxufVxuIl19