package it.cnr.flows.service;

import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.flows.exception.DropException;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisContentAlreadyExistsException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.chemistry.opencmis.commons.impl.jaxb.EnumBaseObjectTypeIds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by francesco on 17/02/15.
 */
@Component
public class DropService {

    private static final Logger LOGGER = LoggerFactory.getLogger(DropService.class);

    private static final String WORKSPACE_SPACES_STORE = "workspace://SpacesStore/";

    private static final String FLOWS = "/flows-temp";

    private static final String WFCNR_TIPOLOGIA_DOC = "wfcnr:tipologiaDOC";

    private static final Serializable PARAMETRI_FLUSSO_ASPECTS = (Serializable) Arrays.asList("P:wfcnr:parametriFlusso");

    @Autowired
    private CMISService cmisService;

    @Autowired
    private ACLService aclService;

    public Map<String, String> dropFile(String type, String id, String username, String documentId, InputStream uploadedInputStream, String mimetype, String fileName, HttpServletRequest request) throws DropException {
        Session cmisSession = cmisService.getCurrentCMISSession(request);
        BindingSession bindingSession = cmisService.getCurrentBindingSession(request);

        if (documentId != null && ! documentId.isEmpty()) {

            LOGGER.debug("overwriting file " + documentId);

            Document document = (Document) cmisSession.getObject(documentId);

            LOGGER.debug("overwriting " + document.getName());

            try {

                ContentStream cs = new ContentStreamImpl(fileName,
                        BigInteger.valueOf(uploadedInputStream.available()),
                        mimetype,
                        uploadedInputStream);

                document.setContentStream(cs, true, true);

                Document v = cmisSession.getLatestDocumentVersion(document.getId());


                v.rename(fileName, true);

                Map<String, String> map = new HashMap<String, String>();
                map.put("document", v.getId());

                return map;
            } catch (IOException e) {
                throw new DropException("error overwriting document " + documentId, e);
            }

        } else {

            String path = "temp_" + username + "_" + id;

            Folder fascicolo = null;
            try {
                fascicolo = getFascicoloFolder(path, cmisSession, bindingSession);
            } catch (CmisContentAlreadyExistsException e) {
                throw new DropException("errore nella creazione del fascicolo", e);
            }

            try {
                Document document = getDocument(uploadedInputStream, fascicolo, fileName, mimetype, type);

                Map<String, String> map = new HashMap<String, String>();
                map.put("document", document.getId());
                map.put("folder", fascicolo.getId());

                return map;

            } catch (IOException e) {
                throw new DropException("error processing file", e);
            }
        }
    }


    private Document getDocument(InputStream uploadedInputStream, Folder fascicolo, String filename, String mimetype, String type) throws IOException, DropException {

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
            throw new DropException("unable to add " + filename, e);
        }
        return document;
    }




    private Folder getFascicoloFolder(String path, Session cmisSession, BindingSession bindingSession) throws DropException {
        Folder fascicoli;

        try {
            fascicoli = (Folder) cmisSession.getObjectByPath(FLOWS);
        } catch(CmisObjectNotFoundException e) {
            String message = "missing folder: " + FLOWS;
            LOGGER.error(message, e);
            throw new DropException(message);
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
