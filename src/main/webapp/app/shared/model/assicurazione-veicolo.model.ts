import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface IAssicurazioneVeicolo {
    id?: number;
    compagniaAssicurazione?: string;
    dataScadenza?: Moment;
    numeroPolizza?: string;
    polizzaContentType?: string;
    polizza?: any;
    dataInserimento?: Moment;
    veicolo?: IVeicolo;
}

export class AssicurazioneVeicolo implements IAssicurazioneVeicolo {
    constructor(
        public id?: number,
        public compagniaAssicurazione?: string,
        public dataScadenza?: Moment,
        public numeroPolizza?: string,
        public polizzaContentType?: string,
        public polizza?: any,
        public dataInserimento?: Moment,
        public veicolo?: IVeicolo
    ) {}
}
