import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * An utility service for pagination
 */
var JhiPaginationUtil = /** @class */ (function () {
    function JhiPaginationUtil() {
    }
    /**
     * Method to find whether the sort is defined
     */
    /**
         * Method to find whether the sort is defined
         */
    JhiPaginationUtil.prototype.parseAscending = /**
         * Method to find whether the sort is defined
         */
    function (sort) {
        var sortArray = sort.split(',');
        sortArray = sortArray.length > 1 ? sortArray : sort.split('%2C');
        if (sortArray.length > 1) {
            return sortArray.slice(-1)[0] === 'asc';
        }
        // default to true if no sort is defined
        return true;
    };
    /**
     * Method to query params are strings, and need to be parsed
     */
    /**
         * Method to query params are strings, and need to be parsed
         */
    JhiPaginationUtil.prototype.parsePage = /**
         * Method to query params are strings, and need to be parsed
         */
    function (page) {
        return parseInt(page, 10);
    };
    /**
     * Method to sort can be in the format `id,asc` or `id`
     */
    /**
         * Method to sort can be in the format `id,asc` or `id`
         */
    JhiPaginationUtil.prototype.parsePredicate = /**
         * Method to sort can be in the format `id,asc` or `id`
         */
    function (sort) {
        return sort.split(',')[0].split('%2C')[0];
    };
    JhiPaginationUtil.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiPaginationUtil.ctorParameters = function () { return []; };
    JhiPaginationUtil.ngInjectableDef = i0.defineInjectable({ factory: function JhiPaginationUtil_Factory() { return new JhiPaginationUtil(); }, token: JhiPaginationUtil, providedIn: "root" });
    return JhiPaginationUtil;
}());
export { JhiPaginationUtil };
