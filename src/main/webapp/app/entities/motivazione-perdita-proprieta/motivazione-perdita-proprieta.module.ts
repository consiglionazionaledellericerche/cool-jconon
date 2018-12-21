import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    MotivazionePerditaProprietaComponent,
    MotivazionePerditaProprietaDetailComponent,
    MotivazionePerditaProprietaUpdateComponent,
    MotivazionePerditaProprietaDeletePopupComponent,
    MotivazionePerditaProprietaDeleteDialogComponent,
    motivazionePerditaProprietaRoute,
    motivazionePerditaProprietaPopupRoute
} from './';

const ENTITY_STATES = [...motivazionePerditaProprietaRoute, ...motivazionePerditaProprietaPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MotivazionePerditaProprietaComponent,
        MotivazionePerditaProprietaDetailComponent,
        MotivazionePerditaProprietaUpdateComponent,
        MotivazionePerditaProprietaDeleteDialogComponent,
        MotivazionePerditaProprietaDeletePopupComponent
    ],
    entryComponents: [
        MotivazionePerditaProprietaComponent,
        MotivazionePerditaProprietaUpdateComponent,
        MotivazionePerditaProprietaDeleteDialogComponent,
        MotivazionePerditaProprietaDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoMotivazionePerditaProprietaModule {}
