import { Observable, bindNodeCallback } from 'rxjs';
export class BoundNodeCallbackObservable extends Observable {
    /* tslint:enable:max-line-length */
    static create(func, selector = undefined, scheduler) {
        return bindNodeCallback(func, selector, scheduler);
    }
}
//# sourceMappingURL=BoundNodeCallbackObservable.js.map