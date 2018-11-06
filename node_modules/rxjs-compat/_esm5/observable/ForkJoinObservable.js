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
import { Observable, forkJoin } from 'rxjs';
var ForkJoinObservable = /** @class */ (function (_super) {
    __extends(ForkJoinObservable, _super);
    function ForkJoinObservable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* tslint:enable:max-line-length */
    ForkJoinObservable.create = function () {
        var sources = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            sources[_i] = arguments[_i];
        }
        return forkJoin.apply(void 0, sources);
    };
    return ForkJoinObservable;
}(Observable));
export { ForkJoinObservable };
//# sourceMappingURL=ForkJoinObservable.js.map