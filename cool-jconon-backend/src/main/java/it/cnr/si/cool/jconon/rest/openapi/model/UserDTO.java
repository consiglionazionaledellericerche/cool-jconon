package it.cnr.si.cool.jconon.rest.openapi.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {
    private String ruolo;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private Integer matricola;
    private String emailesterno;
    private String emailcertificatoperpuk;
    private String codicefiscale;
}
