import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Istituto } from 'app/shared/model/istituto.model';
import { IstitutoService } from './istituto.service';
import { IstitutoComponent } from './istituto.component';
import { IstitutoDetailComponent } from './istituto-detail.component';
import { IstitutoUpdateComponent } from './istituto-update.component';
import { IstitutoDeletePopupComponent } from './istituto-delete-dialog.component';
import { IIstituto } from 'app/shared/model/istituto.model';

@Injectable({ providedIn: 'root' })
export class IstitutoResolve implements Resolve<IIstituto> {
    constructor(private service: IstitutoService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((istituto: HttpResponse<Istituto>) => istituto.body));
        }
        return of(new Istituto());
    }
}

export const istitutoRoute: Routes = [
    {
        path: 'istituto',
        component: IstitutoComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.istituto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'istituto/:id/view',
        component: IstitutoDetailComponent,
        resolve: {
            istituto: IstitutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.istituto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'istituto/new',
        component: IstitutoUpdateComponent,
        resolve: {
            istituto: IstitutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.istituto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'istituto/:id/edit',
        component: IstitutoUpdateComponent,
        resolve: {
            istituto: IstitutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.istituto.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const istitutoPopupRoute: Routes = [
    {
        path: 'istituto/:id/delete',
        component: IstitutoDeletePopupComponent,
        resolve: {
            istituto: IstitutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.istituto.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
