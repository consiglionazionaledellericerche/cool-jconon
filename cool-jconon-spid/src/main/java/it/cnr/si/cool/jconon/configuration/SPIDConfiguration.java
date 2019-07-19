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

package it.cnr.si.cool.jconon.configuration;

import it.cnr.si.cool.jconon.spid.rest.SPID;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SPIDConfiguration {
    @Bean
    public ServletRegistrationBean publicJersey() {
        ServletRegistrationBean publicJersey
                = new ServletRegistrationBean(new ServletContainer(new JerseySPIDConfig()));
        publicJersey.addUrlMappings("/spid/*");
        publicJersey.setName("Public SPID Jersey");
        publicJersey.setLoadOnStartup(0);
        return publicJersey;
    }

    public class JerseySPIDConfig extends ResourceConfig {
        public JerseySPIDConfig() {
            register(SPID.class);
        }
    }
}

