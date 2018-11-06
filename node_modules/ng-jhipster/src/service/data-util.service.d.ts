import { ElementRef } from '@angular/core';
export declare class JhiDataUtils {
    constructor();
    abbreviate(text: string, append?: string): string;
    byteSize(base64String: string): string;
    openFile(contentType: string, data: string): void;
    toBase64(file: File, cb: Function): void;
    clearInputImage(entity: any, elementRef: ElementRef, field: string, fieldContentType: string, idInput: string): void;
    private endsWith(suffix, str);
    private paddingSize(value);
    private size(value);
    private formatAsBytes(size);
    setFileData(event: any, entity: any, field: string, isImage: boolean): void;
}
