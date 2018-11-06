/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
var NgbDatepickerDayView = /** @class */ (function () {
    function NgbDatepickerDayView(i18n) {
        this.i18n = i18n;
    }
    /**
     * @return {?}
     */
    NgbDatepickerDayView.prototype.isMuted = /**
     * @return {?}
     */
    function () { return !this.selected && (this.date.month !== this.currentMonth || this.disabled); };
    NgbDatepickerDayView.decorators = [
        { type: Component, args: [{
                    selector: '[ngbDatepickerDayView]',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["\n    :host {\n      text-align: center;\n      width: 2rem;\n      height: 2rem;\n      line-height: 2rem;\n      border-radius: 0.25rem;\n      background: transparent;\n    }\n    :host.outside {\n      opacity: 0.5;\n    }\n  "],
                    host: {
                        'class': 'btn-light',
                        '[class.bg-primary]': 'selected',
                        '[class.text-white]': 'selected',
                        '[class.text-muted]': 'isMuted()',
                        '[class.outside]': 'isMuted()',
                        '[class.active]': 'focused'
                    },
                    template: "{{ i18n.getDayNumerals(date) }}"
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerDayView.ctorParameters = function () { return [
        { type: NgbDatepickerI18n }
    ]; };
    NgbDatepickerDayView.propDecorators = {
        currentMonth: [{ type: Input }],
        date: [{ type: Input }],
        disabled: [{ type: Input }],
        focused: [{ type: Input }],
        selected: [{ type: Input }]
    };
    return NgbDatepickerDayView;
}());
export { NgbDatepickerDayView };
if (false) {
    /** @type {?} */
    NgbDatepickerDayView.prototype.currentMonth;
    /** @type {?} */
    NgbDatepickerDayView.prototype.date;
    /** @type {?} */
    NgbDatepickerDayView.prototype.disabled;
    /** @type {?} */
    NgbDatepickerDayView.prototype.focused;
    /** @type {?} */
    NgbDatepickerDayView.prototype.selected;
    /** @type {?} */
    NgbDatepickerDayView.prototype.i18n;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1kYXktdmlldy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9kYXRlcGlja2VyLWRheS12aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDOztJQW1DbEQsOEJBQW1CLElBQXVCO1FBQXZCLFNBQUksR0FBSixJQUFJLENBQW1CO0tBQUk7Ozs7SUFFOUMsc0NBQU87OztJQUFQLGNBQVksTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUU7O2dCQW5DakcsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxNQUFNLEVBQUUsQ0FBQyx3T0FZUixDQUFDO29CQUNGLElBQUksRUFBRTt3QkFDSixPQUFPLEVBQUUsV0FBVzt3QkFDcEIsb0JBQW9CLEVBQUUsVUFBVTt3QkFDaEMsb0JBQW9CLEVBQUUsVUFBVTt3QkFDaEMsb0JBQW9CLEVBQUUsV0FBVzt3QkFDakMsaUJBQWlCLEVBQUUsV0FBVzt3QkFDOUIsZ0JBQWdCLEVBQUUsU0FBUztxQkFDNUI7b0JBQ0QsUUFBUSxFQUFFLGlDQUFpQztpQkFDNUM7Ozs7Z0JBM0JPLGlCQUFpQjs7OytCQTZCdEIsS0FBSzt1QkFDTCxLQUFLOzJCQUNMLEtBQUs7MEJBQ0wsS0FBSzsyQkFDTCxLQUFLOzsrQkFuQ1I7O1NBOEJhLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG59IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnW25nYkRhdGVwaWNrZXJEYXlWaWV3XScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3Qge1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgd2lkdGg6IDJyZW07XG4gICAgICBoZWlnaHQ6IDJyZW07XG4gICAgICBsaW5lLWhlaWdodDogMnJlbTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG4gICAgICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgICB9XG4gICAgOmhvc3Qub3V0c2lkZSB7XG4gICAgICBvcGFjaXR5OiAwLjU7XG4gICAgfVxuICBgXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdidG4tbGlnaHQnLFxuICAgICdbY2xhc3MuYmctcHJpbWFyeV0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MudGV4dC13aGl0ZV0nOiAnc2VsZWN0ZWQnLFxuICAgICdbY2xhc3MudGV4dC1tdXRlZF0nOiAnaXNNdXRlZCgpJyxcbiAgICAnW2NsYXNzLm91dHNpZGVdJzogJ2lzTXV0ZWQoKScsXG4gICAgJ1tjbGFzcy5hY3RpdmVdJzogJ2ZvY3VzZWQnXG4gIH0sXG4gIHRlbXBsYXRlOiBge3sgaTE4bi5nZXREYXlOdW1lcmFscyhkYXRlKSB9fWBcbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlckRheVZpZXcge1xuICBASW5wdXQoKSBjdXJyZW50TW9udGg6IG51bWJlcjtcbiAgQElucHV0KCkgZGF0ZTogTmdiRGF0ZTtcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGZvY3VzZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNlbGVjdGVkOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4bikge31cblxuICBpc011dGVkKCkgeyByZXR1cm4gIXRoaXMuc2VsZWN0ZWQgJiYgKHRoaXMuZGF0ZS5tb250aCAhPT0gdGhpcy5jdXJyZW50TW9udGggfHwgdGhpcy5kaXNhYmxlZCk7IH1cbn1cbiJdfQ==