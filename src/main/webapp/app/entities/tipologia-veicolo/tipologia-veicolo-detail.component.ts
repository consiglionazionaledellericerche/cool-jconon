import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';

@Component({
    selector: 'jhi-tipologia-veicolo-detail',
    templateUrl: './tipologia-veicolo-detail.component.html'
})
export class TipologiaVeicoloDetailComponent implements OnInit {
    tipologiaVeicolo: ITipologiaVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ tipologiaVeicolo }) => {
            this.tipologiaVeicolo = tipologiaVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
