package it.cnr.si.cool.jconon;

/**
 * Created by francesco on 06/05/16.
 */


import it.cnr.cool.rest.Application;
import it.cnr.cool.rest.*;
import it.cnr.cool.security.SecurityCheckInterceptor;
import it.cnr.jconon.rest.*;
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

        register(Cut.class);
        register(Copy.class);
        register(BulkInfoRest.class);
        register(CacheRest.class);
        register(CommonRest.class);
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
        register(PrintApplication.class);
    }

}

