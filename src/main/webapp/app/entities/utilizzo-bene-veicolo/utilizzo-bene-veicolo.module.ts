import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    UtilizzoBeneVeicoloComponent,
    UtilizzoBeneVeicoloDetailComponent,
    UtilizzoBeneVeicoloUpdateComponent,
    UtilizzoBeneVeicoloDeletePopupComponent,
    UtilizzoBeneVeicoloDeleteDialogComponent,
    utilizzoBeneVeicoloRoute,
    utilizzoBeneVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...utilizzoBeneVeicoloRoute, ...utilizzoBeneVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UtilizzoBeneVeicoloComponent,
        UtilizzoBeneVeicoloDetailComponent,
        UtilizzoBeneVeicoloUpdateComponent,
        UtilizzoBeneVeicoloDeleteDialogComponent,
        UtilizzoBeneVeicoloDeletePopupComponent
    ],
    entryComponents: [
        UtilizzoBeneVeicoloComponent,
        UtilizzoBeneVeicoloUpdateComponent,
        UtilizzoBeneVeicoloDeleteDialogComponent,
        UtilizzoBeneVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoUtilizzoBeneVeicoloModule {}
