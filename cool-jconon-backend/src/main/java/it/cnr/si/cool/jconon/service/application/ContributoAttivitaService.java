package it.cnr.si.cool.jconon.service.application;

import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ContributoAttivitaService implements ApplicationValidateSend{

    public static final int MAX = 1500;

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
        if (maxlength > MAX) {
            throw new ClientMessageException("Il numero dei caratteri [" + maxlength + "] supera la dimensione massima [" + MAX + "]");
        }
    }
}
