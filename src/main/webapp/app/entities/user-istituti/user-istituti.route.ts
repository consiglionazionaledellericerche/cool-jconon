import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User_istituti } from 'app/shared/model/user-istituti.model';
import { User_istitutiService } from './user-istituti.service';
import { User_istitutiComponent } from './user-istituti.component';
import { User_istitutiDetailComponent } from './user-istituti-detail.component';
import { User_istitutiUpdateComponent } from './user-istituti-update.component';
import { User_istitutiDeletePopupComponent } from './user-istituti-delete-dialog.component';
import { IUser_istituti } from 'app/shared/model/user-istituti.model';

@Injectable({ providedIn: 'root' })
export class User_istitutiResolve implements Resolve<IUser_istituti> {
    constructor(private service: User_istitutiService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((user_istituti: HttpResponse<User_istituti>) => user_istituti.body));
        }
        return of(new User_istituti());
    }
}

export const user_istitutiRoute: Routes = [
    {
        path: 'user-istituti',
        component: User_istitutiComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'autoApp.user_istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-istituti/:id/view',
        component: User_istitutiDetailComponent,
        resolve: {
            user_istituti: User_istitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-istituti/new',
        component: User_istitutiUpdateComponent,
        resolve: {
            user_istituti: User_istitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-istituti/:id/edit',
        component: User_istitutiUpdateComponent,
        resolve: {
            user_istituti: User_istitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_istituti.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const user_istitutiPopupRoute: Routes = [
    {
        path: 'user-istituti/:id/delete',
        component: User_istitutiDeletePopupComponent,
        resolve: {
            user_istituti: User_istitutiResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_istituti.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
