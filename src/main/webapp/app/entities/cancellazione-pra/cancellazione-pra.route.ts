import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CancellazionePra } from 'app/shared/model/cancellazione-pra.model';
import { CancellazionePraService } from './cancellazione-pra.service';
import { CancellazionePraComponent } from './cancellazione-pra.component';
import { CancellazionePraDetailComponent } from './cancellazione-pra-detail.component';
import { CancellazionePraUpdateComponent } from './cancellazione-pra-update.component';
import { CancellazionePraDeletePopupComponent } from './cancellazione-pra-delete-dialog.component';
import { ICancellazionePra } from 'app/shared/model/cancellazione-pra.model';

@Injectable({ providedIn: 'root' })
export class CancellazionePraResolve implements Resolve<ICancellazionePra> {
    constructor(private service: CancellazionePraService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((cancellazionePra: HttpResponse<CancellazionePra>) => cancellazionePra.body));
        }
        return of(new CancellazionePra());
    }
}

export const cancellazionePraRoute: Routes = [
    {
        path: 'cancellazione-pra',
        component: CancellazionePraComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.cancellazionePra.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cancellazione-pra/:id/view',
        component: CancellazionePraDetailComponent,
        resolve: {
            cancellazionePra: CancellazionePraResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.cancellazionePra.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cancellazione-pra/new',
        component: CancellazionePraUpdateComponent,
        resolve: {
            cancellazionePra: CancellazionePraResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.cancellazionePra.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'cancellazione-pra/:id/edit',
        component: CancellazionePraUpdateComponent,
        resolve: {
            cancellazionePra: CancellazionePraResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.cancellazionePra.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const cancellazionePraPopupRoute: Routes = [
    {
        path: 'cancellazione-pra/:id/delete',
        component: CancellazionePraDeletePopupComponent,
        resolve: {
            cancellazionePra: CancellazionePraResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.cancellazionePra.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
