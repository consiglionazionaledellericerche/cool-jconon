import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IMulta } from 'app/shared/model/multa.model';

@Component({
    selector: 'jhi-multa-detail',
    templateUrl: './multa-detail.component.html'
})
export class MultaDetailComponent implements OnInit {
    multa: IMulta;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ multa }) => {
            this.multa = multa;
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
