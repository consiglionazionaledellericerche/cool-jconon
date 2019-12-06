import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model/veicolo.model';

export interface IMulta {
    id?: number;
    dataMulta?: Moment;
    multaPdfContentType?: string;
    multaPdf?: any;
    visionatoMulta?: Moment;
    pagatoMulta?: boolean;
    veicolo?: IVeicolo;
}

export class Multa implements IMulta {
    constructor(
        public id?: number,
        public dataMulta?: Moment,
        public multaPdfContentType?: string,
        public multaPdf?: any,
        public visionatoMulta?: Moment,
        public pagatoMulta?: boolean,
        public veicolo?: IVeicolo
    ) {
        this.pagatoMulta = this.pagatoMulta || false;
    }
}
