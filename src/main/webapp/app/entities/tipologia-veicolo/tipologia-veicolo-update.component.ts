import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ITipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';
import { TipologiaVeicoloService } from './tipologia-veicolo.service';

@Component({
    selector: 'jhi-tipologia-veicolo-update',
    templateUrl: './tipologia-veicolo-update.component.html'
})
export class TipologiaVeicoloUpdateComponent implements OnInit {
    private _tipologiaVeicolo: ITipologiaVeicolo;
    isSaving: boolean;

    constructor(private tipologiaVeicoloService: TipologiaVeicoloService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ tipologiaVeicolo }) => {
            this.tipologiaVeicolo = tipologiaVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.tipologiaVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.tipologiaVeicoloService.update(this.tipologiaVeicolo));
        } else {
            this.subscribeToSaveResponse(this.tipologiaVeicoloService.create(this.tipologiaVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITipologiaVeicolo>>) {
        result.subscribe((res: HttpResponse<ITipologiaVeicolo>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get tipologiaVeicolo() {
        return this._tipologiaVeicolo;
    }

    set tipologiaVeicolo(tipologiaVeicolo: ITipologiaVeicolo) {
        this._tipologiaVeicolo = tipologiaVeicolo;
    }
}
