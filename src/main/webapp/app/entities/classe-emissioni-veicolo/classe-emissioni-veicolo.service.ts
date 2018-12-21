import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IClasseEmissioniVeicolo } from 'app/shared/model/classe-emissioni-veicolo.model';

type EntityResponseType = HttpResponse<IClasseEmissioniVeicolo>;
type EntityArrayResponseType = HttpResponse<IClasseEmissioniVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class ClasseEmissioniVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/classe-emissioni-veicolos';

    constructor(private http: HttpClient) {}

    create(classeEmissioniVeicolo: IClasseEmissioniVeicolo): Observable<EntityResponseType> {
        return this.http.post<IClasseEmissioniVeicolo>(this.resourceUrl, classeEmissioniVeicolo, { observe: 'response' });
    }

    update(classeEmissioniVeicolo: IClasseEmissioniVeicolo): Observable<EntityResponseType> {
        return this.http.put<IClasseEmissioniVeicolo>(this.resourceUrl, classeEmissioniVeicolo, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IClasseEmissioniVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IClasseEmissioniVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
