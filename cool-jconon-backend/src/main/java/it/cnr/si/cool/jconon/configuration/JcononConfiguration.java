/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
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

import it.cnr.cool.service.I18nServiceLocation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class JcononConfiguration {
	private static final Logger LOGGER = LoggerFactory.getLogger(JcononConfiguration.class);
	
	private List<String> locations = Arrays.asList("i18n.cool-jconon", "pages.call.call", "pages.call.convocazione");
	
	@Bean(name = "jcononI18nServiceLocation")
	public I18nServiceLocation i18nServiceLocation() {
        LOGGER.info("loading i18n {}", locations);
        I18nServiceLocation fpI18nServiceLocation = new I18nServiceLocation();
        fpI18nServiceLocation.setLocations(locations);
        return fpI18nServiceLocation;
    }	
}
