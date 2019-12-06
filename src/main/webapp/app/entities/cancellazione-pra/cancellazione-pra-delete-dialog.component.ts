import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { ICancellazionePra } from 'app/shared/model/cancellazione-pra.model';
import { CancellazionePraService } from './cancellazione-pra.service';

@Component({
    selector: 'jhi-cancellazione-pra-delete-dialog',
    templateUrl: './cancellazione-pra-delete-dialog.component.html'
})
export class CancellazionePraDeleteDialogComponent {
    cancellazionePra: ICancellazionePra;

    constructor(
        private cancellazionePraService: CancellazionePraService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.cancellazionePraService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'cancellazionePraListModification',
                content: 'Deleted an cancellazionePra'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-cancellazione-pra-delete-popup',
    template: ''
})
export class CancellazionePraDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ cancellazionePra }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CancellazionePraDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.cancellazionePra = cancellazionePra;
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
