import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';
import { UtilizzobeneVeicoloService } from './utilizzobene-veicolo.service';
import { UtilizzobeneVeicoloComponent } from './utilizzobene-veicolo.component';
import { UtilizzobeneVeicoloDetailComponent } from './utilizzobene-veicolo-detail.component';
import { UtilizzobeneVeicoloUpdateComponent } from './utilizzobene-veicolo-update.component';
import { UtilizzobeneVeicoloDeletePopupComponent } from './utilizzobene-veicolo-delete-dialog.component';
import { IUtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';

@Injectable({ providedIn: 'root' })
export class UtilizzobeneVeicoloResolve implements Resolve<IUtilizzobeneVeicolo> {
    constructor(private service: UtilizzobeneVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((utilizzobeneVeicolo: HttpResponse<UtilizzobeneVeicolo>) => utilizzobeneVeicolo.body));
        }
        return of(new UtilizzobeneVeicolo());
    }
}

export const utilizzobeneVeicoloRoute: Routes = [
    {
        path: 'utilizzobene-veicolo',
        component: UtilizzobeneVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.utilizzobeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utilizzobene-veicolo/:id/view',
        component: UtilizzobeneVeicoloDetailComponent,
        resolve: {
            utilizzobeneVeicolo: UtilizzobeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzobeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utilizzobene-veicolo/new',
        component: UtilizzobeneVeicoloUpdateComponent,
        resolve: {
            utilizzobeneVeicolo: UtilizzobeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzobeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utilizzobene-veicolo/:id/edit',
        component: UtilizzobeneVeicoloUpdateComponent,
        resolve: {
            utilizzobeneVeicolo: UtilizzobeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzobeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const utilizzobeneVeicoloPopupRoute: Routes = [
    {
        path: 'utilizzobene-veicolo/:id/delete',
        component: UtilizzobeneVeicoloDeletePopupComponent,
        resolve: {
            utilizzobeneVeicolo: UtilizzobeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzobeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
