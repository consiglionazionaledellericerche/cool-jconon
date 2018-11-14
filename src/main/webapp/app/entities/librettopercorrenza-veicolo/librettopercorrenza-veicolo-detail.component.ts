import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ILibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';

@Component({
    selector: 'jhi-librettopercorrenza-veicolo-detail',
    templateUrl: './librettopercorrenza-veicolo-detail.component.html'
})
export class LibrettopercorrenzaVeicoloDetailComponent implements OnInit {
    librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ librettopercorrenzaVeicolo }) => {
            this.librettopercorrenzaVeicolo = librettopercorrenzaVeicolo;
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
