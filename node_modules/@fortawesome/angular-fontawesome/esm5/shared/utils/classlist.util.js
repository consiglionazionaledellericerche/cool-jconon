/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * Fontawesome class list.
 * Returns classes array by props.
  @type {?} */
export var faClassList = function (props) {
    var _a;
    /** @type {?} */
    var classes = (_a = {
            'fa-spin': props.spin,
            'fa-pulse': props.pulse,
            'fa-fw': props.fixedWidth,
            'fa-border': props.border,
            'fa-li': props.listItem,
            'fa-inverse': props.inverse,
            'fa-layers-counter': props.counter,
            'fa-flip-horizontal': props.flip === 'horizontal' || props.flip === 'both',
            'fa-flip-vertical': props.flip === 'vertical' || props.flip === 'both'
        },
        _a["fa-" + props.size] = props.size !== null,
        _a["fa-rotate-" + props.rotate] = props.rotate !== null,
        _a["fa-pull-" + props.pull] = props.pull !== null,
        _a);
    return Object.keys(classes)
        .map(function (key) { return (classes[key] ? key : null); })
        .filter(function (key) { return key; });
};
/** @type {?} */
export var faLayerClassList = function (props) {
    var _a;
    /** @type {?} */
    var classes = (_a = {
            'fa-fw': props.fixedWidth
        },
        _a["fa-" + props.size] = props.size !== null,
        _a);
    return Object.keys(classes)
        .map(function (key) { return (classes[key] ? key : null); })
        .filter(function (key) { return key; });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NsaXN0LnV0aWwuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AZm9ydGF3ZXNvbWUvYW5ndWxhci1mb250YXdlc29tZS8iLCJzb3VyY2VzIjpbInNoYXJlZC91dGlscy9jbGFzc2xpc3QudXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQU1BLFdBQWEsV0FBVyxHQUFHLFVBQUMsS0FBYzs7O0lBQ3hDLElBQU0sT0FBTztZQUNYLFNBQVMsRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNyQixVQUFVLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDdkIsT0FBTyxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQ3pCLFdBQVcsRUFBRSxLQUFLLENBQUMsTUFBTTtZQUN6QixPQUFPLEVBQUUsS0FBSyxDQUFDLFFBQVE7WUFDdkIsWUFBWSxFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQzNCLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxPQUFPO1lBQ2xDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxJQUFJLEtBQUssWUFBWSxJQUFJLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTTtZQUMxRSxrQkFBa0IsRUFBRSxLQUFLLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE1BQU07O1FBQ3RFLEdBQUMsUUFBTSxLQUFLLENBQUMsSUFBTSxJQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssSUFBSTtRQUN6QyxHQUFDLGVBQWEsS0FBSyxDQUFDLE1BQVEsSUFBRyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUk7UUFDcEQsR0FBQyxhQUFXLEtBQUssQ0FBQyxJQUFNLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJO1lBQzlDO0lBRUYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQztTQUN2QyxNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUM7Q0FDdkIsQ0FBQzs7QUFFRixXQUFhLGdCQUFnQixHQUFHLFVBQUMsS0FBYzs7O0lBQzdDLElBQU0sT0FBTztZQUNYLE9BQU8sRUFBRSxLQUFLLENBQUMsVUFBVTs7UUFDekIsR0FBQyxRQUFNLEtBQUssQ0FBQyxJQUFNLElBQUcsS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJO1lBQ3pDO0lBRUYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztTQUN4QixHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQztTQUN2QyxNQUFNLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxHQUFHLEVBQUgsQ0FBRyxDQUFDLENBQUM7Q0FDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEZhUHJvcHMgfSBmcm9tICcuLi9tb2RlbHMvcHJvcHMubW9kZWwnO1xuXG4vKipcbiAqIEZvbnRhd2Vzb21lIGNsYXNzIGxpc3QuXG4gKiBSZXR1cm5zIGNsYXNzZXMgYXJyYXkgYnkgcHJvcHMuXG4gKi9cbmV4cG9ydCBjb25zdCBmYUNsYXNzTGlzdCA9IChwcm9wczogRmFQcm9wcyk6IHN0cmluZ1tdID0+IHtcbiAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAnZmEtc3Bpbic6IHByb3BzLnNwaW4sXG4gICAgJ2ZhLXB1bHNlJzogcHJvcHMucHVsc2UsXG4gICAgJ2ZhLWZ3JzogcHJvcHMuZml4ZWRXaWR0aCxcbiAgICAnZmEtYm9yZGVyJzogcHJvcHMuYm9yZGVyLFxuICAgICdmYS1saSc6IHByb3BzLmxpc3RJdGVtLFxuICAgICdmYS1pbnZlcnNlJzogcHJvcHMuaW52ZXJzZSxcbiAgICAnZmEtbGF5ZXJzLWNvdW50ZXInOiBwcm9wcy5jb3VudGVyLFxuICAgICdmYS1mbGlwLWhvcml6b250YWwnOiBwcm9wcy5mbGlwID09PSAnaG9yaXpvbnRhbCcgfHwgcHJvcHMuZmxpcCA9PT0gJ2JvdGgnLFxuICAgICdmYS1mbGlwLXZlcnRpY2FsJzogcHJvcHMuZmxpcCA9PT0gJ3ZlcnRpY2FsJyB8fCBwcm9wcy5mbGlwID09PSAnYm90aCcsXG4gICAgW2BmYS0ke3Byb3BzLnNpemV9YF06IHByb3BzLnNpemUgIT09IG51bGwsXG4gICAgW2BmYS1yb3RhdGUtJHtwcm9wcy5yb3RhdGV9YF06IHByb3BzLnJvdGF0ZSAhPT0gbnVsbCxcbiAgICBbYGZhLXB1bGwtJHtwcm9wcy5wdWxsfWBdOiBwcm9wcy5wdWxsICE9PSBudWxsXG4gIH07XG5cbiAgcmV0dXJuIE9iamVjdC5rZXlzKGNsYXNzZXMpXG4gICAgLm1hcChrZXkgPT4gKGNsYXNzZXNba2V5XSA/IGtleSA6IG51bGwpKVxuICAgIC5maWx0ZXIoa2V5ID0+IGtleSk7XG59O1xuXG5leHBvcnQgY29uc3QgZmFMYXllckNsYXNzTGlzdCA9IChwcm9wczogRmFQcm9wcyk6IHN0cmluZ1tdID0+IHtcbiAgY29uc3QgY2xhc3NlcyA9IHtcbiAgICAnZmEtZncnOiBwcm9wcy5maXhlZFdpZHRoLFxuICAgIFtgZmEtJHtwcm9wcy5zaXplfWBdOiBwcm9wcy5zaXplICE9PSBudWxsLFxuICB9O1xuXG4gIHJldHVybiBPYmplY3Qua2V5cyhjbGFzc2VzKVxuICAgIC5tYXAoa2V5ID0+IChjbGFzc2VzW2tleV0gPyBrZXkgOiBudWxsKSlcbiAgICAuZmlsdGVyKGtleSA9PiBrZXkpO1xufTtcbiJdfQ==