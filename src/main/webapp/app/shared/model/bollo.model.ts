import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model/veicolo.model';

export interface IBollo {
    id?: number;
    dataScadenza?: Moment;
    bolloPdfContentType?: string;
    bolloPdf?: any;
    visionatoBollo?: Moment;
    pagato?: boolean;
    veicolo?: IVeicolo;
}

export class Bollo implements IBollo {
    constructor(
        public id?: number,
        public dataScadenza?: Moment,
        public bolloPdfContentType?: string,
        public bolloPdf?: any,
        public visionatoBollo?: Moment,
        public pagato?: boolean,
        public veicolo?: IVeicolo
    ) {
        this.pagato = this.pagato || false;
    }
}
