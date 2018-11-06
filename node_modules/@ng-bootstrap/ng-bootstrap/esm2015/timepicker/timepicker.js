/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isNumber, padNumber, toInteger } from '../util/util';
import { NgbTime } from './ngb-time';
import { NgbTimepickerConfig } from './timepicker-config';
import { NgbTimeAdapter } from './ngb-time-adapter';
/** @type {?} */
const NGB_TIMEPICKER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgbTimepicker),
    multi: true
};
/**
 * A lightweight & configurable timepicker directive.
 */
export class NgbTimepicker {
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
if (false) {
    /** @type {?} */
    NgbTimepicker.prototype.disabled;
    /** @type {?} */
    NgbTimepicker.prototype.model;
    /**
     * Whether to display 12H or 24H mode.
     * @type {?}
     */
    NgbTimepicker.prototype.meridian;
    /**
     * Whether to display the spinners above and below the inputs.
     * @type {?}
     */
    NgbTimepicker.prototype.spinners;
    /**
     * Whether to display seconds input.
     * @type {?}
     */
    NgbTimepicker.prototype.seconds;
    /**
     * Number of hours to increase or decrease when using a button.
     * @type {?}
     */
    NgbTimepicker.prototype.hourStep;
    /**
     * Number of minutes to increase or decrease when using a button.
     * @type {?}
     */
    NgbTimepicker.prototype.minuteStep;
    /**
     * Number of seconds to increase or decrease when using a button.
     * @type {?}
     */
    NgbTimepicker.prototype.secondStep;
    /**
     * To make timepicker readonly
     * @type {?}
     */
    NgbTimepicker.prototype.readonlyInputs;
    /**
     * To set the size of the inputs and button
     * @type {?}
     */
    NgbTimepicker.prototype.size;
    /** @type {?} */
    NgbTimepicker.prototype.onChange;
    /** @type {?} */
    NgbTimepicker.prototype.onTouched;
    /** @type {?} */
    NgbTimepicker.prototype._ngbTimeAdapter;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXBpY2tlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsidGltZXBpY2tlci90aW1lcGlja2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQTJCLE1BQU0sZUFBZSxDQUFDO0FBQ3JGLE9BQU8sRUFBdUIsaUJBQWlCLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUV2RSxPQUFPLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxjQUFjLENBQUM7QUFDNUQsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sb0JBQW9CLENBQUM7O0FBRWxELE1BQU0sNkJBQTZCLEdBQUc7SUFDcEMsT0FBTyxFQUFFLGlCQUFpQjtJQUMxQixXQUFXLEVBQUUsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQztJQUM1QyxLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7Ozs7QUFzSUYsTUFBTTs7Ozs7SUE2Q0osWUFBWSxNQUEyQixFQUFVLGVBQW9DO1FBQXBDLG9CQUFlLEdBQWYsZUFBZSxDQUFxQjt3QkFZMUUsQ0FBQyxDQUFNLEVBQUUsRUFBRSxJQUFHO3lCQUNiLEdBQUcsRUFBRSxJQUFHO1FBWmxCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQzlCLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENB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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyRFIsQ0FBQztnQkFDRixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnRVQ7Z0JBQ0QsU0FBUyxFQUFFLENBQUMsNkJBQTZCLENBQUM7YUFDM0M7Ozs7WUE1SU8sbUJBQW1CO1lBQ25CLGNBQWM7Ozt1QkFvSm5CLEtBQUs7dUJBS0wsS0FBSztzQkFLTCxLQUFLO3VCQUtMLEtBQUs7eUJBS0wsS0FBSzt5QkFLTCxLQUFLOzZCQUtMLEtBQUs7bUJBS0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBmb3J3YXJkUmVmLCBJbnB1dCwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7aXNOdW1iZXIsIHBhZE51bWJlciwgdG9JbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JUaW1lfSBmcm9tICcuL25nYi10aW1lJztcbmltcG9ydCB7TmdiVGltZXBpY2tlckNvbmZpZ30gZnJvbSAnLi90aW1lcGlja2VyLWNvbmZpZyc7XG5pbXBvcnQge05nYlRpbWVBZGFwdGVyfSBmcm9tICcuL25nYi10aW1lLWFkYXB0ZXInO1xuXG5jb25zdCBOR0JfVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUiA9IHtcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE5nYlRpbWVwaWNrZXIpLFxuICBtdWx0aTogdHJ1ZVxufTtcblxuLyoqXG4gKiBBIGxpZ2h0d2VpZ2h0ICYgY29uZmlndXJhYmxlIHRpbWVwaWNrZXIgZGlyZWN0aXZlLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItdGltZXBpY2tlcicsXG4gIHN0eWxlczogW2BcblxuICAgIDpob3N0IHtcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcbiAgICB9XG5cbiAgICAubmdiLXRwIHtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIC1tcy1mbGV4LWFsaWduOiBjZW50ZXI7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIH1cblxuICAgIC5uZ2ItdHAtaW5wdXQtY29udGFpbmVyIHtcbiAgICAgIHdpZHRoOiA0ZW07XG4gICAgfVxuXG4gICAgLm5nYi10cC1ob3VyLCAubmdiLXRwLW1pbnV0ZSwgLm5nYi10cC1zZWNvbmQsIC5uZ2ItdHAtbWVyaWRpYW4ge1xuICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgLW1zLWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgLW1zLWZsZXgtYWxpZ246IGNlbnRlcjtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAtbXMtZmxleC1wYWNrOiBkaXN0cmlidXRlO1xuICAgICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG4gICAgfVxuXG4gICAgLm5nYi10cC1zcGFjZXIge1xuICAgICAgd2lkdGg6IDFlbTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG5cbiAgICAuY2hldnJvbjo6YmVmb3JlIHtcbiAgICAgIGJvcmRlci1zdHlsZTogc29saWQ7XG4gICAgICBib3JkZXItd2lkdGg6IDAuMjllbSAwLjI5ZW0gMCAwO1xuICAgICAgY29udGVudDogJyc7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgICBoZWlnaHQ6IDAuNjllbTtcbiAgICAgIGxlZnQ6IDAuMDVlbTtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIHRvcDogMC4xNWVtO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKTtcbiAgICAgIC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoLTQ1ZGVnKTtcbiAgICAgIC1tcy10cmFuc2Zvcm06IHJvdGF0ZSgtNDVkZWcpO1xuICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgIHdpZHRoOiAwLjcxZW07XG4gICAgfVxuXG4gICAgLmNoZXZyb24uYm90dG9tOmJlZm9yZSB7XG4gICAgICB0b3A6IC0uM2VtO1xuICAgICAgLXdlYmtpdC10cmFuc2Zvcm06IHJvdGF0ZSgxMzVkZWcpO1xuICAgICAgLW1zLXRyYW5zZm9ybTogcm90YXRlKDEzNWRlZyk7XG4gICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxMzVkZWcpO1xuICAgIH1cblxuICAgIGlucHV0IHtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxmaWVsZHNldCBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItdHBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLWhvdXJcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbbmdDbGFzc109XCJzZXRCdXR0b25TaXplKClcIiAoY2xpY2spPVwiY2hhbmdlSG91cihob3VyU3RlcClcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtaG91cnNcIj5JbmNyZW1lbnQgaG91cnM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBbbmdDbGFzc109XCJzZXRGb3JtQ29udHJvbFNpemUoKVwiIG1heGxlbmd0aD1cIjJcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJISFwiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLkhIXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRIb3VyKG1vZGVsPy5ob3VyKVwiIChjaGFuZ2UpPVwidXBkYXRlSG91cigkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiSG91cnNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLmhvdXJzXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW25nQ2xhc3NdPVwic2V0QnV0dG9uU2l6ZSgpXCIgKGNsaWNrKT1cImNoYW5nZUhvdXIoLWhvdXJTdGVwKVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBib3R0b21cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5kZWNyZW1lbnQtaG91cnNcIj5EZWNyZW1lbnQgaG91cnM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibmdiLXRwLXNwYWNlclwiPjo8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm5nYi10cC1pbnB1dC1jb250YWluZXIgbmdiLXRwLW1pbnV0ZVwiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiIFtuZ0NsYXNzXT1cInNldEJ1dHRvblNpemUoKVwiIChjbGljayk9XCJjaGFuZ2VNaW51dGUobWludXRlU3RlcClcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgW2NsYXNzLmRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNoZXZyb25cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5pbmNyZW1lbnQtbWludXRlc1wiPkluY3JlbWVudCBtaW51dGVzPC9zcGFuPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgW25nQ2xhc3NdPVwic2V0Rm9ybUNvbnRyb2xTaXplKClcIiBtYXhsZW5ndGg9XCIyXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiTU1cIiBpMThuLXBsYWNlaG9sZGVyPVwiQEBuZ2IudGltZXBpY2tlci5NTVwiXG4gICAgICAgICAgICBbdmFsdWVdPVwiZm9ybWF0TWluU2VjKG1vZGVsPy5taW51dGUpXCIgKGNoYW5nZSk9XCJ1cGRhdGVNaW51dGUoJGV2ZW50LnRhcmdldC52YWx1ZSlcIlxuICAgICAgICAgICAgW3JlYWRvbmx5XT1cInJlYWRvbmx5SW5wdXRzXCIgW2Rpc2FibGVkXT1cImRpc2FibGVkXCIgYXJpYS1sYWJlbD1cIk1pbnV0ZXNcIiBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi50aW1lcGlja2VyLm1pbnV0ZXNcIj5cbiAgICAgICAgICA8YnV0dG9uICpuZ0lmPVwic3Bpbm5lcnNcIiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmtcIiBbbmdDbGFzc109XCJzZXRCdXR0b25TaXplKClcIiAoY2xpY2spPVwiY2hhbmdlTWludXRlKC1taW51dGVTdGVwKVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvbiBib3R0b21cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiAgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuZGVjcmVtZW50LW1pbnV0ZXNcIj5EZWNyZW1lbnQgbWludXRlczwvc3Bhbj5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgKm5nSWY9XCJzZWNvbmRzXCIgY2xhc3M9XCJuZ2ItdHAtc3BhY2VyXCI+OjwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2Vjb25kc1wiIGNsYXNzPVwibmdiLXRwLWlucHV0LWNvbnRhaW5lciBuZ2ItdHAtc2Vjb25kXCI+XG4gICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cInNwaW5uZXJzXCIgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgW25nQ2xhc3NdPVwic2V0QnV0dG9uU2l6ZSgpXCIgKGNsaWNrKT1cImNoYW5nZVNlY29uZChzZWNvbmRTdGVwKVwiXG4gICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBbY2xhc3MuZGlzYWJsZWRdPVwiZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2hldnJvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmluY3JlbWVudC1zZWNvbmRzXCI+SW5jcmVtZW50IHNlY29uZHM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBbbmdDbGFzc109XCJzZXRGb3JtQ29udHJvbFNpemUoKVwiIG1heGxlbmd0aD1cIjJcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJTU1wiIGkxOG4tcGxhY2Vob2xkZXI9XCJAQG5nYi50aW1lcGlja2VyLlNTXCJcbiAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXRNaW5TZWMobW9kZWw/LnNlY29uZClcIiAoY2hhbmdlKT1cInVwZGF0ZVNlY29uZCgkZXZlbnQudGFyZ2V0LnZhbHVlKVwiXG4gICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlJbnB1dHNcIiBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIiBhcmlhLWxhYmVsPVwiU2Vjb25kc1wiIGkxOG4tYXJpYS1sYWJlbD1cIkBAbmdiLnRpbWVwaWNrZXIuc2Vjb25kc1wiPlxuICAgICAgICAgIDxidXR0b24gKm5nSWY9XCJzcGlubmVyc1wiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlua1wiIFtuZ0NsYXNzXT1cInNldEJ1dHRvblNpemUoKVwiIChjbGljayk9XCJjaGFuZ2VTZWNvbmQoLXNlY29uZFN0ZXApXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJjaGV2cm9uIGJvdHRvbVwiPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3Itb25seVwiIGkxOG49XCJAQG5nYi50aW1lcGlja2VyLmRlY3JlbWVudC1zZWNvbmRzXCI+RGVjcmVtZW50IHNlY29uZHM8L3NwYW4+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwibWVyaWRpYW5cIiBjbGFzcz1cIm5nYi10cC1zcGFjZXJcIj48L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdJZj1cIm1lcmlkaWFuXCIgY2xhc3M9XCJuZ2ItdHAtbWVyaWRpYW5cIj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1wcmltYXJ5XCIgW25nQ2xhc3NdPVwic2V0QnV0dG9uU2l6ZSgpXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiIFtjbGFzcy5kaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgICAoY2xpY2spPVwidG9nZ2xlTWVyaWRpYW4oKVwiPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm1vZGVsPy5ob3VyID49IDEyOyBlbHNlIGFtXCIgaTE4bj1cIkBAbmdiLnRpbWVwaWNrZXIuUE1cIj5QTTwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNhbSBpMThuPVwiQEBuZ2IudGltZXBpY2tlci5BTVwiPkFNPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2ZpZWxkc2V0PlxuICBgLFxuICBwcm92aWRlcnM6IFtOR0JfVElNRVBJQ0tFUl9WQUxVRV9BQ0NFU1NPUl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiVGltZXBpY2tlciBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLFxuICAgIE9uQ2hhbmdlcyB7XG4gIGRpc2FibGVkOiBib29sZWFuO1xuICBtb2RlbDogTmdiVGltZTtcblxuICAvKipcbiAgICogV2hldGhlciB0byBkaXNwbGF5IDEySCBvciAyNEggbW9kZS5cbiAgICovXG4gIEBJbnB1dCgpIG1lcmlkaWFuOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGRpc3BsYXkgdGhlIHNwaW5uZXJzIGFib3ZlIGFuZCBiZWxvdyB0aGUgaW5wdXRzLlxuICAgKi9cbiAgQElucHV0KCkgc3Bpbm5lcnM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gZGlzcGxheSBzZWNvbmRzIGlucHV0LlxuICAgKi9cbiAgQElucHV0KCkgc2Vjb25kczogYm9vbGVhbjtcblxuICAvKipcbiAgICogTnVtYmVyIG9mIGhvdXJzIHRvIGluY3JlYXNlIG9yIGRlY3JlYXNlIHdoZW4gdXNpbmcgYSBidXR0b24uXG4gICAqL1xuICBASW5wdXQoKSBob3VyU3RlcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgbWludXRlcyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB3aGVuIHVzaW5nIGEgYnV0dG9uLlxuICAgKi9cbiAgQElucHV0KCkgbWludXRlU3RlcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2Ygc2Vjb25kcyB0byBpbmNyZWFzZSBvciBkZWNyZWFzZSB3aGVuIHVzaW5nIGEgYnV0dG9uLlxuICAgKi9cbiAgQElucHV0KCkgc2Vjb25kU3RlcDogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUbyBtYWtlIHRpbWVwaWNrZXIgcmVhZG9ubHlcbiAgICovXG4gIEBJbnB1dCgpIHJlYWRvbmx5SW5wdXRzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUbyBzZXQgdGhlIHNpemUgb2YgdGhlIGlucHV0cyBhbmQgYnV0dG9uXG4gICAqL1xuICBASW5wdXQoKSBzaXplOiAnc21hbGwnIHwgJ21lZGl1bScgfCAnbGFyZ2UnO1xuXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogTmdiVGltZXBpY2tlckNvbmZpZywgcHJpdmF0ZSBfbmdiVGltZUFkYXB0ZXI6IE5nYlRpbWVBZGFwdGVyPGFueT4pIHtcbiAgICB0aGlzLm1lcmlkaWFuID0gY29uZmlnLm1lcmlkaWFuO1xuICAgIHRoaXMuc3Bpbm5lcnMgPSBjb25maWcuc3Bpbm5lcnM7XG4gICAgdGhpcy5zZWNvbmRzID0gY29uZmlnLnNlY29uZHM7XG4gICAgdGhpcy5ob3VyU3RlcCA9IGNvbmZpZy5ob3VyU3RlcDtcbiAgICB0aGlzLm1pbnV0ZVN0ZXAgPSBjb25maWcubWludXRlU3RlcDtcbiAgICB0aGlzLnNlY29uZFN0ZXAgPSBjb25maWcuc2Vjb25kU3RlcDtcbiAgICB0aGlzLmRpc2FibGVkID0gY29uZmlnLmRpc2FibGVkO1xuICAgIHRoaXMucmVhZG9ubHlJbnB1dHMgPSBjb25maWcucmVhZG9ubHlJbnB1dHM7XG4gICAgdGhpcy5zaXplID0gY29uZmlnLnNpemU7XG4gIH1cblxuICBvbkNoYW5nZSA9IChfOiBhbnkpID0+IHt9O1xuICBvblRvdWNoZWQgPSAoKSA9PiB7fTtcblxuICB3cml0ZVZhbHVlKHZhbHVlKSB7XG4gICAgY29uc3Qgc3RydWN0VmFsdWUgPSB0aGlzLl9uZ2JUaW1lQWRhcHRlci5mcm9tTW9kZWwodmFsdWUpO1xuICAgIHRoaXMubW9kZWwgPSBzdHJ1Y3RWYWx1ZSA/IG5ldyBOZ2JUaW1lKHN0cnVjdFZhbHVlLmhvdXIsIHN0cnVjdFZhbHVlLm1pbnV0ZSwgc3RydWN0VmFsdWUuc2Vjb25kKSA6IG5ldyBOZ2JUaW1lKCk7XG4gICAgaWYgKCF0aGlzLnNlY29uZHMgJiYgKCFzdHJ1Y3RWYWx1ZSB8fCAhaXNOdW1iZXIoc3RydWN0VmFsdWUuc2Vjb25kKSkpIHtcbiAgICAgIHRoaXMubW9kZWwuc2Vjb25kID0gMDtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiAodmFsdWU6IGFueSkgPT4gYW55KTogdm9pZCB7IHRoaXMub25DaGFuZ2UgPSBmbjsgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiAoKSA9PiBhbnkpOiB2b2lkIHsgdGhpcy5vblRvdWNoZWQgPSBmbjsgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbikgeyB0aGlzLmRpc2FibGVkID0gaXNEaXNhYmxlZDsgfVxuXG4gIGNoYW5nZUhvdXIoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5tb2RlbC5jaGFuZ2VIb3VyKHN0ZXApO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIGNoYW5nZU1pbnV0ZShzdGVwOiBudW1iZXIpIHtcbiAgICB0aGlzLm1vZGVsLmNoYW5nZU1pbnV0ZShzdGVwKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICBjaGFuZ2VTZWNvbmQoc3RlcDogbnVtYmVyKSB7XG4gICAgdGhpcy5tb2RlbC5jaGFuZ2VTZWNvbmQoc3RlcCk7XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgdXBkYXRlSG91cihuZXdWYWw6IHN0cmluZykge1xuICAgIGNvbnN0IGlzUE0gPSB0aGlzLm1vZGVsLmhvdXIgPj0gMTI7XG4gICAgY29uc3QgZW50ZXJlZEhvdXIgPSB0b0ludGVnZXIobmV3VmFsKTtcbiAgICBpZiAodGhpcy5tZXJpZGlhbiAmJiAoaXNQTSAmJiBlbnRlcmVkSG91ciA8IDEyIHx8ICFpc1BNICYmIGVudGVyZWRIb3VyID09PSAxMikpIHtcbiAgICAgIHRoaXMubW9kZWwudXBkYXRlSG91cihlbnRlcmVkSG91ciArIDEyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tb2RlbC51cGRhdGVIb3VyKGVudGVyZWRIb3VyKTtcbiAgICB9XG4gICAgdGhpcy5wcm9wYWdhdGVNb2RlbENoYW5nZSgpO1xuICB9XG5cbiAgdXBkYXRlTWludXRlKG5ld1ZhbDogc3RyaW5nKSB7XG4gICAgdGhpcy5tb2RlbC51cGRhdGVNaW51dGUodG9JbnRlZ2VyKG5ld1ZhbCkpO1xuICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoKTtcbiAgfVxuXG4gIHVwZGF0ZVNlY29uZChuZXdWYWw6IHN0cmluZykge1xuICAgIHRoaXMubW9kZWwudXBkYXRlU2Vjb25kKHRvSW50ZWdlcihuZXdWYWwpKTtcbiAgICB0aGlzLnByb3BhZ2F0ZU1vZGVsQ2hhbmdlKCk7XG4gIH1cblxuICB0b2dnbGVNZXJpZGlhbigpIHtcbiAgICBpZiAodGhpcy5tZXJpZGlhbikge1xuICAgICAgdGhpcy5jaGFuZ2VIb3VyKDEyKTtcbiAgICB9XG4gIH1cblxuICBmb3JtYXRIb3VyKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoaXNOdW1iZXIodmFsdWUpKSB7XG4gICAgICBpZiAodGhpcy5tZXJpZGlhbikge1xuICAgICAgICByZXR1cm4gcGFkTnVtYmVyKHZhbHVlICUgMTIgPT09IDAgPyAxMiA6IHZhbHVlICUgMTIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHBhZE51bWJlcih2YWx1ZSAlIDI0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhZE51bWJlcihOYU4pO1xuICAgIH1cbiAgfVxuXG4gIGZvcm1hdE1pblNlYyh2YWx1ZTogbnVtYmVyKSB7IHJldHVybiBwYWROdW1iZXIodmFsdWUpOyB9XG5cbiAgc2V0Rm9ybUNvbnRyb2xTaXplKCkgeyByZXR1cm4geydmb3JtLWNvbnRyb2wtc20nOiB0aGlzLnNpemUgPT09ICdzbWFsbCcsICdmb3JtLWNvbnRyb2wtbGcnOiB0aGlzLnNpemUgPT09ICdsYXJnZSd9OyB9XG5cbiAgc2V0QnV0dG9uU2l6ZSgpIHsgcmV0dXJuIHsnYnRuLXNtJzogdGhpcy5zaXplID09PSAnc21hbGwnLCAnYnRuLWxnJzogdGhpcy5zaXplID09PSAnbGFyZ2UnfTsgfVxuXG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzWydzZWNvbmRzJ10gJiYgIXRoaXMuc2Vjb25kcyAmJiB0aGlzLm1vZGVsICYmICFpc051bWJlcih0aGlzLm1vZGVsLnNlY29uZCkpIHtcbiAgICAgIHRoaXMubW9kZWwuc2Vjb25kID0gMDtcbiAgICAgIHRoaXMucHJvcGFnYXRlTW9kZWxDaGFuZ2UoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcHJvcGFnYXRlTW9kZWxDaGFuZ2UodG91Y2hlZCA9IHRydWUpIHtcbiAgICBpZiAodG91Y2hlZCkge1xuICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubW9kZWwuaXNWYWxpZCh0aGlzLnNlY29uZHMpKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKFxuICAgICAgICAgIHRoaXMuX25nYlRpbWVBZGFwdGVyLnRvTW9kZWwoe2hvdXI6IHRoaXMubW9kZWwuaG91ciwgbWludXRlOiB0aGlzLm1vZGVsLm1pbnV0ZSwgc2Vjb25kOiB0aGlzLm1vZGVsLnNlY29uZH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLl9uZ2JUaW1lQWRhcHRlci50b01vZGVsKG51bGwpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==