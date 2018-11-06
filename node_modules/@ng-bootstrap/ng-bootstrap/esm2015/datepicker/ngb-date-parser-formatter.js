/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { padNumber, toInteger, isNumber } from '../util/util';
/**
 * Abstract type serving as a DI token for the service parsing and formatting dates for the NgbInputDatepicker
 * directive. A default implementation using the ISO 8601 format is provided, but you can provide another implementation
 * to use an alternative format.
 * @abstract
 */
export class NgbDateParserFormatter {
}
if (false) {
    /**
     * Parses the given value to an NgbDateStruct. Implementations should try their best to provide a result, even
     * partial. They must return null if the value can't be parsed.
     * @abstract
     * @param {?} value the value to parse
     * @return {?}
     */
    NgbDateParserFormatter.prototype.parse = function (value) { };
    /**
     * Formats the given date to a string. Implementations should return an empty string if the given date is null,
     * and try their best to provide a partial result if the given date is incomplete or invalid.
     * @abstract
     * @param {?} date the date to format as a string
     * @return {?}
     */
    NgbDateParserFormatter.prototype.format = function (date) { };
}
export class NgbDateISOParserFormatter extends NgbDateParserFormatter {
    /**
     * @param {?} value
     * @return {?}
     */
    parse(value) {
        if (value) {
            /** @type {?} */
            const dateParts = value.trim().split('-');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return { year: toInteger(dateParts[0]), month: null, day: null };
            }
            else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: null };
            }
            else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return { year: toInteger(dateParts[0]), month: toInteger(dateParts[1]), day: toInteger(dateParts[2]) };
            }
        }
        return null;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    format(date) {
        return date ?
            `${date.year}-${isNumber(date.month) ? padNumber(date.month) : ''}-${isNumber(date.day) ? padNumber(date.day) : ''}` :
            '';
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdiLWRhdGUtcGFyc2VyLWZvcm1hdHRlci5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BuZy1ib290c3RyYXAvbmctYm9vdHN0cmFwLyIsInNvdXJjZXMiOlsiZGF0ZXBpY2tlci9uZ2ItZGF0ZS1wYXJzZXItZm9ybWF0dGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsTUFBTSxjQUFjLENBQUM7Ozs7Ozs7QUFRNUQsTUFBTTtDQWNMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsTUFBTSxnQ0FBaUMsU0FBUSxzQkFBc0I7Ozs7O0lBQ25FLEtBQUssQ0FBQyxLQUFhO1FBQ2pCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBQ1YsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyRCxNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO2FBQ2hFO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0RixNQUFNLENBQUMsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQyxDQUFDO2FBQ25GO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEgsTUFBTSxDQUFDLEVBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQzthQUN0RztTQUNGO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztLQUNiOzs7OztJQUVELE1BQU0sQ0FBQyxJQUFtQjtRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDVCxHQUFHLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEgsRUFBRSxDQUFDO0tBQ1I7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cGFkTnVtYmVyLCB0b0ludGVnZXIsIGlzTnVtYmVyfSBmcm9tICcuLi91dGlsL3V0aWwnO1xuaW1wb3J0IHtOZ2JEYXRlU3RydWN0fSBmcm9tICcuL25nYi1kYXRlLXN0cnVjdCc7XG5cbi8qKlxuICogQWJzdHJhY3QgdHlwZSBzZXJ2aW5nIGFzIGEgREkgdG9rZW4gZm9yIHRoZSBzZXJ2aWNlIHBhcnNpbmcgYW5kIGZvcm1hdHRpbmcgZGF0ZXMgZm9yIHRoZSBOZ2JJbnB1dERhdGVwaWNrZXJcbiAqIGRpcmVjdGl2ZS4gQSBkZWZhdWx0IGltcGxlbWVudGF0aW9uIHVzaW5nIHRoZSBJU08gODYwMSBmb3JtYXQgaXMgcHJvdmlkZWQsIGJ1dCB5b3UgY2FuIHByb3ZpZGUgYW5vdGhlciBpbXBsZW1lbnRhdGlvblxuICogdG8gdXNlIGFuIGFsdGVybmF0aXZlIGZvcm1hdC5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nYkRhdGVQYXJzZXJGb3JtYXR0ZXIge1xuICAvKipcbiAgICogUGFyc2VzIHRoZSBnaXZlbiB2YWx1ZSB0byBhbiBOZ2JEYXRlU3RydWN0LiBJbXBsZW1lbnRhdGlvbnMgc2hvdWxkIHRyeSB0aGVpciBiZXN0IHRvIHByb3ZpZGUgYSByZXN1bHQsIGV2ZW5cbiAgICogcGFydGlhbC4gVGhleSBtdXN0IHJldHVybiBudWxsIGlmIHRoZSB2YWx1ZSBjYW4ndCBiZSBwYXJzZWQuXG4gICAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gcGFyc2VcbiAgICovXG4gIGFic3RyYWN0IHBhcnNlKHZhbHVlOiBzdHJpbmcpOiBOZ2JEYXRlU3RydWN0O1xuXG4gIC8qKlxuICAgKiBGb3JtYXRzIHRoZSBnaXZlbiBkYXRlIHRvIGEgc3RyaW5nLiBJbXBsZW1lbnRhdGlvbnMgc2hvdWxkIHJldHVybiBhbiBlbXB0eSBzdHJpbmcgaWYgdGhlIGdpdmVuIGRhdGUgaXMgbnVsbCxcbiAgICogYW5kIHRyeSB0aGVpciBiZXN0IHRvIHByb3ZpZGUgYSBwYXJ0aWFsIHJlc3VsdCBpZiB0aGUgZ2l2ZW4gZGF0ZSBpcyBpbmNvbXBsZXRlIG9yIGludmFsaWQuXG4gICAqIEBwYXJhbSBkYXRlIHRoZSBkYXRlIHRvIGZvcm1hdCBhcyBhIHN0cmluZ1xuICAgKi9cbiAgYWJzdHJhY3QgZm9ybWF0KGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBOZ2JEYXRlSVNPUGFyc2VyRm9ybWF0dGVyIGV4dGVuZHMgTmdiRGF0ZVBhcnNlckZvcm1hdHRlciB7XG4gIHBhcnNlKHZhbHVlOiBzdHJpbmcpOiBOZ2JEYXRlU3RydWN0IHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IGRhdGVQYXJ0cyA9IHZhbHVlLnRyaW0oKS5zcGxpdCgnLScpO1xuICAgICAgaWYgKGRhdGVQYXJ0cy5sZW5ndGggPT09IDEgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzBdKSkge1xuICAgICAgICByZXR1cm4ge3llYXI6IHRvSW50ZWdlcihkYXRlUGFydHNbMF0pLCBtb250aDogbnVsbCwgZGF5OiBudWxsfTtcbiAgICAgIH0gZWxzZSBpZiAoZGF0ZVBhcnRzLmxlbmd0aCA9PT0gMiAmJiBpc051bWJlcihkYXRlUGFydHNbMF0pICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1sxXSkpIHtcbiAgICAgICAgcmV0dXJuIHt5ZWFyOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzBdKSwgbW9udGg6IHRvSW50ZWdlcihkYXRlUGFydHNbMV0pLCBkYXk6IG51bGx9O1xuICAgICAgfSBlbHNlIGlmIChkYXRlUGFydHMubGVuZ3RoID09PSAzICYmIGlzTnVtYmVyKGRhdGVQYXJ0c1swXSkgJiYgaXNOdW1iZXIoZGF0ZVBhcnRzWzFdKSAmJiBpc051bWJlcihkYXRlUGFydHNbMl0pKSB7XG4gICAgICAgIHJldHVybiB7eWVhcjogdG9JbnRlZ2VyKGRhdGVQYXJ0c1swXSksIG1vbnRoOiB0b0ludGVnZXIoZGF0ZVBhcnRzWzFdKSwgZGF5OiB0b0ludGVnZXIoZGF0ZVBhcnRzWzJdKX07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgZm9ybWF0KGRhdGU6IE5nYkRhdGVTdHJ1Y3QpOiBzdHJpbmcge1xuICAgIHJldHVybiBkYXRlID9cbiAgICAgICAgYCR7ZGF0ZS55ZWFyfS0ke2lzTnVtYmVyKGRhdGUubW9udGgpID8gcGFkTnVtYmVyKGRhdGUubW9udGgpIDogJyd9LSR7aXNOdW1iZXIoZGF0ZS5kYXkpID8gcGFkTnVtYmVyKGRhdGUuZGF5KSA6ICcnfWAgOlxuICAgICAgICAnJztcbiAgfVxufVxuIl19