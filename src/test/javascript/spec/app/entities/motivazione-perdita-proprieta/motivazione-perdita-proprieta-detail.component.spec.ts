/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { MotivazionePerditaProprietaDetailComponent } from 'app/entities/motivazione-perdita-proprieta/motivazione-perdita-proprieta-detail.component';
import { MotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';

describe('Component Tests', () => {
    describe('MotivazionePerditaProprieta Management Detail Component', () => {
        let comp: MotivazionePerditaProprietaDetailComponent;
        let fixture: ComponentFixture<MotivazionePerditaProprietaDetailComponent>;
        const route = ({ data: of({ motivazionePerditaProprieta: new MotivazionePerditaProprieta(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [MotivazionePerditaProprietaDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(MotivazionePerditaProprietaDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(MotivazionePerditaProprietaDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.motivazionePerditaProprieta).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
