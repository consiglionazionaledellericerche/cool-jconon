import { Injectable, Sanitizer, SecurityContext } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JhiConfigService } from '../config.service';
import * as i0 from "@angular/core";
import * as i1 from "../config.service";
import * as i2 from "@ngx-translate/core";
var JhiAlertService = /** @class */ (function () {
    function JhiAlertService(sanitizer, configService, translateService) {
        this.sanitizer = sanitizer;
        this.configService = configService;
        this.translateService = translateService;
        var config = this.configService.getConfig();
        this.toast = config.alertAsToast;
        this.i18nEnabled = config.i18nEnabled;
        this.alertId = 0; // unique id for each alert. Starts from 0.
        this.alerts = [];
        this.timeout = config.alertTimeout;
    }
    JhiAlertService.prototype.clear = function () {
        this.alerts.splice(0, this.alerts.length);
    };
    JhiAlertService.prototype.get = function () {
        return this.alerts;
    };
    JhiAlertService.prototype.success = function (msg, params, position) {
        return this.addAlert({
            type: 'success',
            msg: msg,
            params: params,
            timeout: this.timeout,
            toast: this.isToast(),
            position: position
        }, []);
    };
    JhiAlertService.prototype.error = function (msg, params, position) {
        return this.addAlert({
            type: 'danger',
            msg: msg,
            params: params,
            timeout: this.timeout,
            toast: this.isToast(),
            position: position
        }, []);
    };
    JhiAlertService.prototype.warning = function (msg, params, position) {
        return this.addAlert({
            type: 'warning',
            msg: msg,
            params: params,
            timeout: this.timeout,
            toast: this.isToast(),
            position: position
        }, []);
    };
    JhiAlertService.prototype.info = function (msg, params, position) {
        return this.addAlert({
            type: 'info',
            msg: msg,
            params: params,
            timeout: this.timeout,
            toast: this.isToast(),
            position: position
        }, []);
    };
    JhiAlertService.prototype.factory = function (alertOptions) {
        var _this = this;
        var alert = {
            type: alertOptions.type,
            msg: this.sanitizer.sanitize(SecurityContext.HTML, alertOptions.msg),
            id: alertOptions.id,
            timeout: alertOptions.timeout,
            toast: alertOptions.toast,
            position: alertOptions.position ? alertOptions.position : 'top right',
            scoped: alertOptions.scoped,
            close: function (alerts) {
                return _this.closeAlert(alertOptions.id, alerts);
            }
        };
        if (!alert.scoped) {
            this.alerts.push(alert);
        }
        return alert;
    };
    JhiAlertService.prototype.addAlert = function (alertOptions, extAlerts) {
        var _this = this;
        alertOptions.id = this.alertId++;
        if (this.i18nEnabled && alertOptions.msg) {
            alertOptions.msg = this.translateService.instant(alertOptions.msg, alertOptions.params);
        }
        var alert = this.factory(alertOptions);
        if (alertOptions.timeout && alertOptions.timeout > 0) {
            setTimeout(function () {
                _this.closeAlert(alertOptions.id, extAlerts);
            }, alertOptions.timeout);
        }
        return alert;
    };
    JhiAlertService.prototype.closeAlert = function (id, extAlerts) {
        var thisAlerts = (extAlerts && extAlerts.length > 0) ? extAlerts : this.alerts;
        return this.closeAlertByIndex(thisAlerts.map(function (e) { return e.id; }).indexOf(id), thisAlerts);
    };
    JhiAlertService.prototype.closeAlertByIndex = function (index, thisAlerts) {
        return thisAlerts.splice(index, 1);
    };
    JhiAlertService.prototype.isToast = function () {
        return this.toast;
    };
    JhiAlertService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiAlertService.ctorParameters = function () { return [
        { type: Sanitizer, },
        { type: JhiConfigService, },
        { type: TranslateService, },
    ]; };
    JhiAlertService.ngInjectableDef = i0.defineInjectable({ factory: function JhiAlertService_Factory() { return new JhiAlertService(i0.inject(i0.Sanitizer), i0.inject(i1.JhiConfigService), i0.inject(i2.TranslateService)); }, token: JhiAlertService, providedIn: "root" });
    return JhiAlertService;
}());
export { JhiAlertService };
