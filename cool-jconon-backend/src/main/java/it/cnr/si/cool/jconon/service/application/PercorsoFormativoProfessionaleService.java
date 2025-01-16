package it.cnr.si.cool.jconon.service.application;

import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class PercorsoFormativoProfessionaleService implements ApplicationValidateSend{

    @Value("${application.send.percorso-formativo-professionale.max-length}")
    public int MAXLENGTH;

    @Override
    public void validate(Folder call, Folder application) {

        final Integer maxLength = IntStream.range(1, 2)
                .map(i -> applicationValue(application, "jconon_application:percorso_formativo_professionale_dimensione" + i))
                .reduce(0, (a, b) -> a + b);

        if (maxLength > MAXLENGTH) {
            throw new ClientMessageException("Il numero dei caratteri [" + maxLength + "] supera la dimensione massima [" + MAXLENGTH + "]");
        }

    }

    private Integer applicationValue(Folder application, String property) {
        return Optional.ofNullable(application.<String>getPropertyValue(property))
                .map(s -> s.length())
                .orElse(0);
    }
}
