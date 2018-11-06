/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AutoTestModule } from '../../../test.module';
import { User_autoDeleteDialogComponent } from 'app/entities/user-auto/user-auto-delete-dialog.component';
import { User_autoService } from 'app/entities/user-auto/user-auto.service';

describe('Component Tests', () => {
    describe('User_auto Management Delete Component', () => {
        let comp: User_autoDeleteDialogComponent;
        let fixture: ComponentFixture<User_autoDeleteDialogComponent>;
        let service: User_autoService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [User_autoDeleteDialogComponent]
            })
                .overrideTemplate(User_autoDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(User_autoDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(User_autoService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it('Should call delete service on confirmDelete', inject(
                [],
                fakeAsync(() => {
                    // GIVEN
                    spyOn(service, 'delete').and.returnValue(of({}));

                    // WHEN
                    comp.confirmDelete(123);
                    tick();

                    // THEN
                    expect(service.delete).toHaveBeenCalledWith(123);
                    expect(mockActiveModal.dismissSpy).toHaveBeenCalled();
                    expect(mockEventManager.broadcastSpy).toHaveBeenCalled();
                })
            ));
        });
    });
});
