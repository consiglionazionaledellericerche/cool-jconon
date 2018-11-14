import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ParcoautoTipologiaVeicoloModule } from './tipologia-veicolo/tipologia-veicolo.module';
import { ParcoautoAlimentazioneVeicoloModule } from './alimentazione-veicolo/alimentazione-veicolo.module';
import { ParcoautoClasseemissioniVeicoloModule } from './classeemissioni-veicolo/classeemissioni-veicolo.module';
import { ParcoautoUtilizzobeneVeicoloModule } from './utilizzobene-veicolo/utilizzobene-veicolo.module';
import { ParcoautoIstitutoModule } from './istituto/istituto.module';
import { ParcoautoMotivazioneperditaProprietaModule } from './motivazioneperdita-proprieta/motivazioneperdita-proprieta.module';
import { ParcoautoUtenzaModule } from './utenza/utenza.module';
import { ParcoautoVeicoloModule } from './veicolo/veicolo.module';
import { ParcoautoVeicoloProprietaModule } from './veicolo-proprieta/veicolo-proprieta.module';
import { ParcoautoVeicoloNoleggioModule } from './veicolo-noleggio/veicolo-noleggio.module';
import { ParcoautoLibrettopercorrenzaVeicoloModule } from './librettopercorrenza-veicolo/librettopercorrenza-veicolo.module';
import { ParcoautoAssicurazioneVeicoloModule } from './assicurazione-veicolo/assicurazione-veicolo.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        ParcoautoTipologiaVeicoloModule,
        ParcoautoAlimentazioneVeicoloModule,
        ParcoautoClasseemissioniVeicoloModule,
        ParcoautoUtilizzobeneVeicoloModule,
        ParcoautoIstitutoModule,
        ParcoautoMotivazioneperditaProprietaModule,
        ParcoautoUtenzaModule,
        ParcoautoVeicoloModule,
        ParcoautoVeicoloProprietaModule,
        ParcoautoVeicoloNoleggioModule,
        ParcoautoLibrettopercorrenzaVeicoloModule,
        ParcoautoAssicurazioneVeicoloModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ParcoautoEntityModule {}
