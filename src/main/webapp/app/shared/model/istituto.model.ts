export interface IIstituto {
    id?: number;
    cds?: string;
    nome?: string;
}

export class Istituto implements IIstituto {
    constructor(public id?: number, public cds?: string, public nome?: string) {}
}
