package it.cnr.jconon.service.helpdesk;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.jconon.model.HelpdeskBean;
import org.apache.chemistry.opencmis.client.api.Folder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by cirone on 27/10/2014.
 */
public class HelpdeskService {

    @Autowired
    private MailService mailService;

    @Autowired
    private CMISService cmisService;


    public Map<String, Object> postReopen(HelpdeskBean hdBean) throws MailException {
        Map<String, Object> model = new HashMap<>();
        sendReopenMessage(hdBean);
        model.put("reopenSendOk", "true");
        return model;
    }

    public Map<String, Object> post(
            HelpdeskBean hdBean, MultipartFile allegato,
            CMISUser user) throws IOException, MailException {
        Map<String, Object> model = new HashMap<>();

        // Se non specifico il bando firefox setta il campo con la
        // stringa "null" e chrome con la stringa vuota
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

        if (user != null && !user.isGuest()
                && user.getFirstName() != null
                && user.getFirstName().equals(hdBean.getFirstName())
                && user.getLastName() != null
                && user.getLastName().equals(hdBean.getLastName())
                && user.getMatricola() != null) {
            hdBean.setMatricola(String.valueOf(user.getMatricola()));
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

        return model;
    }

    private void sendMessage(HelpdeskBean hdBean, MultipartFile allegato) throws MailException, IOException {
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

        if (allegato != null && !allegato.isEmpty()) {
            message.setAttachments(Arrays.asList(new AttachmentBean(allegato
                                                                            .getOriginalFilename(), allegato.getBytes())));
        }

//        message.addRecipient(mailService.getMailToHelpDesk());
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