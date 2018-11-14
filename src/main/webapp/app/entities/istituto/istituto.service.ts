import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IIstituto } from 'app/shared/model/istituto.model';

type EntityResponseType = HttpResponse<IIstituto>;
type EntityArrayResponseType = HttpResponse<IIstituto[]>;

@Injectable({ providedIn: 'root' })
export class IstitutoService {
    private resourceUrl = SERVER_API_URL + 'api/istitutos';

    constructor(private http: HttpClient) {}

    create(istituto: IIstituto): Observable<EntityResponseType> {
        return this.http.post<IIstituto>(this.resourceUrl, istituto, { observe: 'response' });
    }

    update(istituto: IIstituto): Observable<EntityResponseType> {
        return this.http.put<IIstituto>(this.resourceUrl, istituto, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IIstituto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IIstituto[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
