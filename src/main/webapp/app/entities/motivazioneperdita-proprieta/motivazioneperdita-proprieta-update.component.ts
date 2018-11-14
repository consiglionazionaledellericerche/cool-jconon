import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IMotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';
import { MotivazioneperditaProprietaService } from './motivazioneperdita-proprieta.service';

@Component({
    selector: 'jhi-motivazioneperdita-proprieta-update',
    templateUrl: './motivazioneperdita-proprieta-update.component.html'
})
export class MotivazioneperditaProprietaUpdateComponent implements OnInit {
    private _motivazioneperditaProprieta: IMotivazioneperditaProprieta;
    isSaving: boolean;

    constructor(private motivazioneperditaProprietaService: MotivazioneperditaProprietaService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ motivazioneperditaProprieta }) => {
            this.motivazioneperditaProprieta = motivazioneperditaProprieta;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.motivazioneperditaProprieta.id !== undefined) {
            this.subscribeToSaveResponse(this.motivazioneperditaProprietaService.update(this.motivazioneperditaProprieta));
        } else {
            this.subscribeToSaveResponse(this.motivazioneperditaProprietaService.create(this.motivazioneperditaProprieta));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMotivazioneperditaProprieta>>) {
        result.subscribe(
            (res: HttpResponse<IMotivazioneperditaProprieta>) => this.onSaveSuccess(),
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
    get motivazioneperditaProprieta() {
        return this._motivazioneperditaProprieta;
    }

    set motivazioneperditaProprieta(motivazioneperditaProprieta: IMotivazioneperditaProprieta) {
        this._motivazioneperditaProprieta = motivazioneperditaProprieta;
    }
}
