import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model/veicolo.model';

export interface ICancellazionePra {
    id?: number;
    dataConsegna?: Moment;
    documentoPraContentType?: string;
    documentoPra?: any;
    veicolo?: IVeicolo;
}

export class CancellazionePra implements ICancellazionePra {
    constructor(
        public id?: number,
        public dataConsegna?: Moment,
        public documentoPraContentType?: string,
        public documentoPra?: any,
        public veicolo?: IVeicolo
    ) {}
}
