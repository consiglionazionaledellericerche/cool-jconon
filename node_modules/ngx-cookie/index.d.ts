import { ModuleWithProviders } from '@angular/core';
import { CookieOptions } from './src/cookie-options.model';
export * from './src/cookie.service';
export * from './src/cookie-backend.service';
export * from './src/cookie-options.model';
export * from './src/cookie-options-provider';
export * from './src/cookie.factory';
export * from './src/utils';
export declare class CookieModule {
    /**
     * Use this method in your root module to provide the CookieService
     * @param {CookieOptions} options
     * @returns {ModuleWithProviders}
     */
    static forRoot(options?: CookieOptions): ModuleWithProviders;
    /**
     * Use this method in your other (non root) modules to import the directive/pipe
     * @param {CookieOptions} options
     * @returns {ModuleWithProviders}
     */
    static forChild(options?: CookieOptions): ModuleWithProviders;
}
