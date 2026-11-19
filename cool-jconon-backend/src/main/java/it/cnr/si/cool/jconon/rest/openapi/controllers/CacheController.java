package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.CommissionConfProperties;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.AbstractMap;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping(ApiRoutes.V1_CACHE)
public class CacheController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CacheController.class);

    @Autowired
    private CacheRepository cacheRepository;
    @Autowired
    private CommissionConfProperties commissionConfProperties;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put(CacheRepository.JSONLIST_CALL_TYPE, cacheRepository.getCallType());
        model.put(
                CacheRepository.JSONLIST_APPLICATION_NO_ASPECTS_ITALIAN,
                cacheRepository.getApplicationNoAspectsItalian()
        );
        model.put(
                CacheRepository.JSONLIST_APPLICATION_NO_ASPECTS_FOREIGN,
                cacheRepository.getApplicationNoAspectsForeign()
        );
        return ResponseEntity.ok().body(model);
    }

    /**
     * Elenchi necessari alla gestione del bando (sezioni, aspect e allegati selezionabili per la domanda).
     */
    @GetMapping("/call-management")
    public ResponseEntity<Map<String, Object>> callManagement(HttpServletRequest req) {
        Map<String, Object> model = new HashMap<String, Object>();
        model.put(CacheRepository.JSONLIST_CALL_TYPE, cacheRepository.getCallType());
        model.put(CacheRepository.JSONLIST_AFFIX_APPLICATION, cacheRepository.getAffixApplication());
        model.put(CacheRepository.JSONLIST_APPLICATION_FIELDS_NOT_REQUIRED, cacheRepository.getApplicationFieldsNotRequired());
        // campi del bando, per i segnaposto [[...]] nelle note di esclusioni, comunicazioni e convocazioni
        model.put(CacheRepository.JSONLIST_CALL_FIELDS, cacheRepository.getCallFields());
        model.put(CacheRepository.JSONLIST_APPLICATION_ASPECTS, cacheRepository.getApplicationAspects());
        model.put(CacheRepository.JSONLIST_APPLICATION_ATTACHMENTS, cacheRepository.getApplicationAttachments());
        model.put(CacheRepository.JSONLIST_APPLICATION_CURRICULUMS, cacheRepository.getApplicationCurriculums());
        model.put(CacheRepository.JSONLIST_APPLICATION_SCHEDE_ANONIME, cacheRepository.getApplicationSchedeAnonime());
        model.put(CacheRepository.JSONLIST_APPLICATION_PRODOTTI, cacheRepository.getApplicationProdotti());
        model.put(CacheRepository.JSONLIST_CALL_ATTACHMENTS, cacheRepository.getCallAttachments());
        model.put("commissionVideoGender", Boolean.TRUE.equals(commissionConfProperties.getGender()));
        return ResponseEntity.ok().body(model);
    }

    @GetMapping("/labels")
    public ResponseEntity<Map<String, String>> labels(HttpServletRequest req) {
        return ResponseEntity.ok().body(
                Stream.concat(cacheRepository.getAttachments().stream(),cacheRepository.getApplicationCurriculums().stream())
                        .map(objectTypeCache -> new AbstractMap.SimpleEntry<>(
                                objectTypeCache.getId(),
                                Optional.ofNullable(objectTypeCache.getDefaultLabel()).orElseGet(() -> objectTypeCache.getDescription())))
                        .distinct()
                        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue))
        );
    }

}
