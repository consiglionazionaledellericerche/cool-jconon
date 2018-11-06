/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * \@ngModule CommonModule
 *
 * \@usageNotes
 * ```
 * <ng-container *ngTemplateOutlet="templateRefExp; context: contextExp"></ng-container>
 * ```
 *
 * \@description
 *
 * Inserts an embedded view from a prepared `TemplateRef`.
 *
 * You can attach a context object to the `EmbeddedViewRef` by setting `[ngTemplateOutletContext]`.
 * `[ngTemplateOutletContext]` should be an object, the object's keys will be available for binding
 * by the local template `let` declarations.
 *
 * Note: using the key `$implicit` in the context object will set its value as default.
 *
 * ## Example
 *
 * {\@example common/ngTemplateOutlet/ts/module.ts region='NgTemplateOutlet'}
 *
 *
 */
export class NgTemplateOutlet {
    /**
     * @param {?} _viewContainerRef
     */
    constructor(_viewContainerRef) {
        this._viewContainerRef = _viewContainerRef;
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const recreateView = this._shouldRecreateView(changes);
        if (recreateView) {
            if (this._viewRef) {
                this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
            }
            if (this.ngTemplateOutlet) {
                this._viewRef = this._viewContainerRef.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext);
            }
        }
        else {
            if (this._viewRef && this.ngTemplateOutletContext) {
                this._updateExistingContext(this.ngTemplateOutletContext);
            }
        }
    }
    /**
     * We need to re-create existing embedded view if:
     * - templateRef has changed
     * - context has changes
     *
     * We mark context object as changed when the corresponding object
     * shape changes (new properties are added or existing properties are removed).
     * In other words we consider context with the same properties as "the same" even
     * if object reference changes (see https://github.com/angular/angular/issues/13407).
     * @param {?} changes
     * @return {?}
     */
    _shouldRecreateView(changes) {
        /** @type {?} */
        const ctxChange = changes['ngTemplateOutletContext'];
        return !!changes['ngTemplateOutlet'] || (ctxChange && this._hasContextShapeChanged(ctxChange));
    }
    /**
     * @param {?} ctxChange
     * @return {?}
     */
    _hasContextShapeChanged(ctxChange) {
        /** @type {?} */
        const prevCtxKeys = Object.keys(ctxChange.previousValue || {});
        /** @type {?} */
        const currCtxKeys = Object.keys(ctxChange.currentValue || {});
        if (prevCtxKeys.length === currCtxKeys.length) {
            for (let propName of currCtxKeys) {
                if (prevCtxKeys.indexOf(propName) === -1) {
                    return true;
                }
            }
            return false;
        }
        else {
            return true;
        }
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    _updateExistingContext(ctx) {
        for (let propName of Object.keys(ctx)) {
            (/** @type {?} */ (this._viewRef.context))[propName] = (/** @type {?} */ (this.ngTemplateOutletContext))[propName];
        }
    }
}
NgTemplateOutlet.decorators = [
    { type: Directive, args: [{ selector: '[ngTemplateOutlet]' },] }
];
/** @nocollapse */
NgTemplateOutlet.ctorParameters = () => [
    { type: ViewContainerRef }
];
NgTemplateOutlet.propDecorators = {
    ngTemplateOutletContext: [{ type: Input }],
    ngTemplateOutlet: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NgTemplateOutlet.prototype._viewRef;
    /** @type {?} */
    NgTemplateOutlet.prototype.ngTemplateOutletContext;
    /** @type {?} */
    NgTemplateOutlet.prototype.ngTemplateOutlet;
    /** @type {?} */
    NgTemplateOutlet.prototype._viewContainerRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfdGVtcGxhdGVfb3V0bGV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9kaXJlY3RpdmVzL25nX3RlbXBsYXRlX291dGxldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQVFBLE9BQU8sRUFBQyxTQUFTLEVBQW1CLEtBQUssRUFBMEMsV0FBVyxFQUFFLGdCQUFnQixFQUFDLE1BQU0sZUFBZSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJ2SSxNQUFNOzs7O0lBVUosWUFBb0IsaUJBQW1DO1FBQW5DLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBa0I7S0FBSTs7Ozs7SUFFM0QsV0FBVyxDQUFDLE9BQXNCOztRQUNoQyxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdkQsSUFBSSxZQUFZLEVBQUU7WUFDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNqQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7YUFDOUU7WUFFRCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQ3JELElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsdUJBQXVCLENBQUMsQ0FBQzthQUMxRDtTQUNGO2FBQU07WUFDTCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO2dCQUNqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDM0Q7U0FDRjtLQUNGOzs7Ozs7Ozs7Ozs7O0lBWU8sbUJBQW1CLENBQUMsT0FBc0I7O1FBQ2hELE1BQU0sU0FBUyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3JELE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDOzs7Ozs7SUFHekYsdUJBQXVCLENBQUMsU0FBdUI7O1FBQ3JELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsSUFBSSxFQUFFLENBQUMsQ0FBQzs7UUFDL0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTlELElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxXQUFXLENBQUMsTUFBTSxFQUFFO1lBQzdDLEtBQUssSUFBSSxRQUFRLElBQUksV0FBVyxFQUFFO2dCQUNoQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ3hDLE9BQU8sSUFBSSxDQUFDO2lCQUNiO2FBQ0Y7WUFDRCxPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQztTQUNiOzs7Ozs7SUFHSyxzQkFBc0IsQ0FBQyxHQUFXO1FBQ3hDLEtBQUssSUFBSSxRQUFRLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyQyxtQkFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLG1CQUFNLElBQUksQ0FBQyx1QkFBdUIsRUFBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3hGOzs7O1lBbEVKLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxvQkFBb0IsRUFBQzs7OztZQTFCcUQsZ0JBQWdCOzs7c0NBZ0M3RyxLQUFLOytCQUdMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7RGlyZWN0aXZlLCBFbWJlZGRlZFZpZXdSZWYsIElucHV0LCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZSwgU2ltcGxlQ2hhbmdlcywgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWZ9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogYGBgXG4gKiA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGVSZWZFeHA7IGNvbnRleHQ6IGNvbnRleHRFeHBcIj48L25nLWNvbnRhaW5lcj5cbiAqIGBgYFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIEluc2VydHMgYW4gZW1iZWRkZWQgdmlldyBmcm9tIGEgcHJlcGFyZWQgYFRlbXBsYXRlUmVmYC5cbiAqXG4gKiBZb3UgY2FuIGF0dGFjaCBhIGNvbnRleHQgb2JqZWN0IHRvIHRoZSBgRW1iZWRkZWRWaWV3UmVmYCBieSBzZXR0aW5nIGBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdYC5cbiAqIGBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdYCBzaG91bGQgYmUgYW4gb2JqZWN0LCB0aGUgb2JqZWN0J3Mga2V5cyB3aWxsIGJlIGF2YWlsYWJsZSBmb3IgYmluZGluZ1xuICogYnkgdGhlIGxvY2FsIHRlbXBsYXRlIGBsZXRgIGRlY2xhcmF0aW9ucy5cbiAqXG4gKiBOb3RlOiB1c2luZyB0aGUga2V5IGAkaW1wbGljaXRgIGluIHRoZSBjb250ZXh0IG9iamVjdCB3aWxsIHNldCBpdHMgdmFsdWUgYXMgZGVmYXVsdC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9uZ1RlbXBsYXRlT3V0bGV0L3RzL21vZHVsZS50cyByZWdpb249J05nVGVtcGxhdGVPdXRsZXQnfVxuICpcbiAqXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnW25nVGVtcGxhdGVPdXRsZXRdJ30pXG5leHBvcnQgY2xhc3MgTmdUZW1wbGF0ZU91dGxldCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBwcml2YXRlIF92aWV3UmVmICE6IEVtYmVkZGVkVmlld1JlZjxhbnk+O1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBwdWJsaWMgbmdUZW1wbGF0ZU91dGxldENvbnRleHQgITogT2JqZWN0O1xuXG4gIC8vIFRPRE8oaXNzdWUvMjQ1NzEpOiByZW1vdmUgJyEnLlxuICBASW5wdXQoKSBwdWJsaWMgbmdUZW1wbGF0ZU91dGxldCAhOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHt9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHJlY3JlYXRlVmlldyA9IHRoaXMuX3Nob3VsZFJlY3JlYXRlVmlldyhjaGFuZ2VzKTtcblxuICAgIGlmIChyZWNyZWF0ZVZpZXcpIHtcbiAgICAgIGlmICh0aGlzLl92aWV3UmVmKSB7XG4gICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXJSZWYucmVtb3ZlKHRoaXMuX3ZpZXdDb250YWluZXJSZWYuaW5kZXhPZih0aGlzLl92aWV3UmVmKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm5nVGVtcGxhdGVPdXRsZXQpIHtcbiAgICAgICAgdGhpcy5fdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KFxuICAgICAgICAgICAgdGhpcy5uZ1RlbXBsYXRlT3V0bGV0LCB0aGlzLm5nVGVtcGxhdGVPdXRsZXRDb250ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuX3ZpZXdSZWYgJiYgdGhpcy5uZ1RlbXBsYXRlT3V0bGV0Q29udGV4dCkge1xuICAgICAgICB0aGlzLl91cGRhdGVFeGlzdGluZ0NvbnRleHQodGhpcy5uZ1RlbXBsYXRlT3V0bGV0Q29udGV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdlIG5lZWQgdG8gcmUtY3JlYXRlIGV4aXN0aW5nIGVtYmVkZGVkIHZpZXcgaWY6XG4gICAqIC0gdGVtcGxhdGVSZWYgaGFzIGNoYW5nZWRcbiAgICogLSBjb250ZXh0IGhhcyBjaGFuZ2VzXG4gICAqXG4gICAqIFdlIG1hcmsgY29udGV4dCBvYmplY3QgYXMgY2hhbmdlZCB3aGVuIHRoZSBjb3JyZXNwb25kaW5nIG9iamVjdFxuICAgKiBzaGFwZSBjaGFuZ2VzIChuZXcgcHJvcGVydGllcyBhcmUgYWRkZWQgb3IgZXhpc3RpbmcgcHJvcGVydGllcyBhcmUgcmVtb3ZlZCkuXG4gICAqIEluIG90aGVyIHdvcmRzIHdlIGNvbnNpZGVyIGNvbnRleHQgd2l0aCB0aGUgc2FtZSBwcm9wZXJ0aWVzIGFzIFwidGhlIHNhbWVcIiBldmVuXG4gICAqIGlmIG9iamVjdCByZWZlcmVuY2UgY2hhbmdlcyAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzEzNDA3KS5cbiAgICovXG4gIHByaXZhdGUgX3Nob3VsZFJlY3JlYXRlVmlldyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogYm9vbGVhbiB7XG4gICAgY29uc3QgY3R4Q2hhbmdlID0gY2hhbmdlc1snbmdUZW1wbGF0ZU91dGxldENvbnRleHQnXTtcbiAgICByZXR1cm4gISFjaGFuZ2VzWyduZ1RlbXBsYXRlT3V0bGV0J10gfHwgKGN0eENoYW5nZSAmJiB0aGlzLl9oYXNDb250ZXh0U2hhcGVDaGFuZ2VkKGN0eENoYW5nZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfaGFzQ29udGV4dFNoYXBlQ2hhbmdlZChjdHhDaGFuZ2U6IFNpbXBsZUNoYW5nZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHByZXZDdHhLZXlzID0gT2JqZWN0LmtleXMoY3R4Q2hhbmdlLnByZXZpb3VzVmFsdWUgfHwge30pO1xuICAgIGNvbnN0IGN1cnJDdHhLZXlzID0gT2JqZWN0LmtleXMoY3R4Q2hhbmdlLmN1cnJlbnRWYWx1ZSB8fCB7fSk7XG5cbiAgICBpZiAocHJldkN0eEtleXMubGVuZ3RoID09PSBjdXJyQ3R4S2V5cy5sZW5ndGgpIHtcbiAgICAgIGZvciAobGV0IHByb3BOYW1lIG9mIGN1cnJDdHhLZXlzKSB7XG4gICAgICAgIGlmIChwcmV2Q3R4S2V5cy5pbmRleE9mKHByb3BOYW1lKSA9PT0gLTEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVFeGlzdGluZ0NvbnRleHQoY3R4OiBPYmplY3QpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBwcm9wTmFtZSBvZiBPYmplY3Qua2V5cyhjdHgpKSB7XG4gICAgICAoPGFueT50aGlzLl92aWV3UmVmLmNvbnRleHQpW3Byb3BOYW1lXSA9ICg8YW55PnRoaXMubmdUZW1wbGF0ZU91dGxldENvbnRleHQpW3Byb3BOYW1lXTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==