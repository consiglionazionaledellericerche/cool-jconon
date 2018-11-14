import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    ClasseemissioniVeicoloComponent,
    ClasseemissioniVeicoloDetailComponent,
    ClasseemissioniVeicoloUpdateComponent,
    ClasseemissioniVeicoloDeletePopupComponent,
    ClasseemissioniVeicoloDeleteDialogComponent,
    classeemissioniVeicoloRoute,
    classeemissioniVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...classeemissioniVeicoloRoute, ...classeemissioniVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ClasseemissioniVeicoloComponent,
        ClasseemissioniVeicoloDetailComponent,
        ClasseemissioniVeicoloUpdateComponent,
        ClasseemissioniVeicoloDeleteDialogComponent,
        ClasseemissioniVeicoloDeletePopupComponent
    ],
    entryComponents: [
        ClasseemissioniVeicoloComponent,
        ClasseemissioniVeicoloUpdateComponent,
        ClasseemissioniVeicoloDeleteDialogComponent,
        ClasseemissioniVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoClasseemissioniVeicoloModule {}
