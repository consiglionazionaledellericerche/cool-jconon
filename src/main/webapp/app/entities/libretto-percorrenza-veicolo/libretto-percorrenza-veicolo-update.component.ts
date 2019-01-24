import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ILibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';
import { LibrettoPercorrenzaVeicoloService } from './libretto-percorrenza-veicolo.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-libretto-percorrenza-veicolo-update',
    templateUrl: './libretto-percorrenza-veicolo-update.component.html'
})
export class LibrettoPercorrenzaVeicoloUpdateComponent implements OnInit {
    private _librettoPercorrenzaVeicolo: ILibrettoPercorrenzaVeicolo;
    isSaving: boolean;
    veicolo = [];

    veicolos: IVeicolo[];
    data: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private librettoPercorrenzaVeicoloService: LibrettoPercorrenzaVeicoloService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ librettoPercorrenzaVeicolo }) => {
            this.librettoPercorrenzaVeicolo = librettoPercorrenzaVeicolo;
        });
        this.veicoloService.query().subscribe(
            (res: HttpResponse<IVeicolo[]>) => {
                this.veicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        this.librettoPercorrenzaVeicoloService.findVeicolo().subscribe(veicoloRestituiti => {
                    this.veicolo = veicoloRestituiti;
                });
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
        this.librettoPercorrenzaVeicolo.data = moment(this.data, DATE_TIME_FORMAT);
        if (this.librettoPercorrenzaVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.librettoPercorrenzaVeicoloService.update(this.librettoPercorrenzaVeicolo));
        } else {
            this.subscribeToSaveResponse(this.librettoPercorrenzaVeicoloService.create(this.librettoPercorrenzaVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ILibrettoPercorrenzaVeicolo>>) {
        result.subscribe(
            (res: HttpResponse<ILibrettoPercorrenzaVeicolo>) => this.onSaveSuccess(),
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
    get librettoPercorrenzaVeicolo() {
        return this._librettoPercorrenzaVeicolo;
    }

    set librettoPercorrenzaVeicolo(librettoPercorrenzaVeicolo: ILibrettoPercorrenzaVeicolo) {
        this._librettoPercorrenzaVeicolo = librettoPercorrenzaVeicolo;
        this.data = moment(librettoPercorrenzaVeicolo.data).format(DATE_TIME_FORMAT);
    }
}
