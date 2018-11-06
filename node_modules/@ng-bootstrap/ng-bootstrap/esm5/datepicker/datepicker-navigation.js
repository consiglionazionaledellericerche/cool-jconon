/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { NavigationEvent } from './datepicker-view-model';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
var NgbDatepickerNavigation = /** @class */ (function () {
    function NgbDatepickerNavigation(i18n) {
        this.i18n = i18n;
        this.navigation = NavigationEvent;
        this.months = [];
        this.navigate = new EventEmitter();
        this.select = new EventEmitter();
    }
    NgbDatepickerNavigation.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-datepicker-navigation',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: ["\n    :host {\n      display: -ms-flexbox;\n      display: flex;\n      align-items: center;\n    }\n    .ngb-dp-navigation-chevron {\n      border-style: solid;\n      border-width: 0.2em 0.2em 0 0;\n      display: inline-block;\n      width: 0.75em;\n      height: 0.75em;\n      margin-left: 0.25em;\n      margin-right: 0.15em;\n      transform: rotate(-135deg);\n      -ms-transform: rotate(-135deg);\n    }\n    .right .ngb-dp-navigation-chevron {\n      -ms-transform: rotate(45deg);\n      transform: rotate(45deg);\n      margin-left: 0.15em;\n      margin-right: 0.25em;\n    }\n    .ngb-dp-arrow {\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex: 1 1 auto;\n      flex-grow: 1;\n      padding-right: 0;\n      padding-left: 0;\n      margin: 0;\n      width: 2rem;\n      height: 2rem;\n    }\n    .ngb-dp-arrow.right {\n      -ms-flex-pack: end;\n      justify-content: flex-end;\n    }\n    .ngb-dp-arrow-btn {\n      padding: 0 0.25rem;\n      margin: 0 0.5rem;\n      border: none;\n      background-color: transparent;\n      z-index: 1;\n    }\n    .ngb-dp-arrow-btn:focus {\n      outline: auto 1px;\n    }\n    .ngb-dp-month-name {\n      font-size: larger;\n      height: 2rem;\n      line-height: 2rem;\n      text-align: center;\n    }\n    .ngb-dp-navigation-select {\n      display: -ms-flexbox;\n      display: flex;\n      -ms-flex: 1 1 9rem;\n      flex-grow: 1;\n      flex-basis: 9rem;\n    }\n  "],
                    template: "\n    <div class=\"ngb-dp-arrow\">\n      <button type=\"button\" class=\"btn btn-link ngb-dp-arrow-btn\" (click)=\"!!navigate.emit(navigation.PREV)\" [disabled]=\"prevDisabled\"\n              i18n-aria-label=\"@@ngb.datepicker.previous-month\" aria-label=\"Previous month\"\n              i18n-title=\"@@ngb.datepicker.previous-month\" title=\"Previous month\">\n        <span class=\"ngb-dp-navigation-chevron\"></span>\n      </button>\n    </div>\n    <ngb-datepicker-navigation-select *ngIf=\"showSelect\" class=\"ngb-dp-navigation-select\"\n      [date]=\"date\"\n      [disabled] = \"disabled\"\n      [months]=\"selectBoxes.months\"\n      [years]=\"selectBoxes.years\"\n      (select)=\"select.emit($event)\">\n    </ngb-datepicker-navigation-select>\n\n    <ng-template *ngIf=\"!showSelect\" ngFor let-month [ngForOf]=\"months\" let-i=\"index\">\n      <div class=\"ngb-dp-arrow\" *ngIf=\"i > 0\"></div>\n      <div class=\"ngb-dp-month-name\">\n        {{ i18n.getMonthFullName(month.number) }} {{ month.year }}\n      </div>\n      <div class=\"ngb-dp-arrow\" *ngIf=\"i !== months.length - 1\"></div>\n    </ng-template>\n    <div class=\"ngb-dp-arrow right\">\n      <button type=\"button\" class=\"btn btn-link ngb-dp-arrow-btn\" (click)=\"!!navigate.emit(navigation.NEXT)\" [disabled]=\"nextDisabled\"\n              i18n-aria-label=\"@@ngb.datepicker.next-month\" aria-label=\"Next month\"\n              i18n-title=\"@@ngb.datepicker.next-month\" title=\"Next month\">\n        <span class=\"ngb-dp-navigation-chevron\"></span>\n      </button>\n    </div>\n    "
                },] },
    ];
    /** @nocollapse */
    NgbDatepickerNavigation.ctorParameters = function () { return [
        { type: NgbDatepickerI18n }
    ]; };
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
    return NgbDatepickerNavigation;
}());
export { NgbDatepickerNavigation };
if (false) {
    /** @type {?} */
    NgbDatepickerNavigation.prototype.navigation;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.date;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.disabled;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.months;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.showSelect;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.prevDisabled;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.nextDisabled;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.selectBoxes;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.navigate;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.select;
    /** @type {?} */
    NgbDatepickerNavigation.prototype.i18n;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJkYXRlcGlja2VyL2RhdGVwaWNrZXItbmF2aWdhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSx1QkFBdUIsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM5RixPQUFPLEVBQUMsZUFBZSxFQUFpQixNQUFNLHlCQUF5QixDQUFDO0FBQ3hFLE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7O0lBa0hsRCxpQ0FBbUIsSUFBdUI7UUFBdkIsU0FBSSxHQUFKLElBQUksQ0FBbUI7MEJBYjdCLGVBQWU7c0JBSVEsRUFBRTt3QkFNakIsSUFBSSxZQUFZLEVBQW1CO3NCQUNyQyxJQUFJLFlBQVksRUFBVztLQUVBOztnQkEvRy9DLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsTUFBTSxFQUFFLENBQUMsczZDQTZEUixDQUFDO29CQUNGLFFBQVEsRUFBRSw4aURBOEJQO2lCQUNKOzs7O2dCQW5HTyxpQkFBaUI7Ozt1QkF1R3RCLEtBQUs7MkJBQ0wsS0FBSzt5QkFDTCxLQUFLOzZCQUNMLEtBQUs7K0JBQ0wsS0FBSzsrQkFDTCxLQUFLOzhCQUNMLEtBQUs7MkJBRUwsTUFBTTt5QkFDTixNQUFNOztrQ0FuSFQ7O1NBdUdhLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBJbnB1dCwgT3V0cHV0LCBFdmVudEVtaXR0ZXIsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmF2aWdhdGlvbkV2ZW50LCBNb250aFZpZXdNb2RlbH0gZnJvbSAnLi9kYXRlcGlja2VyLXZpZXctbW9kZWwnO1xuaW1wb3J0IHtOZ2JEYXRlfSBmcm9tICcuL25nYi1kYXRlJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckkxOG59IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcblxuLy8gVGhlIC1tcy0gYW5kIC13ZWJraXQtIGVsZW1lbnQgZm9yIHRoZSBDU1MgY2FuIGJlIHJlbW92ZWQgaWYgd2UgYXJlIGdlbmVyYXRpbmcgdGhlIENTUyB1c2luZyBTQVNTLlxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbicsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICB9XG4gICAgLm5nYi1kcC1uYXZpZ2F0aW9uLWNoZXZyb24ge1xuICAgICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAgIGJvcmRlci13aWR0aDogMC4yZW0gMC4yZW0gMCAwO1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgd2lkdGg6IDAuNzVlbTtcbiAgICAgIGhlaWdodDogMC43NWVtO1xuICAgICAgbWFyZ2luLWxlZnQ6IDAuMjVlbTtcbiAgICAgIG1hcmdpbi1yaWdodDogMC4xNWVtO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoLTEzNWRlZyk7XG4gICAgICAtbXMtdHJhbnNmb3JtOiByb3RhdGUoLTEzNWRlZyk7XG4gICAgfVxuICAgIC5yaWdodCAubmdiLWRwLW5hdmlnYXRpb24tY2hldnJvbiB7XG4gICAgICAtbXMtdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xuICAgICAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xuICAgICAgbWFyZ2luLWxlZnQ6IDAuMTVlbTtcbiAgICAgIG1hcmdpbi1yaWdodDogMC4yNWVtO1xuICAgIH1cbiAgICAubmdiLWRwLWFycm93IHtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIC1tcy1mbGV4OiAxIDEgYXV0bztcbiAgICAgIGZsZXgtZ3JvdzogMTtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDA7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgICBtYXJnaW46IDA7XG4gICAgICB3aWR0aDogMnJlbTtcbiAgICAgIGhlaWdodDogMnJlbTtcbiAgICB9XG4gICAgLm5nYi1kcC1hcnJvdy5yaWdodCB7XG4gICAgICAtbXMtZmxleC1wYWNrOiBlbmQ7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtZW5kO1xuICAgIH1cbiAgICAubmdiLWRwLWFycm93LWJ0biB7XG4gICAgICBwYWRkaW5nOiAwIDAuMjVyZW07XG4gICAgICBtYXJnaW46IDAgMC41cmVtO1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICB6LWluZGV4OiAxO1xuICAgIH1cbiAgICAubmdiLWRwLWFycm93LWJ0bjpmb2N1cyB7XG4gICAgICBvdXRsaW5lOiBhdXRvIDFweDtcbiAgICB9XG4gICAgLm5nYi1kcC1tb250aC1uYW1lIHtcbiAgICAgIGZvbnQtc2l6ZTogbGFyZ2VyO1xuICAgICAgaGVpZ2h0OiAycmVtO1xuICAgICAgbGluZS1oZWlnaHQ6IDJyZW07XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgfVxuICAgIC5uZ2ItZHAtbmF2aWdhdGlvbi1zZWxlY3Qge1xuICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgLW1zLWZsZXg6IDEgMSA5cmVtO1xuICAgICAgZmxleC1ncm93OiAxO1xuICAgICAgZmxleC1iYXNpczogOXJlbTtcbiAgICB9XG4gIGBdLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJuZ2ItZHAtYXJyb3dcIj5cbiAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1saW5rIG5nYi1kcC1hcnJvdy1idG5cIiAoY2xpY2spPVwiISFuYXZpZ2F0ZS5lbWl0KG5hdmlnYXRpb24uUFJFVilcIiBbZGlzYWJsZWRdPVwicHJldkRpc2FibGVkXCJcbiAgICAgICAgICAgICAgaTE4bi1hcmlhLWxhYmVsPVwiQEBuZ2IuZGF0ZXBpY2tlci5wcmV2aW91cy1tb250aFwiIGFyaWEtbGFiZWw9XCJQcmV2aW91cyBtb250aFwiXG4gICAgICAgICAgICAgIGkxOG4tdGl0bGU9XCJAQG5nYi5kYXRlcGlja2VyLnByZXZpb3VzLW1vbnRoXCIgdGl0bGU9XCJQcmV2aW91cyBtb250aFwiPlxuICAgICAgICA8c3BhbiBjbGFzcz1cIm5nYi1kcC1uYXZpZ2F0aW9uLWNoZXZyb25cIj48L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICA8bmdiLWRhdGVwaWNrZXItbmF2aWdhdGlvbi1zZWxlY3QgKm5nSWY9XCJzaG93U2VsZWN0XCIgY2xhc3M9XCJuZ2ItZHAtbmF2aWdhdGlvbi1zZWxlY3RcIlxuICAgICAgW2RhdGVdPVwiZGF0ZVwiXG4gICAgICBbZGlzYWJsZWRdID0gXCJkaXNhYmxlZFwiXG4gICAgICBbbW9udGhzXT1cInNlbGVjdEJveGVzLm1vbnRoc1wiXG4gICAgICBbeWVhcnNdPVwic2VsZWN0Qm94ZXMueWVhcnNcIlxuICAgICAgKHNlbGVjdCk9XCJzZWxlY3QuZW1pdCgkZXZlbnQpXCI+XG4gICAgPC9uZ2ItZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdD5cblxuICAgIDxuZy10ZW1wbGF0ZSAqbmdJZj1cIiFzaG93U2VsZWN0XCIgbmdGb3IgbGV0LW1vbnRoIFtuZ0Zvck9mXT1cIm1vbnRoc1wiIGxldC1pPVwiaW5kZXhcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJuZ2ItZHAtYXJyb3dcIiAqbmdJZj1cImkgPiAwXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLW1vbnRoLW5hbWVcIj5cbiAgICAgICAge3sgaTE4bi5nZXRNb250aEZ1bGxOYW1lKG1vbnRoLm51bWJlcikgfX0ge3sgbW9udGgueWVhciB9fVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwibmdiLWRwLWFycm93XCIgKm5nSWY9XCJpICE9PSBtb250aHMubGVuZ3RoIC0gMVwiPjwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPGRpdiBjbGFzcz1cIm5nYi1kcC1hcnJvdyByaWdodFwiPlxuICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWxpbmsgbmdiLWRwLWFycm93LWJ0blwiIChjbGljayk9XCIhIW5hdmlnYXRlLmVtaXQobmF2aWdhdGlvbi5ORVhUKVwiIFtkaXNhYmxlZF09XCJuZXh0RGlzYWJsZWRcIlxuICAgICAgICAgICAgICBpMThuLWFyaWEtbGFiZWw9XCJAQG5nYi5kYXRlcGlja2VyLm5leHQtbW9udGhcIiBhcmlhLWxhYmVsPVwiTmV4dCBtb250aFwiXG4gICAgICAgICAgICAgIGkxOG4tdGl0bGU9XCJAQG5nYi5kYXRlcGlja2VyLm5leHQtbW9udGhcIiB0aXRsZT1cIk5leHQgbW9udGhcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJuZ2ItZHAtbmF2aWdhdGlvbi1jaGV2cm9uXCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyTmF2aWdhdGlvbiB7XG4gIG5hdmlnYXRpb24gPSBOYXZpZ2F0aW9uRXZlbnQ7XG5cbiAgQElucHV0KCkgZGF0ZTogTmdiRGF0ZTtcbiAgQElucHV0KCkgZGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1vbnRoczogTW9udGhWaWV3TW9kZWxbXSA9IFtdO1xuICBASW5wdXQoKSBzaG93U2VsZWN0OiBib29sZWFuO1xuICBASW5wdXQoKSBwcmV2RGlzYWJsZWQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIG5leHREaXNhYmxlZDogYm9vbGVhbjtcbiAgQElucHV0KCkgc2VsZWN0Qm94ZXM6IHt5ZWFyczogbnVtYmVyW10sIG1vbnRoczogbnVtYmVyW119O1xuXG4gIEBPdXRwdXQoKSBuYXZpZ2F0ZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmF2aWdhdGlvbkV2ZW50PigpO1xuICBAT3V0cHV0KCkgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxOZ2JEYXRlPigpO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBpMThuOiBOZ2JEYXRlcGlja2VySTE4bikge31cbn1cbiJdfQ==