import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ITipologiaVeicolo } from 'app/shared/model/tipologia-veicolo.model';

type EntityResponseType = HttpResponse<ITipologiaVeicolo>;
type EntityArrayResponseType = HttpResponse<ITipologiaVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class TipologiaVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/tipologia-veicolos';

    constructor(private http: HttpClient) {}

    create(tipologiaVeicolo: ITipologiaVeicolo): Observable<EntityResponseType> {
        return this.http.post<ITipologiaVeicolo>(this.resourceUrl, tipologiaVeicolo, { observe: 'response' });
    }

    update(tipologiaVeicolo: ITipologiaVeicolo): Observable<EntityResponseType> {
        return this.http.put<ITipologiaVeicolo>(this.resourceUrl, tipologiaVeicolo, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<ITipologiaVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<ITipologiaVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
