import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Validazione } from 'app/shared/model/validazione.model';
import { ValidazioneService } from './validazione.service';
import { ValidazioneComponent } from './validazione.component';
import { ValidazioneDetailComponent } from './validazione-detail.component';
import { ValidazioneUpdateComponent } from './validazione-update.component';
import { ValidazioneDeletePopupComponent } from './validazione-delete-dialog.component';
import { IValidazione } from 'app/shared/model/validazione.model';

@Injectable({ providedIn: 'root' })
export class ValidazioneResolve implements Resolve<IValidazione> {
    constructor(private service: ValidazioneService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((validazione: HttpResponse<Validazione>) => validazione.body));
        }
        return of(new Validazione());
    }
}

export const validazioneRoute: Routes = [
    {
        path: 'validazione',
        component: ValidazioneComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.validazione.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'validazione/:id/view',
        component: ValidazioneDetailComponent,
        resolve: {
            validazione: ValidazioneResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.validazione.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'validazione/new',
        component: ValidazioneUpdateComponent,
        resolve: {
            validazione: ValidazioneResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.validazione.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'validazione/:id/edit',
        component: ValidazioneUpdateComponent,
        resolve: {
            validazione: ValidazioneResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.validazione.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const validazionePopupRoute: Routes = [
    {
        path: 'validazione/:id/delete',
        component: ValidazioneDeletePopupComponent,
        resolve: {
            validazione: ValidazioneResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.validazione.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
