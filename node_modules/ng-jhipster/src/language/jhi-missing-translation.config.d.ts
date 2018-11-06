import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';
import { JhiConfigService } from '../config.service';
export declare class JhiMissingTranslationHandler implements MissingTranslationHandler {
    private configService;
    constructor(configService: JhiConfigService);
    handle(params: MissingTranslationHandlerParams): string;
}
