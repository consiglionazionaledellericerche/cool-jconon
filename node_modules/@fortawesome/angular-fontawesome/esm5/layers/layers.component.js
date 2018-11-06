/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding } from '@angular/core';
import { faLayerClassList } from '../shared/utils/classlist.util';
/**
 * Fontawesome layers.
 */
var FaLayersComponent = /** @class */ (function () {
    function FaLayersComponent() {
        this.hostClass = 'fa-layers';
    }
    /**
     * @return {?}
     */
    FaLayersComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.updateClasses();
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    FaLayersComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes) {
            this.updateClasses();
        }
    };
    /**
     * @return {?}
     */
    FaLayersComponent.prototype.updateClasses = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var classOpts = {
            size: this.size || null,
            fixedWidth: this.fixedWidth,
        };
        this.hostClass = "fa-layers " + faLayerClassList(classOpts).join(' ');
    };
    FaLayersComponent.decorators = [
        { type: Component, args: [{
                    selector: 'fa-layers',
                    template: "<ng-content select=\"fa-icon, fa-layers-text, fa-layers-counter\"></ng-content>"
                }] }
    ];
    FaLayersComponent.propDecorators = {
        size: [{ type: Input }],
        fixedWidth: [{ type: Input }],
        hostClass: [{ type: HostBinding, args: ['class',] }]
    };
    return FaLayersComponent;
}());
export { FaLayersComponent };
if (false) {
    /** @type {?} */
    FaLayersComponent.prototype.size;
    /** @type {?} */
    FaLayersComponent.prototype.fixedWidth;
    /** @type {?} */
    FaLayersComponent.prototype.hostClass;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lLyIsInNvdXJjZXMiOlsibGF5ZXJzL2xheWVycy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFvQyxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7Ozs7Ozt5QkFlcEQsV0FBVzs7Ozs7SUFFdkIsb0NBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0tBQ3RCOzs7OztJQUVELHVDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtLQUNGOzs7O0lBRUQseUNBQWE7OztJQUFiOztRQUNFLElBQU0sU0FBUyxHQUFZO1lBQ3pCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUk7WUFDdkIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzVCLENBQUM7UUFDRixJQUFJLENBQUMsU0FBUyxHQUFHLGVBQWEsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRyxDQUFDO0tBQ3ZFOztnQkEzQkYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxXQUFXO29CQUNyQixRQUFRLEVBQUUsaUZBQStFO2lCQUMxRjs7O3VCQUVFLEtBQUs7NkJBQ0wsS0FBSzs0QkFFTCxXQUFXLFNBQUMsT0FBTzs7NEJBaEJ0Qjs7U0FZYSxpQkFBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBTaW1wbGVDaGFuZ2VzLCBPbkNoYW5nZXMsIE9uSW5pdCwgSG9zdEJpbmRpbmcgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNpemVQcm9wIH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcbmltcG9ydCB7IGZhTGF5ZXJDbGFzc0xpc3QgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMvY2xhc3NsaXN0LnV0aWwnO1xuaW1wb3J0IHsgRmFQcm9wcyB9IGZyb20gJy4uL3NoYXJlZC9tb2RlbHMvcHJvcHMubW9kZWwnO1xuXG4vKipcbiAqIEZvbnRhd2Vzb21lIGxheWVycy5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnZmEtbGF5ZXJzJyxcbiAgdGVtcGxhdGU6IGA8bmctY29udGVudCBzZWxlY3Q9XCJmYS1pY29uLCBmYS1sYXllcnMtdGV4dCwgZmEtbGF5ZXJzLWNvdW50ZXJcIj48L25nLWNvbnRlbnQ+YCxcbn0pXG5leHBvcnQgY2xhc3MgRmFMYXllcnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHNpemU/OiBTaXplUHJvcDtcbiAgQElucHV0KCkgZml4ZWRXaWR0aD86IGJvb2xlYW47XG5cbiAgQEhvc3RCaW5kaW5nKCdjbGFzcycpXG4gIGhvc3RDbGFzcyA9ICdmYS1sYXllcnMnO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMudXBkYXRlQ2xhc3NlcygpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNsYXNzZXMoKTtcbiAgICB9XG4gIH1cblxuICB1cGRhdGVDbGFzc2VzKCkge1xuICAgIGNvbnN0IGNsYXNzT3B0czogRmFQcm9wcyA9IHtcbiAgICAgIHNpemU6IHRoaXMuc2l6ZSB8fCBudWxsLFxuICAgICAgZml4ZWRXaWR0aDogdGhpcy5maXhlZFdpZHRoLFxuICAgIH07XG4gICAgdGhpcy5ob3N0Q2xhc3MgPSBgZmEtbGF5ZXJzICR7ZmFMYXllckNsYXNzTGlzdChjbGFzc09wdHMpLmpvaW4oJyAnKX1gO1xuICB9XG5cbn1cbiJdfQ==