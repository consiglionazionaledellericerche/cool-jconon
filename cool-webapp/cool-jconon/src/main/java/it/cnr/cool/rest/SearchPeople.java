package it.cnr.cool.rest;

import freemarker.template.TemplateException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.QueryService;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.exceptions.CmisPermissionDeniedException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.NotAuthorizedException;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.CacheControl;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;
import javax.ws.rs.core.Response.Status;
import javax.xml.bind.DatatypeConverter;
import java.io.IOException;
import java.util.Map;

@Path("search-people")
@Component
public class SearchPeople {

	private static final Logger LOGGER = LoggerFactory.getLogger(SearchPeople.class);

    @Autowired
	private QueryService queryService;

    @Autowired
    private CMISService cmisService;

	@GET
	@Produces(MediaType.APPLICATION_JSON)
	public Response query(@Context HttpServletRequest request) {

        String authorization = request.getHeader("Authorization");
        Credentials credentials = extractCredentials(authorization);
        Session cmisSession = null;

        if (credentials == null) {
            LOGGER.info("non sono state fornite credenziali");
            throw new NotAuthorizedException("non autorizzato");
        } else {

            try {
                cmisSession = cmisService.getRepositorySession(credentials.getUsername(), credentials.getPassword());
            } catch (CmisPermissionDeniedException e) {
                LOGGER.info("credenziali non valide", e);
                throw new NotAuthorizedException("non autorizzato", e);
            }
        }

		ResponseBuilder rb;


        Map<String, Object> model = queryService.query(request, cmisSession);
		try {
			String json = Search.getJson(model);
			rb = Response.ok(json);
			CacheControl cacheControl = new CacheControl();
			cacheControl.setNoCache(true);
			rb.cacheControl(cacheControl);
		} catch (TemplateException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		} catch (IOException e) {
			LOGGER.error(e.getMessage(), e);
			rb = Response.status(Status.INTERNAL_SERVER_ERROR);
		}

		return rb.build();

	}


    private Credentials extractCredentials(String authorization) {

        if (authorization == null || authorization.isEmpty()) {
            LOGGER.debug("no authorization header provided");
            return null;
        }

        String usernameAndPasswordBase64 = authorization.split(" ")[1];

        byte[] usernameAndPasswordByteArray = DatatypeConverter.parseBase64Binary(usernameAndPasswordBase64);

        String [] usernameAndPassword = new String(usernameAndPasswordByteArray).split(":");

        String username = usernameAndPassword[0];
        String password = usernameAndPassword[1];

        LOGGER.info("using BASIC auth for user: " + username);

        return new Credentials(username, password);

    }

    class Credentials {

        private String username;

        private String password;


        Credentials(String username, String password) {
            this.username = username;
            this.password = password;
        }


        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }


    }


    public void setQueryService(QueryService queryService) {
        this.queryService = queryService;
    }
}
