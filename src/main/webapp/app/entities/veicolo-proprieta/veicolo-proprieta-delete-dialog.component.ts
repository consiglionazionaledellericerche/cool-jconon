import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';
import { VeicoloProprietaService } from './veicolo-proprieta.service';

@Component({
    selector: 'jhi-veicolo-proprieta-delete-dialog',
    templateUrl: './veicolo-proprieta-delete-dialog.component.html'
})
export class VeicoloProprietaDeleteDialogComponent {
    veicoloProprieta: IVeicoloProprieta;

    constructor(
        private veicoloProprietaService: VeicoloProprietaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.veicoloProprietaService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'veicoloProprietaListModification',
                content: 'Deleted an veicoloProprieta'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-veicolo-proprieta-delete-popup',
    template: ''
})
export class VeicoloProprietaDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ veicoloProprieta }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(VeicoloProprietaDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.veicoloProprieta = veicoloProprieta;
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
