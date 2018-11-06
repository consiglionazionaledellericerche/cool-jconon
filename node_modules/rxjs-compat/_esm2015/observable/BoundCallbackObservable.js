import { Observable, bindCallback } from 'rxjs';
export class BoundCallbackObservable extends Observable {
    /* tslint:enable:max-line-length */
    static create(func, selector = undefined, scheduler) {
        return bindCallback(func, selector, scheduler);
    }
}
//# sourceMappingURL=BoundCallbackObservable.js.map