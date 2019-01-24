import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';
import { VeicoloProprietaService } from './veicolo-proprieta.service';
import { IMotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';
import { MotivazionePerditaProprietaService } from 'app/entities/motivazione-perdita-proprieta';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-veicolo-proprieta-update',
    templateUrl: './veicolo-proprieta-update.component.html'
})
export class VeicoloProprietaUpdateComponent implements OnInit {
    private _veicoloProprieta: IVeicoloProprieta;
    isSaving: boolean;
    veicolo = [];

    motivazioneperditaproprietas: IMotivazionePerditaProprieta[];

    veicolos: IVeicolo[];
    dataImmatricolazioneDp: any;
    dataAcquistoDp: any;
    dataPerditaProprietaDp: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private veicoloProprietaService: VeicoloProprietaService,
        private motivazionePerditaProprietaService: MotivazionePerditaProprietaService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ veicoloProprieta }) => {
            this.veicoloProprieta = veicoloProprieta;
        });
        this.motivazionePerditaProprietaService.query().subscribe(
            (res: HttpResponse<IMotivazionePerditaProprieta[]>) => {
                this.motivazioneperditaproprietas = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.veicoloService.query({ filter: 'veicoloproprieta-is-null' }).subscribe(
            (res: HttpResponse<IVeicolo[]>) => {
                if (!this.veicoloProprieta.veicolo || !this.veicoloProprieta.veicolo.id) {
                    this.veicolos = res.body;
                } else {
                    this.veicoloService.find(this.veicoloProprieta.veicolo.id).subscribe(
                        (subRes: HttpResponse<IVeicolo>) => {
                            this.veicolos = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        this.veicoloProprietaService.findVeicolo().subscribe(veicoloRestituiti => {
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
        if (this.veicoloProprieta.id !== undefined) {
            this.subscribeToSaveResponse(this.veicoloProprietaService.update(this.veicoloProprieta));
        } else {
            this.subscribeToSaveResponse(this.veicoloProprietaService.create(this.veicoloProprieta));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVeicoloProprieta>>) {
        result.subscribe((res: HttpResponse<IVeicoloProprieta>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackMotivazionePerditaProprietaById(index: number, item: IMotivazionePerditaProprieta) {
        return item.id;
    }

    trackVeicoloById(index: number, item: IVeicolo) {
        return item.id;
    }
    get veicoloProprieta() {
        return this._veicoloProprieta;
    }

    set veicoloProprieta(veicoloProprieta: IVeicoloProprieta) {
        this._veicoloProprieta = veicoloProprieta;
    }
}
