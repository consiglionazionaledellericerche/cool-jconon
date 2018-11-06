import { asyncScheduler } from 'rxjs';
import { timeInterval as higherOrder } from 'rxjs/operators';
/**
 * @param scheduler
 * @return {Observable<TimeInterval<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timeInterval
 * @owner Observable
 */
export function timeInterval(scheduler) {
    if (scheduler === void 0) { scheduler = asyncScheduler; }
    return higherOrder(scheduler)(this);
}
//# sourceMappingURL=timeInterval.js.map