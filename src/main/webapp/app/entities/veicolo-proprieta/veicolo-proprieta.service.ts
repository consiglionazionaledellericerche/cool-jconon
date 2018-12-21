import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IVeicoloProprieta } from 'app/shared/model/veicolo-proprieta.model';

type EntityResponseType = HttpResponse<IVeicoloProprieta>;
type EntityArrayResponseType = HttpResponse<IVeicoloProprieta[]>;

@Injectable({ providedIn: 'root' })
export class VeicoloProprietaService {
    private resourceUrl = SERVER_API_URL + 'api/veicolo-proprietas';

    constructor(private http: HttpClient) {}

    create(veicoloProprieta: IVeicoloProprieta): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(veicoloProprieta);
        return this.http
            .post<IVeicoloProprieta>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(veicoloProprieta: IVeicoloProprieta): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(veicoloProprieta);
        return this.http
            .put<IVeicoloProprieta>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IVeicoloProprieta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IVeicoloProprieta[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(veicoloProprieta: IVeicoloProprieta): IVeicoloProprieta {
        const copy: IVeicoloProprieta = Object.assign({}, veicoloProprieta, {
            dataImmatricolazione:
                veicoloProprieta.dataImmatricolazione != null && veicoloProprieta.dataImmatricolazione.isValid()
                    ? veicoloProprieta.dataImmatricolazione.format(DATE_FORMAT)
                    : null,
            dataAcquisto:
                veicoloProprieta.dataAcquisto != null && veicoloProprieta.dataAcquisto.isValid()
                    ? veicoloProprieta.dataAcquisto.format(DATE_FORMAT)
                    : null,
            dataPerditaProprieta:
                veicoloProprieta.dataPerditaProprieta != null && veicoloProprieta.dataPerditaProprieta.isValid()
                    ? veicoloProprieta.dataPerditaProprieta.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataImmatricolazione = res.body.dataImmatricolazione != null ? moment(res.body.dataImmatricolazione) : null;
        res.body.dataAcquisto = res.body.dataAcquisto != null ? moment(res.body.dataAcquisto) : null;
        res.body.dataPerditaProprieta = res.body.dataPerditaProprieta != null ? moment(res.body.dataPerditaProprieta) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((veicoloProprieta: IVeicoloProprieta) => {
            veicoloProprieta.dataImmatricolazione =
                veicoloProprieta.dataImmatricolazione != null ? moment(veicoloProprieta.dataImmatricolazione) : null;
            veicoloProprieta.dataAcquisto = veicoloProprieta.dataAcquisto != null ? moment(veicoloProprieta.dataAcquisto) : null;
            veicoloProprieta.dataPerditaProprieta =
                veicoloProprieta.dataPerditaProprieta != null ? moment(veicoloProprieta.dataPerditaProprieta) : null;
        });
        return res;
    }
}
