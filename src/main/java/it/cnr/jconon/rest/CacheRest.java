package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.CacheService;
import it.cnr.cool.repository.ZoneRepository;
import it.cnr.cool.service.CacheRestService;
import it.cnr.cool.util.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

/**
 * Created by francesco on 13/07/15.
 */

@Path("cache")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class CacheRest {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(CacheRest.class);

    @Autowired
    private CacheRestService cacheRestService;

    @Autowired
    private CacheService cacheService;

    @Autowired
    private ZoneRepository zoneRepository;

    @GET
    public Response get(@Context HttpServletRequest req) {

        Map<String, Object> model = cacheRestService.getMap(req.getContextPath());

        List<Pair<String, Object>> publicCaches = cacheService.getPublicCaches();

        LOGGER.debug("adding zones to public caches");
        Pair<String, Object> zones = new Pair<String, Object>("zones", zoneRepository.get());
        publicCaches.add(zones);

        model.put("publicCaches", publicCaches);

        LOGGER.debug(model.keySet().toString());

        return cacheRestService.getResponse(model);

    }


}
