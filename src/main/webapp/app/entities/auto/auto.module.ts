import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AutoSharedModule } from 'app/shared';
import { AutoAdminModule } from 'app/admin/admin.module';
import {
    AutoComponent,
    AutoDetailComponent,
    AutoUpdateComponent,
    AutoDeletePopupComponent,
    AutoDeleteDialogComponent,
    autoRoute,
    autoPopupRoute
} from './';

const ENTITY_STATES = [...autoRoute, ...autoPopupRoute];

@NgModule({
    imports: [AutoSharedModule, AutoAdminModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [AutoComponent, AutoDetailComponent, AutoUpdateComponent, AutoDeleteDialogComponent, AutoDeletePopupComponent],
    entryComponents: [AutoComponent, AutoUpdateComponent, AutoDeleteDialogComponent, AutoDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AutoAutoModule {}
