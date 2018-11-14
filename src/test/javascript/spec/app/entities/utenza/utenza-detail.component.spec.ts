/* tslint:disable max-line-length */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { UtenzaDetailComponent } from 'app/entities/utenza/utenza-detail.component';
import { Utenza } from 'app/shared/model/utenza.model';

describe('Component Tests', () => {
    describe('Utenza Management Detail Component', () => {
        let comp: UtenzaDetailComponent;
        let fixture: ComponentFixture<UtenzaDetailComponent>;
        const route = ({ data: of({ utenza: new Utenza(123) }) } as any) as ActivatedRoute;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [UtenzaDetailComponent],
                providers: [{ provide: ActivatedRoute, useValue: route }]
            })
                .overrideTemplate(UtenzaDetailComponent, '')
                .compileComponents();
            fixture = TestBed.createComponent(UtenzaDetailComponent);
            comp = fixture.componentInstance;
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(comp.utenza).toEqual(jasmine.objectContaining({ id: 123 }));
            });
        });
    });
});
