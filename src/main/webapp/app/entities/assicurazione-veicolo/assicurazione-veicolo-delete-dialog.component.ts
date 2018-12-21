import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IAssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';
import { AssicurazioneVeicoloService } from './assicurazione-veicolo.service';

@Component({
    selector: 'jhi-assicurazione-veicolo-delete-dialog',
    templateUrl: './assicurazione-veicolo-delete-dialog.component.html'
})
export class AssicurazioneVeicoloDeleteDialogComponent {
    assicurazioneVeicolo: IAssicurazioneVeicolo;

    constructor(
        private assicurazioneVeicoloService: AssicurazioneVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.assicurazioneVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'assicurazioneVeicoloListModification',
                content: 'Deleted an assicurazioneVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-assicurazione-veicolo-delete-popup',
    template: ''
})
export class AssicurazioneVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ assicurazioneVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(AssicurazioneVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.assicurazioneVeicolo = assicurazioneVeicolo;
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
