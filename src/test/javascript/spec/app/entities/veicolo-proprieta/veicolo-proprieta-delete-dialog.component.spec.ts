/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloProprietaDeleteDialogComponent } from 'app/entities/veicolo-proprieta/veicolo-proprieta-delete-dialog.component';
import { VeicoloProprietaService } from 'app/entities/veicolo-proprieta/veicolo-proprieta.service';

describe('Component Tests', () => {
    describe('VeicoloProprieta Management Delete Component', () => {
        let comp: VeicoloProprietaDeleteDialogComponent;
        let fixture: ComponentFixture<VeicoloProprietaDeleteDialogComponent>;
        let service: VeicoloProprietaService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloProprietaDeleteDialogComponent]
            })
                .overrideTemplate(VeicoloProprietaDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(VeicoloProprietaDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VeicoloProprietaService);
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
