import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { forwardRef } from '@angular/core';
import { numberOfBytes } from './number-of-bytes';
var JhiMinbytesValidatorDirective = /** @class */ (function () {
    function JhiMinbytesValidatorDirective() {
    }
    JhiMinbytesValidatorDirective.prototype.validate = function (c) {
        return (c.value && numberOfBytes(c.value) >= this.jhiMinbytes) ? null : {
            minbytes: {
                valid: false
            }
        };
    };
    JhiMinbytesValidatorDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[jhiMinbytes][ngModel]',
                    providers: [
                        { provide: NG_VALIDATORS, useExisting: forwardRef(function () { return JhiMinbytesValidatorDirective; }), multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    JhiMinbytesValidatorDirective.ctorParameters = function () { return []; };
    JhiMinbytesValidatorDirective.propDecorators = {
        "jhiMinbytes": [{ type: Input },],
    };
    return JhiMinbytesValidatorDirective;
}());
export { JhiMinbytesValidatorDirective };
