/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { TipologiaVeicoloDetailComponent } from 'app/entities/tipologia-veicolo/tipologia-veicolo-detail.component';
import { TipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';

describe('Component Tests', () => {
    describe('TipologiaVeicolo Management Detail Component', () => {
        let comp: TipologiaVeicoloDetailComponent;
        let fixture: ComponentFixture<TipologiaVeicoloDetailComponent>;
        const route = ({ data: of({ tipologiaVeicolo: new TipologiaVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [TipologiaVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(TipologiaVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(TipologiaVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.tipologiaVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
