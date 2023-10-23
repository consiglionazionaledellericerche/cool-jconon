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
import it.cnr.cool.cmis.service.CmisAuthRepository;
import it.cnr.cool.security.service.GroupService;
import it.cnr.cool.security.service.impl.alfresco.CMISAuthority;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.PageService;
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
import org.apache.chemistry.opencmis.commons.exceptions.CmisUnauthorizedException;
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
	public static final String GESTORE_SEL = "GESTORE#SEL";

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
	@Autowired
	private PageService pageService;
	@Autowired
	CmisAuthRepository cmisAuthRepository;
	@Autowired
	CommissionConfProperties commissionConfProperties;
	@Value("${ace.contesto:}")
	private String aceContesto;
	@Autowired
	private CacheRepository cacheRepository;
    
    @Cacheable(value="managers-call", key="#userId")
    public Map<String, List<SiperSede>> getManagersCall(String userId, CMISUser user, BindingSession session){
    	Map<String, List<SiperSede>> result = new HashMap<String, List<SiperSede>>();
		if (user.getGroupsArray().stream().filter(s -> s.equalsIgnoreCase(JcononGroups.CONCORSI.group())).findAny().isPresent()) {
			cacheRepository.getCallType()
					.stream()
					.map(objectTypeCache -> objectTypeCache.getId())
					.forEach(s -> {
						result.put(s, Collections.emptyList());
					});
			return result;
		}
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
						if (Optional.ofNullable(p).isPresent()) {
							JsonObject w = Optional.ofNullable(p.getAsJsonObject("PUT"))
									.map(jsonObject -> jsonObject.getAsJsonObject("whitelist"))
									.orElse(null);
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
											final List<String> groups = Stream.concat(
													Stream.of(s),
													groupService.parents(s.replace("GROUP_", ""), cmisService.getAdminSession()).stream().map(CMISAuthority::getFullName)
											).collect(Collectors.toList());
											cmisAuthRepository.putCachedGroups(userId, groups);
											groups.stream().forEach(s1 -> {
												user.getGroupsArray().add(s1);
												user.getGroups().add(new CMISGroup(s1,s1));
											});
										});
							}
							result.put(
									siglaRuolo,
									ssoModelWebDto.getEntitaOrganizzative()
											.stream()
											.map(sewd -> {
												SiperSede siperSede = new SiperSede();
												siperSede.setSedeId(Optional.ofNullable(sewd.getIdnsip()).orElse(String.valueOf(sewd.getId())));
												siperSede.setTitCa(sewd.getCdsuo());
												siperSede.setDescrizione(sewd.getDenominazione());
												siperSede.setCitta(sewd.getComune());
												return siperSede;
											}).collect(Collectors.toList())
							);
						} else if (siglaRuolo.equalsIgnoreCase(GESTORE_SEL)) {
							result.put(GESTORE_SEL, Collections.emptyList());
						}
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
		try {
			List<Map<String, Serializable>> calls = new ArrayList<Map<String, Serializable>>();
			Criteria criteriaCommissions = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_COMMISSIONE_METADATA.queryName());
			criteriaCommissions.addColumn(PropertyIds.OBJECT_ID);
			criteriaCommissions.add(Restrictions.eq(JCONONPropertyIds.COMMISSIONE_USERNAME.value(), userId));
			criteriaCommissions.add(Restrictions.inTree(cacheRepository.getCompetitionFolder().getId()));
			criteriaCommissions.addOrder(Order.descending(PropertyIds.CREATION_DATE));
			ItemIterable<QueryResult> iterableCommission = criteriaCommissions.executeQuery(session, false, session.getDefaultContext());
			final int maxItemsPerPage = session.getDefaultContext().getMaxItemsPerPage();
			int skipTo = 0;
			if (iterableCommission.getTotalNumItems() > 0 && commissionConfProperties.getGender()) {
				calls.add(Stream.of(
						new AbstractMap.SimpleEntry<>("id", "commission-gender"),
						new AbstractMap.SimpleEntry<>("absolute", Boolean.TRUE),
						new AbstractMap.SimpleEntry<>("display", Boolean.TRUE),
						new AbstractMap.SimpleEntry<>("disabled", Boolean.FALSE),
						new AbstractMap.SimpleEntry<>("title", "Commission gender")
				).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue)));
			}
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
		} catch (CmisUnauthorizedException e) {
			return Collections.emptyList();
		}
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

	public void evictGroupsCache(String userId) {
		cmisAuthRepository.removeGroupsFromCache(userId);
	}

}