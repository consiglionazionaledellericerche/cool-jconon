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
import lombok.Getter;
import lombok.Setter;

/**
 * NewMessage
 */
@Getter
@Setter
public class NewMessage {
    @JsonProperty("time_to_live")
    private Integer timeToLive = null;

    @JsonProperty("content")
    private MessageContent2 content = null;

    @JsonProperty("default_addresses")
    private NewMessageDefaultAddresses defaultAddresses = null;

    @JsonProperty("fiscal_code")
    private String fiscalCode = null;
}

