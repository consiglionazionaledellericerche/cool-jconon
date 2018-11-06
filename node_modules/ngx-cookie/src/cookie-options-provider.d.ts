import { InjectionToken, Injector } from '@angular/core';
import { CookieOptions } from './cookie-options.model';
export declare const COOKIE_OPTIONS: InjectionToken<CookieOptions>;
/** @private */
export declare class CookieOptionsProvider {
    private _injector;
    private defaultOptions;
    private _options;
    constructor(options: CookieOptions, _injector: Injector);
    readonly options: CookieOptions;
}
