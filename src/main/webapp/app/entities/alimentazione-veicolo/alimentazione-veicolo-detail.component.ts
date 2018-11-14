import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';

@Component({
    selector: 'jhi-alimentazione-veicolo-detail',
    templateUrl: './alimentazione-veicolo-detail.component.html'
})
export class AlimentazioneVeicoloDetailComponent implements OnInit {
    alimentazioneVeicolo: IAlimentazioneVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ alimentazioneVeicolo }) => {
            this.alimentazioneVeicolo = alimentazioneVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
