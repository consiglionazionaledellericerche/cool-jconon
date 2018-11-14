/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { IstitutoDetailComponent } from 'app/entities/istituto/istituto-detail.component';
import { Istituto } from 'app/shared/model/istituto.model';

describe('Component Tests', () => {
    describe('Istituto Management Detail Component', () => {
        let comp: IstitutoDetailComponent;
        let fixture: ComponentFixture<IstitutoDetailComponent>;
        const route = ({ data: of({ istituto: new Istituto(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [IstitutoDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(IstitutoDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(IstitutoDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.istituto).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
