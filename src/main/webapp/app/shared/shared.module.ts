import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateMomentAdapter } from './util/datepicker-adapter';
import { NgbDateCustomParserFormatter } from './util/datecustom-adapter';
import { ParcoautoSharedLibsModule, ParcoautoSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
    imports: [ParcoautoSharedLibsModule, ParcoautoSharedCommonModule],
    declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
    providers: [
        {
            provide: NgbDateAdapter,
            useClass: NgbDateMomentAdapter
        },
        {
            provide: NgbDateParserFormatter,
            useClass: NgbDateCustomParserFormatter
        }
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [ParcoautoSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoSharedModule {}
