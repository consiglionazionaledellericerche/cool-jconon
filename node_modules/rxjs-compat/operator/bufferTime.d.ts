import { Observable, SchedulerLike } from 'rxjs';
export declare function bufferTime<T>(this: Observable<T>, bufferTimeSpan: number, scheduler?: SchedulerLike): Observable<T[]>;
export declare function bufferTime<T>(this: Observable<T>, bufferTimeSpan: number, bufferCreationInterval: number, scheduler?: SchedulerLike): Observable<T[]>;
export declare function bufferTime<T>(this: Observable<T>, bufferTimeSpan: number, bufferCreationInterval: number, maxBufferSize: number, scheduler?: SchedulerLike): Observable<T[]>;
