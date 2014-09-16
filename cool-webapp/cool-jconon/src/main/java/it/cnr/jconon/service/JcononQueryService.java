package it.cnr.jconon.service;

import it.cnr.cool.service.QueryService;

import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class JcononQueryService extends QueryService {

	private static final Logger LOGGER = LoggerFactory.getLogger(JcononQueryService.class);

	@Override
	protected Long getTotalNumItems(Session cmisSession,
			ItemIterable<QueryResult> queryResult, String statement) {
		LOGGER.debug("using quick totalnumitems");
		return getQuickTotalNumItems(cmisSession, statement);
	}

}
