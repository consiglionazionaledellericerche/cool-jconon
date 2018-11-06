import { FormControl } from '@angular/forms';
export declare class JhiMaxValidatorDirective {
    jhiMax: number;
    constructor();
    validate(c: FormControl): {
        max: {
            valid: boolean;
        };
    };
}
