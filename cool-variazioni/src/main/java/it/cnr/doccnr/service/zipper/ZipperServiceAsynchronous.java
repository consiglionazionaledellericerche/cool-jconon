package it.cnr.doccnr.service.zipper;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.MimeTypes;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;
import org.apache.chemistry.opencmis.client.api.*;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

public class ZipperServiceAsynchronous implements Runnable {

	public static final String KEY_CDS = "cds";
	public static final String KEY_VARIAZIONI = "variazioni";
	public static final String KEY_ESERCIZIO = "esercizio";
	private final String ESTABLISH_LINKAGES_URL = "service/zipper/establishLinkages";
	private final String DOWNLOAD_URL = "/rest/content?nodeRef=";
	private final String KEY_NODEREF_RESPONSE = "nodeRefZip";
	private final String NODEREF_PREFIX = "workspace://SpacesStore/";
	private final Logger LOGGER = LoggerFactory
			.getLogger(ZipperServiceAsynchronous.class);
	@Autowired
	private MailService mailService;
	@Autowired
	private CMISService cmisService;

	private String urlServer;
	private String zipName;

	private Session cmisSession;
	private CMISUser user;
	private Map<String, String> queryParam;
	private BindingSession bindingSession;

	public ZipperServiceAsynchronous() {

	}

	@Override
	public void run() {
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

			boolean linkError = false;
			for (int i = 0; i < result.size() && !linkError; i++) {
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
						url.addParameter("destNodeRef", NODEREF_PREFIX
								+ destFolder.getId());
						url.addParameter("sourceNodeRef", NODEREF_PREFIX
								+ cdrFolder.getId());

						bindingSession.put(SessionParameter.READ_TIMEOUT, -1);
						Response resEstablishLinkages = CmisBindingsHelper
								.getHttpInvoker(bindingSession).invokeGET(url,
										bindingSession);
						if (resEstablishLinkages.getResponseCode() != HttpStatus.SC_OK) {
							sendMessage(mailService, user, zipName, urlServer,
									resEstablishLinkages.getResponseCode(),
									resEstablishLinkages.getStream(),
									resEstablishLinkages.getErrorContent(),
									resEstablishLinkages.getResponseMessage(),
									queryParam);
							linkError = true;
							break;
						}
					}
				}
			}
			if (!linkError) {
				// creo lo ZIP delle variazioni
				String link = cmisService.getBaseURL().concat(
						"service/zipper/zipContent");

				UrlBuilder url = new UrlBuilder(link);
				url.addParameter("nodes", NODEREF_PREFIX + destFolder.getId());
				url.addParameter("destination",
						NODEREF_PREFIX + destZip.getId());
				url.addParameter("filename", zipName);
				url.addParameter("noaccent", true);

				bindingSession.put(SessionParameter.READ_TIMEOUT, -1);

				LOGGER.info("ZipperService - Request Zip-Content partita");
				Response response = CmisBindingsHelper.getHttpInvoker(
						bindingSession).invokeGET(url, bindingSession);
				// cancellazione cartella con i link alle folder delle
				// variazioni
				destFolder.deleteTree(true, UnfileObject.DELETE, false);

				sendMessage(mailService, user, zipName, urlServer,
						response.getResponseCode(), response.getStream(),
						response.getErrorContent(),
						response.getResponseMessage(), queryParam);
			}
		} else {
			sendMessage(mailService, user, zipName, urlServer, 0, null, null,
					null, queryParam);
		}

	}

	public BindingSession getBindingsession() {
		return bindingSession;
	}

	public void setBindingsession(BindingSession bindingsession) {
		this.bindingSession = bindingsession;
	}

	public void setZipName(String zipName) {
		this.zipName = zipName;
	}

	public void setCmisSession(Session cmisSession) {
		this.cmisSession = cmisSession;
	}

	public void setUser(CMISUser user) {
		this.user = user;
	}

	public void setQueryParam(Map<String, String> queryParam) {
		this.queryParam = queryParam;
	}

	public void setUrlServer(String urlServer) {
		this.urlServer = urlServer;
	}

	private void sendMessage(MailService mailService, CMISUser user,
			String zipName, String urlServer, int responseCode,
			InputStream stream, String errorContent, String responseMessage,
			Map<String, String> queryParam) {

		EmailMessage message = new EmailMessage();
		StringBuffer testo = new StringBuffer();
		StringBuilder subject = new StringBuilder();
		// aggiunge il footer al messaggio
		testo.append("  Data: ");
		DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
		testo.append(formatter.format(Calendar.getInstance().getTime()));

		try {
			if (responseCode == HttpStatus.SC_OK) {
				LOGGER.info("ZipperService - file " + zipName + MimeTypes.ZIP.getExtension() + " creato");

				JsonObject json = new JsonParser().parse(
						IOUtils.toString(stream)).getAsJsonObject();

				subject.append("E' stato creato il file " + zipName + MimeTypes.ZIP.getExtension());
				testo.append("<br/>");
				testo.append("Il processo di background è terminato quindi è possibile utilizzare la cartella zippata, e scaricare il file ");
				testo.append("<a href='")
						.append(urlServer + DOWNLOAD_URL
								+ json.get(KEY_NODEREF_RESPONSE).getAsString())
						.append("&deleteAfterDownload=true").append("'>");
				testo.append(zipName + MimeTypes.ZIP.getExtension()).append("</a>");
				testo.append("<BR><b>Il file verrà eliminato dopo il download.</b>");
				LOGGER.info("Downlod URL:" + urlServer + DOWNLOAD_URL
						+ json.get(KEY_NODEREF_RESPONSE).getAsString());

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