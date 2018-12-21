export interface IMotivazionePerditaProprieta {
    id?: number;
    nome?: string;
}

export class MotivazionePerditaProprieta implements IMotivazionePerditaProprieta {
    constructor(public id?: number, public nome?: string) {}
}
