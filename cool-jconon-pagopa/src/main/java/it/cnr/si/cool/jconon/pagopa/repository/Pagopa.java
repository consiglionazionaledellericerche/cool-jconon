/*
 * Copyright (C) 2023 Consiglio Nazionale delle Ricerche
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
package it.cnr.si.cool.jconon.pagopa.repository;

import feign.Headers;
import feign.Param;
import feign.RequestLine;
import it.cnr.si.cool.jconon.pagopa.model.AggiornaPendenza;
import it.cnr.si.cool.jconon.pagopa.model.MovimentoCassaPagopa;
import it.cnr.si.cool.jconon.pagopa.model.Pendenza;
import it.cnr.si.cool.jconon.pagopa.model.PendenzaResponse;
import it.cnr.si.cool.jconon.pagopa.model.pagamento.RiferimentoAvviso;
import it.cnr.si.cool.jconon.pagopa.model.pagamento.RiferimentoAvvisoResponse;

import java.util.List;

@Headers({"Content-Type: application/json"})
public interface Pagopa {

    @RequestLine("PUT /backend/api/pendenze/rs/basic/v2/pendenze/{idA2A}/{idPendenza}?stampaAvviso={stampaAvviso}")
    PendenzaResponse creaPendenza(@Param("idA2A") String application, @Param("idPendenza") Long idPendenza, @Param("stampaAvviso") Boolean stampaAvviso, Pendenza pendenza);

    @RequestLine("PATCH /backend/api/pendenze/rs/basic/v2/pendenze/{idA2A}/{idPendenza}")
    @Headers({"Content-Type: application/json"})
    void aggiornaPendenza(@Param("idA2A") String application, @Param("idPendenza") Long idPendenza, List<AggiornaPendenza> aggiornaPendenza);

    @Headers({"Accept: application/pdf"})
    @RequestLine("GET /backend/api/pendenze/rs/basic/v2/avvisi/{idDominio}/{numeroAvviso}")
    byte[] stampaAvviso(@Param("idDominio") String idDominio, @Param("numeroAvviso") String numeroAvviso);

    @Headers({"Accept: application/pdf"})
    @RequestLine("GET /backend/api/pendenze/rs/basic/v2/rpp/{idDominio}/{iuv}/{ccp}/rt?visualizzaSoggettoDebitore={visualizzaDebitore}")
    byte[] stampaRt(@Param("idDominio") String idDominio, @Param("iuv") String iuv, @Param("ccp") String ccp, @Param("visualizzaDebitore") boolean visualizzaDebitore);

    @RequestLine("POST /backend/api/ragioneria/rs/basic/v2/riconciliazioni/{idDominio}")
    MovimentoCassaPagopa riconciliaIncasso(@Param("idDominio") String dominio, MovimentoCassaPagopa movimentoCassaPagopa);

    @RequestLine("POST /frontend/api/pagamento/rs/basic/v2/pagamenti")
    @Headers({"Content-Type: application/json"})
    RiferimentoAvvisoResponse pagaAvviso(RiferimentoAvviso riferimentoAvviso);
    @RequestLine("GET /frontend/api/pagamento/rs/basic/v2/pagamenti/{id}")
    @Headers({"Content-Type: application/json"})
    RiferimentoAvvisoResponse getAvviso(@Param("id") String id);

}