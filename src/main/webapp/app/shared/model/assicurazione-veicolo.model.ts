import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface IAssicurazioneVeicolo {
    id?: number;
    compagniaAssicurazione?: string;
    dataScadenza?: Moment;
    nPolizza?: string;
    dataInserimento?: Moment;
    polizzaContentType?: string;
    polizza?: any;
    targa?: IVeicolo;
}

export class AssicurazioneVeicolo implements IAssicurazioneVeicolo {
    constructor(
        public id?: number,
        public compagniaAssicurazione?: string,
        public dataScadenza?: Moment,
        public nPolizza?: string,
        public dataInserimento?: Moment,
        public polizzaContentType?: string,
        public polizza?: any,
        public targa?: IVeicolo
    ) {}
}
