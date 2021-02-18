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

package it.cnr.si.cool.jconon.service;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.exception.CoolUserFactoryException;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.security.service.impl.alfresco.UserServiceImpl;
import it.cnr.cool.util.MimeTypes;
import it.cnr.si.cool.jconon.cmis.model.JCONONFolderType;
import it.cnr.si.cool.jconon.model.HelpdeskBean;
import it.cnr.si.cool.jconon.service.helpdesk.HelpdeskService;
import it.cnr.si.opencmis.criteria.Criteria;
import it.cnr.si.opencmis.criteria.CriteriaFactory;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;


@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("test")
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
    public static String CALL;
    private static CMISUser cmisUser;
    @Autowired
    private HelpdeskService helpdeskService;
    @Autowired
    private CMISService cmisService;
    @Autowired
    private OperationContext cmisDefaultOperationContext;
    private Folder call;
    @Autowired
    private UserServiceImpl userService;
    private Map<String, String> postMap;

    public static CMISUser getCmisUser() {
        return cmisUser;
    }

    @BeforeEach
    @Disabled
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
        BindingSession bindingSession = cmisService.getAdminSession();

        cmisUser = userService.loadUser("admin", bindingSession);

        for (QueryResult qr : queryResult) {
            call = (Folder) adminSession.getObject(new ObjectIdImpl(qr
                    .getPropertyValueById(PropertyIds.OBJECT_ID)));
            CALL = call.getName();
            break;
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
    @Disabled
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
    @Disabled
    public void testPostReopen() throws IOException, InvocationTargetException, IllegalAccessException {

        HelpdeskBean hdBean = new HelpdeskBean();
        hdBean.setIp(SOURCE_IP);

        Map parameterMapReopen = new HashMap();
        parameterMapReopen.put("id", ID);
        parameterMapReopen.put("azione", AZIONE);
        parameterMapReopen.put("message", MESSAGE_REOPEN);

        BeanUtils.populate(hdBean, parameterMapReopen);

        helpdeskService.sendReopenMessage(hdBean, cmisUser);
    }
}
