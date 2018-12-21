/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { AssicurazioneVeicoloDeleteDialogComponent } from 'app/entities/assicurazione-veicolo/assicurazione-veicolo-delete-dialog.component';
import { AssicurazioneVeicoloService } from 'app/entities/assicurazione-veicolo/assicurazione-veicolo.service';

describe('Component Tests', () => {
    describe('AssicurazioneVeicolo Management Delete Component', () => {
        let comp: AssicurazioneVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<AssicurazioneVeicoloDeleteDialogComponent>;
        let service: AssicurazioneVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [AssicurazioneVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(AssicurazioneVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AssicurazioneVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssicurazioneVeicoloService);
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
