/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Input, Component, HostBinding } from '@angular/core';
import { icon, parse } from '@fortawesome/fontawesome-svg-core';
import { DomSanitizer } from '@angular/platform-browser';
import { faNormalizeIconSpec } from '../shared/utils/normalize-icon-spec.util';
import { objectWithKey } from '../shared/utils/object-with-keys.util';
import { faClassList } from '../shared/utils/classlist.util';
import { faWarnIfIconHtmlMissing } from '../shared/errors/warn-if-icon-html-missing';
import { faWarnIfIconSpecMissing } from '../shared/errors/warn-if-icon-spec-missing';
import { faNotFoundIconHtml } from '../shared/errors/not-found-icon-html';
import { FaIconService } from './icon.service';
/**
 * Fontawesome icon.
 */
export class FaIconComponent {
    /**
     * @param {?} sanitizer
     * @param {?} iconService
     */
    constructor(sanitizer, iconService) {
        this.sanitizer = sanitizer;
        this.iconService = iconService;
        this.classes = [];
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes) {
            this.updateIconSpec();
            this.updateParams();
            this.updateIcon();
            this.renderIcon();
        }
    }
    /**
     * Updating icon spec.
     * @return {?}
     */
    updateIconSpec() {
        this.iconSpec = faNormalizeIconSpec(this.iconProp, this.iconService.defaultPrefix);
    }
    /**
     * Updating params by component props.
     * @return {?}
     */
    updateParams() {
        /** @type {?} */
        const classOpts = {
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
        const classes = objectWithKey('classes', [...faClassList(classOpts), ...this.classes]);
        /** @type {?} */
        const mask = objectWithKey('mask', faNormalizeIconSpec(this.mask, this.iconService.defaultPrefix));
        /** @type {?} */
        const parsedTransform = typeof this.transform === 'string' ? parse.transform(this.transform) : this.transform;
        /** @type {?} */
        const transform = objectWithKey('transform', parsedTransform);
        this.params = Object.assign({ title: this.title }, transform, classes, mask, { styles: this.styles, symbol: this.symbol });
    }
    /**
     * Updating icon by params and icon spec.
     * @return {?}
     */
    updateIcon() {
        this.icon = icon(this.iconSpec, this.params);
    }
    /**
     * Rendering icon.
     * @return {?}
     */
    renderIcon() {
        faWarnIfIconSpecMissing(this.iconSpec);
        faWarnIfIconHtmlMissing(this.icon, this.iconSpec);
        this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(this.icon ? this.icon.html.join('\n') : faNotFoundIconHtml);
    }
}
FaIconComponent.decorators = [
    { type: Component, args: [{
                selector: 'fa-icon',
                template: ``,
                host: {
                    class: 'ng-fa-icon',
                }
            }] }
];
/** @nocollapse */
FaIconComponent.ctorParameters = () => [
    { type: DomSanitizer },
    { type: FaIconService }
];
FaIconComponent.propDecorators = {
    iconProp: [{ type: Input, args: ['icon',] }],
    title: [{ type: Input }],
    spin: [{ type: Input }],
    pulse: [{ type: Input }],
    mask: [{ type: Input }],
    styles: [{ type: Input }],
    flip: [{ type: Input }],
    size: [{ type: Input }],
    pull: [{ type: Input }],
    border: [{ type: Input }],
    inverse: [{ type: Input }],
    symbol: [{ type: Input }],
    listItem: [{ type: Input }],
    rotate: [{ type: Input }],
    fixedWidth: [{ type: Input }],
    classes: [{ type: Input }],
    transform: [{ type: Input }],
    renderedIconHTML: [{ type: HostBinding, args: ['innerHTML',] }]
};
if (false) {
    /** @type {?} */
    FaIconComponent.prototype.iconProp;
    /** @type {?} */
    FaIconComponent.prototype.title;
    /** @type {?} */
    FaIconComponent.prototype.spin;
    /** @type {?} */
    FaIconComponent.prototype.pulse;
    /** @type {?} */
    FaIconComponent.prototype.mask;
    /** @type {?} */
    FaIconComponent.prototype.styles;
    /** @type {?} */
    FaIconComponent.prototype.flip;
    /** @type {?} */
    FaIconComponent.prototype.size;
    /** @type {?} */
    FaIconComponent.prototype.pull;
    /** @type {?} */
    FaIconComponent.prototype.border;
    /** @type {?} */
    FaIconComponent.prototype.inverse;
    /** @type {?} */
    FaIconComponent.prototype.symbol;
    /** @type {?} */
    FaIconComponent.prototype.listItem;
    /** @type {?} */
    FaIconComponent.prototype.rotate;
    /** @type {?} */
    FaIconComponent.prototype.fixedWidth;
    /** @type {?} */
    FaIconComponent.prototype.classes;
    /** @type {?} */
    FaIconComponent.prototype.transform;
    /** @type {?} */
    FaIconComponent.prototype.icon;
    /** @type {?} */
    FaIconComponent.prototype.renderedIconHTML;
    /** @type {?} */
    FaIconComponent.prototype.params;
    /** @type {?} */
    FaIconComponent.prototype.iconSpec;
    /** @type {?} */
    FaIconComponent.prototype.sanitizer;
    /** @type {?} */
    FaIconComponent.prototype.iconService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS8iLCJzb3VyY2VzIjpbImljb24vaWNvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFDTCxLQUFLLEVBRUwsU0FBUyxFQUNULFdBQVcsRUFFWixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsSUFBSSxFQUVKLEtBQUssRUFXTixNQUFNLG1DQUFtQyxDQUFDO0FBQzNDLE9BQU8sRUFBRSxZQUFZLEVBQVksTUFBTSwyQkFBMkIsQ0FBQztBQUVuRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUUvRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDdEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQzdELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDRDQUE0QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQzFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQVkvQyxNQUFNOzs7OztJQXlCSixZQUFvQixTQUF1QixFQUFVLFdBQTBCO1FBQTNELGNBQVMsR0FBVCxTQUFTLENBQWM7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBZTt1QkFSakQsRUFBRTtLQVFtRDs7Ozs7SUFLbkYsV0FBVyxDQUFDLE9BQXNCO1FBQ2hDLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDbEIsSUFBSSxDQUFDLFVBQVUs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QUNMLEtBQUs7d0JBQ0wsS0FBSzsrQkFJTCxXQUFXLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIENvbXBvbmVudCxcbiAgSG9zdEJpbmRpbmcsXG4gIFNpbXBsZUNoYW5nZXNcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBpY29uLFxuICBJY29uLFxuICBwYXJzZSxcbiAgU3R5bGVzLFxuICBQdWxsUHJvcCxcbiAgSWNvblByb3AsXG4gIFNpemVQcm9wLFxuICBGbGlwUHJvcCxcbiAgRmFTeW1ib2wsXG4gIFRyYW5zZm9ybSxcbiAgSWNvblBhcmFtcyxcbiAgSWNvbkxvb2t1cCxcbiAgUm90YXRlUHJvcFxufSBmcm9tICdAZm9ydGF3ZXNvbWUvZm9udGF3ZXNvbWUtc3ZnLWNvcmUnO1xuaW1wb3J0IHsgRG9tU2FuaXRpemVyLCBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuXG5pbXBvcnQgeyBmYU5vcm1hbGl6ZUljb25TcGVjIH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL25vcm1hbGl6ZS1pY29uLXNwZWMudXRpbCc7XG5pbXBvcnQgeyBGYVByb3BzIH0gZnJvbSAnLi4vc2hhcmVkL21vZGVscy9wcm9wcy5tb2RlbCc7XG5pbXBvcnQgeyBvYmplY3RXaXRoS2V5IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL29iamVjdC13aXRoLWtleXMudXRpbCc7XG5pbXBvcnQgeyBmYUNsYXNzTGlzdCB9IGZyb20gJy4uL3NoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbCc7XG5pbXBvcnQgeyBmYVdhcm5JZkljb25IdG1sTWlzc2luZyB9IGZyb20gJy4uL3NoYXJlZC9lcnJvcnMvd2Fybi1pZi1pY29uLWh0bWwtbWlzc2luZyc7XG5pbXBvcnQgeyBmYVdhcm5JZkljb25TcGVjTWlzc2luZyB9IGZyb20gJy4uL3NoYXJlZC9lcnJvcnMvd2Fybi1pZi1pY29uLXNwZWMtbWlzc2luZyc7XG5pbXBvcnQgeyBmYU5vdEZvdW5kSWNvbkh0bWwgfSBmcm9tICcuLi9zaGFyZWQvZXJyb3JzL25vdC1mb3VuZC1pY29uLWh0bWwnO1xuaW1wb3J0IHsgRmFJY29uU2VydmljZSB9IGZyb20gJy4vaWNvbi5zZXJ2aWNlJztcblxuLyoqXG4gKiBGb250YXdlc29tZSBpY29uLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdmYS1pY29uJyxcbiAgdGVtcGxhdGU6IGBgLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICduZy1mYS1pY29uJyxcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBGYUljb25Db21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8taW5wdXQtcmVuYW1lXG4gIEBJbnB1dCgnaWNvbicpIGljb25Qcm9wOiBJY29uUHJvcDtcbiAgQElucHV0KCkgdGl0bGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHNwaW4/OiBib29sZWFuO1xuICBASW5wdXQoKSBwdWxzZT86IGJvb2xlYW47XG4gIEBJbnB1dCgpIG1hc2s/OiBJY29uUHJvcDtcbiAgQElucHV0KCkgc3R5bGVzPzogU3R5bGVzO1xuICBASW5wdXQoKSBmbGlwPzogRmxpcFByb3A7XG4gIEBJbnB1dCgpIHNpemU/OiBTaXplUHJvcDtcbiAgQElucHV0KCkgcHVsbD86IFB1bGxQcm9wO1xuICBASW5wdXQoKSBib3JkZXI/OiBib29sZWFuO1xuICBASW5wdXQoKSBpbnZlcnNlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgc3ltYm9sPzogRmFTeW1ib2w7XG4gIEBJbnB1dCgpIGxpc3RJdGVtPzogYm9vbGVhbjtcbiAgQElucHV0KCkgcm90YXRlPzogUm90YXRlUHJvcDtcbiAgQElucHV0KCkgZml4ZWRXaWR0aD86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGNsYXNzZXM/OiBzdHJpbmdbXSA9IFtdO1xuICBASW5wdXQoKSB0cmFuc2Zvcm0/OiBzdHJpbmcgfCBUcmFuc2Zvcm07XG5cbiAgcHVibGljIGljb246IEljb247XG5cbiAgQEhvc3RCaW5kaW5nKCdpbm5lckhUTUwnKVxuICBwdWJsaWMgcmVuZGVyZWRJY29uSFRNTDogU2FmZUh0bWw7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzYW5pdGl6ZXI6IERvbVNhbml0aXplciwgcHJpdmF0ZSBpY29uU2VydmljZTogRmFJY29uU2VydmljZSkge31cblxuICBwcml2YXRlIHBhcmFtczogSWNvblBhcmFtcztcbiAgcHJpdmF0ZSBpY29uU3BlYzogSWNvbkxvb2t1cDtcblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMpIHtcbiAgICAgIHRoaXMudXBkYXRlSWNvblNwZWMoKTtcbiAgICAgIHRoaXMudXBkYXRlUGFyYW1zKCk7XG4gICAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICAgIHRoaXMucmVuZGVySWNvbigpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBpY29uIHNwZWMuXG4gICAqL1xuICBwcml2YXRlIHVwZGF0ZUljb25TcGVjKCkge1xuICAgIHRoaXMuaWNvblNwZWMgPSBmYU5vcm1hbGl6ZUljb25TcGVjKHRoaXMuaWNvblByb3AsIHRoaXMuaWNvblNlcnZpY2UuZGVmYXVsdFByZWZpeCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgcGFyYW1zIGJ5IGNvbXBvbmVudCBwcm9wcy5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlUGFyYW1zKCkge1xuICAgIGNvbnN0IGNsYXNzT3B0czogRmFQcm9wcyA9IHtcbiAgICAgIGZsaXA6IHRoaXMuZmxpcCxcbiAgICAgIHNwaW46IHRoaXMuc3BpbixcbiAgICAgIHB1bHNlOiB0aGlzLnB1bHNlLFxuICAgICAgYm9yZGVyOiB0aGlzLmJvcmRlcixcbiAgICAgIGludmVyc2U6IHRoaXMuaW52ZXJzZSxcbiAgICAgIGxpc3RJdGVtOiB0aGlzLmxpc3RJdGVtLFxuICAgICAgc2l6ZTogdGhpcy5zaXplIHx8IG51bGwsXG4gICAgICBwdWxsOiB0aGlzLnB1bGwgfHwgbnVsbCxcbiAgICAgIHJvdGF0ZTogdGhpcy5yb3RhdGUgfHwgbnVsbCxcbiAgICAgIGZpeGVkV2lkdGg6IHRoaXMuZml4ZWRXaWR0aFxuICAgIH07XG5cbiAgICBjb25zdCBjbGFzc2VzID0gb2JqZWN0V2l0aEtleSgnY2xhc3NlcycsIFsuLi5mYUNsYXNzTGlzdChjbGFzc09wdHMpLCAuLi50aGlzLmNsYXNzZXNdKTtcbiAgICBjb25zdCBtYXNrID0gb2JqZWN0V2l0aEtleSgnbWFzaycsIGZhTm9ybWFsaXplSWNvblNwZWModGhpcy5tYXNrLCB0aGlzLmljb25TZXJ2aWNlLmRlZmF1bHRQcmVmaXgpKTtcbiAgICBjb25zdCBwYXJzZWRUcmFuc2Zvcm0gPSB0eXBlb2YgdGhpcy50cmFuc2Zvcm0gPT09ICdzdHJpbmcnID8gcGFyc2UudHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtKSA6IHRoaXMudHJhbnNmb3JtO1xuICAgIGNvbnN0IHRyYW5zZm9ybSA9IG9iamVjdFdpdGhLZXkoJ3RyYW5zZm9ybScsIHBhcnNlZFRyYW5zZm9ybSk7XG5cbiAgICB0aGlzLnBhcmFtcyA9IHtcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxuICAgICAgLi4udHJhbnNmb3JtLFxuICAgICAgLi4uY2xhc3NlcyxcbiAgICAgIC4uLm1hc2ssXG4gICAgICBzdHlsZXM6IHRoaXMuc3R5bGVzLFxuICAgICAgc3ltYm9sOiB0aGlzLnN5bWJvbFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRpbmcgaWNvbiBieSBwYXJhbXMgYW5kIGljb24gc3BlYy5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSWNvbigpIHtcbiAgICB0aGlzLmljb24gPSBpY29uKHRoaXMuaWNvblNwZWMsIHRoaXMucGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXJpbmcgaWNvbi5cbiAgICovXG4gIHByaXZhdGUgcmVuZGVySWNvbigpIHtcbiAgICBmYVdhcm5JZkljb25TcGVjTWlzc2luZyh0aGlzLmljb25TcGVjKTtcbiAgICBmYVdhcm5JZkljb25IdG1sTWlzc2luZyh0aGlzLmljb24sIHRoaXMuaWNvblNwZWMpO1xuXG4gICAgdGhpcy5yZW5kZXJlZEljb25IVE1MID0gdGhpcy5zYW5pdGl6ZXIuYnlwYXNzU2VjdXJpdHlUcnVzdEh0bWwoXG4gICAgICB0aGlzLmljb24gPyB0aGlzLmljb24uaHRtbC5qb2luKCdcXG4nKSA6IGZhTm90Rm91bmRJY29uSHRtbFxuICAgICk7XG4gIH1cbn1cblxuIl19