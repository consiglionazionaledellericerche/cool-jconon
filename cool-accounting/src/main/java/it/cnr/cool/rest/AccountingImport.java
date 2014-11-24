package it.cnr.cool.rest;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.security.SecurityChecked;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.Serializable;
import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisBaseException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@SecurityChecked
@Path("accounting")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class AccountingImport {

	private static final Logger LOGGER = LoggerFactory.getLogger(AccountingImport.class);

    @Autowired
    private CMISService cmisService;

	@Path("import")
	@GET
	public Response execute(@QueryParam("sourceFolder") String sourceFolder, @QueryParam("targetFolder") String targetFolder) {

		LOGGER.debug("account import webscript " + sourceFolder);

		File rootFolder = new File(sourceFolder);
		assert rootFolder.isDirectory();
		children(rootFolder, targetFolder);

		LOGGER.debug("done");

		return Response.ok().build();

	}

	private void children(File folder, String targetFolder) {
		for (File child : folder.listFiles()) {
			if (child.isDirectory()) {
				Folder alfrescoFolder = null;
				if (targetFolder == null)
					alfrescoFolder = getFolder(child.getName());
				else
					alfrescoFolder = (Folder) cmisService.createAdminSession().getObject(targetFolder);
				if (alfrescoFolder != null) {
					importDocument(child, alfrescoFolder);
				} else {
					children(child, targetFolder);
				}
			}
		}
	}

	private void importDocument(File child, Folder alfrescoFolder) {
		for (File file : child.listFiles()) {
			LOGGER.debug("try to import file " + file.getName());			
			Map<String, Serializable> properties = new HashMap<String, Serializable>();
			properties.put(PropertyIds.OBJECT_TYPE_ID, BaseTypeId.CMIS_DOCUMENT.value());
			properties.put(PropertyIds.NAME, file.getName());
			ContentStream contentStream;
			try {
				contentStream = new ContentStreamImpl(file.getName(), BigInteger.valueOf(file.length()),
						"application/pdf", new FileInputStream(file));
				try {
					alfrescoFolder.createDocument(properties, contentStream, VersioningState.MAJOR);
				} catch (CmisObjectNotFoundException _ex) {
					LOGGER.info("Il file che si è cercato di importare già esiste:" + file.getName());
				}
				file.delete();
			} catch (FileNotFoundException e) {
				LOGGER.error("not found " + file.getName(), e);
			} catch (CmisBaseException e) {
				LOGGER.error("Caricamento file "+ file.getName() + " nella folder:" + alfrescoFolder.getName(), e);
			}
		}
	}

	private Folder getFolder(String proteo) {
		Criteria criteria = CriteriaFactory.createCriteria("sigla_contabili_aspect:folder");
		criteria.add(Restrictions.eq("sigla_contabili_aspect:codice_proteo", proteo));
		ItemIterable<QueryResult> results = criteria.executeQuery(cmisService.createAdminSession(), false, cmisService.createAdminSession().getDefaultContext());
		if (results.getTotalNumItems() == 0)
			return null;
		return (Folder)cmisService.createAdminSession().getObject((String)results.iterator().next().getPropertyValueById(PropertyIds.OBJECT_ID));
	}
}
