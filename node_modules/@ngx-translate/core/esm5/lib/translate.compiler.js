import * as tslib_1 from "tslib";
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { Injectable } from "@angular/core";
/**
 * @abstract
 */
var TranslateCompiler = /** @class */ (function () {
    function TranslateCompiler() {
    }
    return TranslateCompiler;
}());
export { TranslateCompiler };
function TranslateCompiler_tsickle_Closure_declarations() {
    /**
     * @abstract
     * @param {?} value
     * @param {?} lang
     * @return {?}
     */
    TranslateCompiler.prototype.compile = function (value, lang) { };
    /**
     * @abstract
     * @param {?} translations
     * @param {?} lang
     * @return {?}
     */
    TranslateCompiler.prototype.compileTranslations = function (translations, lang) { };
}
/**
 * This compiler is just a placeholder that does nothing, in case you don't need a compiler at all
 */
var TranslateFakeCompiler = /** @class */ (function (_super) {
    tslib_1.__extends(TranslateFakeCompiler, _super);
    function TranslateFakeCompiler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * @param {?} value
     * @param {?} lang
     * @return {?}
     */
    TranslateFakeCompiler.prototype.compile = function (value, lang) {
        return value;
    };
    /**
     * @param {?} translations
     * @param {?} lang
     * @return {?}
     */
    TranslateFakeCompiler.prototype.compileTranslations = function (translations, lang) {
        return translations;
    };
    return TranslateFakeCompiler;
}(TranslateCompiler));
export { TranslateFakeCompiler };
TranslateFakeCompiler.decorators = [
    { type: Injectable },
];
function TranslateFakeCompiler_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    TranslateFakeCompiler.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    TranslateFakeCompiler.ctorParameters;
}
//# sourceMappingURL=translate.compiler.js.map
