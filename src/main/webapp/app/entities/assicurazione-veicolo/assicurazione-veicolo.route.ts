import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';
import { AssicurazioneVeicoloService } from './assicurazione-veicolo.service';
import { AssicurazioneVeicoloComponent } from './assicurazione-veicolo.component';
import { AssicurazioneVeicoloDetailComponent } from './assicurazione-veicolo-detail.component';
import { AssicurazioneVeicoloUpdateComponent } from './assicurazione-veicolo-update.component';
import { AssicurazioneVeicoloDeletePopupComponent } from './assicurazione-veicolo-delete-dialog.component';
import { IAssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';

@Injectable({ providedIn: 'root' })
export class AssicurazioneVeicoloResolve implements Resolve<IAssicurazioneVeicolo> {
    constructor(private service: AssicurazioneVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((assicurazioneVeicolo: HttpResponse<AssicurazioneVeicolo>) => assicurazioneVeicolo.body));
        }
        return of(new AssicurazioneVeicolo());
    }
}

export const assicurazioneVeicoloRoute: Routes = [
    {
        path: 'assicurazione-veicolo',
        component: AssicurazioneVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.assicurazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'assicurazione-veicolo/:id/view',
        component: AssicurazioneVeicoloDetailComponent,
        resolve: {
            assicurazioneVeicolo: AssicurazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.assicurazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'assicurazione-veicolo/new',
        component: AssicurazioneVeicoloUpdateComponent,
        resolve: {
            assicurazioneVeicolo: AssicurazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.assicurazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'assicurazione-veicolo/:id/edit',
        component: AssicurazioneVeicoloUpdateComponent,
        resolve: {
            assicurazioneVeicolo: AssicurazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.assicurazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const assicurazioneVeicoloPopupRoute: Routes = [
    {
        path: 'assicurazione-veicolo/:id/delete',
        component: AssicurazioneVeicoloDeletePopupComponent,
        resolve: {
            assicurazioneVeicolo: AssicurazioneVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.assicurazioneVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
