import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUtilizzoBeneVeicolo } from 'app/shared/model/utilizzo-bene-veicolo.model';

type EntityResponseType = HttpResponse<IUtilizzoBeneVeicolo>;
type EntityArrayResponseType = HttpResponse<IUtilizzoBeneVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class UtilizzoBeneVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/utilizzo-bene-veicolos';

    constructor(private http: HttpClient) {}

    create(utilizzoBeneVeicolo: IUtilizzoBeneVeicolo): Observable<EntityResponseType> {
        return this.http.post<IUtilizzoBeneVeicolo>(this.resourceUrl, utilizzoBeneVeicolo, { observe: 'response' });
    }

    update(utilizzoBeneVeicolo: IUtilizzoBeneVeicolo): Observable<EntityResponseType> {
        return this.http.put<IUtilizzoBeneVeicolo>(this.resourceUrl, utilizzoBeneVeicolo, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUtilizzoBeneVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUtilizzoBeneVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
