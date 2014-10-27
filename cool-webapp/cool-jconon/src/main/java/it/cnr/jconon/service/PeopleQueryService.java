package it.cnr.jconon.service;

import it.cnr.cool.service.QueryService;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class PeopleQueryService extends QueryService {

	private static final Logger LOGGER = LoggerFactory.getLogger(PeopleQueryService.class);

	@Autowired
	private PeopleService peopleService;

	@Override
	protected Session getSession(HttpServletRequest request) {
		LOGGER.debug("using people service CMIS Session");
		HttpSession session = request.getSession(false);
		return peopleService.getCMISSession(session);
	}

}
