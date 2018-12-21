/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloNoleggioUpdateComponent } from 'app/entities/veicolo-noleggio/veicolo-noleggio-update.component';
import { VeicoloNoleggioService } from 'app/entities/veicolo-noleggio/veicolo-noleggio.service';
import { VeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';

describe('Component Tests', () => {
    describe('VeicoloNoleggio Management Update Component', () => {
        let comp: VeicoloNoleggioUpdateComponent;
        let fixture: ComponentFixture<VeicoloNoleggioUpdateComponent>;
        let service: VeicoloNoleggioService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloNoleggioUpdateComponent]
            })
                .overrideTemplate(VeicoloNoleggioUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(VeicoloNoleggioUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VeicoloNoleggioService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new VeicoloNoleggio(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.veicoloNoleggio = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new VeicoloNoleggio();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.veicoloNoleggio = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
