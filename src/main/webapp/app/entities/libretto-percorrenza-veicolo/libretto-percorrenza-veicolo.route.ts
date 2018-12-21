import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';
import { LibrettoPercorrenzaVeicoloService } from './libretto-percorrenza-veicolo.service';
import { LibrettoPercorrenzaVeicoloComponent } from './libretto-percorrenza-veicolo.component';
import { LibrettoPercorrenzaVeicoloDetailComponent } from './libretto-percorrenza-veicolo-detail.component';
import { LibrettoPercorrenzaVeicoloUpdateComponent } from './libretto-percorrenza-veicolo-update.component';
import { LibrettoPercorrenzaVeicoloDeletePopupComponent } from './libretto-percorrenza-veicolo-delete-dialog.component';
import { ILibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';

@Injectable({ providedIn: 'root' })
export class LibrettoPercorrenzaVeicoloResolve implements Resolve<ILibrettoPercorrenzaVeicolo> {
    constructor(private service: LibrettoPercorrenzaVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service
                .find(id)
                .pipe(map((librettoPercorrenzaVeicolo: HttpResponse<LibrettoPercorrenzaVeicolo>) => librettoPercorrenzaVeicolo.body));
        }
        return of(new LibrettoPercorrenzaVeicolo());
    }
}

export const librettoPercorrenzaVeicoloRoute: Routes = [
    {
        path: 'libretto-percorrenza-veicolo',
        component: LibrettoPercorrenzaVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.librettoPercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'libretto-percorrenza-veicolo/:id/view',
        component: LibrettoPercorrenzaVeicoloDetailComponent,
        resolve: {
            librettoPercorrenzaVeicolo: LibrettoPercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettoPercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'libretto-percorrenza-veicolo/new',
        component: LibrettoPercorrenzaVeicoloUpdateComponent,
        resolve: {
            librettoPercorrenzaVeicolo: LibrettoPercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettoPercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'libretto-percorrenza-veicolo/:id/edit',
        component: LibrettoPercorrenzaVeicoloUpdateComponent,
        resolve: {
            librettoPercorrenzaVeicolo: LibrettoPercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettoPercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const librettoPercorrenzaVeicoloPopupRoute: Routes = [
    {
        path: 'libretto-percorrenza-veicolo/:id/delete',
        component: LibrettoPercorrenzaVeicoloDeletePopupComponent,
        resolve: {
            librettoPercorrenzaVeicolo: LibrettoPercorrenzaVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.librettoPercorrenzaVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
