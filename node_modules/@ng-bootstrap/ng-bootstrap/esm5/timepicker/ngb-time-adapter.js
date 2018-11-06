/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { isInteger } from '../util/util';
/**
 * Abstract type serving as a DI token for the service converting from your application Time model to internal
 * NgbTimeStruct model.
 * A default implementation converting from and to NgbTimeStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 *
 * \@since 2.2.0
 * @abstract
 * @template T
 */
var NgbTimeAdapter = /** @class */ (function () {
    function NgbTimeAdapter() {
    }
    NgbTimeAdapter.decorators = [
        { type: Injectable },
    ];
    return NgbTimeAdapter;
}());
export { NgbTimeAdapter };
if (false) {
    /**
     * Converts user-model date into an NgbTimeStruct for internal use in the library
     * @abstract
     * @param {?} value
     * @return {?}
     */
    NgbTimeAdapter.prototype.fromModel = function (value) { };
    /**
     * Converts internal time value NgbTimeStruct to user-model date
     * The returned type is supposed to be of the same type as fromModel() input-value param
     * @abstract
     * @param {?} time
     * @return {?}
     */
    NgbTimeAdapter.prototype.toModel = function (time) { };
}
var NgbTimeStructAdapter = /** @class */ (function (_super) {
    tslib_1.__extends(NgbTimeStructAdapter, _super);
    function NgbTimeStructAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     */
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    NgbTimeStructAdapter.prototype.fromModel = /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    function (time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    };
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     */
    /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    NgbTimeStructAdapter.prototype.toModel = /**
     * Converts a NgbTimeStruct value into NgbTimeStruct value
     * @param {?} time
     * @return {?}
     */
    function (time) {
        return (time && isInteger(time.hour) && isInteger(time.minute)) ?
            { hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null } :
            null;
    };
    NgbTimeStructAdapter.decorators = [
        { type: Injectable },
    ];
    return NgbTimeStructAdapter;
}(NgbTimeAdapter));
export { NgbTimeStructAdapter };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLXRpbWUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsidGltZXBpY2tlci9uZ2ItdGltZS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUV6QyxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sY0FBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Z0JBVXRDLFVBQVU7O3lCQVpYOztTQWFzQixjQUFjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBY00sZ0RBQTZCOzs7O0lBQ3JFOztPQUVHOzs7Ozs7SUFDSCx3Q0FBUzs7Ozs7SUFBVCxVQUFVLElBQW1CO1FBQzNCLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7WUFDN0YsSUFBSSxDQUFDO0tBQ1Y7SUFFRDs7T0FFRzs7Ozs7O0lBQ0gsc0NBQU87Ozs7O0lBQVAsVUFBUSxJQUFtQjtRQUN6QixNQUFNLENBQUMsQ0FBQyxJQUFJLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBQzdGLElBQUksQ0FBQztLQUNWOztnQkFsQkYsVUFBVTs7K0JBMUJYO0VBMkIwQyxjQUFjO1NBQTNDLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge05nYlRpbWVTdHJ1Y3R9IGZyb20gJy4vbmdiLXRpbWUtc3RydWN0JztcbmltcG9ydCB7aXNJbnRlZ2VyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuXG4vKipcbiAqIEFic3RyYWN0IHR5cGUgc2VydmluZyBhcyBhIERJIHRva2VuIGZvciB0aGUgc2VydmljZSBjb252ZXJ0aW5nIGZyb20geW91ciBhcHBsaWNhdGlvbiBUaW1lIG1vZGVsIHRvIGludGVybmFsXG4gKiBOZ2JUaW1lU3RydWN0IG1vZGVsLlxuICogQSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIGNvbnZlcnRpbmcgZnJvbSBhbmQgdG8gTmdiVGltZVN0cnVjdCBpcyBwcm92aWRlZCBmb3IgcmV0cm8tY29tcGF0aWJpbGl0eSxcbiAqIGJ1dCB5b3UgY2FuIHByb3ZpZGUgYW5vdGhlciBpbXBsZW1lbnRhdGlvbiB0byB1c2UgYW4gYWx0ZXJuYXRpdmUgZm9ybWF0LCBpZSBmb3IgdXNpbmcgd2l0aCBuYXRpdmUgRGF0ZSBPYmplY3QuXG4gKlxuICogQHNpbmNlIDIuMi4wXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ2JUaW1lQWRhcHRlcjxUPiB7XG4gIC8qKlxuICAgKiBDb252ZXJ0cyB1c2VyLW1vZGVsIGRhdGUgaW50byBhbiBOZ2JUaW1lU3RydWN0IGZvciBpbnRlcm5hbCB1c2UgaW4gdGhlIGxpYnJhcnlcbiAgICovXG4gIGFic3RyYWN0IGZyb21Nb2RlbCh2YWx1ZTogVCk6IE5nYlRpbWVTdHJ1Y3Q7XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIGludGVybmFsIHRpbWUgdmFsdWUgTmdiVGltZVN0cnVjdCB0byB1c2VyLW1vZGVsIGRhdGVcbiAgICogVGhlIHJldHVybmVkIHR5cGUgaXMgc3VwcG9zZWQgdG8gYmUgb2YgdGhlIHNhbWUgdHlwZSBhcyBmcm9tTW9kZWwoKSBpbnB1dC12YWx1ZSBwYXJhbVxuICAgKi9cbiAgYWJzdHJhY3QgdG9Nb2RlbCh0aW1lOiBOZ2JUaW1lU3RydWN0KTogVDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYlRpbWVTdHJ1Y3RBZGFwdGVyIGV4dGVuZHMgTmdiVGltZUFkYXB0ZXI8TmdiVGltZVN0cnVjdD4ge1xuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JUaW1lU3RydWN0IHZhbHVlIGludG8gTmdiVGltZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgZnJvbU1vZGVsKHRpbWU6IE5nYlRpbWVTdHJ1Y3QpOiBOZ2JUaW1lU3RydWN0IHtcbiAgICByZXR1cm4gKHRpbWUgJiYgaXNJbnRlZ2VyKHRpbWUuaG91cikgJiYgaXNJbnRlZ2VyKHRpbWUubWludXRlKSkgP1xuICAgICAgICB7aG91cjogdGltZS5ob3VyLCBtaW51dGU6IHRpbWUubWludXRlLCBzZWNvbmQ6IGlzSW50ZWdlcih0aW1lLnNlY29uZCkgPyB0aW1lLnNlY29uZCA6IG51bGx9IDpcbiAgICAgICAgbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIE5nYlRpbWVTdHJ1Y3QgdmFsdWUgaW50byBOZ2JUaW1lU3RydWN0IHZhbHVlXG4gICAqL1xuICB0b01vZGVsKHRpbWU6IE5nYlRpbWVTdHJ1Y3QpOiBOZ2JUaW1lU3RydWN0IHtcbiAgICByZXR1cm4gKHRpbWUgJiYgaXNJbnRlZ2VyKHRpbWUuaG91cikgJiYgaXNJbnRlZ2VyKHRpbWUubWludXRlKSkgP1xuICAgICAgICB7aG91cjogdGltZS5ob3VyLCBtaW51dGU6IHRpbWUubWludXRlLCBzZWNvbmQ6IGlzSW50ZWdlcih0aW1lLnNlY29uZCkgPyB0aW1lLnNlY29uZCA6IG51bGx9IDpcbiAgICAgICAgbnVsbDtcbiAgfVxufVxuIl19