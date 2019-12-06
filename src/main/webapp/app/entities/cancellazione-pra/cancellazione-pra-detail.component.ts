import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ICancellazionePra } from 'app/shared/model/cancellazione-pra.model';

@Component({
    selector: 'jhi-cancellazione-pra-detail',
    templateUrl: './cancellazione-pra-detail.component.html'
})
export class CancellazionePraDetailComponent implements OnInit {
    cancellazionePra: ICancellazionePra;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cancellazionePra }) => {
            this.cancellazionePra = cancellazionePra;
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
