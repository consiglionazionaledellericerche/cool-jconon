/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { UtilizzoBeneVeicoloUpdateComponent } from 'app/entities/utilizzo-bene-veicolo/utilizzo-bene-veicolo-update.component';
import { UtilizzoBeneVeicoloService } from 'app/entities/utilizzo-bene-veicolo/utilizzo-bene-veicolo.service';
import { UtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';

describe('Component Tests', () => {
    describe('UtilizzoBeneVeicolo Management Update Component', () => {
        let comp: UtilizzoBeneVeicoloUpdateComponent;
        let fixture: ComponentFixture<UtilizzoBeneVeicoloUpdateComponent>;
        let service: UtilizzoBeneVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtilizzoBeneVeicoloUpdateComponent]
            })
                .overrideTemplate(UtilizzoBeneVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UtilizzoBeneVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UtilizzoBeneVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new UtilizzoBeneVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.utilizzoBeneVeicolo = entity;
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
                    const entity = new UtilizzoBeneVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.utilizzoBeneVeicolo = entity;
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
