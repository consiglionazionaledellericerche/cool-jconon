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

package it.cnr.si.cool.jconon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ImportResource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.tuckey.web.filters.urlrewrite.UrlRewriteFilter;


@SpringBootApplication(exclude = FreeMarkerAutoConfiguration.class)
@ImportResource({"classpath*:META-INF/cool-common-web-context.xml", "classpath*:META-INF/cool-model-context.xml"})
@EnableScheduling
public class CoolJcononApplication {

	@Bean
	public UrlRewriteFilter getUrlRewriteFilter() {
		UrlRewriteFilter urlRewriteFilter = new UrlRewriteFilter();
		return urlRewriteFilter;

	}

	public static void main(String[] args) {
		SpringApplication.run(CoolJcononApplication.class, args);
	}
}
