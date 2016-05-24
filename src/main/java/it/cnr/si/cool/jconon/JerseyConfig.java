package it.cnr.si.cool.jconon;

/**
 * Created by francesco on 06/05/16.
 */


import it.cnr.cool.rest.BulkInfoRest;
import it.cnr.cool.rest.Content;
import it.cnr.cool.rest.Folder;
import it.cnr.cool.rest.FolderChildren;
import it.cnr.cool.rest.FrontOffice;
import it.cnr.cool.rest.I18n;
import it.cnr.cool.rest.Node;
import it.cnr.cool.rest.Page;
import it.cnr.cool.rest.Proxy;
import it.cnr.cool.rest.RBACRest;
import it.cnr.cool.rest.Search;
import it.cnr.cool.rest.SecurityRest;
import it.cnr.cool.rest.Sedi;
import it.cnr.cool.rest.StaticResouce;
import it.cnr.cool.rest.TypesTree;
import it.cnr.cool.security.SecurityCheckInterceptor;
import it.cnr.jconon.rest.Application;
import it.cnr.jconon.rest.CacheRest;
import it.cnr.jconon.rest.Call;
import it.cnr.jconon.rest.CommonRest;
import it.cnr.jconon.rest.ExportApplications;
import it.cnr.jconon.rest.Helpdesk;
import it.cnr.jconon.rest.ManageApplication;
import it.cnr.jconon.rest.ManageCall;
import it.cnr.jconon.rest.PrintApplication;

import javax.ws.rs.ApplicationPath;

import net.sf.jasperreports.engine.export.Cut;

import org.apache.tools.ant.taskdefs.Copy;
import org.glassfish.jersey.jackson.JacksonFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.server.spring.scope.RequestContextFilter;
import org.springframework.stereotype.Component;

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
        register(Call.class);
        register(PrintApplication.class);
    }

}

