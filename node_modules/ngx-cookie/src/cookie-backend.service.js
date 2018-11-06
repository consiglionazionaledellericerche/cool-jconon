var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Inject, Injectable } from '@angular/core';
import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
var CookieBackendService = (function (_super) {
    __extends(CookieBackendService, _super);
    function CookieBackendService(request, response, _optionsProvider) {
        var _this = _super.call(this, _optionsProvider) || this;
        _this.request = request;
        _this.response = response;
        return _this;
    }
    Object.defineProperty(CookieBackendService.prototype, "cookieString", {
        get: function () {
            return this.request.headers.cookie || '';
        },
        set: function (val) {
            this.request.headers.cookie = val;
            this.response.headers.cookie = val;
        },
        enumerable: true,
        configurable: true
    });
    CookieBackendService.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CookieBackendService.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: ['REQUEST',] },] },
        { type: undefined, decorators: [{ type: Inject, args: ['RESPONSE',] },] },
        { type: CookieOptionsProvider, },
    ]; };
    return CookieBackendService;
}(CookieService));
export { CookieBackendService };
