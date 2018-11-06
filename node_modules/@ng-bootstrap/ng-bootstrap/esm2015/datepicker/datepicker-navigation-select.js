/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NgbDate } from './ngb-date';
import { toInteger } from '../util/util';
import { NgbDatepickerI18n } from './datepicker-i18n';
export class NgbDatepickerNavigationSelect {
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
if (false) {
    /** @type {?} */
    NgbDatepickerNavigationSelect.prototype.date;
    /** @type {?} */
    NgbDatepickerNavigationSelect.prototype.disabled;
    /** @type {?} */
    NgbDatepickerNavigationSelect.prototype.months;
    /** @type {?} */
    NgbDatepickerNavigationSelect.prototype.years;
    /** @type {?} */
    NgbDatepickerNavigationSelect.prototype.select;
    /** @type {?} */
    NgbDatepickerNavigationSelect.prototype.i18n;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9kYXRlcGlja2VyLW5hdmlnYXRpb24tc2VsZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLHVCQUF1QixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlGLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQWdDcEQsTUFBTTs7OztJQVFKLFlBQW1CLElBQXVCO1FBQXZCLFNBQUksR0FBSixJQUFJLENBQW1CO3NCQUZ2QixJQUFJLFlBQVksRUFBVztLQUVBOzs7OztJQUU5QyxXQUFXLENBQUMsS0FBYSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7Ozs7O0lBRWxHLFVBQVUsQ0FBQyxJQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTs7O1lBMUNqRyxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtDQUFrQztnQkFDNUMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLE1BQU0sRUFBRSxDQUFDOzs7Ozs7Ozs7O0dBVVIsQ0FBQztnQkFDRixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7O0dBY1Q7YUFDRjs7OztZQS9CTyxpQkFBaUI7OzttQkFpQ3RCLEtBQUs7dUJBQ0wsS0FBSztxQkFDTCxLQUFLO29CQUNMLEtBQUs7cUJBRUwsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge3RvSW50ZWdlcn0gZnJvbSAnLi4vdXRpbC91dGlsJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG59IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc3R5bGVzOiBbYFxuICAgIDpob3N0PnNlbGVjdCB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgICAtbXMtZmxleDogMSAxIGF1dG87XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIHBhZGRpbmc6IDAgMC41cmVtO1xuICAgICAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgICAgIGhlaWdodDogMS44NXJlbTtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzZWxlY3RcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIlxuICAgICAgW3ZhbHVlXT1cImRhdGU/Lm1vbnRoXCJcbiAgICAgIChjaGFuZ2UpPVwiY2hhbmdlTW9udGgoJGV2ZW50LnRhcmdldC52YWx1ZSlcIj5cbiAgICAgICAgPG9wdGlvbiAqbmdGb3I9XCJsZXQgbSBvZiBtb250aHNcIiBbYXR0ci5hcmlhLWxhYmVsXT1cImkxOG4uZ2V0TW9udGhGdWxsTmFtZShtKVwiIFt2YWx1ZV09XCJtXCI+e3sgaTE4bi5nZXRNb250aFNob3J0TmFtZShtKSB9fTwvb3B0aW9uPlxuICAgIDwvc2VsZWN0PjxzZWxlY3RcbiAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICBjbGFzcz1cImN1c3RvbS1zZWxlY3RcIlxuICAgICAgW3ZhbHVlXT1cImRhdGU/LnllYXJcIlxuICAgICAgKGNoYW5nZSk9XCJjaGFuZ2VZZWFyKCRldmVudC50YXJnZXQudmFsdWUpXCI+XG4gICAgICAgIDxvcHRpb24gKm5nRm9yPVwibGV0IHkgb2YgeWVhcnNcIiBbdmFsdWVdPVwieVwiPnt7IGkxOG4uZ2V0WWVhck51bWVyYWxzKHkpIH19PC9vcHRpb24+XG4gICAgPC9zZWxlY3Q+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3Qge1xuICBASW5wdXQoKSBkYXRlOiBOZ2JEYXRlO1xuICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgbW9udGhzOiBudW1iZXJbXTtcbiAgQElucHV0KCkgeWVhcnM6IG51bWJlcltdO1xuXG4gIEBPdXRwdXQoKSBzZWxlY3QgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYkRhdGU+KCk7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGkxOG46IE5nYkRhdGVwaWNrZXJJMThuKSB7fVxuXG4gIGNoYW5nZU1vbnRoKG1vbnRoOiBzdHJpbmcpIHsgdGhpcy5zZWxlY3QuZW1pdChuZXcgTmdiRGF0ZSh0aGlzLmRhdGUueWVhciwgdG9JbnRlZ2VyKG1vbnRoKSwgMSkpOyB9XG5cbiAgY2hhbmdlWWVhcih5ZWFyOiBzdHJpbmcpIHsgdGhpcy5zZWxlY3QuZW1pdChuZXcgTmdiRGF0ZSh0b0ludGVnZXIoeWVhciksIHRoaXMuZGF0ZS5tb250aCwgMSkpOyB9XG59XG4iXX0=