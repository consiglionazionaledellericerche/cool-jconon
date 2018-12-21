import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';
import { MotivazionePerditaProprietaService } from './motivazione-perdita-proprieta.service';

@Component({
    selector: 'jhi-motivazione-perdita-proprieta-update',
    templateUrl: './motivazione-perdita-proprieta-update.component.html'
})
export class MotivazionePerditaProprietaUpdateComponent implements OnInit {
    private _motivazionePerditaProprieta: IMotivazionePerditaProprieta;
    isSaving: boolean;

    constructor(private motivazionePerditaProprietaService: MotivazionePerditaProprietaService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ motivazionePerditaProprieta }) => {
            this.motivazionePerditaProprieta = motivazionePerditaProprieta;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.motivazionePerditaProprieta.id !== undefined) {
            this.subscribeToSaveResponse(this.motivazionePerditaProprietaService.update(this.motivazionePerditaProprieta));
        } else {
            this.subscribeToSaveResponse(this.motivazionePerditaProprietaService.create(this.motivazionePerditaProprieta));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMotivazionePerditaProprieta>>) {
        result.subscribe(
            (res: HttpResponse<IMotivazionePerditaProprieta>) => this.onSaveSuccess(),
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
    get motivazionePerditaProprieta() {
        return this._motivazionePerditaProprieta;
    }

    set motivazionePerditaProprieta(motivazionePerditaProprieta: IMotivazionePerditaProprieta) {
        this._motivazionePerditaProprieta = motivazionePerditaProprieta;
    }
}
