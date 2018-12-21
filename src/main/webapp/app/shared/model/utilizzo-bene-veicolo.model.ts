export interface IUtilizzoBeneVeicolo {
    id?: number;
    nome?: string;
}

export class UtilizzoBeneVeicolo implements IUtilizzoBeneVeicolo {
    constructor(public id?: number, public nome?: string) {}
}
