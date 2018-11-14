/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { MotivazioneperditaProprietaDetailComponent } from 'app/entities/motivazioneperdita-proprieta/motivazioneperdita-proprieta-detail.component';
import { MotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';

describe('Component Tests', () => {
    describe('MotivazioneperditaProprieta Management Detail Component', () => {
        let comp: MotivazioneperditaProprietaDetailComponent;
        let fixture: ComponentFixture<MotivazioneperditaProprietaDetailComponent>;
        const route = ({ data: of({ motivazioneperditaProprieta: new MotivazioneperditaProprieta(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [MotivazioneperditaProprietaDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MotivazioneperditaProprietaDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MotivazioneperditaProprietaDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.motivazioneperditaProprieta).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
