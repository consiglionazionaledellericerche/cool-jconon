/*
 * Copyright (C) 2021 Consiglio Nazionale delle Ricerche
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

package it.cnr.si.cool.jconon.configuration;

import it.cnr.si.firmadigitale.firma.arss.ArubaSignServiceClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Properties;

@Configuration
@ConditionalOnProperty("arubaRemoteSignService.url")
public class FirmaDigitaleConfiguration {

    @Value("${arubaRemoteSignService.url}")
    private String url;
    @Value("${arubaRemoteSignService.certId}")
    private String certId;
    @Value("${arubaRemoteSignService.typeOtpAuth}")
    private String typeOtpAuth;

    @Bean
    public ArubaSignServiceClient initFirmaDigitale() {
        ArubaSignServiceClient arubaSignServiceClient = new ArubaSignServiceClient();
        Properties properties = new Properties();
        properties.setProperty("arubaRemoteSignService.url", url);
        properties.setProperty("arubaRemoteSignService.certId", certId);
        properties.setProperty("arubaRemoteSignService.typeOtpAuth", typeOtpAuth);
        arubaSignServiceClient.setProps(properties);
        return arubaSignServiceClient;
    }

}
