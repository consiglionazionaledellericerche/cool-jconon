package it.cnr.si.cool.jconon.repository.dto;

import java.io.Serializable;

public class CmisObjectCache implements Serializable{

	private static final long serialVersionUID = 1L;
	private String id;
	private String path;
	
	public String getId() {
		return id;
	}
	public CmisObjectCache id(String id) {
		this.id = id;
		return this;
	}
	public String getPath() {
		return path;
	}
	public CmisObjectCache path(String path) {
		this.path = path;
		return this;
	}
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		result = prime * result + ((path == null) ? 0 : path.hashCode());
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
		CmisObjectCache other = (CmisObjectCache) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		if (path == null) {
			if (other.path != null)
				return false;
		} else if (!path.equals(other.path))
			return false;
		return true;
	}
	@Override
	public String toString() {
		return "CmisObjectCache [id=" + id + ", path=" + path + "]";
	}	
}
