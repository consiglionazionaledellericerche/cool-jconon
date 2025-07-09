package it.cnr.si.cool.jconon.rest.openapi;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@SecuritySchemes({
        @SecurityScheme(
                name = "basicAuth",
                type = SecuritySchemeType.HTTP,
                scheme = "basic",
                in = SecuritySchemeIn.HEADER
        ),
        @SecurityScheme(
                name = "cookieAuth",
                type = SecuritySchemeType.APIKEY,
                in = SecuritySchemeIn.HEADER,
                paramName = "X-alfresco-ticket"
        )

})
public class OpenApiSecurityConfig {
        @Value("${keycloak.auth-server-url}")
        private String authserverurl;
        @Value("${keycloak.realm}")
        private String realm;

        @Bean
        public OpenAPI customOpenAPI() {
                return new OpenAPI()
                .components(new Components()
                        .addSecuritySchemes("oidcAuth",
                                new io.swagger.v3.oas.models.security.SecurityScheme()
                                        .type(io.swagger.v3.oas.models.security.SecurityScheme.Type.OPENIDCONNECT)
                                        .openIdConnectUrl(String.format("%s/realms/%s/.well-known/openid-configuration", authserverurl, realm))
                        )
                );
        }
}