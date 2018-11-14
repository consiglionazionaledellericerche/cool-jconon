import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILibrettopercorrenzaVeicolo } from 'app/shared/model/librettopercorrenza-veicolo.model';

type EntityResponseType = HttpResponse<ILibrettopercorrenzaVeicolo>;
type EntityArrayResponseType = HttpResponse<ILibrettopercorrenzaVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class LibrettopercorrenzaVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/librettopercorrenza-veicolos';

    constructor(private http: HttpClient) {}

    create(librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(librettopercorrenzaVeicolo);
        return this.http
            .post<ILibrettopercorrenzaVeicolo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(librettopercorrenzaVeicolo);
        return this.http
            .put<ILibrettopercorrenzaVeicolo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ILibrettopercorrenzaVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ILibrettopercorrenzaVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo): ILibrettopercorrenzaVeicolo {
        const copy: ILibrettopercorrenzaVeicolo = Object.assign({}, librettopercorrenzaVeicolo, {
            data:
                librettopercorrenzaVeicolo.data != null && librettopercorrenzaVeicolo.data.isValid()
                    ? librettopercorrenzaVeicolo.data.toJSON()
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.data = res.body.data != null ? moment(res.body.data) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((librettopercorrenzaVeicolo: ILibrettopercorrenzaVeicolo) => {
            librettopercorrenzaVeicolo.data = librettopercorrenzaVeicolo.data != null ? moment(librettopercorrenzaVeicolo.data) : null;
        });
        return res;
    }
}
