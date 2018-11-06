/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { NgbModalBackdrop } from './modal-backdrop';
import { NgbModalWindow } from './modal-window';
import { NgbModal } from './modal';
export { NgbModal } from './modal';
export { NgbModalRef, NgbActiveModal } from './modal-ref';
export { ModalDismissReasons } from './modal-dismiss-reasons';
var NgbModalModule = /** @class */ (function () {
    function NgbModalModule() {
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
    NgbModalModule.forRoot = /**
     * Importing with '.forRoot()' is no longer necessary, you can simply import the module.
     * Will be removed in 4.0.0.
     *
     * @deprecated 3.0.0
     * @return {?}
     */
    function () { return { ngModule: NgbModalModule }; };
    NgbModalModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [NgbModalBackdrop, NgbModalWindow],
                    entryComponents: [NgbModalBackdrop, NgbModalWindow],
                    providers: [NgbModal]
                },] },
    ];
    return NgbModalModule;
}());
export { NgbModalModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJtb2RhbC9tb2RhbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBQyxRQUFRLEVBQXNCLE1BQU0sZUFBZSxDQUFDO0FBRTVELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRWpDLE9BQU8sRUFBQyxRQUFRLEVBQWtCLE1BQU0sU0FBUyxDQUFDO0FBQ2xELE9BQU8sRUFBQyxXQUFXLEVBQUUsY0FBYyxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQ3hELE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHlCQUF5QixDQUFDOzs7O0lBUTFEOzs7OztPQUtHOzs7Ozs7OztJQUNJLHNCQUFPOzs7Ozs7O0lBQWQsY0FBd0MsTUFBTSxDQUFDLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQyxDQUFDLEVBQUU7O2dCQVo3RSxRQUFRLFNBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDO29CQUNoRCxlQUFlLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUM7b0JBQ25ELFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQztpQkFDdEI7O3lCQWREOztTQWVhLGNBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge05nTW9kdWxlLCBNb2R1bGVXaXRoUHJvdmlkZXJzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtOZ2JNb2RhbEJhY2tkcm9wfSBmcm9tICcuL21vZGFsLWJhY2tkcm9wJztcbmltcG9ydCB7TmdiTW9kYWxXaW5kb3d9IGZyb20gJy4vbW9kYWwtd2luZG93JztcbmltcG9ydCB7TmdiTW9kYWx9IGZyb20gJy4vbW9kYWwnO1xuXG5leHBvcnQge05nYk1vZGFsLCBOZ2JNb2RhbE9wdGlvbnN9IGZyb20gJy4vbW9kYWwnO1xuZXhwb3J0IHtOZ2JNb2RhbFJlZiwgTmdiQWN0aXZlTW9kYWx9IGZyb20gJy4vbW9kYWwtcmVmJztcbmV4cG9ydCB7TW9kYWxEaXNtaXNzUmVhc29uc30gZnJvbSAnLi9tb2RhbC1kaXNtaXNzLXJlYXNvbnMnO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtOZ2JNb2RhbEJhY2tkcm9wLCBOZ2JNb2RhbFdpbmRvd10sXG4gIGVudHJ5Q29tcG9uZW50czogW05nYk1vZGFsQmFja2Ryb3AsIE5nYk1vZGFsV2luZG93XSxcbiAgcHJvdmlkZXJzOiBbTmdiTW9kYWxdXG59KVxuZXhwb3J0IGNsYXNzIE5nYk1vZGFsTW9kdWxlIHtcbiAgLyoqXG4gICAqIEltcG9ydGluZyB3aXRoICcuZm9yUm9vdCgpJyBpcyBubyBsb25nZXIgbmVjZXNzYXJ5LCB5b3UgY2FuIHNpbXBseSBpbXBvcnQgdGhlIG1vZHVsZS5cbiAgICogV2lsbCBiZSByZW1vdmVkIGluIDQuMC4wLlxuICAgKlxuICAgKiBAZGVwcmVjYXRlZCAzLjAuMFxuICAgKi9cbiAgc3RhdGljIGZvclJvb3QoKTogTW9kdWxlV2l0aFByb3ZpZGVycyB7IHJldHVybiB7bmdNb2R1bGU6IE5nYk1vZGFsTW9kdWxlfTsgfVxufVxuIl19