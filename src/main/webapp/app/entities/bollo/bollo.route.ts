import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bollo } from 'app/shared/model/bollo.model';
import { BolloService } from './bollo.service';
import { BolloComponent } from './bollo.component';
import { BolloDetailComponent } from './bollo-detail.component';
import { BolloUpdateComponent } from './bollo-update.component';
import { BolloDeletePopupComponent } from './bollo-delete-dialog.component';
import { IBollo } from 'app/shared/model/bollo.model';

@Injectable({ providedIn: 'root' })
export class BolloResolve implements Resolve<IBollo> {
    constructor(private service: BolloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((bollo: HttpResponse<Bollo>) => bollo.body));
        }
        return of(new Bollo());
    }
}

export const bolloRoute: Routes = [
    {
        path: 'bollo',
        component: BolloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.bollo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'bollo/:id/view',
        component: BolloDetailComponent,
        resolve: {
            bollo: BolloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.bollo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'bollo/new',
        component: BolloUpdateComponent,
        resolve: {
            bollo: BolloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.bollo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'bollo/:id/edit',
        component: BolloUpdateComponent,
        resolve: {
            bollo: BolloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.bollo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const bolloPopupRoute: Routes = [
    {
        path: 'bollo/:id/delete',
        component: BolloDeletePopupComponent,
        resolve: {
            bollo: BolloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.bollo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
