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

package it.cnr.si.cool.jconon.model;

import java.io.Serializable;
import java.util.List;

public class PrintParameterModel implements Serializable {

	private static final long serialVersionUID = 7698846044636252098L;
	private final String contextURL;
	private final boolean email;
	private String applicationId, indirizzoEmail, userId, query;
	private List<String> ids;
	private String type;
	private String queryType;
	public TipoScheda tipoScheda;
	
	public enum TipoScheda{
		SCHEDA_ANONIMA, SCHEDA_VALUTAZIONE
	}

    public PrintParameterModel(String contextURL, boolean email) {
		super();
		this.contextURL = contextURL;
		this.email = email;
	}
	
	public PrintParameterModel(String applicationId, String contextURL,
			boolean email) {
		super();
		this.applicationId = applicationId;
		this.contextURL = contextURL;
		this.email = email;
	}
	
	public PrintParameterModel(String applicationId, String contextURL,
			boolean email, String indirizzoEmail, String userId, TipoScheda tipoScheda) {
		this(applicationId,contextURL,email);
		this.indirizzoEmail = indirizzoEmail;
		this.userId = userId;
		this.tipoScheda = tipoScheda;
	}

	public String getApplicationId() {
		return applicationId;
	}
	public String getContextURL() {
		return contextURL;
	}
	public boolean isEmail() {
		return email;
	}	
	public String getIndirizzoEmail() {
		return indirizzoEmail;
	}
	public String getUserId() {
		return userId;
	}	
	public TipoScheda getTipoScheda() {
		return tipoScheda;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	@Override
	public boolean equals(Object obj) {
		if (!(obj instanceof PrintParameterModel))
			return false;		
		return this.applicationId.equals(((PrintParameterModel)obj).getApplicationId());
	}


	@Override
	public int hashCode() {
		return applicationId.hashCode();
	}

	@Override
	public String toString() {
		return "ApplicationId:" + applicationId +
				" - contextURL:" + contextURL +
				" - EMail:"+ email;
	}
	public void setIndirizzoEmail(String indirizzoEmail) {
		this.indirizzoEmail = indirizzoEmail;
	}

	public List<String> getIds() {
		return ids;
	}

	public void setIds(List<String> ids) {
		this.ids = ids;
	}	
	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getQueryType() {
		return queryType;
	}

	public void setQueryType(String queryType) {
		this.queryType = queryType;
	}
}