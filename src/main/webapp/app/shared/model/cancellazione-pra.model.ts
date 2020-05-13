import { Moment } from 'moment';
import { IVeicoloProprieta } from 'app/shared/model//veicolo-proprieta.model';

export interface ICancellazionePra {
    id?: number;
    dataConsegna?: Moment;
    documentoPraContentType?: string;
    documentoPra?: any;
    veicoloProprieta?: IVeicoloProprieta;
}

export class CancellazionePra implements ICancellazionePra {
    constructor(
        public id?: number,
        public dataConsegna?: Moment,
        public documentoPraContentType?: string,
        public documentoPra?: any,
        public veicoloProprieta?: IVeicoloProprieta
    ) {}
}
