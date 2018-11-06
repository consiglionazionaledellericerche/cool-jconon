import { JhiConfigService } from '../config.service';
export declare class JhiItemCountComponent {
    page: number;
    total: number;
    itemsPerPage: number;
    i18nEnabled: boolean;
    i18nValues(): string;
    constructor(config: JhiConfigService);
}
