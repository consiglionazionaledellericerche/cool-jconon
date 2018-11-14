import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ParcoautoSharedModule } from 'app/shared';
import {
    VeicoloNoleggioComponent,
    VeicoloNoleggioDetailComponent,
    VeicoloNoleggioUpdateComponent,
    VeicoloNoleggioDeletePopupComponent,
    VeicoloNoleggioDeleteDialogComponent,
    veicoloNoleggioRoute,
    veicoloNoleggioPopupRoute
} from './';

const ENTITY_STATES = [...veicoloNoleggioRoute, ...veicoloNoleggioPopupRoute];

@NgModule({
    imports: [ParcoautoSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        VeicoloNoleggioComponent,
        VeicoloNoleggioDetailComponent,
        VeicoloNoleggioUpdateComponent,
        VeicoloNoleggioDeleteDialogComponent,
        VeicoloNoleggioDeletePopupComponent
    ],
    entryComponents: [
        VeicoloNoleggioComponent,
        VeicoloNoleggioUpdateComponent,
        VeicoloNoleggioDeleteDialogComponent,
        VeicoloNoleggioDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoVeicoloNoleggioModule {}
