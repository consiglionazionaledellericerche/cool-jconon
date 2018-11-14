import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUtilizzobeneVeicolo } from 'app/shared/model/utilizzobene-veicolo.model';

type EntityResponseType = HttpResponse<IUtilizzobeneVeicolo>;
type EntityArrayResponseType = HttpResponse<IUtilizzobeneVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class UtilizzobeneVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/utilizzobene-veicolos';

    constructor(private http: HttpClient) {}

    create(utilizzobeneVeicolo: IUtilizzobeneVeicolo): Observable<EntityResponseType> {
        return this.http.post<IUtilizzobeneVeicolo>(this.resourceUrl, utilizzobeneVeicolo, { observe: 'response' });
    }

    update(utilizzobeneVeicolo: IUtilizzobeneVeicolo): Observable<EntityResponseType> {
        return this.http.put<IUtilizzobeneVeicolo>(this.resourceUrl, utilizzobeneVeicolo, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUtilizzobeneVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUtilizzobeneVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
