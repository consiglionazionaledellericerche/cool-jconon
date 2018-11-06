import { shareReplay as higherOrder } from 'rxjs/operators';
/**
 * @method shareReplay
 * @owner Observable
 */
export function shareReplay(bufferSize, windowTime, scheduler) {
    return higherOrder(bufferSize, windowTime, scheduler)(this);
}
//# sourceMappingURL=shareReplay.js.map