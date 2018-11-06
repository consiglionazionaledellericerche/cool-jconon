import { Inject, Injectable, InjectionToken, Injector } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { mergeOptions } from './utils';
export var COOKIE_OPTIONS = new InjectionToken('COOKIE_OPTIONS');
/** @private */
var CookieOptionsProvider = (function () {
    function CookieOptionsProvider(options, _injector) {
        if (options === void 0) { options = {}; }
        this._injector = _injector;
        this.defaultOptions = {
            path: this._injector.get(APP_BASE_HREF, '/'),
            domain: null,
            expires: null,
            secure: false,
            httpOnly: false
        };
        this._options = mergeOptions(this.defaultOptions, options);
    }
    Object.defineProperty(CookieOptionsProvider.prototype, "options", {
        get: function () {
            return this._options;
        },
        enumerable: true,
        configurable: true
    });
    CookieOptionsProvider.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    CookieOptionsProvider.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [COOKIE_OPTIONS,] },] },
        { type: Injector, },
    ]; };
    return CookieOptionsProvider;
}());
export { CookieOptionsProvider };
