import { Moment } from 'moment';
import { ITipologiaVeicolo } from 'app/shared/model//tipologia-veicolo.model';
import { IAlimentazioneVeicolo } from 'app/shared/model//alimentazione-veicolo.model';
import { IClasseEmissioniVeicolo } from 'app/shared/model//classe-emissioni-veicolo.model';
import { IUtilizzoBeneVeicolo } from 'app/shared/model//utilizzo-bene-veicolo.model';

export interface IVeicolo {
    id?: number;
    targa?: string;
    marca?: string;
    modello?: string;
    cilindrata?: string;
    cvKw?: string;
    kmPercorsi?: number;
    dataValidazione?: Moment;
    istituto?: string;
    responsabile?: string;
    tipologiaVeicolo?: ITipologiaVeicolo;
    alimentazioneVeicolo?: IAlimentazioneVeicolo;
    classeEmissioniVeicolo?: IClasseEmissioniVeicolo;
    utilizzoBeneVeicolo?: IUtilizzoBeneVeicolo;
}

export class Veicolo implements IVeicolo {
    constructor(
        public id?: number,
        public targa?: string,
        public marca?: string,
        public modello?: string,
        public cilindrata?: string,
        public cvKw?: string,
        public kmPercorsi?: number,
        public dataValidazione?: Moment,
        public istituto?: string,
        public responsabile?: string,
        public tipologiaVeicolo?: ITipologiaVeicolo,
        public alimentazioneVeicolo?: IAlimentazioneVeicolo,
        public classeEmissioniVeicolo?: IClasseEmissioniVeicolo,
        public utilizzoBeneVeicolo?: IUtilizzoBeneVeicolo
    ) {}
}
