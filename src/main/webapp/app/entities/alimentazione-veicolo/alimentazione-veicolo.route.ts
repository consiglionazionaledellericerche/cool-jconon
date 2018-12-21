import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';
import { AlimentazioneVeicoloService } from './alimentazione-veicolo.service';
import { AlimentazioneVeicoloComponent } from './alimentazione-veicolo.component';
import { AlimentazioneVeicoloDetailComponent } from './alimentazione-veicolo-detail.component';
import { AlimentazioneVeicoloUpdateComponent } from './alimentazione-veicolo-update.component';
import { AlimentazioneVeicoloDeletePopupComponent } from './alimentazione-veicolo-delete-dialog.component';
import { IAlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';

@Injectable({ providedIn: 'root' })
export class AlimentazioneVeicoloResolve implements Resolve<IAlimentazioneVeicolo> {
    constructor(private service: AlimentazioneVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((alimentazioneVeicolo: HttpResponse<AlimentazioneVeicolo>) => alimentazioneVeicolo.body));
        }
        return of(new AlimentazioneVeicolo());
    }
}

export const alimentazioneVeicoloRoute: Routes = [
    {
        path: 'alimentazione-veicolo',
        component: AlimentazioneVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.alimentazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'alimentazione-veicolo/:id/view',
        component: AlimentazioneVeicoloDetailComponent,
        resolve: {
            alimentazioneVeicolo: AlimentazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.alimentazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'alimentazione-veicolo/new',
        component: AlimentazioneVeicoloUpdateComponent,
        resolve: {
            alimentazioneVeicolo: AlimentazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.alimentazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'alimentazione-veicolo/:id/edit',
        component: AlimentazioneVeicoloUpdateComponent,
        resolve: {
            alimentazioneVeicolo: AlimentazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.alimentazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const alimentazioneVeicoloPopupRoute: Routes = [
    {
        path: 'alimentazione-veicolo/:id/delete',
        component: AlimentazioneVeicoloDeletePopupComponent,
        resolve: {
            alimentazioneVeicolo: AlimentazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.alimentazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
