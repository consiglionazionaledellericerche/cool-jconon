import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ICancellazionePra } from 'app/shared/model/cancellazione-pra.model';

type EntityResponseType = HttpResponse<ICancellazionePra>;
type EntityArrayResponseType = HttpResponse<ICancellazionePra[]>;

@Injectable({ providedIn: 'root' })
export class CancellazionePraService {
    private resourceUrl = SERVER_API_URL + 'api/cancellazione-pras';

    constructor(private http: HttpClient) {}

    create(cancellazionePra: ICancellazionePra): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(cancellazionePra);
        return this.http
            .post<ICancellazionePra>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(cancellazionePra: ICancellazionePra): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(cancellazionePra);
        return this.http
            .put<ICancellazionePra>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ICancellazionePra>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ICancellazionePra[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(cancellazionePra: ICancellazionePra): ICancellazionePra {
        const copy: ICancellazionePra = Object.assign({}, cancellazionePra, {
            dataConsegna:
                cancellazionePra.dataConsegna != null && cancellazionePra.dataConsegna.isValid()
                    ? cancellazionePra.dataConsegna.toJSON()
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataConsegna = res.body.dataConsegna != null ? moment(res.body.dataConsegna) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((cancellazionePra: ICancellazionePra) => {
            cancellazionePra.dataConsegna = cancellazionePra.dataConsegna != null ? moment(cancellazionePra.dataConsegna) : null;
        });
        return res;
    }
}
