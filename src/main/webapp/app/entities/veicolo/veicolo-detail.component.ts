import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVeicolo } from 'app/shared/model/veicolo.model';

@Component({
    selector: 'jhi-veicolo-detail',
    templateUrl: './veicolo-detail.component.html'
})
export class VeicoloDetailComponent implements OnInit {
    veicolo: IVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ veicolo }) => {
            this.veicolo = veicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
