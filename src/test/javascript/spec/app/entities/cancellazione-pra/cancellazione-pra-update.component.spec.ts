/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { CancellazionePraUpdateComponent } from 'app/entities/cancellazione-pra/cancellazione-pra-update.component';
import { CancellazionePraService } from 'app/entities/cancellazione-pra/cancellazione-pra.service';
import { CancellazionePra } from 'app/shared/model/cancellazione-pra.model';

describe('Component Tests', () => {
    describe('CancellazionePra Management Update Component', () => {
        let comp: CancellazionePraUpdateComponent;
        let fixture: ComponentFixture<CancellazionePraUpdateComponent>;
        let service: CancellazionePraService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [CancellazionePraUpdateComponent]
            })
                .overrideTemplate(CancellazionePraUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CancellazionePraUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CancellazionePraService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new CancellazionePra(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.cancellazionePra = entity;
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
                    const entity = new CancellazionePra();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.cancellazionePra = entity;
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
