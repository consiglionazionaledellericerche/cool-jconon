import { JhiModuleConfig } from './config';
export declare class JhiConfigService {
    CONFIG_OPTIONS: JhiModuleConfig;
    constructor(moduleConfig?: JhiModuleConfig);
    getConfig(): JhiModuleConfig;
}
