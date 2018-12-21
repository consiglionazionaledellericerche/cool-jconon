import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';
import { ClasseEmissioniVeicoloService } from './classe-emissioni-veicolo.service';

@Component({
    selector: 'jhi-classe-emissioni-veicolo-delete-dialog',
    templateUrl: './classe-emissioni-veicolo-delete-dialog.component.html'
})
export class ClasseEmissioniVeicoloDeleteDialogComponent {
    classeEmissioniVeicolo: IClasseEmissioniVeicolo;

    constructor(
        private classeEmissioniVeicoloService: ClasseEmissioniVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.classeEmissioniVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'classeEmissioniVeicoloListModification',
                content: 'Deleted an classeEmissioniVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-classe-emissioni-veicolo-delete-popup',
    template: ''
})
export class ClasseEmissioniVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ classeEmissioniVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ClasseEmissioniVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.classeEmissioniVeicolo = classeEmissioniVeicolo;
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
