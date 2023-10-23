package it.cnr.si.cool.jconon.repository;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "commission")
@Getter
@Setter
public class CommissionConfProperties {
    private Boolean gender;
    private String url;
}
