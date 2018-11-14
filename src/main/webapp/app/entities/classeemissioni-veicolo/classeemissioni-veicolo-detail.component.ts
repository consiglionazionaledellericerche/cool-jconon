import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';

@Component({
    selector: 'jhi-classeemissioni-veicolo-detail',
    templateUrl: './classeemissioni-veicolo-detail.component.html'
})
export class ClasseemissioniVeicoloDetailComponent implements OnInit {
    classeemissioniVeicolo: IClasseemissioniVeicolo;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ classeemissioniVeicolo }) => {
            this.classeemissioniVeicolo = classeemissioniVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }
}
