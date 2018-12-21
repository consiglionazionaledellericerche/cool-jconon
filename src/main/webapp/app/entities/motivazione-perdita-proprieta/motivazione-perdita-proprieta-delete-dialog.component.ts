import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';
import { MotivazionePerditaProprietaService } from './motivazione-perdita-proprieta.service';

@Component({
    selector: 'jhi-motivazione-perdita-proprieta-delete-dialog',
    templateUrl: './motivazione-perdita-proprieta-delete-dialog.component.html'
})
export class MotivazionePerditaProprietaDeleteDialogComponent {
    motivazionePerditaProprieta: IMotivazionePerditaProprieta;

    constructor(
        private motivazionePerditaProprietaService: MotivazionePerditaProprietaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.motivazionePerditaProprietaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'motivazionePerditaProprietaListModification',
                content: 'Deleted an motivazionePerditaProprieta'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-motivazione-perdita-proprieta-delete-popup',
    template: ''
})
export class MotivazionePerditaProprietaDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ motivazionePerditaProprieta }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MotivazionePerditaProprietaDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.motivazionePerditaProprieta = motivazionePerditaProprieta;
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
