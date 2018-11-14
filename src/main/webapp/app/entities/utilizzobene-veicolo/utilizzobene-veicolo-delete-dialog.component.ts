import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';
import { UtilizzobeneVeicoloService } from './utilizzobene-veicolo.service';

@Component({
    selector: 'jhi-utilizzobene-veicolo-delete-dialog',
    templateUrl: './utilizzobene-veicolo-delete-dialog.component.html'
})
export class UtilizzobeneVeicoloDeleteDialogComponent {
    utilizzobeneVeicolo: IUtilizzobeneVeicolo;

    constructor(
        private utilizzobeneVeicoloService: UtilizzobeneVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.utilizzobeneVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'utilizzobeneVeicoloListModification',
                content: 'Deleted an utilizzobeneVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-utilizzobene-veicolo-delete-popup',
    template: ''
})
export class UtilizzobeneVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ utilizzobeneVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UtilizzobeneVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.utilizzobeneVeicolo = utilizzobeneVeicolo;
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
