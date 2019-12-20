import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IBollo } from 'app/shared/model/bollo.model';

type EntityResponseType = HttpResponse<IBollo>;
type EntityArrayResponseType = HttpResponse<IBollo[]>;

@Injectable({ providedIn: 'root' })
export class BolloService {
    private resourceUrl = SERVER_API_URL + 'api/bollos';

    constructor(private http: HttpClient) {}

    create(bollo: IBollo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(bollo);
        return this.http
            .post<IBollo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(bollo: IBollo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(bollo);
        return this.http
            .put<IBollo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IBollo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IBollo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(bollo: IBollo): IBollo {
        const copy: IBollo = Object.assign({}, bollo, {
            dataScadenza: bollo.dataScadenza != null && bollo.dataScadenza.isValid() ? bollo.dataScadenza.toJSON() : null,
            visionatoBollo: bollo.visionatoBollo != null && bollo.visionatoBollo.isValid() ? bollo.visionatoBollo.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataScadenza = res.body.dataScadenza != null ? moment(res.body.dataScadenza) : null;
        res.body.visionatoBollo = res.body.visionatoBollo != null ? moment(res.body.visionatoBollo) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((bollo: IBollo) => {
            bollo.dataScadenza = bollo.dataScadenza != null ? moment(bollo.dataScadenza) : null;
            bollo.visionatoBollo = bollo.visionatoBollo != null ? moment(bollo.visionatoBollo) : null;
        });
        return res;
    }
}
