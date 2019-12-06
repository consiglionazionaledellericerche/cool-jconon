/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { MultaUpdateComponent } from 'app/entities/multa/multa-update.component';
import { MultaService } from 'app/entities/multa/multa.service';
import { Multa } from 'app/shared/model/multa.model';

describe('Component Tests', () => {
    describe('Multa Management Update Component', () => {
        let comp: MultaUpdateComponent;
        let fixture: ComponentFixture<MultaUpdateComponent>;
        let service: MultaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [MultaUpdateComponent]
            })
                .overrideTemplate(MultaUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MultaUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MultaService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Multa(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.multa = entity;
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
                    const entity = new Multa();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.multa = entity;
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
