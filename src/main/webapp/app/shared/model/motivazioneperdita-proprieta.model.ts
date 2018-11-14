export interface IMotivazioneperditaProprieta {
    id?: number;
    nome?: string;
}

export class MotivazioneperditaProprieta implements IMotivazioneperditaProprieta {
    constructor(public id?: number, public nome?: string) {}
}
