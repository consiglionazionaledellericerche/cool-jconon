import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IIstituti } from 'app/shared/model/istituti.model';
import { IstitutiService } from './istituti.service';

@Component({
    selector: 'jhi-istituti-delete-dialog',
    templateUrl: './istituti-delete-dialog.component.html'
})
export class IstitutiDeleteDialogComponent {
    istituti: IIstituti;

    constructor(private istitutiService: IstitutiService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.istitutiService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'istitutiListModification',
                content: 'Deleted an istituti'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-istituti-delete-popup',
    template: ''
})
export class IstitutiDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ istituti }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(IstitutiDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.istituti = istituti;
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
