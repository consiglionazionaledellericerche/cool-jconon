package it.cnr.si.service;

import it.cnr.si.service.dto.anagrafica.base.NodeDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CacheService {

    public static final String ACE_GERARCHIA_ISTITUTI = "ACE-GERARCHIA-ISTITUTI";
    public static final String ACE_GERARCHIA_UFFICI = "ACE-GERARCHIA-UFFICI";
    @Autowired
    CacheManager cacheManager;
    @Autowired
    private AceService aceService;

    @Cacheable(ACE_GERARCHIA_ISTITUTI)
    public List<NodeDto> getGerarchiaIstituti() {
        return aceService.getGerarchiaIstituti();
    }

    @Cacheable(ACE_GERARCHIA_UFFICI)
    public List<NodeDto> getGerarchiaUffici() {
        return aceService.getGerarchiaUffici();
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public void evictAllcachesAtIntervals() {
        evictAllCaches();
    }

    public void evictAllCaches() {
        cacheManager.getCacheNames().stream()
            .filter(s -> s.equals(ACE_GERARCHIA_ISTITUTI) || s.equals(ACE_GERARCHIA_UFFICI))
            .forEach(cacheName -> cacheManager.getCache(cacheName).clear());
    }
}
