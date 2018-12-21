/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { LibrettoPercorrenzaVeicoloDetailComponent } from 'app/entities/libretto-percorrenza-veicolo/libretto-percorrenza-veicolo-detail.component';
import { LibrettoPercorrenzaVeicolo } from 'app/shared/model/libretto-percorrenza-veicolo.model';

describe('Component Tests', () => {
    describe('LibrettoPercorrenzaVeicolo Management Detail Component', () => {
        let comp: LibrettoPercorrenzaVeicoloDetailComponent;
        let fixture: ComponentFixture<LibrettoPercorrenzaVeicoloDetailComponent>;
        const route = ({ data: of({ librettoPercorrenzaVeicolo: new LibrettoPercorrenzaVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [LibrettoPercorrenzaVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(LibrettoPercorrenzaVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LibrettoPercorrenzaVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.librettoPercorrenzaVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
