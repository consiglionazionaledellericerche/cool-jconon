/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { ClasseemissioniVeicoloUpdateComponent } from 'app/entities/classeemissioni-veicolo/classeemissioni-veicolo-update.component';
import { ClasseemissioniVeicoloService } from 'app/entities/classeemissioni-veicolo/classeemissioni-veicolo.service';
import { ClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';

describe('Component Tests', () => {
    describe('ClasseemissioniVeicolo Management Update Component', () => {
        let comp: ClasseemissioniVeicoloUpdateComponent;
        let fixture: ComponentFixture<ClasseemissioniVeicoloUpdateComponent>;
        let service: ClasseemissioniVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ClasseemissioniVeicoloUpdateComponent]
            })
                .overrideTemplate(ClasseemissioniVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ClasseemissioniVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ClasseemissioniVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ClasseemissioniVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.classeemissioniVeicolo = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ClasseemissioniVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.classeemissioniVeicolo = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
