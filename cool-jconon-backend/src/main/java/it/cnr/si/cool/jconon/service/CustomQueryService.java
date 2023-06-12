package it.cnr.si.cool.jconon.service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import it.cnr.cool.service.QueryService;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletRequest;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Primary
public class CustomQueryService extends QueryService {

    public static final String LOAD_LABELS = "loadLabels", ITEMS1 = "items", RELATIONSHIPS = "relationships", PARENT = "parent", LABELS = "labels";
    @Autowired
    private CallService callService;

    @Override
    public Map<String, Object> query(HttpServletRequest req, Session cmisSession) {
        final Map<String, Object> result = super.query(req, cmisSession);
        if (Optional.ofNullable(req.getParameter(LOAD_LABELS)).isPresent()) {
            final List items = Optional.ofNullable(result.get(ITEMS1))
                    .filter(List.class::isInstance)
                    .map(List.class::cast)
                    .orElse(Collections.emptyList());
            items.forEach(o -> {
                final Optional<String> callId = Optional.ofNullable(o)
                        .filter(Map.class::isInstance)
                        .map(Map.class::cast)
                        .flatMap(map -> Optional.ofNullable(map.get(RELATIONSHIPS)))
                        .filter(Map.class::isInstance)
                        .map(Map.class::cast)
                        .flatMap(map -> Optional.ofNullable(map.get(PARENT)))
                        .filter(List.class::isInstance)
                        .map(List.class::cast)
                        .flatMap(list -> Optional.ofNullable(list.get(0)))
                        .filter(Map.class::isInstance)
                        .map(Map.class::cast)
                        .flatMap(map -> Optional.ofNullable(map.get(PropertyIds.OBJECT_ID)))
                        .filter(String.class::isInstance)
                        .map(String.class::cast);
                if (callId.isPresent()) {
                    final JsonObject jsonLabels = callService.getJSONLabels(new ObjectIdImpl(callId.get()), cmisSession);
                    Gson gson = new Gson();
                    if (jsonLabels != null) {
                        Optional.ofNullable(o)
                                .filter(Map.class::isInstance)
                                .map(Map.class::cast)
                                .ifPresent(map -> {
                                    map.put(LABELS, gson.fromJson(jsonLabels, Map.class));
                                });
                    }
                }
            });
        }
        return result;
    }
}
