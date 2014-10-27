package it.cnr.jconon.service;

import it.cnr.cool.cmis.service.CMISConfig;
import it.cnr.cool.cmis.service.CMISService;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.commons.SessionParameter;
import org.springframework.beans.factory.annotation.Autowired;

public class PeopleService {
    @Autowired
    private CMISConfig cmisPeopleConfig;
    
    @Autowired
    private CMISService cmisService;
    
    public static final String DEFAULT_SERVER = "people.cmis.default";
	
	public Session getCMISSession(HttpSession se) {
		if (se == null) {
			return createSession();
		} else {
			if (se.getAttribute(DEFAULT_SERVER) == null)
				se.setAttribute(DEFAULT_SERVER, createSession());
			return (Session) se.getAttribute(DEFAULT_SERVER);
		}
	}

	private Session createSession() {
        Map<String, String> parameters = cmisPeopleConfig.getServerParameters();
        if (parameters == null){
            return null;
        }
        String username = parameters.get(CMISConfig.GUEST_USERNAME);
        String password = parameters.get(CMISConfig.GUEST_PASSWORD);       
        String repositoryId = null;
        if(parameters.containsKey(SessionParameter.REPOSITORY_ID)){
        	repositoryId = parameters.get(SessionParameter.REPOSITORY_ID);
        }else{
            repositoryId = cmisService.getRepositories(cmisPeopleConfig, CMISService.DEFAULT_SERVER, username, password).get(0).getId();
        }
        return cmisService.createSession(cmisPeopleConfig, CMISService.DEFAULT_SERVER, repositoryId, username, password);		
	}

}
