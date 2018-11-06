/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { AutoUpdateComponent } from 'app/entities/auto/auto-update.component';
import { AutoService } from 'app/entities/auto/auto.service';
import { Auto } from 'app/shared/model/auto.model';

describe('Component Tests', () => {
    describe('Auto Management Update Component', () => {
        let comp: AutoUpdateComponent;
        let fixture: ComponentFixture<AutoUpdateComponent>;
        let service: AutoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [AutoUpdateComponent]
            })
                .overrideTemplate(AutoUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AutoUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AutoService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Auto(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.auto = entity;
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
                    const entity = new Auto();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.auto = entity;
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
