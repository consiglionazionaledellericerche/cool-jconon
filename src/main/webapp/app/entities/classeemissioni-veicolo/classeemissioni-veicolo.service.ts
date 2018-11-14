import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IClasseemissioniVeicolo } from 'app/shared/model/classeemissioni-veicolo.model';

type EntityResponseType = HttpResponse<IClasseemissioniVeicolo>;
type EntityArrayResponseType = HttpResponse<IClasseemissioniVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class ClasseemissioniVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/classeemissioni-veicolos';

    constructor(private http: HttpClient) {}

    create(classeemissioniVeicolo: IClasseemissioniVeicolo): Observable<EntityResponseType> {
        return this.http.post<IClasseemissioniVeicolo>(this.resourceUrl, classeemissioniVeicolo, { observe: 'response' });
    }

    update(classeemissioniVeicolo: IClasseemissioniVeicolo): Observable<EntityResponseType> {
        return this.http.put<IClasseemissioniVeicolo>(this.resourceUrl, classeemissioniVeicolo, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IClasseemissioniVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IClasseemissioniVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
