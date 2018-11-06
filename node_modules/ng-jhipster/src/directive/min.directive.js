import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { forwardRef } from '@angular/core';
var JhiMinValidatorDirective = /** @class */ (function () {
    function JhiMinValidatorDirective() {
    }
    JhiMinValidatorDirective.prototype.validate = function (c) {
        return (c.value === undefined || c.value === null || c.value >= this.jhiMin) ? null : {
            min: {
                valid: false
            }
        };
    };
    JhiMinValidatorDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[jhiMin][ngModel]',
                    providers: [
                        { provide: NG_VALIDATORS, useExisting: forwardRef(function () { return JhiMinValidatorDirective; }), multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    JhiMinValidatorDirective.ctorParameters = function () { return []; };
    JhiMinValidatorDirective.propDecorators = {
        "jhiMin": [{ type: Input },],
    };
    return JhiMinValidatorDirective;
}());
export { JhiMinValidatorDirective };
