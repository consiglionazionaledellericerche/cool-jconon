import { Sanitizer } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from '../config.service';
export declare type JhiAlertType = 'success' | 'danger' | 'warning' | 'info';
export interface JhiAlert {
    id?: number;
    type: JhiAlertType;
    msg: string;
    params?: any;
    timeout?: number;
    toast?: boolean;
    position?: string;
    scoped?: boolean;
    close?: (alerts: JhiAlert[]) => void;
}
export declare class JhiAlertService {
    private sanitizer;
    private configService;
    private translateService;
    private alertId;
    private alerts;
    private timeout;
    private toast;
    private i18nEnabled;
    constructor(sanitizer: Sanitizer, configService: JhiConfigService, translateService: TranslateService);
    clear(): void;
    get(): JhiAlert[];
    success(msg: string, params?: any, position?: string): JhiAlert;
    error(msg: string, params?: any, position?: string): JhiAlert;
    warning(msg: string, params?: any, position?: string): JhiAlert;
    info(msg: string, params?: any, position?: string): JhiAlert;
    private factory(alertOptions);
    addAlert(alertOptions: JhiAlert, extAlerts: JhiAlert[]): JhiAlert;
    closeAlert(id: number, extAlerts?: JhiAlert[]): any;
    closeAlertByIndex(index: number, thisAlerts: JhiAlert[]): JhiAlert[];
    isToast(): boolean;
}
