/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { IstitutiDetailComponent } from 'app/entities/istituti/istituti-detail.component';
import { Istituti } from 'app/shared/model/istituti.model';

describe('Component Tests', () => {
    describe('Istituti Management Detail Component', () => {
        let comp: IstitutiDetailComponent;
        let fixture: ComponentFixture<IstitutiDetailComponent>;
        const route = ({ data: of({ istituti: new Istituti(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [IstitutiDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(IstitutiDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IstitutiDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.istituti).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
