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

package it.cnr.si.cool.jconon.configuration;

/**
 * Created by francesco on 06/05/16.
 */


import it.cnr.cool.rest.*;
import it.cnr.si.cool.jconon.pagopa.rest.GovPay;
import it.cnr.si.cool.jconon.util.SecurityCheckInterceptor;
import it.cnr.si.cool.jconon.rest.*;
import it.cnr.si.cool.jconon.util.RESTSecurityInterceptor;
import net.sf.jasperreports.engine.export.Cut;
import org.apache.tools.ant.taskdefs.Copy;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;
import org.springframework.stereotype.Component;

import javax.ws.rs.ApplicationPath;

@Component
@ApplicationPath("rest")
public class JerseyConfig extends ResourceConfig {

    public JerseyConfig() {
        register(RequestContextFilter.class);
        register(JacksonFeature.class);
        register(SecurityCheckInterceptor.class);
        register(RESTSecurityInterceptor.class);

        register(Cut.class);
        register(Copy.class);
        register(BulkInfoRest.class);
        register(CacheRest.class);
        register(CommonRest.class);
        register(ContentLdap.class);
        register(Content.class);
        register(Folder.class);
        register(FolderChildren.class);
        register(FrontOffice.class);
        register(I18n.class);
        register(Node.class);
        register(Page.class);
        register(Proxy.class);
        register(RBACRest.class);
        register(Search.class);
        register(SecurityRest.class);
        register(StaticResouce.class);
        register(TypesTree.class);
        register(Sedi.class);
        register(Application.class);
        register(ExportApplications.class);
        register(Helpdesk.class);
        register(ManageApplication.class);
        register(ManageCall.class);
        register(Call.class);
        register(PrintApplication.class);
        register(DownloadApplication.class);
        register(Graduatorie.class);
        register(Commission.class);
        register(IPA.class);
        register(GovPay.class);
    }
}
