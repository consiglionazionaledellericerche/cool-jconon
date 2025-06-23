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

package it.cnr.si.cool.jconon.service;

import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.ObjectType;
import org.apache.chemistry.opencmis.client.api.SecondaryType;
import org.apache.chemistry.opencmis.commons.data.CmisExtensionElement;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Created by francesco on 09/02/15.
 */

@Component
public class TypeService {

    public static final String P_SYS = "P:sys";
    public static final String MANDATORY_ASPECTS = "mandatoryAspects";

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
                if (cmisExtensionElement.getName().equalsIgnoreCase(MANDATORY_ASPECTS)) {
                    for (CmisExtensionElement child : cmisExtensionElement.getChildren()) {
                        Optional.ofNullable(child.getValue())
                            .filter(s -> !s.startsWith(P_SYS))
                            .ifPresent(result::add);
                    }
                }
            }
        }
        return result;
    }



}
