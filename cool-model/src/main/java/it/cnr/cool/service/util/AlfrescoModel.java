package it.cnr.cool.service.util;

import it.cnr.cool.cmis.model.ModelPropertiesIds;

import java.util.List;

import org.alfresco.model.dictionary._1.Aspect;
import org.alfresco.model.dictionary._1.Model;
import org.alfresco.model.dictionary._1.Type;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.commons.PropertyIds;


public class AlfrescoModel extends AlfrescoDocument {
	private final boolean active;
	private final String description;
	private final String author;
	private List<Aspect> aspects;
	private List<Type> types;
	private final String nameFile;
	private final String nodeRef;

	public AlfrescoModel(Model model, QueryResult qr) {
		super(qr);
		this.description = model.getDescription();
		this.active = (Boolean) qr
				.getPropertyValueById(ModelPropertiesIds.MODEL_ACTIVE.value());
		this.author = model.getAuthor();
		this.nameFile = qr.getPropertyValueById(PropertyIds.NAME);
		this.nodeRef = qr.getPropertyValueById(PropertyIds.OBJECT_ID);
		if (model != null) {
			if (model.getAspects() != null)
				aspects = model.getAspects().getAspect();
			if (model.getTypes() != null)
				types = model.getTypes().getType();
		}
	}

	public boolean isActive() {
		return active;
	}

	public String getDescription() {
		return description;
	}

	public String getAuthor() {
		return author;
	}


	public List<Aspect> getAspects() {
		return aspects;
	}

	public List<Type> getTypes() {
		return types;
	}

	public String getNameFile() {
		return nameFile;
	}

	@Override
	public String getNodeRef() {
		return nodeRef;
	}
}