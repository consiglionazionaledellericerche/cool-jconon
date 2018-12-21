import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiDataUtils } from 'ng-jhipster';

import { ILibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';

@Component({
    selector: 'jhi-libretto-percorrenza-veicolo-detail',
    templateUrl: './libretto-percorrenza-veicolo-detail.component.html'
})
export class LibrettoPercorrenzaVeicoloDetailComponent implements OnInit {
    librettoPercorrenzaVeicolo: ILibrettoPercorrenzaVeicolo;

    constructor(private dataUtils: JhiDataUtils, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ librettoPercorrenzaVeicolo }) => {
            this.librettoPercorrenzaVeicolo = librettoPercorrenzaVeicolo;
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
