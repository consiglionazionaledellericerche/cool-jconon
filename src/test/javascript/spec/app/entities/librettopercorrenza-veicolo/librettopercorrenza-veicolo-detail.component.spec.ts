/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { LibrettopercorrenzaVeicoloDetailComponent } from 'app/entities/librettopercorrenza-veicolo/librettopercorrenza-veicolo-detail.component';
import { LibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';

describe('Component Tests', () => {
    describe('LibrettopercorrenzaVeicolo Management Detail Component', () => {
        let comp: LibrettopercorrenzaVeicoloDetailComponent;
        let fixture: ComponentFixture<LibrettopercorrenzaVeicoloDetailComponent>;
        const route = ({ data: of({ librettopercorrenzaVeicolo: new LibrettopercorrenzaVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [LibrettopercorrenzaVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(LibrettopercorrenzaVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(LibrettopercorrenzaVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.librettopercorrenzaVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
