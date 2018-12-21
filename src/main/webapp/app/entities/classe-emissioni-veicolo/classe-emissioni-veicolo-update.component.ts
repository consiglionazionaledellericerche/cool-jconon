import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';
import { ClasseEmissioniVeicoloService } from './classe-emissioni-veicolo.service';

@Component({
    selector: 'jhi-classe-emissioni-veicolo-update',
    templateUrl: './classe-emissioni-veicolo-update.component.html'
})
export class ClasseEmissioniVeicoloUpdateComponent implements OnInit {
    private _classeEmissioniVeicolo: IClasseEmissioniVeicolo;
    isSaving: boolean;

    constructor(private classeEmissioniVeicoloService: ClasseEmissioniVeicoloService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ classeEmissioniVeicolo }) => {
            this.classeEmissioniVeicolo = classeEmissioniVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.classeEmissioniVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.classeEmissioniVeicoloService.update(this.classeEmissioniVeicolo));
        } else {
            this.subscribeToSaveResponse(this.classeEmissioniVeicoloService.create(this.classeEmissioniVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IClasseEmissioniVeicolo>>) {
        result.subscribe(
            (res: HttpResponse<IClasseEmissioniVeicolo>) => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError()
        );
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get classeEmissioniVeicolo() {
        return this._classeEmissioniVeicolo;
    }

    set classeEmissioniVeicolo(classeEmissioniVeicolo: IClasseEmissioniVeicolo) {
        this._classeEmissioniVeicolo = classeEmissioniVeicolo;
    }
}
