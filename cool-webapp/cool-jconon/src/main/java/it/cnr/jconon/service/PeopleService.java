package it.cnr.jconon.service;

import org.apache.chemistry.opencmis.client.api.Session;

import javax.servlet.http.HttpServletRequest;

public class PeopleService {

    public static final String DEFAULT_SERVER = "people.cmis.default";

	public Session getCMISSession(HttpServletRequest request) {
        throw new RuntimeException("DA REIMPLEMENTARE!");
	}


}
