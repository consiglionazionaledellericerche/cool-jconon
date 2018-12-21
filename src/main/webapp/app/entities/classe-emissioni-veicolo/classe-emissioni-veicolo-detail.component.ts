import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';

@Component({
    selector: 'jhi-classe-emissioni-veicolo-detail',
    templateUrl: './classe-emissioni-veicolo-detail.component.html'
})
export class ClasseEmissioniVeicoloDetailComponent implements OnInit {
    classeEmissioniVeicolo: IClasseEmissioniVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ classeEmissioniVeicolo }) => {
            this.classeEmissioniVeicolo = classeEmissioniVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
