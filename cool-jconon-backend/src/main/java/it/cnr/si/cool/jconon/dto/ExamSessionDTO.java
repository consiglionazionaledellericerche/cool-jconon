package it.cnr.si.cool.jconon.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.google.gson.annotations.Expose;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Calendar;

@Getter
@Setter
@Builder
@JsonPropertyOrder({ "firstName", "lastName", "birthdate", "fiscalCode", "documentType",
        "documentNumber", "documentDate", "documentIssuedBy", "location", "date", "documentId", "uid" })
public class ExamSessionDTO {
    @Expose(serialize=true) private String uid;
    @Expose(serialize=true) private String firstName;
    @Expose(serialize=true) private String lastName;
    @Expose(serialize=true) private String birthdate;
    @Expose(serialize=true) private String fiscalCode;

    @Expose(serialize=true) private String documentType;
    @Expose(serialize=true) private String documentNumber;
    @Expose(serialize=true) private String documentDate;
    @Expose(serialize=true) private String documentIssuedBy;

    private String documentId;
    private String location;
    private Calendar date;
}
