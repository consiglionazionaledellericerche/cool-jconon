import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAuto } from 'app/shared/model/auto.model';

@Component({
    selector: 'jhi-auto-detail',
    templateUrl: './auto-detail.component.html'
})
export class AutoDetailComponent implements OnInit {
    auto: IAuto;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ auto }) => {
            this.auto = auto;
        });
    }

    previousState() {
        window.history.back();
    }
}
