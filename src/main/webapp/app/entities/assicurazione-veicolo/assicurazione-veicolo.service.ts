import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IAssicurazioneVeicolo } from 'app/shared/model/assicurazione-veicolo.model';

type EntityResponseType = HttpResponse<IAssicurazioneVeicolo>;
type EntityArrayResponseType = HttpResponse<IAssicurazioneVeicolo[]>;

@Injectable({ providedIn: 'root' })
export class AssicurazioneVeicoloService {
    private resourceUrl = SERVER_API_URL + 'api/assicurazione-veicolos';

    constructor(private http: HttpClient) {}

    create(assicurazioneVeicolo: IAssicurazioneVeicolo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(assicurazioneVeicolo);
        return this.http
            .post<IAssicurazioneVeicolo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(assicurazioneVeicolo: IAssicurazioneVeicolo): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(assicurazioneVeicolo);
        return this.http
            .put<IAssicurazioneVeicolo>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IAssicurazioneVeicolo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IAssicurazioneVeicolo[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(assicurazioneVeicolo: IAssicurazioneVeicolo): IAssicurazioneVeicolo {
        const copy: IAssicurazioneVeicolo = Object.assign({}, assicurazioneVeicolo, {
            dataScadenza:
                assicurazioneVeicolo.dataScadenza != null && assicurazioneVeicolo.dataScadenza.isValid()
                    ? assicurazioneVeicolo.dataScadenza.toJSON()
                    : null,
            dataInserimento:
                assicurazioneVeicolo.dataInserimento != null && assicurazioneVeicolo.dataInserimento.isValid()
                    ? assicurazioneVeicolo.dataInserimento.toJSON()
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataScadenza = res.body.dataScadenza != null ? moment(res.body.dataScadenza) : null;
        res.body.dataInserimento = res.body.dataInserimento != null ? moment(res.body.dataInserimento) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((assicurazioneVeicolo: IAssicurazioneVeicolo) => {
            assicurazioneVeicolo.dataScadenza =
                assicurazioneVeicolo.dataScadenza != null ? moment(assicurazioneVeicolo.dataScadenza) : null;
            assicurazioneVeicolo.dataInserimento =
                assicurazioneVeicolo.dataInserimento != null ? moment(assicurazioneVeicolo.dataInserimento) : null;
        });
        return res;
    }

    findVeicolo() {
                return this.http.get<any>(`${this.resourceUrl}/findVeicolo`);
            }
}
