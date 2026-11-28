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

package it.cnr.si.cool.jconon.rest.openapi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISGroup;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.function.Consumer;
import java.util.stream.Collectors;

/**
 * Anagrafica dei commissari e dei responsabili del procedimento (RdP), riservata ad amministratori e gruppo CONCORSI:
 * l'elenco delle persone e, per ognuna, i bandi in cui è stata commissario o RdP.
 * <p>
 * Commissari e RdP si leggono a pagine di poche persone (scroll infinito), con i dati dell'utenza; i bandi di
 * una persona si leggono solo quando servono, per non aprire migliaia di cartelle a ogni richiesta.
 */
@RestController
@RequestMapping(ApiRoutes.V1_CALL + "/registry")
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Tag(name = "Commissari e RdP", description = "Commissari e responsabili del procedimento con i relativi bandi")
public class CommissionersRegistryController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CommissionersRegistryController.class);
    private static final String GROUP_PREFIX = "GROUP_";
    /** Gruppi RdP che non corrispondono a un singolo bando. */
    private static final Set<String> RDP_GENERIC_GROUPS = new HashSet<>(Arrays.asList(
            JcononGroups.RDP_CONCORSO.group(), CallService.GROUP_CONCORSI_RDP));
    /** Persone massime per pagina (per ognuna si leggono i dati dell'utenza). */
    private static final int MAX_PERSONS = 50;
    /** Incarichi letti per blocco nella ricerca dei commissari. */
    private static final int CHUNK = 50;
    /** Valori per clausola IN di ogni query sui bandi di un RdP. */
    private static final int IN_CHUNK = 50;

    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private UserService userService;
    @Autowired
    private CacheRepository cacheRepository;

    /* ------------------------------------------------------------------ */
    /* Commissari                                                           */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Commissari, ricerca paginata per persona (ordine cognome e nome) con i dati dell'utenza")
    @GetMapping("/commissioners")
    public ResponseEntity<Map<String, Object>> commissioners(HttpServletRequest req,
                                                             @RequestParam(value = "skip", defaultValue = "0") long skip,
                                                             @RequestParam(value = "max", defaultValue = "10") int max,
                                                             @RequestParam(value = "filter", required = false) String filter) {
        checkConcorsi(req);
        final int persons = Math.max(1, Math.min(max, MAX_PERSONS));
        final Session session = cmisService.getCurrentCMISSession(req);
        final OperationContext context = session.createOperationContext();
        context.setMaxItemsPerPage(CHUNK);
        final Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_COMMISSIONE_METADATA.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_USERNAME.value());
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_COGNOME.value());
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_NOME.value());
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_QUALIFICA.value());
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_EMAIL.value());
        criteria.add(Restrictions.inTree(cacheRepository.getCompetitionFolder().getId()));
        // filtro: la prima parola sul cognome, la seconda sul nome ("rossi mar" -> cognome *rossi*, nome *mar*)
        final List<String> words = words(filter);
        // stesso formato del valore di CONTAINS usato per nome e cognome nella ricerca delle domande
        if (!words.isEmpty()) {
            criteria.add(Restrictions.contains(JCONONPropertyIds.COMMISSIONE_COGNOME.value(), "\'*" + words.get(0) + "*\''"));
            if (words.size() > 1) {
                criteria.add(Restrictions.contains(JCONONPropertyIds.COMMISSIONE_NOME.value(), "\'*" + words.get(1) + "*\''"));
            }
        }
        criteria.addOrder(Order.asc(JCONONPropertyIds.COMMISSIONE_COGNOME.value()));
        criteria.addOrder(Order.asc(JCONONPropertyIds.COMMISSIONE_NOME.value()));
        criteria.addOrder(Order.asc(JCONONPropertyIds.COMMISSIONE_USERNAME.value()));

        // si leggono incarichi a blocchi finché non si hanno \"persons\" persone; ci si ferma sul primo incarico
        // della persona successiva, che sarà il primo della pagina dopo (nextSkip)
        final ItemIterable<QueryResult> results = criteria.executeQuery(session, false, context);
        final Map<String, Map<String, Object>> people = new LinkedHashMap<>();
        long position = Math.max(skip, 0);
        long total = -1;
        boolean exhausted = false;
        scan:
        while (true) {
            final ItemIterable<QueryResult> page = results.skipTo(position).getPage(CHUNK);
            if (total < 0) {
                total = page.getTotalNumItems();
            }
            int read = 0;
            for (QueryResult result : page) {
                final String username = trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_USERNAME.value()));
                final String cognome = trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_COGNOME.value()));
                final String nome = trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_NOME.value()));
                if (username != null || cognome != null || nome != null) {
                    final String key = username != null ? username.toLowerCase(Locale.ROOT) :
                            "~" + normalize(cognome) + "|" + normalize(nome);
                    if (!people.containsKey(key) && people.size() >= persons) {
                        break scan;
                    }
                    final Map<String, Object> person = people.computeIfAbsent(key, k -> {
                        final Map<String, Object> map = new HashMap<>();
                        map.put("key", k);
                        map.put("username", username);
                        map.put("cognome", cognome);
                        map.put("nome", nome);
                        map.put("incarichi", 0);
                        return map;
                    });
                    if (person.get("qualifica") == null) {
                        person.put("qualifica", trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_QUALIFICA.value())));
                    }
                    if (person.get("email") == null) {
                        person.put("email", trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_EMAIL.value())));
                    }
                    person.put("incarichi", (Integer) person.get("incarichi") + 1);
                }
                position++;
                read++;
            }
            if (read < CHUNK || !page.getHasMoreItems()) {
                exhausted = true;
                break;
            }
        }
        // dati dell'utenza solo per le persone della pagina
        final BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
        people.values().stream()
                .filter(person -> person.get("username") != null)
                .forEach(person -> person.put("account", account(bindingSession, (String) person.get("username"))));
        return ResponseEntity.ok(page(new ArrayList<>(people.values()), position, !exhausted, total));
    }

    @Operation(summary = "Bandi in cui la persona è stata commissario (per username, oppure cognome e nome se senza utenza)")
    @GetMapping("/commissioners/calls")
    public ResponseEntity<List<Map<String, Object>>> commissionerCalls(HttpServletRequest req,
                                                                    @RequestParam(value = "username", required = false) String username,
                                                                    @RequestParam(value = "cognome", required = false) String cognome,
                                                                    @RequestParam(value = "nome", required = false) String nome) {
        checkConcorsi(req);
        if (trim(username) == null && trim(cognome) == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        final Session session = cmisService.getCurrentCMISSession(req);
        final Criteria criteria = CriteriaFactory.createCriteria(JCONONDocumentType.JCONON_COMMISSIONE_METADATA.queryName());
        criteria.addColumn(PropertyIds.OBJECT_ID);
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_RUOLO.value());
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_USERNAME.value());
        criteria.addColumn(JCONONPropertyIds.COMMISSIONE_NOME.value());
        if (trim(username) != null) {
            criteria.add(Restrictions.eq(JCONONPropertyIds.COMMISSIONE_USERNAME.value(), trim(username)));
        } else {
            criteria.add(Restrictions.eq(JCONONPropertyIds.COMMISSIONE_COGNOME.value(), trim(cognome)));
        }
        criteria.add(Restrictions.inTree(cacheRepository.getCompetitionFolder().getId()));

        final List<Map<String, Object>> calls = new ArrayList<>();
        final Set<String> seen = new HashSet<>();
        forEachResult(session, criteria, result -> {
            if (trim(username) == null) {
                // commissario senza utenza: stesso cognome e nome, e nessuno username
                if (trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_USERNAME.value())) != null ||
                        !normalize(trim(result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_NOME.value()))).equals(normalize(trim(nome)))) {
                    return;
                }
            }
            final String ruolo = result.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_RUOLO.value());
            parentCall(session, result.getPropertyValueById(PropertyIds.OBJECT_ID))
                    .filter(call -> seen.add(call.getId() + "|" + ruolo))
                    .ifPresent(call -> {
                        final Map<String, Object> map = callInfo(call);
                        map.put("ruolo", ruolo);
                        calls.add(map);
                    });
        });
        calls.sort(BY_END_DESC);
        return ResponseEntity.ok(calls);
    }

    /* ------------------------------------------------------------------ */
    /* Responsabili del procedimento                                        */
    /* ------------------------------------------------------------------ */

    @Operation(summary = "Responsabili del procedimento (utenti dei gruppi RdP dei bandi), a pagine, con i dati dell'utenza")
    @GetMapping("/rdp")
    public ResponseEntity<Map<String, Object>> rdp(HttpServletRequest req,
                                                   @RequestParam(value = "skip", defaultValue = "0") int skip,
                                                   @RequestParam(value = "max", defaultValue = "10") int max,
                                                   @RequestParam(value = "filter", required = false) String filter) {
        checkConcorsi(req);
        final BindingSession bindingSession = cmisService.getCurrentBindingSession(req);
        final List<String> members;
        try {
            // i gruppi RdP dei bandi sono figli di GROUP_RDP_CONCORSO: se ne leggono gli utenti
            members = userService.findMembers(JcononGroups.RDP_CONCORSO.group(), bindingSession);
        } catch (Exception e) {
            LOGGER.error("Unable to read members of {}", JcononGroups.RDP_CONCORSO.group(), e);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY);
        }
        // l'elenco dei membri ha solo gli username: il filtro agisce su quelli
        final String term = normalize(filter);
        final List<String> usernames = members.stream()
                .filter(Objects::nonNull)
                .filter(member -> !member.startsWith(GROUP_PREFIX))
                .distinct()
                .filter(member -> term.isEmpty() || normalize(member).contains(term))
                .sorted(String.CASE_INSENSITIVE_ORDER)
                .collect(Collectors.toList());
        final int from = Math.max(0, Math.min(skip, usernames.size()));
        final int to = Math.min(usernames.size(), from + Math.max(1, Math.min(max, MAX_PERSONS)));
        final List<Map<String, Object>> items = usernames.subList(from, to).stream()
                .map(member -> {
                    final Map<String, Object> map = new HashMap<>();
                    map.put("key", member.toLowerCase(Locale.ROOT));
                    map.put("username", member);
                    final Map<String, Object> account = account(bindingSession, member);
                    map.put("account", account);
                    map.put("cognome", account.get("cognome"));
                    map.put("nome", account.get("nome"));
                    map.put("email", account.get("email"));
                    return map;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(page(items, to, to < usernames.size(), usernames.size()));
    }

    @Operation(summary = "Dati dell'utente e bandi di cui è responsabile del procedimento")
    @GetMapping("/rdp/calls")
    public ResponseEntity<Map<String, Object>> rdpCalls(HttpServletRequest req, @RequestParam("username") String username) {
        checkConcorsi(req);
        final CMISUser rdp;
        try {
            rdp = userService.loadUser(username, cmisService.getCurrentBindingSession(req));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        // gruppi del bando (jconon_call:rdp contiene il nome senza GROUP_)
        final List<String> groups = Optional.ofNullable(rdp.getGroups()).orElse(Collections.emptyList()).stream()
                .map(CMISGroup::getGroup_name)
                .filter(Objects::nonNull)
                .filter(name -> name.startsWith(GROUP_PREFIX) && !RDP_GENERIC_GROUPS.contains(name))
                .map(name -> name.substring(GROUP_PREFIX.length()))
                .distinct()
                .collect(Collectors.toList());
        final Session session = cmisService.getCurrentCMISSession(req);
        final List<Map<String, Object>> calls = new ArrayList<>();
        for (int i = 0; i < groups.size(); i += IN_CHUNK) {
            final List<String> chunk = groups.subList(i, Math.min(i + IN_CHUNK, groups.size()));
            final Criteria criteria = CriteriaFactory.createCriteria(JCONONFolderType.JCONON_CALL.queryName());
            criteria.addColumn(PropertyIds.OBJECT_ID);
            criteria.add(Restrictions.in(JCONONPropertyIds.CALL_RDP.value(), chunk.toArray()));
            criteria.add(Restrictions.inTree(cacheRepository.getCompetitionFolder().getId()));
            forEachResult(session, criteria, result ->
                    Optional.ofNullable(session.getObject(result.<String>getPropertyValueById(PropertyIds.OBJECT_ID)))
                            .filter(Folder.class::isInstance)
                            .map(Folder.class::cast)
                            .ifPresent(call -> calls.add(callInfo(call))));
        }
        calls.sort(BY_END_DESC);
        final Map<String, Object> result = new HashMap<>();
        result.put("username", rdp.getId());
        result.put("cognome", rdp.getLastName());
        result.put("nome", rdp.getFirstName());
        result.put("email", rdp.getEmail());
        result.put("calls", calls);
        return ResponseEntity.ok(result);
    }

    /* ------------------------------------------------------------------ */
    /* Supporto                                                             */
    /* ------------------------------------------------------------------ */

    private static final Comparator<Map<String, Object>> BY_END_DESC = Comparator
            .comparing((Map<String, Object> call) -> (Long) call.get("dataFine"), Comparator.nullsLast(Comparator.reverseOrder()))
            .thenComparing(call -> String.valueOf(call.get("codice")));

    private void checkConcorsi(HttpServletRequest req) {
        final CMISUser user = cmisService.getCMISUserFromSession(req);
        if (user == null || user.isGuest()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        if (!(user.isAdmin() || callService.isMemberOfConcorsiGroup(user))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
    }

    /** Tutte le pagine di una query. */
    private void forEachResult(Session session, Criteria criteria, Consumer<QueryResult> consumer) {
        ItemIterable<QueryResult> results = criteria.executeQuery(session, false, session.getDefaultContext());
        final int pageSize = session.getDefaultContext().getMaxItemsPerPage();
        long skip = 0;
        while (true) {
            final ItemIterable<QueryResult> page = results.skipTo(skip).getPage(pageSize);
            int count = 0;
            for (QueryResult result : page) {
                consumer.accept(result);
                count++;
            }
            if (count == 0 || !page.getHasMoreItems()) {
                break;
            }
            skip += count;
        }
    }

    /** Bando che contiene il documento del commissario. */
    private Optional<Folder> parentCall(Session session, String documentId) {
        try {
            return Optional.ofNullable(session.getObject(documentId))
                    .filter(Document.class::isInstance)
                    .map(Document.class::cast)
                    .flatMap(document -> document.getParents().stream().findFirst());
        } catch (RuntimeException e) {
            LOGGER.warn("Unable to read the call of commission member {}", documentId, e);
            return Optional.empty();
        }
    }

    private Map<String, Object> callInfo(Folder call) {
        final Map<String, Object> map = new HashMap<>();
        map.put("id", call.getId());
        map.put("objectTypeId", call.getType().getId());
        map.put("codice", call.getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()));
        map.put("descrizione", call.getPropertyValue(JCONONPropertyIds.CALL_DESCRIZIONE.value()));
        map.put("profilo", call.getPropertyValue(JCONONPropertyIds.CALL_PROFILO.value()));
        map.put("struttura", call.getPropertyValue(JCONONPropertyIds.CALL_STRUTTURA_DESTINATARIA.value()));
        map.put("sede", call.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()));
        Optional.ofNullable(call.<Calendar>getPropertyValue(JCONONPropertyIds.CALL_DATA_FINE_INVIO_DOMANDE.value()))
                .ifPresent(fine -> map.put("dataFine", fine.getTimeInMillis()));
        return map;
    }

    private static Map<String, Object> page(List<Map<String, Object>> items, long nextSkip, boolean hasMore, long total) {
        final Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        body.put("nextSkip", nextSkip);
        body.put("hasMore", hasMore);
        body.put("total", total);
        return body;
    }

    /** Dati dell'utenza Alfresco; notFound se l'utente non esiste (più). */
    private Map<String, Object> account(BindingSession bindingSession, String username) {
        final Map<String, Object> account = new HashMap<>();
        account.put("username", username);
        try {
            final CMISUser user = userService.loadUser(username, bindingSession);
            account.put("cognome", user.getLastName());
            account.put("nome", user.getFirstName());
            account.put("email", user.getEmail());
            account.put("emailEsterna", user.getEmailesterno());
            account.put("telefono", Optional.ofNullable(user.getTelephone()).orElse(user.getMobile()));
            account.put("matricola", user.getMatricola());
            account.put("codiceFiscale", user.getCodicefiscale());
            account.put("ldap", Boolean.TRUE.equals(user.getLdapuser()));
            account.put("disabilitata", Boolean.TRUE.equals(user.getDisableAccount()) || Boolean.FALSE.equals(user.getEnabled()));
        } catch (Exception e) {
            LOGGER.debug("User {} not found", username, e);
            account.put("notFound", true);
        }
        return account;
    }

    /** Parole del filtro, senza caratteri speciali della ricerca full-text. */
    private static List<String> words(String filter) {
        return Arrays.stream(Optional.ofNullable(filter).orElse("").trim().split("\\s+"))
                .map(word -> word.replaceAll("[\\\\'\"*?%()]", ""))
                .filter(word -> !word.isEmpty())
                .collect(Collectors.toList());
    }

    private static String trim(Object value) {
        if (value == null) {
            return null;
        }
        final String s = String.valueOf(value).trim();
        return s.isEmpty() ? null : s;
    }

    private static String normalize(String value) {
        return value == null ? "" : java.text.Normalizer.normalize(value, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase(Locale.ROOT).replaceAll("\\s+", " ").trim();
    }
}
