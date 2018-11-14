import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';
import { LibrettopercorrenzaVeicoloService } from './librettopercorrenza-veicolo.service';
import { LibrettopercorrenzaVeicoloComponent } from './librettopercorrenza-veicolo.component';
import { LibrettopercorrenzaVeicoloDetailComponent } from './librettopercorrenza-veicolo-detail.component';
import { LibrettopercorrenzaVeicoloUpdateComponent } from './librettopercorrenza-veicolo-update.component';
import { LibrettopercorrenzaVeicoloDeletePopupComponent } from './librettopercorrenza-veicolo-delete-dialog.component';
import { ILibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';

@Injectable({ providedIn: 'root' })
export class LibrettopercorrenzaVeicoloResolve implements Resolve<ILibrettopercorrenzaVeicolo> {
    constructor(private service: LibrettopercorrenzaVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service
                .find(id)
                .pipe(map((librettopercorrenzaVeicolo: HttpResponse<LibrettopercorrenzaVeicolo>) => librettopercorrenzaVeicolo.body));
        }
        return of(new LibrettopercorrenzaVeicolo());
    }
}

export const librettopercorrenzaVeicoloRoute: Routes = [
    {
        path: 'librettopercorrenza-veicolo',
        component: LibrettopercorrenzaVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.librettopercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'librettopercorrenza-veicolo/:id/view',
        component: LibrettopercorrenzaVeicoloDetailComponent,
        resolve: {
            librettopercorrenzaVeicolo: LibrettopercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettopercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'librettopercorrenza-veicolo/new',
        component: LibrettopercorrenzaVeicoloUpdateComponent,
        resolve: {
            librettopercorrenzaVeicolo: LibrettopercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettopercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'librettopercorrenza-veicolo/:id/edit',
        component: LibrettopercorrenzaVeicoloUpdateComponent,
        resolve: {
            librettopercorrenzaVeicolo: LibrettopercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettopercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const librettopercorrenzaVeicoloPopupRoute: Routes = [
    {
        path: 'librettopercorrenza-veicolo/:id/delete',
        component: LibrettopercorrenzaVeicoloDeletePopupComponent,
        resolve: {
            librettopercorrenzaVeicolo: LibrettopercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettopercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
