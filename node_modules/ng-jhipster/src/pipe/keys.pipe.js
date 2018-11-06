import { Pipe } from '@angular/core';
var JhiKeysPipe = /** @class */ (function () {
    function JhiKeysPipe() {
    }
    JhiKeysPipe.prototype.transform = function (value) {
        var keys = [];
        var valueKeys = Object.keys(value);
        for (var i = 0; i < valueKeys.length; i++) {
            var key = valueKeys[i];
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    };
    JhiKeysPipe.decorators = [
        { type: Pipe, args: [{ name: 'keys' },] },
    ];
    return JhiKeysPipe;
}());
export { JhiKeysPipe };
