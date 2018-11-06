import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { forwardRef } from '@angular/core';
import { numberOfBytes } from './number-of-bytes';
var JhiMaxbytesValidatorDirective = /** @class */ (function () {
    function JhiMaxbytesValidatorDirective() {
    }
    JhiMaxbytesValidatorDirective.prototype.validate = function (c) {
        return (c.value && numberOfBytes(c.value) <= this.jhiMaxbytes) ? null : {
            maxbytes: {
                valid: false
            }
        };
    };
    JhiMaxbytesValidatorDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[jhiMaxbytes][ngModel]',
                    providers: [
                        { provide: NG_VALIDATORS, useExisting: forwardRef(function () { return JhiMaxbytesValidatorDirective; }), multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    JhiMaxbytesValidatorDirective.ctorParameters = function () { return []; };
    JhiMaxbytesValidatorDirective.propDecorators = {
        "jhiMaxbytes": [{ type: Input },],
    };
    return JhiMaxbytesValidatorDirective;
}());
export { JhiMaxbytesValidatorDirective };
