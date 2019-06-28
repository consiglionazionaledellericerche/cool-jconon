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

import com.google.gson.annotations.Expose;
import it.cnr.cool.util.Pair;

import java.util.ArrayList;
import java.util.List;
public class PrintDetailBulk {
	@Expose(serialize=true)
	private String macroType, type, link, title, periodo,ifFonte,ruolo, quartile;
	@Expose(serialize=true)
	private Integer nroCitazioni;
	@Expose(serialize=true)
	private String ifValore;
	
	@Expose(serialize=true)
	private List<Pair<String, String>> fields;
	@Expose(serialize=true)
	private List<PrintDetailBulk> details; 

	public PrintDetailBulk() {
		super();
	}

	public PrintDetailBulk(String macroType, String type, String link, List<Pair<String, String>> fields, List<PrintDetailBulk> details) {
		super();
		this.macroType = macroType;
		this.type = type;
		this.link = link;
		this.fields = fields;
		this.details = details;
	}

	public PrintDetailBulk(String macroType, String type, String link, String title, List<PrintDetailBulk> details) {
		super();
		this.macroType = macroType;
		this.type = type;
		this.link = link;
		this.title = title;
		this.details = details;
	}

	public void setMacroType(String macroType) {
		this.macroType = macroType;
	}

	public void setType(String type) {
		this.type = type;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public void setFields(List<Pair<String, String>> fields) {
		this.fields = fields;
	}

	public void setDetails(List<PrintDetailBulk> details) {
		this.details = details;
	}

	public String getLink() {
		return link;
	}

	public List<Pair<String, String>> getFields() {
		return fields;
	}

	public String getMacroType() {
		return macroType;
	}

	public String getType() {
		return type;
	}

	public String getPeriodo() {
		return periodo;
	}

	public Integer getNroCitazioni() {
		return nroCitazioni;
	}

	public void setNroCitazioni(Integer nroCitazioni) {
		this.nroCitazioni = nroCitazioni;
	}

	public String getIfFonte() {
		return ifFonte;
	}

	public void setIfFonte(String ifFonte) {
		this.ifFonte = ifFonte;
	}

	public String getIfValore() {
		return ifValore;
	}

	public void setIfValore(String ifValore) {
		this.ifValore = ifValore;
	}

	public String getRuolo() {
		return ruolo;
	}

	public void setRuolo(String ruolo) {
		this.ruolo = ruolo;
	}

	public void setPeriodo(String periodo) {
		this.periodo = periodo;
	}

	public String getQuartile() {
		return quartile;
	}

	public void setQuartile(String quartile) {
		this.quartile = quartile;
	}

	public List<PrintDetailBulk> getDetails() {
		return details;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}
	
	public void addField(Pair<String, String> field) {
		if (fields == null)
			fields = new ArrayList<Pair<String,String>>();
		fields.add(field);		
	}
}
