import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ParcoautoTipologiaVeicoloModule } from './tipologia-veicolo/tipologia-veicolo.module';
import { ParcoautoAlimentazioneVeicoloModule } from './alimentazione-veicolo/alimentazione-veicolo.module';
import { ParcoautoClasseEmissioniVeicoloModule } from './classe-emissioni-veicolo/classe-emissioni-veicolo.module';
import { ParcoautoUtilizzoBeneVeicoloModule } from './utilizzo-bene-veicolo/utilizzo-bene-veicolo.module';
import { ParcoautoMotivazionePerditaProprietaModule } from './motivazione-perdita-proprieta/motivazione-perdita-proprieta.module';
import { ParcoautoVeicoloModule } from './veicolo/veicolo.module';
import { ParcoautoVeicoloProprietaModule } from './veicolo-proprieta/veicolo-proprieta.module';
import { ParcoautoVeicoloNoleggioModule } from './veicolo-noleggio/veicolo-noleggio.module';
import { ParcoautoLibrettoPercorrenzaVeicoloModule } from './libretto-percorrenza-veicolo/libretto-percorrenza-veicolo.module';
import { ParcoautoAssicurazioneVeicoloModule } from './assicurazione-veicolo/assicurazione-veicolo.module';
import { ParcoautoMultaModule } from './multa/multa.module';
import { ParcoautoBolloModule } from './bollo/bollo.module';
import { ParcoautoCancellazionePraModule } from './cancellazione-pra/cancellazione-pra.module';
import { ParcoautoValidazioneModule } from './validazione/validazione.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        ParcoautoTipologiaVeicoloModule,
        ParcoautoAlimentazioneVeicoloModule,
        ParcoautoClasseEmissioniVeicoloModule,
        ParcoautoUtilizzoBeneVeicoloModule,
        ParcoautoMotivazionePerditaProprietaModule,
        ParcoautoVeicoloModule,
        ParcoautoVeicoloProprietaModule,
        ParcoautoVeicoloNoleggioModule,
        ParcoautoLibrettoPercorrenzaVeicoloModule,
        ParcoautoAssicurazioneVeicoloModule,
        ParcoautoMultaModule,
        ParcoautoBolloModule,
        ParcoautoCancellazionePraModule,
        ParcoautoValidazioneModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoEntityModule {}
