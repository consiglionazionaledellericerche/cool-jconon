import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';
import { ClasseemissioniVeicoloService } from './classeemissioni-veicolo.service';

@Component({
    selector: 'jhi-classeemissioni-veicolo-delete-dialog',
    templateUrl: './classeemissioni-veicolo-delete-dialog.component.html'
})
export class ClasseemissioniVeicoloDeleteDialogComponent {
    classeemissioniVeicolo: IClasseemissioniVeicolo;

    constructor(
        private classeemissioniVeicoloService: ClasseemissioniVeicoloService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.classeemissioniVeicoloService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'classeemissioniVeicoloListModification',
                content: 'Deleted an classeemissioniVeicolo'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-classeemissioni-veicolo-delete-popup',
    template: ''
})
export class ClasseemissioniVeicoloDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ classeemissioniVeicolo }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ClasseemissioniVeicoloDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.classeemissioniVeicolo = classeemissioniVeicolo;
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
