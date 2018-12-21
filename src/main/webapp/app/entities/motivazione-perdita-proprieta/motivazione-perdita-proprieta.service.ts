import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMotivazionePerditaProprieta } from 'app/shared/model/motivazione-perdita-proprieta.model';

type EntityResponseType = HttpResponse<IMotivazionePerditaProprieta>;
type EntityArrayResponseType = HttpResponse<IMotivazionePerditaProprieta[]>;

@Injectable({ providedIn: 'root' })
export class MotivazionePerditaProprietaService {
    private resourceUrl = SERVER_API_URL + 'api/motivazione-perdita-proprietas';

    constructor(private http: HttpClient) {}

    create(motivazionePerditaProprieta: IMotivazionePerditaProprieta): Observable<EntityResponseType> {
        return this.http.post<IMotivazionePerditaProprieta>(this.resourceUrl, motivazionePerditaProprieta, { observe: 'response' });
    }

    update(motivazionePerditaProprieta: IMotivazionePerditaProprieta): Observable<EntityResponseType> {
        return this.http.put<IMotivazionePerditaProprieta>(this.resourceUrl, motivazionePerditaProprieta, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMotivazionePerditaProprieta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMotivazionePerditaProprieta[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
