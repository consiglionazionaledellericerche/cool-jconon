package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.service.PageModel;
import it.cnr.cool.service.PageService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.CommissionConfProperties;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.Utility;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.exceptions.CmisBaseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

@Service
public class PageModelService implements InitializingBean {
    private static final Logger LOGGER = LoggerFactory.getLogger(PageModelService.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private PageService pageService;
    @Autowired
    private CallService callService;
    @Autowired
    private CacheRepository cacheRepository;
    @Autowired
    private I18nService i18nService;
    @Autowired
    CommissionConfProperties commissionConfProperties;
    @Override
    public void afterPropertiesSet() throws Exception {
        pageService.registerPageModels("call-detail", new PageModel() {
            @Override
            public Map<String, Object> addToModel(Map<String, String[]> paramz, HttpServletRequest req) {
                final Session currentCMISSession = cmisService.getCurrentCMISSession(req);
                Optional<Folder> call = Optional.empty();
                final Optional<CMISUser> optCmisUser =
                        Optional.ofNullable(cmisService.getCMISUserFromSession(req))
                                .filter(cmisUser -> !cmisUser.isGuest());
                final Optional<String> callId = Optional.ofNullable(paramz.get("callId"))
                        .filter(s -> s.length == 1)
                        .map(strings -> strings[0]);
                final Optional<String> callCode = Optional.ofNullable(paramz.get("callCode"))
                        .filter(s -> s.length == 1)
                        .map(strings -> strings[0]);
                if (callId.isPresent()) {
                    call = Optional.ofNullable(currentCMISSession.getObject(callId.get()))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast);
                } else if (callCode.isPresent()) {
                    Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
                    criteria.add(Restrictions.eq(JCONONPropertyIds.CALL_CODICE.value(), callCode.get()));
                    ItemIterable<QueryResult> calls = criteria.executeQuery(currentCMISSession, false, currentCMISSession.getDefaultContext());
                    if (calls.getTotalNumItems() == 1) {
                        call = Optional.ofNullable(currentCMISSession.getObject((String) calls.iterator().next().getPropertyValueById(PropertyIds.OBJECT_ID)))
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast);
                    }
                }
                try {
                    if (call.isPresent()) {
                        final Folder folder = call.get();
                        Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_ATTACHMENT_CALL_ABSTRACT.queryName());
                        criteria.add(Restrictions.inFolder(folder.getId()));
                        ItemIterable<QueryResult> attachments = criteria.executeQuery(currentCMISSession, false, currentCMISSession.getDefaultContext());
                        final boolean macroCall = callService.isMacroCall(folder);
                        List<String> childs = Collections.emptyList();
                        if (macroCall) {
                            childs = StreamSupport.stream(folder.getChildren().spliterator(), false)
                                    .filter(cmisObject -> cmisObject.getType().equals(folder.getType()))
                                    .map(cmisObject -> cmisObject.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()))
                                    .collect(Collectors.toList());
                        }
                        return Stream.of(
                                        new AbstractMap.SimpleEntry<>("page_title",
                                                i18nService.getLabel("main.title", Locale.ITALIAN) + " - " +
                                                        i18nService.getLabel(folder.getType().getId(), Locale.ITALIAN) + " - " +
                                                        folder.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())
                                        ),
                                        new AbstractMap.SimpleEntry<>("contextURL", Utility.getContextURL(req)),
                                        new AbstractMap.SimpleEntry<>("call", CMISUtil.convertToProperties(folder)),
                                        new AbstractMap.SimpleEntry<>("canWiewApplications",
                                                optCmisUser.map(cmisUser -> {
                                                    return callService.isMemberOfCommissioneGroup(cmisUser, folder) ||
                                                            callService.isMemberOfConcorsiGroup(cmisUser) ||
                                                            cmisUser.isAdmin();
                                                }).orElse(Boolean.FALSE)
                                        ),
                                        new AbstractMap.SimpleEntry<>("isMacroCall", macroCall),
                                        new AbstractMap.SimpleEntry<>("childs", childs),
                                        new AbstractMap.SimpleEntry<>("isActive", callService.isBandoInCorso(folder)),
                                        new AbstractMap.SimpleEntry<>("attachments",
                                                StreamSupport.stream(attachments.spliterator(), false)
                                                        .map(queryResult -> {
                                                            final Map<String, Object> stringObjectMap = CMISUtil.convertToProperties(queryResult);
                                                            String label = "";
                                                            final Optional<ObjectTypeCache> optObjectTypeCache = cacheRepository.getCallAttachments()
                                                                    .stream()
                                                                    .filter(objectTypeCache -> queryResult.getPropertyValueById(PropertyIds.OBJECT_TYPE_ID).equals(objectTypeCache.getId()))
                                                                    .findAny();
                                                            if (optObjectTypeCache.isPresent()) {
                                                                label = i18nService.getLabel(optObjectTypeCache.get().getId(), Locale.ITALIAN);
                                                                if (label == null) {
                                                                    label = optObjectTypeCache.get().getDefaultLabel();
                                                                }
                                                            }
                                                            stringObjectMap.put("typeLabel", label);
                                                            return stringObjectMap;
                                                        })
                                                        .collect(Collectors.toList())
                                        ))
                                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
                    }
                } catch (CmisBaseException _ex) {
                    LOGGER.error("Call with id {} not found", callId.get(), _ex);
                }
                return Collections.emptyMap();
            }
        });
        pageService.registerPageModels("commission-gender", new PageModel() {
            @Override
            public Map<String, Object> addToModel(Map<String, String[]> paramz, HttpServletRequest req) {
                return Collections.singletonMap("videoGenderURL", commissionConfProperties.getUrl());
            }
        });

    }
}
