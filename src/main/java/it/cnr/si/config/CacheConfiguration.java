package it.cnr.si.config;

import java.time.Duration;

import it.cnr.si.domain.*;
import it.cnr.si.repository.UserRepository;
import it.cnr.si.service.CacheService;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(CacheService.ACE_GERARCHIA_ISTITUTI, jcacheConfiguration);
            cm.createCache(CacheService.ACE_GERARCHIA_UFFICI, jcacheConfiguration);
            cm.createCache(CacheService.ACE_SEDE_LAVORO, jcacheConfiguration);
            cm.createCache(UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(User.class.getName(), jcacheConfiguration);
            cm.createCache(Authority.class.getName(), jcacheConfiguration);
            cm.createCache(User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(TipologiaVeicolo.class.getName(), jcacheConfiguration);
            cm.createCache(AlimentazioneVeicolo.class.getName(), jcacheConfiguration);
            cm.createCache(ClasseEmissioniVeicolo.class.getName(), jcacheConfiguration);
            cm.createCache(UtilizzoBeneVeicolo.class.getName(), jcacheConfiguration);
            cm.createCache(MotivazionePerditaProprieta.class.getName(), jcacheConfiguration);
            cm.createCache(Veicolo.class.getName(), jcacheConfiguration);
            cm.createCache(VeicoloProprieta.class.getName(), jcacheConfiguration);
            cm.createCache(VeicoloNoleggio.class.getName(), jcacheConfiguration);
            cm.createCache(LibrettoPercorrenzaVeicolo.class.getName(), jcacheConfiguration);
            cm.createCache(AssicurazioneVeicolo.class.getName(), jcacheConfiguration);
            cm.createCache(it.cnr.si.domain.Multa.class.getName(), jcacheConfiguration);
            cm.createCache(it.cnr.si.domain.Bollo.class.getName(), jcacheConfiguration);
            cm.createCache(it.cnr.si.domain.CancellazionePra.class.getName(), jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
