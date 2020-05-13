import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { ICancellazionePra } from 'app/shared/model/cancellazione-pra.model';
import { CancellazionePraService } from './cancellazione-pra.service';
import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';
import { VeicoloProprietaService } from 'app/entities/veicolo-proprieta';

@Component({
    selector: 'jhi-cancellazione-pra-update',
    templateUrl: './cancellazione-pra-update.component.html'
})
export class CancellazionePraUpdateComponent implements OnInit {
    private _cancellazionePra: ICancellazionePra;
    isSaving: boolean;

    veicoloproprietas: IVeicoloProprieta[];
    dataConsegnaDp: any;

    constructor(
        private dataUtils: JhiDataUtils,
        private jhiAlertService: JhiAlertService,
        private cancellazionePraService: CancellazionePraService,
        private veicoloProprietaService: VeicoloProprietaService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ cancellazionePra }) => {
            this.cancellazionePra = cancellazionePra;
        });
        this.veicoloProprietaService.query({ filter: 'cancellazionepra-is-null' }).subscribe(
            (res: HttpResponse<IVeicoloProprieta[]>) => {
                if (!this.cancellazionePra.veicoloProprieta || !this.cancellazionePra.veicoloProprieta.id) {
                    this.veicoloproprietas = res.body;
                } else {
                    this.veicoloProprietaService.find(this.cancellazionePra.veicoloProprieta.id).subscribe(
                        (subRes: HttpResponse<IVeicoloProprieta>) => {
                            this.veicoloproprietas = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
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
        if (this.cancellazionePra.id !== undefined) {
            this.subscribeToSaveResponse(this.cancellazionePraService.update(this.cancellazionePra));
        } else {
            this.subscribeToSaveResponse(this.cancellazionePraService.create(this.cancellazionePra));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICancellazionePra>>) {
        result.subscribe((res: HttpResponse<ICancellazionePra>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackVeicoloProprietaById(index: number, item: IVeicoloProprieta) {
        return item.id;
    }
    get cancellazionePra() {
        return this._cancellazionePra;
    }

    set cancellazionePra(cancellazionePra: ICancellazionePra) {
        this._cancellazionePra = cancellazionePra;
    }
}
