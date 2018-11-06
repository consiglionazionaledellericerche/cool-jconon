/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { User_autoUpdateComponent } from 'app/entities/user-auto/user-auto-update.component';
import { User_autoService } from 'app/entities/user-auto/user-auto.service';
import { User_auto } from 'app/shared/model/user-auto.model';

describe('Component Tests', () => {
    describe('User_auto Management Update Component', () => {
        let comp: User_autoUpdateComponent;
        let fixture: ComponentFixture<User_autoUpdateComponent>;
        let service: User_autoService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [User_autoUpdateComponent]
            })
                .overrideTemplate(User_autoUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(User_autoUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(User_autoService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new User_auto(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.user_auto = entity;
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
                    const entity = new User_auto();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.user_auto = entity;
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
