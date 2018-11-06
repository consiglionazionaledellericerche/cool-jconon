import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * An utility service for data.
 */
var JhiDataUtils = /** @class */ (function () {
    function JhiDataUtils() {
    }
    /**
     * Method to abbreviate the text given
     */
    /**
         * Method to abbreviate the text given
         */
    JhiDataUtils.prototype.abbreviate = /**
         * Method to abbreviate the text given
         */
    function (text, append) {
        if (append === void 0) { append = '...'; }
        if (text.length < 30) {
            return text;
        }
        return text ? (text.substring(0, 15) + append + text.slice(-10)) : '';
    };
    /**
     * Method to find the byte size of the string provides
     */
    /**
         * Method to find the byte size of the string provides
         */
    JhiDataUtils.prototype.byteSize = /**
         * Method to find the byte size of the string provides
         */
    function (base64String) {
        return this.formatAsBytes(this.size(base64String));
    };
    /**
     * Method to open file
     */
    /**
         * Method to open file
         */
    JhiDataUtils.prototype.openFile = /**
         * Method to open file
         */
    function (contentType, data) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // To support IE and Edge
            var byteCharacters = atob(data);
            var byteNumbers = new Array(byteCharacters.length);
            for (var i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            var blob = new Blob([byteArray], {
                type: contentType
            });
            window.navigator.msSaveOrOpenBlob(blob);
        }
        else {
            // Other browsers
            var fileURL = "data:" + contentType + ";base64," + data;
            var win = window.open();
            win.document.write('<iframe src="' + fileURL + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
        }
    };
    /**
     * Method to convert the file to base64
     */
    /**
         * Method to convert the file to base64
         */
    JhiDataUtils.prototype.toBase64 = /**
         * Method to convert the file to base64
         */
    function (file, cb) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            var base64Data = e.target.result.substr(e.target.result.indexOf('base64,') + 'base64,'.length);
            cb(base64Data);
        };
    };
    /**
     * Method to clear the input
     */
    /**
         * Method to clear the input
         */
    JhiDataUtils.prototype.clearInputImage = /**
         * Method to clear the input
         */
    function (entity, elementRef, field, fieldContentType, idInput) {
        console.log(elementRef);
        console.log(entity);
        if (entity && field && fieldContentType) {
            if (entity.hasOwnProperty(field)) {
                entity[field] = null;
            }
            if (entity.hasOwnProperty(fieldContentType)) {
                entity[fieldContentType] = null;
            }
            if (elementRef && idInput && elementRef.nativeElement.querySelector('#' + idInput)) {
                elementRef.nativeElement.querySelector('#' + idInput).value = null;
            }
        }
    };
    JhiDataUtils.prototype.endsWith = function (suffix, str) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };
    JhiDataUtils.prototype.paddingSize = function (value) {
        if (this.endsWith('==', value)) {
            return 2;
        }
        if (this.endsWith('=', value)) {
            return 1;
        }
        return 0;
    };
    JhiDataUtils.prototype.size = function (value) {
        return value.length / 4 * 3 - this.paddingSize(value);
    };
    JhiDataUtils.prototype.formatAsBytes = function (size) {
        return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' bytes';
    };
    JhiDataUtils.prototype.setFileData = function (event, entity, field, isImage) {
        if (event && event.target.files && event.target.files[0]) {
            var file_1 = event.target.files[0];
            if (isImage && !/^image\//.test(file_1.type)) {
                return;
            }
            this.toBase64(file_1, function (base64Data) {
                entity[field] = base64Data;
                entity[field + "ContentType"] = file_1.type;
            });
        }
    };
    JhiDataUtils.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] },
    ];
    /** @nocollapse */
    JhiDataUtils.ctorParameters = function () { return []; };
    JhiDataUtils.ngInjectableDef = i0.defineInjectable({ factory: function JhiDataUtils_Factory() { return new JhiDataUtils(); }, token: JhiDataUtils, providedIn: "root" });
    return JhiDataUtils;
}());
export { JhiDataUtils };
