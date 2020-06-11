/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { ValidazioneUpdateComponent } from 'app/entities/validazione/validazione-update.component';
import { ValidazioneService } from 'app/entities/validazione/validazione.service';
import { Validazione } from 'app/shared/model/validazione.model';

describe('Component Tests', () => {
    describe('Validazione Management Update Component', () => {
        let comp: ValidazioneUpdateComponent;
        let fixture: ComponentFixture<ValidazioneUpdateComponent>;
        let service: ValidazioneService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [ValidazioneUpdateComponent]
            })
                .overrideTemplate(ValidazioneUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(ValidazioneUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ValidazioneService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Validazione(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.validazione = entity;
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
                    const entity = new Validazione();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.validazione = entity;
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
