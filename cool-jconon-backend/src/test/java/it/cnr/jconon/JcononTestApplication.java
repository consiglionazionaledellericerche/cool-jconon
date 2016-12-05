package it.cnr.jconon;

import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.context.annotation.ImportResource;

/**
 * Created by francesco on 05/12/16.
 */

@SpringBootApplication(exclude = FreeMarkerAutoConfiguration.class)
@ImportResource({"classpath*:META-INF/cool-common-web-context.xml", "classpath*:META-INF/cool-model-context.xml"})
public class JcononTestApplication {
}
