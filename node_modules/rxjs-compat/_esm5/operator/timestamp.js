import { asyncScheduler } from 'rxjs';
import { timestamp as higherOrder } from 'rxjs/operators';
/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
export function timestamp(scheduler) {
    if (scheduler === void 0) { scheduler = asyncScheduler; }
    return higherOrder(scheduler)(this);
}
//# sourceMappingURL=timestamp.js.map