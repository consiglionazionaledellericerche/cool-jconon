/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloDetailComponent } from 'app/entities/veicolo/veicolo-detail.component';
import { Veicolo } from 'app/shared/model/veicolo.model';

describe('Component Tests', () => {
    describe('Veicolo Management Detail Component', () => {
        let comp: VeicoloDetailComponent;
        let fixture: ComponentFixture<VeicoloDetailComponent>;
        const route = ({ data: of({ veicolo: new Veicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(VeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(VeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.veicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
