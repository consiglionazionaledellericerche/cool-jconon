import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';
import { UtilizzoBeneVeicoloService } from './utilizzo-bene-veicolo.service';

@Component({
    selector: 'jhi-utilizzo-bene-veicolo-delete-dialog',
    templateUrl: './utilizzo-bene-veicolo-delete-dialog.component.html'
})
export class UtilizzoBeneVeicoloDeleteDialogComponent {
    utilizzoBeneVeicolo: IUtilizzoBeneVeicolo;

    constructor(
        private utilizzoBeneVeicoloService: UtilizzoBeneVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.utilizzoBeneVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'utilizzoBeneVeicoloListModification',
                content: 'Deleted an utilizzoBeneVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-utilizzo-bene-veicolo-delete-popup',
    template: ''
})
export class UtilizzoBeneVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ utilizzoBeneVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UtilizzoBeneVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.utilizzoBeneVeicolo = utilizzoBeneVeicolo;
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
