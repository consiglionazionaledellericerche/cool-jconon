import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IAssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';
import { AssicurazioneVeicoloService } from './assicurazione-veicolo.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-assicurazione-veicolo-update',
    templateUrl: './assicurazione-veicolo-update.component.html'
})
export class AssicurazioneVeicoloUpdateComponent implements OnInit {
    private _assicurazioneVeicolo: IAssicurazioneVeicolo;
    isSaving: boolean;
    veicolo = [];

    veicolos: IVeicolo[];
    dataScadenzaDp: any;
    dataInserimento: string;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private assicurazioneVeicoloService: AssicurazioneVeicoloService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ assicurazioneVeicolo }) => {
            this.assicurazioneVeicolo = assicurazioneVeicolo;
        });
        this.veicoloService.query().subscribe(
            (res: HttpResponse<IVeicolo[]>) => {
                this.veicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

         this.assicurazioneVeicoloService.findVeicolo().subscribe(veicoloRestituiti => {
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
        this.assicurazioneVeicolo.dataInserimento = moment(this.dataInserimento, DATE_TIME_FORMAT);
        if (this.assicurazioneVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.assicurazioneVeicoloService.update(this.assicurazioneVeicolo));
        } else {
            this.subscribeToSaveResponse(this.assicurazioneVeicoloService.create(this.assicurazioneVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IAssicurazioneVeicolo>>) {
        result.subscribe(
            (res: HttpResponse<IAssicurazioneVeicolo>) => this.onSaveSuccess(),
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
    get assicurazioneVeicolo() {
        return this._assicurazioneVeicolo;
    }

    set assicurazioneVeicolo(assicurazioneVeicolo: IAssicurazioneVeicolo) {
        this._assicurazioneVeicolo = assicurazioneVeicolo;
        this.dataInserimento = moment(assicurazioneVeicolo.dataInserimento).format(DATE_TIME_FORMAT);
    }
}
