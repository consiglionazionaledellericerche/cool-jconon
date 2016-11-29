package it.cnr.jconon.rest;

import it.cnr.cool.repository.ZoneRepository;
import it.cnr.cool.service.CacheRestService;
import it.cnr.cool.util.Pair;
import it.cnr.jconon.repository.CacheRepository;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

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
    private ZoneRepository zoneRepository;

    @Autowired
    private CacheRepository cacheRepository;
    
    @GET
    public Response get(@Context HttpServletRequest req) {
        Map<String, Object> model = cacheRestService.getMap(req.getContextPath());
        List<Pair<String, Serializable>> publicCaches = new ArrayList<Pair<String,Serializable>>();
        LOGGER.debug("adding zones to public caches");                
        publicCaches.add(new Pair<String, Serializable>("zones", zoneRepository.get()));        
        publicCaches.add(new Pair<String, Serializable>("competition", cacheRepository.getCompetitionFolder()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistCallType", cacheRepository.getCallType()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationFieldsNotRequired", cacheRepository.getApplicationFieldsNotRequired()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationAspects", cacheRepository.getApplicationAspects()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationAttachments", cacheRepository.getApplicationAttachments()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationCurriculums", cacheRepository.getApplicationCurriculums()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationSchedeAnonime", cacheRepository.getApplicationSchedeAnonime()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistTypeWithMandatoryAspects", cacheRepository.getTypeWithMandatoryAspects()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationProdotti", cacheRepository.getApplicationProdotti()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistCallAttachments", cacheRepository.getCallAttachments()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationNoAspectsItalian", cacheRepository.getApplicationNoAspectsItalian()));
        publicCaches.add(new Pair<String, Serializable>("jsonlistApplicationNoAspectsForeign", cacheRepository.getApplicationNoAspectsForeign()));
        model.put("publicCaches", publicCaches);
        LOGGER.debug(model.keySet().toString());
        return cacheRestService.getResponse(model);
    }
}