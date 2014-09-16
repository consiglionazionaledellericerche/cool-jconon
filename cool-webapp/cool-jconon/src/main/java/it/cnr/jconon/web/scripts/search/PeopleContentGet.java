package it.cnr.jconon.web.scripts.search;

import org.apache.chemistry.opencmis.client.api.Session;
import org.springframework.beans.factory.annotation.Autowired;

import it.cnr.cool.web.scripts.search.ContentGet;
import it.cnr.jconon.service.PeopleService;

public class PeopleContentGet extends ContentGet {

    @Autowired
    private PeopleService peopleService;
    	
	protected Session getCMISSession() {
		return peopleService.getCMISSession();
	}
}
