/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { UtilizzoBeneVeicoloDeleteDialogComponent } from 'app/entities/utilizzo-bene-veicolo/utilizzo-bene-veicolo-delete-dialog.component';
import { UtilizzoBeneVeicoloService } from 'app/entities/utilizzo-bene-veicolo/utilizzo-bene-veicolo.service';

describe('Component Tests', () => {
    describe('UtilizzoBeneVeicolo Management Delete Component', () => {
        let comp: UtilizzoBeneVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<UtilizzoBeneVeicoloDeleteDialogComponent>;
        let service: UtilizzoBeneVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtilizzoBeneVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(UtilizzoBeneVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UtilizzoBeneVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UtilizzoBeneVeicoloService);
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
