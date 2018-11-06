/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { User_autoDetailComponent } from 'app/entities/user-auto/user-auto-detail.component';
import { User_auto } from 'app/shared/model/user-auto.model';

describe('Component Tests', () => {
    describe('User_auto Management Detail Component', () => {
        let comp: User_autoDetailComponent;
        let fixture: ComponentFixture<User_autoDetailComponent>;
        const route = ({ data: of({ user_auto: new User_auto(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [User_autoDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(User_autoDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(User_autoDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.user_auto).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
