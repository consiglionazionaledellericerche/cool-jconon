import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUser_istituti } from 'app/shared/model/user-istituti.model';
import { User_istitutiService } from './user-istituti.service';

@Component({
    selector: 'jhi-user-istituti-delete-dialog',
    templateUrl: './user-istituti-delete-dialog.component.html'
})
export class User_istitutiDeleteDialogComponent {
    user_istituti: IUser_istituti;

    constructor(
        private user_istitutiService: User_istitutiService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.user_istitutiService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'user_istitutiListModification',
                content: 'Deleted an user_istituti'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-user-istituti-delete-popup',
    template: ''
})
export class User_istitutiDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ user_istituti }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(User_istitutiDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
                this.ngbModalRef.componentInstance.user_istituti = user_istituti;
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
