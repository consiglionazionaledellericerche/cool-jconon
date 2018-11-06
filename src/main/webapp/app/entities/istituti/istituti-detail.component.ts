import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IIstituti } from 'app/shared/model/istituti.model';

@Component({
    selector: 'jhi-istituti-detail',
    templateUrl: './istituti-detail.component.html'
})
export class IstitutiDetailComponent implements OnInit {
    istituti: IIstituti;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ istituti }) => {
            this.istituti = istituti;
        });
    }

    previousState() {
        window.history.back();
    }
}
