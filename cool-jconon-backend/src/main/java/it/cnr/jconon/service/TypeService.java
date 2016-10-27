package it.cnr.jconon.service;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.SecondaryType;
import org.apache.chemistry.opencmis.commons.data.CmisExtensionElement;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by francesco on 09/02/15.
 */

@Component
public class TypeService {

    public boolean hasSecondaryType(CmisObject cmisObject, String secondaryTypeId){
        for (SecondaryType st : cmisObject.getSecondaryTypes()) {
            if (st.getId().equals(secondaryTypeId)) {
                return true;
            }
        }
        return false;
    }

    public List<String> getMandatoryAspects(ObjectType objectType) {
        List<String> result = new ArrayList<>();
        if (objectType.getExtensions() != null) {
            for (CmisExtensionElement cmisExtensionElement : objectType.getExtensions()) {
                if (cmisExtensionElement.getName().equalsIgnoreCase("mandatoryAspects")) {
                    for (CmisExtensionElement child : cmisExtensionElement.getChildren()) {
                        result.add(child.getValue());
                    }
                }
            }
        }
        return result;
    }



}
