import { Moment } from 'moment';
import { IMotivazioneperditaProprieta } from 'app/shared/model//motivazioneperdita-proprieta.model';
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
    altromotivazionePerditaProprieta?: string;
    dataperditaProprieta?: Moment;
    motivazioneperditaProprieta?: IMotivazioneperditaProprieta;
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
        public altromotivazionePerditaProprieta?: string,
        public dataperditaProprieta?: Moment,
        public motivazioneperditaProprieta?: IMotivazioneperditaProprieta,
        public veicolo?: IVeicolo
    ) {}
}
