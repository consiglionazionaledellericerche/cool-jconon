import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUtenza } from 'app/shared/model/utenza.model';
import { UtenzaService } from './utenza.service';

@Component({
    selector: 'jhi-utenza-delete-dialog',
    templateUrl: './utenza-delete-dialog.component.html'
})
export class UtenzaDeleteDialogComponent {
    utenza: IUtenza;

    constructor(private utenzaService: UtenzaService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.utenzaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'utenzaListModification',
                content: 'Deleted an utenza'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-utenza-delete-popup',
    template: ''
})
export class UtenzaDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ utenza }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UtenzaDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.utenza = utenza;
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
