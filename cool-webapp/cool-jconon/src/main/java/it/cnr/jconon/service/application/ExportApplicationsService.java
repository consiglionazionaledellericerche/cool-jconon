package it.cnr.jconon.service.application;

import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.web.scripts.exception.ClientMessageException;
import it.cnr.jconon.service.call.CallService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.IOException;
import java.util.Iterator;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.methods.GetMethod;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ExportApplicationsService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ExportApplicationsService.class);

	@Autowired
	private CMISService cmisService;
	@Autowired
	private CallService callService;
	@Autowired
	private ACLService aclService;
	private static final String ZIP_EXTENSION = ".zip";
	private static final String ZIP_CONTENT = "service/zipper/zipContent";

	public String exportApplications(Session currentSession,
			BindingSession bindingSession, String nodeRefBando,
			boolean deleteFinalFolder) {

		Folder finalCall = null;
		Folder bando = (Folder) currentSession.getObject(nodeRefBando);
		String finalApplicationName = (bando.getName()).replace(" ", "_");

		try {
			finalCall = (Folder) currentSession.getObjectByPath(bando.getPath()
					+ "/" + CallService.FINAL_APPLICATION);
		} finally {
			// Aggiorno sempre il contenuto della Folder delle Domande
			// Definitive
			finalCall = callService.finalCall(currentSession, bindingSession,
					nodeRefBando);
			if (finalCall == null) {
				// Se non ci sono domande definitive finalCall non viene creata
				throw new ClientMessageException("Il bando "
						+ finalApplicationName
						+ " non presenta domande definitive");
			}
		}
		LOGGER.info("ExportApplicationsService - Cartella con le domande definitive del bando "
				+ bando.getName() + " creata");

		Document finalZip = null;
		String finalZipNodeRef = findDocumentChild(currentSession, bando,
				finalApplicationName + ZIP_EXTENSION);
		if (finalZipNodeRef == null) {
			// crea lo zip e lo recupera
			String urlRequest = cmisService.getBaseURL().concat(ZIP_CONTENT)
					.concat("?nodes=" + finalCall.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString())
					.concat("&destination=" + bando.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString())
					.concat("&filename=" + finalApplicationName)
					.concat("&noaccent=" + true).concat("&download=" + false);
			// Richiama il ws ZipContent da alfresco
			invokeGet(urlRequest, bindingSession);
			finalZip = (Document) currentSession.getObjectByPath(bando
					.getPath() + "/" + finalApplicationName + ZIP_EXTENSION);
			aclService.setInheritedPermission(bindingSession,
					finalZip.getProperty(CoolPropertyIds.ALFCMIS_NODEREF.value()).getValueAsString(), false);
			finalZipNodeRef = finalZip.getId();
		}
		LOGGER.info("ExportApplicationsService - File " + finalApplicationName
				+ ".zip creata");

		if (deleteFinalFolder)
			deleteFinalFolderCall(finalCall);

		return finalZipNodeRef;
	}

	/**
	 * Cancella prima i pdf dalla cartella (altrimenti alfresco non fa
	 * cancellare la cartella) e poi la cartella stessa
	 * 
	 * @param finalCall
	 */
	private void deleteFinalFolderCall(Folder finalCall) {
		Iterator<CmisObject> it = finalCall.getChildren().iterator();
		while (it.hasNext()) {
			Document call = (Document) it.next();
			call.removeFromFolder(new ObjectIdImpl(finalCall.getId()));
		}
		finalCall.delete(true);
	}

	/**
	 * Effettua la get su ZipContent (alfresco)
	 * 
	 * @param url
	 * @param bs
	 */
	private void invokeGet(String url, BindingSession bs) {
		String ticket = (String) bs.get(SessionParameter.PASSWORD);
		HttpMethod method = new GetMethod(url);
		HttpClient client = new HttpClient();

		byte[] base64 = Base64.encodeBase64((":" + ticket).getBytes());
		method.addRequestHeader("Authorization", "Basic " + new String(base64));

		try {
			int respCode = client.executeMethod(method);
			if (respCode != HttpStatus.SC_OK) {
				throw new ClientMessageException(
						"Errore nell'esecuzione di ZipContent (Alfresco) - Errore "
								+ respCode);
			}
		} catch (HttpException e) {
			LOGGER.error(
					"Errore nell'invocazione del WS ZipContent di alfresco - ",
					e);
		} catch (IOException e) {
			LOGGER.error(
					"Errore nella lettura dello stream di risposta dell'invocazione del WS ZipContent di alfresco - ",
					e);
		}
	}

	private String findDocumentChild(Session cmisSession, Folder source,
			String name) {
		Criteria criteria = CriteriaFactory
				.createCriteria(BaseTypeId.CMIS_DOCUMENT.value());
		criteria.addColumn(PropertyIds.OBJECT_ID);
		criteria.addColumn(PropertyIds.NAME);
		criteria.add(Restrictions.inFolder(source.getId()));
		criteria.add(Restrictions.eq(PropertyIds.NAME, name));
		ItemIterable<QueryResult> iterable = criteria.executeQuery(cmisSession,
				false, cmisSession.getDefaultContext());

		for (QueryResult queryResult : iterable) {
			return queryResult.getPropertyValueById(PropertyIds.OBJECT_ID);
		}
		return null;
	}

}