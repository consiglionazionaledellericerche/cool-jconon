import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IIstituti } from 'app/shared/model/istituti.model';

type EntityResponseType = HttpResponse<IIstituti>;
type EntityArrayResponseType = HttpResponse<IIstituti[]>;

@Injectable({ providedIn: 'root' })
export class IstitutiService {
    private resourceUrl = SERVER_API_URL + 'api/istitutis';

    constructor(private http: HttpClient) {}

    create(istituti: IIstituti): Observable<EntityResponseType> {
        return this.http.post<IIstituti>(this.resourceUrl, istituti, { observe: 'response' });
    }

    update(istituti: IIstituti): Observable<EntityResponseType> {
        return this.http.put<IIstituti>(this.resourceUrl, istituti, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IIstituti>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IIstituti[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
