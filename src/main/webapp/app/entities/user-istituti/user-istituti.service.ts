import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IUser_istituti } from 'app/shared/model/user-istituti.model';

type EntityResponseType = HttpResponse<IUser_istituti>;
type EntityArrayResponseType = HttpResponse<IUser_istituti[]>;

@Injectable({ providedIn: 'root' })
export class User_istitutiService {
    private resourceUrl = SERVER_API_URL + 'api/user-istitutis';

    constructor(private http: HttpClient) {}

    create(user_istituti: IUser_istituti): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(user_istituti);
        return this.http
            .post<IUser_istituti>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(user_istituti: IUser_istituti): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(user_istituti);
        return this.http
            .put<IUser_istituti>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IUser_istituti>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IUser_istituti[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(user_istituti: IUser_istituti): IUser_istituti {
        const copy: IUser_istituti = Object.assign({}, user_istituti, {
            data: user_istituti.data != null && user_istituti.data.isValid() ? user_istituti.data.format(DATE_FORMAT) : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.data = res.body.data != null ? moment(res.body.data) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((user_istituti: IUser_istituti) => {
            user_istituti.data = user_istituti.data != null ? moment(user_istituti.data) : null;
        });
        return res;
    }
}
