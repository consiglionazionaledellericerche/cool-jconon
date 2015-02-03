package it.cnr.cool.service.util;

import org.alfresco.model.dictionary._1.Aspect;
import org.alfresco.model.dictionary._1.Model;
import org.alfresco.model.dictionary._1.Type;
import org.apache.chemistry.opencmis.client.api.CmisObject;

import java.util.List;


public class AlfrescoModel extends AlfrescoDocument {
    private boolean active;
    private String description;
    private String author;
    private String nameFile;
    private String nodeRef;
    private List<Aspect> aspects;
    private List<Type> types;


    public AlfrescoModel(Model model, CmisObject obj, boolean active) {

        super(obj);
        this.active = active;
        this.description = model.getDescription();
        this.author = model.getAuthor();
        this.nameFile = obj.getName();
        this.nodeRef = obj.getId();
        this.nameFile = obj.getName();
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