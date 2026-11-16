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

package it.cnr.si.cool.jconon.rest.openapi.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.NullNode;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.util.MimeTypes;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Invoca i webscript Alfresco (service/...) con la BindingSession dell'utente corrente.
 * I controlli di autorizzazione definiti sui webscript (es. authentication admin) restano quindi validi.
 * Sostituisce, per i controller OpenAPI, il passaggio da /rest/proxy usato dal vecchio frontend.
 */
@Component
public class AlfrescoWebScriptClient {
    private static final Logger LOGGER = LoggerFactory.getLogger(AlfrescoWebScriptClient.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Autowired
    private CMISService cmisService;

    public JsonNode get(BindingSession session, String service, Map<String, List<String>> params) {
        final UrlBuilder url = url(service, params);
        return handle(CmisBindingsHelper.getHttpInvoker(session).invokeGET(url, session), url);
    }

    public JsonNode post(BindingSession session, String service, Object body) {
        final UrlBuilder url = url(service, Collections.emptyMap());
        final byte[] content = toBytes(body);
        return handle(CmisBindingsHelper.getHttpInvoker(session).invokePOST(url, MimeTypes.JSON.mimetype(),
                out -> out.write(content), session), url);
    }

    public JsonNode put(BindingSession session, String service, Object body) {
        final UrlBuilder url = url(service, Collections.emptyMap());
        final byte[] content = toBytes(body);
        return handle(CmisBindingsHelper.getHttpInvoker(session).invokePUT(url, MimeTypes.JSON.mimetype(),
                Collections.emptyMap(), out -> out.write(content), session), url);
    }

    public JsonNode delete(BindingSession session, String service, Map<String, List<String>> params) {
        final UrlBuilder url = url(service, params);
        return handle(CmisBindingsHelper.getHttpInvoker(session).invokeDELETE(url, session), url);
    }

    private UrlBuilder url(String service, Map<String, List<String>> params) {
        final UrlBuilder url = new UrlBuilder(cmisService.getBaseURL().concat("service/").concat(service));
        params.forEach((key, values) -> Optional.ofNullable(values)
                .ifPresent(list -> list.stream()
                        .filter(value -> value != null && !value.isEmpty())
                        .forEach(value -> url.addParameter(key, value))));
        return url;
    }

    private byte[] toBytes(Object body) {
        try {
            return MAPPER.writeValueAsBytes(body);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request body", e);
        }
    }

    private JsonNode handle(Response response, UrlBuilder url) {
        final int status = response.getResponseCode();
        if (status == HttpStatus.UNAUTHORIZED.value() || status == HttpStatus.FORBIDDEN.value()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        if (status == HttpStatus.NOT_FOUND.value()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, response.getErrorContent());
        }
        if (status >= 400) {
            LOGGER.error("Alfresco webscript {} returned {}: {}", url, status, response.getErrorContent());
            throw new ResponseStatusException(HttpStatus.valueOf(status), response.getErrorContent());
        }
        try (InputStream stream = response.getStream()) {
            if (stream == null) {
                return NullNode.getInstance();
            }
            return MAPPER.readTree(stream);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Invalid response from " + url, e);
        }
    }
}
