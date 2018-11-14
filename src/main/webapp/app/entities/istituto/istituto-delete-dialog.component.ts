import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIstituto } from 'app/shared/model/istituto.model';
import { IstitutoService } from './istituto.service';

@Component({
    selector: 'jhi-istituto-delete-dialog',
    templateUrl: './istituto-delete-dialog.component.html'
})
export class IstitutoDeleteDialogComponent {
    istituto: IIstituto;

    constructor(private istitutoService: IstitutoService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.istitutoService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'istitutoListModification',
                content: 'Deleted an istituto'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-istituto-delete-popup',
    template: ''
})
export class IstitutoDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ istituto }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(IstitutoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.istituto = istituto;
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
