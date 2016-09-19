package it.cnr.si.cool.jconon;

import it.cnr.jconon.model.PrintParameterModel;
import it.cnr.jconon.service.PrintService;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hazelcast.core.Cluster;
import com.hazelcast.core.HazelcastInstance;
import com.hazelcast.core.IQueue;
import com.hazelcast.core.ItemEvent;
import com.hazelcast.core.ItemListener;
/**
 * Created by Francesco Uliana <francesco@uliana.it> on 07/05/16.
 */
@Component
public class QueueService implements InitializingBean{

    private final static Logger LOGGER = LoggerFactory.getLogger(QueueService.class);
	private static String QUEUE_PRINT_APPLICATION = "QUEUE_PRINT_APPLICATION", 
			QUEUE_SEND_APPLICATION = "QUEUE_SEND_APPLICATION",
			QUEUE_SCHEDA_VALUTAZIONE = "QUEUE_SCHEDA_VALUTAZIONE",
			QUEUE_ADD_CONTENT_TO_APPLICATION = "QUEUE_ADD_CONTENT_TO_APPLICATION",
			QUEUE_APPLICATIONS_XLS = "QUEUE_APPLICATIONS_XLS";

    @Autowired
    private HazelcastInstance hazelcastInstance;

    @Autowired
    private Cluster cluster;

    @Autowired
    private PrintService printService;
    
    public IQueue<PrintParameterModel> queuePrintApplication() {
        return hazelcastInstance.getQueue(QUEUE_PRINT_APPLICATION);
    }

    public IQueue<PrintParameterModel> queueSendApplication() {
        return hazelcastInstance.getQueue(QUEUE_SEND_APPLICATION);
    }

    public IQueue<PrintParameterModel> queueSchedaValutazione() {
        return hazelcastInstance.getQueue(QUEUE_SCHEDA_VALUTAZIONE);
    }

    public IQueue<PrintParameterModel> queueAddContentToApplication() {
        return hazelcastInstance.getQueue(QUEUE_ADD_CONTENT_TO_APPLICATION);
    }

    public IQueue<PrintParameterModel> queueApplicationsXLS() {
        return hazelcastInstance.getQueue(QUEUE_APPLICATIONS_XLS);
    }
    
	@Override
	public void afterPropertiesSet() throws Exception {
		ItemListener<PrintParameterModel> printApplicationListener = new ItemListener<PrintParameterModel>() {
            @Override
            public void itemAdded(ItemEvent<PrintParameterModel> itemEvent) {
            	PrintParameterModel item = itemEvent.getItem();
                LOGGER.info("PrintApplicationListener {} {}", item, itemEvent.getEventType().getType());
                boolean removed = queuePrintApplication().remove(item);
                LOGGER.info("PrintApplicationListener {} {}", item, removed ? "removed" : "not removed");
                if (removed) {
                    LOGGER.info("PrintApplicationListener consuming {}", item);
                    printService.printApplication(item.getApplicationId(), item.getContextURL(), Locale.ITALY, item.isEmail());
                    LOGGER.info("PrintApplicationListener consumed {}", item);
                }
            }
            @Override
            public void itemRemoved(ItemEvent<PrintParameterModel> itemEvent) {
                LOGGER.info("PrintApplicationListener removed {}", itemEvent.getItem());
            }
        };
		ItemListener<PrintParameterModel> sendApplicationListener = new ItemListener<PrintParameterModel>() {
            @Override
            public void itemAdded(ItemEvent<PrintParameterModel> itemEvent) {
            	PrintParameterModel item = itemEvent.getItem();
                LOGGER.info("SendApplicationListener {} {}", item, itemEvent.getEventType().getType());
                boolean removed = queueSendApplication().remove(item);
                LOGGER.info("SendApplicationListener {} {}", item, removed ? "removed" : "not removed");
                if (removed) {
                    LOGGER.info("SendApplicationListener consuming {}", item);
                    printService.printApplication(item.getApplicationId(), item.getContextURL(), Locale.ITALY, item.isEmail());
                    LOGGER.info("SendApplicationListener consumed {}", item);
                }
            }
            @Override
            public void itemRemoved(ItemEvent<PrintParameterModel> itemEvent) {
                LOGGER.info("SendApplicationListener removed {}", itemEvent.getItem());
            }
        };

        ItemListener<PrintParameterModel> schedaValutazioneListener = new ItemListener<PrintParameterModel>() {
            @Override
            public void itemAdded(ItemEvent<PrintParameterModel> itemEvent) {
            	PrintParameterModel item = itemEvent.getItem();
                LOGGER.info("SchedaValutazioneListener {} {}", item, itemEvent.getEventType().getType());
                boolean removed = queueSchedaValutazione().remove(item);
                LOGGER.info("SchedaValutazioneListener {} {}", item, removed ? "removed" : "not removed");
                if (removed) {
                    LOGGER.info("SchedaValutazioneListener consuming {}", item);
                    printService.generaScheda(item);
                    LOGGER.info("SchedaValutazioneListener consumed {}", item);
                }
            }
            @Override
            public void itemRemoved(ItemEvent<PrintParameterModel> itemEvent) {
                LOGGER.info("SchedaValutazioneListene removed {}", itemEvent.getItem());
            }
        };
		ItemListener<PrintParameterModel> addContentToApplicationListener = new ItemListener<PrintParameterModel>() {
            @Override
            public void itemAdded(ItemEvent<PrintParameterModel> itemEvent) {
            	PrintParameterModel item = itemEvent.getItem();
                LOGGER.info("AddContentToApplicationListener {} {}", item, itemEvent.getEventType().getType());
                boolean removed = queueAddContentToApplication().remove(item);
                LOGGER.info("AddContentToApplicationListener {} {}", item, removed ? "removed" : "not removed");
                if (removed) {
                    LOGGER.info("AddContentToApplicationListener consuming {}", item);
                    printService.addContentToApplication(item);
                    LOGGER.info("AddContentToApplicationListener consumed {}", item);
                }
            }
            @Override
            public void itemRemoved(ItemEvent<PrintParameterModel> itemEvent) {
                LOGGER.info("AddContentToApplicationListener removed {}", itemEvent.getItem());
            }
        };

		ItemListener<PrintParameterModel> applicationXLSListener = new ItemListener<PrintParameterModel>() {
            @Override
            public void itemAdded(ItemEvent<PrintParameterModel> itemEvent) {
            	PrintParameterModel item = itemEvent.getItem();
                LOGGER.info("applicationXLSListener {} {}", item, itemEvent.getEventType().getType());
                boolean removed = queueApplicationsXLS().remove(item);
                LOGGER.info("applicationXLSListener {} {}", item, removed ? "removed" : "not removed");
                if (removed) {
                    LOGGER.info("applicationXLSListener consuming {}", item);
                    printService.extractionApplication(item);
                    LOGGER.info("applicationXLSListener consumed {}", item);
                }
            }
            @Override
            public void itemRemoved(ItemEvent<PrintParameterModel> itemEvent) {
                LOGGER.info("applicationXLSListener removed {}", itemEvent.getItem());
            }
        };
        
        queuePrintApplication().addItemListener(printApplicationListener, true);		
        queueSendApplication().addItemListener(sendApplicationListener, true);		        
        queueSchedaValutazione().addItemListener(schedaValutazioneListener, true);
        queueAddContentToApplication().addItemListener(addContentToApplicationListener, true);
        queueApplicationsXLS().addItemListener(applicationXLSListener, true);
	}
}
