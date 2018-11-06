import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUser_auto } from 'app/shared/model/user-auto.model';

type EntityResponseType = HttpResponse<IUser_auto>;
type EntityArrayResponseType = HttpResponse<IUser_auto[]>;

@Injectable({ providedIn: 'root' })
export class User_autoService {
    private resourceUrl = SERVER_API_URL + 'api/user-autos';

    constructor(private http: HttpClient) {}

    create(user_auto: IUser_auto): Observable<EntityResponseType> {
        return this.http.post<IUser_auto>(this.resourceUrl, user_auto, { observe: 'response' });
    }

    update(user_auto: IUser_auto): Observable<EntityResponseType> {
        return this.http.put<IUser_auto>(this.resourceUrl, user_auto, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IUser_auto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IUser_auto[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
