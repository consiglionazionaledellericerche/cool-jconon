export interface IClasseemissioniVeicolo {
    id?: number;
    nome?: string;
}

export class ClasseemissioniVeicolo implements IClasseemissioniVeicolo {
    constructor(public id?: number, public nome?: string) {}
}
