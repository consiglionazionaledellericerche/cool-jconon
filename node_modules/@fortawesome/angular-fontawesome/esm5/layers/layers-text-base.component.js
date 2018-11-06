/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Input, Inject, Injectable, Optional, forwardRef, HostBinding } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FaLayersComponent } from './layers.component';
import { faWarnIfParentNotExist } from '../shared/errors/warn-if-parent-not-exist';
/**
 * @abstract
 */
var FaLayersTextBaseComponent = /** @class */ (function () {
    function FaLayersTextBaseComponent(parent, sanitizer) {
        this.parent = parent;
        this.sanitizer = sanitizer;
        this.classes = [];
        faWarnIfParentNotExist(this.parent, 'FaLayersComponent', this.constructor.name);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    FaLayersTextBaseComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes) {
            this.updateParams();
            this.updateContent();
        }
    };
    /**
     * Updating content by params and content.
     * @return {?}
     */
    FaLayersTextBaseComponent.prototype.updateContent = /**
     * Updating content by params and content.
     * @return {?}
     */
    function () {
        this.renderedHTML = this.sanitizer.bypassSecurityTrustHtml(this.renderFontawesomeObject(this.content || '', this.params).html.join('\n'));
    };
    FaLayersTextBaseComponent.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    FaLayersTextBaseComponent.ctorParameters = function () { return [
        { type: FaLayersComponent, decorators: [{ type: Inject, args: [forwardRef(function () { return FaLayersComponent; }),] }, { type: Optional }] },
        { type: DomSanitizer }
    ]; };
    FaLayersTextBaseComponent.propDecorators = {
        renderedHTML: [{ type: HostBinding, args: ['innerHTML',] }],
        content: [{ type: Input }],
        title: [{ type: Input }],
        styles: [{ type: Input }],
        classes: [{ type: Input }]
    };
    return FaLayersTextBaseComponent;
}());
export { FaLayersTextBaseComponent };
if (false) {
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.renderedHTML;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.params;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.content;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.title;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.styles;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.classes;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.parent;
    /** @type {?} */
    FaLayersTextBaseComponent.prototype.sanitizer;
    /**
     * Updating params by component props.
     * @abstract
     * @return {?}
     */
    FaLayersTextBaseComponent.prototype.updateParams = function () { };
    /**
     * Render the FontawesomeObject using the content and params.
     * @abstract
     * @param {?} content
     * @param {?=} params
     * @return {?}
     */
    FaLayersTextBaseComponent.prototype.renderFontawesomeObject = function (content, params) { };
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLXRleHQtYmFzZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS8iLCJzb3VyY2VzIjpbImxheWVycy9sYXllcnMtdGV4dC1iYXNlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLEtBQUssRUFDTCxNQUFNLEVBQ04sVUFBVSxFQUNWLFFBQVEsRUFFUixVQUFVLEVBQ1YsV0FBVyxFQUVaLE1BQU0sZUFBZSxDQUFDO0FBTXZCLE9BQU8sRUFBRSxZQUFZLEVBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUVuRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7Ozs7SUFRakYsbUNBQTZFLE1BQXlCLEVBQzVGO1FBRG1FLFdBQU0sR0FBTixNQUFNLENBQW1CO1FBQzVGLGNBQVMsR0FBVCxTQUFTO3VCQVVxQixFQUFFO1FBUnhDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqRjs7Ozs7SUFTRCwrQ0FBVzs7OztJQUFYLFVBQVksT0FBc0I7UUFDaEMsSUFBSSxPQUFPLEVBQUU7WUFDWCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RCO0tBQ0Y7Ozs7O0lBZU8saURBQWE7Ozs7O1FBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsQ0FDeEQsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUM5RSxDQUFDOzs7Z0JBMUNMLFVBQVU7Ozs7Z0JBSEYsaUJBQWlCLHVCQVNYLE1BQU0sU0FBQyxVQUFVLENBQUMsY0FBTSxPQUFBLGlCQUFpQixFQUFqQixDQUFpQixDQUFDLGNBQUcsUUFBUTtnQkFYM0QsWUFBWTs7OytCQVFsQixXQUFXLFNBQUMsV0FBVzswQkFXdkIsS0FBSzt3QkFDTCxLQUFLO3lCQUNMLEtBQUs7MEJBQ0wsS0FBSzs7b0NBckNSOztTQXFCc0IseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5wdXQsXG4gIEluamVjdCxcbiAgSW5qZWN0YWJsZSxcbiAgT3B0aW9uYWwsXG4gIE9uQ2hhbmdlcyxcbiAgZm9yd2FyZFJlZixcbiAgSG9zdEJpbmRpbmcsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBTdHlsZXMsXG4gIEZvbnRhd2Vzb21lT2JqZWN0LFxuICBUZXh0UGFyYW1zXG59IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IEZhTGF5ZXJzQ29tcG9uZW50IH0gZnJvbSAnLi9sYXllcnMuY29tcG9uZW50JztcbmltcG9ydCB7IGZhV2FybklmUGFyZW50Tm90RXhpc3QgfSBmcm9tICcuLi9zaGFyZWQvZXJyb3JzL3dhcm4taWYtcGFyZW50LW5vdC1leGlzdCc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGYUxheWVyc1RleHRCYXNlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcblxuICBASG9zdEJpbmRpbmcoJ2lubmVySFRNTCcpXG4gIHB1YmxpYyByZW5kZXJlZEhUTUw6IFNhZmVIdG1sO1xuXG4gIGNvbnN0cnVjdG9yKEBJbmplY3QoZm9yd2FyZFJlZigoKSA9PiBGYUxheWVyc0NvbXBvbmVudCkpIEBPcHRpb25hbCgpIHByaXZhdGUgcGFyZW50OiBGYUxheWVyc0NvbXBvbmVudCxcbiAgICBwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyKSB7XG5cbiAgICBmYVdhcm5JZlBhcmVudE5vdEV4aXN0KHRoaXMucGFyZW50LCAnRmFMYXllcnNDb21wb25lbnQnLCB0aGlzLmNvbnN0cnVjdG9yLm5hbWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHBhcmFtczogVGV4dFBhcmFtcztcblxuICBASW5wdXQoKSBwcm90ZWN0ZWQgY29udGVudDogc3RyaW5nO1xuICBASW5wdXQoKSBwcm90ZWN0ZWQgdGl0bGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHByb3RlY3RlZCBzdHlsZXM/OiBTdHlsZXM7XG4gIEBJbnB1dCgpIHByb3RlY3RlZCBjbGFzc2VzPzogc3RyaW5nW10gPSBbXTtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1zKCk7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRlbnQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgcGFyYW1zIGJ5IGNvbXBvbmVudCBwcm9wcy5cbiAgICovXG4gIHByb3RlY3RlZCBhYnN0cmFjdCB1cGRhdGVQYXJhbXMoKTogdm9pZDtcblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBGb250YXdlc29tZU9iamVjdCB1c2luZyB0aGUgY29udGVudCBhbmQgcGFyYW1zLlxuICAgKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IHJlbmRlckZvbnRhd2Vzb21lT2JqZWN0KGNvbnRlbnQ6IHN0cmluZyB8IG51bWJlciwgcGFyYW1zPzogVGV4dFBhcmFtcyk6IEZvbnRhd2Vzb21lT2JqZWN0O1xuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBjb250ZW50IGJ5IHBhcmFtcyBhbmQgY29udGVudC5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlQ29udGVudCgpIHtcbiAgICB0aGlzLnJlbmRlcmVkSFRNTCA9IHRoaXMuc2FuaXRpemVyLmJ5cGFzc1NlY3VyaXR5VHJ1c3RIdG1sKFxuICAgICAgdGhpcy5yZW5kZXJGb250YXdlc29tZU9iamVjdCh0aGlzLmNvbnRlbnQgfHwgJycsIHRoaXMucGFyYW1zKS5odG1sLmpvaW4oJ1xcbicpXG4gICAgKTtcbiAgfVxufVxuXG4iXX0=