/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { AlimentazioneVeicoloDeleteDialogComponent } from 'app/entities/alimentazione-veicolo/alimentazione-veicolo-delete-dialog.component';
import { AlimentazioneVeicoloService } from 'app/entities/alimentazione-veicolo/alimentazione-veicolo.service';

describe('Component Tests', () => {
    describe('AlimentazioneVeicolo Management Delete Component', () => {
        let comp: AlimentazioneVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<AlimentazioneVeicoloDeleteDialogComponent>;
        let service: AlimentazioneVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [AlimentazioneVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(AlimentazioneVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AlimentazioneVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AlimentazioneVeicoloService);
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
