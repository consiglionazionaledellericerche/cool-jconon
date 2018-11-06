import { publishBehavior as higherOrder } from 'rxjs/operators';
/**
 * @param value
 * @return {ConnectableObservable<T>}
 * @method publishBehavior
 * @owner Observable
 */
export function publishBehavior(value) {
    return higherOrder(value)(this);
}
//# sourceMappingURL=publishBehavior.js.map