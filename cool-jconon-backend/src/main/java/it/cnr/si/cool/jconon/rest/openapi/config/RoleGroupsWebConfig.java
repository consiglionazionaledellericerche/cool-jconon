package it.cnr.si.cool.jconon.rest.openapi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class RoleGroupsWebConfig implements WebMvcConfigurer {

    @Autowired
    private RoleGroupsInterceptor roleGroupsInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(roleGroupsInterceptor)
                .addPathPatterns("/openapi/**")
                .excludePathPatterns("/openapi/security/**");
    }
}
