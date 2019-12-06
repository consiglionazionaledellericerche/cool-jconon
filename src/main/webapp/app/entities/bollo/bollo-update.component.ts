import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IBollo } from 'app/shared/model/bollo.model';
import { BolloService } from './bollo.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-bollo-update',
    templateUrl: './bollo-update.component.html'
})
export class BolloUpdateComponent implements OnInit {
    private _bollo: IBollo;
    isSaving: boolean;

    veicolos: IVeicolo[];
    dataScadenzaDp: any;
    visionatoBollo: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private bolloService: BolloService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ bollo }) => {
            this.bollo = bollo;
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
        this.bollo.visionatoBollo = moment(this.visionatoBollo, DATE_TIME_FORMAT);
        if (this.bollo.id !== undefined) {
            this.subscribeToSaveResponse(this.bolloService.update(this.bollo));
        } else {
            this.subscribeToSaveResponse(this.bolloService.create(this.bollo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IBollo>>) {
        result.subscribe((res: HttpResponse<IBollo>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
    get bollo() {
        return this._bollo;
    }

    set bollo(bollo: IBollo) {
        this._bollo = bollo;
        this.visionatoBollo = moment(bollo.visionatoBollo).format(DATE_TIME_FORMAT);
    }
}
