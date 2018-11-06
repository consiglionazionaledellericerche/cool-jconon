import { Injectable } from '@angular/core';
import { JhiPaginationUtil } from './pagination-util.service';
import * as i0 from "@angular/core";
import * as i1 from "./pagination-util.service";
var JhiResolvePagingParams = /** @class */ (function () {
    function JhiResolvePagingParams(paginationUtil) {
        this.paginationUtil = paginationUtil;
    }
    JhiResolvePagingParams.prototype.resolve = function (route, state) {
        var page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        var defaultSort = route.data['defaultSort'] ? route.data['defaultSort'] : 'id,asc';
        var sort = route.queryParams['sort'] ? route.queryParams['sort'] : defaultSort;
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
        };
    };
    JhiResolvePagingParams.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiResolvePagingParams.ctorParameters = function () { return [
        { type: JhiPaginationUtil, },
    ]; };
    JhiResolvePagingParams.ngInjectableDef = i0.defineInjectable({ factory: function JhiResolvePagingParams_Factory() { return new JhiResolvePagingParams(i0.inject(i1.JhiPaginationUtil)); }, token: JhiResolvePagingParams, providedIn: "root" });
    return JhiResolvePagingParams;
}());
export { JhiResolvePagingParams };
