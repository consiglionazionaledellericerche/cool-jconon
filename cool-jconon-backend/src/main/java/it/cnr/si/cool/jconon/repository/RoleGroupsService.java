package it.cnr.si.cool.jconon.repository;

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
import it.cnr.cool.web.PermissionService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.service.AceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

/**
 * Gruppi che l'utente acquisisce tramite i ruoli SSO di ACE.
 * <p>
 * Per ogni ruolo attivo si prende il gruppo della whitelist RBAC (PUT) e i suoi padri in Alfresco.
 * I padri GROUP_RDP_* sono esclusi: alla creazione di un bando di borse di studio il gruppo
 * GESTORI_BORSE_DI_STUDIO viene inserito nel gruppo RDP del bando (CallService), quindi ogni RDP
 * risulterebbe padre del gruppo dei gestori (oltre 1600 gruppi in sessione). Il diritto di RdP sui
 * bandi di borse di studio è verificato direttamente sul tipo di bando.
 * <p>
 * La lista è calcolata una volta per utente (cache "sso-role-groups") e aggiunta all'utente della
 * sessione senza doppioni a ogni richiesta della nuova interfaccia (RoleGroupsInterceptor) e nel
 * legacy (CommonRepository.getManagersCall).
 */
@Component
public class RoleGroupsService {
    public static final String GROUP_RDP_PREFIX = "GROUP_RDP_";
    public static final String CACHE_NAME = "sso-role-groups";
    private static final Logger LOGGER = LoggerFactory.getLogger(RoleGroupsService.class);

    @Autowired
    private CMISService cmisService;
    @Autowired
    private PermissionService permission;
    @Autowired(required = false)
    private Optional<AceService> optAceService;
    @Autowired
    private GroupService groupService;
    @Autowired
    private CmisAuthRepository cmisAuthRepository;
    @Autowired
    private CacheManager cacheManager;
    @Value("${ace.contesto:}")
    private String aceContesto;
    /**
     * Riferimento al proxy di Spring, perché la cache funzioni anche nelle chiamate interne.
     */
    @Autowired
    @Lazy
    private RoleGroupsService self;

    /**
     * Gruppo della whitelist RBAC (PUT) associato al ruolo, esclusi CONCORSI e amministratori.
     */
    static Optional<String> whitelistGroup(JsonObject rbac, String siglaRuolo) {
        if (siglaRuolo == null || !rbac.has(siglaRuolo) || !rbac.get(siglaRuolo).isJsonObject()) {
            return Optional.empty();
        }
        return Optional.ofNullable(rbac.getAsJsonObject(siglaRuolo))
                .map(p -> p.getAsJsonObject("PUT"))
                .map(p -> p.getAsJsonObject("whitelist"))
                .filter(w -> w.has("group") && w.get("group").isJsonArray())
                .flatMap(w -> StreamSupport.stream(w.get("group").getAsJsonArray().spliterator(), false)
                        .map(JsonElement::getAsString)
                        .filter(s -> !s.equalsIgnoreCase(JcononGroups.CONCORSI.group()))
                        .filter(s -> !s.equalsIgnoreCase(JcononGroups.ALFRESCO_ADMINISTRATORS.group()))
                        .findAny());
    }

    /**
     * Gruppi del ruolo SSO dell'utente: gruppo della whitelist e suoi padri, senza i GROUP_RDP_*.
     */
    @Cacheable(value = CACHE_NAME, key = "#userId")
    public List<String> getRoleGroups(String userId) {
        final Set<String> groups = new LinkedHashSet<>();
        Optional.ofNullable(optAceService).flatMap(o -> o).ifPresent(aceService -> {
            try {
                final JsonObject rbac = new JsonParser().parse(permission.getRbacAsString()).getAsJsonObject();
                aceService.ruoliSsoAttivi(userId, aceContesto, Boolean.TRUE).forEach(ssoModelWebDto ->
                        whitelistGroup(rbac, ssoModelWebDto.getSiglaRuolo()).ifPresent(group -> {
                            groups.add(group);
                            groupService.parents(group.replace("GROUP_", ""), cmisService.getAdminSession())
                                    .stream()
                                    .map(CMISAuthority::getFullName)
                                    .filter(Objects::nonNull)
                                    .filter(parent -> !parent.startsWith(GROUP_RDP_PREFIX))
                                    .forEach(groups::add);
                        })
                );
            } catch (FeignException.NotFound _ex) {
                LOGGER.warn("User {} is not present in ACE", userId);
            } catch (Exception _ex) {
                LOGGER.error("Cannot read SSO role groups for user {}", userId, _ex);
            }
        });
        final List<String> result = new ArrayList<>(groups);
        // stessa lista usata dalle pagine legacy (Page.java)
        cmisAuthRepository.putCachedGroups(userId, result);
        LOGGER.info("SSO role groups for user {}: {}", userId, result);
        return result;
    }

    @CacheEvict(value = CACHE_NAME, key = "#userId")
    public void evictRoleGroups(String userId) {
        LOGGER.info("Evict cache {} for user: {}", CACHE_NAME, userId);
    }

    /**
     * Come addRoleGroups, ma per l'utente della sessione (cache "user", chiave ticket).
     * Le cache sono su Hazelcast: ogni lettura restituisce una copia, quindi i gruppi aggiunti vanno
     * riscritti in cache, altrimenti il controller (che rilegge l'utente) non li vede. Quando l'utente
     * cambia si svuotano anche le cache per utente calcolate con i gruppi incompleti.
     */
    public void addRoleGroupsToSessionUser(String ticket, CMISUser user) {
        if (ticket == null || user == null || user.isGuest() || user.getId() == null) {
            return;
        }
        final int before = Optional.ofNullable(user.getGroupsArray()).map(List::size).orElse(0);
        addRoleGroups(user);
        final int after = Optional.ofNullable(user.getGroupsArray()).map(List::size).orElse(0);
        if (after != before) {
            Optional.ofNullable(cacheManager.getCache(CmisAuthRepository.USER)).ifPresent(cache -> cache.put(ticket, user));
            Stream.of("enableTypeCalls", "managers-calls", "managers-call")
                    .map(cacheManager::getCache)
                    .filter(Objects::nonNull)
                    .forEach(cache -> cache.evict(user.getId()));
            LOGGER.info("SSO role groups added to session user {} ({} -> {} groups)", user.getId(), before, after);
        }
    }

    /**
     * Aggiunge all'utente i gruppi del ruolo SSO non ancora presenti (e lo iscrive a CONTRIBUTOR_CALL).
     * Si può chiamare a ogni richiesta: senza ruolo o con i gruppi già presenti non cambia nulla.
     */
    public CMISUser addRoleGroups(CMISUser user) {
        if (user == null || user.isGuest() || user.getId() == null) {
            return user;
        }
        final List<String> roleGroups = self.getRoleGroups(user.getId());
        if (roleGroups.isEmpty()) {
            return user;
        }
        final List<CMISGroup> current = Optional.ofNullable(user.getGroups()).orElse(Collections.emptyList());
        final Set<String> present = new HashSet<>(Optional.ofNullable(user.getGroupsArray()).orElse(Collections.emptyList()));
        final List<String> missing = new ArrayList<>();
        final String contributorGroup = JcononGroups.CONTRIBUTOR_CALL.group();
        if (!present.contains(contributorGroup)) {
            try {
                groupService.addAuthority(cmisService.getAdminSession(), contributorGroup, user.getId());
                LOGGER.info("User {} is now added to {}", user.getId(), contributorGroup);
            } catch (Exception _ex) {
                LOGGER.warn("Cannot add user {} to {}", user.getId(), contributorGroup, _ex);
            }
            missing.add(contributorGroup);
            present.add(contributorGroup);
        }
        roleGroups.stream()
                .filter(group -> !present.contains(group))
                .forEach(group -> {
                    missing.add(group);
                    present.add(group);
                });
        if (!missing.isEmpty()) {
            final List<CMISGroup> groups = new ArrayList<>(current);
            missing.forEach(group -> groups.add(new CMISGroup(group, group)));
            // setGroups aggiorna insieme groups e groupsArray
            user.setGroups(groups);
        }
        return user;
    }
}
