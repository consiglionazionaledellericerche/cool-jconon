import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IUtenza } from 'app/shared/model/utenza.model';

@Component({
    selector: 'jhi-utenza-detail',
    templateUrl: './utenza-detail.component.html'
})
export class UtenzaDetailComponent implements OnInit {
    utenza: IUtenza;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ utenza }) => {
            this.utenza = utenza;
        });
    }

    previousState() {
        window.history.back();
    }
}
