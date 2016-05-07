package it.cnr.si.cool.jconon;

import com.hazelcast.core.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Random;

/**
 * Created by Francesco Uliana <francesco@uliana.it> on 07/05/16.
 */

@Configuration
public class QueueConfiguration {

    private final static Logger LOGGER = LoggerFactory.getLogger(QueueConfiguration.class);
    public static final String NAME = "stampe";

    @Autowired
    private HazelcastInstance hazelcastInstance;

    @Autowired
    private Cluster cluster;

    public IQueue<String> queue() {
        return hazelcastInstance.getQueue(NAME);

    }

    @Scheduled(fixedDelay = 3_000)
    public void produce()  {
        String task  = "task-" + cluster.getLocalMember().getUuid() + "-" + System.currentTimeMillis();
        LOGGER.info("Producing {}", task);
        boolean b = queue().add(task);
        LOGGER.info("{} {} to queue", task, b ? "added" : "not added");
    }


    @Bean
    public String consume() throws InterruptedException {

        return queue().addItemListener(new ItemListener<String>() {
            @Override
            public void itemAdded(ItemEvent<String> itemEvent) {

                String item = itemEvent.getItem();

                LOGGER.info("{} {}", item, itemEvent.getEventType().getType());

                boolean removed = queue().remove(item);

                LOGGER.info("{} {}", item, removed ? "removed" : "not removed");

                if (removed) {
                    LOGGER.info("consuming {}", item);

                    long time = new Random().nextInt(5) * 1000;
                    LOGGER.info("waiting {} ms", time);
                    try {
                        Thread.sleep(time);
                    } catch (InterruptedException e) {
                        LOGGER.error("sleep interrupted", e);
                    }

                    LOGGER.info("consumed {}", item);
                }
            }

            @Override
            public void itemRemoved(ItemEvent<String> itemEvent) {
                LOGGER.info("removed {}", itemEvent.getItem());
            }
        }, true);

    }




}
