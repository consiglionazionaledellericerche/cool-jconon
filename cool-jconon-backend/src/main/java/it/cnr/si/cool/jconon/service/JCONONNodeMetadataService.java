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

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.util.JcononGroups;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.enums.Action;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Primary
public class JCONONNodeMetadataService extends NodeMetadataService implements InitializingBean {
    public static final String ACL_COORDINATOR_RDP = "aclCoordinatorRdP";
    @Autowired
    private ACLService aclService;
    @Autowired
    private CMISService cmisService;
    @Autowired
    protected I18nService i18NService;
    @Override
    protected CmisObject updateObjectProperties(Session cmisSession, BindingSession bindingSession,
                                                String objectId, String objectTypeId, String objectParentId,
                                                String inheritedPermission, List<String> aspectNames,
                                                Map<String, Object> aspectProperties, Map<String, Object> properties, String[] aspects) {
        final CmisObject cmisObject = super.updateObjectProperties(cmisSession, bindingSession, objectId,
                objectTypeId, objectParentId, inheritedPermission,
                aspectNames, aspectProperties, properties, aspects);
        if (Optional.ofNullable(inheritedPermission)
                .map(s -> Boolean.valueOf(s))
                .filter(aBoolean -> !aBoolean).isPresent()
        ) {
            aclService.addAcl(cmisService.getAdminSession(),
                    cmisObject.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                    Collections.singletonMap(JcononGroups.CONCORSI.group(), ACLType.Coordinator)
            );
        }
        prorogation(cmisObject);
        return cmisObject;
    }

    public void prorogation(CmisObject cmisObject) {
        /**
         * Controllo se sto inserendo un documento di proroga dei termini del Bando
         */
        if (cmisObject.getSecondaryTypes()
                .stream()
                .map(SecondaryType::getId)
                .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_ATTACHMENT_PROROGATION.value()))) {
            Optional.ofNullable(cmisObject)
                    .filter(Document.class::isInstance)
                    .map(Document.class::cast)
                    .ifPresent(doc -> {
                        final Optional<Folder> call = doc.getParents()
                                .stream()
                                .findAny();
                        if (call.isPresent()) {
                            aggiornaDate(call.get(), doc);
                        }
                    });
        }
    }
    public void aggiornaDate(Folder call, Document doc) {
        if (!call.getAllowableActions().getAllowableActions().contains(Action.CAN_UPDATE_PROPERTIES))
            throw new ClientMessageException("message.error.call.cannnot.modify");
        if (doc.getType().getId().equalsIgnoreCase(JCONONDocumentType.JCONON_ATTACHMENT_CALL_RE_JUDGMENT.value()) && !Optional.ofNullable(call.getPropertyValue(JCONONPropertyIds.CALL_GROUP_CAN_SUBMIT_APPLICATION.value())).isPresent()) {
            doc.delete();
            throw new ClientMessageException(i18NService.getLabel("message.error.call.cannnot.prorogate", Locale.ITALY, call.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())));
        }
        final Map<String, Object> properties = Stream.of(
                new AbstractMap.SimpleEntry<>(
                        JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(),
                        doc.getPropertyValue(JCONONPropertyIds.ATTACHMENT_DATA_INIZIO.value())
                ),
                new AbstractMap.SimpleEntry<>(
                        JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                        doc.getPropertyValue(JCONONPropertyIds.ATTACHMENT_DATA_FINE.value())
                )).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        if (call.getSecondaryTypes().stream().map(SecondaryType::getId)
                .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_GU.value())) &&
                doc.getPropertyValue(JCONONPropertyIds.CALL_DATA_GU.value()) != null &&
                doc.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_GU.value()) != null
        ) {
            properties.putAll(
                    Stream.of(new AbstractMap.SimpleEntry<>(
                                    JCONONPropertyIds.CALL_NEW_DATA_GU.value(),
                                    doc.getPropertyValue(JCONONPropertyIds.CALL_DATA_GU.value())
                            ),
                            new AbstractMap.SimpleEntry<>(
                                    JCONONPropertyIds.CALL_NEW_NUMERO_GU.value(),
                                    doc.getPropertyValue(JCONONPropertyIds.CALL_NUMERO_GU.value())
                            )).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
        }
        if (call.getSecondaryTypes().stream().map(SecondaryType::getId)
                .anyMatch(s -> s.equalsIgnoreCase(JCONONPolicyType.JCONON_CALL_ASPECT_INPA.value())) &&
                doc.getPropertyValue(JCONONPropertyIds.CALL_DATA_INPA.value()) != null
        ) {
            properties.putAll(
                    Stream.of(
                            new AbstractMap.SimpleEntry<>(
                                    JCONONPropertyIds.CALL_DATA_INPA.value(),
                                    doc.getPropertyValue(JCONONPropertyIds.CALL_DATA_INPA.value())
                            )).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
        }
        call.updateProperties(properties);
    }

    @Override
    public CmisObject updateObjectProperties(Map<String, ?> reqProperties, Session cmisSession, HttpServletRequest request) throws ParseException {
        final CmisObject cmisObject = super.updateObjectProperties(reqProperties, cmisSession, request);
        final Optional<? extends Map.Entry<String, ?>> aclCoordinatorRdP = reqProperties
                .entrySet()
                .stream()
                .filter(stringEntry -> stringEntry.getKey().equalsIgnoreCase(ACL_COORDINATOR_RDP))
                .findAny();
        if (aclCoordinatorRdP.isPresent()) {
            final Optional<String> value = Arrays.asList((String[]) aclCoordinatorRdP.get().getValue())
                    .stream().findFirst().map(String.class::cast);
            aclService.addAcl(cmisService.getAdminSession(),
                    cmisObject.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                    Collections.singletonMap(JcononGroups.CONCORSI.group(), ACLType.Coordinator)
            );
            if (value.isPresent()) {
                aclService.addAcl(cmisService.getAdminSession(),
                        cmisObject.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                        Collections.singletonMap(value.get(), ACLType.Coordinator)
                );
            }
        }
        return cmisObject;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        setDatePattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    }
}
