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

package it.cnr.si.cool.jconon.io.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A set of metadata properties related to this service.
 */
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ServiceMetadata {
    @JsonProperty("description")
    private String description = null;

    @JsonProperty("web_url")
    private String webUrl = null;

    @JsonProperty("app_ios")
    private String appIos = null;

    @JsonProperty("app_android")
    private String appAndroid = null;

    @JsonProperty("tos_url")
    private String tosUrl = null;

    @JsonProperty("privacy_url")
    private String privacyUrl = null;

    @JsonProperty("address")
    private String address = null;

    @JsonProperty("phone")
    private String phone = null;

    @JsonProperty("email")
    private String email = null;

    @JsonProperty("pec")
    private String pec = null;

    @JsonProperty("cta")
    private String cta = null;

    @JsonProperty("token_name")
    private String tokenName = null;

    @JsonProperty("support_url")
    private String supportUrl = null;

    @JsonProperty("scope")
    private String scope = null;

}

