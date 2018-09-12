package it.cnr.si.cool.jconon.repository;

import com.google.gson.JsonObject;
import com.google.gson.JsonParseException;
import com.google.gson.JsonParser;

import it.cnr.cool.cmis.service.CMISService;

import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisVersioningException;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import java.io.IOException;
import java.io.InputStream;

@Repository
public class ProtocolRepository {
	private static final String PWC = "pwc";

	public enum ProtocolRegistry {
		DOM, CON
	}
	
    @Autowired
    private CMISService cmisService;
    
    @Value("${protocol.path}")    
    private String protocolPath;
    
    private static final Logger LOGGER = LoggerFactory.getLogger(ProtocolRepository.class);
	
    public String getProtocol(boolean checkout) {
        LOGGER.debug("loading Protocol from Alfresco");
        try {
            Session session = cmisService.createAdminSession();
			LOGGER.info("Loading Protocol from Alfresco with path: {}", protocolPath);
            Document document = (Document) session.getObjectByPath(protocolPath);
			document.refresh();
			LOGGER.info("Loading Protocol from Alfresco with object id: {}", document.getId());
            if (checkout) {
                document.checkOut();
            }
            InputStream is = document.getContentStream().getStream();
            return IOUtils.toString(is);
        } catch (IOException e) {
            LOGGER.error("error retrieving permissions", e);
        } catch (JsonParseException e) {
            LOGGER.error("error retrieving permissions", e);
        } catch (CmisVersioningException e) {
			LOGGER.error("cmis versioning issue", e);
			throw e;
		} catch (CmisRuntimeException _ex) {
			LOGGER.error("Loading Protocol from Alfresco checkout error {}", _ex.getErrorContent());
        	throw _ex;
		}
        return null;
    }
    

    public void updateDocument(Session session, String content, String checkinMessage) {
        Document document = (Document) session.getObjectByPath(protocolPath);
        if (!document.getVersionLabel().equalsIgnoreCase(PWC))
	        document = document.getAllVersions()
	        		.stream()
	        		.filter(x -> x.getVersionLabel().equalsIgnoreCase(PWC))
	        		.findFirst()
	        		.get();
        String name = document.getName();
        String mimeType = document.getContentStreamMimeType();
        ContentStreamImpl cs = new ContentStreamImpl(name, mimeType, content);
        document.checkIn(true, null, cs, checkinMessage);
    } 
    
	private JsonObject loadProtocollo(boolean checkout) {
        String s = getProtocol(checkout);
        return new JsonParser().parse(s).getAsJsonObject();
	}
    
	public void putNumProtocollo(String registro, String anno, Long numeroProtocollo)  {
		JsonObject jsonObject = loadProtocollo(false);
		JsonObject registroJson;
		if (jsonObject.has(registro)) {
			registroJson = jsonObject.get(registro).getAsJsonObject();
			if (registroJson.has(anno))
				registroJson.remove(anno);
			registroJson.addProperty(anno, numeroProtocollo);				
		} else {
			registroJson = new JsonObject();
			registroJson.addProperty(anno, numeroProtocollo);
			jsonObject.add(registro, registroJson);
		}	
		updateDocument(cmisService.createAdminSession(), jsonObject.toString(), "Upgrade "+ registro + "/" + anno + "/" + numeroProtocollo);	
	}
	
	public Long getNumProtocollo(String registro, String anno)  {
		JsonObject jsonObject = loadProtocollo(true);
		if (jsonObject.has(registro)) {
			JsonObject registroJson = jsonObject.get(registro).getAsJsonObject();
			if (registroJson.has(anno)) {
				return Long.valueOf(registroJson.get(anno).getAsLong());
			}
		}
		return Long.valueOf("0");
	}
}
