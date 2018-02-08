package it.cnr.si.cool.jconon.configuration;

import com.hazelcast.core.Cluster;
import com.hazelcast.core.HazelcastInstance;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.si.cool.jconon.dto.VerificaPECTask;
import it.cnr.si.cool.jconon.repository.CallRepository;
import it.cnr.si.cool.jconon.service.call.CallService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Francesco Uliana <francesco@uliana.it> on 07/05/16.
 */

@Service
public class TimerConfiguration {

    private final static Logger LOGGER = LoggerFactory.getLogger(TimerConfiguration.class);

    @Autowired
    private Cluster cluster;

    @Autowired
    private CallService callService;

    @Autowired
    private CallRepository callRepository;

    @Autowired
    private CMISService cmisService;

    @Value("${attiva.mail.solleciti}")
    private Boolean attivaMailSolleciti;

    @Autowired
    private HazelcastInstance hazelcastInstance;


    private boolean isFirstMemberOfCluster() {
        List<String> members = cluster
                .getMembers()
                .stream()
                .map(member -> member.getUuid())
                .sorted()
                .collect(Collectors.toList());
        return 0 == members.indexOf(cluster.getLocalMember().getUuid());
    }

    @Scheduled(cron = "0 0 13 * * *")
    public void notification() {
        LOGGER.info("attivaMailSolleciti = {}", attivaMailSolleciti);
        if (isFirstMemberOfCluster()) {
            if (attivaMailSolleciti) {
                callService.sollecitaApplication(cmisService.createAdminSession());
            }
        }
    }

    @Scheduled(cron = "0 0 21 * * *")
    public void protocol() {
        if (isFirstMemberOfCluster()) {
            try {
                callService.protocolApplication(cmisService.createAdminSession());
                callService.deleteApplicationInitial(cmisService.createAdminSession());
            } catch (Exception e) {
                LOGGER.error("Protocol application failed", e);
            }
        }
    }

    @Scheduled(cron = "0 0 4 * * *")
    public void evictScanPEC() {
        if (isFirstMemberOfCluster()) {
            callRepository.removeVerificaPECTask();
            LOGGER.info("removeVerificaPECTask");
        }
    }

    @Scheduled(cron = "0 0/30 * * * *")
    public void verifyPEC() {
        if (isFirstMemberOfCluster()) {
            try {
                hazelcastInstance.getMap("scan-pec")
                        .entrySet().stream()
                        .map(objectObjectEntry -> objectObjectEntry.getValue())
                        .map(VerificaPECTask.class::cast)
                        .forEach(verificaPECTask -> {
                            LOGGER.info("Verify PEC subject {}", verificaPECTask.getOggetto());
                            callService.verifyPEC(verificaPECTask);
                        });
            } catch (Exception e) {
                LOGGER.error("verify PEC failed", e);
            }
        }
    }
}
