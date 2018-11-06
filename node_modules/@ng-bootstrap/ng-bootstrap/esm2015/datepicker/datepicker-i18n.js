/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import { FormStyle, getLocaleDayNames, getLocaleMonthNames, TranslationWidth, formatDate } from '@angular/common';
/**
 * Type of the service supplying month and weekday names to to NgbDatepicker component.
 * The default implementation of this service honors the Angular locale, and uses the registered locale data,
 * as explained in the Angular i18n guide.
 * See the i18n demo for how to extend this class and define a custom provider for i18n.
 * @abstract
 */
export class NgbDatepickerI18n {
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
if (false) {
    /**
     * Returns the short weekday name to display in the heading of the month view.
     * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
     * @abstract
     * @param {?} weekday
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getWeekdayShortName = function (weekday) { };
    /**
     * Returns the short month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec
     * @abstract
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getMonthShortName = function (month) { };
    /**
     * Returns the full month name to display in the date picker navigation.
     * With default calendar we use ISO 8601: 'month' is 1=January ... 12=December
     * @abstract
     * @param {?} month
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getMonthFullName = function (month) { };
    /**
     * Returns the value of the 'aria-label' attribute for a specific date
     *
     * \@since 2.0.0
     * @abstract
     * @param {?} date
     * @return {?}
     */
    NgbDatepickerI18n.prototype.getDayAriaLabel = function (date) { };
}
export class NgbDatepickerI18nDefault extends NgbDatepickerI18n {
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
if (false) {
    /** @type {?} */
    NgbDatepickerI18nDefault.prototype._weekdaysShort;
    /** @type {?} */
    NgbDatepickerI18nDefault.prototype._monthsShort;
    /** @type {?} */
    NgbDatepickerI18nDefault.prototype._monthsFull;
    /** @type {?} */
    NgbDatepickerI18nDefault.prototype._locale;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1pMThuLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJkYXRlcGlja2VyL2RhdGVwaWNrZXItaTE4bi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLEVBQUUsVUFBVSxFQUFDLE1BQU0saUJBQWlCLENBQUM7Ozs7Ozs7O0FBVWhILE1BQU07Ozs7Ozs7O0lBK0JKLGNBQWMsQ0FBQyxJQUFtQixJQUFZLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFOzs7Ozs7OztJQU9yRSxlQUFlLENBQUMsVUFBa0IsSUFBWSxNQUFNLENBQUMsR0FBRyxVQUFVLEVBQUUsQ0FBQyxFQUFFOzs7Ozs7Ozs7SUFRdkUsZUFBZSxDQUFDLElBQVksSUFBWSxNQUFNLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxFQUFFOzs7WUEvQzVELFVBQVU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtRFgsTUFBTSwrQkFBZ0MsU0FBUSxpQkFBaUI7Ozs7SUFLN0QsWUFBdUMsT0FBZTtRQUNwRCxLQUFLLEVBQUUsQ0FBQztRQUQ2QixZQUFPLEdBQVAsT0FBTyxDQUFROztRQUdwRCxNQUFNLHdCQUF3QixHQUFHLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzFHLElBQUksQ0FBQyxjQUFjLEdBQUcsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5RyxJQUFJLENBQUMsWUFBWSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JHLElBQUksQ0FBQyxXQUFXLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDOUY7Ozs7O0lBRUQsbUJBQW1CLENBQUMsT0FBZSxJQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7OztJQUV6RixpQkFBaUIsQ0FBQyxLQUFhLElBQVksTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7Ozs7O0lBRWpGLGdCQUFnQixDQUFDLEtBQWEsSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTs7Ozs7SUFFL0UsZUFBZSxDQUFDLElBQW1COztRQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ3JEOzs7WUF6QkYsVUFBVTs7Ozt5Q0FNSSxNQUFNLFNBQUMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0LCBJbmplY3RhYmxlLCBMT0NBTEVfSUR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtGb3JtU3R5bGUsIGdldExvY2FsZURheU5hbWVzLCBnZXRMb2NhbGVNb250aE5hbWVzLCBUcmFuc2xhdGlvbldpZHRoLCBmb3JtYXREYXRlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5cbi8qKlxuICogVHlwZSBvZiB0aGUgc2VydmljZSBzdXBwbHlpbmcgbW9udGggYW5kIHdlZWtkYXkgbmFtZXMgdG8gdG8gTmdiRGF0ZXBpY2tlciBjb21wb25lbnQuXG4gKiBUaGUgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBvZiB0aGlzIHNlcnZpY2UgaG9ub3JzIHRoZSBBbmd1bGFyIGxvY2FsZSwgYW5kIHVzZXMgdGhlIHJlZ2lzdGVyZWQgbG9jYWxlIGRhdGEsXG4gKiBhcyBleHBsYWluZWQgaW4gdGhlIEFuZ3VsYXIgaTE4biBndWlkZS5cbiAqIFNlZSB0aGUgaTE4biBkZW1vIGZvciBob3cgdG8gZXh0ZW5kIHRoaXMgY2xhc3MgYW5kIGRlZmluZSBhIGN1c3RvbSBwcm92aWRlciBmb3IgaTE4bi5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nYkRhdGVwaWNrZXJJMThuIHtcbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHNob3J0IHdlZWtkYXkgbmFtZSB0byBkaXNwbGF5IGluIHRoZSBoZWFkaW5nIG9mIHRoZSBtb250aCB2aWV3LlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnd2Vla2RheScgaXMgMT1Nb24gLi4uIDc9U3VuXG4gICAqL1xuICBhYnN0cmFjdCBnZXRXZWVrZGF5U2hvcnROYW1lKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgc2hvcnQgbW9udGggbmFtZSB0byBkaXNwbGF5IGluIHRoZSBkYXRlIHBpY2tlciBuYXZpZ2F0aW9uLlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFuIC4uLiAxMj1EZWNcbiAgICovXG4gIGFic3RyYWN0IGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGZ1bGwgbW9udGggbmFtZSB0byBkaXNwbGF5IGluIHRoZSBkYXRlIHBpY2tlciBuYXZpZ2F0aW9uLlxuICAgKiBXaXRoIGRlZmF1bHQgY2FsZW5kYXIgd2UgdXNlIElTTyA4NjAxOiAnbW9udGgnIGlzIDE9SmFudWFyeSAuLi4gMTI9RGVjZW1iZXJcbiAgICovXG4gIGFic3RyYWN0IGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZztcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmFsdWUgb2YgdGhlICdhcmlhLWxhYmVsJyBhdHRyaWJ1dGUgZm9yIGEgc3BlY2lmaWMgZGF0ZVxuICAgKlxuICAgKiBAc2luY2UgMi4wLjBcbiAgICovXG4gIGFic3RyYWN0IGdldERheUFyaWFMYWJlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgZGF5IHRoYXQgaXMgcmVuZGVyZWQgaW4gYSBkYXkgY2VsbFxuICAgKlxuICAgKiBAc2luY2UgMy4wLjBcbiAgICovXG4gIGdldERheU51bWVyYWxzKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcgeyByZXR1cm4gYCR7ZGF0ZS5kYXl9YDsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgd2VlayBudW1iZXIgcmVuZGVyZWQgYnkgZGF0ZSBwaWNrZXJcbiAgICpcbiAgICogQHNpbmNlIDMuMC4wXG4gICAqL1xuICBnZXRXZWVrTnVtZXJhbHMod2Vla051bWJlcjogbnVtYmVyKTogc3RyaW5nIHsgcmV0dXJuIGAke3dlZWtOdW1iZXJ9YDsgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIG9mIGEgeWVhciB0aGF0IGlzIHJlbmRlcmVkXG4gICAqIGluIGRhdGUgcGlja2VyIHllYXIgc2VsZWN0IGJveFxuICAgKlxuICAgKiBAc2luY2UgMy4wLjBcbiAgICovXG4gIGdldFllYXJOdW1lcmFscyh5ZWFyOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gYCR7eWVhcn1gOyB9XG59XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VySTE4bkRlZmF1bHQgZXh0ZW5kcyBOZ2JEYXRlcGlja2VySTE4biB7XG4gIHByaXZhdGUgX3dlZWtkYXlzU2hvcnQ6IEFycmF5PHN0cmluZz47XG4gIHByaXZhdGUgX21vbnRoc1Nob3J0OiBBcnJheTxzdHJpbmc+O1xuICBwcml2YXRlIF9tb250aHNGdWxsOiBBcnJheTxzdHJpbmc+O1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIF9sb2NhbGU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBjb25zdCB3ZWVrZGF5c1N0YXJ0aW5nT25TdW5kYXkgPSBnZXRMb2NhbGVEYXlOYW1lcyhfbG9jYWxlLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5TaG9ydCk7XG4gICAgdGhpcy5fd2Vla2RheXNTaG9ydCA9IHdlZWtkYXlzU3RhcnRpbmdPblN1bmRheS5tYXAoKGRheSwgaW5kZXgpID0+IHdlZWtkYXlzU3RhcnRpbmdPblN1bmRheVsoaW5kZXggKyAxKSAlIDddKTtcblxuICAgIHRoaXMuX21vbnRoc1Nob3J0ID0gZ2V0TG9jYWxlTW9udGhOYW1lcyhfbG9jYWxlLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5BYmJyZXZpYXRlZCk7XG4gICAgdGhpcy5fbW9udGhzRnVsbCA9IGdldExvY2FsZU1vbnRoTmFtZXMoX2xvY2FsZSwgRm9ybVN0eWxlLlN0YW5kYWxvbmUsIFRyYW5zbGF0aW9uV2lkdGguV2lkZSk7XG4gIH1cblxuICBnZXRXZWVrZGF5U2hvcnROYW1lKHdlZWtkYXk6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiB0aGlzLl93ZWVrZGF5c1Nob3J0W3dlZWtkYXkgLSAxXTsgfVxuXG4gIGdldE1vbnRoU2hvcnROYW1lKG1vbnRoOiBudW1iZXIpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fbW9udGhzU2hvcnRbbW9udGggLSAxXTsgfVxuXG4gIGdldE1vbnRoRnVsbE5hbWUobW9udGg6IG51bWJlcik6IHN0cmluZyB7IHJldHVybiB0aGlzLl9tb250aHNGdWxsW21vbnRoIC0gMV07IH1cblxuICBnZXREYXlBcmlhTGFiZWwoZGF0ZTogTmdiRGF0ZVN0cnVjdCk6IHN0cmluZyB7XG4gICAgY29uc3QganNEYXRlID0gbmV3IERhdGUoZGF0ZS55ZWFyLCBkYXRlLm1vbnRoIC0gMSwgZGF0ZS5kYXkpO1xuICAgIHJldHVybiBmb3JtYXREYXRlKGpzRGF0ZSwgJ2Z1bGxEYXRlJywgdGhpcy5fbG9jYWxlKTtcbiAgfVxufVxuIl19