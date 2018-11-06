/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { IstitutiUpdateComponent } from 'app/entities/istituti/istituti-update.component';
import { IstitutiService } from 'app/entities/istituti/istituti.service';
import { Istituti } from 'app/shared/model/istituti.model';

describe('Component Tests', () => {
    describe('Istituti Management Update Component', () => {
        let comp: IstitutiUpdateComponent;
        let fixture: ComponentFixture<IstitutiUpdateComponent>;
        let service: IstitutiService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [IstitutiUpdateComponent]
            })
                .overrideTemplate(IstitutiUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(IstitutiUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IstitutiService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Istituti(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.istituti = entity;
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
                    const entity = new Istituti();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.istituti = entity;
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
