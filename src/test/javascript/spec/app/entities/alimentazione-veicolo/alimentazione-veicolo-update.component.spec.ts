/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { AlimentazioneVeicoloUpdateComponent } from 'app/entities/alimentazione-veicolo/alimentazione-veicolo-update.component';
import { AlimentazioneVeicoloService } from 'app/entities/alimentazione-veicolo/alimentazione-veicolo.service';
import { AlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';

describe('Component Tests', () => {
    describe('AlimentazioneVeicolo Management Update Component', () => {
        let comp: AlimentazioneVeicoloUpdateComponent;
        let fixture: ComponentFixture<AlimentazioneVeicoloUpdateComponent>;
        let service: AlimentazioneVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [AlimentazioneVeicoloUpdateComponent]
            })
                .overrideTemplate(AlimentazioneVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AlimentazioneVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AlimentazioneVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new AlimentazioneVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.alimentazioneVeicolo = entity;
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
                    const entity = new AlimentazioneVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.alimentazioneVeicolo = entity;
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
