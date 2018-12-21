import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IAssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';

@Component({
    selector: 'jhi-assicurazione-veicolo-detail',
    templateUrl: './assicurazione-veicolo-detail.component.html'
})
export class AssicurazioneVeicoloDetailComponent implements OnInit {
    assicurazioneVeicolo: IAssicurazioneVeicolo;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ assicurazioneVeicolo }) => {
            this.assicurazioneVeicolo = assicurazioneVeicolo;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
