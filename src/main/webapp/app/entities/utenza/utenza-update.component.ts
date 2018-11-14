import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUtenza } from 'app/shared/model/utenza.model';
import { UtenzaService } from './utenza.service';

@Component({
    selector: 'jhi-utenza-update',
    templateUrl: './utenza-update.component.html'
})
export class UtenzaUpdateComponent implements OnInit {
    private _utenza: IUtenza;
    isSaving: boolean;

    constructor(private utenzaService: UtenzaService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ utenza }) => {
            this.utenza = utenza;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.utenza.id !== undefined) {
            this.subscribeToSaveResponse(this.utenzaService.update(this.utenza));
        } else {
            this.subscribeToSaveResponse(this.utenzaService.create(this.utenza));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUtenza>>) {
        result.subscribe((res: HttpResponse<IUtenza>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get utenza() {
        return this._utenza;
    }

    set utenza(utenza: IUtenza) {
        this._utenza = utenza;
    }
}
