/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { LibrettopercorrenzaVeicoloDeleteDialogComponent } from 'app/entities/librettopercorrenza-veicolo/librettopercorrenza-veicolo-delete-dialog.component';
import { LibrettopercorrenzaVeicoloService } from 'app/entities/librettopercorrenza-veicolo/librettopercorrenza-veicolo.service';

describe('Component Tests', () => {
    describe('LibrettopercorrenzaVeicolo Management Delete Component', () => {
        let comp: LibrettopercorrenzaVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<LibrettopercorrenzaVeicoloDeleteDialogComponent>;
        let service: LibrettopercorrenzaVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [LibrettopercorrenzaVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(LibrettopercorrenzaVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LibrettopercorrenzaVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LibrettopercorrenzaVeicoloService);
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
