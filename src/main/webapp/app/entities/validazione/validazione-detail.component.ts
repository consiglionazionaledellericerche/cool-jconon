import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IValidazione } from 'app/shared/model/validazione.model';

@Component({
    selector: 'jhi-validazione-detail',
    templateUrl: './validazione-detail.component.html'
})
export class ValidazioneDetailComponent implements OnInit {
    validazione: IValidazione;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ validazione }) => {
            this.validazione = validazione;
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
