/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { UtilizzoBeneVeicoloDetailComponent } from 'app/entities/utilizzo-bene-veicolo/utilizzo-bene-veicolo-detail.component';
import { UtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';

describe('Component Tests', () => {
    describe('UtilizzoBeneVeicolo Management Detail Component', () => {
        let comp: UtilizzoBeneVeicoloDetailComponent;
        let fixture: ComponentFixture<UtilizzoBeneVeicoloDetailComponent>;
        const route = ({ data: of({ utilizzoBeneVeicolo: new UtilizzoBeneVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtilizzoBeneVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UtilizzoBeneVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UtilizzoBeneVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.utilizzoBeneVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
