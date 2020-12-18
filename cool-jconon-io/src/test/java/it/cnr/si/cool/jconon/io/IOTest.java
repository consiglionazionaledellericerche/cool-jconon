/*
 * Copyright (C) 2020 Consiglio Nazionale delle Ricerche
 *       This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

package it.cnr.si.cool.jconon.io;

import it.cnr.si.cool.jconon.io.model.InlineResponse201;
import it.cnr.si.cool.jconon.io.model.MessageContent2;
import it.cnr.si.cool.jconon.io.model.NewMessage;
import it.cnr.si.cool.jconon.io.repository.IO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = IOClientConfiguration.class)
public class IOTest {
    @Autowired(required = false)
    private IO ioClient;

    @Test
    public void newComunicazioneMesage() {
        NewMessage newMessage = new NewMessage();
        String fiscalCode = "AAAAAA00A00A000A";
        newMessage.setTimeToLive(7200);
        newMessage.setFiscalCode(fiscalCode);
        MessageContent2 messageContent2 = new MessageContent2();
        messageContent2.setSubject("Bando 315.58 PT - PROGETTAZIONE E-O GESTIONE IMPIANTI, STRUMENTAZIONI, SERVIZI");
        messageContent2.setMarkdown("# Comunicazione\n" +
                "In riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, Le inviamo la seguente *comunicazione*, che può scaricare attraverso il seguente link:\n" +
                "\n" +
                "[Scarica la Comunicazione](https://selezionionline.cnr.it/jconon/rest/content?nodeRef=99588489-2914-4fc8-9658-493f69ffc433;1.0&guest=true)\n" +
                "\n" +
                "Distinti saluti.");
        newMessage.setContent(messageContent2);
        InlineResponse201 inlineResponse201 = ioClient.submitMessageforUser(fiscalCode, newMessage);
        assertNotNull(inlineResponse201.getId());
    }

    @Test
    public void newConvocazioneMesage() {
        NewMessage newMessage = new NewMessage();
        String fiscalCode = "AAAAAA00A00A000A";
        newMessage.setTimeToLive(7200);
        newMessage.setFiscalCode(fiscalCode);
        MessageContent2 messageContent2 = new MessageContent2();
        messageContent2.setSubject("Bando 315.58 PT - PROGETTAZIONE E-O GESTIONE IMPIANTI, STRUMENTAZIONI, SERVIZI");
        messageContent2.setMarkdown("# Convocazione\n" +
                "In riferimento alla Sua domanda di partecipazione al concorso indicato in oggetto, Le inviamo la seguente *convocazione*, che può essere scaricata attraverso il seguente link:\n" +
                "\n" +
                "[Scarica la Convocazione](https://selezionionline.cnr.it/jconon/rest/application/convocazione?nodeRef=99588489-2914-4fc8-9658-493f69ffc433;1.0&guest=true)\n" +
                "\n" +
                "Distinti saluti.");
        newMessage.setContent(messageContent2);
        InlineResponse201 inlineResponse201 = ioClient.submitMessageforUser(fiscalCode, newMessage);
        assertNotNull(inlineResponse201.getId());
    }

}
