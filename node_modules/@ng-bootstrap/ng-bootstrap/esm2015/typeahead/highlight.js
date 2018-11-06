/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { regExpEscape, toString } from '../util/util';
/**
 * A component that can be used inside a custom result template in order to highlight the term inside the text of the
 * result
 */
export class NgbHighlight {
    constructor() {
        /**
         * The CSS class of the span elements wrapping the term inside the result
         */
        this.highlightClass = 'ngb-highlight';
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        const resultStr = toString(this.result);
        /** @type {?} */
        const resultLC = resultStr.toLowerCase();
        /** @type {?} */
        const termLC = toString(this.term).toLowerCase();
        /** @type {?} */
        let currentIdx = 0;
        if (termLC.length > 0) {
            this.parts = resultLC.split(new RegExp(`(${regExpEscape(termLC)})`)).map((part) => {
                /** @type {?} */
                const originalPart = resultStr.substr(currentIdx, part.length);
                currentIdx += part.length;
                return originalPart;
            });
        }
        else {
            this.parts = [resultStr];
        }
    }
}
NgbHighlight.decorators = [
    { type: Component, args: [{
                selector: 'ngb-highlight',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `<ng-template ngFor [ngForOf]="parts" let-part let-isOdd="odd">` +
                    `<span *ngIf="isOdd; else even" [class]="highlightClass">{{part}}</span><ng-template #even>{{part}}</ng-template>` +
                    `</ng-template>`,
                // template needs to be formatted in a certain way so we don't add empty text nodes
                styles: [`
    .ngb-highlight {
      font-weight: bold;
    }
  `]
            },] },
];
NgbHighlight.propDecorators = {
    highlightClass: [{ type: Input }],
    result: [{ type: Input }],
    term: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    NgbHighlight.prototype.parts;
    /**
     * The CSS class of the span elements wrapping the term inside the result
     * @type {?}
     */
    NgbHighlight.prototype.highlightClass;
    /**
     * The result text to display. If the term is found inside this text, it's highlighted
     * @type {?}
     */
    NgbHighlight.prototype.result;
    /**
     * The searched term
     * @type {?}
     */
    NgbHighlight.prototype.term;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGlnaGxpZ2h0LmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJ0eXBlYWhlYWQvaGlnaGxpZ2h0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBYSx1QkFBdUIsRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFDbEcsT0FBTyxFQUFDLFlBQVksRUFBRSxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7O0FBa0JwRCxNQUFNOzs7Ozs4QkFNc0IsZUFBZTs7Ozs7O0lBWXpDLFdBQVcsQ0FBQyxPQUFzQjs7UUFDaEMsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFDeEMsTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDOztRQUN6QyxNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDOztRQUNqRCxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFFbkIsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTs7Z0JBQ2hGLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDL0QsVUFBVSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLE1BQU0sQ0FBQyxZQUFZLENBQUM7YUFDckIsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUMxQjtLQUNGOzs7WUE3Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsUUFBUSxFQUFFLGdFQUFnRTtvQkFDdEUsa0hBQWtIO29CQUNsSCxnQkFBZ0I7O2dCQUNwQixNQUFNLEVBQUUsQ0FBQzs7OztHQUlSLENBQUM7YUFDSDs7OzZCQU9FLEtBQUs7cUJBS0wsS0FBSzttQkFLTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7cmVnRXhwRXNjYXBlLCB0b1N0cmluZ30gZnJvbSAnLi4vdXRpbC91dGlsJztcblxuLyoqXG4gKiBBIGNvbXBvbmVudCB0aGF0IGNhbiBiZSB1c2VkIGluc2lkZSBhIGN1c3RvbSByZXN1bHQgdGVtcGxhdGUgaW4gb3JkZXIgdG8gaGlnaGxpZ2h0IHRoZSB0ZXJtIGluc2lkZSB0aGUgdGV4dCBvZiB0aGVcbiAqIHJlc3VsdFxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItaGlnaGxpZ2h0JyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgPG5nLXRlbXBsYXRlIG5nRm9yIFtuZ0Zvck9mXT1cInBhcnRzXCIgbGV0LXBhcnQgbGV0LWlzT2RkPVwib2RkXCI+YCArXG4gICAgICBgPHNwYW4gKm5nSWY9XCJpc09kZDsgZWxzZSBldmVuXCIgW2NsYXNzXT1cImhpZ2hsaWdodENsYXNzXCI+e3twYXJ0fX08L3NwYW4+PG5nLXRlbXBsYXRlICNldmVuPnt7cGFydH19PC9uZy10ZW1wbGF0ZT5gICtcbiAgICAgIGA8L25nLXRlbXBsYXRlPmAsICAvLyB0ZW1wbGF0ZSBuZWVkcyB0byBiZSBmb3JtYXR0ZWQgaW4gYSBjZXJ0YWluIHdheSBzbyB3ZSBkb24ndCBhZGQgZW1wdHkgdGV4dCBub2Rlc1xuICBzdHlsZXM6IFtgXG4gICAgLm5nYi1oaWdobGlnaHQge1xuICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgfVxuICBgXVxufSlcbmV4cG9ydCBjbGFzcyBOZ2JIaWdobGlnaHQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBwYXJ0czogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBDU1MgY2xhc3Mgb2YgdGhlIHNwYW4gZWxlbWVudHMgd3JhcHBpbmcgdGhlIHRlcm0gaW5zaWRlIHRoZSByZXN1bHRcbiAgICovXG4gIEBJbnB1dCgpIGhpZ2hsaWdodENsYXNzID0gJ25nYi1oaWdobGlnaHQnO1xuXG4gIC8qKlxuICAgKiBUaGUgcmVzdWx0IHRleHQgdG8gZGlzcGxheS4gSWYgdGhlIHRlcm0gaXMgZm91bmQgaW5zaWRlIHRoaXMgdGV4dCwgaXQncyBoaWdobGlnaHRlZFxuICAgKi9cbiAgQElucHV0KCkgcmVzdWx0OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBzZWFyY2hlZCB0ZXJtXG4gICAqL1xuICBASW5wdXQoKSB0ZXJtOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGNvbnN0IHJlc3VsdFN0ciA9IHRvU3RyaW5nKHRoaXMucmVzdWx0KTtcbiAgICBjb25zdCByZXN1bHRMQyA9IHJlc3VsdFN0ci50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IHRlcm1MQyA9IHRvU3RyaW5nKHRoaXMudGVybSkudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgY3VycmVudElkeCA9IDA7XG5cbiAgICBpZiAodGVybUxDLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMucGFydHMgPSByZXN1bHRMQy5zcGxpdChuZXcgUmVnRXhwKGAoJHtyZWdFeHBFc2NhcGUodGVybUxDKX0pYCkpLm1hcCgocGFydCkgPT4ge1xuICAgICAgICBjb25zdCBvcmlnaW5hbFBhcnQgPSByZXN1bHRTdHIuc3Vic3RyKGN1cnJlbnRJZHgsIHBhcnQubGVuZ3RoKTtcbiAgICAgICAgY3VycmVudElkeCArPSBwYXJ0Lmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsUGFydDtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhcnRzID0gW3Jlc3VsdFN0cl07XG4gICAgfVxuICB9XG59XG4iXX0=