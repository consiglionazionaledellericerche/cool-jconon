import { FormControl } from '@angular/forms';
export declare class JhiMaxbytesValidatorDirective {
    jhiMaxbytes: number;
    constructor();
    validate(c: FormControl): {
        maxbytes: {
            valid: boolean;
        };
    };
}
