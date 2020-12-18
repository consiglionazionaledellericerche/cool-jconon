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
 * MessageContent
 */
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MessageContent {
    @JsonProperty("subject")
    private String subject = null;

    @JsonProperty("markdown")
    private String markdown = null;

    @JsonProperty("payment_data")
    private PaymentData paymentData = null;

    @JsonProperty("prescription_data")
    private PrescriptionData prescriptionData = null;

    @JsonProperty("due_date")
    private String dueDate = null;
}

