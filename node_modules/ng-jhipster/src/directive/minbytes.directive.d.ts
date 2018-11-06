import { FormControl } from '@angular/forms';
export declare class JhiMinbytesValidatorDirective {
    jhiMinbytes: number;
    constructor();
    validate(c: FormControl): {
        minbytes: {
            valid: boolean;
        };
    };
}
