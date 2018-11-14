import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ILibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';
import { LibrettopercorrenzaVeicoloService } from './librettopercorrenza-veicolo.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-librettopercorrenza-veicolo-update',
    templateUrl: './librettopercorrenza-veicolo-update.component.html'
})
export class LibrettopercorrenzaVeicoloUpdateComponent implements OnInit {
    private _librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo;
    isSaving: boolean;

    veicolos: IVeicolo[];
    data: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private librettopercorrenzaVeicoloService: LibrettopercorrenzaVeicoloService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ librettopercorrenzaVeicolo }) => {
            this.librettopercorrenzaVeicolo = librettopercorrenzaVeicolo;
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
        this.librettopercorrenzaVeicolo.data = moment(this.data, DATE_TIME_FORMAT);
        if (this.librettopercorrenzaVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.librettopercorrenzaVeicoloService.update(this.librettopercorrenzaVeicolo));
        } else {
            this.subscribeToSaveResponse(this.librettopercorrenzaVeicoloService.create(this.librettopercorrenzaVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ILibrettopercorrenzaVeicolo>>) {
        result.subscribe(
            (res: HttpResponse<ILibrettopercorrenzaVeicolo>) => this.onSaveSuccess(),
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

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackVeicoloById(index: number, item: IVeicolo) {
        return item.id;
    }
    get librettopercorrenzaVeicolo() {
        return this._librettopercorrenzaVeicolo;
    }

    set librettopercorrenzaVeicolo(librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo) {
        this._librettopercorrenzaVeicolo = librettopercorrenzaVeicolo;
        this.data = moment(librettopercorrenzaVeicolo.data).format(DATE_TIME_FORMAT);
    }
}
