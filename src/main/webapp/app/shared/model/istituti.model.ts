export interface IIstituti {
    id?: number;
    cds?: string;
    nome?: string;
    citta?: string;
    indirizzo?: string;
}

export class Istituti implements IIstituti {
    constructor(public id?: number, public cds?: string, public nome?: string, public citta?: string, public indirizzo?: string) {}
}
