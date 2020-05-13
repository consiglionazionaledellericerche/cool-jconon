import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IValidazione } from 'app/shared/model/validazione.model';
import { ValidazioneService } from './validazione.service';

@Component({
    selector: 'jhi-validazione-delete-dialog',
    templateUrl: './validazione-delete-dialog.component.html'
})
export class ValidazioneDeleteDialogComponent {
    validazione: IValidazione;

    constructor(
        private validazioneService: ValidazioneService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.validazioneService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'validazioneListModification',
                content: 'Deleted an validazione'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-validazione-delete-popup',
    template: ''
})
export class ValidazioneDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ validazione }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ValidazioneDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.validazione = validazione;
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
