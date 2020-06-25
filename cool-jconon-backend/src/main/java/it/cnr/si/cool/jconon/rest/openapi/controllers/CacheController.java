package it.cnr.si.cool.jconon.rest.openapi.controllers;

import it.cnr.si.cool.jconon.repository.CacheRepository;
import it.cnr.si.cool.jconon.repository.dto.ObjectTypeCache;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(ApiRoutes.V1_CACHE)
public class CacheController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CacheController.class);

    @Autowired
    private CacheRepository cacheRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req) {
        Map<String, Object> model = new HashMap<String, Object>();
        final List<ObjectTypeCache> callType = cacheRepository.getCallType();
        model.put(CacheRepository.JSONLIST_CALL_TYPE, callType);
        return ResponseEntity.ok().body(model);
    }
}
