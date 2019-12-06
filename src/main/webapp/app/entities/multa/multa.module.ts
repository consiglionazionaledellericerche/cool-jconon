import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    MultaComponent,
    MultaDetailComponent,
    MultaUpdateComponent,
    MultaDeletePopupComponent,
    MultaDeleteDialogComponent,
    multaRoute,
    multaPopupRoute
} from './';

const ENTITY_STATES = [...multaRoute, ...multaPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [MultaComponent, MultaDetailComponent, MultaUpdateComponent, MultaDeleteDialogComponent, MultaDeletePopupComponent],
    entryComponents: [MultaComponent, MultaUpdateComponent, MultaDeleteDialogComponent, MultaDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoMultaModule {}
