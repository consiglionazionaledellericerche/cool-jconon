import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';

@Component({
    selector: 'jhi-motivazioneperdita-proprieta-detail',
    templateUrl: './motivazioneperdita-proprieta-detail.component.html'
})
export class MotivazioneperditaProprietaDetailComponent implements OnInit {
    motivazioneperditaProprieta: IMotivazioneperditaProprieta;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ motivazioneperditaProprieta }) => {
            this.motivazioneperditaProprieta = motivazioneperditaProprieta;
        });
    }

    previousState() {
        window.history.back();
    }
}
