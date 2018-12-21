/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { MotivazionePerditaProprietaUpdateComponent } from 'app/entities/motivazione-perdita-proprieta/motivazione-perdita-proprieta-update.component';
import { MotivazionePerditaProprietaService } from 'app/entities/motivazione-perdita-proprieta/motivazione-perdita-proprieta.service';
import { MotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';

describe('Component Tests', () => {
    describe('MotivazionePerditaProprieta Management Update Component', () => {
        let comp: MotivazionePerditaProprietaUpdateComponent;
        let fixture: ComponentFixture<MotivazionePerditaProprietaUpdateComponent>;
        let service: MotivazionePerditaProprietaService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [MotivazionePerditaProprietaUpdateComponent]
            })
                .overrideTemplate(MotivazionePerditaProprietaUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(MotivazionePerditaProprietaUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MotivazionePerditaProprietaService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new MotivazionePerditaProprieta(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.motivazionePerditaProprieta = entity;
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
                    const entity = new MotivazionePerditaProprieta();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.motivazionePerditaProprieta = entity;
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
