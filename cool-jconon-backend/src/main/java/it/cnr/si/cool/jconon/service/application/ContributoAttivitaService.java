package it.cnr.si.cool.jconon.service.application;

import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class ContributoAttivitaService implements ApplicationValidateSend{

    @Value("${application.send.contributo-attivita.max-length}")
    public int MAXLENGTH;

    @Override
    public void validate(Folder call, Folder application) {

        final Integer maxLengthRicercatore = IntStream.range(1, 4)
                .map(i -> applicationValue(application, "jconon_application:contributo_attivita_dimensione" + i))
                .reduce(0, (a, b) -> a + b);

        if (maxLengthRicercatore > MAXLENGTH) {
            throw new ClientMessageException("Il numero dei caratteri [" + maxLengthRicercatore + "] supera la dimensione massima [" + MAXLENGTH + "]");
        }
        final Integer maxLengthTecnologo = IntStream.range(1, 11)
                .map(i -> applicationValue(application, "jconon_application:tecnologo_settore_ambiti_" + i))
                .reduce(0, (a, b) -> a + b);

        if (maxLengthTecnologo > MAXLENGTH) {
            throw new ClientMessageException("Il numero dei caratteri [" + maxLengthTecnologo + "] supera la dimensione massima [" + MAXLENGTH + "]");
        }

    }

    private Integer applicationValue(Folder application, String property) {
        return Optional.ofNullable(application.<String>getPropertyValue(property))
                .map(s -> s.length())
                .orElse(0);
    }
}
