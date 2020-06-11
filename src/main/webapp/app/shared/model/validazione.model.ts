import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface IValidazione {
    id?: number;
    tipologiaStato?: string;
    dataModifica?: Moment;
    dataValidazioneDirettore?: Moment;
    userDirettore?: string;
    ipValidazione?: string;
    documentoFirmatoContentType?: string;
    documentoFirmato?: any;
    note?: string;
    idFlusso?: string;
    descrizione?: string;
    veicolo?: IVeicolo;
}

export class Validazione implements IValidazione {
    constructor(
        public id?: number,
        public tipologiaStato?: string,
        public dataModifica?: Moment,
        public dataValidazioneDirettore?: Moment,
        public userDirettore?: string,
        public ipValidazione?: string,
        public documentoFirmatoContentType?: string,
        public documentoFirmato?: any,
        public note?: string,
        public idFlusso?: string,
        public descrizione?: string,
        public veicolo?: IVeicolo
    ) {}
}
