import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS } from '@angular/forms';
import { forwardRef } from '@angular/core';
var JhiMaxValidatorDirective = /** @class */ (function () {
    function JhiMaxValidatorDirective() {
    }
    JhiMaxValidatorDirective.prototype.validate = function (c) {
        return (c.value === undefined || c.value === null || c.value <= this.jhiMax) ? null : {
            max: {
                valid: false
            }
        };
    };
    JhiMaxValidatorDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[jhiMax][ngModel]',
                    providers: [
                        { provide: NG_VALIDATORS, useExisting: forwardRef(function () { return JhiMaxValidatorDirective; }), multi: true }
                    ]
                },] },
    ];
    /** @nocollapse */
    JhiMaxValidatorDirective.ctorParameters = function () { return []; };
    JhiMaxValidatorDirective.propDecorators = {
        "jhiMax": [{ type: Input },],
    };
    return JhiMaxValidatorDirective;
}());
export { JhiMaxValidatorDirective };
