package it.cnr.si.cool.jconon.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.session.hazelcast.config.annotation.web.http.HazelcastHttpSessionConfiguration;

@Configuration(proxyBeanMethods = false)
@Profile("keycloak")
public class HazelcastSessionConfiguration extends HazelcastHttpSessionConfiguration {
}
