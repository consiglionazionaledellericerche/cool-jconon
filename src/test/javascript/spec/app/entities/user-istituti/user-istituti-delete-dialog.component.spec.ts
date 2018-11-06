/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AutoTestModule } from '../../../test.module';
import { User_istitutiDeleteDialogComponent } from 'app/entities/user-istituti/user-istituti-delete-dialog.component';
import { User_istitutiService } from 'app/entities/user-istituti/user-istituti.service';

describe('Component Tests', () => {
    describe('User_istituti Management Delete Component', () => {
        let comp: User_istitutiDeleteDialogComponent;
        let fixture: ComponentFixture<User_istitutiDeleteDialogComponent>;
        let service: User_istitutiService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [User_istitutiDeleteDialogComponent]
            })
                .overrideTemplate(User_istitutiDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(User_istitutiDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(User_istitutiService);
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
