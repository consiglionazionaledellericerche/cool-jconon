export interface IAlimentazioneVeicolo {
    id?: number;
    nome?: string;
}

export class AlimentazioneVeicolo implements IAlimentazioneVeicolo {
    constructor(public id?: number, public nome?: string) {}
}
