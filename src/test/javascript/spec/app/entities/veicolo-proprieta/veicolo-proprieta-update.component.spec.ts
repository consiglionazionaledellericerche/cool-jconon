/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { VeicoloProprietaUpdateComponent } from 'app/entities/veicolo-proprieta/veicolo-proprieta-update.component';
import { VeicoloProprietaService } from 'app/entities/veicolo-proprieta/veicolo-proprieta.service';
import { VeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';

describe('Component Tests', () => {
    describe('VeicoloProprieta Management Update Component', () => {
        let comp: VeicoloProprietaUpdateComponent;
        let fixture: ComponentFixture<VeicoloProprietaUpdateComponent>;
        let service: VeicoloProprietaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [VeicoloProprietaUpdateComponent]
            })
                .overrideTemplate(VeicoloProprietaUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(VeicoloProprietaUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(VeicoloProprietaService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new VeicoloProprieta(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.veicoloProprieta = entity;
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
                    const entity = new VeicoloProprieta();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.veicoloProprieta = entity;
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
