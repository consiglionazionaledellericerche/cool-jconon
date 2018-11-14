import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IMotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';
import { MotivazioneperditaProprietaService } from './motivazioneperdita-proprieta.service';

@Component({
    selector: 'jhi-motivazioneperdita-proprieta-delete-dialog',
    templateUrl: './motivazioneperdita-proprieta-delete-dialog.component.html'
})
export class MotivazioneperditaProprietaDeleteDialogComponent {
    motivazioneperditaProprieta: IMotivazioneperditaProprieta;

    constructor(
        private motivazioneperditaProprietaService: MotivazioneperditaProprietaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.motivazioneperditaProprietaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'motivazioneperditaProprietaListModification',
                content: 'Deleted an motivazioneperditaProprieta'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-motivazioneperdita-proprieta-delete-popup',
    template: ''
})
export class MotivazioneperditaProprietaDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ motivazioneperditaProprieta }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(MotivazioneperditaProprietaDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.motivazioneperditaProprieta = motivazioneperditaProprieta;
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
