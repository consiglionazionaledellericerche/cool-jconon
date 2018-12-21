import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    VeicoloComponent,
    VeicoloDetailComponent,
    VeicoloUpdateComponent,
    VeicoloDeletePopupComponent,
    VeicoloDeleteDialogComponent,
    veicoloRoute,
    veicoloPopupRoute
} from './';

const ENTITY_STATES = [...veicoloRoute, ...veicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        VeicoloComponent,
        VeicoloDetailComponent,
        VeicoloUpdateComponent,
        VeicoloDeleteDialogComponent,
        VeicoloDeletePopupComponent
    ],
    entryComponents: [VeicoloComponent, VeicoloUpdateComponent, VeicoloDeleteDialogComponent, VeicoloDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoVeicoloModule {}
