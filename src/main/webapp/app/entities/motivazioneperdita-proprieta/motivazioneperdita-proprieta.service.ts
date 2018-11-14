import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IMotivazioneperditaProprieta } from 'app/shared/model/motivazioneperdita-proprieta.model';

type EntityResponseType = HttpResponse<IMotivazioneperditaProprieta>;
type EntityArrayResponseType = HttpResponse<IMotivazioneperditaProprieta[]>;

@Injectable({ providedIn: 'root' })
export class MotivazioneperditaProprietaService {
    private resourceUrl = SERVER_API_URL + 'api/motivazioneperdita-proprietas';

    constructor(private http: HttpClient) {}

    create(motivazioneperditaProprieta: IMotivazioneperditaProprieta): Observable<EntityResponseType> {
        return this.http.post<IMotivazioneperditaProprieta>(this.resourceUrl, motivazioneperditaProprieta, { observe: 'response' });
    }

    update(motivazioneperditaProprieta: IMotivazioneperditaProprieta): Observable<EntityResponseType> {
        return this.http.put<IMotivazioneperditaProprieta>(this.resourceUrl, motivazioneperditaProprieta, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IMotivazioneperditaProprieta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IMotivazioneperditaProprieta[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
