var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import { Injectable } from '@angular/core';
import { JhiModuleConfig } from './config';
import * as i0 from "@angular/core";
import * as i1 from "./config";
var JhiConfigService = /** @class */ (function () {
    function JhiConfigService(moduleConfig) {
        this.CONFIG_OPTIONS = __assign({}, new JhiModuleConfig(), moduleConfig);
    }
    JhiConfigService.prototype.getConfig = function () {
        return this.CONFIG_OPTIONS;
    };
    JhiConfigService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiConfigService.ctorParameters = function () { return [
        { type: JhiModuleConfig, },
    ]; };
    JhiConfigService.ngInjectableDef = i0.defineInjectable({ factory: function JhiConfigService_Factory() { return new JhiConfigService(i0.inject(i1.JhiModuleConfig)); }, token: JhiConfigService, providedIn: "root" });
    return JhiConfigService;
}());
export { JhiConfigService };
