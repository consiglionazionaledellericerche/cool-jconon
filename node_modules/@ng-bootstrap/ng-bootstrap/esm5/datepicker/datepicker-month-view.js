/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbDatepickerI18n } from './datepicker-i18n';
var NgbDatepickerMonthView = /** @class */ (function () {
    function NgbDatepickerMonthView(i18n) {
        this.i18n = i18n;
        this.select = new EventEmitter();
    }
    /**
     * @param {?} day
     * @return {?}
     */
    NgbDatepickerMonthView.prototype.doSelect = /**
     * @param {?} day
     * @return {?}
     */
    function (day) {
        if (!day.context.disabled && !day.hidden) {
            this.select.emit(day.date);
        }
    };
    NgbDatepickerMonthView.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-datepicker-month-view',
                    host: { 'role': 'grid' },
                    styles: ["\n    :host {\n      display: block;\n    }\n    .ngb-dp-weekday, .ngb-dp-week-number {\n      line-height: 2rem;\n      text-align: center;\n      font-style: italic;\n    }\n    .ngb-dp-weekday {\n      color: #5bc0de;\n      color: var(--info);\n    }\n    .ngb-dp-week {\n      border-radius: 0.25rem;\n      display: -ms-flexbox;\n      display: flex;\n    }\n    .ngb-dp-weekdays {\n      border-bottom: 1px solid rgba(0, 0, 0, 0.125);\n      border-radius: 0;\n    }\n    .ngb-dp-day, .ngb-dp-weekday, .ngb-dp-week-number {\n      width: 2rem;\n      height: 2rem;\n    }\n    .ngb-dp-day {\n      cursor: pointer;\n    }\n    .ngb-dp-day.disabled, .ngb-dp-day.hidden {\n      cursor: default;\n    }\n  "],
                    template: "\n    <div *ngIf=\"showWeekdays\" class=\"ngb-dp-week ngb-dp-weekdays bg-light\">\n      <div *ngIf=\"showWeekNumbers\" class=\"ngb-dp-weekday ngb-dp-showweek\"></div>\n      <div *ngFor=\"let w of month.weekdays\" class=\"ngb-dp-weekday small\">\n        {{ i18n.getWeekdayShortName(w) }}\n      </div>\n    </div>\n    <ng-template ngFor let-week [ngForOf]=\"month.weeks\">\n      <div *ngIf=\"!week.collapsed\" class=\"ngb-dp-week\" role=\"row\">\n        <div *ngIf=\"showWeekNumbers\" class=\"ngb-dp-week-number small text-muted\">{{ i18n.getWeekNumerals(week.number) }}</div>\n        <div *ngFor=\"let day of week.days\" (click)=\"doSelect(day)\" class=\"ngb-dp-day\" role=\"gridcell\"\n          [class.disabled]=\"day.context.disabled\"\n          [tabindex]=\"day.tabindex\"\n          [class.hidden]=\"day.hidden\"\n          [attr.aria-label]=\"day.ariaLabel\">\n          <ng-template [ngIf]=\"!day.hidden\">\n            <ng-template [ngTemplateOutlet]=\"dayTemplate\" [ngTemplateOutletContext]=\"day.context\"></ng-template>\n          </ng-template>\n        </div>\n      </div>\n    </ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerMonthView.ctorParameters = function () { return [
        { type: NgbDatepickerI18n }
    ]; };
    NgbDatepickerMonthView.propDecorators = {
        dayTemplate: [{ type: Input }],
        month: [{ type: Input }],
        showWeekdays: [{ type: Input }],
        showWeekNumbers: [{ type: Input }],
        select: [{ type: Output }]
    };
    return NgbDatepickerMonthView;
}());
export { NgbDatepickerMonthView };
if (false) {
    /** @type {?} */
    NgbDatepickerMonthView.prototype.dayTemplate;
    /** @type {?} */
    NgbDatepickerMonthView.prototype.month;
    /** @type {?} */
    NgbDatepickerMonthView.prototype.showWeekdays;
    /** @type {?} */
    NgbDatepickerMonthView.prototype.showWeekNumbers;
    /** @type {?} */
    NgbDatepickerMonthView.prototype.select;
    /** @type {?} */
    NgbDatepickerMonthView.prototype.i18n;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb250aC12aWV3LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJkYXRlcGlja2VyL2RhdGVwaWNrZXItbW9udGgtdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHbEYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0lBc0VsRCxnQ0FBbUIsSUFBdUI7UUFBdkIsU0FBSSxHQUFKLElBQUksQ0FBbUI7c0JBRnZCLElBQUksWUFBWSxFQUFXO0tBRUE7Ozs7O0lBRTlDLHlDQUFROzs7O0lBQVIsVUFBUyxHQUFpQjtRQUN4QixFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0tBQ0Y7O2dCQXpFRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLDJCQUEyQjtvQkFDckMsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBQztvQkFDdEIsTUFBTSxFQUFFLENBQUMseXNCQWdDUixDQUFDO29CQUNGLFFBQVEsRUFBRSxpbUNBcUJUO2lCQUNGOzs7O2dCQTdETyxpQkFBaUI7Ozs4QkErRHRCLEtBQUs7d0JBQ0wsS0FBSzsrQkFDTCxLQUFLO2tDQUNMLEtBQUs7eUJBRUwsTUFBTTs7aUNBdkVUOztTQWlFYSxzQkFBc0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmLCBPdXRwdXQsIEV2ZW50RW1pdHRlcn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge01vbnRoVmlld01vZGVsLCBEYXlWaWV3TW9kZWx9IGZyb20gJy4vZGF0ZXBpY2tlci12aWV3LW1vZGVsJztcbmltcG9ydCB7TmdiRGF0ZX0gZnJvbSAnLi9uZ2ItZGF0ZSc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThufSBmcm9tICcuL2RhdGVwaWNrZXItaTE4bic7XG5pbXBvcnQge0RheVRlbXBsYXRlQ29udGV4dH0gZnJvbSAnLi9kYXRlcGlja2VyLWRheS10ZW1wbGF0ZS1jb250ZXh0JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWRhdGVwaWNrZXItbW9udGgtdmlldycsXG4gIGhvc3Q6IHsncm9sZSc6ICdncmlkJ30sXG4gIHN0eWxlczogW2BcbiAgICA6aG9zdCB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICB9XG4gICAgLm5nYi1kcC13ZWVrZGF5LCAubmdiLWRwLXdlZWstbnVtYmVyIHtcbiAgICAgIGxpbmUtaGVpZ2h0OiAycmVtO1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgICAgZm9udC1zdHlsZTogaXRhbGljO1xuICAgIH1cbiAgICAubmdiLWRwLXdlZWtkYXkge1xuICAgICAgY29sb3I6ICM1YmMwZGU7XG4gICAgICBjb2xvcjogdmFyKC0taW5mbyk7XG4gICAgfVxuICAgIC5uZ2ItZHAtd2VlayB7XG4gICAgICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xuICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgIH1cbiAgICAubmdiLWRwLXdlZWtkYXlzIHtcbiAgICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMTI1KTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDA7XG4gICAgfVxuICAgIC5uZ2ItZHAtZGF5LCAubmdiLWRwLXdlZWtkYXksIC5uZ2ItZHAtd2Vlay1udW1iZXIge1xuICAgICAgd2lkdGg6IDJyZW07XG4gICAgICBoZWlnaHQ6IDJyZW07XG4gICAgfVxuICAgIC5uZ2ItZHAtZGF5IHtcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB9XG4gICAgLm5nYi1kcC1kYXkuZGlzYWJsZWQsIC5uZ2ItZHAtZGF5LmhpZGRlbiB7XG4gICAgICBjdXJzb3I6IGRlZmF1bHQ7XG4gICAgfVxuICBgXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2ICpuZ0lmPVwic2hvd1dlZWtkYXlzXCIgY2xhc3M9XCJuZ2ItZHAtd2VlayBuZ2ItZHAtd2Vla2RheXMgYmctbGlnaHRcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJzaG93V2Vla051bWJlcnNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrZGF5IG5nYi1kcC1zaG93d2Vla1wiPjwvZGl2PlxuICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgdyBvZiBtb250aC53ZWVrZGF5c1wiIGNsYXNzPVwibmdiLWRwLXdlZWtkYXkgc21hbGxcIj5cbiAgICAgICAge3sgaTE4bi5nZXRXZWVrZGF5U2hvcnROYW1lKHcpIH19XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8bmctdGVtcGxhdGUgbmdGb3IgbGV0LXdlZWsgW25nRm9yT2ZdPVwibW9udGgud2Vla3NcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCIhd2Vlay5jb2xsYXBzZWRcIiBjbGFzcz1cIm5nYi1kcC13ZWVrXCIgcm9sZT1cInJvd1wiPlxuICAgICAgICA8ZGl2ICpuZ0lmPVwic2hvd1dlZWtOdW1iZXJzXCIgY2xhc3M9XCJuZ2ItZHAtd2Vlay1udW1iZXIgc21hbGwgdGV4dC1tdXRlZFwiPnt7IGkxOG4uZ2V0V2Vla051bWVyYWxzKHdlZWsubnVtYmVyKSB9fTwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBkYXkgb2Ygd2Vlay5kYXlzXCIgKGNsaWNrKT1cImRvU2VsZWN0KGRheSlcIiBjbGFzcz1cIm5nYi1kcC1kYXlcIiByb2xlPVwiZ3JpZGNlbGxcIlxuICAgICAgICAgIFtjbGFzcy5kaXNhYmxlZF09XCJkYXkuY29udGV4dC5kaXNhYmxlZFwiXG4gICAgICAgICAgW3RhYmluZGV4XT1cImRheS50YWJpbmRleFwiXG4gICAgICAgICAgW2NsYXNzLmhpZGRlbl09XCJkYXkuaGlkZGVuXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImRheS5hcmlhTGFiZWxcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgW25nSWZdPVwiIWRheS5oaWRkZW5cIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJkYXlUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJkYXkuY29udGV4dFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVwaWNrZXJNb250aFZpZXcge1xuICBASW5wdXQoKSBkYXlUZW1wbGF0ZTogVGVtcGxhdGVSZWY8RGF5VGVtcGxhdGVDb250ZXh0PjtcbiAgQElucHV0KCkgbW9udGg6IE1vbnRoVmlld01vZGVsO1xuICBASW5wdXQoKSBzaG93V2Vla2RheXM7XG4gIEBJbnB1dCgpIHNob3dXZWVrTnVtYmVycztcblxuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4bikge31cblxuICBkb1NlbGVjdChkYXk6IERheVZpZXdNb2RlbCkge1xuICAgIGlmICghZGF5LmNvbnRleHQuZGlzYWJsZWQgJiYgIWRheS5oaWRkZW4pIHtcbiAgICAgIHRoaXMuc2VsZWN0LmVtaXQoZGF5LmRhdGUpO1xuICAgIH1cbiAgfVxufVxuIl19