/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloProprietaDetailComponent } from 'app/entities/veicolo-proprieta/veicolo-proprieta-detail.component';
import { VeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';

describe('Component Tests', () => {
    describe('VeicoloProprieta Management Detail Component', () => {
        let comp: VeicoloProprietaDetailComponent;
        let fixture: ComponentFixture<VeicoloProprietaDetailComponent>;
        const route = ({ data: of({ veicoloProprieta: new VeicoloProprieta(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloProprietaDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(VeicoloProprietaDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(VeicoloProprietaDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.veicoloProprieta).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
