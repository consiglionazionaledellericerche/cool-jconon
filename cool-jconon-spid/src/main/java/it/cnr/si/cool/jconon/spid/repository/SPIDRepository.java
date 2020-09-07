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

package it.cnr.si.cool.jconon.spid.repository;

import com.hazelcast.core.HazelcastInstance;
import it.cnr.si.cool.jconon.spid.model.SPIDRequest;
import org.opensaml.saml2.core.AuthnRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Repository;

import java.util.Map;

@Repository
public class SPIDRepository {
    public static final String SPID_REQUEST = "spid-request";
    private static final Logger LOGGER = LoggerFactory.getLogger(SPIDRepository.class);

    @Autowired
    private HazelcastInstance hazelcastInstance;

    @CachePut(value = SPID_REQUEST, key = "#authRequest.ID")
    public SPIDRequest register(AuthnRequest authRequest) {
        return new SPIDRequest(authRequest.getID(), authRequest.getIssueInstant(), authRequest.getDestination());
    }

    public Map<String, SPIDRequest> get() {
        return hazelcastInstance.getMap(SPID_REQUEST);
    }

    @CacheEvict(value = SPID_REQUEST, key = "#id")
    public void removeAuthnRequest(String id) {
        LOGGER.info("cleared spid request with id {}", id);
    }

    @CacheEvict(value = SPID_REQUEST, allEntries = true)
    public void removeAllAuthnRequest() {
        LOGGER.info("cleared all spid request");
    }

}
