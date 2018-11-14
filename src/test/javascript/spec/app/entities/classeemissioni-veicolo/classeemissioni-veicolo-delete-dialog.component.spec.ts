/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { ClasseemissioniVeicoloDeleteDialogComponent } from 'app/entities/classeemissioni-veicolo/classeemissioni-veicolo-delete-dialog.component';
import { ClasseemissioniVeicoloService } from 'app/entities/classeemissioni-veicolo/classeemissioni-veicolo.service';

describe('Component Tests', () => {
    describe('ClasseemissioniVeicolo Management Delete Component', () => {
        let comp: ClasseemissioniVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<ClasseemissioniVeicoloDeleteDialogComponent>;
        let service: ClasseemissioniVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ClasseemissioniVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(ClasseemissioniVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ClasseemissioniVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ClasseemissioniVeicoloService);
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
