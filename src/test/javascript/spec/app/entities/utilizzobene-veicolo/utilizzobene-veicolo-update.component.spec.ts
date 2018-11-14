/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { UtilizzobeneVeicoloUpdateComponent } from 'app/entities/utilizzobene-veicolo/utilizzobene-veicolo-update.component';
import { UtilizzobeneVeicoloService } from 'app/entities/utilizzobene-veicolo/utilizzobene-veicolo.service';
import { UtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';

describe('Component Tests', () => {
    describe('UtilizzobeneVeicolo Management Update Component', () => {
        let comp: UtilizzobeneVeicoloUpdateComponent;
        let fixture: ComponentFixture<UtilizzobeneVeicoloUpdateComponent>;
        let service: UtilizzobeneVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtilizzobeneVeicoloUpdateComponent]
            })
                .overrideTemplate(UtilizzobeneVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UtilizzobeneVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UtilizzobeneVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new UtilizzobeneVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.utilizzobeneVeicolo = entity;
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
                    const entity = new UtilizzobeneVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.utilizzobeneVeicolo = entity;
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
