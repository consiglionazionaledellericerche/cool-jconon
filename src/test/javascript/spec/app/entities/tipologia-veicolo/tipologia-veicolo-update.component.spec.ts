/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { TipologiaVeicoloUpdateComponent } from 'app/entities/tipologia-veicolo/tipologia-veicolo-update.component';
import { TipologiaVeicoloService } from 'app/entities/tipologia-veicolo/tipologia-veicolo.service';
import { TipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';

describe('Component Tests', () => {
    describe('TipologiaVeicolo Management Update Component', () => {
        let comp: TipologiaVeicoloUpdateComponent;
        let fixture: ComponentFixture<TipologiaVeicoloUpdateComponent>;
        let service: TipologiaVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [TipologiaVeicoloUpdateComponent]
            })
                .overrideTemplate(TipologiaVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(TipologiaVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(TipologiaVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new TipologiaVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tipologiaVeicolo = entity;
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
                    const entity = new TipologiaVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.tipologiaVeicolo = entity;
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
