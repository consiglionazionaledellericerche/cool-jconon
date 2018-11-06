var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Observable, bindCallback } from 'rxjs';
var BoundCallbackObservable = /** @class */ (function (_super) {
    __extends(BoundCallbackObservable, _super);
    function BoundCallbackObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:max-line-length */
    BoundCallbackObservable.create = function (func, selector, scheduler) {
        if (selector === void 0) { selector = undefined; }
        return bindCallback(func, selector, scheduler);
    };
    return BoundCallbackObservable;
}(Observable));
export { BoundCallbackObservable };
//# sourceMappingURL=BoundCallbackObservable.js.map