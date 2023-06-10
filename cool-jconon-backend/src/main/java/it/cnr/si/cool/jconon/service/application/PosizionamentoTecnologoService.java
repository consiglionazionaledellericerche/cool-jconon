package it.cnr.si.cool.jconon.service.application;

import it.cnr.cool.web.scripts.exception.ClientMessageException;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.IntStream;

@Service
public class PosizionamentoTecnologoService implements ApplicationValidateSend{
    @Override
    public void validate(Folder call, Folder application) {
        if (application.getSecondaryTypes()
                .stream()
                .filter(secondaryType -> secondaryType.getId().equalsIgnoreCase("P:jconon_application:aspect_posizionamento_tecnologo"))
                .findAny().isPresent()) {
            final Integer sum = IntStream.range(1, 11)
                    .map(i -> applicationValue(application, "jconon_application:posizionamento_tecnologo_" + i))
                    .reduce(0, (a, b) -> a + b);
            if (sum != 100) {
                throw new ClientMessageException("Il totale delle percentuali attribuite [" + sum + "%] deve essere necessariamente il 100%!");
            }
        }
    }

    private Integer applicationValue(Folder application, String property) {
        return Optional.ofNullable(application.<String>getPropertyValue(property))
                .map(s -> s.substring(0, s.length() -1))
                .map(s -> Integer.valueOf(s))
                .orElse(0);
    }
}
