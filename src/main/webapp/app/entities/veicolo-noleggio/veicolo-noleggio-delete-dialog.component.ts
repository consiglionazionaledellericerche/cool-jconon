import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IVeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';
import { VeicoloNoleggioService } from './veicolo-noleggio.service';

@Component({
    selector: 'jhi-veicolo-noleggio-delete-dialog',
    templateUrl: './veicolo-noleggio-delete-dialog.component.html'
})
export class VeicoloNoleggioDeleteDialogComponent {
    veicoloNoleggio: IVeicoloNoleggio;

    constructor(
        private veicoloNoleggioService: VeicoloNoleggioService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.veicoloNoleggioService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'veicoloNoleggioListModification',
                content: 'Deleted an veicoloNoleggio'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-veicolo-noleggio-delete-popup',
    template: ''
})
export class VeicoloNoleggioDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ veicoloNoleggio }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(VeicoloNoleggioDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.veicoloNoleggio = veicoloNoleggio;
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
