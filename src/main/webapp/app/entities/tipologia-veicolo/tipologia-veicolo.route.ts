import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { TipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';
import { TipologiaVeicoloService } from './tipologia-veicolo.service';
import { TipologiaVeicoloComponent } from './tipologia-veicolo.component';
import { TipologiaVeicoloDetailComponent } from './tipologia-veicolo-detail.component';
import { TipologiaVeicoloUpdateComponent } from './tipologia-veicolo-update.component';
import { TipologiaVeicoloDeletePopupComponent } from './tipologia-veicolo-delete-dialog.component';
import { ITipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';

@Injectable({ providedIn: 'root' })
export class TipologiaVeicoloResolve implements Resolve<ITipologiaVeicolo> {
    constructor(private service: TipologiaVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((tipologiaVeicolo: HttpResponse<TipologiaVeicolo>) => tipologiaVeicolo.body));
        }
        return of(new TipologiaVeicolo());
    }
}

export const tipologiaVeicoloRoute: Routes = [
    {
        path: 'tipologia-veicolo',
        component: TipologiaVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.tipologiaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tipologia-veicolo/:id/view',
        component: TipologiaVeicoloDetailComponent,
        resolve: {
            tipologiaVeicolo: TipologiaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.tipologiaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tipologia-veicolo/new',
        component: TipologiaVeicoloUpdateComponent,
        resolve: {
            tipologiaVeicolo: TipologiaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.tipologiaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'tipologia-veicolo/:id/edit',
        component: TipologiaVeicoloUpdateComponent,
        resolve: {
            tipologiaVeicolo: TipologiaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.tipologiaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const tipologiaVeicoloPopupRoute: Routes = [
    {
        path: 'tipologia-veicolo/:id/delete',
        component: TipologiaVeicoloDeletePopupComponent,
        resolve: {
            tipologiaVeicolo: TipologiaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.tipologiaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
