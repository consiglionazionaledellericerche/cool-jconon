/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { User_istitutiDetailComponent } from 'app/entities/user-istituti/user-istituti-detail.component';
import { User_istituti } from 'app/shared/model/user-istituti.model';

describe('Component Tests', () => {
    describe('User_istituti Management Detail Component', () => {
        let comp: User_istitutiDetailComponent;
        let fixture: ComponentFixture<User_istitutiDetailComponent>;
        const route = ({ data: of({ user_istituti: new User_istituti(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [User_istitutiDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(User_istitutiDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(User_istitutiDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.user_istituti).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
