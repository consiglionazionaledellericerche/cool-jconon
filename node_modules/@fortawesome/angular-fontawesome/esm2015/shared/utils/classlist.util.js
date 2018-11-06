/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Fontawesome class list.
 * Returns classes array by props.
  @type {?} */
export const faClassList = (props) => {
    /** @type {?} */
    const classes = {
        'fa-spin': props.spin,
        'fa-pulse': props.pulse,
        'fa-fw': props.fixedWidth,
        'fa-border': props.border,
        'fa-li': props.listItem,
        'fa-inverse': props.inverse,
        'fa-layers-counter': props.counter,
        'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
        'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both',
        [`fa-${props.size}`]: props.size !== null,
        [`fa-rotate-${props.rotate}`]: props.rotate !== null,
        [`fa-pull-${props.pull}`]: props.pull !== null
    };
    return Object.keys(classes)
        .map(key => (classes[key] ? key : null))
        .filter(key => key);
};
/** @type {?} */
export const faLayerClassList = (props) => {
    /** @type {?} */
    const classes = {
        'fa-fw': props.fixedWidth,
        [`fa-${props.size}`]: props.size !== null,
    };
    return Object.keys(classes)
        .map(key => (classes[key] ? key : null))
        .filter(key => key);
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NsaXN0LnV0aWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS8iLCJzb3VyY2VzIjpbInNoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU1BLGFBQWEsV0FBVyxHQUFHLENBQUMsS0FBYyxFQUFZLEVBQUU7O0lBQ3RELE1BQU0sT0FBTyxHQUFHO1FBQ2QsU0FBUyxFQUFFLEtBQUssQ0FBQyxJQUFJO1FBQ3JCLFVBQVUsRUFBRSxLQUFLLENBQUMsS0FBSztRQUN2QixPQUFPLEVBQUUsS0FBSyxDQUFDLFVBQVU7UUFDekIsV0FBVyxFQUFFLEtBQUssQ0FBQyxNQUFNO1FBQ3pCLE9BQU8sRUFBRSxLQUFLLENBQUMsUUFBUTtRQUN2QixZQUFZLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDM0IsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLE9BQU87UUFDbEMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLElBQUksS0FBSyxZQUFZLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNO1FBQzFFLGtCQUFrQixFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssVUFBVSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTTtRQUN0RSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJO1FBQ3pDLENBQUMsYUFBYSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUk7UUFDcEQsQ0FBQyxXQUFXLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSTtLQUMvQyxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN2QixDQUFDOztBQUVGLGFBQWEsZ0JBQWdCLEdBQUcsQ0FBQyxLQUFjLEVBQVksRUFBRTs7SUFDM0QsTUFBTSxPQUFPLEdBQUc7UUFDZCxPQUFPLEVBQUUsS0FBSyxDQUFDLFVBQVU7UUFDekIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSTtLQUMxQyxDQUFDO0lBRUYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUN2QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmFQcm9wcyB9IGZyb20gJy4uL21vZGVscy9wcm9wcy5tb2RlbCc7XG5cbi8qKlxuICogRm9udGF3ZXNvbWUgY2xhc3MgbGlzdC5cbiAqIFJldHVybnMgY2xhc3NlcyBhcnJheSBieSBwcm9wcy5cbiAqL1xuZXhwb3J0IGNvbnN0IGZhQ2xhc3NMaXN0ID0gKHByb3BzOiBGYVByb3BzKTogc3RyaW5nW10gPT4ge1xuICBjb25zdCBjbGFzc2VzID0ge1xuICAgICdmYS1zcGluJzogcHJvcHMuc3BpbixcbiAgICAnZmEtcHVsc2UnOiBwcm9wcy5wdWxzZSxcbiAgICAnZmEtZncnOiBwcm9wcy5maXhlZFdpZHRoLFxuICAgICdmYS1ib3JkZXInOiBwcm9wcy5ib3JkZXIsXG4gICAgJ2ZhLWxpJzogcHJvcHMubGlzdEl0ZW0sXG4gICAgJ2ZhLWludmVyc2UnOiBwcm9wcy5pbnZlcnNlLFxuICAgICdmYS1sYXllcnMtY291bnRlcic6IHByb3BzLmNvdW50ZXIsXG4gICAgJ2ZhLWZsaXAtaG9yaXpvbnRhbCc6IHByb3BzLmZsaXAgPT09ICdob3Jpem9udGFsJyB8fCBwcm9wcy5mbGlwID09PSAnYm90aCcsXG4gICAgJ2ZhLWZsaXAtdmVydGljYWwnOiBwcm9wcy5mbGlwID09PSAndmVydGljYWwnIHx8IHByb3BzLmZsaXAgPT09ICdib3RoJyxcbiAgICBbYGZhLSR7cHJvcHMuc2l6ZX1gXTogcHJvcHMuc2l6ZSAhPT0gbnVsbCxcbiAgICBbYGZhLXJvdGF0ZS0ke3Byb3BzLnJvdGF0ZX1gXTogcHJvcHMucm90YXRlICE9PSBudWxsLFxuICAgIFtgZmEtcHVsbC0ke3Byb3BzLnB1bGx9YF06IHByb3BzLnB1bGwgIT09IG51bGxcbiAgfTtcblxuICByZXR1cm4gT2JqZWN0LmtleXMoY2xhc3NlcylcbiAgICAubWFwKGtleSA9PiAoY2xhc3Nlc1trZXldID8ga2V5IDogbnVsbCkpXG4gICAgLmZpbHRlcihrZXkgPT4ga2V5KTtcbn07XG5cbmV4cG9ydCBjb25zdCBmYUxheWVyQ2xhc3NMaXN0ID0gKHByb3BzOiBGYVByb3BzKTogc3RyaW5nW10gPT4ge1xuICBjb25zdCBjbGFzc2VzID0ge1xuICAgICdmYS1mdyc6IHByb3BzLmZpeGVkV2lkdGgsXG4gICAgW2BmYS0ke3Byb3BzLnNpemV9YF06IHByb3BzLnNpemUgIT09IG51bGwsXG4gIH07XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNsYXNzZXMpXG4gICAgLm1hcChrZXkgPT4gKGNsYXNzZXNba2V5XSA/IGtleSA6IG51bGwpKVxuICAgIC5maWx0ZXIoa2V5ID0+IGtleSk7XG59O1xuIl19