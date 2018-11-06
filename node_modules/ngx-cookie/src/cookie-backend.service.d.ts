import { CookieService } from './cookie.service';
import { CookieOptionsProvider } from './cookie-options-provider';
export declare class CookieBackendService extends CookieService {
    private request;
    private response;
    constructor(request: any, response: any, _optionsProvider: CookieOptionsProvider);
    protected cookieString: string;
}
