import { Observable } from 'rxjs';
export declare function last<T>(this: Observable<T>, predicate?: (value: T, index: number, source: Observable<T>) => boolean, defaultValue?: T): Observable<T>;
