package it.cnr.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.security.service.impl.alfresco.UserServiceImpl;
import it.cnr.cool.util.MimeTypes;
import it.cnr.jconon.cmis.model.JCONONFolderType;
import it.cnr.jconon.model.HelpdeskBean;
import it.cnr.jconon.service.helpdesk.HelpdeskService;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/cool-jconon-test-context.xml"})
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class HelpDeskServiceTest {

    public static final String NAME_ATTACHMENTS = "allegato.pdf";
    public static final String MESSAGE = "Messaggio dell'email";
    public static final String SUBJECT = "Oggetto dell'email";
    public static final String ID_CATEGORY = "614";
    public static final String SOURCE_IP = "0:0:0:0:0:0:0:1";
    public static final String ID = "4";
    public static final String AZIONE = "c1";
    public static final String MESSAGE_REOPEN = "messaggio testPostReopen";
    public static final String PROBLEM_TYPE = "Problema Normativo";
    public static final String MATRICOLA = "0";
    public static final String CALL = "BANDO 367.4 DISBA IPSP RIC";

    @Autowired
    private HelpdeskService helpdeskService;
    @Autowired
    private CMISService cmisService;

    public static CMISUser getCmisUser() {
        return cmisUser;
    }

    private static CMISUser cmisUser;
    @Autowired
    private OperationContext cmisDefaultOperationContext;
    private Folder call;
    @Autowired
    private UserServiceImpl userService;
    private Map<String, String> postMap;


    @Before
    public void before() throws ParseException, InterruptedException,
            CoolUserFactoryException {
        //Seleziono uno dei bandi attivi
        OperationContext oc = new OperationContextImpl(
                cmisDefaultOperationContext);
        oc.setMaxItemsPerPage(1);
        Session adminSession = cmisService.createAdminSession();

        Calendar startDate = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
        Criteria criteria = CriteriaFactory
                .createCriteria(JCONONFolderType.JCONON_CALL.queryName());

        ItemIterable<QueryResult> queryResult = criteria.executeQuery(
                adminSession, false, oc);

        MockHttpServletRequest req = new MockHttpServletRequest();
        BindingSession bindingSession = cmisService
                .getCurrentBindingSession(req);

        cmisUser = userService.loadUser("spaclient", bindingSession);

        for (QueryResult qr : queryResult) {
            call = (Folder) adminSession.getObject(new ObjectIdImpl((String) qr
                    .getPropertyValueById(PropertyIds.OBJECT_ID)));
        }

        postMap = new HashMap<String, String>();
        postMap.put("firstName", cmisUser.getFirstName());
        postMap.put("lastName", cmisUser.getLastName());
        postMap.put("phoneNumber", cmisUser.getTelephone());
        postMap.put("email", cmisUser.getEmail());
        postMap.put("confirmEmail", cmisUser.getEmail());
        postMap.put("category", ID_CATEGORY);
        postMap.put("subject", SUBJECT);
        postMap.put("message", MESSAGE);

        postMap.put("problemType", PROBLEM_TYPE);
        postMap.put("matricola", MATRICOLA);
        postMap.put("call", CALL);
    }

    @Test
    public void testPost() throws IOException, InvocationTargetException, IllegalAccessException {

        MultipartFile allegato = new MockMultipartFile(NAME_ATTACHMENTS,
                                                       NAME_ATTACHMENTS, MimeTypes.PDF.mimetype(),
                                                       IOUtils.toByteArray(getClass().getResourceAsStream(
                                                               "/" + NAME_ATTACHMENTS)));
        HelpdeskBean hdBean = new HelpdeskBean();

        hdBean.setIp(SOURCE_IP);
        BeanUtils.populate(hdBean, postMap);

        helpdeskService.post(hdBean, allegato, cmisUser);
    }

    @Test
    public void testPostReopen() throws IOException, InvocationTargetException, IllegalAccessException {

        HelpdeskBean hdBean = new HelpdeskBean();
        hdBean.setIp(SOURCE_IP);

        Map parameterMapReopen = new HashMap();
        parameterMapReopen.put("id", ID);
        parameterMapReopen.put("azione", AZIONE);
        parameterMapReopen.put("message", MESSAGE_REOPEN);

        BeanUtils.populate(hdBean, parameterMapReopen);

        helpdeskService.sendReopenMessage(hdBean);
    }
}
