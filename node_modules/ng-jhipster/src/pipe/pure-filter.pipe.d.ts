import { PipeTransform } from '@angular/core';
import { JhiFilterPipe } from './filter.pipe';
export declare class JhiPureFilterPipe extends JhiFilterPipe implements PipeTransform {
    transform(input: Array<any>, filter: string, field: string): any;
}
