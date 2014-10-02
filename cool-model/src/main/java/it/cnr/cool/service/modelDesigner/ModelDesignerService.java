package it.cnr.cool.service.modelDesigner;

import it.cnr.cool.cmis.model.ACLType;
import it.cnr.cool.cmis.model.ModelPropertiesIds;
import it.cnr.cool.cmis.service.JaxBHelper;
import it.cnr.cool.service.util.AlfrescoDocument;
import it.cnr.cool.service.util.AlfrescoModel;
import it.spasia.opencmis.criteria.Criteria;
import it.spasia.opencmis.criteria.CriteriaFactory;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.xml.bind.JAXBException;
import javax.xml.transform.stream.StreamSource;

import org.alfresco.model.dictionary._1.Aspect;
import org.alfresco.model.dictionary._1.Class.Properties;
import org.alfresco.model.dictionary._1.Model;
import org.alfresco.model.dictionary._1.Model.Types;
import org.alfresco.model.dictionary._1.Property;
import org.alfresco.model.dictionary._1.Type;
import org.apache.chemistry.opencmis.client.api.CmisObject;
import org.apache.chemistry.opencmis.client.api.Document;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.api.ItemIterable;
import org.apache.chemistry.opencmis.client.api.ObjectId;
import org.apache.chemistry.opencmis.client.api.OperationContext;
import org.apache.chemistry.opencmis.client.api.QueryResult;
import org.apache.chemistry.opencmis.client.api.Session;
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
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlEntryImpl;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.AccessControlPrincipalDataImpl;
import org.apache.chemistry.opencmis.commons.impl.dataobjects.ContentStreamImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class ModelDesignerService {

	private static final String BASE_MODEL_PATH = "/META-INF/model/baseModel.xml";
	private static final String TEXT_XML = "text/xml";
	private static final String WORKSPACE = "workspace";
	private static final String ARCHIVE = "archive";
	@Autowired
	private OperationContext cmisDefaultOperationContext;
	private OperationContext modelDesignerOperationContext;
	private String modelsPath;
	public String nodeTemplatesPath;
	private static final Logger LOGGER = LoggerFactory
			.getLogger(ModelDesignerService.class);
	@Autowired
	private JaxBHelper jaxBHelper;

	public void init() {
		modelDesignerOperationContext = new OperationContextImpl(
				cmisDefaultOperationContext);
		modelDesignerOperationContext.setMaxItemsPerPage(Integer.MAX_VALUE);
	}

	public List<AlfrescoModel> getModels(Session cmisSession) {
		Criteria criteria = CriteriaFactory
				.createCriteria(ModelPropertiesIds.MODEL_QUERY_NAME.value());

		ItemIterable<QueryResult> queryResult = criteria.executeQuery(
				cmisSession, false, modelDesignerOperationContext);
		List<AlfrescoModel> result = new ArrayList<AlfrescoModel>();
		for (QueryResult qr : queryResult.getPage()) {
			Model modello = null;
			try {
				ObjectIdImpl objectId = new ObjectIdImpl(
						(String) qr.getPropertyValueById(PropertyIds.OBJECT_ID));
				modello = jaxBHelper.unmarshal(
						new StreamSource(cmisSession.getContentStream(objectId)
								.getStream()), Model.class, false).getValue();
			} catch (JAXBException e) {
				LOGGER.error("Errore nella mapping del model");
			} catch (CmisObjectNotFoundException e) {
				// skippo i models cancellati tra l'esecuzione della query e
				// l'unmarshal (accade nei test)
				continue;
			}
			result.add(new AlfrescoModel(modello, qr));
		}
		return result;
	}

	public List<AlfrescoDocument> getDocsByPath(Session adminSession,
			String nodeRef) {
		List<AlfrescoDocument> docs = new ArrayList<AlfrescoDocument>();

		Document xml = (Document) adminSession.getObject(new ObjectIdImpl(
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
			List<Type> typeList = modello.getTypes().getType();
			for (Type type : typeList) {
				docs.addAll(getDocsByTypeName(adminSession, type.getName()));
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
		} catch (CmisInvalidArgumentException e) {
			// il type è definito in un model non ancora attivo
			docs.clear();
		}
		return docs;
	}

	public Map<String, Object> createModel(Session adminSession,
			String prefixModel, String nameXml, Object object) {
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
		baseModel.setName(prefixModel);
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
					null, false, null);
		} catch (UnsupportedEncodingException e) {
			model = exceptionToModel(model, e.getMessage(), e.getStackTrace(),
					e.getClass().getName());
			LOGGER.error("Errore nella creazione del nuovo Model: " + nameXml,
					e);
		}
		return model;
	}

	public Map<String, Object> updateModel(Session adminSession, String xml,
			String nameXml, String nodeRefToEdit, boolean generateTemplate,
			String nameTemplate) {
		Map<String, Object> model = new HashMap<String, Object>();

		Folder parent = (Folder) adminSession.getObjectByPath(modelsPath);
		try {
			byte[] content = xml.getBytes();
			InputStream stream = new ByteArrayInputStream(content);
			ContentStream contentStream = new ContentStreamImpl(nameXml,
					BigInteger.valueOf(content.length), TEXT_XML, stream);

			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(PropertyIds.OBJECT_TYPE_ID,
					ModelPropertiesIds.MODEL_TYPE_NAME.value());
			properties.put(PropertyIds.NAME, nameXml + ".xml");
			if (nodeRefToEdit == null)
				nodeRefToEdit = parent.createDocument(properties,
						contentStream, VersioningState.MAJOR).getId();
			else {
				Document modello = adminSession
						.getLatestDocumentVersion(nodeRefToEdit);
				modello = (Document) modello.updateProperties(properties);
				modello.setContentStream(contentStream, true);
			}

			if (generateTemplate) {
				InputStream is = contentStream.getStream();
				is.reset();
				Model modello = jaxBHelper.unmarshal(new StreamSource(is),
						Model.class, false).getValue();
				if (modello.getAspects() != null) {
					Folder nodeTemplates = (Folder) adminSession
							.getObjectByPath(nodeTemplatesPath);
					Document template;
					List<Aspect> newAspects = modello.getAspects().getAspect();
					for (Aspect aspect : newAspects) {

						Map<String, Object> propertiesTemplate = new HashMap<String, Object>();
						try {
							template = (Document) adminSession
									.getObjectByPath(nodeTemplatesPath + "/"
											+ nameTemplate);
						} catch (CmisObjectNotFoundException e) {
							LOGGER.debug("Creazione nuovo template: "
									+ nameTemplate);

							List<Ace> addAces = new ArrayList<Ace>();
							List<String> permissionsConsumer = new ArrayList<String>();
							permissionsConsumer.add(ACLType.Consumer.name());
							Principal principal = new AccessControlPrincipalDataImpl(
									"GROUP_EVERIONE");
							Ace aceContributor = new AccessControlEntryImpl(
									principal, permissionsConsumer);
							addAces.add(aceContributor);

							propertiesTemplate.put(PropertyIds.NAME,
									nameTemplate);
							propertiesTemplate.put(PropertyIds.OBJECT_TYPE_ID,
									BaseTypeId.CMIS_DOCUMENT.value());

							ObjectId objectId = nodeTemplates.createDocument(
									propertiesTemplate, contentStream,
									VersioningState.MAJOR, null, addAces, null,
									cmisDefaultOperationContext);
							template = (Document) adminSession
									.getObject(objectId);
						}
						List<String> aspectNames = new ArrayList<String>();
						aspectNames.add("P:" + aspect.getName());
						propertiesTemplate.put(
								PropertyIds.SECONDARY_OBJECT_TYPE_IDS,
								aspectNames);

						template.updateProperties(propertiesTemplate, true);
					}
				}
			}
			model.put("status", "ok");
		} catch (Exception e) {
			model.put("status", "ko");
			model = exceptionToModel(model, e.getMessage(), e.getStackTrace(),
					e.getClass().getName());
			LOGGER.error("Errore nella modifica del Model " + nameXml, e);
		}
		// Viene utilizzato nei test
		model.put("nodeRefModel", nodeRefToEdit);
		return model;
	}

	public Map<String, Object> activateModel(Session adminSession,
			String nodeRef, boolean activate) {
		Map<String, Object> model = new HashMap<String, Object>();
		CmisObject modelToUpdate = adminSession.getObject(nodeRef);
		try {
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(ModelPropertiesIds.MODEL_ACTIVE.value(), activate);
			// AGGIUNGERE DATA SE ATTIVO IL MODELLO ?
			modelToUpdate.updateProperties(properties, true);
			if (activate) {
				model.put("status", "activate");
			} else {
				model.put("status", "disactivate");
			}
		} catch (Exception e) {
			model.put("status", "ko");
			model = exceptionToModel(model, e.getMessage(), e.getStackTrace(),
					e.getClass().getName());
			LOGGER.error("Errore nell'attivazione del modello", e);
		}
		return model;
	}

	public Map<String, Object> deleteProperty(Session adminSession,
			String nodeRefMoldel, String typeName, String propertyName) {
		Map<String, Object> model = new HashMap<String, Object>();
		Document doc = (Document) adminSession.getObject(nodeRefMoldel);
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
		Types types = modello.getTypes();
		List<Type> listType = types.getType();
		List<Type> newListType = new ArrayList<Type>();
		// popolo la nuova lista dei type del modello (uguale a prima escluso il
		// type da rimuovere)
		for (Type type : listType) {
			if (type.getName().equals(typeName)) {
				Properties properties = type.getProperties();
				List<Property> listProperty = properties.getProperty();
				Property propertyToRemove = new Property();
				for (Property property : listProperty) {
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
			// se recupero il doc con
			// myRequest.getCmisSession().getObject(nodeRefMoldel) quando setto
			// il contentStream ottengo CmisPermissionDeniedException
			doc.setContentStream(contentStream, true);
			model.put("status", "ok");
		} catch (JAXBException e) {
			model.put("status", "ko");
			model = exceptionToModel(model, e.getMessage(), e.getStackTrace(),
					e.getClass().getName());
			LOGGER.error("Errore nella cancellazione del type", e);
		}
		return model;
	}

	public Map<String, Object> deleteModel(Session adminSession,
			String nodeRefToDelete) {
		Map<String, Object> model = new HashMap<String, Object>();

		Document modello = (Document) adminSession.getObject(nodeRefToDelete);
		if (modello.getPropertyValue(ModelPropertiesIds.MODEL_ACTIVE.value())
				.equals(true)) {
			deleteDocumentByModel(adminSession, nodeRefToDelete, null);
			activateModel(adminSession, nodeRefToDelete, false);
		}
		try {
			modello.delete(true);
			model.put("status", "ok");
		} catch (CmisRuntimeException e) {
			model.put("status", "ko");
			model = exceptionToModel(model, e.getMessage(), e.getStackTrace(),
					e.getClass().getName());
			LOGGER.error("Errore nella cancellazione del modello", e);
		}
		return model;
	}

	public void setNodeTemplatesPath(String nodeTemplatesPath) {
		this.nodeTemplatesPath = nodeTemplatesPath;
	}

	public void setModelsPath(String modelsPath) {
		this.modelsPath = modelsPath;
	}

	/**
	 * se gli passo il noderef recupera tutti i doc dei type definiti nel
	 * model.xml se gli passo il typeName recupera solo i doc di quel type
	 */
	private void deleteDocumentByModel(Session adminSession, String nodeRef,
			String typeName) {
		List<AlfrescoDocument> docs = new ArrayList<AlfrescoDocument>();

		if (nodeRef != null)
			docs = getDocsByPath(adminSession, nodeRef);
		else
			docs = getDocsByTypeName(adminSession, typeName);

		for (AlfrescoDocument doc : docs) {
			// cancello i doc dal workspace
			ObjectIdImpl objId = new ObjectIdImpl(doc.getNodeRef());
			adminSession.delete(objId, true);
			// cancello i doc dall'archive (cestino)
			objId.setId(doc.getNodeRef().replace(WORKSPACE, ARCHIVE));
			adminSession.delete(objId, true);
		}
	}

	private void setNullPropertyToDocs(String propertyName, String typeName,
			Session adminSession) {
		List<AlfrescoDocument> docs = getDocsByTypeName(adminSession, typeName);

		for (AlfrescoDocument alfrescoDocument : docs) {
			CmisObject doc = adminSession.getObject(alfrescoDocument
					.getNodeRef());
			Map<String, Object> properties = new HashMap<String, Object>();
			properties.put(propertyName, null);
			doc.updateProperties(properties, true);
		}
	}

	private Map<String, Object> exceptionToModel(Map<String, Object> model,
			String message, StackTraceElement[] stackTraceElements, String type) {
		model.put("status", "ko");
		model.put("message", message);
		model.put("stacktrace", stackTraceElements);
		model.put("type", type);
		return model;
	}
}