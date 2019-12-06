/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { CancellazionePraDeleteDialogComponent } from 'app/entities/cancellazione-pra/cancellazione-pra-delete-dialog.component';
import { CancellazionePraService } from 'app/entities/cancellazione-pra/cancellazione-pra.service';

describe('Component Tests', () => {
    describe('CancellazionePra Management Delete Component', () => {
        let comp: CancellazionePraDeleteDialogComponent;
        let fixture: ComponentFixture<CancellazionePraDeleteDialogComponent>;
        let service: CancellazionePraService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [CancellazionePraDeleteDialogComponent]
            })
                .overrideTemplate(CancellazionePraDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CancellazionePraDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CancellazionePraService);
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
