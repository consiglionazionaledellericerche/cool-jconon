/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { UtenzaUpdateComponent } from 'app/entities/utenza/utenza-update.component';
import { UtenzaService } from 'app/entities/utenza/utenza.service';
import { Utenza } from 'app/shared/model/utenza.model';

describe('Component Tests', () => {
    describe('Utenza Management Update Component', () => {
        let comp: UtenzaUpdateComponent;
        let fixture: ComponentFixture<UtenzaUpdateComponent>;
        let service: UtenzaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtenzaUpdateComponent]
            })
                .overrideTemplate(UtenzaUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(UtenzaUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(UtenzaService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Utenza(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.utenza = entity;
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
                    const entity = new Utenza();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.utenza = entity;
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
