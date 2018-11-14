import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface IVeicoloNoleggio {
    id?: number;
    societa?: string;
    datainizioNoleggio?: Moment;
    datafineNoleggio?: Moment;
    datacessazioneAnticipata?: Moment;
    dataProroga?: Moment;
    librettoContentType?: string;
    libretto?: any;
    targa?: IVeicolo;
}

export class VeicoloNoleggio implements IVeicoloNoleggio {
    constructor(
        public id?: number,
        public societa?: string,
        public datainizioNoleggio?: Moment,
        public datafineNoleggio?: Moment,
        public datacessazioneAnticipata?: Moment,
        public dataProroga?: Moment,
        public librettoContentType?: string,
        public libretto?: any,
        public targa?: IVeicolo
    ) {}
}
