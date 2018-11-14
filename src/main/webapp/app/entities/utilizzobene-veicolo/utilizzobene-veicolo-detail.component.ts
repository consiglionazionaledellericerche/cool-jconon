import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';

@Component({
    selector: 'jhi-utilizzobene-veicolo-detail',
    templateUrl: './utilizzobene-veicolo-detail.component.html'
})
export class UtilizzobeneVeicoloDetailComponent implements OnInit {
    utilizzobeneVeicolo: IUtilizzobeneVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ utilizzobeneVeicolo }) => {
            this.utilizzobeneVeicolo = utilizzobeneVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
