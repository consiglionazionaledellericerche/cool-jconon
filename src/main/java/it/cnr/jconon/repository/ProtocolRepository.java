package it.cnr.jconon.repository;

import it.cnr.cool.cmis.service.CMISService;

import java.io.IOException;
import java.io.InputStream;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.exceptions.CmisVersioningException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;

@Repository
public class ProtocolRepository {
    @Autowired
    private CMISService cmisService;
    
    @Value("${protocol.path}")    
    private String protocolPath;
    
    private static final Logger LOGGER = LoggerFactory.getLogger(ProtocolRepository.class);
	
    public String getProtocol(boolean checkout) throws Exception {
        LOGGER.debug("loading Protocol from Alfresco");
        try {
            Session session = cmisService.createAdminSession();
            InputStream is = getDocumentInputStream(session,
            		protocolPath, checkout);
            return IOUtils.toString(is);
        } catch (IOException e) {
            LOGGER.error("error retrieving permissions", e);
        } catch (JsonParseException e) {
            LOGGER.error("error retrieving permissions", e);
        }
        return null;
    }
    
    public InputStream getDocumentInputStream(Session session, String path, boolean checkout) throws Exception{
        Document document = (Document) session.getObjectByPath(path);
        if (checkout) {
        	try {
        		document.checkOut();
        	} catch (CmisVersioningException _ex) {
        		throw new Exception(_ex);
        	}
        }        	
        return document.getContentStream().getStream();
    }	
    
    public void updateDocument(Session session, String content, String checkinMessage) {
        Document document = (Document) session.getObjectByPath(protocolPath);
        String name = document.getName();
        String mimeType = document.getContentStreamMimeType();
        ContentStreamImpl cs = new ContentStreamImpl(name, mimeType, content);
        document.checkIn(true, null, cs, checkinMessage);
    } 
    
	private JsonObject loadProtocollo(boolean checkout) throws Exception {
        String s = getProtocol(checkout);
        return new JsonParser().parse(s).getAsJsonObject();
	}
    
	public void putNumProtocollo(String registro, String anno, Long numeroProtocollo) throws Exception {
		JsonObject jsonObject = loadProtocollo(false);
		JsonObject registroJson = jsonObject.get(registro).getAsJsonObject();
		registroJson.remove(anno);
		registroJson.addProperty(anno, numeroProtocollo);
		updateDocument(cmisService.createAdminSession(), jsonObject.toString(), "Upgrade "+ registro + "/" + anno + "/" + numeroProtocollo);	
	}
	
	public Long getNumProtocollo(String registro, String anno) throws Exception {
		JsonObject jsonObject = loadProtocollo(true);
		if (jsonObject.has(registro)) {
			JsonObject registroJson = jsonObject.get(registro).getAsJsonObject();
			if (registroJson.has(anno)) {
				return Long.valueOf(registroJson.get(anno).getAsLong());
			} else {
				registroJson.addProperty(anno, 0);
				updateDocument(cmisService.createAdminSession(), jsonObject.toString(), "Upgrade "+ registro + "/" + anno + "/" + 0);
				return Long.valueOf("0");				
			}
		} else {
			JsonObject value = new JsonObject();
			value.addProperty(anno, 0);
			jsonObject.add(registro, value);
			updateDocument(cmisService.createAdminSession(), jsonObject.toString(), "Upgrade "+ registro + "/" + anno + "/" + 0);
			return Long.valueOf("0");
		}
	}
}
