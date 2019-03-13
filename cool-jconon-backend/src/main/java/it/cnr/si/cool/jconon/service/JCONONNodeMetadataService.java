package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.CoolPropertyIds;
import it.cnr.cool.cmis.service.ACLService;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.NodeMetadataService;
import it.cnr.si.cool.jconon.service.call.CallService;
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
                    Collections.singletonMap(CallService.GROUP_CONCORSI, ACLType.Coordinator)
                    );
        }

        return cmisObject;
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        setDatePattern("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
    }
}
