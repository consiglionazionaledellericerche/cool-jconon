import { OnInit } from '@angular/core';
import { JhiConfigService } from '../config.service';
import { JhiModuleConfig } from '../config';
export declare class JhiBooleanComponent implements OnInit {
    value: boolean;
    classTrue: string;
    classFalse: string;
    textTrue: string;
    textFalse: string;
    config: JhiModuleConfig;
    constructor(configService: JhiConfigService);
    ngOnInit(): void;
}
