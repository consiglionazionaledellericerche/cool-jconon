import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil, JhiResolvePagingParams } from 'ng-jhipster';
import { UserRouteAccessService } from 'app/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';
import { ClasseEmissioniVeicoloService } from './classe-emissioni-veicolo.service';
import { ClasseEmissioniVeicoloComponent } from './classe-emissioni-veicolo.component';
import { ClasseEmissioniVeicoloDetailComponent } from './classe-emissioni-veicolo-detail.component';
import { ClasseEmissioniVeicoloUpdateComponent } from './classe-emissioni-veicolo-update.component';
import { ClasseEmissioniVeicoloDeletePopupComponent } from './classe-emissioni-veicolo-delete-dialog.component';
import { IClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';

@Injectable({ providedIn: 'root' })
export class ClasseEmissioniVeicoloResolve implements Resolve<IClasseEmissioniVeicolo> {
    constructor(private service: ClasseEmissioniVeicoloService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service
                .find(id)
                .pipe(map((classeEmissioniVeicolo: HttpResponse<ClasseEmissioniVeicolo>) => classeEmissioniVeicolo.body));
        }
        return of(new ClasseEmissioniVeicolo());
    }
}

export const classeEmissioniVeicoloRoute: Routes = [
    {
        path: 'classe-emissioni-veicolo',
        component: ClasseEmissioniVeicoloComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'parcoautoApp.classeEmissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'classe-emissioni-veicolo/:id/view',
        component: ClasseEmissioniVeicoloDetailComponent,
        resolve: {
            classeEmissioniVeicolo: ClasseEmissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeEmissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'classe-emissioni-veicolo/new',
        component: ClasseEmissioniVeicoloUpdateComponent,
        resolve: {
            classeEmissioniVeicolo: ClasseEmissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeEmissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'classe-emissioni-veicolo/:id/edit',
        component: ClasseEmissioniVeicoloUpdateComponent,
        resolve: {
            classeEmissioniVeicolo: ClasseEmissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeEmissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const classeEmissioniVeicoloPopupRoute: Routes = [
    {
        path: 'classe-emissioni-veicolo/:id/delete',
        component: ClasseEmissioniVeicoloDeletePopupComponent,
        resolve: {
            classeEmissioniVeicolo: ClasseEmissioniVeicoloResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'parcoautoApp.classeEmissioniVeicolo.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
