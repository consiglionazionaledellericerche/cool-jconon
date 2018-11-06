import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from '../config.service';
export declare class JhiLanguageService {
    private translateService;
    private configService;
    currentLang: string;
    constructor(translateService: TranslateService, configService: JhiConfigService);
    init(): void;
    changeLanguage(languageKey: string): void;
    getCurrent(): Promise<string>;
}
