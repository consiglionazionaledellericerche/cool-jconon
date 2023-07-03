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

package it.cnr.si.cool.jconon.repository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import feign.FeignException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.GroupService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.GroupsUtils;
import it.cnr.cool.web.PermissionService;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.dto.SiperSede;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.service.SiperService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import it.cnr.si.service.AceService;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.enums.Action;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Repository
public class CommonRepository {
    private static final String AUTH_EXT_GESTORI = "AUTH.EXT.gestori";
	private static final Logger LOGGER = LoggerFactory.getLogger(CommonRepository.class);
    private static final String DEFINITIONS_URL = "service/cnr/jconon/sedi/gestori/";
    
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionService permission;
	@Autowired(required = false)
	private SiperService siperService;
	@Autowired(required = false)
	private Optional<AceService> optAceService;
	@Autowired
	private GroupService groupService;

	@Value("${ace.contesto:}")
	private String aceContesto;
	@Autowired
	private CacheRepository cacheRepository;
    
    @Cacheable(value="managers-call", key="#userId")
    public Map<String, List<SiperSede>> getManagersCall(String userId, CMISUser user, BindingSession session){
    	Map<String, List<SiperSede>> result = new HashMap<String, List<SiperSede>>();
    	try {
    		String link = cmisService.getBaseURL().concat(DEFINITIONS_URL).concat(userId);
    		UrlBuilder urlBuilder = new UrlBuilder(link);
    		urlBuilder.addParameter("zone", AUTH_EXT_GESTORI);
    		Response response = CmisBindingsHelper.getHttpInvoker(session).invokeGET(urlBuilder, session);
    		ObjectMapper objectMapper = new ObjectMapper();
    		if (response.getResponseCode() == HttpStatus.SC_OK) {
    			@SuppressWarnings("unchecked")
				Map<String, List<String>> readValue = objectMapper.readValue(response.getStream(), Map.class);
    			for (String key : readValue.keySet()) {
    				List<SiperSede> sedi = new ArrayList<SiperSede>();
					if (Optional.ofNullable(siperService).isPresent()) {
						readValue.get(key).forEach(sedeId -> sedi.add(siperService.cacheableSiperSede(sedeId).get()));
					}
    				result.put(key, sedi);
    			}
    		}
			optAceService.ifPresent(aceService -> {
				try {
					aceService.ruoliSsoAttivi(userId, aceContesto, Boolean.TRUE).forEach(ssoModelWebDto -> {
						final String siglaRuolo = ssoModelWebDto.getSiglaRuolo();
						JsonObject json = new JsonParser().parse(permission.getRbacAsString()).getAsJsonObject();
						JsonObject p = json.getAsJsonObject(siglaRuolo);
						JsonObject w = p.getAsJsonObject("PUT").getAsJsonObject("whitelist");
						if (w != null && w.has("group")) {
							StreamSupport.stream(w.get("group").getAsJsonArray().spliterator(), false)
									.map(JsonElement::getAsString)
									.filter(s -> !s.equalsIgnoreCase(JcononGroups.CONCORSI.group()))
									.filter(s -> !s.equalsIgnoreCase(JcononGroups.ALFRESCO_ADMINISTRATORS.group()))
									.findAny()
									.ifPresent(s -> {
										final String contributorGroup = JcononGroups.CONTRIBUTOR_CALL.group();
										if (!user.getGroupsArray().contains(contributorGroup)) {
											LOGGER.info("User {} is now added to {}", userId, s);
											groupService.addAuthority(cmisService.getAdminSession(), contributorGroup, userId);
										}
										user.getGroupsArray().add(s);
										user.getGroups().add(new CMISGroup(s,s));
									});
						}
						result.put(
								siglaRuolo,
								ssoModelWebDto.getEntitaOrganizzative()
										.stream()
										.map(sewd -> {
											SiperSede siperSede = new SiperSede();
											siperSede.setSedeId(sewd.getIdnsip());
											siperSede.setTitCa(sewd.getCdsuo());
											siperSede.setDescrizione(sewd.getDenominazione());
											siperSede.setCitta(sewd.getComune());
											return siperSede;
										}).collect(Collectors.toList())
						);
					});
				} catch (FeignException.NotFound _ex) {
					LOGGER.warn("User {} is not present in ACE", userId);
				} catch (Exception _ex) {
					LOGGER.error("Cannot read magagers call for sedi", _ex);
				}
			});
    	} catch(IOException _ex) {
    		LOGGER.error("Cannot read magagers call for sedi", _ex);    		
    	}
		return result;
    }
	@Cacheable(value="commission-calls", key="#userId")
	public List<Map<String, Serializable>> getCommissionCalls(String userId, Session session) {
		List<Map<String,Serializable>> calls = new ArrayList<Map<String,Serializable>>();
		Criteria criteriaCommissions = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_COMMISSIONE_METADATA.queryName());
		criteriaCommissions.addColumn(PropertyIds.OBJECT_ID);
		criteriaCommissions.add(Restrictions.eq(JCONONPropertyIds.COMMISSIONE_USERNAME.value(), userId));
		criteriaCommissions.add(Restrictions.inTree(cacheRepository.getCompetitionFolder().getId()));
		criteriaCommissions.addOrder(Order.descending(PropertyIds.CREATION_DATE));
		ItemIterable<QueryResult> iterableCommission = criteriaCommissions.executeQuery(session, false, session.getDefaultContext());
		final int maxItemsPerPage = session.getDefaultContext().getMaxItemsPerPage();
		int skipTo = 0;
		do {
			iterableCommission = iterableCommission.skipTo(skipTo).getPage(maxItemsPerPage);
			for (QueryResult queryResult : iterableCommission) {
				Optional.ofNullable(session.getObject(queryResult.<String>getPropertyValueById(PropertyIds.OBJECT_ID)))
						.filter(Document.class::isInstance)
						.map(Document.class::cast)
						.map(document -> {
							return document
									.getParents()
									.stream()
									.findAny();
						}).orElse(Optional.empty()).ifPresent(folder -> {
							calls.add(Stream.of(
									new AbstractMap.SimpleEntry<>("id", folder.getId()),
									new AbstractMap.SimpleEntry<>("display", Boolean.TRUE),
									new AbstractMap.SimpleEntry<>("disabled", Boolean.FALSE),
									new AbstractMap.SimpleEntry<>("title", folder.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()))
							).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
						});
			}
			skipTo = skipTo + maxItemsPerPage;
		} while (iterableCommission.getHasMoreItems());
		return calls;
	}

    @Cacheable(value="enableTypeCalls", key="#userId")
    public List<ObjectTypeCache> getEnableTypeCalls(String userId, CMISUser user, BindingSession session) {
    	List<ObjectTypeCache> result = new ArrayList<ObjectTypeCache>();
    	List<ObjectTypeCache> callType = cacheRepository.getCallType();
    	callType.stream().forEach(x -> {
            boolean isAuthorized = permission.isAuthorized(x.getId(), "PUT",
                    userId, GroupsUtils.getGroups(user));
            LOGGER.debug(x.getId() + " "
                    + (isAuthorized ? "authorized" : "unauthorized"));
            if (isAuthorized) {
            	result.add(x);
            }    		
    	});
        return result;
    }

    @CacheEvict(value="enableTypeCalls", key="#userId")
    public void evictEnableTypeCalls(String userId){
    	LOGGER.info("Evict cache enableTypeCalls for user: {}", userId);
    }

    @CacheEvict(value="managers-call", key="#userId")
    public void evictManagersCall(String userId){
    	LOGGER.info("Evict cache managers-call for user: {}", userId);
    }

	@CacheEvict(value="managers-call")
	public void evictAllManagersCall(){
		LOGGER.info("Evict cache managers-call for all user");
	}

	@CacheEvict(value="commission-calls", key="#userId")
	public void evictCommissionCalls(String userId){
		LOGGER.info("Evict cache commission calls for user: {}", userId);
	}

}