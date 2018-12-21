import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface IVeicoloNoleggio {
    id?: number;
    societa?: string;
    dataInizioNoleggio?: Moment;
    dataFineNoleggio?: Moment;
    dataCessazioneAnticipata?: Moment;
    dataProroga?: Moment;
    librettoContentType?: string;
    libretto?: any;
    veicolo?: IVeicolo;
}

export class VeicoloNoleggio implements IVeicoloNoleggio {
    constructor(
        public id?: number,
        public societa?: string,
        public dataInizioNoleggio?: Moment,
        public dataFineNoleggio?: Moment,
        public dataCessazioneAnticipata?: Moment,
        public dataProroga?: Moment,
        public librettoContentType?: string,
        public libretto?: any,
        public veicolo?: IVeicolo
    ) {}
}
