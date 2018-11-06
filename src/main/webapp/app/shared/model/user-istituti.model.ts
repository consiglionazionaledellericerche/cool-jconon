import { Moment } from 'moment';
import { IUser } from 'app/core/user/user.model';
import { IIstituti } from 'app/shared/model//istituti.model';

export interface IUser_istituti {
    id?: number;
    data?: Moment;
    user?: IUser;
    istituti?: IIstituti;
}

export class User_istituti implements IUser_istituti {
    constructor(public id?: number, public data?: Moment, public user?: IUser, public istituti?: IIstituti) {}
}
