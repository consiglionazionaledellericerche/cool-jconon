import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * An utility service for date.
 */
var JhiDateUtils = /** @class */ (function () {
    function JhiDateUtils() {
        this.pattern = 'yyyy-MM-dd';
        this.datePipe = new DatePipe('en');
    }
    /**
     * Method to convert the date time from server into JS date object
     */
    /**
         * Method to convert the date time from server into JS date object
         */
    JhiDateUtils.prototype.convertDateTimeFromServer = /**
         * Method to convert the date time from server into JS date object
         */
    function (date) {
        if (date) {
            return new Date(date);
        }
        else {
            return null;
        }
    };
    /**
     * Method to convert the date from server into JS date object
     */
    /**
         * Method to convert the date from server into JS date object
         */
    JhiDateUtils.prototype.convertLocalDateFromServer = /**
         * Method to convert the date from server into JS date object
         */
    function (date) {
        if (date) {
            var dateString = date.split('-');
            return new Date(dateString[0], dateString[1] - 1, dateString[2]);
        }
        return null;
    };
    /**
     * Method to convert the JS date object into specified date pattern
     */
    /**
         * Method to convert the JS date object into specified date pattern
         */
    JhiDateUtils.prototype.convertLocalDateToServer = /**
         * Method to convert the JS date object into specified date pattern
         */
    function (date, pattern) {
        if (pattern === void 0) { pattern = this.pattern; }
        if (date) {
            var newDate = new Date(date.year, date.month - 1, date.day);
            return this.datePipe.transform(newDate, pattern);
        }
        else {
            return null;
        }
    };
    /**
     * Method to get the default date pattern
     */
    /**
         * Method to get the default date pattern
         */
    JhiDateUtils.prototype.dateformat = /**
         * Method to get the default date pattern
         */
    function () {
        return this.pattern;
    };
    // TODO Change this method when moving from datetime-local input to NgbDatePicker
    // TODO Change this method when moving from datetime-local input to NgbDatePicker
    JhiDateUtils.prototype.toDate = 
    // TODO Change this method when moving from datetime-local input to NgbDatePicker
    function (date) {
        if (date === undefined || date === null) {
            return null;
        }
        var dateParts = date.split(/\D+/);
        if (dateParts.length === 7) {
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5], dateParts[6]);
        }
        if (dateParts.length === 6) {
            return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4], dateParts[5]);
        }
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2], dateParts[3], dateParts[4]);
    };
    JhiDateUtils.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiDateUtils.ctorParameters = function () { return []; };
    JhiDateUtils.ngInjectableDef = i0.defineInjectable({ factory: function JhiDateUtils_Factory() { return new JhiDateUtils(); }, token: JhiDateUtils, providedIn: "root" });
    return JhiDateUtils;
}());
export { JhiDateUtils };
