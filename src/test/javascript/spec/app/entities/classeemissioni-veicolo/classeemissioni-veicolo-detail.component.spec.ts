/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { ClasseemissioniVeicoloDetailComponent } from 'app/entities/classeemissioni-veicolo/classeemissioni-veicolo-detail.component';
import { ClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';

describe('Component Tests', () => {
    describe('ClasseemissioniVeicolo Management Detail Component', () => {
        let comp: ClasseemissioniVeicoloDetailComponent;
        let fixture: ComponentFixture<ClasseemissioniVeicoloDetailComponent>;
        const route = ({ data: of({ classeemissioniVeicolo: new ClasseemissioniVeicolo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ClasseemissioniVeicoloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(ClasseemissioniVeicoloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(ClasseemissioniVeicoloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.classeemissioniVeicolo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
