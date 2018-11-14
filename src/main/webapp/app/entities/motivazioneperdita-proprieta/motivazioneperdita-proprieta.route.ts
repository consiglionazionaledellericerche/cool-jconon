import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';
import { MotivazioneperditaProprietaService } from './motivazioneperdita-proprieta.service';
import { MotivazioneperditaProprietaComponent } from './motivazioneperdita-proprieta.component';
import { MotivazioneperditaProprietaDetailComponent } from './motivazioneperdita-proprieta-detail.component';
import { MotivazioneperditaProprietaUpdateComponent } from './motivazioneperdita-proprieta-update.component';
import { MotivazioneperditaProprietaDeletePopupComponent } from './motivazioneperdita-proprieta-delete-dialog.component';
import { IMotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';

@Injectable({ providedIn: 'root' })
export class MotivazioneperditaProprietaResolve implements Resolve<IMotivazioneperditaProprieta> {
    constructor(private service: MotivazioneperditaProprietaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service
                .find(id)
                .pipe(map((motivazioneperditaProprieta: HttpResponse<MotivazioneperditaProprieta>) => motivazioneperditaProprieta.body));
        }
        return of(new MotivazioneperditaProprieta());
    }
}

export const motivazioneperditaProprietaRoute: Routes = [
    {
        path: 'motivazioneperdita-proprieta',
        component: MotivazioneperditaProprietaComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.motivazioneperditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'motivazioneperdita-proprieta/:id/view',
        component: MotivazioneperditaProprietaDetailComponent,
        resolve: {
            motivazioneperditaProprieta: MotivazioneperditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazioneperditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'motivazioneperdita-proprieta/new',
        component: MotivazioneperditaProprietaUpdateComponent,
        resolve: {
            motivazioneperditaProprieta: MotivazioneperditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazioneperditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'motivazioneperdita-proprieta/:id/edit',
        component: MotivazioneperditaProprietaUpdateComponent,
        resolve: {
            motivazioneperditaProprieta: MotivazioneperditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazioneperditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const motivazioneperditaProprietaPopupRoute: Routes = [
    {
        path: 'motivazioneperdita-proprieta/:id/delete',
        component: MotivazioneperditaProprietaDeletePopupComponent,
        resolve: {
            motivazioneperditaProprieta: MotivazioneperditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazioneperditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
