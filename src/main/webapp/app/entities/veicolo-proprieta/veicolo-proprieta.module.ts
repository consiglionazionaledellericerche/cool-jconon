import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    VeicoloProprietaComponent,
    VeicoloProprietaDetailComponent,
    VeicoloProprietaUpdateComponent,
    VeicoloProprietaDeletePopupComponent,
    VeicoloProprietaDeleteDialogComponent,
    veicoloProprietaRoute,
    veicoloProprietaPopupRoute
} from './';

const ENTITY_STATES = [...veicoloProprietaRoute, ...veicoloProprietaPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        VeicoloProprietaComponent,
        VeicoloProprietaDetailComponent,
        VeicoloProprietaUpdateComponent,
        VeicoloProprietaDeleteDialogComponent,
        VeicoloProprietaDeletePopupComponent
    ],
    entryComponents: [
        VeicoloProprietaComponent,
        VeicoloProprietaUpdateComponent,
        VeicoloProprietaDeleteDialogComponent,
        VeicoloProprietaDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoVeicoloProprietaModule {}
