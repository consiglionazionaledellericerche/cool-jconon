import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';
import { ClasseemissioniVeicoloService } from './classeemissioni-veicolo.service';

@Component({
    selector: 'jhi-classeemissioni-veicolo-update',
    templateUrl: './classeemissioni-veicolo-update.component.html'
})
export class ClasseemissioniVeicoloUpdateComponent implements OnInit {
    private _classeemissioniVeicolo: IClasseemissioniVeicolo;
    isSaving: boolean;

    constructor(private classeemissioniVeicoloService: ClasseemissioniVeicoloService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ classeemissioniVeicolo }) => {
            this.classeemissioniVeicolo = classeemissioniVeicolo;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.classeemissioniVeicolo.id !== undefined) {
            this.subscribeToSaveResponse(this.classeemissioniVeicoloService.update(this.classeemissioniVeicolo));
        } else {
            this.subscribeToSaveResponse(this.classeemissioniVeicoloService.create(this.classeemissioniVeicolo));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IClasseemissioniVeicolo>>) {
        result.subscribe(
            (res: HttpResponse<IClasseemissioniVeicolo>) => this.onSaveSuccess(),
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
    get classeemissioniVeicolo() {
        return this._classeemissioniVeicolo;
    }

    set classeemissioniVeicolo(classeemissioniVeicolo: IClasseemissioniVeicolo) {
        this._classeemissioniVeicolo = classeemissioniVeicolo;
    }
}
