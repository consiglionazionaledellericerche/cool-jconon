/*
 *    Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as
 *     published by the Free Software Foundation, either version 3 of the
 *     License, or (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
import java.util.Optional;

@Repository
public class ProtocolRepository {
	private static final String PWC = "pwc";

	public enum ProtocolRegistry {
		DOM, CON, PAGOPA
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
			LOGGER.error("CMIS versioning issue: {}", e.getMessage());
			throw e;
		} catch (CmisRuntimeException _ex) {
			LOGGER.error("Loading Protocol from Alfresco checkout error {}", _ex.getErrorContent());
        	throw _ex;
		}
        return null;
    }
    

    public void updateDocument(Session session, String content, String checkinMessage) {
        Document document = (Document) session.getObjectByPath(protocolPath);
        if (!document.getVersionLabel().equalsIgnoreCase(PWC)) {
			document = Optional.ofNullable(document)
					.flatMap(document1 -> Optional.ofNullable(document1.getVersionSeriesId()))
					.map(s -> s.concat(";"))
					.map(s -> s.concat(PWC))
					.flatMap(s -> Optional.ofNullable(session.getObject(s)))
					.filter(Document.class::isInstance)
					.map(Document.class::cast)
					.orElse(document);
		}
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
