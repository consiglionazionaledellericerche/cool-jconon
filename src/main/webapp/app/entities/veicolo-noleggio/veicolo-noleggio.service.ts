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
            dataInizioNoleggio:
                veicoloNoleggio.dataInizioNoleggio != null && veicoloNoleggio.dataInizioNoleggio.isValid()
                    ? veicoloNoleggio.dataInizioNoleggio.format(DATE_FORMAT)
                    : null,
            dataFineNoleggio:
                veicoloNoleggio.dataFineNoleggio != null && veicoloNoleggio.dataFineNoleggio.isValid()
                    ? veicoloNoleggio.dataFineNoleggio.format(DATE_FORMAT)
                    : null,
            dataCessazioneAnticipata:
                veicoloNoleggio.dataCessazioneAnticipata != null && veicoloNoleggio.dataCessazioneAnticipata.isValid()
                    ? veicoloNoleggio.dataCessazioneAnticipata.format(DATE_FORMAT)
                    : null,
            dataProroga:
                veicoloNoleggio.dataProroga != null && veicoloNoleggio.dataProroga.isValid()
                    ? veicoloNoleggio.dataProroga.format(DATE_FORMAT)
                    : null
        });
        return copy;
    }

    private convertDateFromServer(res: EntityResponseType): EntityResponseType {
        res.body.dataInizioNoleggio = res.body.dataInizioNoleggio != null ? moment(res.body.dataInizioNoleggio) : null;
        res.body.dataFineNoleggio = res.body.dataFineNoleggio != null ? moment(res.body.dataFineNoleggio) : null;
        res.body.dataCessazioneAnticipata = res.body.dataCessazioneAnticipata != null ? moment(res.body.dataCessazioneAnticipata) : null;
        res.body.dataProroga = res.body.dataProroga != null ? moment(res.body.dataProroga) : null;
        return res;
    }

    private convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        res.body.forEach((veicoloNoleggio: IVeicoloNoleggio) => {
            veicoloNoleggio.dataInizioNoleggio =
                veicoloNoleggio.dataInizioNoleggio != null ? moment(veicoloNoleggio.dataInizioNoleggio) : null;
            veicoloNoleggio.dataFineNoleggio = veicoloNoleggio.dataFineNoleggio != null ? moment(veicoloNoleggio.dataFineNoleggio) : null;
            veicoloNoleggio.dataCessazioneAnticipata =
                veicoloNoleggio.dataCessazioneAnticipata != null ? moment(veicoloNoleggio.dataCessazioneAnticipata) : null;
            veicoloNoleggio.dataProroga = veicoloNoleggio.dataProroga != null ? moment(veicoloNoleggio.dataProroga) : null;
        });
        return res;
    }

    findVeicolo() {
                return this.http.get<any>(`${this.resourceUrl}/findVeicolo`);
            }
}
