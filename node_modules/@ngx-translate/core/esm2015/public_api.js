/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import { NgModule } from "@angular/core";
import { TranslateLoader, TranslateFakeLoader } from "./lib/translate.loader";
import { TranslateService } from "./lib/translate.service";
import { MissingTranslationHandler, FakeMissingTranslationHandler } from "./lib/missing-translation-handler";
import { TranslateParser, TranslateDefaultParser } from "./lib/translate.parser";
import { TranslateCompiler, TranslateFakeCompiler } from "./lib/translate.compiler";
import { TranslateDirective } from "./lib/translate.directive";
import { TranslatePipe } from "./lib/translate.pipe";
import { TranslateStore } from "./lib/translate.store";
import { USE_STORE } from "./lib/translate.service";
import { USE_DEFAULT_LANG } from "./lib/translate.service";
export { TranslateLoader, TranslateFakeLoader } from "./lib/translate.loader";
export { USE_STORE, USE_DEFAULT_LANG, TranslateService } from "./lib/translate.service";
export { MissingTranslationHandler, FakeMissingTranslationHandler } from "./lib/missing-translation-handler";
export { TranslateParser, TranslateDefaultParser } from "./lib/translate.parser";
export { TranslateCompiler, TranslateFakeCompiler } from "./lib/translate.compiler";
export { TranslateDirective } from "./lib/translate.directive";
export { TranslatePipe } from "./lib/translate.pipe";
export { TranslateStore } from "./lib/translate.store";
/**
 * @record
 */
export function TranslateModuleConfig() { }
function TranslateModuleConfig_tsickle_Closure_declarations() {
    /** @type {?|undefined} */
    TranslateModuleConfig.prototype.loader;
    /** @type {?|undefined} */
    TranslateModuleConfig.prototype.compiler;
    /** @type {?|undefined} */
    TranslateModuleConfig.prototype.parser;
    /** @type {?|undefined} */
    TranslateModuleConfig.prototype.missingTranslationHandler;
    /** @type {?|undefined} */
    TranslateModuleConfig.prototype.isolate;
    /** @type {?|undefined} */
    TranslateModuleConfig.prototype.useDefaultLang;
}
export class TranslateModule {
    /**
     * Use this method in your root module to provide the TranslateService
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: TranslateModule,
            providers: [
                config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
                config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
                config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
                config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
                TranslateStore,
                { provide: USE_STORE, useValue: config.isolate },
                { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
                TranslateService
            ]
        };
    }
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     * @param {?=} config
     * @return {?}
     */
    static forChild(config = {}) {
        return {
            ngModule: TranslateModule,
            providers: [
                config.loader || { provide: TranslateLoader, useClass: TranslateFakeLoader },
                config.compiler || { provide: TranslateCompiler, useClass: TranslateFakeCompiler },
                config.parser || { provide: TranslateParser, useClass: TranslateDefaultParser },
                config.missingTranslationHandler || { provide: MissingTranslationHandler, useClass: FakeMissingTranslationHandler },
                { provide: USE_STORE, useValue: config.isolate },
                { provide: USE_DEFAULT_LANG, useValue: config.useDefaultLang },
                TranslateService
            ]
        };
    }
}
TranslateModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    TranslatePipe,
                    TranslateDirective
                ],
                exports: [
                    TranslatePipe,
                    TranslateDirective
                ]
            },] },
];
function TranslateModule_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    TranslateModule.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    TranslateModule.ctorParameters;
}
//# sourceMappingURL=public_api.js.map
