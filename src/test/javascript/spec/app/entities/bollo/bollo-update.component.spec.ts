/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { BolloUpdateComponent } from 'app/entities/bollo/bollo-update.component';
import { BolloService } from 'app/entities/bollo/bollo.service';
import { Bollo } from 'app/shared/model/bollo.model';

describe('Component Tests', () => {
    describe('Bollo Management Update Component', () => {
        let comp: BolloUpdateComponent;
        let fixture: ComponentFixture<BolloUpdateComponent>;
        let service: BolloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [BolloUpdateComponent]
            })
                .overrideTemplate(BolloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(BolloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(BolloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Bollo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.bollo = entity;
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
                    const entity = new Bollo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.bollo = entity;
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
