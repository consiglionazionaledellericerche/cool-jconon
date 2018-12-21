import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface ILibrettoPercorrenzaVeicolo {
    id?: number;
    librettoPercorrenzaContentType?: string;
    librettoPercorrenza?: any;
    data?: Moment;
    veicolo?: IVeicolo;
}

export class LibrettoPercorrenzaVeicolo implements ILibrettoPercorrenzaVeicolo {
    constructor(
        public id?: number,
        public librettoPercorrenzaContentType?: string,
        public librettoPercorrenza?: any,
        public data?: Moment,
        public veicolo?: IVeicolo
    ) {}
}
