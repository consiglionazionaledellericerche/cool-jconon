import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';
import { UtilizzobeneVeicoloService } from './utilizzobene-veicolo.service';

@Component({
    selector: 'jhi-utilizzobene-veicolo-update',
    templateUrl: './utilizzobene-veicolo-update.component.html'
})
export class UtilizzobeneVeicoloUpdateComponent implements OnInit {
    private _utilizzobeneVeicolo: IUtilizzobeneVeicolo;
    isSaving: boolean;

    constructor(private utilizzobeneVeicoloService: UtilizzobeneVeicoloService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ utilizzobeneVeicolo }) => {
            this.utilizzobeneVeicolo = utilizzobeneVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.utilizzobeneVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.utilizzobeneVeicoloService.update(this.utilizzobeneVeicolo));
        } else {
            this.subscribeToSaveResponse(this.utilizzobeneVeicoloService.create(this.utilizzobeneVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUtilizzobeneVeicolo>>) {
        result.subscribe((res: HttpResponse<IUtilizzobeneVeicolo>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get utilizzobeneVeicolo() {
        return this._utilizzobeneVeicolo;
    }

    set utilizzobeneVeicolo(utilizzobeneVeicolo: IUtilizzobeneVeicolo) {
        this._utilizzobeneVeicolo = utilizzobeneVeicolo;
    }
}
