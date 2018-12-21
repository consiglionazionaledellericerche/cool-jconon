/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { ClasseEmissioniVeicoloDetailComponent } from 'app/entities/classe-emissioni-veicolo/classe-emissioni-veicolo-detail.component';
import { ClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';

describe('Component Tests', () => {
    describe('ClasseEmissioniVeicolo Management Detail Component', () => {
        let comp: ClasseEmissioniVeicoloDetailComponent;
        let fixture: ComponentFixture<ClasseEmissioniVeicoloDetailComponent>;
        const route = ({ data: of({ classeEmissioniVeicolo: new ClasseEmissioniVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ClasseEmissioniVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ClasseEmissioniVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ClasseEmissioniVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.classeEmissioniVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
