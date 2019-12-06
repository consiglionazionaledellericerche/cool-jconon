import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    CancellazionePraComponent,
    CancellazionePraDetailComponent,
    CancellazionePraUpdateComponent,
    CancellazionePraDeletePopupComponent,
    CancellazionePraDeleteDialogComponent,
    cancellazionePraRoute,
    cancellazionePraPopupRoute
} from './';

const ENTITY_STATES = [...cancellazionePraRoute, ...cancellazionePraPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CancellazionePraComponent,
        CancellazionePraDetailComponent,
        CancellazionePraUpdateComponent,
        CancellazionePraDeleteDialogComponent,
        CancellazionePraDeletePopupComponent
    ],
    entryComponents: [
        CancellazionePraComponent,
        CancellazionePraUpdateComponent,
        CancellazionePraDeleteDialogComponent,
        CancellazionePraDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoCancellazionePraModule {}
