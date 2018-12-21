/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { ClasseEmissioniVeicoloUpdateComponent } from 'app/entities/classe-emissioni-veicolo/classe-emissioni-veicolo-update.component';
import { ClasseEmissioniVeicoloService } from 'app/entities/classe-emissioni-veicolo/classe-emissioni-veicolo.service';
import { ClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';

describe('Component Tests', () => {
    describe('ClasseEmissioniVeicolo Management Update Component', () => {
        let comp: ClasseEmissioniVeicoloUpdateComponent;
        let fixture: ComponentFixture<ClasseEmissioniVeicoloUpdateComponent>;
        let service: ClasseEmissioniVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ClasseEmissioniVeicoloUpdateComponent]
            })
                .overrideTemplate(ClasseEmissioniVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ClasseEmissioniVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ClasseEmissioniVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new ClasseEmissioniVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.classeEmissioniVeicolo = entity;
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
                    const entity = new ClasseEmissioniVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.classeEmissioniVeicolo = entity;
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
