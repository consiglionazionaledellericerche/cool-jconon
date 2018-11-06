import { ModuleWithProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JhiMissingTranslationHandler } from './src/language';
import { JhiModuleConfig } from './src/config';
import { JhiConfigService } from './src/config.service';
export * from './src/pipe';
export * from './src/directive';
export * from './src/service';
export * from './src/component';
export * from './src/language';
export * from './src/config.service';
export * from './src/config';
export declare function translatePartialLoader(http: HttpClient): TranslateHttpLoader;
export declare function missingTranslationHandler(configService: JhiConfigService): JhiMissingTranslationHandler;
export declare class NgJhipsterModule {
    static forRoot(moduleConfig: JhiModuleConfig): ModuleWithProviders;
    static forChild(moduleConfig: JhiModuleConfig): ModuleWithProviders;
}
