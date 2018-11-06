import * as tslib_1 from "tslib";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { of } from "rxjs";
/**
 * @abstract
 */
var TranslateLoader = /** @class */ (function () {
    function TranslateLoader() {
    }
    return TranslateLoader;
}());
export { TranslateLoader };
function TranslateLoader_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} lang
     * @return {?}
     */
    TranslateLoader.prototype.getTranslation = function (lang) { };
}
/**
 * This loader is just a placeholder that does nothing, in case you don't need a loader at all
 */
var TranslateFakeLoader = /** @class */ (function (_super) {
    tslib_1.__extends(TranslateFakeLoader, _super);
    function TranslateFakeLoader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} lang
     * @return {?}
     */
    TranslateFakeLoader.prototype.getTranslation = function (lang) {
        return of({});
    };
    return TranslateFakeLoader;
}(TranslateLoader));
export { TranslateFakeLoader };
TranslateFakeLoader.decorators = [
    { type: Injectable },
];
function TranslateFakeLoader_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    TranslateFakeLoader.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    TranslateFakeLoader.ctorParameters;
}
//# sourceMappingURL=translate.loader.js.map
