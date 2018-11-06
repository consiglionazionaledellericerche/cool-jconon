import { Component, Input } from '@angular/core';
import { JhiConfigService } from '../config.service';
/**
 * A component that will take care of item count statistics of a pagination.
 */
var JhiItemCountComponent = /** @class */ (function () {
    function JhiItemCountComponent(config) {
        this.i18nEnabled = config.CONFIG_OPTIONS.i18nEnabled;
    }
    /**
     * "translate-values" JSON of the template
     */
    /**
         * "translate-values" JSON of the template
         */
    JhiItemCountComponent.prototype.i18nValues = /**
         * "translate-values" JSON of the template
         */
    function () {
        var first = ((this.page - 1) * this.itemsPerPage) === 0 ? 1 : ((this.page - 1) * this.itemsPerPage + 1);
        var second = (this.page * this.itemsPerPage) < this.total ? (this.page * this.itemsPerPage) : this.total;
        return '{first: \'' + first + '\', second: \'' + second + '\', total: \'' + this.total + '\'}';
    };
    JhiItemCountComponent.decorators = [
        { type: Component, args: [{
                    selector: 'jhi-item-count',
                    template: "\n        <div *ngIf=\"i18nEnabled; else noI18n\" class=\"info jhi-item-count\"\n            jhiTranslate=\"global.item-count\"\n            translateValues=\"{{i18nValues()}}\"\n            [attr.translateValues]=\"i18nValues()\">  /* [attr.translateValues] is used to get entire values in tests */\n        </div>\n        <ng-template #noI18n class=\"info jhi-item-count\">\n            Showing {{((page - 1) * itemsPerPage) == 0 ? 1 : ((page - 1) * itemsPerPage + 1)}} -\n            {{(page * itemsPerPage) < total ? (page * itemsPerPage) : total}}\n            of {{total}} items.\n        </ng-template>"
                },] },
    ];
    /** @nocollapse */
    JhiItemCountComponent.ctorParameters = function () { return [
        { type: JhiConfigService, },
    ]; };
    JhiItemCountComponent.propDecorators = {
        "page": [{ type: Input },],
        "total": [{ type: Input },],
        "itemsPerPage": [{ type: Input },],
    };
    return JhiItemCountComponent;
}());
export { JhiItemCountComponent };
