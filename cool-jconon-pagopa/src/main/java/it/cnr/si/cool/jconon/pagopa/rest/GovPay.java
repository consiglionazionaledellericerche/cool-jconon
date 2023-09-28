/*
 * Copyright (C) 2023 Consiglio Nazionale delle Ricerche
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
package it.cnr.si.cool.jconon.pagopa.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.si.cool.jconon.pagopa.model.pagamento.NotificaPagamento;
import it.cnr.si.cool.jconon.pagopa.service.PAGOPAService;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Optional;

@Path("govpay")
@SecurityChecked(checkrbac=false)
public class GovPay {
    private static final Logger LOGGER = LoggerFactory.getLogger(GovPay.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private PAGOPAService pagopaService;

    @POST
    @Path("pagamenti/{idDominio}/{iuv}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response pagamenti(
            @Context HttpServletRequest request,
            @PathParam("idDominio") String idDominio,
            @PathParam("iuv") String iuv,
            String payload) throws Exception {
        NotificaPagamento pagamento = null;
        Optional.ofNullable(iuv).orElseThrow(() -> new RuntimeException("Errore, indicare il codice iuv."));
        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            pagamento = mapper.readValue(payload, NotificaPagamento.class);
            LOGGER.info("Caricato Pagamento con iuv: {}", iuv);
        } catch (Exception ex) {
            LOGGER.error("Errore durante l'elaborazione della notifica di pagamento Iuv: {}", iuv);
            throw new RuntimeException("PagoPA: Errore durante l'elaborazione della notifica di pagamento. Iuv: " + iuv);
        }
        final Session currentCMISSession = cmisService.getCurrentCMISSession(request);
        pagopaService.notificaPagamento(currentCMISSession, pagamento, iuv);
        return Response.status(Response.Status.OK).entity(pagamento).build();
    }

    @PUT
    @Path("pagamenti/ricevute/{idDominio}/{iuv}/{ccp}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response pagamentiRicevute(
            @Context HttpServletRequest request,
            @PathParam("idDominio") String idDominio,
            @PathParam("iuv") String iuv,
            @PathParam("ccp") String ccp) throws Exception {
        Optional.ofNullable(iuv).orElseThrow(() -> new RuntimeException("Errore, indicare il codice iuv."));
        final Session currentCMISSession = cmisService.getCurrentCMISSession(request);
        try {
            pagopaService.notificaPagamento(currentCMISSession, ccp, iuv);
        } catch (NotFoundException _ex) {
            LOGGER.warn(_ex.getMessage());
            return Response.status(Response.Status.NOT_FOUND).entity(ccp).build();
        }
        return Response.status(Response.Status.OK).entity(ccp).build();
    }


}
