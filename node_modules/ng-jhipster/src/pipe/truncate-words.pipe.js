import { Pipe } from '@angular/core';
var JhiTruncateWordsPipe = /** @class */ (function () {
    function JhiTruncateWordsPipe() {
    }
    JhiTruncateWordsPipe.prototype.transform = function (input, words) {
        if (isNaN(words)) {
            return input;
        }
        if (words <= 0) {
            return '';
        }
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + '...';
            }
        }
        return input;
    };
    JhiTruncateWordsPipe.decorators = [
        { type: Pipe, args: [{ name: 'truncateWords' },] },
    ];
    return JhiTruncateWordsPipe;
}());
export { JhiTruncateWordsPipe };
