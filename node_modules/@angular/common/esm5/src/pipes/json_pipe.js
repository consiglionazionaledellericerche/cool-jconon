/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Pipe } from '@angular/core';
/**
 * @ngModule CommonModule
 * @description
 *
 * Converts a value into its JSON-format representation.  Useful for debugging.
 *
 * @usageNotes
 *
 * The following component uses a JSON pipe to convert an object
 * to JSON format, and displays the string in both formats for comparison.

 * {@example common/pipes/ts/json_pipe.ts region='JsonPipe'}
 *
 *
 */
var JsonPipe = /** @class */ (function () {
    function JsonPipe() {
    }
    /**
     * @param value A value of any type to convert into a JSON-format string.
     */
    JsonPipe.prototype.transform = function (value) { return JSON.stringify(value, null, 2); };
    JsonPipe.decorators = [
        { type: Pipe, args: [{ name: 'json', pure: false },] }
    ];
    return JsonPipe;
}());
export { JsonPipe };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9waXBlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL3NyYy9waXBlcy9qc29uX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLElBQUksRUFBZ0IsTUFBTSxlQUFlLENBQUM7QUFFbEQ7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSDtJQUFBO0lBTUEsQ0FBQztJQUpDOztPQUVHO0lBQ0gsNEJBQVMsR0FBVCxVQUFVLEtBQVUsSUFBWSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O2dCQUx6RSxJQUFJLFNBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUM7O0lBTWpDLGVBQUM7Q0FBQSxBQU5ELElBTUM7U0FMWSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1BpcGUsIFBpcGVUcmFuc2Zvcm19IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG4vKipcbiAqIEBuZ01vZHVsZSBDb21tb25Nb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICpcbiAqIENvbnZlcnRzIGEgdmFsdWUgaW50byBpdHMgSlNPTi1mb3JtYXQgcmVwcmVzZW50YXRpb24uICBVc2VmdWwgZm9yIGRlYnVnZ2luZy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICpcbiAqIFRoZSBmb2xsb3dpbmcgY29tcG9uZW50IHVzZXMgYSBKU09OIHBpcGUgdG8gY29udmVydCBhbiBvYmplY3RcbiAqIHRvIEpTT04gZm9ybWF0LCBhbmQgZGlzcGxheXMgdGhlIHN0cmluZyBpbiBib3RoIGZvcm1hdHMgZm9yIGNvbXBhcmlzb24uXG5cbiAqIHtAZXhhbXBsZSBjb21tb24vcGlwZXMvdHMvanNvbl9waXBlLnRzIHJlZ2lvbj0nSnNvblBpcGUnfVxuICpcbiAqXG4gKi9cbkBQaXBlKHtuYW1lOiAnanNvbicsIHB1cmU6IGZhbHNlfSlcbmV4cG9ydCBjbGFzcyBKc29uUGlwZSBpbXBsZW1lbnRzIFBpcGVUcmFuc2Zvcm0ge1xuICAvKipcbiAgICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgb2YgYW55IHR5cGUgdG8gY29udmVydCBpbnRvIGEgSlNPTi1mb3JtYXQgc3RyaW5nLlxuICAgKi9cbiAgdHJhbnNmb3JtKHZhbHVlOiBhbnkpOiBzdHJpbmcgeyByZXR1cm4gSlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIDIpOyB9XG59XG4iXX0=