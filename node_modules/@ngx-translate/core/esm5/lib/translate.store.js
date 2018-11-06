/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { EventEmitter } from "@angular/core";
var TranslateStore = /** @class */ (function () {
    function TranslateStore() {
        /**
         * The lang currently used
         */
        this.currentLang = this.defaultLang;
        /**
         * a list of translations per lang
         */
        this.translations = {};
        /**
         * an array of langs
         */
        this.langs = [];
        /**
         * An EventEmitter to listen to translation change events
         * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
         *     // do something
         * });
         */
        this.onTranslationChange = new EventEmitter();
        /**
         * An EventEmitter to listen to lang change events
         * onLangChange.subscribe((params: LangChangeEvent) => {
         *     // do something
         * });
         */
        this.onLangChange = new EventEmitter();
        /**
         * An EventEmitter to listen to default lang change events
         * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
         *     // do something
         * });
         */
        this.onDefaultLangChange = new EventEmitter();
    }
    return TranslateStore;
}());
export { TranslateStore };
function TranslateStore_tsickle_Closure_declarations() {
    /**
     * The default lang to fallback when translations are missing on the current lang
     * @type {?}
     */
    TranslateStore.prototype.defaultLang;
    /**
     * The lang currently used
     * @type {?}
     */
    TranslateStore.prototype.currentLang;
    /**
     * a list of translations per lang
     * @type {?}
     */
    TranslateStore.prototype.translations;
    /**
     * an array of langs
     * @type {?}
     */
    TranslateStore.prototype.langs;
    /**
     * An EventEmitter to listen to translation change events
     * onTranslationChange.subscribe((params: TranslationChangeEvent) => {
     *     // do something
     * });
     * @type {?}
     */
    TranslateStore.prototype.onTranslationChange;
    /**
     * An EventEmitter to listen to lang change events
     * onLangChange.subscribe((params: LangChangeEvent) => {
     *     // do something
     * });
     * @type {?}
     */
    TranslateStore.prototype.onLangChange;
    /**
     * An EventEmitter to listen to default lang change events
     * onDefaultLangChange.subscribe((params: DefaultLangChangeEvent) => {
     *     // do something
     * });
     * @type {?}
     */
    TranslateStore.prototype.onDefaultLangChange;
}
//# sourceMappingURL=translate.store.js.map
