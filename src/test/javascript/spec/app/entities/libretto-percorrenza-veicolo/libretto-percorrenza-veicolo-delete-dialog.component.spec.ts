/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { LibrettoPercorrenzaVeicoloDeleteDialogComponent } from 'app/entities/libretto-percorrenza-veicolo/libretto-percorrenza-veicolo-delete-dialog.component';
import { LibrettoPercorrenzaVeicoloService } from 'app/entities/libretto-percorrenza-veicolo/libretto-percorrenza-veicolo.service';

describe('Component Tests', () => {
    describe('LibrettoPercorrenzaVeicolo Management Delete Component', () => {
        let comp: LibrettoPercorrenzaVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<LibrettoPercorrenzaVeicoloDeleteDialogComponent>;
        let service: LibrettoPercorrenzaVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [LibrettoPercorrenzaVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(LibrettoPercorrenzaVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LibrettoPercorrenzaVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LibrettoPercorrenzaVeicoloService);
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
