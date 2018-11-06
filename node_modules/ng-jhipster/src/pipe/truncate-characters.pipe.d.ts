import { PipeTransform } from '@angular/core';
export declare class JhiTruncateCharactersPipe implements PipeTransform {
    transform(input: string, chars: number, breakOnWord?: boolean): string;
}
