import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Auto } from 'app/shared/model/auto.model';
import { AutoService } from './auto.service';
import { AutoComponent } from './auto.component';
import { AutoDetailComponent } from './auto-detail.component';
import { AutoUpdateComponent } from './auto-update.component';
import { AutoDeletePopupComponent } from './auto-delete-dialog.component';
import { IAuto } from 'app/shared/model/auto.model';

@Injectable({ providedIn: 'root' })
export class AutoResolve implements Resolve<IAuto> {
    constructor(private service: AutoService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((auto: HttpResponse<Auto>) => auto.body));
        }
        return of(new Auto());
    }
}

export const autoRoute: Routes = [
    {
        path: 'auto',
        component: AutoComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'autoApp.auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'auto/:id/view',
        component: AutoDetailComponent,
        resolve: {
            auto: AutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'auto/new',
        component: AutoUpdateComponent,
        resolve: {
            auto: AutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'auto/:id/edit',
        component: AutoUpdateComponent,
        resolve: {
            auto: AutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const autoPopupRoute: Routes = [
    {
        path: 'auto/:id/delete',
        component: AutoDeletePopupComponent,
        resolve: {
            auto: AutoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.auto.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
