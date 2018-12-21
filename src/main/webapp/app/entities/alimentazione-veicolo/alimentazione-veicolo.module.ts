import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    AlimentazioneVeicoloComponent,
    AlimentazioneVeicoloDetailComponent,
    AlimentazioneVeicoloUpdateComponent,
    AlimentazioneVeicoloDeletePopupComponent,
    AlimentazioneVeicoloDeleteDialogComponent,
    alimentazioneVeicoloRoute,
    alimentazioneVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...alimentazioneVeicoloRoute, ...alimentazioneVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AlimentazioneVeicoloComponent,
        AlimentazioneVeicoloDetailComponent,
        AlimentazioneVeicoloUpdateComponent,
        AlimentazioneVeicoloDeleteDialogComponent,
        AlimentazioneVeicoloDeletePopupComponent
    ],
    entryComponents: [
        AlimentazioneVeicoloComponent,
        AlimentazioneVeicoloUpdateComponent,
        AlimentazioneVeicoloDeleteDialogComponent,
        AlimentazioneVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoAlimentazioneVeicoloModule {}
