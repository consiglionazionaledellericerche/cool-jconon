export interface IUtilizzobeneVeicolo {
    id?: number;
    nome?: string;
}

export class UtilizzobeneVeicolo implements IUtilizzobeneVeicolo {
    constructor(public id?: number, public nome?: string) {}
}
