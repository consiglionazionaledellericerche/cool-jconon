import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    IstitutoComponent,
    IstitutoDetailComponent,
    IstitutoUpdateComponent,
    IstitutoDeletePopupComponent,
    IstitutoDeleteDialogComponent,
    istitutoRoute,
    istitutoPopupRoute
} from './';

const ENTITY_STATES = [...istitutoRoute, ...istitutoPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        IstitutoComponent,
        IstitutoDetailComponent,
        IstitutoUpdateComponent,
        IstitutoDeleteDialogComponent,
        IstitutoDeletePopupComponent
    ],
    entryComponents: [IstitutoComponent, IstitutoUpdateComponent, IstitutoDeleteDialogComponent, IstitutoDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoIstitutoModule {}
