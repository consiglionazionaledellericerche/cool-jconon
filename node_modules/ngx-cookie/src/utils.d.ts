import { CookieOptions } from './cookie-options.model';
export declare function isBlank(obj: any): boolean;
export declare function isPresent(obj: any): boolean;
export declare function isString(obj: any): obj is string;
export declare function mergeOptions(oldOptions: CookieOptions, newOptions?: CookieOptions): CookieOptions;
export declare function safeDecodeURIComponent(str: string): string;
export declare function safeJsonParse(str: string): any;
