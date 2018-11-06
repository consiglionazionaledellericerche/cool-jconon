import { FormControl } from '@angular/forms';
export declare class JhiMinValidatorDirective {
    jhiMin: number;
    constructor();
    validate(c: FormControl): {
        min: {
            valid: boolean;
        };
    };
}
