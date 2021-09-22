/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

package it.cnr.si.cool.jconon.spid.config;

import it.cnr.si.cool.jconon.spid.model.IdpEntry;
import it.cnr.si.cool.jconon.spid.model.Issuer;
import it.cnr.si.cool.jconon.spid.model.KeyStore;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

@ConfigurationProperties(prefix = "spid")
public class SpidProperties {

    private Map<String, IdpEntry> idp = new HashMap<>();

    private KeyStore keystore;

    private Integer attributeConsumingServiceIndex;

    private Integer assertionConsumerServiceIndex;

    private Issuer issuer;

    private Boolean enable;

    private String destination;

    private String algorithm;
    
    private String privateSignature;

    private String signature;

    public Map<String, IdpEntry> getIdp() {
        return idp;
    }

    public void setIdp(Map<String, IdpEntry> idp) {
        this.idp = idp;
    }

    public KeyStore getKeystore() {
        return keystore;
    }

    public void setKeystore(KeyStore keystore) {
        this.keystore = keystore;
    }

    public Integer getAttributeConsumingServiceIndex() {
        return attributeConsumingServiceIndex;
    }

    public void setAttributeConsumingServiceIndex(Integer attributeConsumingServiceIndex) {
        this.attributeConsumingServiceIndex = attributeConsumingServiceIndex;
    }

    public Integer getAssertionConsumerServiceIndex() {
        return assertionConsumerServiceIndex;
    }

    public void setAssertionConsumerServiceIndex(Integer assertionConsumerServiceIndex) {
        this.assertionConsumerServiceIndex = assertionConsumerServiceIndex;
    }

    public Issuer getIssuer() {
        return issuer;
    }

    public void setIssuer(Issuer issuer) {
        this.issuer = issuer;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getAlgorithm() {
        return algorithm;
    }

    public void setAlgorithm(String algorithm) {
        this.algorithm = algorithm;
    }

    public String getPrivateSignature() {
        return privateSignature;
    }

    public void setPrivateSignature(String privateSignature) {
        this.privateSignature = privateSignature;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }
}
