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

package it.cnr.si.cool.jconon.model;

import com.google.gson.annotations.Expose;
import it.cnr.si.cool.jconon.cmis.model.JCONONPropertyIds;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.Property;
import org.apache.chemistry.opencmis.commons.enums.PropertyType;
import org.springframework.util.StringUtils;

import java.text.MessageFormat;
import java.util.*;

/**
 *
 * Application model
 *
 */
public class ApplicationModel {

	@Expose(serialize=true)
	private Map<String, Object> properties = new HashMap<String, Object>();     // non c'e' modo di restringere il campo di properties a qualcosa di meno generico di Object?

	private Properties messages;

	private String contextURL;
	
	private boolean caricaChildProperties;

	public ApplicationModel() {
		super();
	}
	public ApplicationModel(Folder application, OperationContext operationContext, Properties messages,
			String contextURL) {
		this(application, operationContext, messages, contextURL, true);
	}
	/**
	 * C'e' troppo controller in questo oggetto
	 * Va considerato di spezzarlo in due, model e controller (o model e util)
	 * @param application
	 * @param operationContext
	 * @param messages
	 * @param contextURL
	 */
	public ApplicationModel(Folder application, OperationContext operationContext, Properties messages,
			String contextURL, boolean caricaChildProperties) {
		super();
		this.messages = messages;
		this.contextURL = contextURL;
		this.caricaChildProperties = caricaChildProperties;
		
		for (Property<?> property : application.getProperties()) {
			if (!property.getDefinition().isInherited()) {
				addToProperties(property);
			}
		}

		Folder parent = application.getFolderParent();  // chi e' il parent di application? E' fisso?
		parent.refresh();
		for (Property<?> property : parent.getProperties()) {
			if (!property.getDefinition().getId().startsWith("cmis:")){
				addToProperties(property);
			} else if (property.getDefinition().getId().equals("cmis:objectTypeId")) {
				properties.put("jasperReport:call_ObjectTypeId",property.getValue());
			}
		}
		if (this.caricaChildProperties) {
			for (CmisObject child : application.getChildren(operationContext)) {     // perche' questa parte non sta insieme al parent, riga 108?
				child.refresh();
				for (Property<?> property : child.getProperties()) {
					if (!property.getDefinition().getId().startsWith("cmis:")){
						addToProperties(property);
					}
				}
			}			
		}

		String subDescRid = prepareSubDescRid(parent);

		if (subDescRid.length() != 0) {
			properties.put("jasperReport:call_sub_descrizione_ridotta","<font size=\"4\">" + subDescRid.toString() +"</font>"); // mix view?
		}

	}

	/**
	 * TODO trovare un nome piu' esplicativo
	 * sub = ?, Desc = Descrizione, Rid = Ridotta ????
	 * @param parent
	 */
	private String prepareSubDescRid(Folder parent) {

		StringBuilder subDescRid = new StringBuilder();

		List<String> elenco_settori_tecnologici = parent.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_SETTORI_TECNOLOGICI.value()),
				elenco_macroaree = parent.getPropertyValue(JCONONPropertyIds.CALL_ELENCO_MACROAREE.value());

		if (parent.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value())!=null) {
			subDescRid.append(parent.getPropertyValue(JCONONPropertyIds.CALL_SEDE.value()).toString());
		} else if (elenco_settori_tecnologici != null && !elenco_settori_tecnologici.isEmpty()) {
			subDescRid.append(getMessage("label.print.jconon_bando_elenco_settori_tecnologici")).append(": ");

			Iterator<String> iterator = elenco_settori_tecnologici.iterator();
			while(iterator.hasNext()) {
				subDescRid.append(iterator.next());
				if (iterator.hasNext()) { subDescRid.append(" - "); }
			}

		} else if (elenco_macroaree != null && !elenco_macroaree.isEmpty()) {
			subDescRid.append(getMessage("label.print.jconon_bando_elenco_macroaree")).append(": "); // mix view?

			Iterator<String> iterator = elenco_macroaree.iterator();
			while(iterator.hasNext()) {
				subDescRid.append(iterator.next());
				if(iterator.hasNext()) { subDescRid.append(" - "); }
			}
		}
		return subDescRid.toString();
	}

	public Map<String, Object> getProperties() {
		return properties;
	}

	public void setProperties(Map<String, Object> properties) {
		this.properties = properties;
	}

	public String getContextURL() {
		return contextURL;
	}

	public void setContextURL(String contextURL) {
		this.contextURL = contextURL;
	}

	private void addToProperties(Property<?> property) {
		Object value = null;
		if (property.getValue() != null && property.getValue() instanceof String && property.getDefinition().getPropertyType().equals(PropertyType.STRING)) {
			value = ((String)property.getValue()).replace("/<!--.*?-->/g", "");
		} else {
			if (property.isMultiValued())
				value = StringUtils.collectionToCommaDelimitedString(property.getValue());
			else
				value = property.getValue();
		}
		properties.put(property.getId(), value);
	}

	public String getMessage(String messageKey, Object... params) {
	    String message = messages.getProperty(messageKey);
	    if (message != null && params != null && params.length != 0) {
	        message = MessageFormat.format(message, params);
	    }
	    if (message == null) {
	    	message = messages.getProperty(messageKey);
	    }
	    if (message == null) {
	    	message = messageKey;
	    }
	    return message;
	}

}
