import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IValidazione } from 'app/shared/model/validazione.model';
import { ValidazioneService } from './validazione.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-validazione-update',
    templateUrl: './validazione-update.component.html'
})
export class ValidazioneUpdateComponent implements OnInit {
    private _validazione: IValidazione;
    isSaving: boolean;

    veicolos: IVeicolo[];
    dataModificaDp: any;
    dataValidazioneDirettore: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private validazioneService: ValidazioneService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ validazione }) => {
            this.validazione = validazione;
        });
        this.veicoloService.query().subscribe(
            (res: HttpResponse<IVeicolo[]>) => {
                this.veicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData(event, entity, field, isImage) {
        this.dataUtils.setFileData(event, entity, field, isImage);
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.validazione.dataValidazioneDirettore = moment(this.dataValidazioneDirettore, DATE_TIME_FORMAT);
        if (this.validazione.id !== undefined) {
            this.subscribeToSaveResponse(this.validazioneService.update(this.validazione));
        } else {
            this.subscribeToSaveResponse(this.validazioneService.create(this.validazione));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IValidazione>>) {
        result.subscribe((res: HttpResponse<IValidazione>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackVeicoloById(index: number, item: IVeicolo) {
        return item.id;
    }
    get validazione() {
        return this._validazione;
    }

    set validazione(validazione: IValidazione) {
        this._validazione = validazione;
        this.dataValidazioneDirettore = moment(validazione.dataValidazioneDirettore).format(DATE_TIME_FORMAT);
    }
}
