/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { ParcoautoTestModule } from '../../../test.module';
import { AssicurazioneVeicoloUpdateComponent } from 'app/entities/assicurazione-veicolo/assicurazione-veicolo-update.component';
import { AssicurazioneVeicoloService } from 'app/entities/assicurazione-veicolo/assicurazione-veicolo.service';
import { AssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';

describe('Component Tests', () => {
    describe('AssicurazioneVeicolo Management Update Component', () => {
        let comp: AssicurazioneVeicoloUpdateComponent;
        let fixture: ComponentFixture<AssicurazioneVeicoloUpdateComponent>;
        let service: AssicurazioneVeicoloService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [ParcoautoTestModule],
                declarations: [AssicurazioneVeicoloUpdateComponent]
            })
                .overrideTemplate(AssicurazioneVeicoloUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(AssicurazioneVeicoloUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(AssicurazioneVeicoloService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new AssicurazioneVeicolo(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.assicurazioneVeicolo = entity;
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
                    const entity = new AssicurazioneVeicolo();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.assicurazioneVeicolo = entity;
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
