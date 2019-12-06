/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { MultaDetailComponent } from 'app/entities/multa/multa-detail.component';
import { Multa } from 'app/shared/model/multa.model';

describe('Component Tests', () => {
    describe('Multa Management Detail Component', () => {
        let comp: MultaDetailComponent;
        let fixture: ComponentFixture<MultaDetailComponent>;
        const route = ({ data: of({ multa: new Multa(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [MultaDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MultaDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MultaDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.multa).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
