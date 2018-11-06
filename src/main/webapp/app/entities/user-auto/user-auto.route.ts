import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { User_auto } from 'app/shared/model/user-auto.model';
import { User_autoService } from './user-auto.service';
import { User_autoComponent } from './user-auto.component';
import { User_autoDetailComponent } from './user-auto-detail.component';
import { User_autoUpdateComponent } from './user-auto-update.component';
import { User_autoDeletePopupComponent } from './user-auto-delete-dialog.component';
import { IUser_auto } from 'app/shared/model/user-auto.model';

@Injectable({ providedIn: 'root' })
export class User_autoResolve implements Resolve<IUser_auto> {
    constructor(private service: User_autoService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((user_auto: HttpResponse<User_auto>) => user_auto.body));
        }
        return of(new User_auto());
    }
}

export const user_autoRoute: Routes = [
    {
        path: 'user-auto',
        component: User_autoComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'autoApp.user_auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-auto/:id/view',
        component: User_autoDetailComponent,
        resolve: {
            user_auto: User_autoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-auto/new',
        component: User_autoUpdateComponent,
        resolve: {
            user_auto: User_autoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-auto/:id/edit',
        component: User_autoUpdateComponent,
        resolve: {
            user_auto: User_autoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_auto.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const user_autoPopupRoute: Routes = [
    {
        path: 'user-auto/:id/delete',
        component: User_autoDeletePopupComponent,
        resolve: {
            user_auto: User_autoResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'autoApp.user_auto.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
