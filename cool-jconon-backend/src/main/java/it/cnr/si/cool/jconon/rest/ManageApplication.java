package it.cnr.si.cool.jconon.rest;

import freemarker.template.TemplateException;
import it.cnr.cool.cmis.model.PolicyType;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.util.CalendarUtil;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.mock.ISO8601DateFormatMethod;
import it.cnr.mock.JSONUtils;
import it.cnr.mock.RequestUtils;
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
import java.io.IOException;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.*;

@Path("manage-application")
@Component
@Produces(MediaType.APPLICATION_JSON)
@SecurityChecked(needExistingSession = true, checkrbac = false)
public class ManageApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(ManageApplication.class);
    private static final String FTL_JSON_PATH = "/surf/webscripts/search/cmisObject.get.json.ftl";

    @Autowired
    private ApplicationService applicationService;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private NodeMetadataService nodeMetadataService;

    private static String processTemplate(Map<String, Object> model, String path)
            throws TemplateException, IOException {

        model.put("xmldate", new ISO8601DateFormatMethod());
        model.put("jsonUtils", new JSONUtils());
        model.put("calendarUtil", new CalendarUtil());

        String json = Util.processTemplate(model, path);
        LOGGER.debug(json);
        return json;

    }

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
        String userId = getUserId(request);
        ResponseBuilder rb;
        applicationService.reopenApplication(cmisService.getCurrentCMISSession(request),
                applicationSourceId, getContextURL(request), request.getLocale(), userId);
        rb = Response.ok("");
        return rb.build();
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

            LOGGER.info(userId);
            Map<String, Object> properties = nodeMetadataService
                    .populateMetadataType(cmisSession, formParamz, request);
            Map<String, String[]> aspectParams = applicationService.getAspectParams(cmisSession, formParamz);
            Map<String, Object> aspectProperties = nodeMetadataService
                    .populateMetadataAspectFromRequest(cmisSession, aspectParams, request);
            applicationService.save(cmisSession, getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
            Map<String, String> model = applicationService.sendApplication(cmisService.getCurrentCMISSession(request),
                    (String) properties.get(PropertyIds.OBJECT_ID), getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
            rb = Response.ok(model);
        } catch (ClientMessageException e) {
            LOGGER.error("send error", e);
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

            application = applicationService.save(cmisSession, getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
            Map<String, Object> model = new HashMap<String, Object>();
            model.put("cmisObject", application);
            model.put("args", new Object());
            rb = Response.ok(processTemplate(model, FTL_JSON_PATH));
        } catch (ClientMessageException e) {
            LOGGER.warn("Save Application for user: {}", userId, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        } catch (TemplateException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
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
        LOGGER.warn(jsonArray);
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        final JSONArray array = Optional.ofNullable(jsonArray)
                .filter(s -> !s.equals("null"))
                .map(s -> new JSONArray(s))
                .orElseThrow(() -> new ClientMessageException("Errore di formattazione per " + jsonArray));
        int modified = 0;
        for (int i = 0; i < array.length(); i++) {
            final JSONObject jsonObject = Optional.ofNullable(array.get(i))
                    .filter(JSONObject.class::isInstance)
                    .map(JSONObject.class::cast)
                    .orElseThrow(() -> new ClientMessageException("Errore di formattazione per " + jsonArray));
            if (Optional.ofNullable(cmisSession.getObject(jsonObject.getString(PropertyIds.OBJECT_ID)))
                    .filter(cmisObject ->
                            !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_TITOLI))
                                    ,Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_TITOLI))) ||
                            !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_SCRITTO))
                                    ,Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_SCRITTO))) ||
                            !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO))
                                    ,Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_SECONDO_SCRITTO))) ||
                            !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO))
                                    ,Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_COLLOQUIO))) ||
                            !Utility.OBJEquals(Utility.FORMATBigDecimal(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA))
                                    ,Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_PUNTEGGIO_PROVA_PRATICA))) ||
                            !Utility.OBJEquals(cmisObject.getPropertyValue(PrintService.JCONON_APPLICATION_GRADUATORIA)
                                    ,Utility.FORMATBigInteger(jsonObject.optString(PrintService.JCONON_APPLICATION_GRADUATORIA))) ||
                            !Utility.OBJEquals(cmisObject.getPropertyValue("jconon_application:esito_call")
                                    ,jsonObject.optString("jconon_application:esito_call")) ||
                            !Utility.OBJEquals(cmisObject.getPropertyValue("jconon_application:punteggio_note")
                                    ,jsonObject.optString("jconon_application:punteggio_note"))
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
                        Utility.FORMATBigDecimal(jsonObject.optString(PrintService.JCONON_APPLICATION_GRADUATORIA)),
                        jsonObject.optString("jconon_application:esito_call"),
                        jsonObject.optString("jconon_application:punteggio_note")
                );
            }
        }
        return Response.ok(Collections.singletonMap("righe", modified)).build();
    }

    @POST
    @Path("main")
    public Response saveApplication(@Context HttpServletRequest request, MultivaluedMap<String, String> formParams) {
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
            Map<String, String[]> aspectParams = applicationService.getAspectParams(cmisSession, formParamz);
            Map<String, Object> aspectProperties = nodeMetadataService
                    .populateMetadataAspectFromRequest(cmisSession, aspectParams, request);

            Folder application = applicationService.save(cmisSession, getContextURL(request), request.getLocale(), userId, properties, aspectProperties);
            Map<String, Object> model = new HashMap<String, Object>();
            model.put("cmisObject", application);
            model.put("args", new Object());
            rb = Response.ok(processTemplate(model, FTL_JSON_PATH));
        } catch (ClientMessageException e) {
            LOGGER.warn("Save Application for user: {}", userId, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        } catch (TemplateException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        } catch (ParseException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("main")
    public Response loadApplication(@Context HttpServletRequest request,
                                    @QueryParam("callId") String callId, @QueryParam("applicationId") String applicationId, @QueryParam("userId") String userId, @QueryParam("preview") boolean preview) {
        ResponseBuilder rb;
        Map<String, Object> model = new HashMap<String, Object>();
        try {
            Folder application = applicationService.load(cmisService.getCurrentCMISSession(request),
                    callId, applicationId, userId, preview, getContextURL(request), request.getLocale());
            model.put("cmisObject", application);
            model.put("args", new Object());

            rb = Response.ok(processTemplate(model, FTL_JSON_PATH));
        } catch (ClientMessageException e) {
            LOGGER.warn("load application {} {} error: {}", applicationId, callId, e.getMessage(), e);
            model.put("message", e.getMessage());
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(model);
        } catch (TemplateException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @DELETE
    @Path("main")
    public Response deleteApplication(@Context HttpServletRequest request, @QueryParam("cmis:objectId") String objectId) {
        ResponseBuilder rb;
        try {
            Session cmisSession = cmisService.getCurrentCMISSession(request);
            applicationService.delete(cmisSession,
                    getContextURL(request), objectId);
            rb = Response.ok();
        } catch (ClientMessageException e) {
            LOGGER.error("delete application {} error", objectId, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        }
        return rb.build();
    }

    public String getContextURL(HttpServletRequest req) {
        return req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort() + req.getContextPath();
    }

    private String getUserId(HttpServletRequest request) {
        return cmisService.getCMISUserFromSession(request).getId();
    }
}