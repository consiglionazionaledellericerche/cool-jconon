import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { IUser_istituti } from 'app/shared/model/user-istituti.model';
import { User_istitutiService } from './user-istituti.service';
import { IUser, UserService } from 'app/core';
import { IIstituti } from 'app/shared/model/istituti.model';
import { IstitutiService } from 'app/entities/istituti';

@Component({
    selector: 'jhi-user-istituti-update',
    templateUrl: './user-istituti-update.component.html'
})
export class User_istitutiUpdateComponent implements OnInit {
    private _user_istituti: IUser_istituti;
    isSaving: boolean;

    users: IUser[];

    istitutis: IIstituti[];
    dataDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private user_istitutiService: User_istitutiService,
        private userService: UserService,
        private istitutiService: IstitutiService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ user_istituti }) => {
            this.user_istituti = user_istituti;
        });
        this.userService.query().subscribe(
            (res: HttpResponse<IUser[]>) => {
                this.users = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.istitutiService.query().subscribe(
            (res: HttpResponse<IIstituti[]>) => {
                this.istitutis = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.user_istituti.id !== undefined) {
            this.subscribeToSaveResponse(this.user_istitutiService.update(this.user_istituti));
        } else {
            this.subscribeToSaveResponse(this.user_istitutiService.create(this.user_istituti));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUser_istituti>>) {
        result.subscribe((res: HttpResponse<IUser_istituti>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserById(index: number, item: IUser) {
        return item.id;
    }

    trackIstitutiById(index: number, item: IIstituti) {
        return item.id;
    }
    get user_istituti() {
        return this._user_istituti;
    }

    set user_istituti(user_istituti: IUser_istituti) {
        this._user_istituti = user_istituti;
    }
}
