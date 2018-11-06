/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { fromEvent } from 'rxjs';
import { filter, map, takeUntil, withLatestFrom } from 'rxjs/operators';
import { Key } from '../util/key';
/** @type {?} */
const FOCUSABLE_ELEMENTS_SELECTOR = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])', 'select:not([disabled])',
    'textarea:not([disabled])', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'
].join(', ');
/**
 * Returns first and last focusable elements inside of a given element based on specific CSS selector
 * @param {?} element
 * @return {?}
 */
function getFocusableBoundaryElements(element) {
    /** @type {?} */
    const list = element.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR);
    return [list[0], list[list.length - 1]];
}
/** *
 * Function that enforces browser focus to be trapped inside a DOM element.
 *
 * Works only for clicks inside the element and navigation with 'Tab', ignoring clicks outside of the element
 *
 * \@param element The element around which focus will be trapped inside
 * \@param stopFocusTrap$ The observable stream. When completed the focus trap will clean up listeners
 * and free internal resources
  @type {?} */
export const ngbFocusTrap = (element, stopFocusTrap$) => {
    /** @type {?} */
    const lastFocusedElement$ = fromEvent(element, 'focusin').pipe(takeUntil(stopFocusTrap$), map(e => e.target));
    // 'tab' / 'shift+tab' stream
    fromEvent(element, 'keydown')
        .pipe(takeUntil(stopFocusTrap$), filter(e => e.which === Key.Tab), withLatestFrom(lastFocusedElement$))
        .subscribe(([tabEvent, focusedElement]) => {
        const [first, last] = getFocusableBoundaryElements(element);
        if (focusedElement === first && tabEvent.shiftKey) {
            last.focus();
            tabEvent.preventDefault();
        }
        if (focusedElement === last && !tabEvent.shiftKey) {
            first.focus();
            tabEvent.preventDefault();
        }
    });
    // inside click
    fromEvent(element, 'click')
        .pipe(takeUntil(stopFocusTrap$), withLatestFrom(lastFocusedElement$), map(arr => /** @type {?} */ (arr[1])))
        .subscribe(lastFocusedElement => lastFocusedElement.focus());
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9jdXMtdHJhcC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsidXRpbC9mb2N1cy10cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFhLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0RSxPQUFPLEVBQUMsR0FBRyxFQUFDLE1BQU0sYUFBYSxDQUFDOztBQUVoQyxNQUFNLDJCQUEyQixHQUFHO0lBQ2xDLFNBQVMsRUFBRSx3QkFBd0IsRUFBRSw0Q0FBNEMsRUFBRSx3QkFBd0I7SUFDM0csMEJBQTBCLEVBQUUsbUJBQW1CLEVBQUUsaUNBQWlDO0NBQ25GLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFLYixzQ0FBc0MsT0FBb0I7O0lBQ3hELE1BQU0sSUFBSSxHQUE0QixPQUFPLENBQUMsZ0JBQWdCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztJQUM1RixNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6Qzs7Ozs7Ozs7OztBQVdELGFBQWEsWUFBWSxHQUFHLENBQUMsT0FBb0IsRUFBRSxjQUErQixFQUFFLEVBQUU7O0lBRXBGLE1BQU0sbUJBQW1CLEdBQ3JCLFNBQVMsQ0FBYSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7SUFHbEcsU0FBUyxDQUFnQixPQUFPLEVBQUUsU0FBUyxDQUFDO1NBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDdEcsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLEVBQUUsRUFBRTtRQUN4QyxNQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFHLDRCQUE0QixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTNELEVBQUUsQ0FBQyxDQUFDLGNBQWMsS0FBSyxLQUFLLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbEQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2IsUUFBUSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzNCO1FBRUQsRUFBRSxDQUFDLENBQUMsY0FBYyxLQUFLLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xELEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNkLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUMzQjtLQUNGLENBQUMsQ0FBQzs7SUFHUCxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztTQUN0QixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxtQkFBQyxHQUFHLENBQUMsQ0FBQyxDQUFnQixDQUFBLENBQUMsQ0FBQztTQUN2RyxTQUFTLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7Q0FDbEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZnJvbUV2ZW50LCBPYnNlcnZhYmxlfSBmcm9tICdyeGpzJztcbmltcG9ydCB7ZmlsdGVyLCBtYXAsIHRha2VVbnRpbCwgd2l0aExhdGVzdEZyb219IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7S2V5fSBmcm9tICcuLi91dGlsL2tleSc7XG5cbmNvbnN0IEZPQ1VTQUJMRV9FTEVNRU5UU19TRUxFQ1RPUiA9IFtcbiAgJ2FbaHJlZl0nLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSk6bm90KFt0eXBlPVwiaGlkZGVuXCJdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJyxcbiAgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknXG5dLmpvaW4oJywgJyk7XG5cbi8qKlxuICogUmV0dXJucyBmaXJzdCBhbmQgbGFzdCBmb2N1c2FibGUgZWxlbWVudHMgaW5zaWRlIG9mIGEgZ2l2ZW4gZWxlbWVudCBiYXNlZCBvbiBzcGVjaWZpYyBDU1Mgc2VsZWN0b3JcbiAqL1xuZnVuY3Rpb24gZ2V0Rm9jdXNhYmxlQm91bmRhcnlFbGVtZW50cyhlbGVtZW50OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50W10ge1xuICBjb25zdCBsaXN0OiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChGT0NVU0FCTEVfRUxFTUVOVFNfU0VMRUNUT1IpO1xuICByZXR1cm4gW2xpc3RbMF0sIGxpc3RbbGlzdC5sZW5ndGggLSAxXV07XG59XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCBlbmZvcmNlcyBicm93c2VyIGZvY3VzIHRvIGJlIHRyYXBwZWQgaW5zaWRlIGEgRE9NIGVsZW1lbnQuXG4gKlxuICogV29ya3Mgb25seSBmb3IgY2xpY2tzIGluc2lkZSB0aGUgZWxlbWVudCBhbmQgbmF2aWdhdGlvbiB3aXRoICdUYWInLCBpZ25vcmluZyBjbGlja3Mgb3V0c2lkZSBvZiB0aGUgZWxlbWVudFxuICpcbiAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IGFyb3VuZCB3aGljaCBmb2N1cyB3aWxsIGJlIHRyYXBwZWQgaW5zaWRlXG4gKiBAcGFyYW0gc3RvcEZvY3VzVHJhcCQgVGhlIG9ic2VydmFibGUgc3RyZWFtLiBXaGVuIGNvbXBsZXRlZCB0aGUgZm9jdXMgdHJhcCB3aWxsIGNsZWFuIHVwIGxpc3RlbmVyc1xuICogYW5kIGZyZWUgaW50ZXJuYWwgcmVzb3VyY2VzXG4gKi9cbmV4cG9ydCBjb25zdCBuZ2JGb2N1c1RyYXAgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQsIHN0b3BGb2N1c1RyYXAkOiBPYnNlcnZhYmxlPGFueT4pID0+IHtcbiAgLy8gbGFzdCBmb2N1c2VkIGVsZW1lbnRcbiAgY29uc3QgbGFzdEZvY3VzZWRFbGVtZW50JCA9XG4gICAgICBmcm9tRXZlbnQ8Rm9jdXNFdmVudD4oZWxlbWVudCwgJ2ZvY3VzaW4nKS5waXBlKHRha2VVbnRpbChzdG9wRm9jdXNUcmFwJCksIG1hcChlID0+IGUudGFyZ2V0KSk7XG5cbiAgLy8gJ3RhYicgLyAnc2hpZnQrdGFiJyBzdHJlYW1cbiAgZnJvbUV2ZW50PEtleWJvYXJkRXZlbnQ+KGVsZW1lbnQsICdrZXlkb3duJylcbiAgICAgIC5waXBlKHRha2VVbnRpbChzdG9wRm9jdXNUcmFwJCksIGZpbHRlcihlID0+IGUud2hpY2ggPT09IEtleS5UYWIpLCB3aXRoTGF0ZXN0RnJvbShsYXN0Rm9jdXNlZEVsZW1lbnQkKSlcbiAgICAgIC5zdWJzY3JpYmUoKFt0YWJFdmVudCwgZm9jdXNlZEVsZW1lbnRdKSA9PiB7XG4gICAgICAgIGNvbnN0W2ZpcnN0LCBsYXN0XSA9IGdldEZvY3VzYWJsZUJvdW5kYXJ5RWxlbWVudHMoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKGZvY3VzZWRFbGVtZW50ID09PSBmaXJzdCAmJiB0YWJFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGxhc3QuZm9jdXMoKTtcbiAgICAgICAgICB0YWJFdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGZvY3VzZWRFbGVtZW50ID09PSBsYXN0ICYmICF0YWJFdmVudC5zaGlmdEtleSkge1xuICAgICAgICAgIGZpcnN0LmZvY3VzKCk7XG4gICAgICAgICAgdGFiRXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgLy8gaW5zaWRlIGNsaWNrXG4gIGZyb21FdmVudChlbGVtZW50LCAnY2xpY2snKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHN0b3BGb2N1c1RyYXAkKSwgd2l0aExhdGVzdEZyb20obGFzdEZvY3VzZWRFbGVtZW50JCksIG1hcChhcnIgPT4gYXJyWzFdIGFzIEhUTUxFbGVtZW50KSlcbiAgICAgIC5zdWJzY3JpYmUobGFzdEZvY3VzZWRFbGVtZW50ID0+IGxhc3RGb2N1c2VkRWxlbWVudC5mb2N1cygpKTtcbn07XG4iXX0=