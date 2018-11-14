/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloNoleggioDetailComponent } from 'app/entities/veicolo-noleggio/veicolo-noleggio-detail.component';
import { VeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';

describe('Component Tests', () => {
    describe('VeicoloNoleggio Management Detail Component', () => {
        let comp: VeicoloNoleggioDetailComponent;
        let fixture: ComponentFixture<VeicoloNoleggioDetailComponent>;
        const route = ({ data: of({ veicoloNoleggio: new VeicoloNoleggio(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloNoleggioDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(VeicoloNoleggioDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(VeicoloNoleggioDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.veicoloNoleggio).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
