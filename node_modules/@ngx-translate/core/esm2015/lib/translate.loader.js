/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
import { of } from "rxjs";
/**
 * @abstract
 */
export class TranslateLoader {
}
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
export class TranslateFakeLoader extends TranslateLoader {
    /**
     * @param {?} lang
     * @return {?}
     */
    getTranslation(lang) {
        return of({});
    }
}
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
