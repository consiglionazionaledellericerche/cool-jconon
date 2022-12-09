package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.I18nService;
import it.cnr.cool.service.PageModel;
import it.cnr.cool.service.PageService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.Utility;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
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

    @Override
    public void afterPropertiesSet() throws Exception {
        pageService.registerPageModels("call-detail", new PageModel() {
            @Override
            public Map<String, Object> addToModel(Map<String, String[]> paramz, HttpServletRequest req) {
                final Optional<String> callId = Optional.ofNullable(paramz.get("callId"))
                        .filter(s -> s.length == 1)
                        .map(strings -> strings[0]);
                if (callId.isPresent()) {
                    try {
                        final Optional<Folder> call = Optional.ofNullable(cmisService.getCurrentCMISSession(req).getObject(callId.get()))
                                .filter(Folder.class::isInstance)
                                .map(Folder.class::cast);
                        final Optional<CMISUser> optCmisUser = Optional.ofNullable(cmisService.getCMISUserFromSession(req));
                        if (call.isPresent()) {
                            return Stream.of(
                                            new AbstractMap.SimpleEntry<>("page_title",
                                                    i18nService.getLabel("main.title", Locale.ITALIAN) + " - " +
                                                            i18nService.getLabel(call.get().getType().getId(), Locale.ITALIAN) + " - " +
                                                            call.get().getPropertyValue(JCONONPropertyIds.CALL_CODICE.value())
                                            ),
                                            new AbstractMap.SimpleEntry<>("contextURL", Utility.getContextURL(req)),
                                            new AbstractMap.SimpleEntry<>("call", CMISUtil.convertToProperties(call.get())),
                                            new AbstractMap.SimpleEntry<>("canWiewApplications",
                                                    optCmisUser.map(cmisUser -> {
                                                        return callService.isMemberOfCommissioneGroup(cmisUser, call.get()) ||
                                                                callService.isMemberOfConcorsiGroup(cmisUser) ||
                                                                cmisUser.isAdmin();
                                                    }).orElse(Boolean.FALSE)
                                            ),
                                            new AbstractMap.SimpleEntry<>("isMacroCall", callService.isMacroCall(call.get())),
                                            new AbstractMap.SimpleEntry<>("isActive", callService.isBandoInCorso(call.get())),
                                            new AbstractMap.SimpleEntry<>("attachments",
                                                    StreamSupport.stream(call.get().getChildren().spliterator(), false)
                                                            .filter(cmisObject -> cmisObject.getBaseType().getId().equals(BaseTypeId.CMIS_DOCUMENT.value()))
                                                            .filter(cmisObject -> {
                                                                return cacheRepository.getCallAttachments()
                                                                        .stream()
                                                                        .anyMatch(objectTypeCache -> objectTypeCache.getId().equalsIgnoreCase(cmisObject.getType().getId()));
                                                            })
                                                            .filter(Document.class::isInstance)
                                                            .map(Document.class::cast)
                                                            .map(document -> {
                                                                final Map<String, Object> stringObjectMap = CMISUtil.convertToProperties(document);
                                                                String label = "";
                                                                final Optional<ObjectTypeCache> optObjectTypeCache = cacheRepository.getCallAttachments()
                                                                        .stream()
                                                                        .filter(objectTypeCache -> document.getType().getId().equals(objectTypeCache.getId()))
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
                }
                return Collections.emptyMap();
            }
        });

    }
}
