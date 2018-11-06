/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbTimepicker } from './timepicker';
import { NgbTimeAdapter, NgbTimeStructAdapter } from './ngb-time-adapter';
export { NgbTimepicker } from './timepicker';
export { NgbTimepickerConfig } from './timepicker-config';
export { NgbTimeAdapter } from './ngb-time-adapter';
var NgbTimepickerModule = /** @class */ (function () {
    function NgbTimepickerModule() {
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
    NgbTimepickerModule.forRoot = /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    function () { return { ngModule: NgbTimepickerModule }; };
    NgbTimepickerModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgbTimepicker],
                    exports: [NgbTimepicker],
                    imports: [CommonModule],
                    providers: [{ provide: NgbTimeAdapter, useClass: NgbTimeStructAdapter }]
                },] },
    ];
    return NgbTimepickerModule;
}());
export { NgbTimepickerModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXBpY2tlci5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbInRpbWVwaWNrZXIvdGltZXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQXNCLE1BQU0sZUFBZSxDQUFDO0FBQzVELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3QyxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxjQUFjLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUV4RSxPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBRXhELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQzs7OztJQVNoRDs7Ozs7T0FLRzs7Ozs7Ozs7SUFDSSwyQkFBTzs7Ozs7OztJQUFkLGNBQXdDLE1BQU0sQ0FBQyxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBQyxDQUFDLEVBQUU7O2dCQWJsRixRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsYUFBYSxDQUFDO29CQUM3QixPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUM7b0JBQ3hCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsU0FBUyxFQUFFLENBQUMsRUFBQyxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxvQkFBb0IsRUFBQyxDQUFDO2lCQUN2RTs7OEJBaEJEOztTQWlCYSxtQkFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7Q29tbW9uTW9kdWxlfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYlRpbWVwaWNrZXJ9IGZyb20gJy4vdGltZXBpY2tlcic7XG5pbXBvcnQge05nYlRpbWVBZGFwdGVyLCBOZ2JUaW1lU3RydWN0QWRhcHRlcn0gZnJvbSAnLi9uZ2ItdGltZS1hZGFwdGVyJztcblxuZXhwb3J0IHtOZ2JUaW1lcGlja2VyfSBmcm9tICcuL3RpbWVwaWNrZXInO1xuZXhwb3J0IHtOZ2JUaW1lcGlja2VyQ29uZmlnfSBmcm9tICcuL3RpbWVwaWNrZXItY29uZmlnJztcbmV4cG9ydCB7TmdiVGltZVN0cnVjdH0gZnJvbSAnLi9uZ2ItdGltZS1zdHJ1Y3QnO1xuZXhwb3J0IHtOZ2JUaW1lQWRhcHRlcn0gZnJvbSAnLi9uZ2ItdGltZS1hZGFwdGVyJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbTmdiVGltZXBpY2tlcl0sXG4gIGV4cG9ydHM6IFtOZ2JUaW1lcGlja2VyXSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBOZ2JUaW1lQWRhcHRlciwgdXNlQ2xhc3M6IE5nYlRpbWVTdHJ1Y3RBZGFwdGVyfV1cbn0pXG5leHBvcnQgY2xhc3MgTmdiVGltZXBpY2tlck1vZHVsZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRpbmcgd2l0aCAnLmZvclJvb3QoKScgaXMgbm8gbG9uZ2VyIG5lY2Vzc2FyeSwgeW91IGNhbiBzaW1wbHkgaW1wb3J0IHRoZSBtb2R1bGUuXG4gICAqIFdpbGwgYmUgcmVtb3ZlZCBpbiA0LjAuMC5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgMy4wLjBcbiAgICovXG4gIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnMgeyByZXR1cm4ge25nTW9kdWxlOiBOZ2JUaW1lcGlja2VyTW9kdWxlfTsgfVxufVxuIl19