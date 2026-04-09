package it.cnr.si.cool.jconon.rest.openapi.model;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import it.cnr.si.cool.jconon.util.FilterType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springdoc.api.annotations.ParameterObject;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.PositiveOrZero;
import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@ParameterObject  // springdoc-openapi: esplode i campi come query params
public class CallParamsDTO {

    @PositiveOrZero
    @Parameter(description = "Pagina richiesta", required = true, schema = @Schema(type = "integer", defaultValue = "0"))
    private Integer page;

    @Max(100)
    @Parameter(description = "Numero di elementi per pagina", required = true, schema = @Schema(type = "integer", defaultValue = "20"))
    private Integer offset;

    @Parameter(description = "Tipo di bando")
    private String type;

    @Parameter(description = "Tipo di filtro (ALL, ACTIVE, EXPIRED)", required = true)
    private FilterType filterType;

    @Parameter(description = "Codice del bando")
    private String callCode;

    @Parameter(description = "Data inizio scadenza", example = "2026-04-09")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate inizioScadenza;

    @Parameter(description = "Data fine scadenza", example = "2026-04-09")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fineScadenza;

    @Parameter(description = "Profilo richiesto")
    private String profile;

    @Parameter(description = "Numero della gazzetta")
    private String gazzetteNumber;

    @Parameter(description = "Data della gazzetta")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate gazzetteDate;

    @Parameter(description = "Requisiti richiesti")
    private String requirements;

    @Parameter(description = "Struttura")
    private String struttura;

    @Parameter(description = "Sede")
    private String sede;

    @Parameter(description = "Dalla data inPA - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dallaDataInPA;

    @Parameter(description = "Alla data inPA - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate allaDataInPA;

    @Parameter(description = "Dalla data Graduatoria - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dallaDataGraduatoria;

    @Parameter(description = "Alla data Graduatoria - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate allaDataGraduatoria;

    @Parameter(description = "Dettagli RDP")
    private Boolean detailRdP;

    @Parameter(description = "Dettagli Commissione")
    private Boolean detailCommission;
}