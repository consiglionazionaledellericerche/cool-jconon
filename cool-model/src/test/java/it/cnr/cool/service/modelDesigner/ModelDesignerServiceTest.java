package it.cnr.cool.service.modelDesigner;

import it.cnr.cool.cmis.model.ModelPropertiesIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.JaxBHelper;
import it.cnr.cool.service.util.AlfrescoDocument;
import org.alfresco.model.dictionary._1.Model;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Session;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.commons.io.IOUtils;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.servlet.http.HttpServletRequest;
import javax.xml.bind.JAXBException;
import javax.xml.transform.stream.StreamSource;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.junit.Assert.assertTrue;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:/META-INF/spring/cool-model-test-context.xml"})
@DirtiesContext(classMode = ClassMode.AFTER_CLASS)
public class ModelDesignerServiceTest {

    final static String MODEL_NAME = "model";
    final static String TEMPLATE_NAME = "testTemplate";
    private final Date data = new Date();
    @Autowired
    private ModelDesignerService modelDesignerService;
    @Autowired
    private JaxBHelper jaxBHelper;
    @Autowired
    private Service service;
    private Session cmisSession;
    private String nodeRefModel;
    private String suffisso;
    @Autowired
    private CMISService cmisService;
    private BindingSession bindingSession;

    @Before
    public void init() {
        try {
            String xml = IOUtils
                    .toString(getClass().getResourceAsStream("/model.xml"));
            suffisso = "Test" + data.getTime();
            createModel(xml, suffisso);
        } catch (IOException e) {
            System.err
                    .println("Errore nel caricamento del contenuto del modello dal File System");
        }
    }

    public void createModel(String xml, String suffisso) {
        cmisSession = service.getAdminSession();
        HttpServletRequest req = new MockHttpServletRequest();
        bindingSession = cmisService.getCurrentBindingSession(req);

        Map<String, Object> resp;
        xml = xml.replace("test", suffisso);

        resp = modelDesignerService.createModel(cmisSession, "", MODEL_NAME + suffisso);
        nodeRefModel = ((String) resp.get("nodeRefModel")).split(";")[0];
        String version = ((String) resp.get("nodeRefModel")).split(";")[1];

        resp = modelDesignerService.updateModel(cmisSession, xml, MODEL_NAME
                + suffisso, nodeRefModel + ";" + version);

        assertTrue(resp.get("status").equals("ok"));
        nodeRefModel = ((String) resp.get("nodeRefModel")).split(";")[0];
        version = ((String) resp.get("nodeRefModel")).split(";")[1];

        modelDesignerService.activateModel(cmisSession, nodeRefModel + ";"
                + version, true, bindingSession);
    }

    @After
    public void deleteModel() {
        Map<String, Object> resp = modelDesignerService.deleteModel(
                cmisSession, nodeRefModel, bindingSession);
        assertTrue(((String) resp.get("status")).equals("ok"));
    }

    @Test
    public void testActivateModel() throws InterruptedException {
        Boolean active = false;
        Map<String, Object> resp = modelDesignerService.activateModel(
                cmisSession, nodeRefModel, active, bindingSession);
        assertTrue(((String) resp.get("statusModel")).equals("disactivate"));
        assertTrue(((String) resp.get("status")).equals("ok"));
        assertTrue(cmisSession.getLatestDocumentVersion(nodeRefModel)
                .getPropertyValue(ModelPropertiesIds.MODEL_ACTIVE.value())
                .equals(active));
        active = true;
        resp = modelDesignerService.activateModel(cmisSession, nodeRefModel,
                active, bindingSession);
        assertTrue(((String) resp.get("statusModel")).equals("activate"));
        assertTrue(((String) resp.get("status")).equals("ok"));

        assertTrue(cmisSession.getLatestDocumentVersion(nodeRefModel)
                .getPropertyValue(ModelPropertiesIds.MODEL_ACTIVE.value())
                .equals(active));
    }

    @Test
    public void testDeleteProperty() {
        // cancello la property "test:toDelete"
        Map<String, Object> resp = modelDesignerService.deleteProperty(
                cmisSession, nodeRefModel, suffisso + ":document", suffisso
                        + ":toDelete");
        assertTrue(((String) resp.get("status")).equals("ok"));
        Document doc = cmisSession.getLatestDocumentVersion(nodeRefModel);

        Model modello;
        try {
            modello = jaxBHelper.unmarshal(
                    new StreamSource(doc.getContentStream().getStream()),
                    Model.class, false).getValue();
            // controlllo che, dopo la cancellazione della property del primo
            // type definito nel model.xml, ne sia rimasta solo una
            assertTrue(modello.getTypes().getType().get(0).getProperties()
                    .getProperty().size() == 1);
        } catch (JAXBException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testGetDocs() {
        List<AlfrescoDocument> docs = modelDesignerService.getDocsByPath(
                cmisSession, nodeRefModel);
        assertTrue(docs.size() == 0);

        docs = modelDesignerService.getDocsByTypeName(cmisSession, suffisso
                + ":document");
        assertTrue(docs.size() == 0);
    }

    @Test
    public void testInvalidUpdate() throws IOException {
        String invalidXml = IOUtils.toString(getClass().getResourceAsStream(
                "/invalidModel.xml"));
        invalidXml = invalidXml.replace("test", suffisso);
        // provo una modifica NON consentita (eliminazione del type)
        Map<String, Object> resp = modelDesignerService.updateModel(
                cmisSession, invalidXml, ModelDesignerServiceTest.MODEL_NAME
                        + suffisso, nodeRefModel);
        assertTrue(resp.get("status").equals("ko"));
        assertTrue(((String) resp.get("message"))
                .contains("Failed to validate model update - found deleted TYPE '{http://www.cnr.it/model/"
                        + suffisso + "}document'"));
    }

    @Test
    public void testUpdateModel() throws IOException {
        String updateXml = IOUtils.toString(getClass().getResourceAsStream(
                "/updateModel.xml"));

        updateXml = updateXml.replace("test", suffisso);
        // provo una modifica consentita
        Map<String, Object> resp = modelDesignerService.updateModel(
                cmisSession, updateXml, ModelDesignerServiceTest.MODEL_NAME
                        + data.getTime(), nodeRefModel);
        assertTrue(resp.get("status").equals("ok"));
    }
}