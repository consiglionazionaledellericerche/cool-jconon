/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { IstitutoUpdateComponent } from 'app/entities/istituto/istituto-update.component';
import { IstitutoService } from 'app/entities/istituto/istituto.service';
import { Istituto } from 'app/shared/model/istituto.model';

describe('Component Tests', () => {
    describe('Istituto Management Update Component', () => {
        let comp: IstitutoUpdateComponent;
        let fixture: ComponentFixture<IstitutoUpdateComponent>;
        let service: IstitutoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [IstitutoUpdateComponent]
            })
                .overrideTemplate(IstitutoUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(IstitutoUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(IstitutoService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Istituto(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.istituto = entity;
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
                    const entity = new Istituto();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.istituto = entity;
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
