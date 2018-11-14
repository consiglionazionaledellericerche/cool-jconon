import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from './veicolo.service';
import { ITipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';
import { TipologiaVeicoloService } from 'app/entities/tipologia-veicolo';
import { IAlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';
import { AlimentazioneVeicoloService } from 'app/entities/alimentazione-veicolo';
import { IClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';
import { ClasseemissioniVeicoloService } from 'app/entities/classeemissioni-veicolo';
import { IUtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';
import { UtilizzobeneVeicoloService } from 'app/entities/utilizzobene-veicolo';
import { IIstituto } from 'app/shared/model/istituto.model';
import { IstitutoService } from 'app/entities/istituto';
import { IUtenza } from 'app/shared/model/utenza.model';
import { UtenzaService } from 'app/entities/utenza';

@Component({
    selector: 'jhi-veicolo-update',
    templateUrl: './veicolo-update.component.html'
})
export class VeicoloUpdateComponent implements OnInit {
    private _veicolo: IVeicolo;
    isSaving: boolean;

    tipologiaveicolos: ITipologiaVeicolo[];

    alimentazioneveicolos: IAlimentazioneVeicolo[];

    classeemissioniveicolos: IClasseemissioniVeicolo[];

    utilizzobeneveicolos: IUtilizzobeneVeicolo[];

    istitutos: IIstituto[];

    utenzas: IUtenza[];
    dataValidazione: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private veicoloService: VeicoloService,
        private tipologiaVeicoloService: TipologiaVeicoloService,
        private alimentazioneVeicoloService: AlimentazioneVeicoloService,
        private classeemissioniVeicoloService: ClasseemissioniVeicoloService,
        private utilizzobeneVeicoloService: UtilizzobeneVeicoloService,
        private istitutoService: IstitutoService,
        private utenzaService: UtenzaService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ veicolo }) => {
            this.veicolo = veicolo;
        });
        this.tipologiaVeicoloService.query().subscribe(
            (res: HttpResponse<ITipologiaVeicolo[]>) => {
                this.tipologiaveicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.alimentazioneVeicoloService.query().subscribe(
            (res: HttpResponse<IAlimentazioneVeicolo[]>) => {
                this.alimentazioneveicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.classeemissioniVeicoloService.query().subscribe(
            (res: HttpResponse<IClasseemissioniVeicolo[]>) => {
                this.classeemissioniveicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.utilizzobeneVeicoloService.query().subscribe(
            (res: HttpResponse<IUtilizzobeneVeicolo[]>) => {
                this.utilizzobeneveicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.istitutoService.query().subscribe(
            (res: HttpResponse<IIstituto[]>) => {
                this.istitutos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.utenzaService.query().subscribe(
            (res: HttpResponse<IUtenza[]>) => {
                this.utenzas = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.veicolo.dataValidazione = moment(this.dataValidazione, DATE_TIME_FORMAT);
        if (this.veicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.veicoloService.update(this.veicolo));
        } else {
            this.subscribeToSaveResponse(this.veicoloService.create(this.veicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVeicolo>>) {
        result.subscribe((res: HttpResponse<IVeicolo>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackTipologiaVeicoloById(index: number, item: ITipologiaVeicolo) {
        return item.id;
    }

    trackAlimentazioneVeicoloById(index: number, item: IAlimentazioneVeicolo) {
        return item.id;
    }

    trackClasseemissioniVeicoloById(index: number, item: IClasseemissioniVeicolo) {
        return item.id;
    }

    trackUtilizzobeneVeicoloById(index: number, item: IUtilizzobeneVeicolo) {
        return item.id;
    }

    trackIstitutoById(index: number, item: IIstituto) {
        return item.id;
    }

    trackUtenzaById(index: number, item: IUtenza) {
        return item.id;
    }
    get veicolo() {
        return this._veicolo;
    }

    set veicolo(veicolo: IVeicolo) {
        this._veicolo = veicolo;
        this.dataValidazione = moment(veicolo.dataValidazione).format(DATE_TIME_FORMAT);
    }
}
