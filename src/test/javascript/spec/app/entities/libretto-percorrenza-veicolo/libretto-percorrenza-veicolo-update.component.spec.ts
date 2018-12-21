/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { LibrettoPercorrenzaVeicoloUpdateComponent } from 'app/entities/libretto-percorrenza-veicolo/libretto-percorrenza-veicolo-update.component';
import { LibrettoPercorrenzaVeicoloService } from 'app/entities/libretto-percorrenza-veicolo/libretto-percorrenza-veicolo.service';
import { LibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';

describe('Component Tests', () => {
    describe('LibrettoPercorrenzaVeicolo Management Update Component', () => {
        let comp: LibrettoPercorrenzaVeicoloUpdateComponent;
        let fixture: ComponentFixture<LibrettoPercorrenzaVeicoloUpdateComponent>;
        let service: LibrettoPercorrenzaVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [LibrettoPercorrenzaVeicoloUpdateComponent]
            })
                .overrideTemplate(LibrettoPercorrenzaVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(LibrettoPercorrenzaVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(LibrettoPercorrenzaVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new LibrettoPercorrenzaVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.librettoPercorrenzaVeicolo = entity;
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
                    const entity = new LibrettoPercorrenzaVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.librettoPercorrenzaVeicolo = entity;
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
