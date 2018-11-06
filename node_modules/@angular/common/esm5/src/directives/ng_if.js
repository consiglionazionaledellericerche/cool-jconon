/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive, Input, TemplateRef, ViewContainerRef, ɵstringify as stringify } from '@angular/core';
/**
 * Conditionally includes a template based on the value of an `expression`.
 *
 * `ngIf` evaluates the `expression` and then renders the `then` or `else` template in its place
 * when expression is truthy or falsy respectively. Typically the:
 *  - `then` template is the inline template of `ngIf` unless bound to a different value.
 *  - `else` template is blank unless it is bound.
 *
 * ## Most common usage
 *
 * The most common usage of the `ngIf` directive is to conditionally show the inline template as
 * seen in this example:
 * {@example common/ngIf/ts/module.ts region='NgIfSimple'}
 *
 * ## Showing an alternative template using `else`
 *
 * If it is necessary to display a template when the `expression` is falsy use the `else` template
 * binding as shown. Note that the `else` binding points to a `<ng-template>` labeled `#elseBlock`.
 * The template can be defined anywhere in the component view but is typically placed right after
 * `ngIf` for readability.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfElse'}
 *
 * ## Using non-inlined `then` template
 *
 * Usually the `then` template is the inlined template of the `ngIf`, but it can be changed using
 * a binding (just like `else`). Because `then` and `else` are bindings, the template references can
 * change at runtime as shown in this example.
 *
 * {@example common/ngIf/ts/module.ts region='NgIfThenElse'}
 *
 * ## Storing conditional result in a variable
 *
 * A common pattern is that we need to show a set of properties from the same object. If the
 * object is undefined, then we have to use the safe-traversal-operator `?.` to guard against
 * dereferencing a `null` value. This is especially the case when waiting on async data such as
 * when using the `async` pipe as shown in following example:
 *
 * ```
 * Hello {{ (userStream|async)?.last }}, {{ (userStream|async)?.first }}!
 * ```
 *
 * There are several inefficiencies in the above example:
 *  - We create multiple subscriptions on `userStream`. One for each `async` pipe, or two in the
 *    example above.
 *  - We cannot display an alternative screen while waiting for the data to arrive asynchronously.
 *  - We have to use the safe-traversal-operator `?.` to access properties, which is cumbersome.
 *  - We have to place the `async` pipe in parenthesis.
 *
 * A better way to do this is to use `ngIf` and store the result of the condition in a local
 * variable as shown in the the example below:
 *
 * {@example common/ngIf/ts/module.ts region='NgIfAs'}
 *
 * Notice that:
 *  - We use only one `async` pipe and hence only one subscription gets created.
 *  - `ngIf` stores the result of the `userStream|async` in the local variable `user`.
 *  - The local `user` can then be bound repeatedly in a more efficient way.
 *  - No need to use the safe-traversal-operator `?.` to access properties as `ngIf` will only
 *    display the data if `userStream` returns a value.
 *  - We can display an alternative template while waiting for the data.
 *
 * ### Syntax
 *
 * Simple form:
 * - `<div *ngIf="condition">...</div>`
 * - `<ng-template [ngIf]="condition"><div>...</div></ng-template>`
 *
 * Form with an else block:
 * ```
 * <div *ngIf="condition; else elseBlock">...</div>
 * <ng-template #elseBlock>...</ng-template>
 * ```
 *
 * Form with a `then` and `else` block:
 * ```
 * <div *ngIf="condition; then thenBlock else elseBlock"></div>
 * <ng-template #thenBlock>...</ng-template>
 * <ng-template #elseBlock>...</ng-template>
 * ```
 *
 * Form with storing the value locally:
 * ```
 * <div *ngIf="condition as value; else elseBlock">{{value}}</div>
 * <ng-template #elseBlock>...</ng-template>
 * ```
 *
 *
 */
var NgIf = /** @class */ (function () {
    function NgIf(_viewContainer, templateRef) {
        this._viewContainer = _viewContainer;
        this._context = new NgIfContext();
        this._thenTemplateRef = null;
        this._elseTemplateRef = null;
        this._thenViewRef = null;
        this._elseViewRef = null;
        this._thenTemplateRef = templateRef;
    }
    Object.defineProperty(NgIf.prototype, "ngIf", {
        set: function (condition) {
            this._context.$implicit = this._context.ngIf = condition;
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgIf.prototype, "ngIfThen", {
        set: function (templateRef) {
            assertTemplate('ngIfThen', templateRef);
            this._thenTemplateRef = templateRef;
            this._thenViewRef = null; // clear previous view if any.
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgIf.prototype, "ngIfElse", {
        set: function (templateRef) {
            assertTemplate('ngIfElse', templateRef);
            this._elseTemplateRef = templateRef;
            this._elseViewRef = null; // clear previous view if any.
            this._updateView();
        },
        enumerable: true,
        configurable: true
    });
    NgIf.prototype._updateView = function () {
        if (this._context.$implicit) {
            if (!this._thenViewRef) {
                this._viewContainer.clear();
                this._elseViewRef = null;
                if (this._thenTemplateRef) {
                    this._thenViewRef =
                        this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context);
                }
            }
        }
        else {
            if (!this._elseViewRef) {
                this._viewContainer.clear();
                this._thenViewRef = null;
                if (this._elseTemplateRef) {
                    this._elseViewRef =
                        this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context);
                }
            }
        }
    };
    NgIf.decorators = [
        { type: Directive, args: [{ selector: '[ngIf]' },] }
    ];
    /** @nocollapse */
    NgIf.ctorParameters = function () { return [
        { type: ViewContainerRef },
        { type: TemplateRef }
    ]; };
    NgIf.propDecorators = {
        ngIf: [{ type: Input }],
        ngIfThen: [{ type: Input }],
        ngIfElse: [{ type: Input }]
    };
    return NgIf;
}());
export { NgIf };
var NgIfContext = /** @class */ (function () {
    function NgIfContext() {
        this.$implicit = null;
        this.ngIf = null;
    }
    return NgIfContext;
}());
export { NgIfContext };
function assertTemplate(property, templateRef) {
    var isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
    if (!isTemplateRefOrNull) {
        throw new Error(property + " must be a TemplateRef, but received '" + stringify(templateRef) + "'.");
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfaWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL2RpcmVjdGl2ZXMvbmdfaWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFNBQVMsRUFBbUIsS0FBSyxFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBRSxVQUFVLElBQUksU0FBUyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBR3hIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0ZHO0FBQ0g7SUFRRSxjQUFvQixjQUFnQyxFQUFFLFdBQXFDO1FBQXZFLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQU41QyxhQUFRLEdBQWdCLElBQUksV0FBVyxFQUFFLENBQUM7UUFDMUMscUJBQWdCLEdBQWtDLElBQUksQ0FBQztRQUN2RCxxQkFBZ0IsR0FBa0MsSUFBSSxDQUFDO1FBQ3ZELGlCQUFZLEdBQXNDLElBQUksQ0FBQztRQUN2RCxpQkFBWSxHQUFzQyxJQUFJLENBQUM7UUFHN0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztJQUN0QyxDQUFDO0lBRUQsc0JBQ0ksc0JBQUk7YUFEUixVQUNTLFNBQWM7WUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO1lBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyQixDQUFDOzs7T0FBQTtJQUVELHNCQUNJLDBCQUFRO2FBRFosVUFDYSxXQUEwQztZQUNyRCxjQUFjLENBQUMsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7WUFDcEMsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBRSw4QkFBOEI7WUFDekQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JCLENBQUM7OztPQUFBO0lBRUQsc0JBQ0ksMEJBQVE7YUFEWixVQUNhLFdBQTBDO1lBQ3JELGNBQWMsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDeEMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztZQUNwQyxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFFLDhCQUE4QjtZQUN6RCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDckIsQ0FBQzs7O09BQUE7SUFFTywwQkFBVyxHQUFuQjtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3RCLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtvQkFDekIsSUFBSSxDQUFDLFlBQVk7d0JBQ2IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2lCQUNsRjthQUNGO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztnQkFDekIsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7b0JBQ3pCLElBQUksQ0FBQyxZQUFZO3dCQUNiLElBQUksQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDbEY7YUFDRjtTQUNGO0lBQ0gsQ0FBQzs7Z0JBdERGLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUM7Ozs7Z0JBNUZ5QixnQkFBZ0I7Z0JBQTdCLFdBQVc7Ozt1QkF3R25ELEtBQUs7MkJBTUwsS0FBSzsyQkFRTCxLQUFLOztJQWdDUixXQUFDO0NBQUEsQUExREQsSUEwREM7U0F6RFksSUFBSTtBQTJEakI7SUFBQTtRQUNTLGNBQVMsR0FBUSxJQUFJLENBQUM7UUFDdEIsU0FBSSxHQUFRLElBQUksQ0FBQztJQUMxQixDQUFDO0lBQUQsa0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQzs7QUFFRCx3QkFBd0IsUUFBZ0IsRUFBRSxXQUFtQztJQUMzRSxJQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9FLElBQUksQ0FBQyxtQkFBbUIsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUFJLFFBQVEsOENBQXlDLFNBQVMsQ0FBQyxXQUFXLENBQUMsT0FBSSxDQUFDLENBQUM7S0FDakc7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0RpcmVjdGl2ZSwgRW1iZWRkZWRWaWV3UmVmLCBJbnB1dCwgVGVtcGxhdGVSZWYsIFZpZXdDb250YWluZXJSZWYsIMm1c3RyaW5naWZ5IGFzIHN0cmluZ2lmeX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cblxuLyoqXG4gKiBDb25kaXRpb25hbGx5IGluY2x1ZGVzIGEgdGVtcGxhdGUgYmFzZWQgb24gdGhlIHZhbHVlIG9mIGFuIGBleHByZXNzaW9uYC5cbiAqXG4gKiBgbmdJZmAgZXZhbHVhdGVzIHRoZSBgZXhwcmVzc2lvbmAgYW5kIHRoZW4gcmVuZGVycyB0aGUgYHRoZW5gIG9yIGBlbHNlYCB0ZW1wbGF0ZSBpbiBpdHMgcGxhY2VcbiAqIHdoZW4gZXhwcmVzc2lvbiBpcyB0cnV0aHkgb3IgZmFsc3kgcmVzcGVjdGl2ZWx5LiBUeXBpY2FsbHkgdGhlOlxuICogIC0gYHRoZW5gIHRlbXBsYXRlIGlzIHRoZSBpbmxpbmUgdGVtcGxhdGUgb2YgYG5nSWZgIHVubGVzcyBib3VuZCB0byBhIGRpZmZlcmVudCB2YWx1ZS5cbiAqICAtIGBlbHNlYCB0ZW1wbGF0ZSBpcyBibGFuayB1bmxlc3MgaXQgaXMgYm91bmQuXG4gKlxuICogIyMgTW9zdCBjb21tb24gdXNhZ2VcbiAqXG4gKiBUaGUgbW9zdCBjb21tb24gdXNhZ2Ugb2YgdGhlIGBuZ0lmYCBkaXJlY3RpdmUgaXMgdG8gY29uZGl0aW9uYWxseSBzaG93IHRoZSBpbmxpbmUgdGVtcGxhdGUgYXNcbiAqIHNlZW4gaW4gdGhpcyBleGFtcGxlOlxuICoge0BleGFtcGxlIGNvbW1vbi9uZ0lmL3RzL21vZHVsZS50cyByZWdpb249J05nSWZTaW1wbGUnfVxuICpcbiAqICMjIFNob3dpbmcgYW4gYWx0ZXJuYXRpdmUgdGVtcGxhdGUgdXNpbmcgYGVsc2VgXG4gKlxuICogSWYgaXQgaXMgbmVjZXNzYXJ5IHRvIGRpc3BsYXkgYSB0ZW1wbGF0ZSB3aGVuIHRoZSBgZXhwcmVzc2lvbmAgaXMgZmFsc3kgdXNlIHRoZSBgZWxzZWAgdGVtcGxhdGVcbiAqIGJpbmRpbmcgYXMgc2hvd24uIE5vdGUgdGhhdCB0aGUgYGVsc2VgIGJpbmRpbmcgcG9pbnRzIHRvIGEgYDxuZy10ZW1wbGF0ZT5gIGxhYmVsZWQgYCNlbHNlQmxvY2tgLlxuICogVGhlIHRlbXBsYXRlIGNhbiBiZSBkZWZpbmVkIGFueXdoZXJlIGluIHRoZSBjb21wb25lbnQgdmlldyBidXQgaXMgdHlwaWNhbGx5IHBsYWNlZCByaWdodCBhZnRlclxuICogYG5nSWZgIGZvciByZWFkYWJpbGl0eS5cbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL25nSWYvdHMvbW9kdWxlLnRzIHJlZ2lvbj0nTmdJZkVsc2UnfVxuICpcbiAqICMjIFVzaW5nIG5vbi1pbmxpbmVkIGB0aGVuYCB0ZW1wbGF0ZVxuICpcbiAqIFVzdWFsbHkgdGhlIGB0aGVuYCB0ZW1wbGF0ZSBpcyB0aGUgaW5saW5lZCB0ZW1wbGF0ZSBvZiB0aGUgYG5nSWZgLCBidXQgaXQgY2FuIGJlIGNoYW5nZWQgdXNpbmdcbiAqIGEgYmluZGluZyAoanVzdCBsaWtlIGBlbHNlYCkuIEJlY2F1c2UgYHRoZW5gIGFuZCBgZWxzZWAgYXJlIGJpbmRpbmdzLCB0aGUgdGVtcGxhdGUgcmVmZXJlbmNlcyBjYW5cbiAqIGNoYW5nZSBhdCBydW50aW1lIGFzIHNob3duIGluIHRoaXMgZXhhbXBsZS5cbiAqXG4gKiB7QGV4YW1wbGUgY29tbW9uL25nSWYvdHMvbW9kdWxlLnRzIHJlZ2lvbj0nTmdJZlRoZW5FbHNlJ31cbiAqXG4gKiAjIyBTdG9yaW5nIGNvbmRpdGlvbmFsIHJlc3VsdCBpbiBhIHZhcmlhYmxlXG4gKlxuICogQSBjb21tb24gcGF0dGVybiBpcyB0aGF0IHdlIG5lZWQgdG8gc2hvdyBhIHNldCBvZiBwcm9wZXJ0aWVzIGZyb20gdGhlIHNhbWUgb2JqZWN0LiBJZiB0aGVcbiAqIG9iamVjdCBpcyB1bmRlZmluZWQsIHRoZW4gd2UgaGF2ZSB0byB1c2UgdGhlIHNhZmUtdHJhdmVyc2FsLW9wZXJhdG9yIGA/LmAgdG8gZ3VhcmQgYWdhaW5zdFxuICogZGVyZWZlcmVuY2luZyBhIGBudWxsYCB2YWx1ZS4gVGhpcyBpcyBlc3BlY2lhbGx5IHRoZSBjYXNlIHdoZW4gd2FpdGluZyBvbiBhc3luYyBkYXRhIHN1Y2ggYXNcbiAqIHdoZW4gdXNpbmcgdGhlIGBhc3luY2AgcGlwZSBhcyBzaG93biBpbiBmb2xsb3dpbmcgZXhhbXBsZTpcbiAqXG4gKiBgYGBcbiAqIEhlbGxvIHt7ICh1c2VyU3RyZWFtfGFzeW5jKT8ubGFzdCB9fSwge3sgKHVzZXJTdHJlYW18YXN5bmMpPy5maXJzdCB9fSFcbiAqIGBgYFxuICpcbiAqIFRoZXJlIGFyZSBzZXZlcmFsIGluZWZmaWNpZW5jaWVzIGluIHRoZSBhYm92ZSBleGFtcGxlOlxuICogIC0gV2UgY3JlYXRlIG11bHRpcGxlIHN1YnNjcmlwdGlvbnMgb24gYHVzZXJTdHJlYW1gLiBPbmUgZm9yIGVhY2ggYGFzeW5jYCBwaXBlLCBvciB0d28gaW4gdGhlXG4gKiAgICBleGFtcGxlIGFib3ZlLlxuICogIC0gV2UgY2Fubm90IGRpc3BsYXkgYW4gYWx0ZXJuYXRpdmUgc2NyZWVuIHdoaWxlIHdhaXRpbmcgZm9yIHRoZSBkYXRhIHRvIGFycml2ZSBhc3luY2hyb25vdXNseS5cbiAqICAtIFdlIGhhdmUgdG8gdXNlIHRoZSBzYWZlLXRyYXZlcnNhbC1vcGVyYXRvciBgPy5gIHRvIGFjY2VzcyBwcm9wZXJ0aWVzLCB3aGljaCBpcyBjdW1iZXJzb21lLlxuICogIC0gV2UgaGF2ZSB0byBwbGFjZSB0aGUgYGFzeW5jYCBwaXBlIGluIHBhcmVudGhlc2lzLlxuICpcbiAqIEEgYmV0dGVyIHdheSB0byBkbyB0aGlzIGlzIHRvIHVzZSBgbmdJZmAgYW5kIHN0b3JlIHRoZSByZXN1bHQgb2YgdGhlIGNvbmRpdGlvbiBpbiBhIGxvY2FsXG4gKiB2YXJpYWJsZSBhcyBzaG93biBpbiB0aGUgdGhlIGV4YW1wbGUgYmVsb3c6XG4gKlxuICoge0BleGFtcGxlIGNvbW1vbi9uZ0lmL3RzL21vZHVsZS50cyByZWdpb249J05nSWZBcyd9XG4gKlxuICogTm90aWNlIHRoYXQ6XG4gKiAgLSBXZSB1c2Ugb25seSBvbmUgYGFzeW5jYCBwaXBlIGFuZCBoZW5jZSBvbmx5IG9uZSBzdWJzY3JpcHRpb24gZ2V0cyBjcmVhdGVkLlxuICogIC0gYG5nSWZgIHN0b3JlcyB0aGUgcmVzdWx0IG9mIHRoZSBgdXNlclN0cmVhbXxhc3luY2AgaW4gdGhlIGxvY2FsIHZhcmlhYmxlIGB1c2VyYC5cbiAqICAtIFRoZSBsb2NhbCBgdXNlcmAgY2FuIHRoZW4gYmUgYm91bmQgcmVwZWF0ZWRseSBpbiBhIG1vcmUgZWZmaWNpZW50IHdheS5cbiAqICAtIE5vIG5lZWQgdG8gdXNlIHRoZSBzYWZlLXRyYXZlcnNhbC1vcGVyYXRvciBgPy5gIHRvIGFjY2VzcyBwcm9wZXJ0aWVzIGFzIGBuZ0lmYCB3aWxsIG9ubHlcbiAqICAgIGRpc3BsYXkgdGhlIGRhdGEgaWYgYHVzZXJTdHJlYW1gIHJldHVybnMgYSB2YWx1ZS5cbiAqICAtIFdlIGNhbiBkaXNwbGF5IGFuIGFsdGVybmF0aXZlIHRlbXBsYXRlIHdoaWxlIHdhaXRpbmcgZm9yIHRoZSBkYXRhLlxuICpcbiAqICMjIyBTeW50YXhcbiAqXG4gKiBTaW1wbGUgZm9ybTpcbiAqIC0gYDxkaXYgKm5nSWY9XCJjb25kaXRpb25cIj4uLi48L2Rpdj5gXG4gKiAtIGA8bmctdGVtcGxhdGUgW25nSWZdPVwiY29uZGl0aW9uXCI+PGRpdj4uLi48L2Rpdj48L25nLXRlbXBsYXRlPmBcbiAqXG4gKiBGb3JtIHdpdGggYW4gZWxzZSBibG9jazpcbiAqIGBgYFxuICogPGRpdiAqbmdJZj1cImNvbmRpdGlvbjsgZWxzZSBlbHNlQmxvY2tcIj4uLi48L2Rpdj5cbiAqIDxuZy10ZW1wbGF0ZSAjZWxzZUJsb2NrPi4uLjwvbmctdGVtcGxhdGU+XG4gKiBgYGBcbiAqXG4gKiBGb3JtIHdpdGggYSBgdGhlbmAgYW5kIGBlbHNlYCBibG9jazpcbiAqIGBgYFxuICogPGRpdiAqbmdJZj1cImNvbmRpdGlvbjsgdGhlbiB0aGVuQmxvY2sgZWxzZSBlbHNlQmxvY2tcIj48L2Rpdj5cbiAqIDxuZy10ZW1wbGF0ZSAjdGhlbkJsb2NrPi4uLjwvbmctdGVtcGxhdGU+XG4gKiA8bmctdGVtcGxhdGUgI2Vsc2VCbG9jaz4uLi48L25nLXRlbXBsYXRlPlxuICogYGBgXG4gKlxuICogRm9ybSB3aXRoIHN0b3JpbmcgdGhlIHZhbHVlIGxvY2FsbHk6XG4gKiBgYGBcbiAqIDxkaXYgKm5nSWY9XCJjb25kaXRpb24gYXMgdmFsdWU7IGVsc2UgZWxzZUJsb2NrXCI+e3t2YWx1ZX19PC9kaXY+XG4gKiA8bmctdGVtcGxhdGUgI2Vsc2VCbG9jaz4uLi48L25nLXRlbXBsYXRlPlxuICogYGBgXG4gKlxuICpcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICdbbmdJZl0nfSlcbmV4cG9ydCBjbGFzcyBOZ0lmIHtcbiAgcHJpdmF0ZSBfY29udGV4dDogTmdJZkNvbnRleHQgPSBuZXcgTmdJZkNvbnRleHQoKTtcbiAgcHJpdmF0ZSBfdGhlblRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxOZ0lmQ29udGV4dD58bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2Vsc2VUZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TmdJZkNvbnRleHQ+fG51bGwgPSBudWxsO1xuICBwcml2YXRlIF90aGVuVmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPE5nSWZDb250ZXh0PnxudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfZWxzZVZpZXdSZWY6IEVtYmVkZGVkVmlld1JlZjxOZ0lmQ29udGV4dD58bnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmlld0NvbnRhaW5lcjogVmlld0NvbnRhaW5lclJlZiwgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nSWZDb250ZXh0Pikge1xuICAgIHRoaXMuX3RoZW5UZW1wbGF0ZVJlZiA9IHRlbXBsYXRlUmVmO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG5nSWYoY29uZGl0aW9uOiBhbnkpIHtcbiAgICB0aGlzLl9jb250ZXh0LiRpbXBsaWNpdCA9IHRoaXMuX2NvbnRleHQubmdJZiA9IGNvbmRpdGlvbjtcbiAgICB0aGlzLl91cGRhdGVWaWV3KCk7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbmdJZlRoZW4odGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPE5nSWZDb250ZXh0PnxudWxsKSB7XG4gICAgYXNzZXJ0VGVtcGxhdGUoJ25nSWZUaGVuJywgdGVtcGxhdGVSZWYpO1xuICAgIHRoaXMuX3RoZW5UZW1wbGF0ZVJlZiA9IHRlbXBsYXRlUmVmO1xuICAgIHRoaXMuX3RoZW5WaWV3UmVmID0gbnVsbDsgIC8vIGNsZWFyIHByZXZpb3VzIHZpZXcgaWYgYW55LlxuICAgIHRoaXMuX3VwZGF0ZVZpZXcoKTtcbiAgfVxuXG4gIEBJbnB1dCgpXG4gIHNldCBuZ0lmRWxzZSh0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8TmdJZkNvbnRleHQ+fG51bGwpIHtcbiAgICBhc3NlcnRUZW1wbGF0ZSgnbmdJZkVsc2UnLCB0ZW1wbGF0ZVJlZik7XG4gICAgdGhpcy5fZWxzZVRlbXBsYXRlUmVmID0gdGVtcGxhdGVSZWY7XG4gICAgdGhpcy5fZWxzZVZpZXdSZWYgPSBudWxsOyAgLy8gY2xlYXIgcHJldmlvdXMgdmlldyBpZiBhbnkuXG4gICAgdGhpcy5fdXBkYXRlVmlldygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdXBkYXRlVmlldygpIHtcbiAgICBpZiAodGhpcy5fY29udGV4dC4kaW1wbGljaXQpIHtcbiAgICAgIGlmICghdGhpcy5fdGhlblZpZXdSZWYpIHtcbiAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lci5jbGVhcigpO1xuICAgICAgICB0aGlzLl9lbHNlVmlld1JlZiA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLl90aGVuVGVtcGxhdGVSZWYpIHtcbiAgICAgICAgICB0aGlzLl90aGVuVmlld1JlZiA9XG4gICAgICAgICAgICAgIHRoaXMuX3ZpZXdDb250YWluZXIuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RoZW5UZW1wbGF0ZVJlZiwgdGhpcy5fY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLl9lbHNlVmlld1JlZikge1xuICAgICAgICB0aGlzLl92aWV3Q29udGFpbmVyLmNsZWFyKCk7XG4gICAgICAgIHRoaXMuX3RoZW5WaWV3UmVmID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuX2Vsc2VUZW1wbGF0ZVJlZikge1xuICAgICAgICAgIHRoaXMuX2Vsc2VWaWV3UmVmID1cbiAgICAgICAgICAgICAgdGhpcy5fdmlld0NvbnRhaW5lci5jcmVhdGVFbWJlZGRlZFZpZXcodGhpcy5fZWxzZVRlbXBsYXRlUmVmLCB0aGlzLl9jb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgcHVibGljIHN0YXRpYyBuZ0lmVXNlSWZUeXBlR3VhcmQ6IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBOZ0lmQ29udGV4dCB7XG4gIHB1YmxpYyAkaW1wbGljaXQ6IGFueSA9IG51bGw7XG4gIHB1YmxpYyBuZ0lmOiBhbnkgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRUZW1wbGF0ZShwcm9wZXJ0eTogc3RyaW5nLCB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55PnwgbnVsbCk6IHZvaWQge1xuICBjb25zdCBpc1RlbXBsYXRlUmVmT3JOdWxsID0gISEoIXRlbXBsYXRlUmVmIHx8IHRlbXBsYXRlUmVmLmNyZWF0ZUVtYmVkZGVkVmlldyk7XG4gIGlmICghaXNUZW1wbGF0ZVJlZk9yTnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJHtwcm9wZXJ0eX0gbXVzdCBiZSBhIFRlbXBsYXRlUmVmLCBidXQgcmVjZWl2ZWQgJyR7c3RyaW5naWZ5KHRlbXBsYXRlUmVmKX0nLmApO1xuICB9XG59XG4iXX0=