import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Istituti } from 'app/shared/model/istituti.model';
import { IstitutiService } from './istituti.service';
import { IstitutiComponent } from './istituti.component';
import { IstitutiDetailComponent } from './istituti-detail.component';
import { IstitutiUpdateComponent } from './istituti-update.component';
import { IstitutiDeletePopupComponent } from './istituti-delete-dialog.component';
import { IIstituti } from 'app/shared/model/istituti.model';

@Injectable({ providedIn: 'root' })
export class IstitutiResolve implements Resolve<IIstituti> {
    constructor(private service: IstitutiService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((istituti: HttpResponse<Istituti>) => istituti.body));
        }
        return of(new Istituti());
    }
}

export const istitutiRoute: Routes = [
    {
        path: 'istituti',
        component: IstitutiComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'autoApp.istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'istituti/:id/view',
        component: IstitutiDetailComponent,
        resolve: {
            istituti: IstitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'istituti/new',
        component: IstitutiUpdateComponent,
        resolve: {
            istituti: IstitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'istituti/:id/edit',
        component: IstitutiUpdateComponent,
        resolve: {
            istituti: IstitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const istitutiPopupRoute: Routes = [
    {
        path: 'istituti/:id/delete',
        component: IstitutiDeletePopupComponent,
        resolve: {
            istituti: IstitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.istituti.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
