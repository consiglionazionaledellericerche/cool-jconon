import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Veicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from './veicolo.service';
import { VeicoloComponent } from './veicolo.component';
import { VeicoloDetailComponent } from './veicolo-detail.component';
import { VeicoloUpdateComponent } from './veicolo-update.component';
import { VeicoloDeletePopupComponent } from './veicolo-delete-dialog.component';
import { IVeicolo } from 'app/shared/model/veicolo.model';

@Injectable({ providedIn: 'root' })
export class VeicoloResolve implements Resolve<IVeicolo> {
    constructor(private service: VeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((veicolo: HttpResponse<Veicolo>) => veicolo.body));
        }
        return of(new Veicolo());
    }
}

export const veicoloRoute: Routes = [
    {
        path: 'veicolo',
        component: VeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.veicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo/:id/view',
        component: VeicoloDetailComponent,
        resolve: {
            veicolo: VeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo/new',
        component: VeicoloUpdateComponent,
        resolve: {
            veicolo: VeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo/:id/edit',
        component: VeicoloUpdateComponent,
        resolve: {
            veicolo: VeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const veicoloPopupRoute: Routes = [
    {
        path: 'veicolo/:id/delete',
        component: VeicoloDeletePopupComponent,
        resolve: {
            veicolo: VeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
