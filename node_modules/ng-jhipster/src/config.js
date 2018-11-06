import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
var JhiModuleConfig = /** @class */ (function () {
    function JhiModuleConfig() {
        this.sortIcon = 'fa-sort';
        this.sortAscIcon = 'fa-sort-up';
        this.sortDescIcon = 'fa-sort-down';
        this.sortIconSelector = 'span.fa';
        this.i18nEnabled = false;
        this.defaultI18nLang = 'en';
        this.noi18nMessage = 'translation-not-found';
        this.alertAsToast = false;
        this.alertTimeout = 5000;
        this.classBadgeTrue = 'badge badge-success';
        this.classBadgeFalse = 'badge badge-danger';
        this.classTrue = 'fa fa-lg fa-check text-success';
        this.classFalse = 'fa fa-lg fa-times text-danger';
    }
    JhiModuleConfig.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    JhiModuleConfig.ngInjectableDef = i0.defineInjectable({ factory: function JhiModuleConfig_Factory() { return new JhiModuleConfig(); }, token: JhiModuleConfig, providedIn: "root" });
    return JhiModuleConfig;
}());
export { JhiModuleConfig };
