package it.cnr.si.cool.jconon;

import com.hazelcast.core.Cluster;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.jconon.service.call.CallService;

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
    private CMISService cmisService;
    
    @Value("${attiva.mail.solleciti}")
    private Boolean attivaMailSolleciti;
    
    @Scheduled(cron="0 0 13 * * *")
    public void notification() {

        LOGGER.info("attivaMailSolleciti = {}", attivaMailSolleciti);

        List<String> members = cluster
                .getMembers()
                .stream()
                .map(member -> member.getUuid())
                .sorted()
                .collect(Collectors.toList());

        String uuid = cluster.getLocalMember().getUuid();

        if( 0 == members.indexOf(uuid)) {
        	if (attivaMailSolleciti) {
                callService.sollecitaApplication(cmisService.createAdminSession());
            }
            LOGGER.info("{} is the chosen one", uuid);
        } else {
            LOGGER.info("{} is NOT the chosen one", uuid);
        }

    }

    @Scheduled(cron="0 0 21 * * *")
    public void protocol() {
        List<String> members = cluster
                .getMembers()
                .stream()
                .map(member -> member.getUuid())
                .sorted()
                .collect(Collectors.toList());

        String uuid = cluster.getLocalMember().getUuid();

        if( 0 == members.indexOf(uuid)) {
            try {
				callService.protocolApplication(cmisService.createAdminSession());
				callService.deleteApplicationInitial(cmisService.createAdminSession());
			} catch (Exception e) {
	            LOGGER.error("Protocol application failed", e);
			}
            LOGGER.info("{} is the chosen one", uuid);
        } else {
            LOGGER.info("{} is NOT the chosen one", uuid);
        }

    }

}
