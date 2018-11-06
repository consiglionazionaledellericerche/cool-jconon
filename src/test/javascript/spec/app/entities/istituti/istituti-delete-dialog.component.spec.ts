/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { AutoTestModule } from '../../../test.module';
import { IstitutiDeleteDialogComponent } from 'app/entities/istituti/istituti-delete-dialog.component';
import { IstitutiService } from 'app/entities/istituti/istituti.service';

describe('Component Tests', () => {
    describe('Istituti Management Delete Component', () => {
        let comp: IstitutiDeleteDialogComponent;
        let fixture: ComponentFixture<IstitutiDeleteDialogComponent>;
        let service: IstitutiService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [IstitutiDeleteDialogComponent]
            })
                .overrideTemplate(IstitutiDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IstitutiDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IstitutiService);
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
