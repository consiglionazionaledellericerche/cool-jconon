import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    UtilizzobeneVeicoloComponent,
    UtilizzobeneVeicoloDetailComponent,
    UtilizzobeneVeicoloUpdateComponent,
    UtilizzobeneVeicoloDeletePopupComponent,
    UtilizzobeneVeicoloDeleteDialogComponent,
    utilizzobeneVeicoloRoute,
    utilizzobeneVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...utilizzobeneVeicoloRoute, ...utilizzobeneVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UtilizzobeneVeicoloComponent,
        UtilizzobeneVeicoloDetailComponent,
        UtilizzobeneVeicoloUpdateComponent,
        UtilizzobeneVeicoloDeleteDialogComponent,
        UtilizzobeneVeicoloDeletePopupComponent
    ],
    entryComponents: [
        UtilizzobeneVeicoloComponent,
        UtilizzobeneVeicoloUpdateComponent,
        UtilizzobeneVeicoloDeleteDialogComponent,
        UtilizzobeneVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoUtilizzobeneVeicoloModule {}
