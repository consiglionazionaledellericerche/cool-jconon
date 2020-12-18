/*
 * Copyright (C) 2020 Consiglio Nazionale delle Ricerche
 *       This program is free software: you can redistribute it and/or modify
 *        it under the terms of the GNU Affero General Public License as
 *        published by the Free Software Foundation, either version 3 of the
 *        License, or (at your option) any later version.
 *
 *        This program is distributed in the hope that it will be useful,
 *        but WITHOUT ANY WARRANTY; without even the implied warranty of
 *        MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *       GNU Affero General Public License for more details.
 *
 *       You should have received a copy of the GNU Affero General Public License
 *       along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

package it.cnr.si.cool.jconon.io.repository;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import it.cnr.si.cool.jconon.io.model.*;

@Headers({"Content-Type: application/json"})
public interface IO {

    @RequestLine("POST /services")
    ServiceWithSubscriptionKeys createService(ServicePayload body);

    @RequestLine("GET /messages/{fiscal_code}/{id}")
    MessageResponseWithContent getMessage(@Param("fiscal_code") String fiscalCode, @Param("id") String id);

    @RequestLine("GET /profiles/{fiscal_code}")
    LimitedProfile getProfile(@Param("fiscal_code") String fiscalCode);

    @RequestLine("POST /profiles}")
    LimitedProfile getProfileByPOST(GetLimitedProfileByPOSTPayload payload);

    @RequestLine("GET /services/{service_id}")
    ServiceWithSubscriptionKeys getService(@Param("service_id") String serviceId);

    @RequestLine("GET /subscriptions-feed/{date}")
    SubscriptionsFeed getSubscriptionsFeedForDate(@Param("date") String date);

    @RequestLine("GET /services")
    ServiceIdCollection getUserServices();

    @RequestLine("PUT /services/{service_id}/keys")
    SubscriptionKeys regenerateServiceKey(@Param("service_id") String serviceId, SubscriptionKeyTypePayload body);

    @RequestLine("POST /messages/{fiscal_code}")
    InlineResponse201 submitMessageforUser(@Param("fiscal_code") String fiscalCode, NewMessage message);

    @RequestLine("POST /messages")
    InlineResponse201 submitMessageforUserWithFiscalCodeInBody(NewMessage message);

    @RequestLine("PUT /messages/{service_id}")
    ServiceWithSubscriptionKeys updateService(@Param("service_id") String serviceId, ServicePayload body);

    @RequestLine("PUT /organizations/{organization_fiscal_code}/logo")
    void uploadOrganizationLogo(@Param("organization_fiscal_code") String organizationFiscalCode, Logo body);

    @RequestLine("PUT /services/{service_id}/logo")
    void uploadServiceLogo(@Param("service_id") String serviceId, Logo body);

}