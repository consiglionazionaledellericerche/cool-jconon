/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { UtilizzobeneVeicoloDetailComponent } from 'app/entities/utilizzobene-veicolo/utilizzobene-veicolo-detail.component';
import { UtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';

describe('Component Tests', () => {
    describe('UtilizzobeneVeicolo Management Detail Component', () => {
        let comp: UtilizzobeneVeicoloDetailComponent;
        let fixture: ComponentFixture<UtilizzobeneVeicoloDetailComponent>;
        const route = ({ data: of({ utilizzobeneVeicolo: new UtilizzobeneVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtilizzobeneVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UtilizzobeneVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UtilizzobeneVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.utilizzobeneVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
