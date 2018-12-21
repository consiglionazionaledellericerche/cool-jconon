/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { AssicurazioneVeicoloDetailComponent } from 'app/entities/assicurazione-veicolo/assicurazione-veicolo-detail.component';
import { AssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';

describe('Component Tests', () => {
    describe('AssicurazioneVeicolo Management Detail Component', () => {
        let comp: AssicurazioneVeicoloDetailComponent;
        let fixture: ComponentFixture<AssicurazioneVeicoloDetailComponent>;
        const route = ({ data: of({ assicurazioneVeicolo: new AssicurazioneVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [AssicurazioneVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(AssicurazioneVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(AssicurazioneVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.assicurazioneVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
