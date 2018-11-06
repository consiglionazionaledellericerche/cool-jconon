import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoSharedModule } from 'app/shared';
import {
    User_autoComponent,
    User_autoDetailComponent,
    User_autoUpdateComponent,
    User_autoDeletePopupComponent,
    User_autoDeleteDialogComponent,
    user_autoRoute,
    user_autoPopupRoute
} from './';

const ENTITY_STATES = [...user_autoRoute, ...user_autoPopupRoute];

@NgModule({
    imports: [AutoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        User_autoComponent,
        User_autoDetailComponent,
        User_autoUpdateComponent,
        User_autoDeleteDialogComponent,
        User_autoDeletePopupComponent
    ],
    entryComponents: [User_autoComponent, User_autoUpdateComponent, User_autoDeleteDialogComponent, User_autoDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutoUser_autoModule {}
