import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';
import { LibrettoPercorrenzaVeicoloService } from './libretto-percorrenza-veicolo.service';

@Component({
    selector: 'jhi-libretto-percorrenza-veicolo-delete-dialog',
    templateUrl: './libretto-percorrenza-veicolo-delete-dialog.component.html'
})
export class LibrettoPercorrenzaVeicoloDeleteDialogComponent {
    librettoPercorrenzaVeicolo: ILibrettoPercorrenzaVeicolo;

    constructor(
        private librettoPercorrenzaVeicoloService: LibrettoPercorrenzaVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.librettoPercorrenzaVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'librettoPercorrenzaVeicoloListModification',
                content: 'Deleted an librettoPercorrenzaVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-libretto-percorrenza-veicolo-delete-popup',
    template: ''
})
export class LibrettoPercorrenzaVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ librettoPercorrenzaVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(LibrettoPercorrenzaVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.librettoPercorrenzaVeicolo = librettoPercorrenzaVeicolo;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
