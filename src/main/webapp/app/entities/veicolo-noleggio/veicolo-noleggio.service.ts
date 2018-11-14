import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IVeicoloNoleggio } from 'app/shared/model/veicolo-noleggio.model';

type EntityResponseType = HttpResponse<IVeicoloNoleggio>;
type EntityArrayResponseType = HttpResponse<IVeicoloNoleggio[]>;

@Injectable({ providedIn: 'root' })
export class VeicoloNoleggioService {
    private resourceUrl = SERVER_API_URL + 'api/veicolo-noleggios';

    constructor(private http: HttpClient) {}

    create(veicoloNoleggio: IVeicoloNoleggio): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(veicoloNoleggio);
        return this.http
            .post<IVeicoloNoleggio>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(veicoloNoleggio: IVeicoloNoleggio): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(veicoloNoleggio);
        return this.http
            .put<IVeicoloNoleggio>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<IVeicoloNoleggio>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<IVeicoloNoleggio[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    private convertDateFromClient(veicoloNoleggio: IVeicoloNoleggio): IVeicoloNoleggio {
        const copy: IVeicoloNoleggio = Object.assign({}, veicoloNoleggio, {
            datainizioNoleggio:
                veicoloNoleggio.datainizioNoleggio != null && veicoloNoleggio.datainizioNoleggio.isValid()
                    ? veicoloNoleggio.datainizioNoleggio.format(DATE_FORMAT)
                    : null,
            datafineNoleggio:
                veicoloNoleggio.datafineNoleggio != null && veicoloNoleggio.datafineNoleggio.isValid()
                    ? veicoloNoleggio.datafineNoleggio.format(DATE_FORMAT)
                    : null,
            datacessazioneAnticipata:
                veicoloNoleggio.datacessazioneAnticipata != null && veicoloNoleggio.datacessazioneAnticipata.isValid()
                    ? veicoloNoleggio.datacessazioneAnticipata.format(DATE_FORMAT)
                    : null,
            dataProroga:
                veicoloNoleggio.dataProroga != null && veicoloNoleggio.dataProroga.isValid()
                    ? veicoloNoleggio.dataProroga.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.datainizioNoleggio = res.body.datainizioNoleggio != null ? moment(res.body.datainizioNoleggio) : null;
        res.body.datafineNoleggio = res.body.datafineNoleggio != null ? moment(res.body.datafineNoleggio) : null;
        res.body.datacessazioneAnticipata = res.body.datacessazioneAnticipata != null ? moment(res.body.datacessazioneAnticipata) : null;
        res.body.dataProroga = res.body.dataProroga != null ? moment(res.body.dataProroga) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((veicoloNoleggio: IVeicoloNoleggio) => {
            veicoloNoleggio.datainizioNoleggio =
                veicoloNoleggio.datainizioNoleggio != null ? moment(veicoloNoleggio.datainizioNoleggio) : null;
            veicoloNoleggio.datafineNoleggio = veicoloNoleggio.datafineNoleggio != null ? moment(veicoloNoleggio.datafineNoleggio) : null;
            veicoloNoleggio.datacessazioneAnticipata =
                veicoloNoleggio.datacessazioneAnticipata != null ? moment(veicoloNoleggio.datacessazioneAnticipata) : null;
            veicoloNoleggio.dataProroga = veicoloNoleggio.dataProroga != null ? moment(veicoloNoleggio.dataProroga) : null;
        });
        return res;
    }
}
