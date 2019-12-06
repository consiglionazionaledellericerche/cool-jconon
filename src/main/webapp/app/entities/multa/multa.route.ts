import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Multa } from 'app/shared/model/multa.model';
import { MultaService } from './multa.service';
import { MultaComponent } from './multa.component';
import { MultaDetailComponent } from './multa-detail.component';
import { MultaUpdateComponent } from './multa-update.component';
import { MultaDeletePopupComponent } from './multa-delete-dialog.component';
import { IMulta } from 'app/shared/model/multa.model';

@Injectable({ providedIn: 'root' })
export class MultaResolve implements Resolve<IMulta> {
    constructor(private service: MultaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((multa: HttpResponse<Multa>) => multa.body));
        }
        return of(new Multa());
    }
}

export const multaRoute: Routes = [
    {
        path: 'multa',
        component: MultaComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.multa.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'multa/:id/view',
        component: MultaDetailComponent,
        resolve: {
            multa: MultaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.multa.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'multa/new',
        component: MultaUpdateComponent,
        resolve: {
            multa: MultaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.multa.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'multa/:id/edit',
        component: MultaUpdateComponent,
        resolve: {
            multa: MultaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.multa.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const multaPopupRoute: Routes = [
    {
        path: 'multa/:id/delete',
        component: MultaDeletePopupComponent,
        resolve: {
            multa: MultaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.multa.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
