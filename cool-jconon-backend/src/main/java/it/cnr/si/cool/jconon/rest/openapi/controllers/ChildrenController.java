package it.cnr.si.cool.jconon.rest.openapi.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.Max;
import javax.validation.constraints.PositiveOrZero;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@RestController
@RequestMapping(ApiRoutes.V1_CHILDREN)
@Tag(name = "Children", description = "Ricerca dei documenti allegati")
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "oidcAuth"),
        @SecurityRequirement(name = "cookieAuth")
})
@Validated
public class ChildrenController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChildrenController.class);
    @Autowired
    private CMISService cmisService;

    @Operation(summary = "Lista dei documenti figli", description = "Restituisce un elenco paginato dei documenti figli")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista dei documenti restituita con successo")
    })
    @GetMapping
    public ResponseEntity<Map<String, Object>> list(HttpServletRequest req,
                                                    @Parameter(
                                                            description = "Pagina richiesta",
                                                            required = true,
                                                            schema = @Schema(type = "integer", defaultValue = "0")) @PositiveOrZero @RequestParam("page") Integer page,
                                                    @Parameter(
                                                            description = "Numero di elementi per pagina",
                                                            required = true,
                                                            schema = @Schema(type = "integer", defaultValue = "20")) @Max(100) @RequestParam("offset") Integer offset,
                                                    @RequestParam("parentId") String parentId,
                                                    @RequestParam(name = "type", required = false) String type,
                                                    @RequestParam(name = "fetchObject", required = false, defaultValue = "false") Boolean fetchObject) {
        Session session = cmisService.getCurrentCMISSession(req);
        final OperationContext defaultContext = session.getDefaultContext();
        defaultContext.setMaxItemsPerPage(offset);
        Map<String, Object> model = new HashMap<String, Object>();

        Criteria criteriaChildren = CriteriaFactory.createCriteria(
                Optional.ofNullable(type).filter(s -> !s.isEmpty()).orElse(JCONONDocumentType.JCONON_ATTACHMENT.queryName())
        );
        if (fetchObject) {
            criteriaChildren.addColumn(PropertyIds.OBJECT_ID);
        }
        criteriaChildren.add(Restrictions.inFolder(parentId));
        criteriaChildren.addOrder(Order.asc(PropertyIds.CREATION_DATE));
        ItemIterable<QueryResult> results = criteriaChildren.executeQuery(session, false, defaultContext).getPage(Integer.MAX_VALUE);

        model.put("count", results.getTotalNumItems());
        model.put("page", page);
        model.put("offset", defaultContext.getMaxItemsPerPage());
        model.put("items", StreamSupport.stream(results.skipTo(page * defaultContext.getMaxItemsPerPage())
                .getPage(defaultContext.getMaxItemsPerPage()).spliterator(), false)
                .map(queryResult -> {
                    if (fetchObject) {
                        return CMISUtil.convertToProperties(session.getObject(queryResult.<String>getPropertyValueById(PropertyIds.OBJECT_ID)));
                    }
                    return CMISUtil.convertToProperties(queryResult);
                })
                .collect(Collectors.toList()));
        return ResponseEntity.ok().body(model);
    }
}
