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

package it.cnr.si.cool.jconon.rest;

import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.mock.RequestUtils;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.service.PrintService;
import it.cnr.si.cool.jconon.service.application.ApplicationService;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.text.ParseException;
import java.util.*;

@Path("manage-application")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked(needExistingSession = true, checkrbac = false)
public class ManageApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManageApplication.class);

    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private NodeMetadataService nodeMetadataService;

    @POST
    @Path("move_prodotto")
    public Response moveProdotto(@Context HttpServletRequest request, @QueryParam("prodottoId") String prodottoId) {
        ResponseBuilder rb;
        applicationService.moveDocument(cmisService.getCurrentCMISSession(request), prodottoId);
        rb = Response.ok("");
        return rb.build();
    }

    @POST
    @Path("paste")
    public Response pasteApplication(@Context HttpServletRequest request,
                                     @FormParam("applicationSourceId") String applicationSourceId,
                                     @FormParam("callTargetId") String callTargetId) {
        ResponseBuilder rb;
        try {
            String userId = getUserId(request);
            String objectId = applicationService.paste(cmisService.getCurrentCMISSession(request),
                    applicationSourceId, callTargetId, userId);
            rb = Response.ok(Collections.singletonMap(PropertyIds.OBJECT_ID, objectId));
        } catch (ClientMessageException e) {
            LOGGER.error("paste error {} {}", applicationSourceId, callTargetId, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        }
        return rb.build();
    }

    @POST
    @Path("reopen")
    public Response reopenApplication(@Context HttpServletRequest request,
                                      @FormParam("cmis:objectId") String applicationSourceId) {
        try {
            String userId = getUserId(request);
            applicationService.reopenApplication(cmisService.getCurrentCMISSession(request),
                applicationSourceId, Utility.getContextURL(request), request.getLocale(), userId);
            return Response.ok().build();
        } catch (ClientMessageException e) {
            LOGGER.warn("Send application error: {}", e.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
    }

    @POST
    @Path("send")
    public Response sendApplication(@Context HttpServletRequest request, MultivaluedMap<String, String> formParams) {
        ResponseBuilder rb;
        try {
            Session cmisSession = cmisService.getCurrentCMISSession(request);
            String userId = getUserId(request);
            Map<String, String[]> formParamz = new HashMap<String, String[]>();
            formParamz.putAll(request.getParameterMap());
            if (formParams != null && !formParams.isEmpty())
                formParamz.putAll(RequestUtils.extractFormParams(formParams));

            Map<String, Object> properties = nodeMetadataService
                    .populateMetadataType(cmisSession, formParamz, request);
            Map<String, String[]> aspectParams = applicationService.getAspectParams(cmisSession, formParamz);
            Map<String, Object> aspectProperties = nodeMetadataService
                    .populateMetadataAspectFromRequest(cmisSession, aspectParams, request);
            applicationService.save(cmisSession, Utility.getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
            Map<String, String> model = applicationService.sendApplication(cmisService.getCurrentCMISSession(request),
                    (String) properties.get(PropertyIds.OBJECT_ID), Utility.getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
            rb = Response.ok(model);
        } catch (ClientMessageException e) {
            LOGGER.warn("Send application error: {}", e.getMessage());
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        } catch (ParseException e) {
            LOGGER.error("send error", e);
            rb = Response.serverError();
        }
        return rb.build();
    }

    @PUT
    @Path("main")
    public Response updateApplication(@Context HttpServletRequest request, MultivaluedMap<String, String> formParams) {
        ResponseBuilder rb;
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        String userId = getUserId(request);
        try {
            Map<String, String[]> formParamz = new HashMap<String, String[]>();
            formParamz.putAll(request.getParameterMap());
            if (formParams != null && !formParams.isEmpty())
                formParamz.putAll(RequestUtils.extractFormParams(formParams));

            Map<String, Object> properties = nodeMetadataService
                    .populateMetadataType(cmisSession, formParamz, request);
            Folder application = (Folder) cmisSession.getObject((String) properties.get(PropertyIds.OBJECT_ID));
            List<String> aspects = new ArrayList<String>(Arrays.asList(formParamz.get(PolicyType.ASPECT_REQ_PARAMETER_NAME)));
            application.getSecondaryTypes().forEach(x -> {
                aspects.add(x.getId());
            });
            formParamz.put(PolicyType.ASPECT_REQ_PARAMETER_NAME, aspects.toArray(new String[aspects.size()]));
            Map<String, String[]> aspectParams = applicationService.getAspectParams(cmisSession, formParamz);

            Map<String, Object> aspectProperties = nodeMetadataService
                    .populateMetadataAspectFromRequest(cmisSession, aspectParams, request);

            rb = Response.ok(CMISUtil.convertToProperties(
                    applicationService.save(cmisSession, Utility.getContextURL(request), request.getLocale(), userId, properties, aspectProperties)
            ));
        } catch (ClientMessageException e) {
            LOGGER.warn("Save Application for user: {}", userId, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        } catch (ParseException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @PUT
    @Path("punteggi")
    public Response updatePunteggi(@Context HttpServletRequest request,
                                   @FormParam("jconon_application:punteggio_titoli") String punteggio_titoli,
                                   @FormParam("jconon_application:punteggio_scritto") String punteggio_scritto,
                                   @FormParam("jconon_application:punteggio_secondo_scritto") String punteggio_secondo_scritto,
                                   @FormParam("jconon_application:punteggio_colloquio") String punteggio_colloquio,
                                   @FormParam("jconon_application:punteggio_prova_pratica") String punteggio_prova_pratica,
                                   @FormParam("jconon_application:punteggio_6") String punteggio_6,
                                   @FormParam("jconon_application:punteggio_7") String punteggio_7,
                                   @FormParam("jconon_application:graduatoria") String graduatoria,
                                   @FormParam("jconon_application:esito_call") String esitoCall,
                                   @FormParam("jconon_application:punteggio_note") String punteggioNote,
                                   @FormParam("callId") String callId,
                                   @FormParam("applicationId") String applicationId) {
        ResponseBuilder rb;
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        String message = applicationService.punteggi(
                cmisSession, getUserId(request), callId, applicationId,
                Utility.FORMATBigDecimal(punteggio_titoli),
                Utility.FORMATBigDecimal(punteggio_scritto),
                Utility.FORMATBigDecimal(punteggio_secondo_scritto),
                Utility.FORMATBigDecimal(punteggio_colloquio),
                Utility.FORMATBigDecimal(punteggio_prova_pratica),
                Utility.FORMATBigDecimal(punteggio_6),
                Utility.FORMATBigDecimal(punteggio_7),
                Utility.FORMATBigDecimal(graduatoria),
                esitoCall,
                punteggioNote
        );
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("message", message);
        rb = Response.ok(model);
        return rb.build();
    }

    @POST
    @Path("punteggi")
    public Response updatePunteggi(@Context HttpServletRequest request, @FormParam("callId") String callId, @FormParam("json") String jsonArray) {
        LOGGER.trace(jsonArray);
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        final JSONArray array = Optional.ofNullable(jsonArray)
                .filter(s -> !s.equals("null"))
                .map(s -> new JSONArray(s))
                .orElseThrow(() -> new ClientMessageException("Errore di formattazione per " + jsonArray));
        int modified = 0;
        for (int i = 0; i < array.length(); i++) {
            try {
                final JSONObject jsonObject = Optional.ofNullable(array.get(i))
                        .filter(JSONObject.class::isInstance)
                        .map(JSONObject.class::cast)
                        .orElseThrow(() -> new ClientMessageException("Errore di formattazione per " + jsonArray));
                if (Optional.ofNullable(cmisSession.getObject(jsonObject.getString(PropertyIds.OBJECT_ID)))
                        .filter(cmisObject ->
                                !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_TITOLI))
                                        , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_TITOLI))) ||
                                        !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_SCRITTO))
                                                , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_SCRITTO))) ||
                                        !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO))
                                                , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO))) ||
                                        !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO))
                                                , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO))) ||
                                        !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA))
                                                , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA))) ||
                                        !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_6))
                                                , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_6))) ||
                                        !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_7))
                                                , Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_7))) ||
                                        !Utility.OBJEquals(cmisObject.getPropertyValue(JCONONPropertyIds.APPLICATION_GRADUATORIA.value())
                                                , Utility.FORMATBigInteger(jsonObject.optString(JCONONPropertyIds.APPLICATION_GRADUATORIA.value()))) ||
                                        !Utility.OBJEquals(cmisObject.getPropertyValue(JCONONPropertyIds.APPLICATION_ESITO_CALL.value())
                                                , jsonObject.optString(JCONONPropertyIds.APPLICATION_ESITO_CALL.value())) ||
                                        !Utility.OBJEquals(cmisObject.getPropertyValue("jconon_application:punteggio_note")
                                                , jsonObject.optString("jconon_application:punteggio_note"))
                        ).isPresent()) {
                    modified++;
                    applicationService.punteggi(
                            cmisSession,
                            getUserId(request),
                            callId,
                            jsonObject.getString(PropertyIds.OBJECT_ID),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_TITOLI)),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_SCRITTO)),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO)),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO)),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA)),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_6)),
                            Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_7)),
                            Utility.FORMATBigDecimal(jsonObject.optString(JCONONPropertyIds.APPLICATION_GRADUATORIA.value())),
                            jsonObject.optString(JCONONPropertyIds.APPLICATION_ESITO_CALL.value()),
                            jsonObject.optString("jconon_application:punteggio_note")
                    );
                }
            } catch (ClientMessageException e) {
                return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
            }
        }
        return Response.ok(Collections.singletonMap("righe", modified)).build();
    }

    @POST
    @Path("main")
    public Response saveApplication(@Context HttpServletRequest request, MultivaluedMap<String, String> formParams) {
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        String userId = getUserId(request);
        try {
            Map<String, String[]> formParamz = new HashMap<String, String[]>();
            formParamz.putAll(request.getParameterMap());
            if (formParams != null && !formParams.isEmpty())
                formParamz.putAll(RequestUtils.extractFormParams(formParams));

            Map<String, Object> properties = nodeMetadataService
                    .populateMetadataType(cmisSession, formParamz, request);
            Map<String, String[]> aspectParams = applicationService.getAspectParams(cmisSession, formParamz);
            Map<String, Object> aspectProperties = nodeMetadataService
                    .populateMetadataAspectFromRequest(cmisSession, aspectParams, request);

            return Response.ok(CMISUtil.convertToProperties(
                    applicationService.save(cmisSession, Utility.getContextURL(request), request.getLocale(), userId, properties, aspectProperties)
            )).build();
        } catch (ClientMessageException e) {
            LOGGER.warn("Save Application for user: {}", userId, e);
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        } catch (ParseException e) {
            LOGGER.error(e.getMessage(), e);
            return Response.status(Status.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GET
    @Path("main")
    public Response loadApplication(@Context HttpServletRequest request,
                                    @QueryParam("callId") String callId, @QueryParam("applicationId") String applicationId,
                                    @QueryParam("userId") String userId, @QueryParam("preview") boolean preview) {
        try {
            return Response.ok(CMISUtil.convertToProperties(
                    applicationService.load(cmisService.getCurrentCMISSession(request),
                            callId, applicationId, userId, preview, Utility.getContextURL(request), request.getLocale())
            )).build();
        } catch (ClientMessageException e) {
            LOGGER.warn("load application {} {} error: {}", applicationId, callId, e.getMessage());
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        } catch (RedirectionException e) {
            return Response.status(Status.SEE_OTHER).entity(Collections.singletonMap("location", e.getLocation())).build();
        }
    }

    @DELETE
    @Path("main")
    public Response deleteApplication(@Context HttpServletRequest request, @QueryParam("cmis:objectId") String objectId) {
        try {
            Session cmisSession = cmisService.getCurrentCMISSession(request);
            applicationService.delete(cmisSession,
                    Utility.getContextURL(request), objectId);
            return Response.ok().build();
        } catch (ClientMessageException e) {
            LOGGER.error("delete application {} error", objectId, e);
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
    }

    @POST
    @Path("validate-attachments")
    public Response validateAttachments(
            @Context HttpServletRequest request,
            @FormParam("callId") String callId,
            @FormParam("applicationId") String applicationId,
            @CookieParam("__lang") String __lang) {
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        try {
            applicationService.validateAllegatiLinked(
                    Optional.ofNullable(callId)
                            .map(s -> cmisSession.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Bando non trovato!")),
                    Optional.ofNullable(applicationId)
                            .map(s -> cmisSession.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Domanda non trovata!")),
                    cmisSession,
                    I18nService.getLocale(request, __lang)
            );
        } catch (ClientMessageException e) {
            return Response.status(Status.BAD_REQUEST).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("add-contributor/product-after-commission")
    public Response addContributorForProductAfterCommission(@Context HttpServletRequest request, @FormParam("callId") String callId,
                                   @FormParam("applicationId") String applicationId, @CookieParam("__lang") String __lang) {
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        try {
            applicationService.addContributorForProductAfterCommission(
                    Optional.ofNullable(callId)
                            .map(s -> cmisSession.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Bando non trovato!")),
                    Optional.ofNullable(applicationId)
                            .map(s -> cmisSession.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Domanda non trovata!")),
                    cmisSession, cmisService.getCMISUserFromSession(request), I18nService.getLocale(request, __lang)
            );
        } catch (ClientMessageException e) {
            return Response.status(Status.BAD_REQUEST).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("remove-contributor/product-after-commission")
    public Response removeContributorForProductAfterCommission(@Context HttpServletRequest request, @FormParam("callId") String callId,
                                                            @FormParam("applicationId") String applicationId, @CookieParam("__lang") String __lang) {
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        try {
            applicationService.removeContributorForProductAfterCommission(
                    Optional.ofNullable(callId)
                            .map(s -> cmisSession.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Bando non trovato!")),
                    Optional.ofNullable(applicationId)
                            .map(s -> cmisSession.getObject(s))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .orElseThrow(() -> new ClientMessageException("Domanda non trovata!")),
                    cmisSession, cmisService.getCMISUserFromSession(request), I18nService.getLocale(request, __lang)
            );
        } catch (ClientMessageException e) {
            return Response.status(Status.BAD_REQUEST).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
        return Response.ok().build();
    }

    private String getUserId(HttpServletRequest request) {
        return cmisService.getCMISUserFromSession(request).getId();
    }
}
