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

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.si.cool.jconon.service.call.CallService;
import it.cnr.si.cool.jconon.util.JcononGroups;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Primary
public class JCONONNodeMetadataService extends NodeMetadataService implements InitializingBean {
    @Autowired
    private ACLService aclService;
    @Autowired
    private CMISService cmisService;
    @Override
    protected CmisObject updateObjectProperties(Session cmisSession, BindingSession bindingSession,
                                                String objectId, String objectTypeId, String objectParentId,
                                                String inheritedPermission, List<String> aspectNames,
                                                Map<String, Object> aspectProperties, Map<String, Object> properties) {
        final CmisObject cmisObject = super.updateObjectProperties(cmisSession, bindingSession, objectId,
                objectTypeId, objectParentId, inheritedPermission,
                aspectNames, aspectProperties, properties);
        if (Optional.ofNullable(inheritedPermission)
                    .map(s -> Boolean.valueOf(s))
                    .filter(aBoolean -> !aBoolean).isPresent()
        ) {
            aclService.addAcl(cmisService.getAdminSession(),
                    cmisObject.<String>getPropertyValue(CoolPropertyIds.ALFCMIS_NODEREF.value()),
                    Collections.singletonMap(JcononGroups.CONCORSI.group(), ACLType.Coordinator)
                    );
        }

        return cmisObject;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        setDatePattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    }
}
