import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUser_auto } from 'app/shared/model/user-auto.model';
import { User_autoService } from './user-auto.service';

@Component({
    selector: 'jhi-user-auto-update',
    templateUrl: './user-auto-update.component.html'
})
export class User_autoUpdateComponent implements OnInit {
    private _user_auto: IUser_auto;
    isSaving: boolean;

    constructor(private user_autoService: User_autoService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ user_auto }) => {
            this.user_auto = user_auto;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.user_auto.id !== undefined) {
            this.subscribeToSaveResponse(this.user_autoService.update(this.user_auto));
        } else {
            this.subscribeToSaveResponse(this.user_autoService.create(this.user_auto));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUser_auto>>) {
        result.subscribe((res: HttpResponse<IUser_auto>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get user_auto() {
        return this._user_auto;
    }

    set user_auto(user_auto: IUser_auto) {
        this._user_auto = user_auto;
    }
}
