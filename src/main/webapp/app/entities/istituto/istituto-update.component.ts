import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IIstituto } from 'app/shared/model/istituto.model';
import { IstitutoService } from './istituto.service';

@Component({
    selector: 'jhi-istituto-update',
    templateUrl: './istituto-update.component.html'
})
export class IstitutoUpdateComponent implements OnInit {
    private _istituto: IIstituto;
    isSaving: boolean;

    constructor(private istitutoService: IstitutoService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ istituto }) => {
            this.istituto = istituto;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.istituto.id !== undefined) {
            this.subscribeToSaveResponse(this.istitutoService.update(this.istituto));
        } else {
            this.subscribeToSaveResponse(this.istitutoService.create(this.istituto));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IIstituto>>) {
        result.subscribe((res: HttpResponse<IIstituto>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get istituto() {
        return this._istituto;
    }

    set istituto(istituto: IIstituto) {
        this._istituto = istituto;
    }
}
