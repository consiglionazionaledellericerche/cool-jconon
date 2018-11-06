import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUser_auto } from 'app/shared/model/user-auto.model';
import { User_autoService } from './user-auto.service';

@Component({
    selector: 'jhi-user-auto-delete-dialog',
    templateUrl: './user-auto-delete-dialog.component.html'
})
export class User_autoDeleteDialogComponent {
    user_auto: IUser_auto;

    constructor(private user_autoService: User_autoService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.user_autoService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'user_autoListModification',
                content: 'Deleted an user_auto'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-user-auto-delete-popup',
    template: ''
})
export class User_autoDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ user_auto }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(User_autoDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.user_auto = user_auto;
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
