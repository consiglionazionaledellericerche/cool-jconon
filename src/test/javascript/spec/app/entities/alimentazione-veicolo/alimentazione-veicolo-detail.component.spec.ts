/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { AlimentazioneVeicoloDetailComponent } from 'app/entities/alimentazione-veicolo/alimentazione-veicolo-detail.component';
import { AlimentazioneVeicolo } from 'app/shared/model/alimentazione-veicolo.model';

describe('Component Tests', () => {
    describe('AlimentazioneVeicolo Management Detail Component', () => {
        let comp: AlimentazioneVeicoloDetailComponent;
        let fixture: ComponentFixture<AlimentazioneVeicoloDetailComponent>;
        const route = ({ data: of({ alimentazioneVeicolo: new AlimentazioneVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [AlimentazioneVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AlimentazioneVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AlimentazioneVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.alimentazioneVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
