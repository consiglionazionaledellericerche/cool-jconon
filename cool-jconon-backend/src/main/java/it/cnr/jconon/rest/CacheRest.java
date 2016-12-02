package it.cnr.jconon.rest;

import it.cnr.cool.cmis.service.FolderService;
import it.cnr.cool.cmis.service.VersionService;
import it.cnr.cool.repository.ZoneRepository;
import it.cnr.cool.rest.util.Util;
import it.cnr.cool.service.CacheRestService;
import it.cnr.jconon.repository.CacheRepository;

import java.util.HashMap;
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
	private static final int CACHE_CONTROL = 1800;

    private static final Logger LOGGER = LoggerFactory
            .getLogger(CacheRest.class);

    @Autowired
    private CacheRestService cacheRestService;

    @Autowired
    private ZoneRepository zoneRepository;

    @Autowired
    private CacheRepository cacheRepository;

	@Autowired
	private VersionService versionService;

	@Autowired
	protected FolderService folderService;
    
    @GET
    public Response get(@Context HttpServletRequest req) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put("baseUrl", req.getContextPath());
        model.put("redirectUrl", req.getContextPath());
		model.put("debug", !versionService.isProduction());
		model.put("dataDictionary", folderService.getDataDictionaryId());
		model.put("zones", zoneRepository.get());        
		model.put(CacheRepository.COMPETITION, cacheRepository.getCompetitionFolder());
		model.put(CacheRepository.JSONLIST_CALL_TYPE, cacheRepository.getCallType());
		model.put(CacheRepository.JSONLIST_AFFIX_APPLICATION, cacheRepository.getAffixApplication());
		model.put(CacheRepository.JSONLIST_APPLICATION_FIELDS_NOT_REQUIRED, cacheRepository.getApplicationFieldsNotRequired());
		model.put(CacheRepository.JSONLIST_APPLICATION_ASPECTS, cacheRepository.getApplicationAspects());
		model.put(CacheRepository.JSONLIST_APPLICATION_ATTACHMENTS, cacheRepository.getApplicationAttachments());
		model.put(CacheRepository.JSONLIST_APPLICATION_CURRICULUMS, cacheRepository.getApplicationCurriculums());
		model.put(CacheRepository.JSONLIST_APPLICATION_SCHEDE_ANONIME, cacheRepository.getApplicationSchedeAnonime());
		model.put(CacheRepository.JSONLIST_TYPE_WITH_MANDATORY_ASPECTS, cacheRepository.getTypeWithMandatoryAspects());
		model.put(CacheRepository.JSONLIST_APPLICATION_PRODOTTI, cacheRepository.getApplicationProdotti());
		model.put(CacheRepository.JSONLIST_CALL_ATTACHMENTS, cacheRepository.getCallAttachments());
		model.put(CacheRepository.JSONLIST_APPLICATION_NO_ASPECTS_ITALIAN, cacheRepository.getApplicationNoAspectsItalian());
		model.put(CacheRepository.JSONLIST_APPLICATION_NO_ASPECTS_FOREIGN, cacheRepository.getApplicationNoAspectsForeign());
        LOGGER.debug(model.keySet().toString());
        return Response.ok(model).cacheControl(Util.getCache(CACHE_CONTROL)).build();
    }
}