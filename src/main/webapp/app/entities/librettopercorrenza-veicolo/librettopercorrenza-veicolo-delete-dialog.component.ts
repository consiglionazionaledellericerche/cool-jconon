import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ILibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';
import { LibrettopercorrenzaVeicoloService } from './librettopercorrenza-veicolo.service';

@Component({
    selector: 'jhi-librettopercorrenza-veicolo-delete-dialog',
    templateUrl: './librettopercorrenza-veicolo-delete-dialog.component.html'
})
export class LibrettopercorrenzaVeicoloDeleteDialogComponent {
    librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo;

    constructor(
        private librettopercorrenzaVeicoloService: LibrettopercorrenzaVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.librettopercorrenzaVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'librettopercorrenzaVeicoloListModification',
                content: 'Deleted an librettopercorrenzaVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-librettopercorrenza-veicolo-delete-popup',
    template: ''
})
export class LibrettopercorrenzaVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ librettopercorrenzaVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(LibrettopercorrenzaVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.librettopercorrenzaVeicolo = librettopercorrenzaVeicolo;
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
