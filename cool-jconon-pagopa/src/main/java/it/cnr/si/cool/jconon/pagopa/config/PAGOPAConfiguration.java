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

package it.cnr.si.cool.jconon.pagopa.config;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import feign.Feign;
import feign.Retryer;
import feign.auth.BasicAuthRequestInterceptor;
import feign.codec.ErrorDecoder;
import feign.gson.GsonDecoder;
import feign.gson.GsonEncoder;
import feign.httpclient.ApacheHttpClient;
import it.cnr.si.cool.jconon.pagopa.repository.Pagopa;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(PAGOPAConfigurationProperties.class)
public class PAGOPAConfiguration {
    private final PAGOPAConfigurationProperties properties;

    public PAGOPAConfiguration(PAGOPAConfigurationProperties properties) {
        this.properties = properties;
    }

    @Bean("pagopa")
    public Pagopa initPagopa() {
        Gson gsonParser = new GsonBuilder().create();

        return Feign.builder()
                .client(new ApacheHttpClient())
                .decoder(new GsonDecoder(gsonParser))
                .encoder(new GsonEncoder(gsonParser))
                .requestInterceptor(new BasicAuthRequestInterceptor(properties.getGovpay().getUsername(), properties.getGovpay().getPassword()))
                .errorDecoder(new ErrorDecoder.Default())
                .retryer(new Retryer.Default())
                .target(Pagopa.class, properties.getGovpay().getUrl());
    }

    @Bean("pagopaDownload")
    public Pagopa initPagopaDownload() {
        Gson gsonParser = new GsonBuilder().create();

        return Feign.builder()
                .encoder(new GsonEncoder(gsonParser))
                .requestInterceptor(new BasicAuthRequestInterceptor(properties.getGovpay().getUsername(), properties.getGovpay().getPassword()))
                .errorDecoder(new ErrorDecoder.Default())
                .retryer(new Retryer.Default())
                .target(Pagopa.class, properties.getGovpay().getUrl());
    }

}
