import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    LibrettopercorrenzaVeicoloComponent,
    LibrettopercorrenzaVeicoloDetailComponent,
    LibrettopercorrenzaVeicoloUpdateComponent,
    LibrettopercorrenzaVeicoloDeletePopupComponent,
    LibrettopercorrenzaVeicoloDeleteDialogComponent,
    librettopercorrenzaVeicoloRoute,
    librettopercorrenzaVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...librettopercorrenzaVeicoloRoute, ...librettopercorrenzaVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        LibrettopercorrenzaVeicoloComponent,
        LibrettopercorrenzaVeicoloDetailComponent,
        LibrettopercorrenzaVeicoloUpdateComponent,
        LibrettopercorrenzaVeicoloDeleteDialogComponent,
        LibrettopercorrenzaVeicoloDeletePopupComponent
    ],
    entryComponents: [
        LibrettopercorrenzaVeicoloComponent,
        LibrettopercorrenzaVeicoloUpdateComponent,
        LibrettopercorrenzaVeicoloDeleteDialogComponent,
        LibrettopercorrenzaVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoLibrettopercorrenzaVeicoloModule {}
