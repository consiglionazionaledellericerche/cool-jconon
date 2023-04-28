package it.cnr.si.cool.jconon.pagopa.model;

import it.cnr.si.cool.jconon.pagopa.config.PAGOPAConfigurationProperties;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode
public class PendenzaDTO {
    private Long protocollo;

    private String causale;
    private String codicefiscale;
    private String anagrafica;
    private String indirizzo;
    private Integer cap;
    private String localita;
    private String provincia;
    private String email;
    private BigDecimal importo;

    private Integer anno;
    private LocalDateTime dataScadenza;
    private LocalDateTime dataNotificaAvviso;
    private LocalDateTime dataPromemoriaScadenza;

    public Pendenza toPendenza(PAGOPAConfigurationProperties properties, Long numProtocollo) {
        final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        Pendenza pendenza = new Pendenza();
        pendenza.setIdTipoPendenza(properties.getTipopendenza());
        pendenza.setIdDominio(properties.getCodicefiscale());
        pendenza.setCausale(this.getCausale());

        SoggettoPagatore soggettoPagatore = new SoggettoPagatore();
        soggettoPagatore.setIdentificativo(this.getCodicefiscale());
        soggettoPagatore.setTipo("F");
        soggettoPagatore.setAnagrafica(this.getAnagrafica());
        soggettoPagatore.setIndirizzo(this.getIndirizzo());
        soggettoPagatore.setCap(this.getCap());
        soggettoPagatore.setLocalita(this.getLocalita());
        soggettoPagatore.setProvincia(this.getProvincia());
        soggettoPagatore.setEmail(this.getEmail());
        pendenza.setSoggettoPagatore(soggettoPagatore);

        pendenza.setImporto(this.getImporto());

        final String iuv = properties.getGovpay().getCodicestazione() + anno
                + String.format("%1$11s", numProtocollo).replace(' ', '0');
        pendenza.setNumeroAvviso(iuv);

        pendenza.setAnnoRiferimento(anno);
        pendenza.setDataScadenza(dateTimeFormatter.format(this.getDataScadenza()));
        pendenza.setDataNotificaAvviso(dateTimeFormatter.format(this.getDataNotificaAvviso()));
        pendenza.setDataPromemoriaScadenza(dateTimeFormatter.format(this.getDataPromemoriaScadenza()));

        Voci voci = new Voci();
        voci.setIbanAccredito(properties.getIban());
        voci.setDescrizione(pendenza.getCausale());
        voci.setIdVocePendenza(pendenza.getNumeroAvviso());
        voci.setCodiceContabilita(properties.getCodicecontabilita());
        voci.setTipoContabilita(properties.getTipocontabilita());
        voci.setImporto(pendenza.getImporto());
        pendenza.setVoci(Collections.singletonList(voci));
        return pendenza;
    }
}
