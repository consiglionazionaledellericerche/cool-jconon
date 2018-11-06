/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AutoTestModule } from '../../../test.module';
import { AutoDetailComponent } from 'app/entities/auto/auto-detail.component';
import { Auto } from 'app/shared/model/auto.model';

describe('Component Tests', () => {
    describe('Auto Management Detail Component', () => {
        let comp: AutoDetailComponent;
        let fixture: ComponentFixture<AutoDetailComponent>;
        const route = ({ data: of({ auto: new Auto(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [AutoTestModule],
                declarations: [AutoDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AutoDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AutoDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.auto).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
