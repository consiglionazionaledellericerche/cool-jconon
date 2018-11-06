import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoSharedModule } from 'app/shared';
import {
    IstitutiComponent,
    IstitutiDetailComponent,
    IstitutiUpdateComponent,
    IstitutiDeletePopupComponent,
    IstitutiDeleteDialogComponent,
    istitutiRoute,
    istitutiPopupRoute
} from './';

const ENTITY_STATES = [...istitutiRoute, ...istitutiPopupRoute];

@NgModule({
    imports: [AutoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        IstitutiComponent,
        IstitutiDetailComponent,
        IstitutiUpdateComponent,
        IstitutiDeleteDialogComponent,
        IstitutiDeletePopupComponent
    ],
    entryComponents: [IstitutiComponent, IstitutiUpdateComponent, IstitutiDeleteDialogComponent, IstitutiDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutoIstitutiModule {}
