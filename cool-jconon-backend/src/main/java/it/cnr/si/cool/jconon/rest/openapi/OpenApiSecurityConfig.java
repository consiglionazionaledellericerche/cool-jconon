package it.cnr.si.cool.jconon.rest.openapi;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
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
                name = "bearerAuth",
                type = SecuritySchemeType.HTTP,
                scheme = "bearer",
                bearerFormat = "JWT",
                in = SecuritySchemeIn.HEADER
        )
})

public class OpenApiSecurityConfig {
    // Definizione dello schema di sicurezza BASIC
}