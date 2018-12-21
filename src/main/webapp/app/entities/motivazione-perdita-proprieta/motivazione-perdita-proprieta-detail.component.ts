import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';

@Component({
    selector: 'jhi-motivazione-perdita-proprieta-detail',
    templateUrl: './motivazione-perdita-proprieta-detail.component.html'
})
export class MotivazionePerditaProprietaDetailComponent implements OnInit {
    motivazionePerditaProprieta: IMotivazionePerditaProprieta;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ motivazionePerditaProprieta }) => {
            this.motivazionePerditaProprieta = motivazionePerditaProprieta;
        });
    }

    previousState() {
        window.history.back();
    }
}
