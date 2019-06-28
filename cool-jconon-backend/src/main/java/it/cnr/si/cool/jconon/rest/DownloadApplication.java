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
import it.cnr.cool.rest.Page;
import it.cnr.cool.security.SecurityChecked;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.Pair;
import it.cnr.si.cool.jconon.service.PrintService;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Created by mspasiano on 6/13/17.
 */
@Path("application")
@Component
@SecurityChecked(needExistingSession=false, checkrbac=false)
public class DownloadApplication {
    private static final Logger LOGGER = LoggerFactory.getLogger(DownloadApplication.class);
    @Autowired
    private PrintService printService;
    @Autowired
    private CMISService cmisService;

    @GET
    @Path("print-download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response printDownload(@Context HttpServletRequest req, @Context HttpServletResponse res,
                                  @QueryParam("nodeRef") String nodeRef, @CookieParam("__lang") String __lang){
        LOGGER.debug("Download Print for application:" + nodeRef);
        String redirect = "/" + Page.LOGIN_URL;
        redirect = redirect.concat("?redirect=rest/application/print-download");
        if (nodeRef != null && !nodeRef.isEmpty())
            redirect = redirect.concat("&nodeRef="+nodeRef);
        URI redirectURI = null;
        Session cmisSession = cmisService.getCurrentCMISSession(req);
        try {
            redirectURI = new URI(getUrl(req) + redirect);
            Pair<String, byte[]> printApplication = printService.downloadPrintApplication(
                    cmisService.getCurrentCMISSession(req),
                    nodeRef,
                    getContextURL(req),
                    I18nService.getLocale(req, __lang));
            StreamingOutput fileStream =  new StreamingOutput() {
                @Override
                public void write(java.io.OutputStream output) throws IOException{
                    output.write(printApplication.getSecond());
                    output.flush();
                }
            };
            return Response
                    .ok(fileStream, MimeTypes.PDF.mimetype())
                    .header("content-disposition","attachment; filename = " + printApplication.getFirst())
                    .build();
        } catch(CmisUnauthorizedException e) {
            LOGGER.debug("unauthorized to get " + nodeRef, e);
                       return Response.seeOther(redirectURI).build();
        } catch (URISyntaxException e) {
            // very frequent errors of type java.net.SocketException: Pipe rotta
            LOGGER.warn("unable to send content {}", nodeRef, e);
            res.setStatus(HttpStatus.SC_INTERNAL_SERVER_ERROR);
        }
        return Response.ok().build();
    }

    public String getContextURL(HttpServletRequest req)
    {
        return req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + req.getContextPath();
    }

    static String getUrl(HttpServletRequest req) {
        StringBuffer url = req.getRequestURL();
        int l = url.indexOf(req.getServletPath());
        return url.substring(0, l);
    }
}
