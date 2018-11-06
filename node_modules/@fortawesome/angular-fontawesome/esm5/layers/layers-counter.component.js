/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { counter, } from '@fortawesome/fontawesome-svg-core';
import { FaLayersTextBaseComponent } from './layers-text-base.component';
/**
 * Fontawesome layers counter.
 */
var FaLayersCounterComponent = /** @class */ (function (_super) {
    tslib_1.__extends(FaLayersCounterComponent, _super);
    function FaLayersCounterComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updating params by component props.
     */
    /**
     * Updating params by component props.
     * @return {?}
     */
    FaLayersCounterComponent.prototype.updateParams = /**
     * Updating params by component props.
     * @return {?}
     */
    function () {
        this.params = {
            title: this.title,
            classes: this.classes,
            styles: this.styles,
        };
    };
    /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    FaLayersCounterComponent.prototype.renderFontawesomeObject = /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    function (content, params) {
        return counter(content, params);
    };
    FaLayersCounterComponent.decorators = [
        { type: Component, args: [{
                    selector: 'fa-layers-counter',
                    template: '',
                    host: {
                        class: 'ng-fa-layers-counter'
                    }
                }] }
    ];
    return FaLayersCounterComponent;
}(FaLayersTextBaseComponent));
export { FaLayersCounterComponent };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLWNvdW50ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvIiwic291cmNlcyI6WyJsYXllcnMvbGF5ZXJzLWNvdW50ZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsT0FBTyxHQUdSLE1BQU0sbUNBQW1DLENBQUM7QUFDM0MsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sOEJBQThCLENBQUM7Ozs7O0lBWTNCLG9EQUF5Qjs7OztJQUVyRTs7T0FFRzs7Ozs7SUFDTywrQ0FBWTs7OztJQUF0QjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUc7WUFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQ3JCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtTQUNwQixDQUFDO0tBQ0g7Ozs7OztJQUVTLDBEQUF1Qjs7Ozs7SUFBakMsVUFBa0MsT0FBd0IsRUFBRSxNQUFzQjtRQUNoRixPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDakM7O2dCQXRCRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtvQkFDN0IsUUFBUSxFQUFFLEVBQUU7b0JBQ1osSUFBSSxFQUFFO3dCQUNKLEtBQUssRUFBRSxzQkFBc0I7cUJBQzlCO2lCQUNGOzttQ0FwQkQ7RUFxQjhDLHlCQUF5QjtTQUExRCx3QkFBd0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21wb25lbnQsXG4gIEhvc3RCaW5kaW5nXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgY291bnRlcixcbiAgQ291bnRlcixcbiAgQ291bnRlclBhcmFtcyxcbn0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcbmltcG9ydCB7IEZhTGF5ZXJzVGV4dEJhc2VDb21wb25lbnQgfSBmcm9tICcuL2xheWVycy10ZXh0LWJhc2UuY29tcG9uZW50JztcblxuLyoqXG4gKiBGb250YXdlc29tZSBsYXllcnMgY291bnRlci5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmEtbGF5ZXJzLWNvdW50ZXInLFxuICB0ZW1wbGF0ZTogJycsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25nLWZhLWxheWVycy1jb3VudGVyJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIEZhTGF5ZXJzQ291bnRlckNvbXBvbmVudCBleHRlbmRzIEZhTGF5ZXJzVGV4dEJhc2VDb21wb25lbnQge1xuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBwYXJhbXMgYnkgY29tcG9uZW50IHByb3BzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHVwZGF0ZVBhcmFtcygpIHtcbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgY2xhc3NlczogdGhpcy5jbGFzc2VzLFxuICAgICAgc3R5bGVzOiB0aGlzLnN0eWxlcyxcbiAgICB9O1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlbmRlckZvbnRhd2Vzb21lT2JqZWN0KGNvbnRlbnQ6IHN0cmluZyB8IG51bWJlciwgcGFyYW1zPzogQ291bnRlclBhcmFtcykge1xuICAgIHJldHVybiBjb3VudGVyKGNvbnRlbnQsIHBhcmFtcyk7XG4gIH1cbn1cblxuIl19