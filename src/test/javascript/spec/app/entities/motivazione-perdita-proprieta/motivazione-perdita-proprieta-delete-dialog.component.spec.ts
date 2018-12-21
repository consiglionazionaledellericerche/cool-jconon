/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { MotivazionePerditaProprietaDeleteDialogComponent } from 'app/entities/motivazione-perdita-proprieta/motivazione-perdita-proprieta-delete-dialog.component';
import { MotivazionePerditaProprietaService } from 'app/entities/motivazione-perdita-proprieta/motivazione-perdita-proprieta.service';

describe('Component Tests', () => {
    describe('MotivazionePerditaProprieta Management Delete Component', () => {
        let comp: MotivazionePerditaProprietaDeleteDialogComponent;
        let fixture: ComponentFixture<MotivazionePerditaProprietaDeleteDialogComponent>;
        let service: MotivazionePerditaProprietaService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [MotivazionePerditaProprietaDeleteDialogComponent]
            })
                .overrideTemplate(MotivazionePerditaProprietaDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MotivazionePerditaProprietaDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MotivazionePerditaProprietaService);
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
