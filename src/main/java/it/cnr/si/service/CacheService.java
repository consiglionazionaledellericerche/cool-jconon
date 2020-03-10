package it.cnr.si.service;

import it.cnr.si.service.dto.anagrafica.base.NodeDto;
import it.cnr.si.service.dto.anagrafica.letture.EntitaOrganizzativaWebDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CacheService {

    public static final String ACE_GERARCHIA_ISTITUTI = "ACE-GERARCHIA-ISTITUTI";
    public static final String ACE_GERARCHIA_UFFICI = "ACE-GERARCHIA-UFFICI";
    public static final String ACE_SEDE_LAVORO = "ACE-SEDE-LAVORO";
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
    @Cacheable(ACE_SEDE_LAVORO)
    public List<EntitaOrganizzativaWebDto> getSediDiLavoro() {
        return aceService.entitaOrganizzativaFind(null, null, null, LocalDate.now(), 44).getItems();
    }
    @Scheduled(cron = "0 0 1 * * ?")
    public void evictAllcachesAtIntervals() {
        evictAllCaches();
    }

    public void evictAllCaches() {
        cacheManager.getCacheNames().stream()
            .filter(s -> s.equals(ACE_GERARCHIA_ISTITUTI) || s.equals(ACE_GERARCHIA_UFFICI) || s.equals(ACE_SEDE_LAVORO))
            .forEach(cacheName -> cacheManager.getCache(cacheName).clear());
    }
}
