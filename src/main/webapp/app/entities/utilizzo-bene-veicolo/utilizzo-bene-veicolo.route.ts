import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';
import { UtilizzoBeneVeicoloService } from './utilizzo-bene-veicolo.service';
import { UtilizzoBeneVeicoloComponent } from './utilizzo-bene-veicolo.component';
import { UtilizzoBeneVeicoloDetailComponent } from './utilizzo-bene-veicolo-detail.component';
import { UtilizzoBeneVeicoloUpdateComponent } from './utilizzo-bene-veicolo-update.component';
import { UtilizzoBeneVeicoloDeletePopupComponent } from './utilizzo-bene-veicolo-delete-dialog.component';
import { IUtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';

@Injectable({ providedIn: 'root' })
export class UtilizzoBeneVeicoloResolve implements Resolve<IUtilizzoBeneVeicolo> {
    constructor(private service: UtilizzoBeneVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((utilizzoBeneVeicolo: HttpResponse<UtilizzoBeneVeicolo>) => utilizzoBeneVeicolo.body));
        }
        return of(new UtilizzoBeneVeicolo());
    }
}

export const utilizzoBeneVeicoloRoute: Routes = [
    {
        path: 'utilizzo-bene-veicolo',
        component: UtilizzoBeneVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.utilizzoBeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utilizzo-bene-veicolo/:id/view',
        component: UtilizzoBeneVeicoloDetailComponent,
        resolve: {
            utilizzoBeneVeicolo: UtilizzoBeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzoBeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utilizzo-bene-veicolo/new',
        component: UtilizzoBeneVeicoloUpdateComponent,
        resolve: {
            utilizzoBeneVeicolo: UtilizzoBeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzoBeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'utilizzo-bene-veicolo/:id/edit',
        component: UtilizzoBeneVeicoloUpdateComponent,
        resolve: {
            utilizzoBeneVeicolo: UtilizzoBeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzoBeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const utilizzoBeneVeicoloPopupRoute: Routes = [
    {
        path: 'utilizzo-bene-veicolo/:id/delete',
        component: UtilizzoBeneVeicoloDeletePopupComponent,
        resolve: {
            utilizzoBeneVeicolo: UtilizzoBeneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.utilizzoBeneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
