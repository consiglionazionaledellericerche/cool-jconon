/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { isIconLookup } from './is-icon-lookup.util';
/** *
 * Normalizing icon spec.
  @type {?} */
export var faNormalizeIconSpec = function (iconSpec, defaultPrefix) {
    if (defaultPrefix === void 0) { defaultPrefix = 'fas'; }
    if (typeof iconSpec === 'undefined' || iconSpec === null) {
        return null;
    }
    if (isIconLookup(iconSpec)) {
        return iconSpec;
    }
    if (Array.isArray(iconSpec) && (/** @type {?} */ (iconSpec)).length === 2) {
        return { prefix: iconSpec[0], iconName: iconSpec[1] };
    }
    if (typeof iconSpec === 'string') {
        return { prefix: defaultPrefix, iconName: iconSpec };
    }
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9ybWFsaXplLWljb24tc3BlYy51dGlsLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGZvcnRhd2Vzb21lL2FuZ3VsYXItZm9udGF3ZXNvbWUvIiwic291cmNlcyI6WyJzaGFyZWQvdXRpbHMvbm9ybWFsaXplLWljb24tc3BlYy51dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7Ozs7QUFLckQsV0FBYSxtQkFBbUIsR0FBRyxVQUFDLFFBQWtCLEVBQUUsYUFBaUM7SUFBakMsOEJBQUEsRUFBQSxxQkFBaUM7SUFFdkYsSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLElBQUksUUFBUSxLQUFLLElBQUksRUFBRTtRQUN4RCxPQUFPLElBQUksQ0FBQztLQUNiO0lBRUQsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDMUIsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFFRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksbUJBQWdCLFFBQVEsRUFBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ3ZEO0lBRUQsSUFBSSxPQUFPLFFBQVEsS0FBSyxRQUFRLEVBQUU7UUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO0tBQ3REO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEljb25Mb29rdXAsIEljb25Qcm9wLCBJY29uUHJlZml4IH0gZnJvbSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLXN2Zy1jb3JlJztcblxuaW1wb3J0IHsgaXNJY29uTG9va3VwIH0gZnJvbSAnLi9pcy1pY29uLWxvb2t1cC51dGlsJztcblxuLyoqXG4gKiBOb3JtYWxpemluZyBpY29uIHNwZWMuXG4gKi9cbmV4cG9ydCBjb25zdCBmYU5vcm1hbGl6ZUljb25TcGVjID0gKGljb25TcGVjOiBJY29uUHJvcCwgZGVmYXVsdFByZWZpeDogSWNvblByZWZpeCA9ICdmYXMnKTogSWNvbkxvb2t1cCA9PiB7XG5cbiAgaWYgKHR5cGVvZiBpY29uU3BlYyA9PT0gJ3VuZGVmaW5lZCcgfHwgaWNvblNwZWMgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChpc0ljb25Mb29rdXAoaWNvblNwZWMpKSB7XG4gICAgcmV0dXJuIGljb25TcGVjO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoaWNvblNwZWMpICYmICg8QXJyYXk8c3RyaW5nPj5pY29uU3BlYykubGVuZ3RoID09PSAyKSB7XG4gICAgcmV0dXJuIHsgcHJlZml4OiBpY29uU3BlY1swXSwgaWNvbk5hbWU6IGljb25TcGVjWzFdIH07XG4gIH1cblxuICBpZiAodHlwZW9mIGljb25TcGVjID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB7IHByZWZpeDogZGVmYXVsdFByZWZpeCwgaWNvbk5hbWU6IGljb25TcGVjIH07XG4gIH1cbn07XG4iXX0=