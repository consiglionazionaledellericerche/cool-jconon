import { Observable, fromEvent } from 'rxjs';
export class FromEventObservable extends Observable {
    /* tslint:enable:max-line-length */
    static create(target, eventName, options, selector) {
        return fromEvent(target, eventName, options, selector);
    }
}
//# sourceMappingURL=FromEventObservable.js.map