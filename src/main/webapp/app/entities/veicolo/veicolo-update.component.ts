import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';

import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from './veicolo.service';
import { ITipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';
import { TipologiaVeicoloService } from 'app/entities/tipologia-veicolo';
import { IAlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';
import { AlimentazioneVeicoloService } from 'app/entities/alimentazione-veicolo';
import { IClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';
import { ClasseEmissioniVeicoloService } from 'app/entities/classe-emissioni-veicolo';
import { IUtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';
import { UtilizzoBeneVeicoloService } from 'app/entities/utilizzo-bene-veicolo';

@Component({
    selector: 'jhi-veicolo-update',
    templateUrl: './veicolo-update.component.html'
})
export class VeicoloUpdateComponent implements OnInit {
    model: any;
    private _veicolo: IVeicolo;
    isSaving: boolean;
    searching = false;
    searchFailed = false;

    tipologiaveicolos: ITipologiaVeicolo[];

    alimentazioneveicolos: IAlimentazioneVeicolo[];

    classeemissioniveicolos: IClasseEmissioniVeicolo[];

    utilizzobeneveicolos: IUtilizzoBeneVeicolo[];
    dataValidazione: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private veicoloService: VeicoloService,
        private tipologiaVeicoloService: TipologiaVeicoloService,
        private alimentazioneVeicoloService: AlimentazioneVeicoloService,
        private classeEmissioniVeicoloService: ClasseEmissioniVeicoloService,
        private utilizzoBeneVeicoloService: UtilizzoBeneVeicoloService,
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
        this.classeEmissioniVeicoloService.query().subscribe(
            (res: HttpResponse<IClasseEmissioniVeicolo[]>) => {
                this.classeemissioniveicolos = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.utilizzoBeneVeicoloService.query().subscribe(
            (res: HttpResponse<IUtilizzoBeneVeicolo[]>) => {
                this.utilizzobeneveicolos = res.body;
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

    trackClasseEmissioniVeicoloById(index: number, item: IClasseEmissioniVeicolo) {
        return item.id;
    }

    trackUtilizzoBeneVeicoloById(index: number, item: IUtilizzoBeneVeicolo) {
        return item.id;
    }
    get veicolo() {
        return this._veicolo;
    }

    set veicolo(veicolo: IVeicolo) {
        this._veicolo = veicolo;
        this.dataValidazione = moment(veicolo.dataValidazione).format(DATE_TIME_FORMAT);
    }

    search = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => (this.searching = true)),
            switchMap(term =>
                this.veicoloService.findPersona(term).pipe(
                    //        this._service.search(term).pipe(
                    tap(() => (this.searchFailed = false)),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    })
                )
            ),
            tap(() => (this.searching = false))
        );

    search2 = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => (this.searching = true)),
            switchMap(term =>
                this.veicoloService.findIstituto(term).pipe(
                    //            this._service.search(term).pipe(
                    tap(() => (this.searchFailed = false)),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    })
                )
            ),
            tap(() => (this.searching = false))
        );
}
