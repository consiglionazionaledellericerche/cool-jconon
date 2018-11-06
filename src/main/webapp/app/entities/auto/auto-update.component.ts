import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IAuto } from 'app/shared/model/auto.model';
import { AutoService } from './auto.service';
import { IIstituti } from 'app/shared/model/istituti.model';
import { IstitutiService } from 'app/entities/istituti';
import { IUser, UserService } from 'app/core';

@Component({
    selector: 'jhi-auto-update',
    templateUrl: './auto-update.component.html'
})
export class AutoUpdateComponent implements OnInit {
    private _auto: IAuto;
    isSaving: boolean;

    istitutis: IIstituti[];

    users: IUser[];
    inizio_noleggioDp: any;
    fine_noleggioDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private autoService: AutoService,
        private istitutiService: IstitutiService,
        private userService: UserService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ auto }) => {
            this.auto = auto;
        });
        this.istitutiService.query().subscribe(
            (res: HttpResponse<IIstituti[]>) => {
                this.istitutis = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.auto.id !== undefined) {
            this.subscribeToSaveResponse(this.autoService.update(this.auto));
        } else {
            this.subscribeToSaveResponse(this.autoService.create(this.auto));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IAuto>>) {
        result.subscribe((res: HttpResponse<IAuto>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackIstitutiById(index: number, item: IIstituti) {
        return item.id;
    }

    trackUserById(index: number, item: IUser) {
        return item.id;
    }
    get auto() {
        return this._auto;
    }

    set auto(auto: IAuto) {
        this._auto = auto;
    }
}
