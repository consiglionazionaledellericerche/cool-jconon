import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';
import { MotivazionePerditaProprietaService } from './motivazione-perdita-proprieta.service';
import { MotivazionePerditaProprietaComponent } from './motivazione-perdita-proprieta.component';
import { MotivazionePerditaProprietaDetailComponent } from './motivazione-perdita-proprieta-detail.component';
import { MotivazionePerditaProprietaUpdateComponent } from './motivazione-perdita-proprieta-update.component';
import { MotivazionePerditaProprietaDeletePopupComponent } from './motivazione-perdita-proprieta-delete-dialog.component';
import { IMotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';

@Injectable({ providedIn: 'root' })
export class MotivazionePerditaProprietaResolve implements Resolve<IMotivazionePerditaProprieta> {
    constructor(private service: MotivazionePerditaProprietaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service
                .find(id)
                .pipe(map((motivazionePerditaProprieta: HttpResponse<MotivazionePerditaProprieta>) => motivazionePerditaProprieta.body));
        }
        return of(new MotivazionePerditaProprieta());
    }
}

export const motivazionePerditaProprietaRoute: Routes = [
    {
        path: 'motivazione-perdita-proprieta',
        component: MotivazionePerditaProprietaComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.motivazionePerditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'motivazione-perdita-proprieta/:id/view',
        component: MotivazionePerditaProprietaDetailComponent,
        resolve: {
            motivazionePerditaProprieta: MotivazionePerditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazionePerditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'motivazione-perdita-proprieta/new',
        component: MotivazionePerditaProprietaUpdateComponent,
        resolve: {
            motivazionePerditaProprieta: MotivazionePerditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazionePerditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'motivazione-perdita-proprieta/:id/edit',
        component: MotivazionePerditaProprietaUpdateComponent,
        resolve: {
            motivazionePerditaProprieta: MotivazionePerditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazionePerditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const motivazionePerditaProprietaPopupRoute: Routes = [
    {
        path: 'motivazione-perdita-proprieta/:id/delete',
        component: MotivazionePerditaProprietaDeletePopupComponent,
        resolve: {
            motivazionePerditaProprieta: MotivazionePerditaProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.motivazionePerditaProprieta.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
