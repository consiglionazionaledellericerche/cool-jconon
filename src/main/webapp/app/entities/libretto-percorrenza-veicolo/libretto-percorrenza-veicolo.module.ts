import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    LibrettoPercorrenzaVeicoloComponent,
    LibrettoPercorrenzaVeicoloDetailComponent,
    LibrettoPercorrenzaVeicoloUpdateComponent,
    LibrettoPercorrenzaVeicoloDeletePopupComponent,
    LibrettoPercorrenzaVeicoloDeleteDialogComponent,
    librettoPercorrenzaVeicoloRoute,
    librettoPercorrenzaVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...librettoPercorrenzaVeicoloRoute, ...librettoPercorrenzaVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        LibrettoPercorrenzaVeicoloComponent,
        LibrettoPercorrenzaVeicoloDetailComponent,
        LibrettoPercorrenzaVeicoloUpdateComponent,
        LibrettoPercorrenzaVeicoloDeleteDialogComponent,
        LibrettoPercorrenzaVeicoloDeletePopupComponent
    ],
    entryComponents: [
        LibrettoPercorrenzaVeicoloComponent,
        LibrettoPercorrenzaVeicoloUpdateComponent,
        LibrettoPercorrenzaVeicoloDeleteDialogComponent,
        LibrettoPercorrenzaVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoLibrettoPercorrenzaVeicoloModule {}
