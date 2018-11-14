import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';
import { AlimentazioneVeicoloService } from './alimentazione-veicolo.service';

@Component({
    selector: 'jhi-alimentazione-veicolo-update',
    templateUrl: './alimentazione-veicolo-update.component.html'
})
export class AlimentazioneVeicoloUpdateComponent implements OnInit {
    private _alimentazioneVeicolo: IAlimentazioneVeicolo;
    isSaving: boolean;

    constructor(private alimentazioneVeicoloService: AlimentazioneVeicoloService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ alimentazioneVeicolo }) => {
            this.alimentazioneVeicolo = alimentazioneVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.alimentazioneVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.alimentazioneVeicoloService.update(this.alimentazioneVeicolo));
        } else {
            this.subscribeToSaveResponse(this.alimentazioneVeicoloService.create(this.alimentazioneVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IAlimentazioneVeicolo>>) {
        result.subscribe(
            (res: HttpResponse<IAlimentazioneVeicolo>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get alimentazioneVeicolo() {
        return this._alimentazioneVeicolo;
    }

    set alimentazioneVeicolo(alimentazioneVeicolo: IAlimentazioneVeicolo) {
        this._alimentazioneVeicolo = alimentazioneVeicolo;
    }
}
