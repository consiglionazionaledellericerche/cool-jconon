/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';

import { ParcoautoTestModule } from '../../../test.module';
import { ClasseEmissioniVeicoloDeleteDialogComponent } from 'app/entities/classe-emissioni-veicolo/classe-emissioni-veicolo-delete-dialog.component';
import { ClasseEmissioniVeicoloService } from 'app/entities/classe-emissioni-veicolo/classe-emissioni-veicolo.service';

describe('Component Tests', () => {
    describe('ClasseEmissioniVeicolo Management Delete Component', () => {
        let comp: ClasseEmissioniVeicoloDeleteDialogComponent;
        let fixture: ComponentFixture<ClasseEmissioniVeicoloDeleteDialogComponent>;
        let service: ClasseEmissioniVeicoloService;
        let mockEventManager: any;
        let mockActiveModal: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ClasseEmissioniVeicoloDeleteDialogComponent]
            })
                .overrideTemplate(ClasseEmissioniVeicoloDeleteDialogComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ClasseEmissioniVeicoloDeleteDialogComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ClasseEmissioniVeicoloService);
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
