/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
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
var FaIconComponent = /** @class */ (function () {
    function FaIconComponent(sanitizer, iconService) {
        this.sanitizer = sanitizer;
        this.iconService = iconService;
        this.classes = [];
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    FaIconComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
        if (changes) {
            this.updateIconSpec();
            this.updateParams();
            this.updateIcon();
            this.renderIcon();
        }
    };
    /**
     * Updating icon spec.
     * @return {?}
     */
    FaIconComponent.prototype.updateIconSpec = /**
     * Updating icon spec.
     * @return {?}
     */
    function () {
        this.iconSpec = faNormalizeIconSpec(this.iconProp, this.iconService.defaultPrefix);
    };
    /**
     * Updating params by component props.
     * @return {?}
     */
    FaIconComponent.prototype.updateParams = /**
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
        var mask = objectWithKey('mask', faNormalizeIconSpec(this.mask, this.iconService.defaultPrefix));
        /** @type {?} */
        var parsedTransform = typeof this.transform === 'string' ? parse.transform(this.transform) : this.transform;
        /** @type {?} */
        var transform = objectWithKey('transform', parsedTransform);
        this.params = tslib_1.__assign({ title: this.title }, transform, classes, mask, { styles: this.styles, symbol: this.symbol });
    };
    /**
     * Updating icon by params and icon spec.
     * @return {?}
     */
    FaIconComponent.prototype.updateIcon = /**
     * Updating icon by params and icon spec.
     * @return {?}
     */
    function () {
        this.icon = icon(this.iconSpec, this.params);
    };
    /**
     * Rendering icon.
     * @return {?}
     */
    FaIconComponent.prototype.renderIcon = /**
     * Rendering icon.
     * @return {?}
     */
    function () {
        faWarnIfIconSpecMissing(this.iconSpec);
        faWarnIfIconHtmlMissing(this.icon, this.iconSpec);
        this.renderedIconHTML = this.sanitizer.bypassSecurityTrustHtml(this.icon ? this.icon.html.join('\n') : faNotFoundIconHtml);
    };
    FaIconComponent.decorators = [
        { type: Component, args: [{
                    selector: 'fa-icon',
                    template: "",
                    host: {
                        class: 'ng-fa-icon',
                    }
                }] }
    ];
    /** @nocollapse */
    FaIconComponent.ctorParameters = function () { return [
        { type: DomSanitizer },
        { type: FaIconService }
    ]; };
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
    return FaIconComponent;
}());
export { FaIconComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWNvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS8iLCJzb3VyY2VzIjpbImljb24vaWNvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQ0wsS0FBSyxFQUVMLFNBQVMsRUFDVCxXQUFXLEVBRVosTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUNMLElBQUksRUFFSixLQUFLLEVBV04sTUFBTSxtQ0FBbUMsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFbkUsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFFL0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM3RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNyRixPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUNyRixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUMxRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7O0lBcUM3Qyx5QkFBb0IsU0FBdUIsRUFBVSxXQUEwQjtRQUEzRCxjQUFTLEdBQVQsU0FBUyxDQUFjO1FBQVUsZ0JBQVcsR0FBWCxXQUFXLENBQWU7dUJBUmpELEVBQUU7S0FRbUQ7Ozs7O0lBS25GLHFDQUFXOzs7O0lBQVgsVUFBWSxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxVQUFVLEVB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MEJBQ0wsS0FBSzs0QkFDTCxLQUFLO21DQUlMLFdBQVcsU0FBQyxXQUFXOzswQkFqRTFCOztTQTJDYSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgQ29tcG9uZW50LFxuICBIb3N0QmluZGluZyxcbiAgU2ltcGxlQ2hhbmdlc1xufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7XG4gIGljb24sXG4gIEljb24sXG4gIHBhcnNlLFxuICBTdHlsZXMsXG4gIFB1bGxQcm9wLFxuICBJY29uUHJvcCxcbiAgU2l6ZVByb3AsXG4gIEZsaXBQcm9wLFxuICBGYVN5bWJvbCxcbiAgVHJhbnNmb3JtLFxuICBJY29uUGFyYW1zLFxuICBJY29uTG9va3VwLFxuICBSb3RhdGVQcm9wXG59IGZyb20gJ0Bmb3J0YXdlc29tZS9mb250YXdlc29tZS1zdmctY29yZSc7XG5pbXBvcnQgeyBEb21TYW5pdGl6ZXIsIFNhZmVIdG1sIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5cbmltcG9ydCB7IGZhTm9ybWFsaXplSWNvblNwZWMgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMvbm9ybWFsaXplLWljb24tc3BlYy51dGlsJztcbmltcG9ydCB7IEZhUHJvcHMgfSBmcm9tICcuLi9zaGFyZWQvbW9kZWxzL3Byb3BzLm1vZGVsJztcbmltcG9ydCB7IG9iamVjdFdpdGhLZXkgfSBmcm9tICcuLi9zaGFyZWQvdXRpbHMvb2JqZWN0LXdpdGgta2V5cy51dGlsJztcbmltcG9ydCB7IGZhQ2xhc3NMaXN0IH0gZnJvbSAnLi4vc2hhcmVkL3V0aWxzL2NsYXNzbGlzdC51dGlsJztcbmltcG9ydCB7IGZhV2FybklmSWNvbkh0bWxNaXNzaW5nIH0gZnJvbSAnLi4vc2hhcmVkL2Vycm9ycy93YXJuLWlmLWljb24taHRtbC1taXNzaW5nJztcbmltcG9ydCB7IGZhV2FybklmSWNvblNwZWNNaXNzaW5nIH0gZnJvbSAnLi4vc2hhcmVkL2Vycm9ycy93YXJuLWlmLWljb24tc3BlYy1taXNzaW5nJztcbmltcG9ydCB7IGZhTm90Rm91bmRJY29uSHRtbCB9IGZyb20gJy4uL3NoYXJlZC9lcnJvcnMvbm90LWZvdW5kLWljb24taHRtbCc7XG5pbXBvcnQgeyBGYUljb25TZXJ2aWNlIH0gZnJvbSAnLi9pY29uLnNlcnZpY2UnO1xuXG4vKipcbiAqIEZvbnRhd2Vzb21lIGljb24uXG4gKi9cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2ZhLWljb24nLFxuICB0ZW1wbGF0ZTogYGAsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ25nLWZhLWljb24nLFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIEZhSWNvbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1pbnB1dC1yZW5hbWVcbiAgQElucHV0KCdpY29uJykgaWNvblByb3A6IEljb25Qcm9wO1xuICBASW5wdXQoKSB0aXRsZT86IHN0cmluZztcbiAgQElucHV0KCkgc3Bpbj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIHB1bHNlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgbWFzaz86IEljb25Qcm9wO1xuICBASW5wdXQoKSBzdHlsZXM/OiBTdHlsZXM7XG4gIEBJbnB1dCgpIGZsaXA/OiBGbGlwUHJvcDtcbiAgQElucHV0KCkgc2l6ZT86IFNpemVQcm9wO1xuICBASW5wdXQoKSBwdWxsPzogUHVsbFByb3A7XG4gIEBJbnB1dCgpIGJvcmRlcj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIGludmVyc2U/OiBib29sZWFuO1xuICBASW5wdXQoKSBzeW1ib2w/OiBGYVN5bWJvbDtcbiAgQElucHV0KCkgbGlzdEl0ZW0/OiBib29sZWFuO1xuICBASW5wdXQoKSByb3RhdGU/OiBSb3RhdGVQcm9wO1xuICBASW5wdXQoKSBmaXhlZFdpZHRoPzogYm9vbGVhbjtcbiAgQElucHV0KCkgY2xhc3Nlcz86IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIHRyYW5zZm9ybT86IHN0cmluZyB8IFRyYW5zZm9ybTtcblxuICBwdWJsaWMgaWNvbjogSWNvbjtcblxuICBASG9zdEJpbmRpbmcoJ2lubmVySFRNTCcpXG4gIHB1YmxpYyByZW5kZXJlZEljb25IVE1MOiBTYWZlSHRtbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHNhbml0aXplcjogRG9tU2FuaXRpemVyLCBwcml2YXRlIGljb25TZXJ2aWNlOiBGYUljb25TZXJ2aWNlKSB7fVxuXG4gIHByaXZhdGUgcGFyYW1zOiBJY29uUGFyYW1zO1xuICBwcml2YXRlIGljb25TcGVjOiBJY29uTG9va3VwO1xuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlcykge1xuICAgICAgdGhpcy51cGRhdGVJY29uU3BlYygpO1xuICAgICAgdGhpcy51cGRhdGVQYXJhbXMoKTtcbiAgICAgIHRoaXMudXBkYXRlSWNvbigpO1xuICAgICAgdGhpcy5yZW5kZXJJY29uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0aW5nIGljb24gc3BlYy5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlSWNvblNwZWMoKSB7XG4gICAgdGhpcy5pY29uU3BlYyA9IGZhTm9ybWFsaXplSWNvblNwZWModGhpcy5pY29uUHJvcCwgdGhpcy5pY29uU2VydmljZS5kZWZhdWx0UHJlZml4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBwYXJhbXMgYnkgY29tcG9uZW50IHByb3BzLlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVQYXJhbXMoKSB7XG4gICAgY29uc3QgY2xhc3NPcHRzOiBGYVByb3BzID0ge1xuICAgICAgZmxpcDogdGhpcy5mbGlwLFxuICAgICAgc3BpbjogdGhpcy5zcGluLFxuICAgICAgcHVsc2U6IHRoaXMucHVsc2UsXG4gICAgICBib3JkZXI6IHRoaXMuYm9yZGVyLFxuICAgICAgaW52ZXJzZTogdGhpcy5pbnZlcnNlLFxuICAgICAgbGlzdEl0ZW06IHRoaXMubGlzdEl0ZW0sXG4gICAgICBzaXplOiB0aGlzLnNpemUgfHwgbnVsbCxcbiAgICAgIHB1bGw6IHRoaXMucHVsbCB8fCBudWxsLFxuICAgICAgcm90YXRlOiB0aGlzLnJvdGF0ZSB8fCBudWxsLFxuICAgICAgZml4ZWRXaWR0aDogdGhpcy5maXhlZFdpZHRoXG4gICAgfTtcblxuICAgIGNvbnN0IGNsYXNzZXMgPSBvYmplY3RXaXRoS2V5KCdjbGFzc2VzJywgWy4uLmZhQ2xhc3NMaXN0KGNsYXNzT3B0cyksIC4uLnRoaXMuY2xhc3Nlc10pO1xuICAgIGNvbnN0IG1hc2sgPSBvYmplY3RXaXRoS2V5KCdtYXNrJywgZmFOb3JtYWxpemVJY29uU3BlYyh0aGlzLm1hc2ssIHRoaXMuaWNvblNlcnZpY2UuZGVmYXVsdFByZWZpeCkpO1xuICAgIGNvbnN0IHBhcnNlZFRyYW5zZm9ybSA9IHR5cGVvZiB0aGlzLnRyYW5zZm9ybSA9PT0gJ3N0cmluZycgPyBwYXJzZS50cmFuc2Zvcm0odGhpcy50cmFuc2Zvcm0pIDogdGhpcy50cmFuc2Zvcm07XG4gICAgY29uc3QgdHJhbnNmb3JtID0gb2JqZWN0V2l0aEtleSgndHJhbnNmb3JtJywgcGFyc2VkVHJhbnNmb3JtKTtcblxuICAgIHRoaXMucGFyYW1zID0ge1xuICAgICAgdGl0bGU6IHRoaXMudGl0bGUsXG4gICAgICAuLi50cmFuc2Zvcm0sXG4gICAgICAuLi5jbGFzc2VzLFxuICAgICAgLi4ubWFzayxcbiAgICAgIHN0eWxlczogdGhpcy5zdHlsZXMsXG4gICAgICBzeW1ib2w6IHRoaXMuc3ltYm9sXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGluZyBpY29uIGJ5IHBhcmFtcyBhbmQgaWNvbiBzcGVjLlxuICAgKi9cbiAgcHJpdmF0ZSB1cGRhdGVJY29uKCkge1xuICAgIHRoaXMuaWNvbiA9IGljb24odGhpcy5pY29uU3BlYywgdGhpcy5wYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlcmluZyBpY29uLlxuICAgKi9cbiAgcHJpdmF0ZSByZW5kZXJJY29uKCkge1xuICAgIGZhV2FybklmSWNvblNwZWNNaXNzaW5nKHRoaXMuaWNvblNwZWMpO1xuICAgIGZhV2FybklmSWNvbkh0bWxNaXNzaW5nKHRoaXMuaWNvbiwgdGhpcy5pY29uU3BlYyk7XG5cbiAgICB0aGlzLnJlbmRlcmVkSWNvbkhUTUwgPSB0aGlzLnNhbml0aXplci5ieXBhc3NTZWN1cml0eVRydXN0SHRtbChcbiAgICAgIHRoaXMuaWNvbiA/IHRoaXMuaWNvbi5odG1sLmpvaW4oJ1xcbicpIDogZmFOb3RGb3VuZEljb25IdG1sXG4gICAgKTtcbiAgfVxufVxuXG4iXX0=