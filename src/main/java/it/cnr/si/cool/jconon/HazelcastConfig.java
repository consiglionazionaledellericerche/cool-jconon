package it.cnr.si.cool.jconon;

import com.hazelcast.core.Cluster;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.spring.cache.HazelcastCacheManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Created by Francesco Uliana <francesco@uliana.it> on 07/05/16.
 */

@Configuration
@EnableScheduling
public class HazelcastConfig {

    private final static Logger LOGGER = LoggerFactory.getLogger(HazelcastConfig.class);

    @Autowired
    private CacheManager cacheManager;

    @Bean
    public HazelcastInstance hazelcastInstance() {
        HazelcastCacheManager hazelcastCacheManager = (HazelcastCacheManager) cacheManager;
        return hazelcastCacheManager.getHazelcastInstance();
    }

    @Bean
    public Cluster cluster(HazelcastInstance hazelcastInstance) {
        return hazelcastInstance.getCluster();
    }

}
