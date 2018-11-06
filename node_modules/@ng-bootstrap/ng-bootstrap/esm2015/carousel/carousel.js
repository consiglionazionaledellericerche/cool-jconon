/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, EventEmitter, Inject, Input, NgZone, Output, PLATFORM_ID, QueryList, TemplateRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbCarouselConfig } from './carousel-config';
import { Subject, timer } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
/** @type {?} */
let nextId = 0;
/**
 * Represents an individual slide to be used within a carousel.
 */
export class NgbSlide {
    /**
     * @param {?} tplRef
     */
    constructor(tplRef) {
        this.tplRef = tplRef;
        /**
         * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
         * Will be auto-generated if not provided.
         */
        this.id = `ngb-slide-${nextId++}`;
    }
}
NgbSlide.decorators = [
    { type: Directive, args: [{ selector: 'ng-template[ngbSlide]' },] },
];
/** @nocollapse */
NgbSlide.ctorParameters = () => [
    { type: TemplateRef }
];
NgbSlide.propDecorators = {
    id: [{ type: Input }]
};
if (false) {
    /**
     * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
     * Will be auto-generated if not provided.
     * @type {?}
     */
    NgbSlide.prototype.id;
    /** @type {?} */
    NgbSlide.prototype.tplRef;
}
/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
export class NgbCarousel {
    /**
     * @param {?} config
     * @param {?} _platformId
     * @param {?} _ngZone
     * @param {?} _cd
     */
    constructor(config, _platformId, _ngZone, _cd) {
        this._platformId = _platformId;
        this._ngZone = _ngZone;
        this._cd = _cd;
        this._start$ = new Subject();
        this._stop$ = new Subject();
        /**
         * A carousel slide event fired when the slide transition is completed.
         * See NgbSlideEvent for payload details
         */
        this.slide = new EventEmitter();
        this.interval = config.interval;
        this.wrap = config.wrap;
        this.keyboard = config.keyboard;
        this.pauseOnHover = config.pauseOnHover;
        this.showNavigationArrows = config.showNavigationArrows;
        this.showNavigationIndicators = config.showNavigationIndicators;
    }
    /**
     * @return {?}
     */
    ngAfterContentInit() {
        // setInterval() doesn't play well with SSR and protractor,
        // so we should run it in the browser and outside Angular
        if (isPlatformBrowser(this._platformId)) {
            this._ngZone.runOutsideAngular(() => {
                this._start$
                    .pipe(map(() => this.interval), filter(interval => interval > 0), switchMap(interval => timer(interval).pipe(takeUntil(this._stop$))))
                    .subscribe(() => this._ngZone.run(() => {
                    this.next();
                    this._cd.detectChanges();
                }));
                this._start$.next();
            });
        }
    }
    /**
     * @return {?}
     */
    ngAfterContentChecked() {
        /** @type {?} */
        let activeSlide = this._getSlideById(this.activeId);
        this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() { this._stop$.next(); }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if ('interval' in changes && !changes['interval'].isFirstChange()) {
            this._start$.next();
        }
    }
    /**
     * Navigate to a slide with the specified identifier.
     * @param {?} slideId
     * @return {?}
     */
    select(slideId) { this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId)); }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    prev() { this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); }
    /**
     * Navigate to the next slide.
     * @return {?}
     */
    next() { this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); }
    /**
     * Stops the carousel from cycling through items.
     * @return {?}
     */
    pause() { this._stop$.next(); }
    /**
     * Restarts cycling through the carousel slides from left to right.
     * @return {?}
     */
    cycle() { this._start$.next(); }
    /**
     * @param {?} slideIdx
     * @param {?} direction
     * @return {?}
     */
    _cycleToSelected(slideIdx, direction) {
        /** @type {?} */
        let selectedSlide = this._getSlideById(slideIdx);
        if (selectedSlide && selectedSlide.id !== this.activeId) {
            this.slide.emit({ prev: this.activeId, current: selectedSlide.id, direction: direction });
            this._start$.next();
            this.activeId = selectedSlide.id;
        }
    }
    /**
     * @param {?} currentActiveSlideId
     * @param {?} nextActiveSlideId
     * @return {?}
     */
    _getSlideEventDirection(currentActiveSlideId, nextActiveSlideId) {
        /** @type {?} */
        const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
        /** @type {?} */
        const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);
        return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
    }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideById(slideId) { return this.slides.find(slide => slide.id === slideId); }
    /**
     * @param {?} slideId
     * @return {?}
     */
    _getSlideIdxById(slideId) {
        return this.slides.toArray().indexOf(this._getSlideById(slideId));
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getNextSlide(currentSlideId) {
        /** @type {?} */
        const slideArr = this.slides.toArray();
        /** @type {?} */
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        const isLastSlide = currentSlideIdx === slideArr.length - 1;
        return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
            slideArr[currentSlideIdx + 1].id;
    }
    /**
     * @param {?} currentSlideId
     * @return {?}
     */
    _getPrevSlide(currentSlideId) {
        /** @type {?} */
        const slideArr = this.slides.toArray();
        /** @type {?} */
        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
        /** @type {?} */
        const isFirstSlide = currentSlideIdx === 0;
        return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
            slideArr[currentSlideIdx - 1].id;
    }
}
NgbCarousel.decorators = [
    { type: Component, args: [{
                selector: 'ngb-carousel',
                exportAs: 'ngbCarousel',
                changeDetection: ChangeDetectionStrategy.OnPush,
                host: {
                    'class': 'carousel slide',
                    '[style.display]': '"block"',
                    'tabIndex': '0',
                    '(mouseenter)': 'pauseOnHover && pause()',
                    '(mouseleave)': 'pauseOnHover && cycle()',
                    '(keydown.arrowLeft)': 'keyboard && prev()',
                    '(keydown.arrowRight)': 'keyboard && next()'
                },
                template: `
    <ol class="carousel-indicators" *ngIf="showNavigationIndicators">
      <li *ngFor="let slide of slides" [id]="slide.id" [class.active]="slide.id === activeId"
          (click)="select(slide.id); pauseOnHover && pause()"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <a class="carousel-control-prev" role="button" (click)="prev()" *ngIf="showNavigationArrows">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.previous">Previous</span>
    </a>
    <a class="carousel-control-next" role="button" (click)="next()" *ngIf="showNavigationArrows">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.next">Next</span>
    </a>
  `
            },] },
];
/** @nocollapse */
NgbCarousel.ctorParameters = () => [
    { type: NgbCarouselConfig },
    { type: undefined, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
NgbCarousel.propDecorators = {
    slides: [{ type: ContentChildren, args: [NgbSlide,] }],
    activeId: [{ type: Input }],
    interval: [{ type: Input }],
    wrap: [{ type: Input }],
    keyboard: [{ type: Input }],
    pauseOnHover: [{ type: Input }],
    showNavigationArrows: [{ type: Input }],
    showNavigationIndicators: [{ type: Input }],
    slide: [{ type: Output }]
};
if (false) {
    /** @type {?} */
    NgbCarousel.prototype.slides;
    /** @type {?} */
    NgbCarousel.prototype._start$;
    /** @type {?} */
    NgbCarousel.prototype._stop$;
    /**
     * The active slide id.
     * @type {?}
     */
    NgbCarousel.prototype.activeId;
    /**
     * Amount of time in milliseconds before next slide is shown.
     * @type {?}
     */
    NgbCarousel.prototype.interval;
    /**
     * Whether can wrap from the last to the first slide.
     * @type {?}
     */
    NgbCarousel.prototype.wrap;
    /**
     * A flag for allowing navigation via keyboard
     * @type {?}
     */
    NgbCarousel.prototype.keyboard;
    /**
     * A flag to enable slide cycling pause/resume on mouseover.
     * \@since 2.2.0
     * @type {?}
     */
    NgbCarousel.prototype.pauseOnHover;
    /**
     * A flag to show / hide navigation arrows.
     * \@since 2.2.0
     * @type {?}
     */
    NgbCarousel.prototype.showNavigationArrows;
    /**
     * A flag to show / hide navigation indicators.
     * \@since 2.2.0
     * @type {?}
     */
    NgbCarousel.prototype.showNavigationIndicators;
    /**
     * A carousel slide event fired when the slide transition is completed.
     * See NgbSlideEvent for payload details
     * @type {?}
     */
    NgbCarousel.prototype.slide;
    /** @type {?} */
    NgbCarousel.prototype._platformId;
    /** @type {?} */
    NgbCarousel.prototype._ngZone;
    /** @type {?} */
    NgbCarousel.prototype._cd;
}
/**
 * The payload of the slide event fired when the slide transition is completed
 * @record
 */
export function NgbSlideEvent() { }
/**
 * Previous slide id
 * @type {?}
 */
NgbSlideEvent.prototype.prev;
/**
 * New slide ids
 * @type {?}
 */
NgbSlideEvent.prototype.current;
/**
 * Slide event direction
 * @type {?}
 */
NgbSlideEvent.prototype.direction;
/** @enum {string} */
var NgbSlideEventDirection = {
    LEFT: /** @type {?} */ ('left'),
    RIGHT: /** @type {?} */ ('right'),
};
export { NgbSlideEventDirection };
/** @type {?} */
export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC8iLCJzb3VyY2VzIjpbImNhcm91c2VsL2Nhcm91c2VsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFNBQVMsRUFDVCxZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04sTUFBTSxFQUNOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsV0FBVyxFQUNaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRWxELE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELE9BQU8sRUFBQyxPQUFPLEVBQUUsS0FBSyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7QUFFakUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDOzs7O0FBTWYsTUFBTTs7OztJQU1KLFlBQW1CLE1BQXdCO1FBQXhCLFdBQU0sR0FBTixNQUFNLENBQWtCOzs7OztrQkFEN0IsYUFBYSxNQUFNLEVBQUUsRUFBRTtLQUNVOzs7WUFQaEQsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLHVCQUF1QixFQUFDOzs7O1lBZDVDLFdBQVc7OztpQkFvQlYsS0FBSzs7Ozs7Ozs7Ozs7Ozs7O0FBd0NSLE1BQU07Ozs7Ozs7SUFvREosWUFDSSxNQUF5QixFQUErQixXQUFXLEVBQVUsT0FBZSxFQUNwRjtRQURnRCxnQkFBVyxHQUFYLFdBQVcsQ0FBQTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDcEYsUUFBRyxHQUFILEdBQUc7dUJBbERHLElBQUksT0FBTyxFQUFRO3NCQUNw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QUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pFLFFBQVEsQ0FBQyxlQUFlLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOzs7O1lBOUwxRCxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFFBQVEsRUFBRSxhQUFhO2dCQUN2QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsSUFBSSxFQUFFO29CQUNKLE9BQU8sRUFBRSxnQkFBZ0I7b0JBQ3pCLGlCQUFpQixFQUFFLFNBQVM7b0JBQzVCLFVBQVUsRUFBRSxHQUFHO29CQUNmLGNBQWMsRUFBRSx5QkFBeUI7b0JBQ3pDLGNBQWMsRUFBRSx5QkFBeUI7b0JBQ3pDLHFCQUFxQixFQUFFLG9CQUFvQjtvQkFDM0Msc0JBQXNCLEVBQUUsb0JBQW9CO2lCQUM3QztnQkFDRCxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCVDthQUNGOzs7O1lBdkRPLGlCQUFpQjs0Q0E2R1MsTUFBTSxTQUFDLFdBQVc7WUF2SGxELE1BQU07WUFQTixpQkFBaUI7OztxQkEyRWhCLGVBQWUsU0FBQyxRQUFRO3VCQVF4QixLQUFLO3VCQU1MLEtBQUs7bUJBS0wsS0FBSzt1QkFLTCxLQUFLOzJCQU1MLEtBQUs7bUNBTUwsS0FBSzt1Q0FNTCxLQUFLO29CQU1MLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF1SVAsd0JBQVksTUFBTSxDQUFBO0lBQ2xCLHlCQUFhLE9BQU8sQ0FBQTs7OztBQUd0QixhQUFhLHVCQUF1QixHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUExBVEZPUk1fSUQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2lzUGxhdGZvcm1Ccm93c2VyfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge05nYkNhcm91c2VsQ29uZmlnfSBmcm9tICcuL2Nhcm91c2VsLWNvbmZpZyc7XG5cbmltcG9ydCB7U3ViamVjdCwgdGltZXJ9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtmaWx0ZXIsIG1hcCwgc3dpdGNoTWFwLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxubGV0IG5leHRJZCA9IDA7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBpbmRpdmlkdWFsIHNsaWRlIHRvIGJlIHVzZWQgd2l0aGluIGEgY2Fyb3VzZWwuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiU2xpZGVdJ30pXG5leHBvcnQgY2xhc3MgTmdiU2xpZGUge1xuICAvKipcbiAgICogVW5pcXVlIHNsaWRlIGlkZW50aWZpZXIuIE11c3QgYmUgdW5pcXVlIGZvciB0aGUgZW50aXJlIGRvY3VtZW50IGZvciBwcm9wZXIgYWNjZXNzaWJpbGl0eSBzdXBwb3J0LlxuICAgKiBXaWxsIGJlIGF1dG8tZ2VuZXJhdGVkIGlmIG5vdCBwcm92aWRlZC5cbiAgICovXG4gIEBJbnB1dCgpIGlkID0gYG5nYi1zbGlkZS0ke25leHRJZCsrfWA7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0cGxSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogRGlyZWN0aXZlIHRvIGVhc2lseSBjcmVhdGUgY2Fyb3VzZWxzIGJhc2VkIG9uIEJvb3RzdHJhcCdzIG1hcmt1cC5cbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbmdiLWNhcm91c2VsJyxcbiAgZXhwb3J0QXM6ICduZ2JDYXJvdXNlbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ2Nhcm91c2VsIHNsaWRlJyxcbiAgICAnW3N0eWxlLmRpc3BsYXldJzogJ1wiYmxvY2tcIicsXG4gICAgJ3RhYkluZGV4JzogJzAnLFxuICAgICcobW91c2VlbnRlciknOiAncGF1c2VPbkhvdmVyICYmIHBhdXNlKCknLFxuICAgICcobW91c2VsZWF2ZSknOiAncGF1c2VPbkhvdmVyICYmIGN5Y2xlKCknLFxuICAgICcoa2V5ZG93bi5hcnJvd0xlZnQpJzogJ2tleWJvYXJkICYmIHByZXYoKScsXG4gICAgJyhrZXlkb3duLmFycm93UmlnaHQpJzogJ2tleWJvYXJkICYmIG5leHQoKSdcbiAgfSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8b2wgY2xhc3M9XCJjYXJvdXNlbC1pbmRpY2F0b3JzXCIgKm5nSWY9XCJzaG93TmF2aWdhdGlvbkluZGljYXRvcnNcIj5cbiAgICAgIDxsaSAqbmdGb3I9XCJsZXQgc2xpZGUgb2Ygc2xpZGVzXCIgW2lkXT1cInNsaWRlLmlkXCIgW2NsYXNzLmFjdGl2ZV09XCJzbGlkZS5pZCA9PT0gYWN0aXZlSWRcIlxuICAgICAgICAgIChjbGljayk9XCJzZWxlY3Qoc2xpZGUuaWQpOyBwYXVzZU9uSG92ZXIgJiYgcGF1c2UoKVwiPjwvbGk+XG4gICAgPC9vbD5cbiAgICA8ZGl2IGNsYXNzPVwiY2Fyb3VzZWwtaW5uZXJcIj5cbiAgICAgIDxkaXYgKm5nRm9yPVwibGV0IHNsaWRlIG9mIHNsaWRlc1wiIGNsYXNzPVwiY2Fyb3VzZWwtaXRlbVwiIFtjbGFzcy5hY3RpdmVdPVwic2xpZGUuaWQgPT09IGFjdGl2ZUlkXCI+XG4gICAgICAgIDxuZy10ZW1wbGF0ZSBbbmdUZW1wbGF0ZU91dGxldF09XCJzbGlkZS50cGxSZWZcIj48L25nLXRlbXBsYXRlPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGEgY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLXByZXZcIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cInByZXYoKVwiICpuZ0lmPVwic2hvd05hdmlnYXRpb25BcnJvd3NcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1wcmV2LWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IuY2Fyb3VzZWwucHJldmlvdXNcIj5QcmV2aW91czwvc3Bhbj5cbiAgICA8L2E+XG4gICAgPGEgY2xhc3M9XCJjYXJvdXNlbC1jb250cm9sLW5leHRcIiByb2xlPVwiYnV0dG9uXCIgKGNsaWNrKT1cIm5leHQoKVwiICpuZ0lmPVwic2hvd05hdmlnYXRpb25BcnJvd3NcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY2Fyb3VzZWwtY29udHJvbC1uZXh0LWljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInNyLW9ubHlcIiBpMThuPVwiQEBuZ2IuY2Fyb3VzZWwubmV4dFwiPk5leHQ8L3NwYW4+XG4gICAgPC9hPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE5nYkNhcm91c2VsIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCxcbiAgICBBZnRlckNvbnRlbnRJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiU2xpZGUpIHNsaWRlczogUXVlcnlMaXN0PE5nYlNsaWRlPjtcblxuICBwcml2YXRlIF9zdGFydCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9zdG9wJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIFRoZSBhY3RpdmUgc2xpZGUgaWQuXG4gICAqL1xuICBASW5wdXQoKSBhY3RpdmVJZDogc3RyaW5nO1xuXG5cbiAgLyoqXG4gICAqIEFtb3VudCBvZiB0aW1lIGluIG1pbGxpc2Vjb25kcyBiZWZvcmUgbmV4dCBzbGlkZSBpcyBzaG93bi5cbiAgICovXG4gIEBJbnB1dCgpIGludGVydmFsOiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgY2FuIHdyYXAgZnJvbSB0aGUgbGFzdCB0byB0aGUgZmlyc3Qgc2xpZGUuXG4gICAqL1xuICBASW5wdXQoKSB3cmFwOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgZm9yIGFsbG93aW5nIG5hdmlnYXRpb24gdmlhIGtleWJvYXJkXG4gICAqL1xuICBASW5wdXQoKSBrZXlib2FyZDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQSBmbGFnIHRvIGVuYWJsZSBzbGlkZSBjeWNsaW5nIHBhdXNlL3Jlc3VtZSBvbiBtb3VzZW92ZXIuXG4gICAqIEBzaW5jZSAyLjIuMFxuICAgKi9cbiAgQElucHV0KCkgcGF1c2VPbkhvdmVyOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdG8gc2hvdyAvIGhpZGUgbmF2aWdhdGlvbiBhcnJvd3MuXG4gICAqIEBzaW5jZSAyLjIuMFxuICAgKi9cbiAgQElucHV0KCkgc2hvd05hdmlnYXRpb25BcnJvd3M6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEEgZmxhZyB0byBzaG93IC8gaGlkZSBuYXZpZ2F0aW9uIGluZGljYXRvcnMuXG4gICAqIEBzaW5jZSAyLjIuMFxuICAgKi9cbiAgQElucHV0KCkgc2hvd05hdmlnYXRpb25JbmRpY2F0b3JzOiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBIGNhcm91c2VsIHNsaWRlIGV2ZW50IGZpcmVkIHdoZW4gdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkLlxuICAgKiBTZWUgTmdiU2xpZGVFdmVudCBmb3IgcGF5bG9hZCBkZXRhaWxzXG4gICAqL1xuICBAT3V0cHV0KCkgc2xpZGUgPSBuZXcgRXZlbnRFbWl0dGVyPE5nYlNsaWRlRXZlbnQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBjb25maWc6IE5nYkNhcm91c2VsQ29uZmlnLCBASW5qZWN0KFBMQVRGT1JNX0lEKSBwcml2YXRlIF9wbGF0Zm9ybUlkLCBwcml2YXRlIF9uZ1pvbmU6IE5nWm9uZSxcbiAgICAgIHByaXZhdGUgX2NkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuaW50ZXJ2YWwgPSBjb25maWcuaW50ZXJ2YWw7XG4gICAgdGhpcy53cmFwID0gY29uZmlnLndyYXA7XG4gICAgdGhpcy5rZXlib2FyZCA9IGNvbmZpZy5rZXlib2FyZDtcbiAgICB0aGlzLnBhdXNlT25Ib3ZlciA9IGNvbmZpZy5wYXVzZU9uSG92ZXI7XG4gICAgdGhpcy5zaG93TmF2aWdhdGlvbkFycm93cyA9IGNvbmZpZy5zaG93TmF2aWdhdGlvbkFycm93cztcbiAgICB0aGlzLnNob3dOYXZpZ2F0aW9uSW5kaWNhdG9ycyA9IGNvbmZpZy5zaG93TmF2aWdhdGlvbkluZGljYXRvcnM7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgLy8gc2V0SW50ZXJ2YWwoKSBkb2Vzbid0IHBsYXkgd2VsbCB3aXRoIFNTUiBhbmQgcHJvdHJhY3RvcixcbiAgICAvLyBzbyB3ZSBzaG91bGQgcnVuIGl0IGluIHRoZSBicm93c2VyIGFuZCBvdXRzaWRlIEFuZ3VsYXJcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkpIHtcbiAgICAgIHRoaXMuX25nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXJ0JFxuICAgICAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICAgICAgbWFwKCgpID0+IHRoaXMuaW50ZXJ2YWwpLCBmaWx0ZXIoaW50ZXJ2YWwgPT4gaW50ZXJ2YWwgPiAwKSxcbiAgICAgICAgICAgICAgICBzd2l0Y2hNYXAoaW50ZXJ2YWwgPT4gdGltZXIoaW50ZXJ2YWwpLnBpcGUodGFrZVVudGlsKHRoaXMuX3N0b3AkKSkpKVxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgIHRoaXMuX2NkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLl9zdGFydCQubmV4dCgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIGxldCBhY3RpdmVTbGlkZSA9IHRoaXMuX2dldFNsaWRlQnlJZCh0aGlzLmFjdGl2ZUlkKTtcbiAgICB0aGlzLmFjdGl2ZUlkID0gYWN0aXZlU2xpZGUgPyBhY3RpdmVTbGlkZS5pZCA6ICh0aGlzLnNsaWRlcy5sZW5ndGggPyB0aGlzLnNsaWRlcy5maXJzdC5pZCA6IG51bGwpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7IHRoaXMuX3N0b3AkLm5leHQoKTsgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcbiAgICBpZiAoJ2ludGVydmFsJyBpbiBjaGFuZ2VzICYmICFjaGFuZ2VzWydpbnRlcnZhbCddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy5fc3RhcnQkLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTmF2aWdhdGUgdG8gYSBzbGlkZSB3aXRoIHRoZSBzcGVjaWZpZWQgaWRlbnRpZmllci5cbiAgICovXG4gIHNlbGVjdChzbGlkZUlkOiBzdHJpbmcpIHsgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHNsaWRlSWQsIHRoaXMuX2dldFNsaWRlRXZlbnREaXJlY3Rpb24odGhpcy5hY3RpdmVJZCwgc2xpZGVJZCkpOyB9XG5cbiAgLyoqXG4gICAqIE5hdmlnYXRlIHRvIHRoZSBuZXh0IHNsaWRlLlxuICAgKi9cbiAgcHJldigpIHsgdGhpcy5fY3ljbGVUb1NlbGVjdGVkKHRoaXMuX2dldFByZXZTbGlkZSh0aGlzLmFjdGl2ZUlkKSwgTmdiU2xpZGVFdmVudERpcmVjdGlvbi5SSUdIVCk7IH1cblxuICAvKipcbiAgICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc2xpZGUuXG4gICAqL1xuICBuZXh0KCkgeyB0aGlzLl9jeWNsZVRvU2VsZWN0ZWQodGhpcy5fZ2V0TmV4dFNsaWRlKHRoaXMuYWN0aXZlSWQpLCBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uLkxFRlQpOyB9XG5cbiAgLyoqXG4gICAqIFN0b3BzIHRoZSBjYXJvdXNlbCBmcm9tIGN5Y2xpbmcgdGhyb3VnaCBpdGVtcy5cbiAgICovXG4gIHBhdXNlKCkgeyB0aGlzLl9zdG9wJC5uZXh0KCk7IH1cblxuICAvKipcbiAgICogUmVzdGFydHMgY3ljbGluZyB0aHJvdWdoIHRoZSBjYXJvdXNlbCBzbGlkZXMgZnJvbSBsZWZ0IHRvIHJpZ2h0LlxuICAgKi9cbiAgY3ljbGUoKSB7IHRoaXMuX3N0YXJ0JC5uZXh0KCk7IH1cblxuICBwcml2YXRlIF9jeWNsZVRvU2VsZWN0ZWQoc2xpZGVJZHg6IHN0cmluZywgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uKSB7XG4gICAgbGV0IHNlbGVjdGVkU2xpZGUgPSB0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZHgpO1xuICAgIGlmIChzZWxlY3RlZFNsaWRlICYmIHNlbGVjdGVkU2xpZGUuaWQgIT09IHRoaXMuYWN0aXZlSWQpIHtcbiAgICAgIHRoaXMuc2xpZGUuZW1pdCh7cHJldjogdGhpcy5hY3RpdmVJZCwgY3VycmVudDogc2VsZWN0ZWRTbGlkZS5pZCwgZGlyZWN0aW9uOiBkaXJlY3Rpb259KTtcbiAgICAgIHRoaXMuX3N0YXJ0JC5uZXh0KCk7XG4gICAgICB0aGlzLmFjdGl2ZUlkID0gc2VsZWN0ZWRTbGlkZS5pZDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9nZXRTbGlkZUV2ZW50RGlyZWN0aW9uKGN1cnJlbnRBY3RpdmVTbGlkZUlkOiBzdHJpbmcsIG5leHRBY3RpdmVTbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uIHtcbiAgICBjb25zdCBjdXJyZW50QWN0aXZlU2xpZGVJZHggPSB0aGlzLl9nZXRTbGlkZUlkeEJ5SWQoY3VycmVudEFjdGl2ZVNsaWRlSWQpO1xuICAgIGNvbnN0IG5leHRBY3RpdmVTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChuZXh0QWN0aXZlU2xpZGVJZCk7XG5cbiAgICByZXR1cm4gY3VycmVudEFjdGl2ZVNsaWRlSWR4ID4gbmV4dEFjdGl2ZVNsaWRlSWR4ID8gTmdiU2xpZGVFdmVudERpcmVjdGlvbi5SSUdIVCA6IE5nYlNsaWRlRXZlbnREaXJlY3Rpb24uTEVGVDtcbiAgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlQnlJZChzbGlkZUlkOiBzdHJpbmcpOiBOZ2JTbGlkZSB7IHJldHVybiB0aGlzLnNsaWRlcy5maW5kKHNsaWRlID0+IHNsaWRlLmlkID09PSBzbGlkZUlkKTsgfVxuXG4gIHByaXZhdGUgX2dldFNsaWRlSWR4QnlJZChzbGlkZUlkOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLnNsaWRlcy50b0FycmF5KCkuaW5kZXhPZih0aGlzLl9nZXRTbGlkZUJ5SWQoc2xpZGVJZCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0TmV4dFNsaWRlKGN1cnJlbnRTbGlkZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG4gICAgY29uc3QgaXNMYXN0U2xpZGUgPSBjdXJyZW50U2xpZGVJZHggPT09IHNsaWRlQXJyLmxlbmd0aCAtIDE7XG5cbiAgICByZXR1cm4gaXNMYXN0U2xpZGUgPyAodGhpcy53cmFwID8gc2xpZGVBcnJbMF0uaWQgOiBzbGlkZUFycltzbGlkZUFyci5sZW5ndGggLSAxXS5pZCkgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlQXJyW2N1cnJlbnRTbGlkZUlkeCArIDFdLmlkO1xuICB9XG5cbiAgcHJpdmF0ZSBfZ2V0UHJldlNsaWRlKGN1cnJlbnRTbGlkZUlkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNsaWRlQXJyID0gdGhpcy5zbGlkZXMudG9BcnJheSgpO1xuICAgIGNvbnN0IGN1cnJlbnRTbGlkZUlkeCA9IHRoaXMuX2dldFNsaWRlSWR4QnlJZChjdXJyZW50U2xpZGVJZCk7XG4gICAgY29uc3QgaXNGaXJzdFNsaWRlID0gY3VycmVudFNsaWRlSWR4ID09PSAwO1xuXG4gICAgcmV0dXJuIGlzRmlyc3RTbGlkZSA/ICh0aGlzLndyYXAgPyBzbGlkZUFycltzbGlkZUFyci5sZW5ndGggLSAxXS5pZCA6IHNsaWRlQXJyWzBdLmlkKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlQXJyW2N1cnJlbnRTbGlkZUlkeCAtIDFdLmlkO1xuICB9XG59XG5cbi8qKlxuICogVGhlIHBheWxvYWQgb2YgdGhlIHNsaWRlIGV2ZW50IGZpcmVkIHdoZW4gdGhlIHNsaWRlIHRyYW5zaXRpb24gaXMgY29tcGxldGVkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiU2xpZGVFdmVudCB7XG4gIC8qKlxuICAgKiBQcmV2aW91cyBzbGlkZSBpZFxuICAgKi9cbiAgcHJldjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOZXcgc2xpZGUgaWRzXG4gICAqL1xuICBjdXJyZW50OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFNsaWRlIGV2ZW50IGRpcmVjdGlvblxuICAgKi9cbiAgZGlyZWN0aW9uOiBOZ2JTbGlkZUV2ZW50RGlyZWN0aW9uO1xufVxuXG4vKipcbiAqIEVudW0gdG8gZGVmaW5lIHRoZSBjYXJvdXNlbCBzbGlkZSBldmVudCBkaXJlY3Rpb25cbiAqL1xuZXhwb3J0IGVudW0gTmdiU2xpZGVFdmVudERpcmVjdGlvbiB7XG4gIExFRlQgPSA8YW55PidsZWZ0JyxcbiAgUklHSFQgPSA8YW55PidyaWdodCdcbn1cblxuZXhwb3J0IGNvbnN0IE5HQl9DQVJPVVNFTF9ESVJFQ1RJVkVTID0gW05nYkNhcm91c2VsLCBOZ2JTbGlkZV07XG4iXX0=