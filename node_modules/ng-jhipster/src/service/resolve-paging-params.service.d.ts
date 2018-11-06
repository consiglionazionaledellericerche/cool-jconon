import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { JhiPaginationUtil } from './pagination-util.service';
export declare class JhiResolvePagingParams implements Resolve<any> {
    private paginationUtil;
    constructor(paginationUtil: JhiPaginationUtil);
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): {
        page: number;
        predicate: string;
        ascending: boolean;
    };
}
