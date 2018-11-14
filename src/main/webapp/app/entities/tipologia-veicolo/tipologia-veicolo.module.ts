import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    TipologiaVeicoloComponent,
    TipologiaVeicoloDetailComponent,
    TipologiaVeicoloUpdateComponent,
    TipologiaVeicoloDeletePopupComponent,
    TipologiaVeicoloDeleteDialogComponent,
    tipologiaVeicoloRoute,
    tipologiaVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...tipologiaVeicoloRoute, ...tipologiaVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TipologiaVeicoloComponent,
        TipologiaVeicoloDetailComponent,
        TipologiaVeicoloUpdateComponent,
        TipologiaVeicoloDeleteDialogComponent,
        TipologiaVeicoloDeletePopupComponent
    ],
    entryComponents: [
        TipologiaVeicoloComponent,
        TipologiaVeicoloUpdateComponent,
        TipologiaVeicoloDeleteDialogComponent,
        TipologiaVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoTipologiaVeicoloModule {}
