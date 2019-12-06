import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IMulta } from 'app/shared/model/multa.model';
import { MultaService } from './multa.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-multa-update',
    templateUrl: './multa-update.component.html'
})
export class MultaUpdateComponent implements OnInit {
    private _multa: IMulta;
    isSaving: boolean;

    veicolos: IVeicolo[];
    dataMultaDp: any;
    visionatoMulta: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private multaService: MultaService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ multa }) => {
            this.multa = multa;
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
        this.multa.visionatoMulta = moment(this.visionatoMulta, DATE_TIME_FORMAT);
        if (this.multa.id !== undefined) {
            this.subscribeToSaveResponse(this.multaService.update(this.multa));
        } else {
            this.subscribeToSaveResponse(this.multaService.create(this.multa));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IMulta>>) {
        result.subscribe((res: HttpResponse<IMulta>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
    get multa() {
        return this._multa;
    }

    set multa(multa: IMulta) {
        this._multa = multa;
        this.visionatoMulta = moment(multa.visionatoMulta).format(DATE_TIME_FORMAT);
    }
}
