import { Moment } from 'moment';
import { IMotivazionePerditaProprieta } from 'app/shared/model//motivazione-perdita-proprieta.model';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface IVeicoloProprieta {
    id?: number;
    dataImmatricolazione?: Moment;
    dataAcquisto?: Moment;
    regioneImmatricolazione?: string;
    librettoContentType?: string;
    libretto?: any;
    certificatoProprietaContentType?: string;
    certificatoProprieta?: any;
    dataPerditaProprieta?: Moment;
    altraMotivazionePerditaProprieta?: string;
    motivazionePerditaProprieta?: IMotivazionePerditaProprieta;
    veicolo?: IVeicolo;
}

export class VeicoloProprieta implements IVeicoloProprieta {
    constructor(
        public id?: number,
        public dataImmatricolazione?: Moment,
        public dataAcquisto?: Moment,
        public regioneImmatricolazione?: string,
        public librettoContentType?: string,
        public libretto?: any,
        public certificatoProprietaContentType?: string,
        public certificatoProprieta?: any,
        public dataPerditaProprieta?: Moment,
        public altraMotivazionePerditaProprieta?: string,
        public motivazionePerditaProprieta?: IMotivazionePerditaProprieta,
        public veicolo?: IVeicolo
    ) {}
}
