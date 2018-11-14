import { Moment } from 'moment';
import { ITipologiaVeicolo } from 'app/shared/model//tipologia-veicolo.model';
import { IAlimentazioneVeicolo } from 'app/shared/model//alimentazione-veicolo.model';
import { IClasseemissioniVeicolo } from 'app/shared/model//classeemissioni-veicolo.model';
import { IUtilizzobeneVeicolo } from 'app/shared/model//utilizzobene-veicolo.model';
import { IIstituto } from 'app/shared/model//istituto.model';
import { IUtenza } from 'app/shared/model//utenza.model';

export interface IVeicolo {
    id?: number;
    targa?: string;
    marca?: string;
    modello?: string;
    cilindrata?: number;
    cvKw?: string;
    km?: number;
    dataValidazione?: Moment;
    tipologiaVeicolo?: ITipologiaVeicolo;
    alimentazioneVeicolo?: IAlimentazioneVeicolo;
    classeemissioniVeicolo?: IClasseemissioniVeicolo;
    utilizzobeneVeicolo?: IUtilizzobeneVeicolo;
    istituto?: IIstituto;
    responsabile?: IUtenza;
}

export class Veicolo implements IVeicolo {
    constructor(
        public id?: number,
        public targa?: string,
        public marca?: string,
        public modello?: string,
        public cilindrata?: number,
        public cvKw?: string,
        public km?: number,
        public dataValidazione?: Moment,
        public tipologiaVeicolo?: ITipologiaVeicolo,
        public alimentazioneVeicolo?: IAlimentazioneVeicolo,
        public classeemissioniVeicolo?: IClasseemissioniVeicolo,
        public utilizzobeneVeicolo?: IUtilizzobeneVeicolo,
        public istituto?: IIstituto,
        public responsabile?: IUtenza
    ) {}
}
