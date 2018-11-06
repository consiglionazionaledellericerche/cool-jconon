/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, ContentChildren, Directive, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { isString } from '../util/util';
import { NgbAccordionConfig } from './accordion-config';
/** @type {?} */
var nextId = 0;
/**
 * This directive should be used to wrap accordion panel titles that need to contain HTML markup or other directives.
 */
var NgbPanelTitle = /** @class */ (function () {
    function NgbPanelTitle(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPanelTitle.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPanelTitle]' },] },
    ];
    /** @nocollapse */
    NgbPanelTitle.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPanelTitle;
}());
export { NgbPanelTitle };
if (false) {
    /** @type {?} */
    NgbPanelTitle.prototype.templateRef;
}
/**
 * This directive must be used to wrap accordion panel content.
 */
var NgbPanelContent = /** @class */ (function () {
    function NgbPanelContent(templateRef) {
        this.templateRef = templateRef;
    }
    NgbPanelContent.decorators = [
        { type: Directive, args: [{ selector: 'ng-template[ngbPanelContent]' },] },
    ];
    /** @nocollapse */
    NgbPanelContent.ctorParameters = function () { return [
        { type: TemplateRef }
    ]; };
    return NgbPanelContent;
}());
export { NgbPanelContent };
if (false) {
    /** @type {?} */
    NgbPanelContent.prototype.templateRef;
}
/**
 * The NgbPanel directive represents an individual panel with the title and collapsible
 * content
 */
var NgbPanel = /** @class */ (function () {
    function NgbPanel() {
        /**
         *  A flag determining whether the panel is disabled or not.
         *  When disabled, the panel cannot be toggled.
         */
        this.disabled = false;
        /**
         *  An optional id for the panel. The id should be unique.
         *  If not provided, it will be auto-generated.
         */
        this.id = "ngb-panel-" + nextId++;
        /**
         * A flag telling if the panel is currently open
         */
        this.isOpen = false;
    }
    /**
     * @return {?}
     */
    NgbPanel.prototype.ngAfterContentChecked = /**
     * @return {?}
     */
    function () {
        // We are using @ContentChildren instead of @ContantChild as in the Angular version being used
        // only @ContentChildren allows us to specify the {descendants: false} option.
        // Without {descendants: false} we are hitting bugs described in:
        // https://github.com/ng-bootstrap/ng-bootstrap/issues/2240
        this.titleTpl = this.titleTpls.first;
        this.contentTpl = this.contentTpls.first;
    };
    NgbPanel.decorators = [
        { type: Directive, args: [{ selector: 'ngb-panel' },] },
    ];
    NgbPanel.propDecorators = {
        disabled: [{ type: Input }],
        id: [{ type: Input }],
        title: [{ type: Input }],
        type: [{ type: Input }],
        titleTpls: [{ type: ContentChildren, args: [NgbPanelTitle, { descendants: false },] }],
        contentTpls: [{ type: ContentChildren, args: [NgbPanelContent, { descendants: false },] }]
    };
    return NgbPanel;
}());
export { NgbPanel };
if (false) {
    /**
     *  A flag determining whether the panel is disabled or not.
     *  When disabled, the panel cannot be toggled.
     * @type {?}
     */
    NgbPanel.prototype.disabled;
    /**
     *  An optional id for the panel. The id should be unique.
     *  If not provided, it will be auto-generated.
     * @type {?}
     */
    NgbPanel.prototype.id;
    /**
     * A flag telling if the panel is currently open
     * @type {?}
     */
    NgbPanel.prototype.isOpen;
    /**
     *  The title for the panel.
     * @type {?}
     */
    NgbPanel.prototype.title;
    /**
     *  Accordion's types of panels to be applied per panel basis.
     *  Bootstrap recognizes the following types: "primary", "secondary", "success", "danger", "warning", "info", "light"
     * and "dark"
     * @type {?}
     */
    NgbPanel.prototype.type;
    /** @type {?} */
    NgbPanel.prototype.titleTpl;
    /** @type {?} */
    NgbPanel.prototype.contentTpl;
    /** @type {?} */
    NgbPanel.prototype.titleTpls;
    /** @type {?} */
    NgbPanel.prototype.contentTpls;
}
/**
 * The payload of the change event fired right before toggling an accordion panel
 * @record
 */
export function NgbPanelChangeEvent() { }
/**
 * Id of the accordion panel that is toggled
 * @type {?}
 */
NgbPanelChangeEvent.prototype.panelId;
/**
 * Whether the panel will be opened (true) or closed (false)
 * @type {?}
 */
NgbPanelChangeEvent.prototype.nextState;
/**
 * Function that will prevent panel toggling if called
 * @type {?}
 */
NgbPanelChangeEvent.prototype.preventDefault;
/**
 * The NgbAccordion directive is a collection of panels.
 * It can assure that only one panel can be opened at a time.
 */
var NgbAccordion = /** @class */ (function () {
    function NgbAccordion(config) {
        /**
         * An array or comma separated strings of panel identifiers that should be opened
         */
        this.activeIds = [];
        /**
         * Whether the closed panels should be hidden without destroying them
         */
        this.destroyOnHide = true;
        /**
         * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
         */
        this.panelChange = new EventEmitter();
        this.type = config.type;
        this.closeOtherPanels = config.closeOthers;
    }
    /**
     * Programmatically toggle a panel with a given id.
     */
    /**
     * Programmatically toggle a panel with a given id.
     * @param {?} panelId
     * @return {?}
     */
    NgbAccordion.prototype.toggle = /**
     * Programmatically toggle a panel with a given id.
     * @param {?} panelId
     * @return {?}
     */
    function (panelId) {
        /** @type {?} */
        var panel = this.panels.find(function (p) { return p.id === panelId; });
        if (panel && !panel.disabled) {
            /** @type {?} */
            var defaultPrevented_1 = false;
            this.panelChange.emit({ panelId: panelId, nextState: !panel.isOpen, preventDefault: function () { defaultPrevented_1 = true; } });
            if (!defaultPrevented_1) {
                panel.isOpen = !panel.isOpen;
                if (this.closeOtherPanels) {
                    this._closeOthers(panelId);
                }
                this._updateActiveIds();
            }
        }
    };
    /**
     * @return {?}
     */
    NgbAccordion.prototype.ngAfterContentChecked = /**
     * @return {?}
     */
    function () {
        var _this = this;
        // active id updates
        if (isString(this.activeIds)) {
            this.activeIds = this.activeIds.split(/\s*,\s*/);
        }
        // update panels open states
        this.panels.forEach(function (panel) { return panel.isOpen = !panel.disabled && _this.activeIds.indexOf(panel.id) > -1; });
        // closeOthers updates
        if (this.activeIds.length > 1 && this.closeOtherPanels) {
            this._closeOthers(this.activeIds[0]);
            this._updateActiveIds();
        }
    };
    /**
     * @param {?} panelId
     * @return {?}
     */
    NgbAccordion.prototype._closeOthers = /**
     * @param {?} panelId
     * @return {?}
     */
    function (panelId) {
        this.panels.forEach(function (panel) {
            if (panel.id !== panelId) {
                panel.isOpen = false;
            }
        });
    };
    /**
     * @return {?}
     */
    NgbAccordion.prototype._updateActiveIds = /**
     * @return {?}
     */
    function () {
        this.activeIds = this.panels.filter(function (panel) { return panel.isOpen && !panel.disabled; }).map(function (panel) { return panel.id; });
    };
    NgbAccordion.decorators = [
        { type: Component, args: [{
                    selector: 'ngb-accordion',
                    exportAs: 'ngbAccordion',
                    host: { 'class': 'accordion', 'role': 'tablist', '[attr.aria-multiselectable]': '!closeOtherPanels' },
                    template: "\n    <ng-template ngFor let-panel [ngForOf]=\"panels\">\n      <div class=\"card\">\n        <div role=\"tab\" id=\"{{panel.id}}-header\" [class]=\"'card-header ' + (panel.type ? 'bg-'+panel.type: type ? 'bg-'+type : '')\">\n          <h5 class=\"mb-0\">\n            <button class=\"btn btn-link\" (click)=\"!!toggle(panel.id)\" [disabled]=\"panel.disabled\" [class.collapsed]=\"!panel.isOpen\"\n              [attr.aria-expanded]=\"panel.isOpen\" [attr.aria-controls]=\"panel.id\">\n              {{panel.title}}<ng-template [ngTemplateOutlet]=\"panel.titleTpl?.templateRef\"></ng-template>\n            </button>\n          </h5>\n        </div>\n        <div id=\"{{panel.id}}\" role=\"tabpanel\" [attr.aria-labelledby]=\"panel.id + '-header'\"\n             class=\"collapse\" [class.show]=\"panel.isOpen\" *ngIf=\"!destroyOnHide || panel.isOpen\">\n          <div class=\"card-body\">\n               <ng-template [ngTemplateOutlet]=\"panel.contentTpl?.templateRef\"></ng-template>\n          </div>\n        </div>\n      </div>\n    </ng-template>\n  "
                },] },
    ];
    /** @nocollapse */
    NgbAccordion.ctorParameters = function () { return [
        { type: NgbAccordionConfig }
    ]; };
    NgbAccordion.propDecorators = {
        panels: [{ type: ContentChildren, args: [NgbPanel,] }],
        activeIds: [{ type: Input }],
        closeOtherPanels: [{ type: Input, args: ['closeOthers',] }],
        destroyOnHide: [{ type: Input }],
        type: [{ type: Input }],
        panelChange: [{ type: Output }]
    };
    return NgbAccordion;
}());
export { NgbAccordion };
if (false) {
    /** @type {?} */
    NgbAccordion.prototype.panels;
    /**
     * An array or comma separated strings of panel identifiers that should be opened
     * @type {?}
     */
    NgbAccordion.prototype.activeIds;
    /**
     *  Whether the other panels should be closed when a panel is opened
     * @type {?}
     */
    NgbAccordion.prototype.closeOtherPanels;
    /**
     * Whether the closed panels should be hidden without destroying them
     * @type {?}
     */
    NgbAccordion.prototype.destroyOnHide;
    /**
     *  Accordion's types of panels to be applied globally.
     *  Bootstrap recognizes the following types: "primary", "secondary", "success", "danger", "warning", "info", "light"
     * and "dark
     * @type {?}
     */
    NgbAccordion.prototype.type;
    /**
     * A panel change event fired right before the panel toggle happens. See NgbPanelChangeEvent for payload details
     * @type {?}
     */
    NgbAccordion.prototype.panelChange;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQG5nLWJvb3RzdHJhcC9uZy1ib290c3RyYXAvIiwic291cmNlcyI6WyJhY2NvcmRpb24vYWNjb3JkaW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBRUwsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFdBQVcsRUFDWixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRXRDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDOztBQUV0RCxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7Ozs7O0lBT2IsdUJBQW1CLFdBQTZCO1FBQTdCLGdCQUFXLEdBQVgsV0FBVyxDQUFrQjtLQUFJOztnQkFGckQsU0FBUyxTQUFDLEVBQUMsUUFBUSxFQUFFLDRCQUE0QixFQUFDOzs7O2dCQVpqRCxXQUFXOzt3QkFUYjs7U0FzQmEsYUFBYTs7Ozs7Ozs7O0lBU3hCLHlCQUFtQixXQUE2QjtRQUE3QixnQkFBVyxHQUFYLFdBQVcsQ0FBa0I7S0FBSTs7Z0JBRnJELFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSw4QkFBOEIsRUFBQzs7OztnQkFwQm5ELFdBQVc7OzBCQVRiOztTQThCYSxlQUFlOzs7Ozs7Ozs7Ozs7Ozs7d0JBY04sS0FBSzs7Ozs7a0JBTVgsZUFBYSxNQUFNLEVBQUk7Ozs7c0JBSzVCLEtBQUs7Ozs7O0lBb0JkLHdDQUFxQjs7O0lBQXJCOzs7OztRQUtFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7UUFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQztLQUMxQzs7Z0JBNUNGLFNBQVMsU0FBQyxFQUFDLFFBQVEsRUFBRSxXQUFXLEVB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QUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7YUFDdEI7U0FDRixDQUFDLENBQUM7Ozs7O0lBR0csdUNBQWdCOzs7O1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxFQUFFLEVBQVIsQ0FBUSxDQUFDLENBQUM7OztnQkE1R3hHLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSw2QkFBNkIsRUFBRSxtQkFBbUIsRUFBQztvQkFDbkcsUUFBUSxFQUFFLHNpQ0FtQlQ7aUJBQ0Y7Ozs7Z0JBdkhPLGtCQUFrQjs7O3lCQXlIdkIsZUFBZSxTQUFDLFFBQVE7NEJBS3hCLEtBQUs7bUNBS0wsS0FBSyxTQUFDLGFBQWE7Z0NBS25CLEtBQUs7dUJBT0wsS0FBSzs4QkFLTCxNQUFNOzt1QkFsS1Q7O1NBc0lhLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7aXNTdHJpbmd9IGZyb20gJy4uL3V0aWwvdXRpbCc7XG5cbmltcG9ydCB7TmdiQWNjb3JkaW9uQ29uZmlnfSBmcm9tICcuL2FjY29yZGlvbi1jb25maWcnO1xuXG5sZXQgbmV4dElkID0gMDtcblxuLyoqXG4gKiBUaGlzIGRpcmVjdGl2ZSBzaG91bGQgYmUgdXNlZCB0byB3cmFwIGFjY29yZGlvbiBwYW5lbCB0aXRsZXMgdGhhdCBuZWVkIHRvIGNvbnRhaW4gSFRNTCBtYXJrdXAgb3Igb3RoZXIgZGlyZWN0aXZlcy5cbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZy10ZW1wbGF0ZVtuZ2JQYW5lbFRpdGxlXSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsVGl0bGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGVtcGxhdGVSZWY6IFRlbXBsYXRlUmVmPGFueT4pIHt9XG59XG5cbi8qKlxuICogVGhpcyBkaXJlY3RpdmUgbXVzdCBiZSB1c2VkIHRvIHdyYXAgYWNjb3JkaW9uIHBhbmVsIGNvbnRlbnQuXG4gKi9cbkBEaXJlY3RpdmUoe3NlbGVjdG9yOiAnbmctdGVtcGxhdGVbbmdiUGFuZWxDb250ZW50XSd9KVxuZXhwb3J0IGNsYXNzIE5nYlBhbmVsQ29udGVudCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8YW55Pikge31cbn1cblxuLyoqXG4gKiBUaGUgTmdiUGFuZWwgZGlyZWN0aXZlIHJlcHJlc2VudHMgYW4gaW5kaXZpZHVhbCBwYW5lbCB3aXRoIHRoZSB0aXRsZSBhbmQgY29sbGFwc2libGVcbiAqIGNvbnRlbnRcbiAqL1xuQERpcmVjdGl2ZSh7c2VsZWN0b3I6ICduZ2ItcGFuZWwnfSlcbmV4cG9ydCBjbGFzcyBOZ2JQYW5lbCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudENoZWNrZWQge1xuICAvKipcbiAgICogIEEgZmxhZyBkZXRlcm1pbmluZyB3aGV0aGVyIHRoZSBwYW5lbCBpcyBkaXNhYmxlZCBvciBub3QuXG4gICAqICBXaGVuIGRpc2FibGVkLCB0aGUgcGFuZWwgY2Fubm90IGJlIHRvZ2dsZWQuXG4gICAqL1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiAgQW4gb3B0aW9uYWwgaWQgZm9yIHRoZSBwYW5lbC4gVGhlIGlkIHNob3VsZCBiZSB1bmlxdWUuXG4gICAqICBJZiBub3QgcHJvdmlkZWQsIGl0IHdpbGwgYmUgYXV0by1nZW5lcmF0ZWQuXG4gICAqL1xuICBASW5wdXQoKSBpZCA9IGBuZ2ItcGFuZWwtJHtuZXh0SWQrK31gO1xuXG4gIC8qKlxuICAgKiBBIGZsYWcgdGVsbGluZyBpZiB0aGUgcGFuZWwgaXMgY3VycmVudGx5IG9wZW5cbiAgICovXG4gIGlzT3BlbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiAgVGhlIHRpdGxlIGZvciB0aGUgcGFuZWwuXG4gICAqL1xuICBASW5wdXQoKSB0aXRsZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiAgQWNjb3JkaW9uJ3MgdHlwZXMgb2YgcGFuZWxzIHRvIGJlIGFwcGxpZWQgcGVyIHBhbmVsIGJhc2lzLlxuICAgKiAgQm9vdHN0cmFwIHJlY29nbml6ZXMgdGhlIGZvbGxvd2luZyB0eXBlczogXCJwcmltYXJ5XCIsIFwic2Vjb25kYXJ5XCIsIFwic3VjY2Vzc1wiLCBcImRhbmdlclwiLCBcIndhcm5pbmdcIiwgXCJpbmZvXCIsIFwibGlnaHRcIlxuICAgKiBhbmQgXCJkYXJrXCJcbiAgICovXG4gIEBJbnB1dCgpIHR5cGU6IHN0cmluZztcblxuICB0aXRsZVRwbDogTmdiUGFuZWxUaXRsZSB8IG51bGw7XG4gIGNvbnRlbnRUcGw6IE5nYlBhbmVsQ29udGVudCB8IG51bGw7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOZ2JQYW5lbFRpdGxlLCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgdGl0bGVUcGxzOiBRdWVyeUxpc3Q8TmdiUGFuZWxUaXRsZT47XG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiUGFuZWxDb250ZW50LCB7ZGVzY2VuZGFudHM6IGZhbHNlfSkgY29udGVudFRwbHM6IFF1ZXJ5TGlzdDxOZ2JQYW5lbENvbnRlbnQ+O1xuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpIHtcbiAgICAvLyBXZSBhcmUgdXNpbmcgQENvbnRlbnRDaGlsZHJlbiBpbnN0ZWFkIG9mIEBDb250YW50Q2hpbGQgYXMgaW4gdGhlIEFuZ3VsYXIgdmVyc2lvbiBiZWluZyB1c2VkXG4gICAgLy8gb25seSBAQ29udGVudENoaWxkcmVuIGFsbG93cyB1cyB0byBzcGVjaWZ5IHRoZSB7ZGVzY2VuZGFudHM6IGZhbHNlfSBvcHRpb24uXG4gICAgLy8gV2l0aG91dCB7ZGVzY2VuZGFudHM6IGZhbHNlfSB3ZSBhcmUgaGl0dGluZyBidWdzIGRlc2NyaWJlZCBpbjpcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vbmctYm9vdHN0cmFwL25nLWJvb3RzdHJhcC9pc3N1ZXMvMjI0MFxuICAgIHRoaXMudGl0bGVUcGwgPSB0aGlzLnRpdGxlVHBscy5maXJzdDtcbiAgICB0aGlzLmNvbnRlbnRUcGwgPSB0aGlzLmNvbnRlbnRUcGxzLmZpcnN0O1xuICB9XG59XG5cbi8qKlxuICogVGhlIHBheWxvYWQgb2YgdGhlIGNoYW5nZSBldmVudCBmaXJlZCByaWdodCBiZWZvcmUgdG9nZ2xpbmcgYW4gYWNjb3JkaW9uIHBhbmVsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTmdiUGFuZWxDaGFuZ2VFdmVudCB7XG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgYWNjb3JkaW9uIHBhbmVsIHRoYXQgaXMgdG9nZ2xlZFxuICAgKi9cbiAgcGFuZWxJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBwYW5lbCB3aWxsIGJlIG9wZW5lZCAodHJ1ZSkgb3IgY2xvc2VkIChmYWxzZSlcbiAgICovXG4gIG5leHRTdGF0ZTogYm9vbGVhbjtcblxuICAvKipcbiAgICogRnVuY3Rpb24gdGhhdCB3aWxsIHByZXZlbnQgcGFuZWwgdG9nZ2xpbmcgaWYgY2FsbGVkXG4gICAqL1xuICBwcmV2ZW50RGVmYXVsdDogKCkgPT4gdm9pZDtcbn1cblxuLyoqXG4gKiBUaGUgTmdiQWNjb3JkaW9uIGRpcmVjdGl2ZSBpcyBhIGNvbGxlY3Rpb24gb2YgcGFuZWxzLlxuICogSXQgY2FuIGFzc3VyZSB0aGF0IG9ubHkgb25lIHBhbmVsIGNhbiBiZSBvcGVuZWQgYXQgYSB0aW1lLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZ2ItYWNjb3JkaW9uJyxcbiAgZXhwb3J0QXM6ICduZ2JBY2NvcmRpb24nLFxuICBob3N0OiB7J2NsYXNzJzogJ2FjY29yZGlvbicsICdyb2xlJzogJ3RhYmxpc3QnLCAnW2F0dHIuYXJpYS1tdWx0aXNlbGVjdGFibGVdJzogJyFjbG9zZU90aGVyUGFuZWxzJ30sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1wYW5lbCBbbmdGb3JPZl09XCJwYW5lbHNcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJjYXJkXCI+XG4gICAgICAgIDxkaXYgcm9sZT1cInRhYlwiIGlkPVwie3twYW5lbC5pZH19LWhlYWRlclwiIFtjbGFzc109XCInY2FyZC1oZWFkZXIgJyArIChwYW5lbC50eXBlID8gJ2JnLScrcGFuZWwudHlwZTogdHlwZSA/ICdiZy0nK3R5cGUgOiAnJylcIj5cbiAgICAgICAgICA8aDUgY2xhc3M9XCJtYi0wXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1saW5rXCIgKGNsaWNrKT1cIiEhdG9nZ2xlKHBhbmVsLmlkKVwiIFtkaXNhYmxlZF09XCJwYW5lbC5kaXNhYmxlZFwiIFtjbGFzcy5jb2xsYXBzZWRdPVwiIXBhbmVsLmlzT3BlblwiXG4gICAgICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwicGFuZWwuaXNPcGVuXCIgW2F0dHIuYXJpYS1jb250cm9sc109XCJwYW5lbC5pZFwiPlxuICAgICAgICAgICAgICB7e3BhbmVsLnRpdGxlfX08bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwicGFuZWwudGl0bGVUcGw/LnRlbXBsYXRlUmVmXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDwvaDU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGlkPVwie3twYW5lbC5pZH19XCIgcm9sZT1cInRhYnBhbmVsXCIgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cInBhbmVsLmlkICsgJy1oZWFkZXInXCJcbiAgICAgICAgICAgICBjbGFzcz1cImNvbGxhcHNlXCIgW2NsYXNzLnNob3ddPVwicGFuZWwuaXNPcGVuXCIgKm5nSWY9XCIhZGVzdHJveU9uSGlkZSB8fCBwYW5lbC5pc09wZW5cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+XG4gICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwicGFuZWwuY29udGVudFRwbD8udGVtcGxhdGVSZWZcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTmdiQWNjb3JkaW9uIGltcGxlbWVudHMgQWZ0ZXJDb250ZW50Q2hlY2tlZCB7XG4gIEBDb250ZW50Q2hpbGRyZW4oTmdiUGFuZWwpIHBhbmVsczogUXVlcnlMaXN0PE5nYlBhbmVsPjtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb3IgY29tbWEgc2VwYXJhdGVkIHN0cmluZ3Mgb2YgcGFuZWwgaWRlbnRpZmllcnMgdGhhdCBzaG91bGQgYmUgb3BlbmVkXG4gICAqL1xuICBASW5wdXQoKSBhY3RpdmVJZHM6IHN0cmluZyB8IHN0cmluZ1tdID0gW107XG5cbiAgLyoqXG4gICAqICBXaGV0aGVyIHRoZSBvdGhlciBwYW5lbHMgc2hvdWxkIGJlIGNsb3NlZCB3aGVuIGEgcGFuZWwgaXMgb3BlbmVkXG4gICAqL1xuICBASW5wdXQoJ2Nsb3NlT3RoZXJzJykgY2xvc2VPdGhlclBhbmVsczogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgY2xvc2VkIHBhbmVscyBzaG91bGQgYmUgaGlkZGVuIHdpdGhvdXQgZGVzdHJveWluZyB0aGVtXG4gICAqL1xuICBASW5wdXQoKSBkZXN0cm95T25IaWRlID0gdHJ1ZTtcblxuICAvKipcbiAgICogIEFjY29yZGlvbidzIHR5cGVzIG9mIHBhbmVscyB0byBiZSBhcHBsaWVkIGdsb2JhbGx5LlxuICAgKiAgQm9vdHN0cmFwIHJlY29nbml6ZXMgdGhlIGZvbGxvd2luZyB0eXBlczogXCJwcmltYXJ5XCIsIFwic2Vjb25kYXJ5XCIsIFwic3VjY2Vzc1wiLCBcImRhbmdlclwiLCBcIndhcm5pbmdcIiwgXCJpbmZvXCIsIFwibGlnaHRcIlxuICAgKiBhbmQgXCJkYXJrXG4gICAqL1xuICBASW5wdXQoKSB0eXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgcGFuZWwgY2hhbmdlIGV2ZW50IGZpcmVkIHJpZ2h0IGJlZm9yZSB0aGUgcGFuZWwgdG9nZ2xlIGhhcHBlbnMuIFNlZSBOZ2JQYW5lbENoYW5nZUV2ZW50IGZvciBwYXlsb2FkIGRldGFpbHNcbiAgICovXG4gIEBPdXRwdXQoKSBwYW5lbENoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TmdiUGFuZWxDaGFuZ2VFdmVudD4oKTtcblxuICBjb25zdHJ1Y3Rvcihjb25maWc6IE5nYkFjY29yZGlvbkNvbmZpZykge1xuICAgIHRoaXMudHlwZSA9IGNvbmZpZy50eXBlO1xuICAgIHRoaXMuY2xvc2VPdGhlclBhbmVscyA9IGNvbmZpZy5jbG9zZU90aGVycztcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9ncmFtbWF0aWNhbGx5IHRvZ2dsZSBhIHBhbmVsIHdpdGggYSBnaXZlbiBpZC5cbiAgICovXG4gIHRvZ2dsZShwYW5lbElkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBwYW5lbCA9IHRoaXMucGFuZWxzLmZpbmQocCA9PiBwLmlkID09PSBwYW5lbElkKTtcblxuICAgIGlmIChwYW5lbCAmJiAhcGFuZWwuZGlzYWJsZWQpIHtcbiAgICAgIGxldCBkZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG5cbiAgICAgIHRoaXMucGFuZWxDaGFuZ2UuZW1pdChcbiAgICAgICAgICB7cGFuZWxJZDogcGFuZWxJZCwgbmV4dFN0YXRlOiAhcGFuZWwuaXNPcGVuLCBwcmV2ZW50RGVmYXVsdDogKCkgPT4geyBkZWZhdWx0UHJldmVudGVkID0gdHJ1ZTsgfX0pO1xuXG4gICAgICBpZiAoIWRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgcGFuZWwuaXNPcGVuID0gIXBhbmVsLmlzT3BlbjtcblxuICAgICAgICBpZiAodGhpcy5jbG9zZU90aGVyUGFuZWxzKSB7XG4gICAgICAgICAgdGhpcy5fY2xvc2VPdGhlcnMocGFuZWxJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdXBkYXRlQWN0aXZlSWRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCkge1xuICAgIC8vIGFjdGl2ZSBpZCB1cGRhdGVzXG4gICAgaWYgKGlzU3RyaW5nKHRoaXMuYWN0aXZlSWRzKSkge1xuICAgICAgdGhpcy5hY3RpdmVJZHMgPSB0aGlzLmFjdGl2ZUlkcy5zcGxpdCgvXFxzKixcXHMqLyk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHBhbmVscyBvcGVuIHN0YXRlc1xuICAgIHRoaXMucGFuZWxzLmZvckVhY2gocGFuZWwgPT4gcGFuZWwuaXNPcGVuID0gIXBhbmVsLmRpc2FibGVkICYmIHRoaXMuYWN0aXZlSWRzLmluZGV4T2YocGFuZWwuaWQpID4gLTEpO1xuXG4gICAgLy8gY2xvc2VPdGhlcnMgdXBkYXRlc1xuICAgIGlmICh0aGlzLmFjdGl2ZUlkcy5sZW5ndGggPiAxICYmIHRoaXMuY2xvc2VPdGhlclBhbmVscykge1xuICAgICAgdGhpcy5fY2xvc2VPdGhlcnModGhpcy5hY3RpdmVJZHNbMF0pO1xuICAgICAgdGhpcy5fdXBkYXRlQWN0aXZlSWRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfY2xvc2VPdGhlcnMocGFuZWxJZDogc3RyaW5nKSB7XG4gICAgdGhpcy5wYW5lbHMuZm9yRWFjaChwYW5lbCA9PiB7XG4gICAgICBpZiAocGFuZWwuaWQgIT09IHBhbmVsSWQpIHtcbiAgICAgICAgcGFuZWwuaXNPcGVuID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIF91cGRhdGVBY3RpdmVJZHMoKSB7XG4gICAgdGhpcy5hY3RpdmVJZHMgPSB0aGlzLnBhbmVscy5maWx0ZXIocGFuZWwgPT4gcGFuZWwuaXNPcGVuICYmICFwYW5lbC5kaXNhYmxlZCkubWFwKHBhbmVsID0+IHBhbmVsLmlkKTtcbiAgfVxufVxuIl19