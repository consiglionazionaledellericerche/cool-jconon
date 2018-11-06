/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NgbDatepickerI18n } from './datepicker-i18n';
export class NgbDatepickerMonthView {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci1tb250aC12aWV3LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJkYXRlcGlja2VyL2RhdGVwaWNrZXItbW9udGgtdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHbEYsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUE4RHBELE1BQU07Ozs7SUFRSixZQUFtQixJQUF1QjtRQUF2QixTQUFJLEdBQUosSUFBSSxDQUFtQjtzQkFGdkIsSUFBSSxZQUFZLEVBQVc7S0FFQTs7Ozs7SUFFOUMsUUFBUSxDQUFDLEdBQWlCO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7S0FDRjs7O1lBekVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsMkJBQTJCO2dCQUNyQyxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFDO2dCQUN0QixNQUFNLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ1IsQ0FBQztnQkFDRixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCVDthQUNGOzs7O1lBN0RPLGlCQUFpQjs7OzBCQStEdEIsS0FBSztvQkFDTCxLQUFLOzJCQUNMLEtBQUs7OEJBQ0wsS0FBSztxQkFFTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBUZW1wbGF0ZVJlZiwgT3V0cHV0LCBFdmVudEVtaXR0ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtNb250aFZpZXdNb2RlbCwgRGF5Vmlld01vZGVsfSBmcm9tICcuL2RhdGVwaWNrZXItdmlldy1tb2RlbCc7XG5pbXBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuaW1wb3J0IHtEYXlUZW1wbGF0ZUNvbnRleHR9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdGVtcGxhdGUtY29udGV4dCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ25nYi1kYXRlcGlja2VyLW1vbnRoLXZpZXcnLFxuICBob3N0OiB7J3JvbGUnOiAnZ3JpZCd9LFxuICBzdHlsZXM6IFtgXG4gICAgOmhvc3Qge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuICAgIC5uZ2ItZHAtd2Vla2RheSwgLm5nYi1kcC13ZWVrLW51bWJlciB7XG4gICAgICBsaW5lLWhlaWdodDogMnJlbTtcbiAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICAgIGZvbnQtc3R5bGU6IGl0YWxpYztcbiAgICB9XG4gICAgLm5nYi1kcC13ZWVrZGF5IHtcbiAgICAgIGNvbG9yOiAjNWJjMGRlO1xuICAgICAgY29sb3I6IHZhcigtLWluZm8pO1xuICAgIH1cbiAgICAubmdiLWRwLXdlZWsge1xuICAgICAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcbiAgICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICB9XG4gICAgLm5nYi1kcC13ZWVrZGF5cyB7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjEyNSk7XG4gICAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIH1cbiAgICAubmdiLWRwLWRheSwgLm5nYi1kcC13ZWVrZGF5LCAubmdiLWRwLXdlZWstbnVtYmVyIHtcbiAgICAgIHdpZHRoOiAycmVtO1xuICAgICAgaGVpZ2h0OiAycmVtO1xuICAgIH1cbiAgICAubmdiLWRwLWRheSB7XG4gICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgfVxuICAgIC5uZ2ItZHAtZGF5LmRpc2FibGVkLCAubmdiLWRwLWRheS5oaWRkZW4ge1xuICAgICAgY3Vyc29yOiBkZWZhdWx0O1xuICAgIH1cbiAgYF0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiAqbmdJZj1cInNob3dXZWVrZGF5c1wiIGNsYXNzPVwibmdiLWRwLXdlZWsgbmdiLWRwLXdlZWtkYXlzIGJnLWxpZ2h0XCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwic2hvd1dlZWtOdW1iZXJzXCIgY2xhc3M9XCJuZ2ItZHAtd2Vla2RheSBuZ2ItZHAtc2hvd3dlZWtcIj48L2Rpdj5cbiAgICAgIDxkaXYgKm5nRm9yPVwibGV0IHcgb2YgbW9udGgud2Vla2RheXNcIiBjbGFzcz1cIm5nYi1kcC13ZWVrZGF5IHNtYWxsXCI+XG4gICAgICAgIHt7IGkxOG4uZ2V0V2Vla2RheVNob3J0TmFtZSh3KSB9fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC13ZWVrIFtuZ0Zvck9mXT1cIm1vbnRoLndlZWtzXCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwiIXdlZWsuY29sbGFwc2VkXCIgY2xhc3M9XCJuZ2ItZHAtd2Vla1wiIHJvbGU9XCJyb3dcIj5cbiAgICAgICAgPGRpdiAqbmdJZj1cInNob3dXZWVrTnVtYmVyc1wiIGNsYXNzPVwibmdiLWRwLXdlZWstbnVtYmVyIHNtYWxsIHRleHQtbXV0ZWRcIj57eyBpMThuLmdldFdlZWtOdW1lcmFscyh3ZWVrLm51bWJlcikgfX08L2Rpdj5cbiAgICAgICAgPGRpdiAqbmdGb3I9XCJsZXQgZGF5IG9mIHdlZWsuZGF5c1wiIChjbGljayk9XCJkb1NlbGVjdChkYXkpXCIgY2xhc3M9XCJuZ2ItZHAtZGF5XCIgcm9sZT1cImdyaWRjZWxsXCJcbiAgICAgICAgICBbY2xhc3MuZGlzYWJsZWRdPVwiZGF5LmNvbnRleHQuZGlzYWJsZWRcIlxuICAgICAgICAgIFt0YWJpbmRleF09XCJkYXkudGFiaW5kZXhcIlxuICAgICAgICAgIFtjbGFzcy5oaWRkZW5dPVwiZGF5LmhpZGRlblwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJkYXkuYXJpYUxhYmVsXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cIiFkYXkuaGlkZGVuXCI+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiZGF5VGVtcGxhdGVcIiBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiZGF5LmNvbnRleHRcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOZ2JEYXRlcGlja2VyTW9udGhWaWV3IHtcbiAgQElucHV0KCkgZGF5VGVtcGxhdGU6IFRlbXBsYXRlUmVmPERheVRlbXBsYXRlQ29udGV4dD47XG4gIEBJbnB1dCgpIG1vbnRoOiBNb250aFZpZXdNb2RlbDtcbiAgQElucHV0KCkgc2hvd1dlZWtkYXlzO1xuICBASW5wdXQoKSBzaG93V2Vla051bWJlcnM7XG5cbiAgQE91dHB1dCgpIHNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiRGF0ZT4oKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaTE4bjogTmdiRGF0ZXBpY2tlckkxOG4pIHt9XG5cbiAgZG9TZWxlY3QoZGF5OiBEYXlWaWV3TW9kZWwpIHtcbiAgICBpZiAoIWRheS5jb250ZXh0LmRpc2FibGVkICYmICFkYXkuaGlkZGVuKSB7XG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KGRheS5kYXRlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==