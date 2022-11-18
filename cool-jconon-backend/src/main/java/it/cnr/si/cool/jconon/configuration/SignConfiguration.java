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

package it.cnr.si.cool.jconon.configuration;

import it.cnr.jada.firma.arss.ArubaSignServiceClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix="firma.automatica")
public class SignConfiguration {

    private String delegatedUser;
    private Integer leftx;
    private Integer lefty;
    private String location;
    private Integer page;
    private Integer rightx;
    private Integer righty;
    private String image;

    public String getDelegatedUser() {
        return delegatedUser;
    }

    public void setDelegatedUser(String delegatedUser) {
        this.delegatedUser = delegatedUser;
    }

    public Integer getLeftx() {
        return leftx;
    }

    public void setLeftx(Integer leftx) {
        this.leftx = leftx;
    }

    public Integer getLefty() {
        return lefty;
    }

    public void setLefty(Integer lefty) {
        this.lefty = lefty;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getRightx() {
        return rightx;
    }

    public void setRightx(Integer rightx) {
        this.rightx = rightx;
    }

    public Integer getRighty() {
        return righty;
    }

    public void setRighty(Integer righty) {
        this.righty = righty;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Bean
    public ArubaSignServiceClient createArubaSignServiceClient() {
        return new ArubaSignServiceClient(delegatedUser);
    }

    @Override
    public String toString() {
        return "SignConfiguration{" +
                "delegatedUser='" + delegatedUser + '\'' +
                ", leftx=" + leftx +
                ", lefty=" + lefty +
                ", location='" + location + '\'' +
                ", page=" + page +
                ", rightx=" + rightx +
                ", righty=" + righty +
                ", image='" + image + '\'' +
                '}';
    }
}
