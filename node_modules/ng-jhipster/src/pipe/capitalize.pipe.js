import { Pipe } from '@angular/core';
var JhiCapitalizePipe = /** @class */ (function () {
    function JhiCapitalizePipe() {
    }
    JhiCapitalizePipe.prototype.transform = function (input) {
        if (input !== null) {
            input = input.toLowerCase();
        }
        return input.substring(0, 1).toUpperCase() + input.substring(1);
    };
    JhiCapitalizePipe.decorators = [
        { type: Pipe, args: [{ name: 'capitalize' },] },
    ];
    return JhiCapitalizePipe;
}());
export { JhiCapitalizePipe };
