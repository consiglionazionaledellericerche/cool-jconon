import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utenza } from 'app/shared/model/utenza.model';
import { UtenzaService } from './utenza.service';
import { UtenzaComponent } from './utenza.component';
import { UtenzaDetailComponent } from './utenza-detail.component';
import { UtenzaUpdateComponent } from './utenza-update.component';
import { UtenzaDeletePopupComponent } from './utenza-delete-dialog.component';
import { IUtenza } from 'app/shared/model/utenza.model';

@Injectable({ providedIn: 'root' })
export class UtenzaResolve implements Resolve<IUtenza> {
    constructor(private service: UtenzaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((utenza: HttpResponse<Utenza>) => utenza.body));
        }
        return of(new Utenza());
    }
}

export const utenzaRoute: Routes = [
    {
        path: 'utenza',
        component: UtenzaComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.utenza.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utenza/:id/view',
        component: UtenzaDetailComponent,
        resolve: {
            utenza: UtenzaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utenza.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utenza/new',
        component: UtenzaUpdateComponent,
        resolve: {
            utenza: UtenzaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utenza.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utenza/:id/edit',
        component: UtenzaUpdateComponent,
        resolve: {
            utenza: UtenzaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utenza.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const utenzaPopupRoute: Routes = [
    {
        path: 'utenza/:id/delete',
        component: UtenzaDeletePopupComponent,
        resolve: {
            utenza: UtenzaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utenza.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
