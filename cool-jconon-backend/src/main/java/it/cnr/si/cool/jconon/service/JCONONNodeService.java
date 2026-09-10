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

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.NodeService;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
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
    @Autowired
    private CMISService service;

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
            call.ifPresent(folder -> {
                callService.aggiornaProtocolloGraduatoria(
                        folder,
                        doc.<String>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                        doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
                );
                folder.updateProperties(
                        Stream.of(
                                new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CALL_GRADUATORIA.value(), Boolean.TRUE),
                                new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CALL_GRADUATORIA_DATA.value(), doc.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value()))
                        ).collect(
                                HashMap::new,
                                (m, e) -> m.put(e.getKey(), e.getValue()),
                                HashMap::putAll
                        )
                );
            });
        } else if (doc.getDocumentType().getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_RECRUITMENT_PROVISION.value())) {
            final Optional<Folder> call = doc.getParents()
                    .stream()
                    .findAny();
            call.ifPresent(folder -> callService.aggiornaProtocolloScorrimento(
                    folder,
                    doc.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_NUMERO.value()),
                    doc.getPropertyValue(JCONONPropertyIds.PROTOCOLLO_DATA.value())
            ));
        }
        return cmisObject;
    }

    @Override
    protected void afterDeleteDocument(Document document, Optional<Folder> call, DocumentType documentType) {
        super.afterDeleteDocument(document, call, documentType);
        Optional.ofNullable(document)
                .ifPresent(doc -> {
                    if (documentType.getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_CLASSIFICATION.value())) {
                        call.ifPresent(folder -> {
                            callService.aggiornaProtocolloGraduatoria(folder, null,null);
                            folder.updateProperties(
                                    Stream.of(
                                            new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CALL_GRADUATORIA.value(), Boolean.FALSE),
                                            new AbstractMap.SimpleEntry<>(JCONONPropertyIds.CALL_GRADUATORIA_DATA.value(), null)
                                    ).collect(
                                            HashMap::new,
                                            (m, e) -> m.put(e.getKey(), e.getValue()),
                                            HashMap::putAll
                                    )
                            );
                        });
                    }
                    // Se sto cancellando un documento di proroga devo ricalcolare le date
                    if (doc.getSecondaryTypes()
                            .stream()
                            .map(SecondaryType::getId)
                            .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_ATTACHMENT_PROROGATION.value()))) {
                        Session cmisSession = service.createAdminSession();
                        Criteria criteria = CriteriaFactory.createCriteria(JCONONPolicyType.JCONON_ATTACHMENT_PROROGATION.queryName());
                        criteria.addColumn(JCONONPropertyIds.ATTACHMENT_DATA_INIZIO.value());
                        criteria.addColumn(JCONONPropertyIds.ATTACHMENT_DATA_FINE.value());
                        call.ifPresent(folder -> criteria.add(Restrictions.inFolder(folder.getId())));
                        ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession, false, cmisSession.getDefaultContext());
                        GregorianCalendar maxDataInizio = null;
                        GregorianCalendar maxDataFine = null;
                        for (QueryResult queryResult : iterable) {
                            // Escludo il documento che sto cancellando dal calcolo
                            String objectId = queryResult.getPropertyValueById(PropertyIds.OBJECT_ID);
                            if (objectId != null && objectId.equals(doc.getId())) {
                                continue;
                            }
                            GregorianCalendar dataInizio =queryResult.<GregorianCalendar>getPropertyValueById(JCONONPropertyIds.ATTACHMENT_DATA_INIZIO.value());
                            GregorianCalendar dataFine = queryResult.<GregorianCalendar>getPropertyValueById(JCONONPropertyIds.ATTACHMENT_DATA_FINE.value());

                            if (dataInizio != null && (maxDataInizio == null || dataInizio.after(maxDataInizio))) {
                                maxDataInizio = dataInizio;
                            }
                            if (dataFine != null && (maxDataFine == null || dataFine.after(maxDataFine))) {
                                maxDataFine = dataFine;
                            }
                        }
                        final Map<String, Object> properties = Stream.of(
                                new AbstractMap.SimpleEntry<>(
                                        JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(),
                                        Optional.ofNullable(maxDataInizio).orElse(
                                                call.map(folder -> folder.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE_INITIAL.value()))
                                                        .orElseThrow(RuntimeException::new)
                                        )
                                ),
                                new AbstractMap.SimpleEntry<>(
                                        JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                                        Optional.ofNullable(maxDataFine).orElse(
                                                call.map(folder -> folder.<GregorianCalendar>getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE_INITIAL.value()))
                                                        .orElseThrow(RuntimeException::new)
                                        )
                                )).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
                        call.ifPresent(folder -> folder.updateProperties(properties));
                    }
                });
    }
}
