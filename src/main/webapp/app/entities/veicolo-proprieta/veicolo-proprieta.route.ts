import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';
import { VeicoloProprietaService } from './veicolo-proprieta.service';
import { VeicoloProprietaComponent } from './veicolo-proprieta.component';
import { VeicoloProprietaDetailComponent } from './veicolo-proprieta-detail.component';
import { VeicoloProprietaUpdateComponent } from './veicolo-proprieta-update.component';
import { VeicoloProprietaDeletePopupComponent } from './veicolo-proprieta-delete-dialog.component';
import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';

@Injectable({ providedIn: 'root' })
export class VeicoloProprietaResolve implements Resolve<IVeicoloProprieta> {
    constructor(private service: VeicoloProprietaService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((veicoloProprieta: HttpResponse<VeicoloProprieta>) => veicoloProprieta.body));
        }
        return of(new VeicoloProprieta());
    }
}

export const veicoloProprietaRoute: Routes = [
    {
        path: 'veicolo-proprieta',
        component: VeicoloProprietaComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.veicoloProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo-proprieta/:id/view',
        component: VeicoloProprietaDetailComponent,
        resolve: {
            veicoloProprieta: VeicoloProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo-proprieta/new',
        component: VeicoloProprietaUpdateComponent,
        resolve: {
            veicoloProprieta: VeicoloProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'veicolo-proprieta/:id/edit',
        component: VeicoloProprietaUpdateComponent,
        resolve: {
            veicoloProprieta: VeicoloProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloProprieta.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const veicoloProprietaPopupRoute: Routes = [
    {
        path: 'veicolo-proprieta/:id/delete',
        component: VeicoloProprietaDeletePopupComponent,
        resolve: {
            veicoloProprieta: VeicoloProprietaResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.veicoloProprieta.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
