package it.cnr.si.cool.jconon.rest.openapi.controllers;

import com.fasterxml.jackson.databind.SequenceWriter;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.cool.util.CMISUtil;
import it.cnr.si.cool.jconon.cmis.model.JCONONDocumentType;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import it.cnr.si.cool.jconon.dto.ExamMoodleSessionDTO;
import it.cnr.si.cool.jconon.dto.ExamSessionDTO;
import it.cnr.si.cool.jconon.repository.ANPR;
import it.cnr.si.cool.jconon.repository.CommonRepository;
import it.cnr.si.cool.jconon.repository.dto.Comuni;
import it.cnr.si.cool.jconon.rest.openapi.utils.ApiRoutes;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.FilterType;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import it.cnr.si.opencmis.criteria.Order;
import it.cnr.si.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.PositiveOrZero;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;
import java.io.StringWriter;
import java.text.ParseException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(ApiRoutes.V1_CALL)
@Tag(name = "Call", description = "Gestione dei bandi di concorso")
@SecurityRequirements({
        @SecurityRequirement(name = "basicAuth"),
        @SecurityRequirement(name = "bearerAuth"),
})
@Validated
public class CallController {
    private static final Logger LOGGER = LoggerFactory.getLogger(CallController.class);
    @Autowired
    private CMISService cmisService;
    @Autowired
    private CallService callService;
    @Autowired
    private ANPR anpr;
    @Autowired
    private NodeMetadataService nodeMetadataService;
    @Autowired
    private CommonRepository commonRepository;

    @Operation(summary = "Lista dei bandi", description = "Restituisce un elenco paginato dei bandi filtrabili per vari criteri")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista dei bandi restituita con successo")
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
                                                    @Parameter(description = "Tipo di bando") @RequestParam(value = "type", required = false) String type,
                                                    @Parameter(description = "Tipo di filtro (ALL, ACTIVE, EXPIRED)", required = true) @RequestParam("filterType") FilterType filterType,
                                                    @Parameter(description = "Codice del bando") @RequestParam(value = "callCode", required = false) String callCode,
                                                    @Parameter(description = "Data inizio scadenza") @RequestParam(value = "inizioScadenza", required = false) LocalDate inizioScadenza,
                                                    @Parameter(description = "Data fine scadenza") @RequestParam(value = "fineScadenza", required = false) LocalDate fineScadenza,
                                                    @Parameter(description = "Profilo richiesto") @RequestParam(value = "profile", required = false) String profile,
                                                    @Parameter(description = "Numero della gazzetta") @RequestParam(value = "gazzetteNumber", required = false) String gazzetteNumber,
                                                    @Parameter(description = "Data della gazzetta") @RequestParam(value = "gazzetteDate", required = false) LocalDate gazzetteDate,
                                                    @Parameter(description = "Requisiti richiesti") @RequestParam(value = "requirements", required = false) String requirements,
                                                    @Parameter(description = "Struttura") @RequestParam(value = "struttura", required = false) String struttura,
                                                    @Parameter(description = "Sede") @RequestParam(value = "sede", required = false) String sede) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                callService.findCalls(
                        session,
                        page,
                        offset,
                        Optional.ofNullable(type).orElse(JCONONFolderType.JCONON_CALL.queryName()),
                        filterType,
                        callCode,
                        inizioScadenza,
                        fineScadenza,
                        profile,
                        gazzetteNumber,
                        gazzetteDate,
                        requirements,
                        struttura,
                        sede
                )
        );
    }

    @Operation(summary = "Select2 per bandi", description = "Restituisce una lista filtrata per il componente select2")
    @ApiResponse(responseCode = "200", description = "Select2 data")
    @GetMapping(ApiRoutes.SELECT2)
    public ResponseEntity<Map<String, Object>> select2(HttpServletRequest req,
                                                       @Parameter(description = "Filtro testo") @RequestParam(value = "filter", required = false) String filter) {
        Session session = cmisService.getCurrentCMISSession(req);
        return ResponseEntity.ok().body(
                callService.findCalls(
                        session,
                        0,
                        null,
                        JCONONFolderType.JCONON_CALL.queryName(),
                        null,
                        filter,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );
    }

    @Operation(summary = "Elenco comuni", description = "Restituisce un elenco dei comuni filtrati")
    @ApiResponse(responseCode = "200", description = "Comuni restituiti")
    @GetMapping(ApiRoutes.COMUNI)
    public ResponseEntity<Comuni> comuni(HttpServletRequest req,
                                         @Parameter(description = "Filtro da applicare", required = true) @RequestParam("filter") String filter) {
        return ResponseEntity.ok(anpr.get(filter));
    }

    @Operation(summary = "Dettagli del bando", description = "Restituisce i dettagli del bando dato un ID")
    @ApiResponse(responseCode = "200", description = "Bando trovato")
    @GetMapping(ApiRoutes.SHOW)
    public ResponseEntity<Map<String, Object>> show(HttpServletRequest req, @Parameter(description = "ID del bando", required = true) @PathVariable("id") String callId) {
        return ResponseEntity.ok().body(
                CMISUtil.convertToProperties(cmisService.getCurrentCMISSession(req).getObject(callId))
        );
    }

    @Operation(summary = "Aggiorna o crea un bando", description = "Salva un nuovo bando o aggiorna uno esistente")
    @ApiResponse(responseCode = "200", description = "Bando salvato")
    @PutMapping(ApiRoutes.UPDATE)
    public ResponseEntity<Map<String, ?>> saveCall(
            HttpServletRequest req,
            @RequestHeader(value = HttpHeaders.ORIGIN) final String origin,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Mappa delle proprietà del bando",
                    required = true
            )
            @RequestBody Map<String, ?> prop
    ) throws ParseException {
        Session session = cmisService.getCurrentCMISSession(req);

        Map<String, Object> properties = nodeMetadataService
                .populateMetadataType(session, prop, req);
        final Map<String, Object> aspectFromRequest =
                nodeMetadataService.populateMetadataAspectFromRequest(session, prop, req);
        return ResponseEntity.ok(
                CMISUtil.convertToProperties(
                        callService.save(
                                session,
                                cmisService.getCurrentBindingSession(req),
                                origin,
                                req.getLocale(),
                                cmisService.getCMISUserFromSession(req).getId(),
                                properties,
                                aspectFromRequest
                        )
                )
        );
    }

    @Operation(summary = "Elenco dei bandi per i quali si è commissari", description = "Restituisce l'elenco dei bandi per i quali si ricopre il ruolo di commissario")
    @GetMapping(ApiRoutes.COMMISSIONS)
    public ResponseEntity<List<Map<String, Serializable>>> commissions(HttpServletRequest req) {
        List<Map<String, Serializable>> commissionCalls = commonRepository.getCommissionCalls(
                cmisService.getCMISUserFromSession(req).getUserName(),
                cmisService.getCurrentCMISSession(req),
                false
        );
        return ResponseEntity.ok().body(
                commissionCalls
        );
    }

    @Operation(summary = "Dettagli delle sessioni di esame", description = "Restituisce i dettagli delle sessioni di esame del bando dato un ID")
    @ApiResponse(responseCode = "200", description = "Bando trovato, e sessioni presenti")
    @GetMapping(ApiRoutes.EXAM_SESSIONS)
    public ResponseEntity<Map<String, List<ExamSessionDTO>>> examSessions(HttpServletRequest req, @Parameter(description = "ID del bando", required = true) @PathVariable("id") String callId) {
        return ResponseEntity.ok().body(
                callService.examSessions(cmisService.getCurrentCMISSession(req), callId)
        );
    }

    @Operation(summary = "Lista dei candidati della sessione d'esame", description = "Restituisce i dettagli della sessione di esame del bando in csv")
    @ApiResponse(responseCode = "200", description = "Bando trovato, e candidati presenti")
    @PostMapping(value = ApiRoutes.EXAM_SESSIONS, produces = "text/csv")
    public void examSessionsCSV(HttpServletRequest req,
                                HttpServletResponse resp,
                                @Parameter(description = "ID del bando", required = true) @PathVariable("id") String callId,
                                @Parameter(description = "Descrizione della sessione d'esame", required = true) @RequestParam("session") String session) {
        resp.setContentType("text/csv;charset=UTF-8");
        resp.setHeader("Content-Disposition", String.format("attachment; filename=%s.csv", session));
        List<ExamSessionDTO> examSessionDTOS = callService.examSessions(cmisService.getCurrentCMISSession(req), callId).get(session);
        final CsvMapper csvMapper = new CsvMapper();
        csvMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        csvMapper.registerModule(new JavaTimeModule());

        CsvSchema csvSchema = csvMapper.schemaFor(ExamSessionDTO.class).withHeader();
        try (PrintWriter strW = resp.getWriter()) {
            SequenceWriter seqW = csvMapper.writer(csvSchema).writeValues(strW);
            examSessionDTOS.forEach(result -> {
                try {
                    seqW.write(result);
                    LOGGER.trace("Writing result{}", result);
                } catch (IOException e) {
                    LOGGER.warn("Unable to export to CSV Result {}", result, e);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }

    @Operation(summary = "Lista dei candidati e dei commissari della sessione d'esame", description = "Restituisce i dettagli della sessione di esame del bando in csv")
    @ApiResponse(responseCode = "200", description = "Bando trovato, e candidati presenti")
    @PostMapping(value = ApiRoutes.EXAM_MOODLE_SESSIONS, produces = "text/csv")
    public void examMoodleSessionsCSV(HttpServletRequest req,
                                HttpServletResponse resp,
                                @Parameter(description = "ID del bando", required = true) @PathVariable("id") String callId,
                                @Parameter(description = "Descrizione della sessione d'esame", required = true) @RequestParam("session") String session) {
        Session cmisSession = cmisService.getCurrentCMISSession(req);
        List<ExamMoodleSessionDTO> examMoodleSessionDTOS = new ArrayList<>();
        Folder call = Optional.ofNullable(cmisSession.getObject(callId))
                .filter(Folder.class::isInstance)
                .map(Folder.class::cast).orElseThrow(() -> new RuntimeException("Bando non trovato!"));
        String course2 = String.format("Bando%s",
                Optional.ofNullable(call.<String>getPropertyValue(JCONONPropertyIds.CALL_CODICE.value()))
                        .map(s -> s.substring(0, Math.min(7, s.length())))
                        .orElse("")
        );
        callService.getCommission(cmisSession, callId)
                .forEach(queryResult -> {
                    examMoodleSessionDTOS.add(
                            ExamMoodleSessionDTO.builder()
                                    .firstname(queryResult.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_NOME.value()))
                                    .lastname(queryResult.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_COGNOME.value()))
                                    .role1("valutatore")
                                    .role2("valutatore")
                                    .email(queryResult.getPropertyValueById(JCONONPropertyIds.COMMISSIONE_EMAIL.value()))
                                    .build()
                    );
                });
        callService.examSessions(cmisSession, callId)
            .get(session)
            .forEach(examSessionDTO -> {
                examMoodleSessionDTOS.add(
                        ExamMoodleSessionDTO.builder()
                                .firstname(examSessionDTO.getFirstName())
                                .lastname(examSessionDTO.getLastName())
                                .role1("candidato")
                                .role2("candidato")
                                .email(examSessionDTO.getEmail())
                                .build()
                );
        });
        examMoodleSessionDTOS
                .forEach(t -> {
                    t.setUsername(String.format(
                            "%s.%s",
                                Optional.ofNullable(t.getFirstname())
                                    .map(s -> s.replaceAll("\\s+", ""))
                                    .map(String::toLowerCase)
                                    .orElse(""),
                                Optional.ofNullable(t.getLastname())
                                    .map(s -> s.replaceAll("\\s+", ""))
                                    .map(String::toLowerCase)
                                    .orElse("")
                            )
                    );
                    t.setPassword("esercitazione");
                    t.setCourse1("esercitazione");
                    t.setCourse2(course2);
                    t.setEnrolstatus2("1");
                });

        resp.setContentType("text/csv;charset=UTF-8");
        resp.setHeader("Content-Disposition", String.format("attachment; filename=%s.csv", session));

        final CsvMapper csvMapper = new CsvMapper();
        csvMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        csvMapper.registerModule(new JavaTimeModule());

        CsvSchema csvSchema = csvMapper.schemaFor(ExamMoodleSessionDTO.class).withHeader();
        try (PrintWriter strW = resp.getWriter()) {
            SequenceWriter seqW = csvMapper.writer(csvSchema).writeValues(strW);
            examMoodleSessionDTOS.forEach(result -> {
                try {
                    seqW.write(result);
                    LOGGER.trace("Writing result{}", result);
                } catch (IOException e) {
                    LOGGER.warn("Unable to export to CSV Result {}", result, e);
                }
            });
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }
}
