import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IVeicolo } from 'app/shared/model/veicolo.model';

type EntityResponseType = HttpResponse<IVeicolo>;
type EntityArrayResponseType = HttpResponse<IVeicolo[]>;

const PARAMS = new HttpParams({
fromObject: {
action: 'opensearch',
format: 'json',
origin: '*'
}
});

@Injectable({ providedIn: 'root' })
export class VeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/veicolos';

    constructor(private http: HttpClient) {}

    create(veicolo: IVeicolo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(veicolo);
        return this.http
            .post<IVeicolo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(veicolo: IVeicolo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(veicolo);
        return this.http
            .put<IVeicolo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(veicolo: IVeicolo): IVeicolo {
        const copy: IVeicolo = Object.assign({}, veicolo, {
            dataValidazione: veicolo.dataValidazione != null && veicolo.dataValidazione.isValid() ? veicolo.dataValidazione.toJSON() : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataValidazione = res.body.dataValidazione != null ? moment(res.body.dataValidazione) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((veicolo: IVeicolo) => {
            veicolo.dataValidazione = veicolo.dataValidazione != null ? moment(veicolo.dataValidazione) : null;
        });
        return res;
    }

    //  per utenza Ace
    findPersona(term: string) {
        return this.http.get<any>(`${this.resourceUrl}/findUtenza/${term}`);
        //        .pipe(
        //        map(response => response[1].username)
        //        );
    }

   findIstituto(term: string) {
        return this.http.get<any>(`${this.resourceUrl}/findIstituto/${term}`);
        //        .pipe(
        //        map(response => response[1].username)
        //        );
    }

}
