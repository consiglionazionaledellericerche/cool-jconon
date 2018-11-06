import { Observable, forkJoin } from 'rxjs';
export class ForkJoinObservable extends Observable {
    /* tslint:enable:max-line-length */
    static create(...sources) {
        return forkJoin(...sources);
    }
}
//# sourceMappingURL=ForkJoinObservable.js.map