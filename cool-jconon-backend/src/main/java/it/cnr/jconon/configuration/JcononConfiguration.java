package it.cnr.jconon.configuration;

import it.cnr.cool.service.I18nServiceLocation;

import java.util.Arrays;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
