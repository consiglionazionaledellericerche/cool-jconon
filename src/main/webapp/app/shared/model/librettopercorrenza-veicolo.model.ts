import { Moment } from 'moment';
import { IVeicolo } from 'app/shared/model//veicolo.model';

export interface ILibrettopercorrenzaVeicolo {
    id?: number;
    librettoPercorrenzaContentType?: string;
    librettoPercorrenza?: any;
    data?: Moment;
    targa?: IVeicolo;
}

export class LibrettopercorrenzaVeicolo implements ILibrettopercorrenzaVeicolo {
    constructor(
        public id?: number,
        public librettoPercorrenzaContentType?: string,
        public librettoPercorrenza?: any,
        public data?: Moment,
        public targa?: IVeicolo
    ) {}
}
