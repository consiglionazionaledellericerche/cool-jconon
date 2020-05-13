/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { ValidazioneDeleteDialogComponent } from 'app/entities/validazione/validazione-delete-dialog.component';
import { ValidazioneService } from 'app/entities/validazione/validazione.service';

describe('Component Tests', () => {
    describe('Validazione Management Delete Component', () => {
        let comp: ValidazioneDeleteDialogComponent;
        let fixture: ComponentFixture<ValidazioneDeleteDialogComponent>;
        let service: ValidazioneService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ValidazioneDeleteDialogComponent]
            })
                .overrideTemplate(ValidazioneDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ValidazioneDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ValidazioneService);
            mockEventManager = fixture.debugElement.injector.get(JhiEventManager);
            mockActiveModal = fixture.debugElement.injector.get(NgbActiveModal);
        });

        describe('confirmDelete', () => {
            it(
                'Should call delete service on confirmDelete',
                inject(
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
                )
            );
        });
    });
});
