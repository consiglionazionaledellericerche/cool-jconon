/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component } from '@angular/core';
import { counter, } from '@fortawesome/fontawesome-svg-core';
import { FaLayersTextBaseComponent } from './layers-text-base.component';
/**
 * Fontawesome layers counter.
 */
export class FaLayersCounterComponent extends FaLayersTextBaseComponent {
    /**
     * Updating params by component props.
     * @return {?}
     */
    updateParams() {
        this.params = {
            title: this.title,
            classes: this.classes,
            styles: this.styles,
        };
    }
    /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    renderFontawesomeObject(content, params) {
        return counter(content, params);
    }
}
FaLayersCounterComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-layers-counter',
                template: '',
                host: {
                    class: 'ng-fa-layers-counter'
                }
            }] }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLWNvdW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvIiwic291cmNlcyI6WyJsYXllcnMvbGF5ZXJzLWNvdW50ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQ0wsU0FBUyxFQUVWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFDTCxPQUFPLEdBR1IsTUFBTSxtQ0FBbUMsQ0FBQztBQUMzQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7OztBQVl6RSxNQUFNLCtCQUFnQyxTQUFRLHlCQUF5Qjs7Ozs7SUFLM0QsWUFBWTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHO1lBQ1osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTztZQUNyQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07U0FDcEIsQ0FBQztLQUNIOzs7Ozs7SUFFUyx1QkFBdUIsQ0FBQyxPQUF3QixFQUFFLE1BQXNCO1FBQ2hGLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUNqQzs7O1lBdEJGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsbUJBQW1CO2dCQUM3QixRQUFRLEVBQUUsRUFBRTtnQkFDWixJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLHNCQUFzQjtpQkFDOUI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSG9zdEJpbmRpbmdcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBjb3VudGVyLFxuICBDb3VudGVyLFxuICBDb3VudGVyUGFyYW1zLFxufSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgRmFMYXllcnNUZXh0QmFzZUNvbXBvbmVudCB9IGZyb20gJy4vbGF5ZXJzLXRleHQtYmFzZS5jb21wb25lbnQnO1xuXG4vKipcbiAqIEZvbnRhd2Vzb21lIGxheWVycyBjb3VudGVyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYS1sYXllcnMtY291bnRlcicsXG4gIHRlbXBsYXRlOiAnJyxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnbmctZmEtbGF5ZXJzLWNvdW50ZXInXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgRmFMYXllcnNDb3VudGVyQ29tcG9uZW50IGV4dGVuZHMgRmFMYXllcnNUZXh0QmFzZUNvbXBvbmVudCB7XG5cbiAgLyoqXG4gICAqIFVwZGF0aW5nIHBhcmFtcyBieSBjb21wb25lbnQgcHJvcHMuXG4gICAqL1xuICBwcm90ZWN0ZWQgdXBkYXRlUGFyYW1zKCkge1xuICAgIHRoaXMucGFyYW1zID0ge1xuICAgICAgdGl0bGU6IHRoaXMudGl0bGUsXG4gICAgICBjbGFzc2VzOiB0aGlzLmNsYXNzZXMsXG4gICAgICBzdHlsZXM6IHRoaXMuc3R5bGVzLFxuICAgIH07XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVuZGVyRm9udGF3ZXNvbWVPYmplY3QoY29udGVudDogc3RyaW5nIHwgbnVtYmVyLCBwYXJhbXM/OiBDb3VudGVyUGFyYW1zKSB7XG4gICAgcmV0dXJuIGNvdW50ZXIoY29udGVudCwgcGFyYW1zKTtcbiAgfVxufVxuXG4iXX0=