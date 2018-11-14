import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    AssicurazioneVeicoloComponent,
    AssicurazioneVeicoloDetailComponent,
    AssicurazioneVeicoloUpdateComponent,
    AssicurazioneVeicoloDeletePopupComponent,
    AssicurazioneVeicoloDeleteDialogComponent,
    assicurazioneVeicoloRoute,
    assicurazioneVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...assicurazioneVeicoloRoute, ...assicurazioneVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        AssicurazioneVeicoloComponent,
        AssicurazioneVeicoloDetailComponent,
        AssicurazioneVeicoloUpdateComponent,
        AssicurazioneVeicoloDeleteDialogComponent,
        AssicurazioneVeicoloDeletePopupComponent
    ],
    entryComponents: [
        AssicurazioneVeicoloComponent,
        AssicurazioneVeicoloUpdateComponent,
        AssicurazioneVeicoloDeleteDialogComponent,
        AssicurazioneVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoAssicurazioneVeicoloModule {}
