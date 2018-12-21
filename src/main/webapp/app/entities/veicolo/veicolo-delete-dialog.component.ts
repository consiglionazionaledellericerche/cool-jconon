import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IVeicolo } from 'app/shared/model/veicolo.model';
import { VeicoloService } from './veicolo.service';

@Component({
    selector: 'jhi-veicolo-delete-dialog',
    templateUrl: './veicolo-delete-dialog.component.html'
})
export class VeicoloDeleteDialogComponent {
    veicolo: IVeicolo;

    constructor(private veicoloService: VeicoloService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.veicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'veicoloListModification',
                content: 'Deleted an veicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-veicolo-delete-popup',
    template: ''
})
export class VeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ veicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(VeicoloDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.veicolo = veicolo;
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
