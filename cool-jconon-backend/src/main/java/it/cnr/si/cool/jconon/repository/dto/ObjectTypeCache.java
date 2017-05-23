package it.cnr.si.cool.jconon.repository.dto;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(value=Include.NON_NULL)
public class ObjectTypeCache implements Serializable{

	private static final long serialVersionUID = 1L;
	private String key;
	private String title;
	private String label;
	private String description;
	private String defaultLabel;
	private String queryName;
	private String group;	
	private Boolean display;
	private List<ObjectTypeCache> childs;
	
	private List<String> mandatoryAspects;
			
	public String getKey() {
		return key;
	}

	public String getId() {
		return key;
	}
	
	public ObjectTypeCache key(String key) {
		this.key = key;
		return this;
	}
	public String getLabel() {
		return label;
	}
	public ObjectTypeCache label(String label) {
		this.label = label;
		return this;
	}
	public String getDescription() {
		return description;
	}
	public ObjectTypeCache description(String description) {
		this.description = description;
		return this;
	}
	public String getGroup() {
		return group;
	}
	public ObjectTypeCache group(String group) {
		this.group = group;
		return this;
	}
	public String getDefaultLabel() {
		return defaultLabel;
	}
	public ObjectTypeCache defaultLabel(String defaultLabel) {
		this.defaultLabel = defaultLabel;
		return this;
	}
	public List<String> getMandatoryAspects() {
		return mandatoryAspects;
	}
	public ObjectTypeCache mandatoryAspects(List<String> mandatoryAspects) {
		this.mandatoryAspects = mandatoryAspects;
		return this;
	}		
	public String getQueryName() {
		return queryName;
	}

	public ObjectTypeCache queryName(String queryName) {
		this.queryName = queryName;
		return this;
	}

	public Boolean getDisplay() {
		return display;
	}

	public ObjectTypeCache display(Boolean display) {
		this.display = display;
		return this;
	}

	public List<ObjectTypeCache> getChilds() {
		return childs;
	}

	public ObjectTypeCache childs(List<ObjectTypeCache> childs) {
		this.childs = childs;
		return this;
	}

	public String getTitle() {
		return title;
	}

	public ObjectTypeCache title(String title) {
		this.title = title;
		return this;
	}

	@Override
	public String toString() {
		return "ObjectTypeCache [key=" + key + ", title=" + title
				+ ", label=" + label + ", description=" + description
				+ ", defaultLabel=" + defaultLabel + ", queryName="
				+ queryName + ", display=" + display + ", childs=" + childs
				+ ", mandatoryAspects=" + mandatoryAspects + "]";
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + getOuterType().hashCode();
		result = prime * result
				+ ((childs == null) ? 0 : childs.hashCode());
		result = prime * result
				+ ((defaultLabel == null) ? 0 : defaultLabel.hashCode());
		result = prime * result
				+ ((description == null) ? 0 : description.hashCode());
		result = prime * result
				+ ((display == null) ? 0 : display.hashCode());
		result = prime * result + ((key == null) ? 0 : key.hashCode());
		result = prime * result + ((label == null) ? 0 : label.hashCode());
		result = prime
				* result
				+ ((mandatoryAspects == null) ? 0 : mandatoryAspects
						.hashCode());
		result = prime * result
				+ ((queryName == null) ? 0 : queryName.hashCode());
		result = prime * result + ((title == null) ? 0 : title.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ObjectTypeCache other = (ObjectTypeCache) obj;
		if (!getOuterType().equals(other.getOuterType()))
			return false;
		if (childs == null) {
			if (other.childs != null)
				return false;
		} else if (!childs.equals(other.childs))
			return false;
		if (defaultLabel == null) {
			if (other.defaultLabel != null)
				return false;
		} else if (!defaultLabel.equals(other.defaultLabel))
			return false;
		if (description == null) {
			if (other.description != null)
				return false;
		} else if (!description.equals(other.description))
			return false;
		if (display == null) {
			if (other.display != null)
				return false;
		} else if (!display.equals(other.display))
			return false;
		if (key == null) {
			if (other.key != null)
				return false;
		} else if (!key.equals(other.key))
			return false;
		if (label == null) {
			if (other.label != null)
				return false;
		} else if (!label.equals(other.label))
			return false;
		if (mandatoryAspects == null) {
			if (other.mandatoryAspects != null)
				return false;
		} else if (!mandatoryAspects.equals(other.mandatoryAspects))
			return false;
		if (queryName == null) {
			if (other.queryName != null)
				return false;
		} else if (!queryName.equals(other.queryName))
			return false;
		if (title == null) {
			if (other.title != null)
				return false;
		} else if (!title.equals(other.title))
			return false;
		return true;
	}

	private ObjectTypeCache getOuterType() {
		return ObjectTypeCache.this;
	}

}
