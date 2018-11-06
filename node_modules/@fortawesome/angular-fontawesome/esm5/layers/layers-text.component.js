/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Input, Component } from '@angular/core';
import { text, parse } from '@fortawesome/fontawesome-svg-core';
import { FaLayersTextBaseComponent } from './layers-text-base.component';
import { objectWithKey } from '../shared/utils/object-with-keys.util';
import { faClassList } from '../shared/utils/classlist.util';
/**
 * Fontawesome layers text.
 */
var FaLayersTextComponent = /** @class */ (function (_super) {
    tslib_1.__extends(FaLayersTextComponent, _super);
    function FaLayersTextComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updating params by component props.
     */
    /**
     * Updating params by component props.
     * @return {?}
     */
    FaLayersTextComponent.prototype.updateParams = /**
     * Updating params by component props.
     * @return {?}
     */
    function () {
        /** @type {?} */
        var classOpts = {
            flip: this.flip,
            spin: this.spin,
            pulse: this.pulse,
            border: this.border,
            inverse: this.inverse,
            listItem: this.listItem,
            size: this.size || null,
            pull: this.pull || null,
            rotate: this.rotate || null,
            fixedWidth: this.fixedWidth
        };
        /** @type {?} */
        var classes = objectWithKey('classes', tslib_1.__spread(faClassList(classOpts), this.classes));
        /** @type {?} */
        var parsedTransform = typeof this.transform === 'string' ? parse.transform(this.transform) : this.transform;
        /** @type {?} */
        var transform = objectWithKey('transform', parsedTransform);
        this.params = tslib_1.__assign({}, transform, classes, { title: this.title, styles: this.styles });
    };
    /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    FaLayersTextComponent.prototype.renderFontawesomeObject = /**
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    function (content, params) {
        return text(content, params);
    };
    FaLayersTextComponent.decorators = [
        { type: Component, args: [{
                    selector: 'fa-layers-text',
                    template: '',
                    host: {
                        class: 'ng-fa-layers-text'
                    }
                }] }
    ];
    FaLayersTextComponent.propDecorators = {
        spin: [{ type: Input }],
        pulse: [{ type: Input }],
        flip: [{ type: Input }],
        size: [{ type: Input }],
        pull: [{ type: Input }],
        border: [{ type: Input }],
        inverse: [{ type: Input }],
        listItem: [{ type: Input }],
        rotate: [{ type: Input }],
        fixedWidth: [{ type: Input }],
        transform: [{ type: Input }]
    };
    return FaLayersTextComponent;
}(FaLayersTextBaseComponent));
export { FaLayersTextComponent };
if (false) {
    /** @type {?} */
    FaLayersTextComponent.prototype.spin;
    /** @type {?} */
    FaLayersTextComponent.prototype.pulse;
    /** @type {?} */
    FaLayersTextComponent.prototype.flip;
    /** @type {?} */
    FaLayersTextComponent.prototype.size;
    /** @type {?} */
    FaLayersTextComponent.prototype.pull;
    /** @type {?} */
    FaLayersTextComponent.prototype.border;
    /** @type {?} */
    FaLayersTextComponent.prototype.inverse;
    /** @type {?} */
    FaLayersTextComponent.prototype.listItem;
    /** @type {?} */
    FaLayersTextComponent.prototype.rotate;
    /** @type {?} */
    FaLayersTextComponent.prototype.fixedWidth;
    /** @type {?} */
    FaLayersTextComponent.prototype.transform;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLXRleHQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvIiwic291cmNlcyI6WyJsYXllcnMvbGF5ZXJzLXRleHQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNMLEtBQUssRUFDTCxTQUFTLEVBRVYsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLElBQUksRUFDSixLQUFLLEVBUU4sTUFBTSxtQ0FBbUMsQ0FBQztBQUMzQyxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUd6RSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDdEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDOzs7OztJQVlsQixpREFBeUI7Ozs7SUFjbEU7O09BRUc7Ozs7O0lBQ08sNENBQVk7Ozs7SUFBdEI7O1FBQ0UsSUFBTSxTQUFTLEdBQVk7WUFDekIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO1lBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87WUFDckIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUk7WUFDdkIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSTtZQUN2QixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJO1lBQzNCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtTQUM1QixDQUFDOztRQUVGLElBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxTQUFTLG1CQUFNLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBSyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O1FBQ3ZGLElBQU0sZUFBZSxHQUFHLE9BQU8sSUFBSSxDQUFDLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDOztRQUM5RyxJQUFNLFNBQVMsR0FBRyxhQUFhLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBRTlELElBQUksQ0FBQyxNQUFNLHdCQUNOLFNBQVMsRUFDVCxPQUFPLElBQ1YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxHQUNwQixDQUFDO0tBQ0g7Ozs7OztJQUVTLHVEQUF1Qjs7Ozs7SUFBakMsVUFBa0MsT0FBZSxFQUFFLE1BQW1CO1FBQ3BFLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztLQUM5Qjs7Z0JBcERGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO29CQUMxQixRQUFRLEVBQUUsRUFBRTtvQkFDWixJQUFJLEVBQUU7d0JBQ0osS0FBSyxFQUFFLG1CQUFtQjtxQkFDM0I7aUJBQ0Y7Ozt1QkFHRSxLQUFLO3dCQUNMLEtBQUs7dUJBQ0wsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7eUJBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7O2dDQTVDUjtFQWdDMkMseUJBQXlCO1NBQXZELHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIElucHV0LFxuICBDb21wb25lbnQsXG4gIEhvc3RCaW5kaW5nXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgdGV4dCxcbiAgcGFyc2UsXG4gIFRleHQsXG4gIFRleHRQYXJhbXMsXG4gIFNpemVQcm9wLFxuICBGbGlwUHJvcCxcbiAgUHVsbFByb3AsXG4gIFRyYW5zZm9ybSxcbiAgUm90YXRlUHJvcFxufSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgRmFMYXllcnNUZXh0QmFzZUNvbXBvbmVudCB9IGZyb20gJy4vbGF5ZXJzLXRleHQtYmFzZS5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBGYVByb3BzIH0gZnJvbSAnLi4vc2hhcmVkL21vZGVscy9wcm9wcy5tb2RlbCc7XG5pbXBvcnQgeyBvYmplY3RXaXRoS2V5IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL29iamVjdC13aXRoLWtleXMudXRpbCc7XG5pbXBvcnQgeyBmYUNsYXNzTGlzdCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbCc7XG5cbi8qKlxuICogRm9udGF3ZXNvbWUgbGF5ZXJzIHRleHQuXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhLWxheWVycy10ZXh0JyxcbiAgdGVtcGxhdGU6ICcnLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICduZy1mYS1sYXllcnMtdGV4dCdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBGYUxheWVyc1RleHRDb21wb25lbnQgZXh0ZW5kcyBGYUxheWVyc1RleHRCYXNlQ29tcG9uZW50IHtcblxuICBASW5wdXQoKSBzcGluPzogYm9vbGVhbjtcbiAgQElucHV0KCkgcHVsc2U/OiBib29sZWFuO1xuICBASW5wdXQoKSBmbGlwPzogRmxpcFByb3A7XG4gIEBJbnB1dCgpIHNpemU/OiBTaXplUHJvcDtcbiAgQElucHV0KCkgcHVsbD86IFB1bGxQcm9wO1xuICBASW5wdXQoKSBib3JkZXI/OiBib29sZWFuO1xuICBASW5wdXQoKSBpbnZlcnNlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgbGlzdEl0ZW0/OiBib29sZWFuO1xuICBASW5wdXQoKSByb3RhdGU/OiBSb3RhdGVQcm9wO1xuICBASW5wdXQoKSBmaXhlZFdpZHRoPzogYm9vbGVhbjtcbiAgQElucHV0KCkgdHJhbnNmb3JtPzogc3RyaW5nIHwgVHJhbnNmb3JtO1xuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBwYXJhbXMgYnkgY29tcG9uZW50IHByb3BzLlxuICAgKi9cbiAgcHJvdGVjdGVkIHVwZGF0ZVBhcmFtcygpIHtcbiAgICBjb25zdCBjbGFzc09wdHM6IEZhUHJvcHMgPSB7XG4gICAgICBmbGlwOiB0aGlzLmZsaXAsXG4gICAgICBzcGluOiB0aGlzLnNwaW4sXG4gICAgICBwdWxzZTogdGhpcy5wdWxzZSxcbiAgICAgIGJvcmRlcjogdGhpcy5ib3JkZXIsXG4gICAgICBpbnZlcnNlOiB0aGlzLmludmVyc2UsXG4gICAgICBsaXN0SXRlbTogdGhpcy5saXN0SXRlbSxcbiAgICAgIHNpemU6IHRoaXMuc2l6ZSB8fCBudWxsLFxuICAgICAgcHVsbDogdGhpcy5wdWxsIHx8IG51bGwsXG4gICAgICByb3RhdGU6IHRoaXMucm90YXRlIHx8IG51bGwsXG4gICAgICBmaXhlZFdpZHRoOiB0aGlzLmZpeGVkV2lkdGhcbiAgICB9O1xuXG4gICAgY29uc3QgY2xhc3NlcyA9IG9iamVjdFdpdGhLZXkoJ2NsYXNzZXMnLCBbLi4uZmFDbGFzc0xpc3QoY2xhc3NPcHRzKSwgLi4udGhpcy5jbGFzc2VzXSk7XG4gICAgY29uc3QgcGFyc2VkVHJhbnNmb3JtID0gdHlwZW9mIHRoaXMudHJhbnNmb3JtID09PSAnc3RyaW5nJyA/IHBhcnNlLnRyYW5zZm9ybSh0aGlzLnRyYW5zZm9ybSkgOiB0aGlzLnRyYW5zZm9ybTtcbiAgICBjb25zdCB0cmFuc2Zvcm0gPSBvYmplY3RXaXRoS2V5KCd0cmFuc2Zvcm0nLCBwYXJzZWRUcmFuc2Zvcm0pO1xuXG4gICAgdGhpcy5wYXJhbXMgPSB7XG4gICAgICAuLi50cmFuc2Zvcm0sXG4gICAgICAuLi5jbGFzc2VzLFxuICAgICAgdGl0bGU6IHRoaXMudGl0bGUsXG4gICAgICBzdHlsZXM6IHRoaXMuc3R5bGVzXG4gICAgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZW5kZXJGb250YXdlc29tZU9iamVjdChjb250ZW50OiBzdHJpbmcsIHBhcmFtcz86IFRleHRQYXJhbXMpIHtcbiAgICByZXR1cm4gdGV4dChjb250ZW50LCBwYXJhbXMpO1xuICB9XG59XG5cbiJdfQ==