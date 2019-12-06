import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    BolloComponent,
    BolloDetailComponent,
    BolloUpdateComponent,
    BolloDeletePopupComponent,
    BolloDeleteDialogComponent,
    bolloRoute,
    bolloPopupRoute
} from './';

const ENTITY_STATES = [...bolloRoute, ...bolloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [BolloComponent, BolloDetailComponent, BolloUpdateComponent, BolloDeleteDialogComponent, BolloDeletePopupComponent],
    entryComponents: [BolloComponent, BolloUpdateComponent, BolloDeleteDialogComponent, BolloDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoBolloModule {}
