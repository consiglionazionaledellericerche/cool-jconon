import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IUtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';
import { UtilizzoBeneVeicoloService } from './utilizzo-bene-veicolo.service';

@Component({
    selector: 'jhi-utilizzo-bene-veicolo-update',
    templateUrl: './utilizzo-bene-veicolo-update.component.html'
})
export class UtilizzoBeneVeicoloUpdateComponent implements OnInit {
    private _utilizzoBeneVeicolo: IUtilizzoBeneVeicolo;
    isSaving: boolean;

    constructor(private utilizzoBeneVeicoloService: UtilizzoBeneVeicoloService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ utilizzoBeneVeicolo }) => {
            this.utilizzoBeneVeicolo = utilizzoBeneVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.utilizzoBeneVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.utilizzoBeneVeicoloService.update(this.utilizzoBeneVeicolo));
        } else {
            this.subscribeToSaveResponse(this.utilizzoBeneVeicoloService.create(this.utilizzoBeneVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUtilizzoBeneVeicolo>>) {
        result.subscribe((res: HttpResponse<IUtilizzoBeneVeicolo>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get utilizzoBeneVeicolo() {
        return this._utilizzoBeneVeicolo;
    }

    set utilizzoBeneVeicolo(utilizzoBeneVeicolo: IUtilizzoBeneVeicolo) {
        this._utilizzoBeneVeicolo = utilizzoBeneVeicolo;
    }
}
