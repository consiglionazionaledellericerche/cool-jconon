/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { CancellazionePraDetailComponent } from 'app/entities/cancellazione-pra/cancellazione-pra-detail.component';
import { CancellazionePra } from 'app/shared/model/cancellazione-pra.model';

describe('Component Tests', () => {
    describe('CancellazionePra Management Detail Component', () => {
        let comp: CancellazionePraDetailComponent;
        let fixture: ComponentFixture<CancellazionePraDetailComponent>;
        const route = ({ data: of({ cancellazionePra: new CancellazionePra(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [CancellazionePraDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(CancellazionePraDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(CancellazionePraDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.cancellazionePra).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
