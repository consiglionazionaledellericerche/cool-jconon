package it.cnr.doccnr.service.zipper;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.UnfileObject;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.io.IOUtils;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SchedulerFactory;
import org.quartz.Trigger;
import org.quartz.TriggerUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;

public class ZipperServiceAsynchronous implements Job {

	public final String KEY_CDS = "cds";
	public final String KEY_VARIAZIONI = "variazioni";
	public final String KEY_ESERCIZIO = "esercizio";
	private final String ESTABLISH_LINKAGES_URL = "service/zipper/establishLinkages";
	private final String DOWNLOAD_URL = "/rest/content?nodeRef=";
	private final String KEY_NODEREF_RESPONSE = "nodeRefZip";
	private final Logger LOGGER = LoggerFactory
			.getLogger(ZipperServiceAsynchronous.class);
	@Autowired
	private MailService mailService;

	public Map<String, Object> zip(Session cmisSession,
			BindingSession bindingSession, CMISUser user,
			Map<String, String> queryParam, String zipName, String serverPath,
			String contextPath, CMISService cmisService) {
		Map<String, Object> model = new HashMap<String, Object>();

		JobDetail jobDetail = new JobDetail("VARIAZIONI", "VARIAZIONI",
				this.getClass());
		jobDetail.getJobDataMap().put("mailService", mailService);
		jobDetail.getJobDataMap().put("cmisService", cmisService);
		jobDetail.getJobDataMap().put("cmisSession", cmisSession);
		jobDetail.getJobDataMap().put("queryParam", queryParam);
		jobDetail.getJobDataMap().put("zipName", zipName);
		jobDetail.getJobDataMap().put("bindingSession", bindingSession);
		jobDetail.getJobDataMap().put("user", user);
		jobDetail.getJobDataMap().put("path", serverPath + contextPath);
		jobDetail.getJobDataMap().put("LOGGER", LOGGER);

		Trigger trigger = TriggerUtils.makeImmediateTrigger(0, 0);
		trigger.setName("VARIAZIONI");
		trigger.setStartTime(new Date());

		SchedulerFactory schedFact = new org.quartz.impl.StdSchedulerFactory();
		Scheduler sched;
		try {
			sched = schedFact.getScheduler();
			sched.scheduleJob(jobDetail, trigger);
			sched.start();
		} catch (SchedulerException e) {
			LOGGER.error("Cannot start scheduler for content", e);
			throw new ClientMessageException(
					"Si è verificato un errore durante la schedulazione dell'operazione!");
		}
		model.put("status", "ok");
		return model;
	}

	@Override
	public void execute(JobExecutionContext context)
			throws JobExecutionException {
		CMISService cmisService = (CMISService) context.getJobDetail()
				.getJobDataMap().get("cmisService");
		MailService mailService = (MailService) context.getJobDetail()
				.getJobDataMap().get("mailService");
		Session cmisSession = (Session) context.getJobDetail().getJobDataMap()
				.get("cmisSession");
		BindingSession bindingSession = (BindingSession) context.getJobDetail()
				.getJobDataMap().get("bindingSession");
		@SuppressWarnings("unchecked")
		HashMap<String, String> queryParam = (HashMap<String, String>) context
				.getJobDetail().getJobDataMap().get("queryParam");
		String zipName = (String) context.getJobDetail().getJobDataMap()
				.get("zipName");
		String urlServer = (String) context.getJobDetail().getJobDataMap()
				.get("path");
		CMISUser  user = (CMISUser) context.getJobDetail().getJobDataMap().get("user");
		Logger LOGGER = (Logger) context.getJobDetail().getJobDataMap()
				.get("LOGGER");

		zipperService(cmisService, mailService, cmisSession, bindingSession,
				queryParam, zipName, urlServer, user, LOGGER);
	}

	public void zipperService(CMISService cmisService, MailService mailService,
			Session cmisSession, BindingSession bindingSession,
			HashMap<String, String> queryParam, String zipName,
			String urlServer, CMISUser  user, Logger LOGGER) {
		if (zipName.isEmpty()) {
			zipName = "default";
		}

		Criteria criteria = CriteriaFactory.createCriteria(
				"varpianogest:document", "doc");
		criteria.addColumn(PropertyIds.OBJECT_ID);
		List<Document> result = new ArrayList<Document>();

		if (queryParam.containsKey(KEY_ESERCIZIO)) {
			criteria.add(Restrictions.eq("varpianogest:esercizio",
					queryParam.get(KEY_ESERCIZIO)));
		}
		if (queryParam.containsKey(KEY_VARIAZIONI)) {
			criteria.add(Restrictions.in("varpianogest:numeroVariazione",
					splitVariazioni(queryParam.get(KEY_VARIAZIONI))));
		}

		if (queryParam.containsKey(KEY_CDS)) {
			String alias = KEY_CDS;
			Criteria criteriaCds = criteria.createCriteria("strorg:cds", alias);
			criteriaCds.add(Restrictions.eq(alias + ".strorgcds:codice",
					queryParam.get(KEY_CDS)));
			criteriaCds.addJoinCriterion(Restrictions.eqProperty(
					criteria.prefix(PropertyIds.OBJECT_ID),
					criteriaCds.prefix(PropertyIds.OBJECT_ID)));
		}

		ItemIterable<QueryResult> results = criteria.executeQuery(cmisSession,
				false, cmisSession.getDefaultContext());

		for (QueryResult qr : results.getPage(Integer.MAX_VALUE)) {
			String id = qr.getPropertyValueById(PropertyIds.OBJECT_ID);
			Document doc = (Document) cmisSession.getObject(cmisSession
					.createObjectId(id));
			result.add(doc);
		}

		LOGGER.info("ZipperService - Query eseguita");
		if (result.size() > 0) {
			String pathDestZip = "/User Homes/" + user.getId();
			CmisObject destZip = cmisSession.getObjectByPath(pathDestZip);
			String pathDestFolder = pathDestZip + "/" + zipName;
			Folder destFolder;

			// creo la folder con i link alle variazioni anche se esiste una
			// folder con lo stesso nome (in questo caso rimuovo la vecchia
			// versione)
			try {
				destFolder = (Folder) cmisSession
						.getObjectByPath(pathDestFolder);
				destFolder.deleteTree(true, UnfileObject.DELETE, false);
			} catch (CmisObjectNotFoundException e) {
				LOGGER.info("ZipperService - Creo la nuova folder (non ho trovato una folder con lo stesso nome da cancellare)");
			}
			destFolder = createFolder(cmisSession, zipName, destZip);

			for (int i = 0; i < result.size(); i++) {
				Document doc = result.get(i);
				OperationContext oc = new OperationContextImpl(
						cmisSession.getDefaultContext());
				Set<String> propertyFilter = new HashSet<String>();
				propertyFilter.add(PropertyIds.OBJECT_ID);
				propertyFilter.add(PropertyIds.NAME);
				oc.setFilter(propertyFilter);
				List<Folder> parents = doc.getParents(oc);
				for (Folder cdrFolder : parents) {
					if (cdrFolder.getName().startsWith("CdR")) {
						// richiamo il ws establish-linkages
						UrlBuilder url = new UrlBuilder(cmisService
								.getBaseURL().concat(ESTABLISH_LINKAGES_URL));
						url.addParameter("destNodeRef", destFolder.getId());
						url.addParameter("sourceNodeRef", cdrFolder.getId());

						bindingSession.put(SessionParameter.READ_TIMEOUT, -1);
						CmisBindingsHelper.getHttpInvoker(bindingSession)
								.invokeGET(url, bindingSession);
					}
				}
			}
			// creo lo ZIP delle variazioni
			String link = cmisService.getBaseURL().concat(
					"service/zipper/zipContent");

			UrlBuilder url = new UrlBuilder(link);
			url.addParameter("nodes", destFolder.getId());
			url.addParameter("destination", destZip.getId());
			url.addParameter("filename", zipName);
			url.addParameter("noaccent", true);

			bindingSession.put(SessionParameter.READ_TIMEOUT, -1);

			LOGGER.info("ZipperService - Request Zip-Content partita");
			Response response = CmisBindingsHelper.getHttpInvoker(
					bindingSession).invokeGET(url, bindingSession);
			// cancellazione cartella con i link alle folder delle variazioni
			destFolder.deleteTree(true, UnfileObject.DELETE, false);

			sendMessage(mailService, user, zipName, urlServer,
					response.getResponseCode(), response.getStream(),
					response.getErrorContent(), response.getResponseMessage(),
					queryParam);
		} else {
			sendMessage(mailService, user, zipName, urlServer, 0, null, null,
					null, queryParam);
		}
	}

	private void sendMessage(MailService mailService, CMISUser user,
			String zipName, String urlServer, int responseCode,
			InputStream stream, String errorContent, String responseMessage,
			HashMap<String, String> queryParam) {

		EmailMessage message = new EmailMessage();
		StringBuffer testo = new StringBuffer();
		StringBuilder subject = new StringBuilder();
		// aggiunge il footer al messaggio
		testo.append("  Data: ");
		DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
		testo.append(formatter.format(Calendar.getInstance().getTime()));

		try {
			if (responseCode == HttpStatus.SC_OK) {
				LOGGER.info("ZipperService - file " + zipName + ".zip creato");

				JsonObject json = new JsonParser().parse(
						IOUtils.toString(stream)).getAsJsonObject();

				subject.append("E' stato creato il file " + zipName + ".zip");
				testo.append("<br/>");
				testo.append("Il processo di background è terminato quindi è possibile utilizzare la cartella zippata, e scaricare il file ");
				testo.append("<a href='")
						.append(urlServer + DOWNLOAD_URL
								+ json.get(KEY_NODEREF_RESPONSE).getAsString())
						.append("&deleteAfterDownload=true").append("'>");
				testo.append(zipName + ".zip").append("</a>");
				testo.append("<BR><b>Il file verrà eliminato dopo il download.</b>");

			} else if (responseCode == 0) {
				subject.append("Il processo background di creazione del file zip è FALLITO perché la query non ha prodotto risultati");
				testo.append("<br/>");
				testo.append("Il processo background di creazione del file zip è FALLITO perché la query non ha prodotto risultati \n");
				testo.append("Variazioni: " + queryParam.get(KEY_VARIAZIONI)
						+ "\n");
				testo.append("Esercizio: " + queryParam.get(KEY_ESERCIZIO)
						+ "\n");
				testo.append("Cds: " + queryParam.get(KEY_CDS) + "\n");

			} else {
				LOGGER.error("ZipperService- Creazione dello zip fallita: "
						+ errorContent);
				subject.append("Il processo background di creazione del file zip è FALLITO");
				testo.append("<br/>");
				testo.append("Il processo di background di creazione del file zip è FALLITO. \n");
				testo.append("Codice: " + responseCode + "\n");
				testo.append("Response Message" + responseMessage + "\n");

			}
			message.setBody(testo);
			message.setHtmlBody(true);
			message.setSubject(subject.toString());
			message.addRecipient(user.getEmail());
			mailService.send(message);
		} catch (JsonSyntaxException jsonExceprtion) {
			LOGGER.error("Errore nel parsing del noderef dello zip creato",
					jsonExceprtion);
		} catch (IOException jsonExceprtion) {
			LOGGER.error("Errore nel parsing del noderef dello zip creato",
					jsonExceprtion);
		} catch (Exception e) {
			LOGGER.error("Errore nell'invio della mail", e);
		}
	}

	private List<Integer> splitVariazioni(String input) {
		List<Integer> ret = new ArrayList<Integer>();
		String[] stringSpitted = input.split(",");
		for (int j = 0; j < stringSpitted.length; j++) {
			ret.add(Integer.parseInt(stringSpitted[j].trim()));
		}
		return ret;
	}

	private Folder createFolder(Session cmisSession, String nameFolder,
			CmisObject destZip) {
		Folder destFolder;
		ObjectId foderId = null;
		Map<String, Object> properties = new HashMap<String, Object>();
		properties.put(PropertyIds.NAME, nameFolder);
		properties.put(PropertyIds.OBJECT_TYPE_ID,
				BaseTypeId.CMIS_FOLDER.value());
		foderId = cmisSession.createFolder(properties, destZip);
		destFolder = (Folder) cmisSession.getObject(foderId);
		return destFolder;
	}
}