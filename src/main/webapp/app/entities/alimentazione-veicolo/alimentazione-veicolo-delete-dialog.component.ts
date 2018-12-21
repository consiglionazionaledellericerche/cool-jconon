import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';
import { AlimentazioneVeicoloService } from './alimentazione-veicolo.service';

@Component({
    selector: 'jhi-alimentazione-veicolo-delete-dialog',
    templateUrl: './alimentazione-veicolo-delete-dialog.component.html'
})
export class AlimentazioneVeicoloDeleteDialogComponent {
    alimentazioneVeicolo: IAlimentazioneVeicolo;

    constructor(
        private alimentazioneVeicoloService: AlimentazioneVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.alimentazioneVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'alimentazioneVeicoloListModification',
                content: 'Deleted an alimentazioneVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-alimentazione-veicolo-delete-popup',
    template: ''
})
export class AlimentazioneVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ alimentazioneVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AlimentazioneVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.alimentazioneVeicolo = alimentazioneVeicolo;
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
