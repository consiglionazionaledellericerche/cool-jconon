import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMulta } from 'app/shared/model/multa.model';

type EntityResponseType = HttpResponse<IMulta>;
type EntityArrayResponseType = HttpResponse<IMulta[]>;

@Injectable({ providedIn: 'root' })
export class MultaService {
    private resourceUrl = SERVER_API_URL + 'api/multas';

    constructor(private http: HttpClient) {}

    create(multa: IMulta): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(multa);
        return this.http
            .post<IMulta>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(multa: IMulta): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(multa);
        return this.http
            .put<IMulta>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IMulta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IMulta[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(multa: IMulta): IMulta {
        const copy: IMulta = Object.assign({}, multa, {
            dataMulta: multa.dataMulta != null && multa.dataMulta.isValid() ? multa.dataMulta.format(DATE_FORMAT) : null,
            visionatoMulta: multa.visionatoMulta != null && multa.visionatoMulta.isValid() ? multa.visionatoMulta.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataMulta = res.body.dataMulta != null ? moment(res.body.dataMulta) : null;
        res.body.visionatoMulta = res.body.visionatoMulta != null ? moment(res.body.visionatoMulta) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((multa: IMulta) => {
            multa.dataMulta = multa.dataMulta != null ? moment(multa.dataMulta) : null;
            multa.visionatoMulta = multa.visionatoMulta != null ? moment(multa.visionatoMulta) : null;
        });
        return res;
    }
}
