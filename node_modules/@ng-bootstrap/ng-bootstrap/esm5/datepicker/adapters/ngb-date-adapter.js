/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
/**
 * Abstract type serving as a DI token for the service converting from your application Date model to internal
 * NgbDateStruct model.
 * A default implementation converting from and to NgbDateStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 * @abstract
 * @template D
 */
var NgbDateAdapter = /** @class */ (function () {
    function NgbDateAdapter() {
    }
    NgbDateAdapter.decorators = [
        { type: Injectable },
    ];
    return NgbDateAdapter;
}());
export { NgbDateAdapter };
if (false) {
    /**
     * Converts user-model date into an NgbDateStruct for internal use in the library
     * @abstract
     * @param {?} value
     * @return {?}
     */
    NgbDateAdapter.prototype.fromModel = function (value) { };
    /**
     * Converts internal date value NgbDateStruct to user-model date
     * The returned type is suposed to be of the same type as fromModel() input-value param
     * @abstract
     * @param {?} date
     * @return {?}
     */
    NgbDateAdapter.prototype.toModel = function (date) { };
}
var NgbDateStructAdapter = /** @class */ (function (_super) {
    tslib_1.__extends(NgbDateStructAdapter, _super);
    function NgbDateStructAdapter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    NgbDateStructAdapter.prototype.fromModel = /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return (date && date.year && date.month && date.day) ? { year: date.year, month: date.month, day: date.day } : null;
    };
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     */
    /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    NgbDateStructAdapter.prototype.toModel = /**
     * Converts a NgbDateStruct value into NgbDateStruct value
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return (date && date.year && date.month && date.day) ? { year: date.year, month: date.month, day: date.day } : null;
    };
    NgbDateStructAdapter.decorators = [
        { type: Injectable },
    ];
    return NgbDateStructAdapter;
}(NgbDateAdapter));
export { NgbDateStructAdapter };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtYWRhcHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9hZGFwdGVycy9uZ2ItZGF0ZS1hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7OztnQkFTeEMsVUFBVTs7eUJBVFg7O1NBVXNCLGNBQWM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjTSxnREFBNkI7Ozs7SUFDckU7O09BRUc7Ozs7OztJQUNILHdDQUFTOzs7OztJQUFULFVBQVUsSUFBbUI7UUFDM0IsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ25IO0lBRUQ7O09BRUc7Ozs7OztJQUNILHNDQUFPOzs7OztJQUFQLFVBQVEsSUFBbUI7UUFDekIsTUFBTSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0tBQ25IOztnQkFkRixVQUFVOzsrQkF2Qlg7RUF3QjBDLGNBQWM7U0FBM0Msb0JBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7TmdiRGF0ZVN0cnVjdH0gZnJvbSAnLi4vbmdiLWRhdGUtc3RydWN0JztcblxuLyoqXG4gKiBBYnN0cmFjdCB0eXBlIHNlcnZpbmcgYXMgYSBESSB0b2tlbiBmb3IgdGhlIHNlcnZpY2UgY29udmVydGluZyBmcm9tIHlvdXIgYXBwbGljYXRpb24gRGF0ZSBtb2RlbCB0byBpbnRlcm5hbFxuICogTmdiRGF0ZVN0cnVjdCBtb2RlbC5cbiAqIEEgZGVmYXVsdCBpbXBsZW1lbnRhdGlvbiBjb252ZXJ0aW5nIGZyb20gYW5kIHRvIE5nYkRhdGVTdHJ1Y3QgaXMgcHJvdmlkZWQgZm9yIHJldHJvLWNvbXBhdGliaWxpdHksXG4gKiBidXQgeW91IGNhbiBwcm92aWRlIGFub3RoZXIgaW1wbGVtZW50YXRpb24gdG8gdXNlIGFuIGFsdGVybmF0aXZlIGZvcm1hdCwgaWUgZm9yIHVzaW5nIHdpdGggbmF0aXZlIERhdGUgT2JqZWN0LlxuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTmdiRGF0ZUFkYXB0ZXI8RD4ge1xuICAvKipcbiAgICogQ29udmVydHMgdXNlci1tb2RlbCBkYXRlIGludG8gYW4gTmdiRGF0ZVN0cnVjdCBmb3IgaW50ZXJuYWwgdXNlIGluIHRoZSBsaWJyYXJ5XG4gICAqL1xuICBhYnN0cmFjdCBmcm9tTW9kZWwodmFsdWU6IEQpOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBpbnRlcm5hbCBkYXRlIHZhbHVlIE5nYkRhdGVTdHJ1Y3QgdG8gdXNlci1tb2RlbCBkYXRlXG4gICAqIFRoZSByZXR1cm5lZCB0eXBlIGlzIHN1cG9zZWQgdG8gYmUgb2YgdGhlIHNhbWUgdHlwZSBhcyBmcm9tTW9kZWwoKSBpbnB1dC12YWx1ZSBwYXJhbVxuICAgKi9cbiAgYWJzdHJhY3QgdG9Nb2RlbChkYXRlOiBOZ2JEYXRlU3RydWN0KTogRDtcbn1cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5nYkRhdGVTdHJ1Y3RBZGFwdGVyIGV4dGVuZHMgTmdiRGF0ZUFkYXB0ZXI8TmdiRGF0ZVN0cnVjdD4ge1xuICAvKipcbiAgICogQ29udmVydHMgYSBOZ2JEYXRlU3RydWN0IHZhbHVlIGludG8gTmdiRGF0ZVN0cnVjdCB2YWx1ZVxuICAgKi9cbiAgZnJvbU1vZGVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICByZXR1cm4gKGRhdGUgJiYgZGF0ZS55ZWFyICYmIGRhdGUubW9udGggJiYgZGF0ZS5kYXkpID8ge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGgsIGRheTogZGF0ZS5kYXl9IDogbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb252ZXJ0cyBhIE5nYkRhdGVTdHJ1Y3QgdmFsdWUgaW50byBOZ2JEYXRlU3RydWN0IHZhbHVlXG4gICAqL1xuICB0b01vZGVsKGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICByZXR1cm4gKGRhdGUgJiYgZGF0ZS55ZWFyICYmIGRhdGUubW9udGggJiYgZGF0ZS5kYXkpID8ge3llYXI6IGRhdGUueWVhciwgbW9udGg6IGRhdGUubW9udGgsIGRheTogZGF0ZS5kYXl9IDogbnVsbDtcbiAgfVxufVxuIl19