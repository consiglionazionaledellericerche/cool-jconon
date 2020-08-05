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

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.AddressType;
import it.cnr.si.cool.jconon.util.DateUtils;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.util.*;

@Path("call")
@Component
@SecurityChecked(needExistingSession = true, checkrbac = false)
public class Call {
    private static final Logger LOGGER = LoggerFactory.getLogger(Call.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private UserService userService;

    //replace caratteri che non possono comparire nel nome del file in windows
    public static String refactoringFileName(String fileName, String newString) {
        return fileName.replaceAll("[“”\"\\/:*<>| ’']", newString).replace("\\", newString);
    }

    @GET
    @Path("download-xls")
    @Produces("application/vnd.ms-excel")
    public Response downloadFile(@Context HttpServletRequest req, @QueryParam("objectId") String objectId, @QueryParam("fileName") String fileName) throws IOException {
        LOGGER.debug("Download excel file with objectId:" + objectId);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Document doc = (Document) session.getObject(objectId);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            IOUtils.copy(doc.getContentStream().getStream(), out);
            rb = Response.ok(out.toByteArray());
            rb.header("Content-Disposition",
                    "attachment; filename=\"" + fileName.concat(".xls\""));
            doc.delete();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("applications.xls")
    @Produces(MediaType.APPLICATION_JSON)
    public Response extractionApplication(@Context HttpServletRequest req, @QueryParam("urlparams") String query,
                                          @QueryParam("type") String type, @QueryParam("queryType") String queryType,
                                          @QueryParam("fileName") String fileName) throws IOException {
        LOGGER.debug("Extraction application from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Map<String, Object> model = callService.extractionApplication(session, query, type, queryType, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
            Optional.ofNullable(model)
                    .filter(stringObjectMap -> !stringObjectMap.isEmpty())
                    .ifPresent(stringObjectMap -> stringObjectMap.put("fileName", refactoringFileName(fileName, "")));
            rb = Response.ok(model);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("applications-convocazioni.xls")
    @Produces(MediaType.APPLICATION_JSON)
    public Response extractionApplicationFromConvocazioni(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException {
        LOGGER.debug("Extraction application from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Map<String, Object> model = callService.extractionApplicationFromConvocazioni(session, query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
            model.put("fileName", "domande-convocazioni");
            rb = Response.ok(model);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("applications-single-call.xls")
    @Produces(MediaType.APPLICATION_JSON)
    public Response extractionApplicationForSingleCall(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException {
        LOGGER.debug("Extraction application from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Map<String, Object> model = callService.extractionApplicationForSingleCall(session, query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
            String fileName = "domande";
            if (model.containsKey("nameBando")) {
                fileName = ((String) model.get("nameBando"));
                fileName = refactoringFileName(fileName, "");
            }
            model.put("fileName", fileName);
            rb = Response.ok(model);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("applications-punteggi.xls")
    @Produces(MediaType.APPLICATION_JSON)
    public Response extractionApplicationForPunteggi(@Context HttpServletRequest req, @QueryParam("callId") String callId) throws IOException {
        LOGGER.debug("Extraction application from call: {}", callId);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Map<String, Object> model = callService.extractionApplicationForPunteggi(session, callId, getContextURL(req), cmisService.getCMISUserFromSession(req).getId());
            String fileName = "domande";
            if (model.containsKey("nameBando")) {
                fileName = ((String) model.get("nameBando"));
                fileName = refactoringFileName(fileName, "");
            }
            model.put("fileName", fileName);
            rb = Response.ok(model);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("applications-punteggi.xls")
    @Produces(MediaType.APPLICATION_JSON)
    public Response importApplicationForPunteggi(@Context HttpServletRequest req) throws IOException {
        Session session = cmisService.getCurrentCMISSession(req);
        Map<String, Object> model = callService.importApplicationForPunteggi(session, req, cmisService.getCMISUserFromSession(req));
        return Response.ok(model).build();
    }

    @POST
    @Path("convocazioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response convocazioni(@Context HttpServletRequest request, @CookieParam("__lang") String lang,
                                 @FormParam("callId") String callId, @FormParam("tipoSelezione") String tipoSelezione, @FormParam("testoLibero") Boolean testoLibero, @FormParam("luogo") String luogo, @FormParam("data") String data,
                                 @FormParam("note") String note, @FormParam("firma") String firma, @FormParam("numeroConvocazione") String numeroConvocazione, @FormParam("application") List<String> applicationsId) throws IOException {
        ResponseBuilder rb;
        try {
            Session session = cmisService.getCurrentCMISSession(request);
            Long numConvocazioni = callService.convocazioni(session, cmisService.getCurrentBindingSession(request),
                    getContextURL(request), I18nService.getLocale(request, lang), cmisService.getCMISUserFromSession(request).getId(),
                    callId, tipoSelezione, luogo,
                    Optional.ofNullable(data)
                            .filter(s -> s.length() > 0)
                            .map(s -> {
                                try {
                                    return DateUtils.parse(s);
                                } catch (ParseException e) {
                                    return null;
                                }
                            })
                            .orElse(null),
                    testoLibero, note, firma,
                    Optional.ofNullable(numeroConvocazione).map(map -> Integer.valueOf(map)).orElse(1), applicationsId);
            rb = Response.ok(Collections.singletonMap("numConvocazioni", numConvocazioni));
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("esclusioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response esclusioni(@Context HttpServletRequest request, @CookieParam("__lang") String lang,
                               @FormParam("callId") String callId, @FormParam("note") String note, @FormParam("firma") String firma, @FormParam("query") String query,
                               @FormParam("stampaPunteggi") boolean stampaPunteggi, @FormParam("application") List<String> applicationsId) throws IOException {
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(request);
        Long numEsclusioni = callService.esclusioni(session, cmisService.getCurrentBindingSession(request),
                getContextURL(request), I18nService.getLocale(request, lang), cmisService.getCMISUserFromSession(request).getId(),
                callId, note, firma, applicationsId, query, stampaPunteggi);
        return Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni)).build();
    }

    @POST
    @Path("esclusioni-firmate")
    @Produces(MediaType.APPLICATION_JSON)
    public Response esclusioniFirmate(@Context HttpServletRequest req) throws IOException {
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numEsclusioni = callService.importEsclusioniFirmate(session, req, cmisService.getCMISUserFromSession(req));
            rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
        } catch (ParseException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("comunicazioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response comunicazioni(@Context HttpServletRequest request, @CookieParam("__lang") String lang,
                                  @FormParam("callId") String callId, @FormParam("note") String note, @FormParam("firma") String firma,
                                  @FormParam("filters-provvisorie_inviate") String filtersProvvisorieInviate,
								  @FormParam("totalepunteggioda") Integer totalepunteggioda,
								  @FormParam("totalepunteggioa") Integer totalepunteggioa,
								  @FormParam("application") List<String> applicationsId) throws IOException {
        ResponseBuilder rb;
        try {
            Session session = cmisService.getCurrentCMISSession(request);
            Long numComunicazioni = callService.comunicazioni(session, cmisService.getCurrentBindingSession(request),
                    getContextURL(request), I18nService.getLocale(request, lang), cmisService.getCMISUserFromSession(request).getId(),
                    callId, note, firma, applicationsId, filtersProvvisorieInviate, totalepunteggioda, totalepunteggioa);
            rb = Response.ok(Collections.singletonMap("numComunicazioni", numComunicazioni));
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("elimina-allegati")
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminaAllegatiGeneratiSullaDomanda(@Context HttpServletRequest req, @FormParam("q") String query) throws IOException {
        LOGGER.debug("Elimina allegati from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numAllegati = callService.eliminaAllegatiGeneratiSullaDomanda(session, query, cmisService.getCMISUserFromSession(req).getId());
            rb = Response.ok(Collections.singletonMap("numAllegati", numAllegati));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }


    @POST
    @Path("firma-convocazioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response firmaConvocazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("userName") String userName,
                                      @FormParam("password") String password, @FormParam("otp") String otp, @FormParam("firma") String firma) throws IOException {
        LOGGER.debug("Firma convocazioni from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numConvocazioni = callService.firma(session, cmisService.getCurrentBindingSession(req), query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
                    userName, password, otp, firma, "jconon_convocazione:stato", "Convocazione del candidato");
            rb = Response.ok(Collections.singletonMap("numConvocazioni", numConvocazioni));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("invia-convocazioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inviaConvocazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("callId") String callId,
                                      @FormParam("userNamePEC") String userName, @FormParam("passwordPEC") String password, @FormParam("addressFromApplication") AddressType addressFromApplication) throws IOException {
        LOGGER.debug("Invia convocazioni from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numConvocazioni = callService.inviaConvocazioni(session, cmisService.getCurrentBindingSession(req), query, getContextURL(req),
                    cmisService.getCMISUserFromSession(req).getId(),
                    callId, userName, password, addressFromApplication);
            rb = Response.ok(Collections.singletonMap("numConvocazioni", numConvocazioni));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("firma-esclusioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response firmaEsclusioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("userName") String userName,
                                    @FormParam("password") String password, @FormParam("otp") String otp, @FormParam("firma") String firma) throws IOException {
        LOGGER.debug("Firma convocazioni from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numEsclusioni = callService.firma(session, cmisService.getAdminSession(), query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
                    userName, password, otp, firma, "jconon_esclusione:stato", "Esclusione del candidato");
            rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("invia-esclusioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inviaEsclusioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("callId") String callId,
                                    @FormParam("userNamePEC") String userName, @FormParam("passwordPEC") String password, @FormParam("addressFromApplication") AddressType addressFromApplication) throws IOException {
        LOGGER.debug("Invia convocazioni from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numEsclusioni = callService.inviaEsclusioni(session, cmisService.getCurrentBindingSession(req), query,
                    getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
                    callId, userName, password, addressFromApplication);
            rb = Response.ok(Collections.singletonMap("numEsclusioni", numEsclusioni));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("firma-comunicazioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response firmaComunicazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("userName") String userName,
                                       @FormParam("password") String password, @FormParam("otp") String otp, @FormParam("firma") String firma) throws IOException {
        LOGGER.debug("Firma convocazioni from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numComunicazioni = callService.firma(session, cmisService.getCurrentBindingSession(req), query, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
                    userName, password, otp, firma, "jconon_comunicazione:stato", "Comunicazione al candidato");
            rb = Response.ok(Collections.singletonMap("numComunicazioni", numComunicazioni));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("invia-allegato")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inviaAllegato(@Context HttpServletRequest req, @FormParam("objectId") String objectId, @FormParam("callId") String callId,
                                  @FormParam("userNamePEC") String userName, @FormParam("passwordPEC") String password) throws IOException {
        LOGGER.debug("Invia allegato al bando {}", objectId);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            List<String> result = callService.inviaAllegato(session, cmisService.getCurrentBindingSession(req), objectId, getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
                    callId, userName, password);
            rb = Response.ok(result);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @POST
    @Path("invia-comunicazioni")
    @Produces(MediaType.APPLICATION_JSON)
    public Response inviaComunicazioni(@Context HttpServletRequest req, @FormParam("query") String query, @FormParam("callId") String callId,
                                       @FormParam("userNamePEC") String userName,
                                       @FormParam("passwordPEC") String password,
                                       @FormParam("addressFromApplication") AddressType addressFromApplication) throws IOException {
        LOGGER.debug("Invia convocazioni from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        try {
            Long numComunicazioni = callService.inviaComunicazioni(session, cmisService.getCurrentBindingSession(req), query,
                    getContextURL(req), cmisService.getCMISUserFromSession(req).getId(),
                    callId, userName, password, addressFromApplication);
            rb = Response.ok(Collections.singletonMap("numComunicazioni", numComunicazioni));
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("protocol")
    @Produces(MediaType.APPLICATION_JSON)
    public Response protocol(@Context HttpServletRequest req, @QueryParam("q") String query) throws IOException {
        LOGGER.debug("Protocol application from query:" + query);
        ResponseBuilder rb;
        Session session = cmisService.getCurrentCMISSession(req);
        String userId = cmisService.getCMISUserFromSession(req).getId();
        try {
            callService.protocolApplication(session, query, userId);
            rb = Response.ok();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR);
        }
        return rb.build();
    }

    @GET
    @Path("graduatoria")
    @Produces(MediaType.APPLICATION_JSON)
    public Response graduatoria(@Context HttpServletRequest req, @QueryParam("id") String id) throws IOException {
        ResponseBuilder rb;
        try {
            LOGGER.debug("Graduatoria:" + id);
            callService.graduatoria(cmisService.getCurrentCMISSession(req),
                    id, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req));
            Map<String, Object> model = new HashMap<String, Object>();
            model.put("status", true);
            rb = Response.ok(model);
        } catch (ClientMessageException e) {
            LOGGER.error("Graduatoria id {}", id, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        }
        return rb.build();
    }

    @POST
    @Path("aggiorna-protocollo-domande")
    @Produces(MediaType.APPLICATION_JSON)
    public Response aggiornaProtocolloDomande(@Context HttpServletRequest req, @FormParam("id") String id) throws IOException {
        LOGGER.debug("Aggiorna protocollo su domande per il Bando: {}", id);
        try {
            return Response.ok(
                    callService.aggiornaProtocolloDomande(cmisService.getCurrentCMISSession(req),
                            id, req.getLocale(), getContextURL(req), cmisService.getCMISUserFromSession(req))
            ).build();
        } catch (ClientMessageException e) {
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage())).build();
        }
    }

    @GET
    @Path("print-curriculum-strutturato")
    @Produces(MediaType.APPLICATION_JSON)
    public Response printCurriculumStrutturato(@Context HttpServletRequest req, @QueryParam("id") String id) throws IOException {
        ResponseBuilder rb;
        try {
            LOGGER.debug("Print Curriculum Strutturato: {}", id);
            callService.printCurriculumStrutturato(cmisService.getCurrentCMISSession(req),
                    id, req.getLocale(), getContextURL(req));
            Map<String, Object> model = new HashMap<String, Object>();
            model.put("status", true);
            rb = Response.ok(model);
        } catch (ClientMessageException e) {
            LOGGER.error("Graduatoria id {}", id, e);
            rb = Response.status(Status.INTERNAL_SERVER_ERROR).entity(Collections.singletonMap("message", e.getMessage()));
        }
        return rb.build();
    }

    public String getContextURL(HttpServletRequest req) {
        return req.getScheme() + "://" + req.getServerName() + ":"
                + req.getServerPort() + req.getContextPath();
    }

}