/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
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

package it.cnr.si.cool.jconon.service;

import it.cnr.cool.service.NodeService;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.SecondaryType;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Primary
public class JCONONNodeService extends NodeService {
    @Autowired
    private CallService callService;
    @Override
    protected CmisObject upgradeDocument(MultipartFile mFileDocumento, Document doc) {
        final CmisObject cmisObject = super.upgradeDocument(mFileDocumento, doc);
        /**
         * Sto inserendo un provvedimento di graduatoria sul Bando
         */
        if (doc.getDocumentType().getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION.value())) {
            final Optional<Folder> call = doc.getParents()
                    .stream()
                    .findAny();
            if (call.isPresent()) {
                callService.aggiornaProtocolloGraduatoria(
                        call.get(),
                        doc.<String>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                        doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
                );
                call.get().updateProperties(
                    Stream.of(
                        new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CALL_GRADUATORIA.value(), Boolean.TRUE),
                        new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CALL_GRADUATORIA_DATA.value(), doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                    ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
                );
            }
        } else if (doc.getDocumentType().getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_RECRUITMENT_PROVISION.value())) {
            final Optional<Folder> call = doc.getParents()
                    .stream()
                    .findAny();
            if (call.isPresent()) {
                callService.aggiornaProtocolloScorrimento(
                        call.get(),
                        doc.<String>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                        doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
                );
            }
        }
        return cmisObject;
    }
}
