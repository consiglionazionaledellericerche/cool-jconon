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

package it.cnr.si.cool.jconon.util;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.LoginException;
import it.cnr.cool.rest.Proxy;
import it.cnr.cool.rest.SecurityRest;
import it.cnr.cool.security.CMISAuthenticatorFactory;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StringUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPolicyType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.rest.ManageApplication;
import it.cnr.si.cool.jconon.rest.ManageCall;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.service.cache.CompetitionFolderService;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.definitions.Choice;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.stereotype.Component;

import javax.ws.rs.core.MultivaluedHashMap;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.Serializable;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@Component
public class CommonServiceTest {
    public static final String PUBBLICAZIONE_NON_POSSIBILE_MANCA_BANDO_DI_CONCORSO_IN_ITALIANO = "La Pubblicazione non é possibile, in quanto nella \"Sezione Allegati\" non risulta<BR>il Bando di Concorso in Italiano!";
    private static final Logger LOGGER = LoggerFactory.getLogger(CommonServiceTest.class);
    public static final String EUROPE_ROME = "Europe/Rome";
    @Autowired
    private ManageCall manageCall;
    @Autowired
    private ManageApplication manageApplication;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CompetitionFolderService competitionFolderService;
    @Autowired
    private I18nService i18nService;
    @Autowired
    private CMISAuthenticatorFactory cmisAuthenticatorFactory;
    @Autowired
    private SecurityRest securityRest;
    @Autowired
    private Proxy proxy;

    @Value("${user.admin.username}")
    private String adminUserName;
    @Value("${user.admin.password}")
    private String adminPassword;

    public Response deleteCall(String callId) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));
        return manageCall.deleteCall(request, callId, null);
    }

    public String loadApplication(String callId, String applicationId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(userName, password));
        final Response response = manageApplication.loadApplication(request, callId, applicationId, userName, false);
        return getValueFromResponse(response, PropertyIds.OBJECT_ID);
    }

    public Folder createCall(Session cmisSession, ObjectType objectType) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));
        MultivaluedMap<String, String> formParams = new MultivaluedHashMap<String, String>();
        formParams.add(PropertyIds.OBJECT_TYPE_ID, objectType.getId());
        formParams.addAll("aspect", Arrays.asList(
                JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_TIPO_SELEZIONE.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_LINGUE_DA_CONOSCERE.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_SETTORE_TECNOLOGICO.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_MACROAREA_DIPARTIMENTALE.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_GU.value()));
        formParams.add("add-remove-aspect", "remove-P:jconon_call:aspect_macro_call");

        formParams
                .forEach((name, values) -> request.addParameter(name, values.toArray(new String[0])));

        Response response = manageCall.saveCall(request, "it", formParams);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        String content = response.getEntity().toString();
        JsonElement json = new JsonParser().parse(content);
        assertEquals(json.getAsJsonObject().get("message").getAsString(), "message.error.required.codice");
        formParams.add(JCONONPropertyIds.CALL_CODICE.value(), "TEST " + objectType.getId().replaceAll("(:|_)", "-").toUpperCase() + " - " + UUID.randomUUID().toString());

        response = manageCall.saveCall(request, "it", formParams);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        Folder call =
                Optional.ofNullable(cmisSession.getObject((String) getValueFromResponse(response, PropertyIds.OBJECT_ID)))
                        .filter(Folder.class::isInstance)
                        .map(Folder.class::cast)
                        .orElseThrow(() -> new RuntimeException("Folder not found!"));
        assertNotNull(call);
        formParams.add(PropertyIds.OBJECT_ID, call.getId());
        formParams.add(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(), StringUtil.CMIS_DATEFORMAT.format(new Date()));
        formParams.add(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(), "2100-12-31T23:59:59.999+02:00");

        formParams
                .forEach((name, values) -> request.addParameter(name, values.toArray(new String[0])));

        response = manageCall.saveCall(request, "it", formParams);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        formParams.add("publish", "true");
        response = manageCall.publishCall(request, "it", formParams);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        return call;
    }

    public void saveCall(Folder call, String ticket, MultivaluedMap<String, String> formParams) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, ticket);
        Response response = manageCall.saveCall(request, "it", formParams);
    }

    public void publishCall(Folder call, ObjectType objectType) throws LoginException {
        Session cmisSession = cmisService.createAdminSession();
        final String profilo = cmisSession.getTypeDefinition(JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.value())
                .getPropertyDefinitions()
                .entrySet()
                .stream()
                .filter(stringPropertyDefinitionEntry -> stringPropertyDefinitionEntry.getKey().equals(JCONONPropertyIds.CALL_PROFILO.value()))
                .map(stringPropertyDefinitionEntry -> stringPropertyDefinitionEntry.getValue())
                .map(propertyDefinition -> propertyDefinition.getChoices())
                .findAny().orElse(Collections.emptyList())
                .stream()
                .map(Choice::getDisplayName)
                .collect(Collectors.toList())
                .stream().findAny().orElse(null);

        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));

        MultivaluedMap<String, String> formParams = new MultivaluedHashMap<String, String>();
        formParams.add(PropertyIds.OBJECT_TYPE_ID, objectType.getId());
        formParams.add(PropertyIds.OBJECT_ID, call.getId());
        formParams.addAll("aspect", Arrays.asList(
                JCONONPolicyType.JCONON_CALL_ASPECT_INQUADRAMENTO.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_TIPO_SELEZIONE.value(),
                JCONONPolicyType.JCONON_CALL_ASPECT_GU.value()));
        formParams.add(JCONONPropertyIds.CALL_CODICE.value(), call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        formParams.add(JCONONPropertyIds.CALL_DATA_INIZIO_INVIO_DOMANDE.value(),
                LocalDateTime.now().atZone(ZoneId.of(EUROPE_ROME)).plusDays(-10).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        formParams.add(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value(),
                LocalDateTime.now().atZone(ZoneId.of(EUROPE_ROME)).plusDays(+10).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        formParams.add(JCONONPropertyIds.CALL_NUMERO_POSTI.value(), "1");
        formParams.add(JCONONPropertyIds.CALL_DESCRIZIONE.value(), "DESCRIZIONE");
        formParams.add(JCONONPropertyIds.CALL_STRUTTURA_DESTINATARIA.value(), "ITALIA");
        formParams.add(JCONONPropertyIds.CALL_SEDE.value(), "ITALIA");
        formParams.add(JCONONPropertyIds.CALL_REQUISITI_LINK.value(), "Art.1");
        formParams.add(JCONONPropertyIds.CALL_REQUISITI.value(), "REQUISITI");
        formParams.add(JCONONPropertyIds.CALL_PROFILO.value(), profilo);
        formParams.add(JCONONPropertyIds.CALL_NUMERO_GU.value(), "1");
        formParams.add(JCONONPropertyIds.CALL_DATA_GU.value(),
                LocalDateTime.now().atZone(ZoneId.of(EUROPE_ROME)).plusDays(-10).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
        formParams.addAll(JCONONPropertyIds.CALL_ELENCO_TIPO_SELEZIONE.value(), Arrays.asList("Titoli", "Colloquio"));
        formParams.addAll(JCONONPropertyIds.CALL_ELENCO_SEZIONI_DOMANDA.value(),
                Arrays.asList(
                        "affix_tabAnagrafica",
                        "affix_tabResidenza",
                        "affix_tabDichiarazioni",
                        "affix_tabTitoli"
                )
        );
        formParams.addAll(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value(),
                Arrays.asList(
                        JCONONPolicyType.JCONON_APPLICATION_ASPECT_POSSESSO_REQUISITI.value(),
                        JCONONPolicyType.JCONON_APPLICATION_ASPECT_GODIMENTO_DIRITTI.value()
                )
        );
        formParams.addAll(JCONONPropertyIds.CALL_ELENCO_ASSOCIATIONS.value(),
                Arrays.asList(
                        JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE.value(),
                        JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO.value(),
                        JCONONDocumentType.JCONON_ATTACHMENT_ALLEGATO_GENERICO.value()
                )
        );
        Response response = manageCall.saveCall(request, "it", formParams);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        formParams.add("publish", Boolean.TRUE.toString());
        response = manageCall.publishCall(request, "it", formParams);

        assertEquals(PUBBLICAZIONE_NON_POSSIBILE_MANCA_BANDO_DI_CONCORSO_IN_ITALIANO,
                i18nService.getLabel(getValueFromResponse(response, "message"), Locale.ITALIAN)
        );

        Map<String, String> docProperties = Stream.of(
                new AbstractMap.SimpleEntry<>(PropertyIds.NAME, UUID.randomUUID().toString()),
                new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_CALL_IT.value()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        ContentStream contentStream = new ContentStreamImpl("bando.txt", MimeTypes.TEXT.mimetype(), "Bando di concorso in Italiano");
        call.createDocument(docProperties, contentStream, VersioningState.MAJOR);

        response = manageCall.publishCall(request, "it", formParams);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    public void createApplicationNotAuthorized(String callId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(userName, password));
        Response response = manageApplication.loadApplication(request, callId, null, userName, false);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        assertEquals(
                "Utente non autorizzato a sottomettere la candidatura!",
                i18nService.getLabel(getValueFromResponse(response, "message"), Locale.ITALIAN)
        );
    }

    public String createApplication(String callId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        Response response = manageApplication.loadApplication(request, callId, null, userName, false);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        String applicationId = getValueFromResponse(response, PropertyIds.OBJECT_ID);
        assertNotNull(applicationId);
        assertEquals(
                ApplicationService.StatoDomanda.INIZIALE.getValue(),
                getValueFromResponse(response, JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
        );
        return applicationId;
    }

    public void saveApplication(String callId, String applicationId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(userName, password));
        Response response = manageApplication.loadApplication(request, callId, applicationId, userName, false);
        assertEquals(
                ApplicationService.StatoDomanda.INIZIALE.getValue(),
                getValueFromResponse(response, JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
        );
        MultivaluedMap<String, String> formParams = createFormParams(response);
        formParams.addAll(
                "aspect",
                cmisService.createAdminSession().getObject(callId).<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())
        );
        response = manageApplication.saveApplication(request, formParams);
        assertEquals(
                ApplicationService.StatoDomanda.PROVVISORIA.getValue(),
                getValueFromResponse(response, JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
        );
    }

    public void sendApplication(String callId, String applicationId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(userName, password));
        final Session currentCMISSession = cmisService.getCurrentCMISSession(request);
        Folder application = Optional.ofNullable(currentCMISSession.getObject(applicationId))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        Response response = manageApplication.loadApplication(request, callId, applicationId, userName, false);
        assertEquals(
                ApplicationService.StatoDomanda.PROVVISORIA.getValue(),
                getValueFromResponse(response, JCONONPropertyIds.APPLICATION_STATO_DOMANDA.value())
        );
        MultivaluedMap<String, String> formParams = createFormParams(response);
        response = manageApplication.sendApplication(request, formParams);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        assertNotNull(getValueFromResponse(response, "message"));
        formParams.addAll(
                "aspect",
                cmisService.createAdminSession().getObject(callId).<List<String>>getPropertyValue(JCONONPropertyIds.CALL_ELENCO_ASPECTS.value())
        );
        formParams.add(JCONONPropertyIds.APPLICATION_FL_POSSESSO_REQUISITI.value(), Boolean.TRUE.toString());
        formParams.add(JCONONPropertyIds.APPLICATION_FL_GODIMENTO_DIRITTI.value(), Boolean.TRUE.toString());
        formParams.add(JCONONPropertyIds.APPLICATION_NAZIONE_NASCITA.value(), "ITALIA");
        formParams.add(JCONONPropertyIds.APPLICATION_COMUNE_NASCITA.value(), "ROMA");
        formParams.add(JCONONPropertyIds.APPLICATION_DATA_NASCITA.value(),
                LocalDateTime.now()
                        .withYear(2019)
                        .withMonth(1)
                        .withDayOfMonth(1)
                        .atZone(ZoneId.of(EUROPE_ROME))
                        .format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)
        );
        formParams.add(JCONONPropertyIds.APPLICATION_SESSO.value(), "M");
        formParams.remove(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value());
        formParams.add(JCONONPropertyIds.APPLICATION_FL_CITTADINO_ITALIANO.value(), Boolean.TRUE.toString());
        formParams.add(JCONONPropertyIds.APPLICATION_NAZIONE_RESIDENZA.value(), "ITALIA");
        formParams.add(JCONONPropertyIds.APPLICATION_COMUNE_RESIDENZA.value(), "ROMA");
        formParams.add(JCONONPropertyIds.APPLICATION_INDIRIZZO_RESIDENZA.value(), "VIA");
        formParams.add(JCONONPropertyIds.APPLICATION_NUM_CIVICO_RESIDENZA.value(), "1");
        formParams.add(JCONONPropertyIds.APPLICATION_CAP_RESIDENZA.value(), "00100");
        formParams.add(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value(), "JCNJNN18A01H501L");

        response = manageApplication.sendApplication(request, formParams);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        assertEquals(
                "Codice fiscale non valido: anno!",
                i18nService.getLabel(getValueFromResponse(response, "message"), Locale.ITALIAN)
        );
        formParams.remove(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value());
        formParams.add(JCONONPropertyIds.APPLICATION_CODICE_FISCALE.value(), "JCNJNN19A01H501L");
        response = manageApplication.sendApplication(request, formParams);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        assertEquals(
                i18nService.getLabel("message.error.allegati.required", Locale.ITALIAN, "Curriculum Vitae, Documento Riconoscimento"),
                getValueFromResponse(response, "message")
        );

        application.createDocument(
                Stream.of(
                        new AbstractMap.SimpleEntry<>(PropertyIds.NAME, "curriculum.txt"),
                        new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value())
                        ),
                        new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_CURRICULUM_VITAE.value()))
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)),
                new ContentStreamImpl("curriculum.txt", MimeTypes.TEXT.mimetype(), "Curriculum"),
                VersioningState.MAJOR
        );
        response = manageApplication.sendApplication(request, formParams);
        assertEquals(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode(), response.getStatus());
        assertEquals(
                i18nService.getLabel("message.error.allegati.required", Locale.ITALIAN, "Documento Riconoscimento"),
                getValueFromResponse(response, "message")
        );

        application.createDocument(
                Stream.of(
                        new AbstractMap.SimpleEntry<>(PropertyIds.NAME, "documento.txt"),
                        new AbstractMap.SimpleEntry<>(PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                                Arrays.asList(JCONONPolicyType.JCONON_ATTACHMENT_GENERIC_DOCUMENT.value())
                        ),
                        new AbstractMap.SimpleEntry<>(PropertyIds.OBJECT_TYPE_ID, JCONONDocumentType.JCONON_ATTACHMENT_DOCUMENTO_RICONOSCIMENTO.value()))
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)),
                new ContentStreamImpl("documento.txt", MimeTypes.TEXT.mimetype(), "Documento"),
                VersioningState.MAJOR
        );
        response = manageApplication.sendApplication(request, formParams);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        assertNotNull(competitionFolderService.findAttachmentId(currentCMISSession, application.getId(),
                JCONONDocumentType.JCONON_ATTACHMENT_APPLICATION));
    }

    public Response removeApplication(String applicationId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(userName, password));
        return manageApplication.deleteApplication(request, applicationId);
    }

    public Response reopenApplication(String applicationId, String userName, String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(userName, password));
        return manageApplication.reopenApplication(request, applicationId);
    }

    private MultivaluedMap<String, String> createFormParams(Response response) {
        MultivaluedMap<String, String> formParams = new MultivaluedHashMap<String, String>();
        final Stream<Map.Entry<String, Serializable>> stream = Optional.ofNullable(response.getEntity())
                .filter(Map.class::isInstance)
                .map(Map.class::cast)
                .orElse(Collections.emptyMap())
                .entrySet()
                .stream();
        stream
                .filter(stringSerializableEntry -> {
                    return !Arrays.asList(
                            CMISPropertyIds.ALFCMIS_NODEREF.value(),
                            CMISPropertyIds.CREATED_BY.value(),
                            CMISPropertyIds.LAST_MODIFICATION_DATE.value(),
                            CMISPropertyIds.CREATION_DATE.value(),
                            CMISPropertyIds.LAST_MODIFIED_BY.value(),
                            "allowableActions"
                    ).contains(stringSerializableEntry.getKey());
                })
                .forEach(stringStringEntry -> {
                    formParams.addAll(
                            stringStringEntry.getKey(),
                            Optional.ofNullable(stringStringEntry.getValue())
                                    .filter(ArrayList.class::isInstance)
                                    .map(ArrayList.class::cast)
                                    .map(arrayList -> {
                                        return (String[]) arrayList.toArray(new String[arrayList.size()]);
                                    })
                                    .orElseGet(() -> {
                                        return Collections.singletonList(
                                                Optional.ofNullable(stringStringEntry.getValue())
                                                        .map(serializable -> serializable.toString())
                                                        .orElse(null)
                                        ).toArray(new String[1]);
                                    })
                    );
                });
        return formParams;
    }

    public CMISUser createUser(String password) throws LoginException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));
        MultivaluedMap<String, String> formParams = new MultivaluedHashMap<String, String>();
        formParams.add("firstName", "Mario");
        formParams.add("lastName", "Rossi");
        formParams.add("email", "mario.rossi@gmail.com");
        formParams.add("password", password);
        formParams.add("confirmPassword", password);
        formParams.add("straniero", "false");
        formParams.add("codicefiscale", "RSSMRA80A01H501U");
        Response response = securityRest.doCreateUser(request, formParams, "it");
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
        return getValueFromResponse(response, "user");
    }

    public void confirmUser(String userName, String pin) throws LoginException, URISyntaxException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));
        Response response = securityRest.confirmAccount(request, userName, pin, "it");
        assertEquals(Response.Status.SEE_OTHER.getStatusCode(), response.getStatus());
    }

    public void deleteUser(String userName) throws LoginException, IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        MockHttpServletResponse response = new MockHttpServletResponse();
        request.addHeader(CMISService.AUTHENTICATION_HEADER, cmisAuthenticatorFactory.getTicket(adminUserName, adminPassword));
        request.addParameter("url", "service/cnr/person/person/".concat(userName));
        proxy.delete(request, response);
        assertEquals(Response.Status.OK.getStatusCode(), response.getStatus());
    }

    public <T extends Serializable> T getValueFromResponse(Response response, String key) {
        final Map<String, T> map = Optional.ofNullable(response.getEntity())
                .filter(Map.class::isInstance)
                .map(Map.class::cast)
                .orElse(Collections.emptyMap());
        return map.entrySet()
                .stream()
                .filter(stringStringEntry -> stringStringEntry.getKey().equals(key))
                .map(Map.Entry::getValue)
                .findAny()
                .orElse(null);
    }
}
