export interface ITipologiaVeicolo {
    id?: number;
    nome?: string;
}

export class TipologiaVeicolo implements ITipologiaVeicolo {
    constructor(public id?: number, public nome?: string) {}
}
