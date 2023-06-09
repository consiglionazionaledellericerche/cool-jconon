package it.cnr.si.cool.jconon.service.application;

import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContributoAttivitaService implements ApplicationValidateSend{

    @Value("${application.send.contributo-attivita.max-length}")
    public int MAXLENGTH;

    @Override
    public void validate(Folder call, Folder application) {
        final Integer maxlength =
                Optional.ofNullable(application.<String>getPropertyValue("jconon_application:contributo_attivita_dimensione1"))
                    .map(s -> s.length())
                    .orElse(0) +
                Optional.ofNullable(application.<String>getPropertyValue("jconon_application:contributo_attivita_dimensione2"))
                    .map(s -> s.length())
                    .orElse(0) +
                Optional.ofNullable(application.<String>getPropertyValue("jconon_application:contributo_attivita_dimensione3"))
                    .map(s -> s.length())
                    .orElse(0);
        if (maxlength > MAXLENGTH) {
            throw new ClientMessageException("Il numero dei caratteri [" + maxlength + "] supera la dimensione massima [" + MAXLENGTH + "]");
        }
    }
}
