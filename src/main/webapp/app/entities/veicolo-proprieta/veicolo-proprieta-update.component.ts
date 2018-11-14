import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';
import { VeicoloProprietaService } from './veicolo-proprieta.service';
import { IMotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';
import { MotivazioneperditaProprietaService } from 'app/entities/motivazioneperdita-proprieta';
import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from 'app/entities/veicolo';

@Component({
    selector: 'jhi-veicolo-proprieta-update',
    templateUrl: './veicolo-proprieta-update.component.html'
})
export class VeicoloProprietaUpdateComponent implements OnInit {
    private _veicoloProprieta: IVeicoloProprieta;
    isSaving: boolean;

    motivazioneperditaproprietas: IMotivazioneperditaProprieta[];

    veicolos: IVeicolo[];
    dataImmatricolazioneDp: any;
    dataAcquistoDp: any;
    dataperditaProprietaDp: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private veicoloProprietaService: VeicoloProprietaService,
        private motivazioneperditaProprietaService: MotivazioneperditaProprietaService,
        private veicoloService: VeicoloService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ veicoloProprieta }) => {
            this.veicoloProprieta = veicoloProprieta;
        });
        this.motivazioneperditaProprietaService.query().subscribe(
            (res: HttpResponse<IMotivazioneperditaProprieta[]>) => {
                this.motivazioneperditaproprietas = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
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

    trackMotivazioneperditaProprietaById(index: number, item: IMotivazioneperditaProprieta) {
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
