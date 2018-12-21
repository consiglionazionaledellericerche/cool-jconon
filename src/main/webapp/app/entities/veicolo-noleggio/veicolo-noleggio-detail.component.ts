import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IVeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';

@Component({
    selector: 'jhi-veicolo-noleggio-detail',
    templateUrl: './veicolo-noleggio-detail.component.html'
})
export class VeicoloNoleggioDetailComponent implements OnInit {
    veicoloNoleggio: IVeicoloNoleggio;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ veicoloNoleggio }) => {
            this.veicoloNoleggio = veicoloNoleggio;
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
