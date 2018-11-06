import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from '../config.service';
import * as i0 from "@angular/core";
import * as i1 from "@ngx-translate/core";
import * as i2 from "../config.service";
var JhiLanguageService = /** @class */ (function () {
    function JhiLanguageService(translateService, configService) {
        this.translateService = translateService;
        this.configService = configService;
        this.currentLang = 'en';
        this.init();
    }
    JhiLanguageService.prototype.init = function () {
        var config = this.configService.getConfig();
        this.currentLang = config.defaultI18nLang;
        this.translateService.setDefaultLang(this.currentLang);
        this.translateService.use(this.currentLang);
    };
    JhiLanguageService.prototype.changeLanguage = function (languageKey) {
        this.currentLang = languageKey;
        this.configService.CONFIG_OPTIONS.defaultI18nLang = languageKey;
        this.translateService.use(this.currentLang);
    };
    JhiLanguageService.prototype.getCurrent = function () {
        return Promise.resolve(this.currentLang);
    };
    JhiLanguageService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiLanguageService.ctorParameters = function () { return [
        { type: TranslateService, },
        { type: JhiConfigService, },
    ]; };
    JhiLanguageService.ngInjectableDef = i0.defineInjectable({ factory: function JhiLanguageService_Factory() { return new JhiLanguageService(i0.inject(i1.TranslateService), i0.inject(i2.JhiConfigService)); }, token: JhiLanguageService, providedIn: "root" });
    return JhiLanguageService;
}());
export { JhiLanguageService };
