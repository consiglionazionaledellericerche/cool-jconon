export interface IClasseEmissioniVeicolo {
    id?: number;
    nome?: string;
}

export class ClasseEmissioniVeicolo implements IClasseEmissioniVeicolo {
    constructor(public id?: number, public nome?: string) {}
}
