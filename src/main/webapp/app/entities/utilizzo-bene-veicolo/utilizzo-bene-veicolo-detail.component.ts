import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';

@Component({
    selector: 'jhi-utilizzo-bene-veicolo-detail',
    templateUrl: './utilizzo-bene-veicolo-detail.component.html'
})
export class UtilizzoBeneVeicoloDetailComponent implements OnInit {
    utilizzoBeneVeicolo: IUtilizzoBeneVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ utilizzoBeneVeicolo }) => {
            this.utilizzoBeneVeicolo = utilizzoBeneVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
