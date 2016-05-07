package it.cnr.si.cool.jconon;

import com.hazelcast.core.Cluster;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    @Scheduled(fixedDelay = 5000l)
    public void timer() {
        List<String> members = cluster
                .getMembers()
                .stream()
                .map(member -> member.getUuid())
                .sorted()
                .collect(Collectors.toList());

        String uuid = cluster.getLocalMember().getUuid();

        if( 0 == members.indexOf(uuid)) {
            LOGGER.info("{} is the chosen one", uuid);
        } else {
            LOGGER.info("{} is NOT the chosen one", uuid);
        }

    }

}
