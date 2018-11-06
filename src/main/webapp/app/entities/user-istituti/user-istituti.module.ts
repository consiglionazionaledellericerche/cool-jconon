import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoSharedModule } from 'app/shared';
import { AutoAdminModule } from 'app/admin/admin.module';
import {
    User_istitutiComponent,
    User_istitutiDetailComponent,
    User_istitutiUpdateComponent,
    User_istitutiDeletePopupComponent,
    User_istitutiDeleteDialogComponent,
    user_istitutiRoute,
    user_istitutiPopupRoute
} from './';

const ENTITY_STATES = [...user_istitutiRoute, ...user_istitutiPopupRoute];

@NgModule({
    imports: [AutoSharedModule, AutoAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        User_istitutiComponent,
        User_istitutiDetailComponent,
        User_istitutiUpdateComponent,
        User_istitutiDeleteDialogComponent,
        User_istitutiDeletePopupComponent
    ],
    entryComponents: [
        User_istitutiComponent,
        User_istitutiUpdateComponent,
        User_istitutiDeleteDialogComponent,
        User_istitutiDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutoUser_istitutiModule {}
