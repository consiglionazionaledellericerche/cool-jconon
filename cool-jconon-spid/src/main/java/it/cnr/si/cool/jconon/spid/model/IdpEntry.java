/*
 * Copyright (C) 2019  Consiglio Nazionale delle Ricerche
 *
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

package it.cnr.si.cool.jconon.spid.model;

import java.util.Objects;

public class IdpEntry {
    private String entityId;
    private String name;
    private String imageUrl;
    private String file;
    private String profile;
    private String postURL;
    private String redirectURL;

    public IdpEntry() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        IdpEntry idpEntry = (IdpEntry) o;
        return entityId.equals(idpEntry.entityId) && name.equals(idpEntry.name) && Objects.equals(imageUrl, idpEntry.imageUrl) && Objects.equals(file, idpEntry.file) && Objects.equals(profile, idpEntry.profile) && Objects.equals(postURL, idpEntry.postURL) && Objects.equals(redirectURL, idpEntry.redirectURL);
    }

    @Override
    public int hashCode() {
        return Objects.hash(entityId, name, imageUrl, file, profile, postURL, redirectURL);
    }

    public String getEntityId() {
        return entityId;
    }

    public void setEntityId(final String entityId) {
        this.entityId = entityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPostURL() {
        return postURL;
    }

    public void setPostURL(String postURL) {
        this.postURL = postURL;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getFile() {
        return file;
    }

    public void setFile(String file) {
        this.file = file;
    }

    public String getProfile() {
        return profile;
    }

    public void setProfile(String profile) {
        this.profile = profile;
    }

    public String getRedirectURL() {
        return redirectURL;
    }

    public void setRedirectURL(String redirectURL) {
        this.redirectURL = redirectURL;
    }

    @Override
    public String toString() {
        return "IdpEntry{" +
                "entityId='" + entityId + '\'' +
                ", name='" + name + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", file='" + file + '\'' +
                ", profile='" + profile + '\'' +
                ", postURL='" + postURL + '\'' +
                ", redirectURL='" + redirectURL + '\'' +
                '}';
    }

}
