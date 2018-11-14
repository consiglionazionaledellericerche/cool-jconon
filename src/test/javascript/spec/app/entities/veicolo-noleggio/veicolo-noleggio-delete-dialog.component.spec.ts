/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloNoleggioDeleteDialogComponent } from 'app/entities/veicolo-noleggio/veicolo-noleggio-delete-dialog.component';
import { VeicoloNoleggioService } from 'app/entities/veicolo-noleggio/veicolo-noleggio.service';

describe('Component Tests', () => {
    describe('VeicoloNoleggio Management Delete Component', () => {
        let comp: VeicoloNoleggioDeleteDialogComponent;
        let fixture: ComponentFixture<VeicoloNoleggioDeleteDialogComponent>;
        let service: VeicoloNoleggioService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloNoleggioDeleteDialogComponent]
            })
                .overrideTemplate(VeicoloNoleggioDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(VeicoloNoleggioDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VeicoloNoleggioService);
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
