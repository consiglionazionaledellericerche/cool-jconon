/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDatepicker } from './datepicker';
import { NgbDatepickerMonthView } from './datepicker-month-view';
import { NgbDatepickerNavigation } from './datepicker-navigation';
import { NgbInputDatepicker } from './datepicker-input';
import { NgbDatepickerDayView } from './datepicker-day-view';
import { NgbDatepickerI18n, NgbDatepickerI18nDefault } from './datepicker-i18n';
import { NgbCalendar, NgbCalendarGregorian } from './ngb-calendar';
import { NgbDateParserFormatter, NgbDateISOParserFormatter } from './ngb-date-parser-formatter';
import { NgbDateAdapter, NgbDateStructAdapter } from './adapters/ngb-date-adapter';
import { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
export { NgbDatepicker } from './datepicker';
export { NgbInputDatepicker } from './datepicker-input';
export { NgbCalendar } from './ngb-calendar';
export { NgbCalendarIslamicCivil } from './hijri/ngb-calendar-islamic-civil';
export { NgbCalendarIslamicUmalqura } from './hijri/ngb-calendar-islamic-umalqura';
export { NgbDatepickerMonthView } from './datepicker-month-view';
export { NgbDatepickerDayView } from './datepicker-day-view';
export { NgbDatepickerNavigation } from './datepicker-navigation';
export { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
export { NgbDatepickerConfig } from './datepicker-config';
export { NgbDatepickerI18n } from './datepicker-i18n';
export { NgbDate } from './ngb-date';
export { NgbDateAdapter } from './adapters/ngb-date-adapter';
export { NgbDateNativeAdapter } from './adapters/ngb-date-native-adapter';
export { NgbDateParserFormatter } from './ngb-date-parser-formatter';
export { NgbCalendarPersian } from './jalali/ngb-calendar-persian';
var NgbDatepickerModule = /** @class */ (function () {
    function NgbDatepickerModule() {
    }
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     */
    /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    NgbDatepickerModule.forRoot = /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    function () { return { ngModule: NgbDatepickerModule }; };
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
    return NgbDatepickerModule;
}());
export { NgbDatepickerModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImRhdGVwaWNrZXIvZGF0ZXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQXNCLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUMzQyxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsaUJBQWlCLEVBQUUsd0JBQXdCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RSxPQUFPLEVBQUMsV0FBVyxFQUFFLG9CQUFvQixFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFDLHNCQUFzQixFQUFFLHlCQUF5QixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDOUYsT0FBTyxFQUFDLGNBQWMsRUFBRSxvQkFBb0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQ2pGLE9BQU8sRUFBQyw2QkFBNkIsRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBRTdFLE9BQU8sRUFBQyxhQUFhLEVBQTZCLE1BQU0sY0FBYyxDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxXQUFXLEVBQVksTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSx1Q0FBdUMsQ0FBQztBQUNqRixPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUMvRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsNkJBQTZCLEVBQUMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RSxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUN4RCxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUVwRCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ25DLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUMzRCxPQUFPLEVBQUMsb0JBQW9CLEVBQUMsTUFBTSxvQ0FBb0MsQ0FBQztBQUN4RSxPQUFPLEVBQUMsc0JBQXNCLEVBQUMsTUFBTSw2QkFBNkIsQ0FBQztBQUNuRSxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQzs7OztJQWtCL0Q7Ozs7O09BS0c7Ozs7Ozs7O0lBQ0ksMkJBQU87Ozs7Ozs7SUFBZCxjQUF3QyxNQUFNLENBQUMsRUFBQyxRQUFRLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQyxFQUFFOztnQkF0QmxGLFFBQVEsU0FBQztvQkFDUixZQUFZLEVBQUU7d0JBQ1osYUFBYSxFQUFFLHNCQUFzQixFQUFFLHVCQUF1QixFQUFFLDZCQUE2QixFQUFFLG9CQUFvQjt3QkFDbkgsa0JBQWtCO3FCQUNuQjtvQkFDRCxPQUFPLEVBQUUsQ0FBQyxhQUFhLEVBQUUsa0JBQWtCLENBQUM7b0JBQzVDLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7b0JBQ3BDLFNBQVMsRUFBRTt3QkFDVCxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLG9CQUFvQixFQUFDO3dCQUN0RCxFQUFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLEVBQUUsd0JBQXdCLEVBQUM7d0JBQ2hFLEVBQUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBQzt3QkFDdEUsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBQztxQkFDMUQ7b0JBQ0QsZUFBZSxFQUFFLENBQUMsYUFBYSxDQUFDO2lCQUNqQzs7OEJBOUNEOztTQStDYSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtGb3Jtc01vZHVsZX0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyfSBmcm9tICcuL2RhdGVwaWNrZXInO1xuaW1wb3J0IHtOZ2JEYXRlcGlja2VyTW9udGhWaWV3fSBmcm9tICcuL2RhdGVwaWNrZXItbW9udGgtdmlldyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJOYXZpZ2F0aW9ufSBmcm9tICcuL2RhdGVwaWNrZXItbmF2aWdhdGlvbic7XG5pbXBvcnQge05nYklucHV0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0JztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlckRheVZpZXd9IGZyb20gJy4vZGF0ZXBpY2tlci1kYXktdmlldyc7XG5pbXBvcnQge05nYkRhdGVwaWNrZXJJMThuLCBOZ2JEYXRlcGlja2VySTE4bkRlZmF1bHR9IGZyb20gJy4vZGF0ZXBpY2tlci1pMThuJztcbmltcG9ydCB7TmdiQ2FsZW5kYXIsIE5nYkNhbGVuZGFyR3JlZ29yaWFufSBmcm9tICcuL25nYi1jYWxlbmRhcic7XG5pbXBvcnQge05nYkRhdGVQYXJzZXJGb3JtYXR0ZXIsIE5nYkRhdGVJU09QYXJzZXJGb3JtYXR0ZXJ9IGZyb20gJy4vbmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlcic7XG5pbXBvcnQge05nYkRhdGVBZGFwdGVyLCBOZ2JEYXRlU3RydWN0QWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmltcG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3R9IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdCc7XG5cbmV4cG9ydCB7TmdiRGF0ZXBpY2tlciwgTmdiRGF0ZXBpY2tlck5hdmlnYXRlRXZlbnR9IGZyb20gJy4vZGF0ZXBpY2tlcic7XG5leHBvcnQge05nYklucHV0RGF0ZXBpY2tlcn0gZnJvbSAnLi9kYXRlcGlja2VyLWlucHV0JztcbmV4cG9ydCB7TmdiQ2FsZW5kYXIsIE5nYlBlcmlvZH0gZnJvbSAnLi9uZ2ItY2FsZW5kYXInO1xuZXhwb3J0IHtOZ2JDYWxlbmRhcklzbGFtaWNDaXZpbH0gZnJvbSAnLi9oaWpyaS9uZ2ItY2FsZW5kYXItaXNsYW1pYy1jaXZpbCc7XG5leHBvcnQge05nYkNhbGVuZGFySXNsYW1pY1VtYWxxdXJhfSBmcm9tICcuL2hpanJpL25nYi1jYWxlbmRhci1pc2xhbWljLXVtYWxxdXJhJztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck1vbnRoVmlld30gZnJvbSAnLi9kYXRlcGlja2VyLW1vbnRoLXZpZXcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VyRGF5Vmlld30gZnJvbSAnLi9kYXRlcGlja2VyLWRheS12aWV3JztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb259IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uJztcbmV4cG9ydCB7TmdiRGF0ZXBpY2tlck5hdmlnYXRpb25TZWxlY3R9IGZyb20gJy4vZGF0ZXBpY2tlci1uYXZpZ2F0aW9uLXNlbGVjdCc7XG5leHBvcnQge05nYkRhdGVwaWNrZXJDb25maWd9IGZyb20gJy4vZGF0ZXBpY2tlci1jb25maWcnO1xuZXhwb3J0IHtOZ2JEYXRlcGlja2VySTE4bn0gZnJvbSAnLi9kYXRlcGlja2VyLWkxOG4nO1xuZXhwb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5leHBvcnQge05nYkRhdGV9IGZyb20gJy4vbmdiLWRhdGUnO1xuZXhwb3J0IHtOZ2JEYXRlQWRhcHRlcn0gZnJvbSAnLi9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyJztcbmV4cG9ydCB7TmdiRGF0ZU5hdGl2ZUFkYXB0ZXJ9IGZyb20gJy4vYWRhcHRlcnMvbmdiLWRhdGUtbmF0aXZlLWFkYXB0ZXInO1xuZXhwb3J0IHtOZ2JEYXRlUGFyc2VyRm9ybWF0dGVyfSBmcm9tICcuL25nYi1kYXRlLXBhcnNlci1mb3JtYXR0ZXInO1xuZXhwb3J0IHtOZ2JDYWxlbmRhclBlcnNpYW59IGZyb20gJy4vamFsYWxpL25nYi1jYWxlbmRhci1wZXJzaWFuJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgTmdiRGF0ZXBpY2tlciwgTmdiRGF0ZXBpY2tlck1vbnRoVmlldywgTmdiRGF0ZXBpY2tlck5hdmlnYXRpb24sIE5nYkRhdGVwaWNrZXJOYXZpZ2F0aW9uU2VsZWN0LCBOZ2JEYXRlcGlja2VyRGF5VmlldyxcbiAgICBOZ2JJbnB1dERhdGVwaWNrZXJcbiAgXSxcbiAgZXhwb3J0czogW05nYkRhdGVwaWNrZXIsIE5nYklucHV0RGF0ZXBpY2tlcl0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlXSxcbiAgcHJvdmlkZXJzOiBbXG4gICAge3Byb3ZpZGU6IE5nYkNhbGVuZGFyLCB1c2VDbGFzczogTmdiQ2FsZW5kYXJHcmVnb3JpYW59LFxuICAgIHtwcm92aWRlOiBOZ2JEYXRlcGlja2VySTE4biwgdXNlQ2xhc3M6IE5nYkRhdGVwaWNrZXJJMThuRGVmYXVsdH0sXG4gICAge3Byb3ZpZGU6IE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIsIHVzZUNsYXNzOiBOZ2JEYXRlSVNPUGFyc2VyRm9ybWF0dGVyfSxcbiAgICB7cHJvdmlkZTogTmdiRGF0ZUFkYXB0ZXIsIHVzZUNsYXNzOiBOZ2JEYXRlU3RydWN0QWRhcHRlcn1cbiAgXSxcbiAgZW50cnlDb21wb25lbnRzOiBbTmdiRGF0ZXBpY2tlcl1cbn0pXG5leHBvcnQgY2xhc3MgTmdiRGF0ZXBpY2tlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JEYXRlcGlja2VyTW9kdWxlfTsgfVxufVxuIl19