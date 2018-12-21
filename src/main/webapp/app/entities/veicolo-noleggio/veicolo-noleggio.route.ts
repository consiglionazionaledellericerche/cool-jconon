import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';
import { VeicoloNoleggioService } from './veicolo-noleggio.service';
import { VeicoloNoleggioComponent } from './veicolo-noleggio.component';
import { VeicoloNoleggioDetailComponent } from './veicolo-noleggio-detail.component';
import { VeicoloNoleggioUpdateComponent } from './veicolo-noleggio-update.component';
import { VeicoloNoleggioDeletePopupComponent } from './veicolo-noleggio-delete-dialog.component';
import { IVeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';

@Injectable({ providedIn: 'root' })
export class VeicoloNoleggioResolve implements Resolve<IVeicoloNoleggio> {
    constructor(private service: VeicoloNoleggioService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((veicoloNoleggio: HttpResponse<VeicoloNoleggio>) => veicoloNoleggio.body));
        }
        return of(new VeicoloNoleggio());
    }
}

export const veicoloNoleggioRoute: Routes = [
    {
        path: 'veicolo-noleggio',
        component: VeicoloNoleggioComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.veicoloNoleggio.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo-noleggio/:id/view',
        component: VeicoloNoleggioDetailComponent,
        resolve: {
            veicoloNoleggio: VeicoloNoleggioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloNoleggio.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo-noleggio/new',
        component: VeicoloNoleggioUpdateComponent,
        resolve: {
            veicoloNoleggio: VeicoloNoleggioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloNoleggio.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo-noleggio/:id/edit',
        component: VeicoloNoleggioUpdateComponent,
        resolve: {
            veicoloNoleggio: VeicoloNoleggioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloNoleggio.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const veicoloNoleggioPopupRoute: Routes = [
    {
        path: 'veicolo-noleggio/:id/delete',
        component: VeicoloNoleggioDeletePopupComponent,
        resolve: {
            veicoloNoleggio: VeicoloNoleggioResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloNoleggio.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
