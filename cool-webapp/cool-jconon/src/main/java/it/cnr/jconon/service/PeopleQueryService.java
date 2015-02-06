package it.cnr.jconon.service;

import it.cnr.cool.service.QueryService;

import javax.servlet.http.HttpServletRequest;


import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class PeopleQueryService extends QueryService {

	private static final Logger LOGGER = LoggerFactory.getLogger(PeopleQueryService.class);

	@Autowired
	private PeopleService peopleService;

	protected Session getSession(HttpServletRequest request) {
		LOGGER.debug("using people service CMIS Session");
		return peopleService.getCMISSession(request);
	}

}
