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
public class ApplicationsParamsDTO {
    @PositiveOrZero
    @Parameter(description = "Pagina richiesta", required = true, schema = @Schema(type = "integer", defaultValue = "0"))
    private Integer page;

    @Max(100)
    @Parameter(description = "Numero di elementi per pagina", required = true, schema = @Schema(type = "integer", defaultValue = "20"))
    private Integer offset;

    private String user;

    @Parameter(description = "Fetch call")
    private Boolean fetchCall = false;

    private String type;
    private FilterType filterType;
    private String callCode;
    private String firstname;
    private String lastname;
    private String codicefiscale;
    private String callId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate inizioScadenza;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate fineScadenza;

    private String applicationStatus;

    @Parameter(description = "Num. Prot. Graduatoria")
    private String numProtocolloGraduatoria;

    @Parameter(description = "Dalla Data Prot. Graduatoria - formato yyyy-MM-dd" )
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dallaDataProtGraduatoria;

    @Parameter(description = "Alla Data Prot. Graduatoria - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate allaDataProtGraduatoria;

    @Parameter(description = "Num. Prot. Scorrimento")
    private String numProtocolloScorrimento;

    @Parameter(description = "Dalla Data Prot. Scorrimento - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dallaDataProtScorrimento;

    @Parameter(description = "Alla Data Prot. Scorrimento - formato yyyy-MM-dd")
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate allaDataProtScorrimento;

}