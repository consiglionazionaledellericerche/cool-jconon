import { NgModule, Sanitizer } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader, MissingTranslationHandler, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JHI_PIPES, JHI_DIRECTIVES, JHI_COMPONENTS } from './src/jhi-components';
import { JhiMissingTranslationHandler, JhiTranslateComponent, JhiLanguageService } from './src/language';
import { JhiModuleConfig } from './src/config';
import { JhiConfigService } from './src/config.service';
import { JhiAlertService, JhiPaginationUtil, JhiResolvePagingParams } from './src/service';
export * from './src/pipe';
export * from './src/directive';
export * from './src/service';
export * from './src/component';
export * from './src/language';
export * from './src/config.service';
export * from './src/config';
export function translatePartialLoader(http) {
    return new TranslateHttpLoader(http, 'i18n/', ".json?buildTimestamp=" + process.env.BUILD_TIMESTAMP);
}
export function missingTranslationHandler(configService) {
    return new JhiMissingTranslationHandler(configService);
}
var NgJhipsterModule = /** @class */ (function () {
    function NgJhipsterModule() {
    }
    NgJhipsterModule.forRoot = function (moduleConfig) {
        return {
            ngModule: NgJhipsterModule,
            providers: [
                { provide: JhiLanguageService, useClass: JhiLanguageService, deps: [TranslateService, JhiConfigService] },
                { provide: JhiResolvePagingParams, useClass: JhiResolvePagingParams, deps: [JhiPaginationUtil] },
                { provide: JhiAlertService, useClass: JhiAlertService, deps: [Sanitizer, JhiConfigService, TranslateService] },
                { provide: JhiModuleConfig, useValue: moduleConfig },
                { provide: JhiConfigService, useClass: JhiConfigService, deps: [JhiModuleConfig] }
            ]
        };
    };
    NgJhipsterModule.forChild = function (moduleConfig) {
        return {
            ngModule: NgJhipsterModule,
            providers: [
                { provide: JhiModuleConfig, useValue: moduleConfig },
            ]
        };
    };
    NgJhipsterModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        TranslateModule.forRoot({
                            loader: {
                                provide: TranslateLoader,
                                useFactory: translatePartialLoader,
                                deps: [HttpClient]
                            },
                            missingTranslationHandler: {
                                provide: MissingTranslationHandler,
                                useFactory: missingTranslationHandler,
                                deps: [JhiConfigService]
                            }
                        }),
                        CommonModule
                    ],
                    declarations: JHI_PIPES.concat(JHI_DIRECTIVES, JHI_COMPONENTS, [
                        JhiTranslateComponent
                    ]),
                    exports: JHI_PIPES.concat(JHI_DIRECTIVES, JHI_COMPONENTS, [
                        JhiTranslateComponent,
                        TranslateModule,
                        CommonModule
                    ])
                },] },
    ];
    return NgJhipsterModule;
}());
export { NgJhipsterModule };
