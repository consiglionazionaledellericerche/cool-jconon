import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    MotivazioneperditaProprietaComponent,
    MotivazioneperditaProprietaDetailComponent,
    MotivazioneperditaProprietaUpdateComponent,
    MotivazioneperditaProprietaDeletePopupComponent,
    MotivazioneperditaProprietaDeleteDialogComponent,
    motivazioneperditaProprietaRoute,
    motivazioneperditaProprietaPopupRoute
} from './';

const ENTITY_STATES = [...motivazioneperditaProprietaRoute, ...motivazioneperditaProprietaPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        MotivazioneperditaProprietaComponent,
        MotivazioneperditaProprietaDetailComponent,
        MotivazioneperditaProprietaUpdateComponent,
        MotivazioneperditaProprietaDeleteDialogComponent,
        MotivazioneperditaProprietaDeletePopupComponent
    ],
    entryComponents: [
        MotivazioneperditaProprietaComponent,
        MotivazioneperditaProprietaUpdateComponent,
        MotivazioneperditaProprietaDeleteDialogComponent,
        MotivazioneperditaProprietaDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoMotivazioneperditaProprietaModule {}
