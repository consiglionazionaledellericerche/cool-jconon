import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';
import { ClasseemissioniVeicoloService } from './classeemissioni-veicolo.service';
import { ClasseemissioniVeicoloComponent } from './classeemissioni-veicolo.component';
import { ClasseemissioniVeicoloDetailComponent } from './classeemissioni-veicolo-detail.component';
import { ClasseemissioniVeicoloUpdateComponent } from './classeemissioni-veicolo-update.component';
import { ClasseemissioniVeicoloDeletePopupComponent } from './classeemissioni-veicolo-delete-dialog.component';
import { IClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';

@Injectable({ providedIn: 'root' })
export class ClasseemissioniVeicoloResolve implements Resolve<IClasseemissioniVeicolo> {
    constructor(private service: ClasseemissioniVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service
                .find(id)
                .pipe(map((classeemissioniVeicolo: HttpResponse<ClasseemissioniVeicolo>) => classeemissioniVeicolo.body));
        }
        return of(new ClasseemissioniVeicolo());
    }
}

export const classeemissioniVeicoloRoute: Routes = [
    {
        path: 'classeemissioni-veicolo',
        component: ClasseemissioniVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.classeemissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'classeemissioni-veicolo/:id/view',
        component: ClasseemissioniVeicoloDetailComponent,
        resolve: {
            classeemissioniVeicolo: ClasseemissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeemissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'classeemissioni-veicolo/new',
        component: ClasseemissioniVeicoloUpdateComponent,
        resolve: {
            classeemissioniVeicolo: ClasseemissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeemissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'classeemissioni-veicolo/:id/edit',
        component: ClasseemissioniVeicoloUpdateComponent,
        resolve: {
            classeemissioniVeicolo: ClasseemissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeemissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const classeemissioniVeicoloPopupRoute: Routes = [
    {
        path: 'classeemissioni-veicolo/:id/delete',
        component: ClasseemissioniVeicoloDeletePopupComponent,
        resolve: {
            classeemissioniVeicolo: ClasseemissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeemissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
