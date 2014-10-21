package it.cnr.flows.rest;

import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.service.NodeService;

import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.InternalServerErrorException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.SecondaryType;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.objecttype.SecondaryTypeImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.chemistry.opencmis.commons.impl.jaxb.EnumBaseObjectTypeIds;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
//
@Path("drop")
@Component
@Produces(MediaType.APPLICATION_JSON)
public class Drop {

    private static final String DEFAULT_FILE_NAME = "foo";

	private static final String WORKSPACE_SPACES_STORE = "workspace://SpacesStore/";

	private static final String FLOWS = "/flows-temp";

	private static final Logger LOGGER = LoggerFactory.getLogger(Drop.class);
    public static final String WFCNR_TIPOLOGIA_DOC = "wfcnr:tipologiaDOC";
    public static final Serializable PARAMETRI_FLUSSO_ASPECTS = (Serializable) Arrays.asList("P:wfcnr:parametriFlusso");

    @Autowired
	private NodeService nodeService;

	@Autowired
	private CMISService cmisService;

	@Autowired
	private ACLService aclService;

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response post(@FormDataParam("type") String type,
			@FormDataParam("id") String id,
			@FormDataParam("username") String username,
			@FormDataParam("file") InputStream uploadedInputStream,
			@FormDataParam("file") FormDataContentDisposition fileDetail,
			@FormDataParam("file") FormDataBodyPart p,
			@Context HttpServletRequest request) {

        HttpSession session = request.getSession(false);
        Session cmisSession = cmisService.getCurrentCMISSession(session);
        BindingSession bindingSession = cmisService.getCurrentBindingSession(request);

        String path = "temp_" + username + "_" + id;
        Folder fascicolo = getFascicoloFolder(path, cmisSession, bindingSession);

		try {

            String mimetype = getMimetype(p);

            String fileName = getFileName(fileDetail);

            Document document = getDocument(uploadedInputStream, fascicolo, fileName, mimetype, type);

			Map<String, String> map = new HashMap<String, String>();
			map.put("document", document.getId());
			map.put("folder", fascicolo.getId());

			return Response.ok().entity(map).build();

		} catch (IOException e) {
			LOGGER.error("error processing stream", e);
			throw new InternalServerErrorException("error processing file");
		}

	}

    private Document getDocument(InputStream uploadedInputStream, Folder fascicolo, String filename, String mimetype, String type) throws IOException {

        ContentStream cs = new ContentStreamImpl(filename,
                BigInteger.valueOf(uploadedInputStream.available()),
                mimetype,
                uploadedInputStream);

        Map<String, Serializable> props = new HashMap<String, Serializable>();
        props.put(PropertyIds.NAME, filename);
        props.put(PropertyIds.OBJECT_TYPE_ID, EnumBaseObjectTypeIds.CMIS_DOCUMENT.value());
        props.put(PropertyIds.SECONDARY_OBJECT_TYPE_IDS, PARAMETRI_FLUSSO_ASPECTS);
        props.put(WFCNR_TIPOLOGIA_DOC, type);

        Document document = null;
        try {
            document = fascicolo.createDocument(props, cs,
                    VersioningState.MAJOR);
        } catch (CmisContentAlreadyExistsException e) {
            throw new InternalServerErrorException("unable to add "
                    + filename, e);
        }
        return document;
    }

    private String getMimetype (FormDataBodyPart p) {

        String mimetype;
        if (p != null) {
            mimetype = p.getMediaType().toString();
        } else {
            mimetype = MediaType.TEXT_PLAIN_TYPE.toString();
        }
        LOGGER.debug("mimetype: " + mimetype);
        return mimetype;
    }

    private String getFileName(FormDataContentDisposition fileDetail) {

        String filename;

        if (fileDetail != null) {
            LOGGER.info(fileDetail.toString());
            filename = fileDetail.getFileName();
        } else {
            LOGGER.debug("unable to detect file name, using default: "
                    + DEFAULT_FILE_NAME);
            filename = DEFAULT_FILE_NAME;
        }

        return filename;
    }


    private Folder getFascicoloFolder(String path, Session cmisSession, BindingSession bindingSession) {
        Folder fascicoli;

        try {
            fascicoli = (Folder) cmisSession.getObjectByPath(FLOWS);
        } catch(CmisObjectNotFoundException e) {
            String message = "missing folder: " + FLOWS;
            LOGGER.error(message, e);
            throw new InternalServerErrorException(message);
        }

        Folder fascicolo = null;

        try {
            fascicolo = (Folder) cmisSession
                    .getObjectByPath(FLOWS + "/" + path);
        } catch(CmisObjectNotFoundException e) {
            Map<String, String> props = new HashMap<String, String>();
            props.put(PropertyIds.NAME, path);
            props.put(PropertyIds.OBJECT_TYPE_ID, EnumBaseObjectTypeIds.CMIS_FOLDER.value());

            fascicolo = fascicoli.createFolder(props);
            aclService.setInheritedPermission(bindingSession, WORKSPACE_SPACES_STORE + fascicolo.getId(), false);
            LOGGER.debug("item not found, will create new folder", e);
        }
        return fascicolo;
    }

}
