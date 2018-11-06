import { Moment } from 'moment';
import { IIstituti } from 'app/shared/model//istituti.model';
import { IUser } from 'app/core/user/user.model';

export interface IAuto {
    id?: number;
    targa?: string;
    marca?: string;
    modello?: string;
    inizio_noleggio?: Moment;
    fine_noleggio?: Moment;
    cds?: IIstituti;
    user?: IUser;
}

export class Auto implements IAuto {
    constructor(
        public id?: number,
        public targa?: string,
        public marca?: string,
        public modello?: string,
        public inizio_noleggio?: Moment,
        public fine_noleggio?: Moment,
        public cds?: IIstituti,
        public user?: IUser
    ) {}
}
