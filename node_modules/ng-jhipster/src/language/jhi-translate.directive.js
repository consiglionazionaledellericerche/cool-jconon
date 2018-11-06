import { Component, Input } from '@angular/core';
/**
 * A wrapper directive on top of the translate pipe as the inbuilt translate directive from ngx-translate is too verbose and buggy
 */
/* tslint:disable */
var JhiTranslateComponent = /** @class */ (function () {
    function JhiTranslateComponent() {
    }
    JhiTranslateComponent.decorators = [
        { type: Component, args: [{
                    selector: '[jhiTranslate]',
                    template: '<span [innerHTML]="jhiTranslate | translate:translateValues"></span>'
                },] },
    ];
    /** @nocollapse */
    JhiTranslateComponent.propDecorators = {
        "jhiTranslate": [{ type: Input },],
        "translateValues": [{ type: Input },],
    };
    return JhiTranslateComponent;
}());
export { JhiTranslateComponent };
/* tslint:enable */
