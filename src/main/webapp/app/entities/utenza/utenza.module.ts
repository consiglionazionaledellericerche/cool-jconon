import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    UtenzaComponent,
    UtenzaDetailComponent,
    UtenzaUpdateComponent,
    UtenzaDeletePopupComponent,
    UtenzaDeleteDialogComponent,
    utenzaRoute,
    utenzaPopupRoute
} from './';

const ENTITY_STATES = [...utenzaRoute, ...utenzaPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [UtenzaComponent, UtenzaDetailComponent, UtenzaUpdateComponent, UtenzaDeleteDialogComponent, UtenzaDeletePopupComponent],
    entryComponents: [UtenzaComponent, UtenzaUpdateComponent, UtenzaDeleteDialogComponent, UtenzaDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoUtenzaModule {}
