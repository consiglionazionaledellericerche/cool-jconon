/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.mock;

import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@Primary
public class MockApplicationService extends ApplicationService {
    private static final Logger LOGGER = LoggerFactory.getLogger(MockApplicationService.class);
    @Autowired
    private PrintService printService;

    @Override
    protected void addToQueueForSend(String id, String contextURL, boolean email) {
        printService.printApplication(id, contextURL, Locale.ITALY, email);
    }

    @Override
    protected void addToQueueForPrint(String id, String contextURL, Boolean email) {
        LOGGER.info("Print application not started for id {}", id);
    }
}
