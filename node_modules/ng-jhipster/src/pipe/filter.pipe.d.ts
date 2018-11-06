import { PipeTransform } from '@angular/core';
export declare class JhiFilterPipe implements PipeTransform {
    private filterByStringAndField(filter, field);
    private filterByString(filter);
    private filterDefault(filter);
    private filterByObject(filter);
    transform(input: Array<any>, filter: string, field: string): any;
}
