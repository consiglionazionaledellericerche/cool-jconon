package it.cnr.jconon.scheduler;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.jconon.service.call.CallService;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ScheduleExecutorService{
	private static final Logger LOGGER = LoggerFactory.getLogger(ScheduleExecutorService.class);

	@Autowired
    private CallService callService;

	private CMISService cmisService;
	private Boolean abilitazioneCronScadenza;

	public void setCmisService(CMISService cmisService) {
		this.cmisService = cmisService;
	}
	public void setAbilitazioneCronScadenza(Boolean abilitazioneCronScadenza) {
		this.abilitazioneCronScadenza = abilitazioneCronScadenza;
	}
	public void execute(){
		try {
			LOGGER.info("Scheduler isEnabled:"+abilitazioneCronScadenza);
			LOGGER.info("Execute scheduler at:"+new Date());
			if (abilitazioneCronScadenza){
				callService.sollecitaApplication(cmisService.createAdminSession());
			}
		} catch (Exception e) {
			LOGGER.error("Errore nella schedulazione", e);
		}
	}
}
