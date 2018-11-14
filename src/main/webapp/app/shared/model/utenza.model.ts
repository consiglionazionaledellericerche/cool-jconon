export interface IUtenza {
    id?: number;
    matricola?: number;
    uid?: string;
}

export class Utenza implements IUtenza {
    constructor(public id?: number, public matricola?: number, public uid?: string) {}
}
