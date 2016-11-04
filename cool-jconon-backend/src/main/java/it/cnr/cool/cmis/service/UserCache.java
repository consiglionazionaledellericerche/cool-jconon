package it.cnr.cool.cmis.service;

import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;

import it.cnr.cool.security.service.impl.alfresco.CMISUser;

public interface UserCache extends Cache{
	String get(CMISUser user, BindingSession session);
	void clear(String username);
}
