package it.cnr.si.cool.jconon.pagopa.model.pagamento;

import com.fasterxml.jackson.annotation.*;

import javax.annotation.Generated;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({
        "uniqueIdentifier",
        "fullName",
        "streetName",
        "civicNumber",
        "postalCode",
        "city",
        "stateProvinceRegion",
        "country",
        "e-mail"
})
@Generated("jsonschema2pojo")
public class Debtor  implements Serializable {

    @JsonProperty("uniqueIdentifier")
    private UniqueIdentifier uniqueIdentifier;
    @JsonProperty("fullName")
    private String fullName;
    @JsonProperty("streetName")
    private String streetName;
    @JsonProperty("civicNumber")
    private Object civicNumber;
    @JsonProperty("postalCode")
    private String postalCode;
    @JsonProperty("city")
    private String city;
    @JsonProperty("stateProvinceRegion")
    private String stateProvinceRegion;
    @JsonProperty("country")
    private String country;
    @JsonProperty("e-mail")
    private Object eMail;
    @JsonIgnore
    private Map<String, Object> additionalProperties = new HashMap<String, Object>();

    @JsonProperty("uniqueIdentifier")
    public UniqueIdentifier getUniqueIdentifier() {
        return uniqueIdentifier;
    }

    @JsonProperty("uniqueIdentifier")
    public void setUniqueIdentifier(UniqueIdentifier uniqueIdentifier) {
        this.uniqueIdentifier = uniqueIdentifier;
    }

    @JsonProperty("fullName")
    public String getFullName() {
        return fullName;
    }

    @JsonProperty("fullName")
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    @JsonProperty("streetName")
    public String getStreetName() {
        return streetName;
    }

    @JsonProperty("streetName")
    public void setStreetName(String streetName) {
        this.streetName = streetName;
    }

    @JsonProperty("civicNumber")
    public Object getCivicNumber() {
        return civicNumber;
    }

    @JsonProperty("civicNumber")
    public void setCivicNumber(Object civicNumber) {
        this.civicNumber = civicNumber;
    }

    @JsonProperty("postalCode")
    public String getPostalCode() {
        return postalCode;
    }

    @JsonProperty("postalCode")
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    @JsonProperty("city")
    public String getCity() {
        return city;
    }

    @JsonProperty("city")
    public void setCity(String city) {
        this.city = city;
    }

    @JsonProperty("stateProvinceRegion")
    public String getStateProvinceRegion() {
        return stateProvinceRegion;
    }

    @JsonProperty("stateProvinceRegion")
    public void setStateProvinceRegion(String stateProvinceRegion) {
        this.stateProvinceRegion = stateProvinceRegion;
    }

    @JsonProperty("country")
    public String getCountry() {
        return country;
    }

    @JsonProperty("country")
    public void setCountry(String country) {
        this.country = country;
    }

    @JsonProperty("e-mail")
    public Object geteMail() {
        return eMail;
    }

    @JsonProperty("e-mail")
    public void seteMail(Object eMail) {
        this.eMail = eMail;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }

}