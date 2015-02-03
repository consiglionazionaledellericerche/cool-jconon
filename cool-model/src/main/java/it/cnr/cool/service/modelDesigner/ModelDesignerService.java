package it.cnr.cool.service.modelDesigner;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.DocumentType;
import it.cnr.cool.cmis.model.ModelPropertiesIds;
import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.cmis.service.JaxBHelper;
import it.cnr.cool.service.util.AlfrescoDocument;
import it.cnr.cool.service.util.AlfrescoModel;
import it.cnr.cool.util.MimeTypes;
import it.cnr.cool.util.StringUtil;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;
import it.spasia.opencmis.criteria.restrictions.Restrictions;
import org.alfresco.model.dictionary._1.Aspect;
import org.alfresco.model.dictionary._1.Class.Properties;
import org.alfresco.model.dictionary._1.Model;
import org.alfresco.model.dictionary._1.Model.Types;
import org.alfresco.model.dictionary._1.Type;
import org.apache.chemistry.opencmis.client.api.*;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.BindingSession;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Output;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.client.runtime.ObjectIdImpl;
import org.apache.chemistry.opencmis.client.runtime.OperationContextImpl;
import org.apache.chemistry.opencmis.commons.PropertyIds;
import org.apache.chemistry.opencmis.commons.data.Ace;
import org.apache.chemistry.opencmis.commons.data.ContentStream;
import org.apache.chemistry.opencmis.commons.data.Principal;
import org.apache.chemistry.opencmis.commons.enums.BaseTypeId;
import org.apache.chemistry.opencmis.commons.enums.VersioningState;
import org.apache.chemistry.opencmis.commons.exceptions.CmisInvalidArgumentException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.exceptions.CmisRuntimeException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlEntryImpl;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlPrincipalDataImpl;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.apache.commons.httpclient.HttpStatus;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import javax.xml.bind.JAXBException;
import javax.xml.transform.stream.StreamSource;
import java.io.*;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class ModelDesignerService {

    private static final Logger LOGGER = LoggerFactory
            .getLogger(ModelDesignerService.class);
    private static final String linkRemoveModel = "service/cnr/model/remove-model-to-solr";
    private static final String BASE_MODEL_PATH = "/META-INF/model/baseModel.xml";
    private static final String TEXT_XML = "text/xml";
    public static final String URL_DELETE_TO_ARCHIVE = "service/api/archive/archive/SpacesStore/";
    // Usata nei test
    protected String pathNodeTemplates;
    @Autowired
    private OperationContext cmisDefaultOperationContext;
    @Autowired
    private JaxBHelper jaxBHelper;
    @Autowired
    private CMISService cmisService;
    private OperationContext modelDesignerOperationContext;
    private String pathModelFolder;
    private Folder modelFolder;
    private Folder nodeTemplatesFolder;

    public void init() {
        modelDesignerOperationContext = new OperationContextImpl(
                cmisDefaultOperationContext);
        modelDesignerOperationContext.setMaxItemsPerPage(Integer.MAX_VALUE);
        Session adminSession = cmisService.createAdminSession();
        nodeTemplatesFolder = (Folder) adminSession.getObjectByPath(pathNodeTemplates);
        modelFolder = (Folder) adminSession.getObjectByPath(pathModelFolder);
    }

    public List<AlfrescoModel> getModels(Session cmisSession) {
        List<Tree<FileableCmisObject>> models = modelFolder.getDescendants(1);

        List<AlfrescoModel> result = new ArrayList<>();
        Model modelUnmarshaled = null;
        Document modelDoc = null;

        for (Tree<FileableCmisObject> model : models) {
            FileableCmisObject obj = model.getItem();
            if (obj.getName().contains(".xml")) {
                modelDoc = cmisSession.getLatestDocumentVersion(obj.getId());
                try {
                    modelUnmarshaled = jaxBHelper.unmarshal(
                            new StreamSource(modelDoc.getContentStream()
                                    .getStream()), Model.class, false).getValue();
                } catch (JAXBException e) {
                    LOGGER.error("Errore nella mapping del model");
                } catch (CmisObjectNotFoundException e) {
                    // skippo i models cancellati tra l'esecuzione della query e
                    // l'unmarshal (accade nei test)
                    continue;
                }
                result.add(new AlfrescoModel(modelUnmarshaled, (CmisObject) obj, (boolean) obj.getPropertyValue(ModelPropertiesIds.MODEL_ACTIVE.value())));
            }
        }
        return result;
    }

    public List<AlfrescoDocument> getDocsByPath(Session adminSession,
                                                String nodeRef) {
        List<AlfrescoDocument> docs = new ArrayList<AlfrescoDocument>();

        Document xml = adminSession.getLatestDocumentVersion(new ObjectIdImpl(
                nodeRef));
        // se il modello nn è attivo non eseguo la query perché altrimenti mi
        // darebbe errore
        if (xml.getPropertyValue(ModelPropertiesIds.MODEL_ACTIVE.value())
                .equals(true)) {

            Model modello = null;
            try {
                modello = jaxBHelper.unmarshal(
                        new StreamSource(xml.getContentStream().getStream()),
                        Model.class, false).getValue();
            } catch (JAXBException e) {
                LOGGER.error("Errore nella mapping del model(NodeRef: "
                        + nodeRef + " )");
            }
//            Types types = modello != null ? modello.getTypes() : null;
//            if (types != null) {
//                List<Type> typeList = types.getType();
//                for (Type type : typeList) {
//                    docs.addAll(getDocsByTypeName(adminSession, type.getName()));
//                }
//            }
            if (modello != null && modello.getTypes() != null) {
                List<Type> typeList = modello.getTypes().getType();
                for (Type type : typeList) {
                    docs.addAll(getDocsByTypeName(adminSession, type.getName()));
                }
            }
        }
        return docs;
    }

    public List<AlfrescoDocument> getDocsByTypeName(Session adminSession,
                                                    String typeName) {
        List<AlfrescoDocument> docs = new ArrayList<AlfrescoDocument>();

        Criteria criteria = CriteriaFactory.createCriteria(typeName);
        ItemIterable<QueryResult> queryResult = criteria.executeQuery(
                adminSession, false, modelDesignerOperationContext);
        try {
            for (QueryResult qr : queryResult.getPage()) {
                docs.add(new AlfrescoDocument(qr));
            }
        } catch (CmisInvalidArgumentException | CmisRuntimeException e) {
            // il type è definito in un model non ancora attivo
            docs.clear();
        }
        return docs;
    }


    public List<AlfrescoDocument> getTemplatesByAspectsName(Session adminSession, List<String> aspectsList) {
        List<AlfrescoDocument> docs = new ArrayList<AlfrescoDocument>();
        if (aspectsList.size() > 0) {
            Criteria criteria = CriteriaFactory.createCriteria(DocumentType.CMIS_DOCUMENT.queryName());
            for (String aspectName : aspectsList) {
                //L'aspectName ha "-" al posto di ":" perché non riesco a passare i ":" nella chiamata ajax
                Criteria criteriaAspect = criteria.createCriteria(aspectName.replace("-", ":"));
                criteriaAspect.addJoinCriterion(Restrictions.eqProperty(criteria.prefix(PropertyIds.OBJECT_ID), criteriaAspect.prefix(PropertyIds.OBJECT_ID)));
            }

            ItemIterable<QueryResult> queryResult = criteria.executeQuery(
                    adminSession, false, modelDesignerOperationContext);
            try {
                for (QueryResult qr : queryResult.getPage()) {
                    docs.add(new AlfrescoDocument(qr));
                }
            } catch (CmisInvalidArgumentException | CmisRuntimeException e) {
                // il type è definito in un model non ancora attivo
                docs.clear();
            }
        }
        return docs;
    }

    public Map<String, Object> createModel(Session adminSession,
                                           String prefixModel, String nameXml) {
        Map<String, Object> model = new HashMap<String, Object>();
        Model baseModel = null;
        try {
            baseModel = jaxBHelper.unmarshal(
                    new StreamSource(getClass().getResourceAsStream(
                            BASE_MODEL_PATH)), Model.class, false).getValue();
        } catch (JAXBException e) {
            LOGGER.error("Errore nell'unmarshal del baseModel.xml");
        }
        // setto il nameModel scelto dall'utente nel name del model
        baseModel.setName(prefixModel + ":" + prefixModel + "Model");
        // concateno il nameModel scelto dall'utente nel prefix di nameSpace
        String baseNameSpace = baseModel.getNamespaces().getNamespace().get(0)
                .getUri();
        baseModel.getNamespaces().getNamespace().get(0)
                .setUri(baseNameSpace + prefixModel);
        baseModel.getNamespaces().getNamespace().get(0).setPrefix(prefixModel);

        ByteArrayOutputStream os = new ByteArrayOutputStream();
        try {
            jaxBHelper.createMarshaller().marshal(baseModel, os);
        } catch (JAXBException e) {
            LOGGER.error("Errore nel marshal del baseModel");
        }
        // scrivo il nuovo model in alfresco
        try {
            model = updateModel(adminSession, os.toString("UTF-8"), nameXml,
                    null);
        } catch (UnsupportedEncodingException e) {
            exceptionToModel(model, e.getMessage(), e.getStackTrace(),
                    e.getClass().getName());
            LOGGER.error("Errore nella creazione del nuovo Model: " + nameXml, e);
        }
        return model;
    }

    public Map<String, Object> updateModel(Session adminSession, String xml,
                                           String nameXml, String nodeRefToEdit) {
        Map<String, Object> model = new HashMap<String, Object>();

        Folder parent = (Folder) adminSession.getObjectByPath(pathModelFolder);
        try {
            byte[] content = xml.getBytes();
            InputStream stream = new ByteArrayInputStream(content);
            ContentStream contentStream = new ContentStreamImpl(nameXml,
                    BigInteger.valueOf(content.length), TEXT_XML, stream);

            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(PropertyIds.OBJECT_TYPE_ID,
                    ModelPropertiesIds.MODEL_TYPE_NAME.value());
            properties.put(PropertyIds.NAME, nameXml + ".xml");

            if (nodeRefToEdit == null) {
                nodeRefToEdit = parent.createDocument(properties,
                        contentStream, VersioningState.MAJOR).getId();
            } else {
                Document modello = adminSession
                        .getLatestDocumentVersion(nodeRefToEdit);
                modello = (Document) modello.updateProperties(properties);
                modello.setContentStream(contentStream, true);
            }
            model.put("status", "ok");
        } catch (Exception e) {
            exceptionToModel(model, e.getMessage(), e.getStackTrace(),
                    e.getClass().getName());
            LOGGER.error("Errore nella modifica del Model " + nameXml, e);
        }
        // Viene utilizzato nei test
        model.put("nodeRefModel", nodeRefToEdit);
        return model;
    }


    public Map<String, Object> generateTemplate(Session adminSession, String nameTemplate, List<String> selectedAspects) {

        Map<String, Object> model = new HashMap<>();
        Map<String, Object> propertiesTemplate = new HashMap<String, Object>();
        List<String> modifySelectedAspects = new ArrayList<>();

        LOGGER.debug("Creazione nuovo template: "
                + nameTemplate);
        try {
            List<Ace> addAces = new ArrayList<Ace>();
            List<String> permissionsConsumer = new ArrayList<String>();
            permissionsConsumer.add(ACLType.Consumer.name());
            Principal principal = new AccessControlPrincipalDataImpl(
                    "GROUP_EVERIONE");
            Ace aceContributor = new AccessControlEntryImpl(
                    principal, permissionsConsumer);
            addAces.add(aceContributor);

            propertiesTemplate.put(PropertyIds.NAME, nameTemplate);
            propertiesTemplate.put(PropertyIds.OBJECT_TYPE_ID,
                    BaseTypeId.CMIS_DOCUMENT.value());

            ObjectId objectId = nodeTemplatesFolder.createDocument(
                    propertiesTemplate, null,
                    VersioningState.MAJOR, null, addAces, null,
                    cmisDefaultOperationContext);
            Document template = adminSession
                    .getLatestDocumentVersion(objectId);
            for (String selectedAspect : selectedAspects) {
                modifySelectedAspects.add("P:" + selectedAspect);
            }
            //associo gli aspect al node template
            propertiesTemplate.put(
                    PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
                    modifySelectedAspects);

            template.updateProperties(propertiesTemplate, true);
            model.put("status", "ok");
        } catch (Exception ex) {
            exceptionToModel(model, ex.getMessage(), ex.getStackTrace(),
                    ex.getClass().getName());
        }
        return model;
    }

    public Map<String, Object> activateModel(Session adminSession,
                                             String nodeRef, boolean activate, BindingSession bindingSession) {
        Map<String, Object> model = new HashMap<String, Object>();
        Document modelToUpdate = adminSession.getLatestDocumentVersion(nodeRef);
        try {
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(ModelPropertiesIds.MODEL_ACTIVE.value(), activate);
            if (!activate) {
                // se disattivo i modelli devo prima cancellarli dal Data Model di Solr
                Model parsedModel = jaxBHelper.unmarshal(
                        new StreamSource((modelToUpdate).getContentStream()
                                .getStream()), Model.class, false).getValue();
                List<String> listAspectName = new ArrayList<>();
                if (parsedModel.getAspects() != null) {
                    for (Aspect aspect : parsedModel.getAspects().getAspect()) {
                        listAspectName.add(aspect.getName());
                    }
                }
                deleteDocumentByModel(adminSession, nodeRef, listAspectName);
                List<Model.Namespaces.Namespace> nameSpaces = parsedModel
                        .getNamespaces().getNamespace();
                for (final Model.Namespaces.Namespace namespace : nameSpaces) {
                    UrlBuilder url = new UrlBuilder(cmisService.getBaseURL()
                            + linkRemoveModel);
                    Response resp = cmisService.getHttpInvoker(bindingSession)
                            .invokePOST(url, MimeTypes.JSON.mimetype(),
                                    new Output() {
                                        @Override
                                        public void write(OutputStream out)
                                                throws Exception {
                                            JSONObject jsonObject = new JSONObject();
                                            jsonObject.put("nameSpacePrefix",
                                                    namespace.getPrefix());
                                            out.write(jsonObject.toString()
                                                    .getBytes());
                                        }
                                    }, cmisService.getAdminSession());
                    int stato = resp.getResponseCode();
                    JSONObject jsonObject = new JSONObject(
                            StringUtil.convertStreamToString(resp.getStream()));
                    if (jsonObject.getString("status").equals("ko")
                            || stato == HttpStatus.SC_BAD_REQUEST
                            || stato == HttpStatus.SC_INTERNAL_SERVER_ERROR
                            || stato == HttpStatus.SC_NOT_FOUND) {
                        exceptionToModel(model,
                                "Error to execute remove-model.post.js: "
                                        + jsonObject.getString("error"), null,
                                null);
                        break;
                    }
                }
                // se si è verificato un errore nella rimozione dei modelli da
                // Solr viene popolato il campo "status" (oltre al campo
                // "message") del model che viene restituito dal servizio rest
                if (!model.containsKey("status"))
                    model.put("statusModel", "disactivate");

            } else {
                model.put("statusModel", "activate");
            }
            modelToUpdate.updateProperties(properties, true);
            model.put("status", "ok");
        } catch (Exception e) {
            exceptionToModel(model, e.getMessage(), e.getStackTrace(),
                    e.getClass().getName());
            LOGGER.error("Errore nell'attivazione/disattivazione del modello",
                    e);
        }
        return model;
    }

    public Map<String, Object> deleteProperty(Session adminSession,
                                              String nodeRefMoldel, String typeName, String propertyName) {
        Map<String, Object> model = new HashMap<String, Object>();
        Document doc = adminSession.getLatestDocumentVersion(nodeRefMoldel);
        Model modello = null;
        try {
            modello = jaxBHelper.unmarshal(
                    new StreamSource(doc.getContentStream().getStream()),
                    Model.class, false).getValue();
        } catch (JAXBException e) {
            LOGGER.error("Errore nella mapping del model(NodeRef: "
                    + nodeRefMoldel + " )");
        }
        setNullPropertyToDocs(propertyName, typeName, adminSession);
        Types types = modello != null ? modello.getTypes() : null;
        List<Type> listType = types.getType();
        List<Type> newListType = new ArrayList<Type>();
        // popolo la nuova lista dei type del modello (uguale a prima escluso il
        // type da rimuovere)
        for (Type type : listType) {
            if (type.getName().equals(typeName)) {
                Properties properties = type.getProperties();
                List<org.alfresco.model.dictionary._1.Property> listProperty = properties.getProperty();
                org.alfresco.model.dictionary._1.Property propertyToRemove = new org.alfresco.model.dictionary._1.Property();
                for (org.alfresco.model.dictionary._1.Property property : listProperty) {
                    if (property.getName().equals(propertyName)) {
                        propertyToRemove = property;
                        break;
                    }
                }
                listProperty.remove(propertyToRemove);
                properties.setProperty(listProperty);
                type.setProperties(properties);
            }
            newListType.add(type);
        }

        types.setType(newListType);
        modello.setTypes(types);
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        try {
            jaxBHelper.createMarshaller().marshal(modello, os);
            ContentStream contentStream = new ContentStreamImpl(doc.getName(),
                    BigInteger.ZERO, TEXT_XML, new ByteArrayInputStream(
                    os.toByteArray()));
            // se recupero il doc con myRequest.getCmisSession().getLatestDocumentVersion(nodeRefMoldel)
            // quando setto il contentStream ottengo CmisPermissionDeniedException
            doc.setContentStream(contentStream, true);
            model.put("status", "ok");
        } catch (JAXBException e) {
            exceptionToModel(model, e.getMessage(), e.getStackTrace(),
                    e.getClass().getName());
            LOGGER.error("Errore nella cancellazione del type", e);
        }
        return model;
    }

    public Map<String, Object> deleteModel(Session adminSession,
                                           String nodeRefToDelete, BindingSession bindingSession) {
        Map<String, Object> model = new HashMap<String, Object>();
        try {
            Document modello = adminSession
                    .getLatestDocumentVersion(nodeRefToDelete);
            if (modello.getPropertyValue(
                    ModelPropertiesIds.MODEL_ACTIVE.value()).equals(true)) {
                activateModel(adminSession, nodeRefToDelete, false,
                        bindingSession);
            }
            modello.delete(true);
            model.put("status", "ok");
        } catch (CmisRuntimeException e) {
            exceptionToModel(model, e.getMessage(), e.getStackTrace(),
                    e.getClass().getName());
            LOGGER.error("Errore nella cancellazione del modello", e);
        }
        return model;
    }

    public void setPathModelFolder(String pathModelfolder) {
        this.pathModelFolder = pathModelfolder;
    }

    public void setPathNodeTemplates(String pathNodeTemplates) {
        this.pathNodeTemplates = pathNodeTemplates;
    }

    /**
     * se gli passo il noderef recupera tutti i doc dei type definiti nel
     * model.xml se gli passo il typeName recupera solo i doc di quel type
     */
    private void deleteDocumentByModel(Session adminSession, String nodeRef,
                                       List<String> aspectName) {
        List<AlfrescoDocument> docs = new ArrayList<AlfrescoDocument>();
        docs = getDocsByPath(adminSession, nodeRef);

        for (AlfrescoDocument doc : docs) {
            // cancello i doc dal workspace
            ObjectIdImpl objId = new ObjectIdImpl(doc.getNodeRef());
            adminSession.delete(objId, true);
            deleteToArchive(doc);
        }

        List<AlfrescoDocument> templates = getTemplatesByAspectsName(adminSession, aspectName);
        for (AlfrescoDocument template : templates) {
            // cancello i template dal workspace
            adminSession.delete(new ObjectIdImpl(template.getNodeRef()));
            // cancello i template dall'archive (cestino)
            deleteToArchive(template);
        }
    }

    private void deleteToArchive(AlfrescoDocument doc) {
        String link = cmisService
                .getBaseURL()
                .concat(URL_DELETE_TO_ARCHIVE)
                .concat(doc.getNodeRef().substring(0,
                        doc.getNodeRef().indexOf(";")));
        UrlBuilder url = new UrlBuilder(link);

        Response resp = CmisBindingsHelper.getHttpInvoker(
                cmisService.getAdminSession()).invokeDELETE(url,
                cmisService.getAdminSession());
        if (resp.getResponseCode() != HttpStatus.SC_OK) {
            throw new CmisRuntimeException(resp.getErrorContent());
        }
    }

    private void setNullPropertyToDocs(String propertyName, String typeName,
                                       Session adminSession) {
        List<AlfrescoDocument> docs = getDocsByTypeName(adminSession, typeName);

        for (AlfrescoDocument alfrescoDocument : docs) {
            CmisObject doc = adminSession
                    .getLatestDocumentVersion(alfrescoDocument.getNodeRef());
            Map<String, Object> properties = new HashMap<String, Object>();
            properties.put(propertyName, null);
            doc.updateProperties(properties, true);
        }
    }

    private void exceptionToModel(Map<String, Object> model,
                                  String message, StackTraceElement[] stackTraceElements, String type) {
        model.put("status", "ko");
        model.put("message", message);
        model.put("stacktrace", stackTraceElements);
        model.put("type", type);
    }
}