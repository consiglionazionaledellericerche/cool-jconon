import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';

@Component({
    selector: 'jhi-veicolo-proprieta-detail',
    templateUrl: './veicolo-proprieta-detail.component.html'
})
export class VeicoloProprietaDetailComponent implements OnInit {
    veicoloProprieta: IVeicoloProprieta;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ veicoloProprieta }) => {
            this.veicoloProprieta = veicoloProprieta;
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
