/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/** @type {?} */
const noop = () => { };
const ɵ0 = noop;
/** @typedef {?} */
var CompensationReverter;
export { CompensationReverter };
/**
 * Utility to handle the scrollbar.
 *
 * It allows to compensate the lack of a vertical scrollbar by adding an
 * equivalent padding on the right of the body, and to remove this compensation.
 */
export class ScrollBar {
    /**
     * @param {?} _document
     */
    constructor(_document) {
        this._document = _document;
    }
    /**
     * Detects if a scrollbar is present and if yes, already compensates for its
     * removal by adding an equivalent padding on the right of the body.
     *
     * @return {?} a callback used to revert the compensation (noop if there was none,
     * otherwise a function removing the padding)
     */
    compensate() { return !this._isPresent() ? noop : this._adjustBody(this._getWidth()); }
    /**
     * Adds a padding of the given width on the right of the body.
     *
     * @param {?} width
     * @return {?} a callback used to revert the padding to its previous value
     */
    _adjustBody(width) {
        /** @type {?} */
        const body = this._document.body;
        /** @type {?} */
        const userSetPadding = body.style.paddingRight;
        /** @type {?} */
        const paddingAmount = parseFloat(window.getComputedStyle(body)['padding-right']);
        body.style['padding-right'] = `${paddingAmount + width}px`;
        return () => body.style['padding-right'] = userSetPadding;
    }
    /**
     * Tells whether a scrollbar is currently present on the body.
     *
     * @return {?} true if scrollbar is present, false otherwise
     */
    _isPresent() {
        /** @type {?} */
        const rect = this._document.body.getBoundingClientRect();
        return rect.left + rect.right < window.innerWidth;
    }
    /**
     * Calculates and returns the width of a scrollbar.
     *
     * @return {?} the width of a scrollbar on this page
     */
    _getWidth() {
        /** @type {?} */
        const measurer = this._document.createElement('div');
        measurer.className = 'modal-scrollbar-measure';
        /** @type {?} */
        const body = this._document.body;
        body.appendChild(measurer);
        /** @type {?} */
        const width = measurer.getBoundingClientRect().width - measurer.clientWidth;
        body.removeChild(measurer);
        return width;
    }
}
ScrollBar.decorators = [
    { type: Injectable, args: [{ providedIn: 'root' },] },
];
/** @nocollapse */
ScrollBar.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] }
];
/** @nocollapse */ ScrollBar.ngInjectableDef = i0.defineInjectable({ factory: function ScrollBar_Factory() { return new ScrollBar(i0.inject(i1.DOCUMENT)); }, token: ScrollBar, providedIn: "root" });
if (false) {
    /** @type {?} */
    ScrollBar.prototype._document;
}
export { ɵ0 };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsYmFyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJ1dGlsL3Njcm9sbGJhci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDakQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDOzs7O0FBR3pDLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxJQUFHLENBQUM7Ozs7Ozs7Ozs7O0FBZ0J0QixNQUFNOzs7O0lBQ0osWUFBc0MsU0FBUztRQUFULGNBQVMsR0FBVCxTQUFTLENBQUE7S0FBSTs7Ozs7Ozs7SUFTbkQsVUFBVSxLQUEyQixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFOzs7Ozs7O0lBT3JHLFdBQVcsQ0FBQyxLQUFhOztRQUMvQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQzs7UUFDakMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7O1FBQy9DLE1BQU0sYUFBYSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNqRixJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLEdBQUcsYUFBYSxHQUFHLEtBQUssSUFBSSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLGNBQWMsQ0FBQzs7Ozs7OztJQVFwRCxVQUFVOztRQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQzs7Ozs7OztJQVE1QyxTQUFTOztRQUNmLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JELFFBQVEsQ0FBQyxTQUFTLEdBQUcseUJBQXlCLENBQUM7O1FBRS9DLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ2pDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7O1FBQzNCLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO1FBQzVFLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFM0IsTUFBTSxDQUFDLEtBQUssQ0FBQzs7OztZQWxEaEIsVUFBVSxTQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7Ozs0Q0FFakIsTUFBTSxTQUFDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGUsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5UfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5cbmNvbnN0IG5vb3AgPSAoKSA9PiB7fTtcblxuXG5cbi8qKiBUeXBlIGZvciB0aGUgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIHNjcm9sbGJhciBjb21wZW5zYXRpb24uICovXG5leHBvcnQgdHlwZSBDb21wZW5zYXRpb25SZXZlcnRlciA9ICgpID0+IHZvaWQ7XG5cblxuXG4vKipcbiAqIFV0aWxpdHkgdG8gaGFuZGxlIHRoZSBzY3JvbGxiYXIuXG4gKlxuICogSXQgYWxsb3dzIHRvIGNvbXBlbnNhdGUgdGhlIGxhY2sgb2YgYSB2ZXJ0aWNhbCBzY3JvbGxiYXIgYnkgYWRkaW5nIGFuXG4gKiBlcXVpdmFsZW50IHBhZGRpbmcgb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LCBhbmQgdG8gcmVtb3ZlIHRoaXMgY29tcGVuc2F0aW9uLlxuICovXG5ASW5qZWN0YWJsZSh7cHJvdmlkZWRJbjogJ3Jvb3QnfSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxCYXIge1xuICBjb25zdHJ1Y3RvcihASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIF9kb2N1bWVudCkge31cblxuICAvKipcbiAgICogRGV0ZWN0cyBpZiBhIHNjcm9sbGJhciBpcyBwcmVzZW50IGFuZCBpZiB5ZXMsIGFscmVhZHkgY29tcGVuc2F0ZXMgZm9yIGl0c1xuICAgKiByZW1vdmFsIGJ5IGFkZGluZyBhbiBlcXVpdmFsZW50IHBhZGRpbmcgb24gdGhlIHJpZ2h0IG9mIHRoZSBib2R5LlxuICAgKlxuICAgKiBAcmV0dXJuIGEgY2FsbGJhY2sgdXNlZCB0byByZXZlcnQgdGhlIGNvbXBlbnNhdGlvbiAobm9vcCBpZiB0aGVyZSB3YXMgbm9uZSxcbiAgICogb3RoZXJ3aXNlIGEgZnVuY3Rpb24gcmVtb3ZpbmcgdGhlIHBhZGRpbmcpXG4gICAqL1xuICBjb21wZW5zYXRlKCk6IENvbXBlbnNhdGlvblJldmVydGVyIHsgcmV0dXJuICF0aGlzLl9pc1ByZXNlbnQoKSA/IG5vb3AgOiB0aGlzLl9hZGp1c3RCb2R5KHRoaXMuX2dldFdpZHRoKCkpOyB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwYWRkaW5nIG9mIHRoZSBnaXZlbiB3aWR0aCBvbiB0aGUgcmlnaHQgb2YgdGhlIGJvZHkuXG4gICAqXG4gICAqIEByZXR1cm4gYSBjYWxsYmFjayB1c2VkIHRvIHJldmVydCB0aGUgcGFkZGluZyB0byBpdHMgcHJldmlvdXMgdmFsdWVcbiAgICovXG4gIHByaXZhdGUgX2FkanVzdEJvZHkod2lkdGg6IG51bWJlcik6IENvbXBlbnNhdGlvblJldmVydGVyIHtcbiAgICBjb25zdCBib2R5ID0gdGhpcy5fZG9jdW1lbnQuYm9keTtcbiAgICBjb25zdCB1c2VyU2V0UGFkZGluZyA9IGJvZHkuc3R5bGUucGFkZGluZ1JpZ2h0O1xuICAgIGNvbnN0IHBhZGRpbmdBbW91bnQgPSBwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGJvZHkpWydwYWRkaW5nLXJpZ2h0J10pO1xuICAgIGJvZHkuc3R5bGVbJ3BhZGRpbmctcmlnaHQnXSA9IGAke3BhZGRpbmdBbW91bnQgKyB3aWR0aH1weGA7XG4gICAgcmV0dXJuICgpID0+IGJvZHkuc3R5bGVbJ3BhZGRpbmctcmlnaHQnXSA9IHVzZXJTZXRQYWRkaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIFRlbGxzIHdoZXRoZXIgYSBzY3JvbGxiYXIgaXMgY3VycmVudGx5IHByZXNlbnQgb24gdGhlIGJvZHkuXG4gICAqXG4gICAqIEByZXR1cm4gdHJ1ZSBpZiBzY3JvbGxiYXIgaXMgcHJlc2VudCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqL1xuICBwcml2YXRlIF9pc1ByZXNlbnQoKTogYm9vbGVhbiB7XG4gICAgY29uc3QgcmVjdCA9IHRoaXMuX2RvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgcmV0dXJuIHJlY3QubGVmdCArIHJlY3QucmlnaHQgPCB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxjdWxhdGVzIGFuZCByZXR1cm5zIHRoZSB3aWR0aCBvZiBhIHNjcm9sbGJhci5cbiAgICpcbiAgICogQHJldHVybiB0aGUgd2lkdGggb2YgYSBzY3JvbGxiYXIgb24gdGhpcyBwYWdlXG4gICAqL1xuICBwcml2YXRlIF9nZXRXaWR0aCgpOiBudW1iZXIge1xuICAgIGNvbnN0IG1lYXN1cmVyID0gdGhpcy5fZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbWVhc3VyZXIuY2xhc3NOYW1lID0gJ21vZGFsLXNjcm9sbGJhci1tZWFzdXJlJztcblxuICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9kb2N1bWVudC5ib2R5O1xuICAgIGJvZHkuYXBwZW5kQ2hpbGQobWVhc3VyZXIpO1xuICAgIGNvbnN0IHdpZHRoID0gbWVhc3VyZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGggLSBtZWFzdXJlci5jbGllbnRXaWR0aDtcbiAgICBib2R5LnJlbW92ZUNoaWxkKG1lYXN1cmVyKTtcblxuICAgIHJldHVybiB3aWR0aDtcbiAgfVxufVxuIl19