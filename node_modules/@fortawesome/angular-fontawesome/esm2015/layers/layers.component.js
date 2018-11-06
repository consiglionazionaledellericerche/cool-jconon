/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, HostBinding } from '@angular/core';
import { faLayerClassList } from '../shared/utils/classlist.util';
/**
 * Fontawesome layers.
 */
export class FaLayersComponent {
    constructor() {
        this.hostClass = 'fa-layers';
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateClasses();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes) {
            this.updateClasses();
        }
    }
    /**
     * @return {?}
     */
    updateClasses() {
        /** @type {?} */
        const classOpts = {
            size: this.size || null,
            fixedWidth: this.fixedWidth,
        };
        this.hostClass = `fa-layers ${faLayerClassList(classOpts).join(' ')}`;
    }
}
FaLayersComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-layers',
                template: `<ng-content select="fa-icon, fa-layers-text, fa-layers-counter"></ng-content>`
            }] }
];
FaLayersComponent.propDecorators = {
    size: [{ type: Input }],
    fixedWidth: [{ type: Input }],
    hostClass: [{ type: HostBinding, args: ['class',] }]
};
if (false) {
    /** @type {?} */
    FaLayersComponent.prototype.size;
    /** @type {?} */
    FaLayersComponent.prototype.fixedWidth;
    /** @type {?} */
    FaLayersComponent.prototype.hostClass;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bmb3J0YXdlc29tZS9hbmd1bGFyLWZvbnRhd2Vzb21lLyIsInNvdXJjZXMiOlsibGF5ZXJzL2xheWVycy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFvQyxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFaEcsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7Ozs7QUFVbEUsTUFBTTs7eUJBS1EsV0FBVzs7Ozs7SUFFdkIsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUN0Qjs7Ozs7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEI7S0FDRjs7OztJQUVELGFBQWE7O1FBQ1gsTUFBTSxTQUFTLEdBQVk7WUFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSTtZQUN2QixVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVU7U0FDNUIsQ0FBQztRQUNGLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztLQUN2RTs7O1lBM0JGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsV0FBVztnQkFDckIsUUFBUSxFQUFFLCtFQUErRTthQUMxRjs7O21CQUVFLEtBQUs7eUJBQ0wsS0FBSzt3QkFFTCxXQUFXLFNBQUMsT0FBTyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFNpbXBsZUNoYW5nZXMsIE9uQ2hhbmdlcywgT25Jbml0LCBIb3N0QmluZGluZyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU2l6ZVByb3AgfSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgZmFMYXllckNsYXNzTGlzdCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbCc7XG5pbXBvcnQgeyBGYVByb3BzIH0gZnJvbSAnLi4vc2hhcmVkL21vZGVscy9wcm9wcy5tb2RlbCc7XG5cbi8qKlxuICogRm9udGF3ZXNvbWUgbGF5ZXJzLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYS1sYXllcnMnLFxuICB0ZW1wbGF0ZTogYDxuZy1jb250ZW50IHNlbGVjdD1cImZhLWljb24sIGZhLWxheWVycy10ZXh0LCBmYS1sYXllcnMtY291bnRlclwiPjwvbmctY29udGVudD5gLFxufSlcbmV4cG9ydCBjbGFzcyBGYUxheWVyc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgc2l6ZT86IFNpemVQcm9wO1xuICBASW5wdXQoKSBmaXhlZFdpZHRoPzogYm9vbGVhbjtcblxuICBASG9zdEJpbmRpbmcoJ2NsYXNzJylcbiAgaG9zdENsYXNzID0gJ2ZhLWxheWVycyc7XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVDbGFzc2VzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlQ2xhc3NlcygpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUNsYXNzZXMoKSB7XG4gICAgY29uc3QgY2xhc3NPcHRzOiBGYVByb3BzID0ge1xuICAgICAgc2l6ZTogdGhpcy5zaXplIHx8IG51bGwsXG4gICAgICBmaXhlZFdpZHRoOiB0aGlzLmZpeGVkV2lkdGgsXG4gICAgfTtcbiAgICB0aGlzLmhvc3RDbGFzcyA9IGBmYS1sYXllcnMgJHtmYUxheWVyQ2xhc3NMaXN0KGNsYXNzT3B0cykuam9pbignICcpfWA7XG4gIH1cblxufVxuIl19