import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IIstituti } from 'app/shared/model/istituti.model';
import { IstitutiService } from './istituti.service';

@Component({
    selector: 'jhi-istituti-update',
    templateUrl: './istituti-update.component.html'
})
export class IstitutiUpdateComponent implements OnInit {
    private _istituti: IIstituti;
    isSaving: boolean;

    constructor(private istitutiService: IstitutiService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ istituti }) => {
            this.istituti = istituti;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.istituti.id !== undefined) {
            this.subscribeToSaveResponse(this.istitutiService.update(this.istituti));
        } else {
            this.subscribeToSaveResponse(this.istitutiService.create(this.istituti));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IIstituti>>) {
        result.subscribe((res: HttpResponse<IIstituti>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get istituti() {
        return this._istituti;
    }

    set istituti(istituti: IIstituti) {
        this._istituti = istituti;
    }
}
