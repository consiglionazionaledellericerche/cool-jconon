import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IBollo } from 'app/shared/model/bollo.model';

@Component({
    selector: 'jhi-bollo-detail',
    templateUrl: './bollo-detail.component.html'
})
export class BolloDetailComponent implements OnInit {
    bollo: IBollo;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ bollo }) => {
            this.bollo = bollo;
        });
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    previousState() {
        window.history.back();
    }
}
