import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AutoIstitutiModule } from './istituti/istituti.module';
import { AutoAutoModule } from './auto/auto.module';
import { AutoUser_istitutiModule } from './user-istituti/user-istituti.module';
import { AutoUser_autoModule } from './user-auto/user-auto.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        AutoIstitutiModule,
        AutoAutoModule,
        AutoUser_istitutiModule,
        AutoUser_autoModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutoEntityModule {}
