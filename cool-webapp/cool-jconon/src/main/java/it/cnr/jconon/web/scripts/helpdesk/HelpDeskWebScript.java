package it.cnr.jconon.web.scripts.helpdesk;

import it.cnr.bulkinfo.BulkInfoImpl.FieldProperty;
import it.cnr.bulkinfo.cool.BulkInfoCool;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.service.BulkInfoCoolService;
import it.cnr.cool.web.scripts.CMISWebScript;
import it.cnr.jconon.web.scripts.model.HelpdeskBean;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.extensions.surf.ServletUtil;
import org.springframework.extensions.surf.support.ThreadLocalRequestContext;
import org.springframework.extensions.surf.util.I18NUtil;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptRequest;
import org.springframework.mail.MailException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

public class HelpDeskWebScript extends CMISWebScript {
	@Autowired
	private MailService mailService;

	@Autowired
	private BulkInfoCoolService bulkInfoService;

	@Override
	protected Map<String, Object> executeImpl(WebScriptRequest req,
			Status status, Cache cache) {
		Map<String, Object> model = super.executeImpl(req, status, cache);
		try {

			if (isPOST()) {
				HelpdeskBean hdBean = new HelpdeskBean();
				// setto l'ip della request nel hdBean
				HttpServletRequest httpServletRequest = ServletUtil
						.getRequest();
				String sourceIp = httpServletRequest.getRemoteAddr();
				hdBean.setIp(sourceIp);
				BeanUtils
						.populate(hdBean, httpServletRequest.getParameterMap());

				if (req.getParameter("id") != null
						&& !req.getParameter("id").isEmpty()
						&& req.getParameter("azione") != null
						&& !req.getParameter("azione").isEmpty()) {
					model.put("isHdReopen", "true");
					model.put("id", req.getParameter("id"));
					model.put("azione", req.getParameter("azione"));
					sendReopenMessage(hdBean);
					model.put("reopenSendOk", "true");
					model.put("sendOk", "true");
				} else {
					MultipartHttpServletRequest mRequest = (MultipartHttpServletRequest) ServletUtil
							.getRequest();
					MultipartFile allegato;
					allegato = mRequest.getFile("allegato");

					if (hdBean.getCategory() != null) {

						BulkInfoCool bulkInfo = bulkInfoService
								.find("helpdeskBulkInfo");

						for (FieldProperty field : bulkInfo
								.getFieldPropertyByProperty("category")) {
							FieldProperty property = field.getSubProperties()
									.get("jsonlist");
							for (FieldProperty prop : property
									.getListElements()) {
								if (hdBean.getCategory().equals(
										prop.getAttribute("key"))) {
									String key = prop.getAttribute("label");
									hdBean.setDescrizione(I18NUtil
											.getMessage(key));
									break;
								}
							}

						}
					}
					// Se non specifico il bando firefox setta il campo con la
					// stringa "null" e chrome con la stringa vuota
					// carico il nome della categoria del problema dal codice
					// corrispondente
					if (!hdBean.getCmisCallId().equals("")
							&& !hdBean.getCmisCallId().equals("null")) {
						Folder call = (Folder) cmisService.createAdminSession()
								.getObject(hdBean.getCmisCallId());
						if (call != null)
							hdBean.setSubject((String) call
									.getPropertyValue("cmis:name")
									+ " - "
									+ hdBean.getSubject());
					}
					hdBean.setMatricola("0");
					if (ThreadLocalRequestContext.getRequestContext().getUser() instanceof CMISUser) {
						CMISUser user = (CMISUser) ThreadLocalRequestContext
								.getRequestContext().getUser();
						if (user != null
								&& !user.isGuest()
								&& user.getFirstName() != null
								&& user.getFirstName().equals(
										hdBean.getFirstName())
								&& user.getLastName() != null
								&& user.getLastName().equals(
										hdBean.getLastName())
								&& user.getMatricola() != null) {
							hdBean.setMatricola(String.valueOf(user
									.getMatricola()));
						}
					}
					// eliminazione caratteri problematici
					hdBean.setSubject(cleanText(hdBean.getSubject()));
					hdBean.setFirstName(cleanText(hdBean.getFirstName()));
					hdBean.setLastName(cleanText(hdBean.getLastName()));
					hdBean.setMessage(cleanText(hdBean.getMessage()));
					hdBean.setEmail(hdBean.getEmail().trim());
					sendMessage(hdBean, allegato);
					model.put("email", hdBean.getEmail());
					model.put("sendOk", "true");
				}
			}
		} catch (Exception e) {
			model.put("sendOk", "false");
			model.put("message_error",
					"message.helpdesk.failed - MailException");
		}
		return model;
	}

	private void sendMessage(HelpdeskBean hdBean, MultipartFile allegato)
			throws MailException, IOException {
		final String TILDE = "~~";

		StringBuilder sb = new StringBuilder();
		sb.append("[concorsi]");
		sb.append(TILDE);
		sb.append(hdBean.getCategory());
		sb.append(TILDE);
		sb.append(hdBean.getDescrizione());
		sb.append(TILDE);
		sb.append(hdBean.getSubject());
		sb.append(TILDE);
		sb.append(hdBean.getFirstName());
		sb.append(TILDE);
		sb.append(hdBean.getLastName());
		sb.append(TILDE);
		sb.append(hdBean.getEmail());

		// aggiunge il footer al messaggio
		StringBuffer testo = new StringBuffer();
		testo.append(hdBean.getMessage());
		testo.append("\n\n");
		testo.append("Utente: ");
		testo.append(hdBean.getFirstName());
		testo.append(" ");
		testo.append(hdBean.getLastName());
		testo.append("  Matricola: ");
		testo.append(hdBean.getMatricola());
		testo.append("  Email: ");
		testo.append(hdBean.getEmail());
		testo.append("  Tel: ");
		testo.append(hdBean.getPhoneNumber());
		testo.append("  Data: ");
		DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
		testo.append(formatter.format(Calendar.getInstance().getTime()));
		testo.append("  IP: ");
		testo.append(hdBean.getIp());

		EmailMessage message = new EmailMessage();
		message.setBody(testo);
		message.setHtmlBody(false);
		message.setSender(hdBean.getEmail());
		message.setSubject(sb.toString());

		if (!allegato.isEmpty()) {
			message.setAttachments(Arrays.asList(new AttachmentBean(allegato
					.getOriginalFilename(), allegato.getBytes())));
		}

		message.addRecipient(mailService.getMailToHelpDesk());
		mailService.send(message);
	}

	private String cleanText(String text) {
		if (text == null)
			return "";
		StringBuilder sb = new StringBuilder();
		for (int i = 0; i < text.length(); i++) {
			char c = text.charAt(i);
			if (c < 32)
				continue;
			if (c == 224 || c == 225)
				sb.append('a');
			else if (c == 232 || c == 233)
				sb.append('e');
			else if (c == 236 || c == 237)
				sb.append('i');
			else if (c == 242 || c == 243)
				sb.append('o');
			else if (c == 249 || c == 250)
				sb.append('u');
			else if (c < 127)
				sb.append(c);
		}
		return sb.toString();
	}

	private void sendReopenMessage(HelpdeskBean hdBean) throws MailException {
		final String TILDE = "~~";

		StringBuilder sb = new StringBuilder();
		sb.append("[concorsi]");
		sb.append(TILDE);
		sb.append(hdBean.getAzione());
		sb.append(TILDE);
		sb.append(hdBean.getId());

		// aggiunge il footer al messaggio
		StringBuffer testo = new StringBuffer();
		testo.append(hdBean.getMessage());
		testo.append("\n\n");
		testo.append("Data: ");
		DateFormat formatter = new SimpleDateFormat("dd.MM.yyyy (HH:mm:ss)");
		testo.append(formatter.format(Calendar.getInstance().getTime()));
		testo.append("  IP: ");
		testo.append(hdBean.getIp());

		EmailMessage message = new EmailMessage();
		message.setBody(testo);
		message.setHtmlBody(false);
		message.setSubject(sb.toString());
		message.addRecipient(mailService.getMailToHelpDesk());
		mailService.send(message);
	}
}