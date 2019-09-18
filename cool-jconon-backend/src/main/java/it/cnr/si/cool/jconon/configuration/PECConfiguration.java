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

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix="pec.mail")
public class PECConfiguration {
    private String hostImap;
    private String hostSmtp;
    private String url;
    private Boolean auth;
    private Boolean sslEnable;
    private String port;
    private String socketFactoryClass;
    private Integer connectiontimeout;
    private Integer timeout;

    public String getHostImap() {
        return hostImap;
    }

    public void setHostImap(String hostImap) {
        this.hostImap = hostImap;
    }

    public String getHostSmtp() {
        return hostSmtp;
    }

    public void setHostSmtp(String hostSmtp) {
        this.hostSmtp = hostSmtp;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getAuth() {
        return auth;
    }

    public void setAuth(Boolean auth) {
        this.auth = auth;
    }

    public Boolean getSslEnable() {
        return sslEnable;
    }

    public void setSslEnable(Boolean sslEnable) {
        this.sslEnable = sslEnable;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public String getSocketFactoryClass() {
        return socketFactoryClass;
    }

    public void setSocketFactoryClass(String socketFactoryClass) {
        this.socketFactoryClass = socketFactoryClass;
    }

    public Integer getConnectiontimeout() {
        return connectiontimeout;
    }

    public void setConnectiontimeout(Integer connectiontimeout) {
        this.connectiontimeout = connectiontimeout;
    }

    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

    @Override
    public String toString() {
        return "PECConfiguration{" +
                "hostImap='" + hostImap + '\'' +
                ", hostSmtp='" + hostSmtp + '\'' +
                ", url='" + url + '\'' +
                ", auth=" + auth +
                ", sslEnable=" + sslEnable +
                ", port='" + port + '\'' +
                ", socketFactoryClass='" + socketFactoryClass + '\'' +
                ", connectiontimeout=" + connectiontimeout +
                ", timeout=" + timeout +
                '}';
    }
}
