package it.cnr.si.service.dto;

import it.cnr.si.domain.Veicolo;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

/**
 * A Veicolo.
 */
public class VeicoloPrintDto implements Serializable {
    private String anno;
    private List<VeicoloDetailPrintDto> veicolos;

    public String getAnno() {
        return anno;
    }

    public void setAnno(String anno) {
        this.anno = anno;
    }

    public List<VeicoloDetailPrintDto> getVeicolos() {
        return veicolos;
    }

    public void setVeicolos(List<VeicoloDetailPrintDto> veicolos) {
        this.veicolos = veicolos;
    }
}
