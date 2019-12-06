/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { BolloDetailComponent } from 'app/entities/bollo/bollo-detail.component';
import { Bollo } from 'app/shared/model/bollo.model';

describe('Component Tests', () => {
    describe('Bollo Management Detail Component', () => {
        let comp: BolloDetailComponent;
        let fixture: ComponentFixture<BolloDetailComponent>;
        const route = ({ data: of({ bollo: new Bollo(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [BolloDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(BolloDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(BolloDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.bollo).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
