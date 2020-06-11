/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { ValidazioneDetailComponent } from 'app/entities/validazione/validazione-detail.component';
import { Validazione } from 'app/shared/model/validazione.model';

describe('Component Tests', () => {
    describe('Validazione Management Detail Component', () => {
        let comp: ValidazioneDetailComponent;
        let fixture: ComponentFixture<ValidazioneDetailComponent>;
        const route = ({ data: of({ validazione: new Validazione(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ValidazioneDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ValidazioneDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ValidazioneDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.validazione).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
