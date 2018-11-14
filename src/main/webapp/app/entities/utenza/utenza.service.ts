import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUtenza } from 'app/shared/model/utenza.model';

type EntityResponseType = HttpResponse<IUtenza>;
type EntityArrayResponseType = HttpResponse<IUtenza[]>;

@Injectable({ providedIn: 'root' })
export class UtenzaService {
    private resourceUrl = SERVER_API_URL + 'api/utenzas';

    constructor(private http: HttpClient) {}

    create(utenza: IUtenza): Observable<EntityResponseType> {
        return this.http.post<IUtenza>(this.resourceUrl, utenza, { observe: 'response' });
    }

    update(utenza: IUtenza): Observable<EntityResponseType> {
        return this.http.put<IUtenza>(this.resourceUrl, utenza, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUtenza>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUtenza[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
