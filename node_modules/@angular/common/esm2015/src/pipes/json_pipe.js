/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Pipe } from '@angular/core';
/**
 * \@ngModule CommonModule
 * \@description
 *
 * Converts a value into its JSON-format representation.  Useful for debugging.
 *
 * \@usageNotes
 *
 * The following component uses a JSON pipe to convert an object
 * to JSON format, and displays the string in both formats for comparison.
 * {\@example common/pipes/ts/json_pipe.ts region='JsonPipe'}
 *
 *
 */
export class JsonPipe {
    /**
     * @param {?} value A value of any type to convert into a JSON-format string.
     * @return {?}
     */
    transform(value) { return JSON.stringify(value, null, 2); }
}
JsonPipe.decorators = [
    { type: Pipe, args: [{ name: 'json', pure: false },] }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9waXBlcy9qc29uX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFRQSxPQUFPLEVBQUMsSUFBSSxFQUFnQixNQUFNLGVBQWUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FBa0JsRCxNQUFNOzs7OztJQUlKLFNBQVMsQ0FBQyxLQUFVLElBQVksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTs7O1lBTHpFLElBQUksU0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtQaXBlLCBQaXBlVHJhbnNmb3JtfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuLyoqXG4gKiBAbmdNb2R1bGUgQ29tbW9uTW9kdWxlXG4gKiBAZGVzY3JpcHRpb25cbiAqXG4gKiBDb252ZXJ0cyBhIHZhbHVlIGludG8gaXRzIEpTT04tZm9ybWF0IHJlcHJlc2VudGF0aW9uLiAgVXNlZnVsIGZvciBkZWJ1Z2dpbmcuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqXG4gKiBUaGUgZm9sbG93aW5nIGNvbXBvbmVudCB1c2VzIGEgSlNPTiBwaXBlIHRvIGNvbnZlcnQgYW4gb2JqZWN0XG4gKiB0byBKU09OIGZvcm1hdCwgYW5kIGRpc3BsYXlzIHRoZSBzdHJpbmcgaW4gYm90aCBmb3JtYXRzIGZvciBjb21wYXJpc29uLlxuXG4gKiB7QGV4YW1wbGUgY29tbW9uL3BpcGVzL3RzL2pzb25fcGlwZS50cyByZWdpb249J0pzb25QaXBlJ31cbiAqXG4gKlxuICovXG5AUGlwZSh7bmFtZTogJ2pzb24nLCBwdXJlOiBmYWxzZX0pXG5leHBvcnQgY2xhc3MgSnNvblBpcGUgaW1wbGVtZW50cyBQaXBlVHJhbnNmb3JtIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB2YWx1ZSBBIHZhbHVlIG9mIGFueSB0eXBlIHRvIGNvbnZlcnQgaW50byBhIEpTT04tZm9ybWF0IHN0cmluZy5cbiAgICovXG4gIHRyYW5zZm9ybSh2YWx1ZTogYW55KTogc3RyaW5nIHsgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAyKTsgfVxufVxuIl19