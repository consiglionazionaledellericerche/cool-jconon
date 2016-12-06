package it.cnr.jconon;

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
