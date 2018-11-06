import { zip as zipStatic } from 'rxjs';
/* tslint:enable:max-line-length */
/**
 * @param observables
 * @return {Observable<R>}
 * @method zip
 * @owner Observable
 */
export function zipProto(...observables) {
    return this.lift.call(zipStatic(this, ...observables));
}
//# sourceMappingURL=zip.js.map