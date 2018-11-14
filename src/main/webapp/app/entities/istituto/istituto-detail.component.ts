import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIstituto } from 'app/shared/model/istituto.model';

@Component({
    selector: 'jhi-istituto-detail',
    templateUrl: './istituto-detail.component.html'
})
export class IstitutoDetailComponent implements OnInit {
    istituto: IIstituto;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ istituto }) => {
            this.istituto = istituto;
        });
    }

    previousState() {
        window.history.back();
    }
}
