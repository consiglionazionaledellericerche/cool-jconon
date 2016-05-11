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
public class NotificationConfiguration {

    private final static Logger LOGGER = LoggerFactory.getLogger(NotificationConfiguration.class);

    @Autowired
    private Cluster cluster;

    @Autowired
    private CallService callService;

    @Autowired
    private CMISService cmisService;
    
    @Value("${attiva.mail.solleciti}")
    private Boolean attivaMailSolleciti;
    
    @Scheduled(cron="0 0 13 * * *")
    public void timer() {
        List<String> members = cluster
                .getMembers()
                .stream()
                .map(member -> member.getUuid())
                .sorted()
                .collect(Collectors.toList());

        String uuid = cluster.getLocalMember().getUuid();

        if( 0 == members.indexOf(uuid)) {
        	if (attivaMailSolleciti)
        		callService.sollecitaApplication(cmisService.createAdminSession());
            LOGGER.debug("{} is the chosen one", uuid);
        } else {
            LOGGER.debug("{} is NOT the chosen one", uuid);
        }

    }

}
