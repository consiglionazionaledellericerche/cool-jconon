/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { User_istitutiUpdateComponent } from 'app/entities/user-istituti/user-istituti-update.component';
import { User_istitutiService } from 'app/entities/user-istituti/user-istituti.service';
import { User_istituti } from 'app/shared/model/user-istituti.model';

describe('Component Tests', () => {
    describe('User_istituti Management Update Component', () => {
        let comp: User_istitutiUpdateComponent;
        let fixture: ComponentFixture<User_istitutiUpdateComponent>;
        let service: User_istitutiService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [User_istitutiUpdateComponent]
            })
                .overrideTemplate(User_istitutiUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(User_istitutiUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(User_istitutiService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new User_istituti(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.user_istituti = entity;
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
                    const entity = new User_istituti();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.user_istituti = entity;
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
