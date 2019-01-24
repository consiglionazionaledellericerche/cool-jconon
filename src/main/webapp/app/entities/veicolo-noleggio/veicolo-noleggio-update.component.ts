import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IVeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';
import { VeicoloNoleggioService } from './veicolo-noleggio.service';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-veicolo-noleggio-update',
    templateUrl: './veicolo-noleggio-update.component.html'
})
export class VeicoloNoleggioUpdateComponent implements OnInit {
    private _veicoloNoleggio: IVeicoloNoleggio;
    isSaving: boolean;
    veicolo = [];

    veicolos: IVeicolo[];
    dataInizioNoleggioDp: any;
    dataFineNoleggioDp: any;
    dataCessazioneAnticipataDp: any;
    dataProrogaDp: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private veicoloNoleggioService: VeicoloNoleggioService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ veicoloNoleggio }) => {
            this.veicoloNoleggio = veicoloNoleggio;
        });
        this.veicoloService.query({ filter: 'veicolonoleggio-is-null' }).subscribe(
            (res: HttpResponse<IVeicolo[]>) => {
                if (!this.veicoloNoleggio.veicolo || !this.veicoloNoleggio.veicolo.id) {
                    this.veicolos = res.body;
                } else {
                    this.veicoloService.find(this.veicoloNoleggio.veicolo.id).subscribe(
                        (subRes: HttpResponse<IVeicolo>) => {
                            this.veicolos = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );

        this.veicoloNoleggioService.findVeicolo().subscribe(veicoloRestituiti => {
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
        if (this.veicoloNoleggio.id !== undefined) {
            this.subscribeToSaveResponse(this.veicoloNoleggioService.update(this.veicoloNoleggio));
        } else {
            this.subscribeToSaveResponse(this.veicoloNoleggioService.create(this.veicoloNoleggio));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IVeicoloNoleggio>>) {
        result.subscribe((res: HttpResponse<IVeicoloNoleggio>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
    get veicoloNoleggio() {
        return this._veicoloNoleggio;
    }

    set veicoloNoleggio(veicoloNoleggio: IVeicoloNoleggio) {
        this._veicoloNoleggio = veicoloNoleggio;
    }
}
