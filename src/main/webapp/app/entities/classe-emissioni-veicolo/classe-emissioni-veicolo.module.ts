import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    ClasseEmissioniVeicoloComponent,
    ClasseEmissioniVeicoloDetailComponent,
    ClasseEmissioniVeicoloUpdateComponent,
    ClasseEmissioniVeicoloDeletePopupComponent,
    ClasseEmissioniVeicoloDeleteDialogComponent,
    classeEmissioniVeicoloRoute,
    classeEmissioniVeicoloPopupRoute
} from './';

const ENTITY_STATES = [...classeEmissioniVeicoloRoute, ...classeEmissioniVeicoloPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ClasseEmissioniVeicoloComponent,
        ClasseEmissioniVeicoloDetailComponent,
        ClasseEmissioniVeicoloUpdateComponent,
        ClasseEmissioniVeicoloDeleteDialogComponent,
        ClasseEmissioniVeicoloDeletePopupComponent
    ],
    entryComponents: [
        ClasseEmissioniVeicoloComponent,
        ClasseEmissioniVeicoloUpdateComponent,
        ClasseEmissioniVeicoloDeleteDialogComponent,
        ClasseEmissioniVeicoloDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoClasseEmissioniVeicoloModule {}
