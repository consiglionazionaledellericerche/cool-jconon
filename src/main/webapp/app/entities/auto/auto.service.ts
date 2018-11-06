import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAuto } from 'app/shared/model/auto.model';

type EntityResponseType = HttpResponse<IAuto>;
type EntityArrayResponseType = HttpResponse<IAuto[]>;

@Injectable({ providedIn: 'root' })
export class AutoService {
    private resourceUrl = SERVER_API_URL + 'api/autos';

    constructor(private http: HttpClient) {}

    create(auto: IAuto): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(auto);
        return this.http
            .post<IAuto>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(auto: IAuto): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(auto);
        return this.http
            .put<IAuto>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IAuto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IAuto[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(auto: IAuto): IAuto {
        const copy: IAuto = Object.assign({}, auto, {
            inizio_noleggio:
                auto.inizio_noleggio != null && auto.inizio_noleggio.isValid() ? auto.inizio_noleggio.format(DATE_FORMAT) : null,
            fine_noleggio: auto.fine_noleggio != null && auto.fine_noleggio.isValid() ? auto.fine_noleggio.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.inizio_noleggio = res.body.inizio_noleggio != null ? moment(res.body.inizio_noleggio) : null;
        res.body.fine_noleggio = res.body.fine_noleggio != null ? moment(res.body.fine_noleggio) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((auto: IAuto) => {
            auto.inizio_noleggio = auto.inizio_noleggio != null ? moment(auto.inizio_noleggio) : null;
            auto.fine_noleggio = auto.fine_noleggio != null ? moment(auto.fine_noleggio) : null;
        });
        return res;
    }
}
