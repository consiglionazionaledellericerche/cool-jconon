package it.cnr.jconon.service.helpdesk;

import it.cnr.cool.cmis.service.CMISService;
import it.cnr.cool.mail.MailService;
import it.cnr.cool.mail.model.AttachmentBean;
import it.cnr.cool.mail.model.EmailMessage;
import it.cnr.cool.security.service.UserService;
import it.cnr.cool.security.service.impl.alfresco.CMISUser;
import it.cnr.cool.util.StringUtil;
import it.cnr.jconon.model.HelpdeskBean;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Calendar;

import org.apache.chemistry.opencmis.client.api.Folder;
import org.apache.chemistry.opencmis.client.bindings.impl.CmisBindingsHelper;
import org.apache.chemistry.opencmis.client.bindings.spi.http.Response;
import org.apache.chemistry.opencmis.commons.exceptions.CmisObjectNotFoundException;
import org.apache.chemistry.opencmis.commons.impl.UrlBuilder;
import org.apache.commons.httpclient.Credentials;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.UsernamePasswordCredentials;
import org.apache.commons.httpclient.auth.AuthScope;
import org.apache.commons.httpclient.methods.DeleteMethod;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PutMethod;
import org.apache.commons.httpclient.methods.StringRequestEntity;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.MailException;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by cirone on 27/10/2014.
 * Modified by marco.spasiano 25/06/2015
 */
public class HelpdeskService {
	private static final Logger LOGGER = LoggerFactory
			.getLogger(HelpdeskService.class);

    @Autowired
    private MailService mailService;

    @Autowired
    private CMISService cmisService;

    @Autowired
    private UserService userService;

    @Value("${helpdesk.catg.url}")
    private String helpdeskCatgURL;
    @Value("${helpdesk.user.url}")
    private String helpdeskUserURL;
    @Value("${helpdesk.ucat.url}")
    private String helpdeskUcatURL;
    @Value("${helpdesk.username}")
    private String userName;
    @Value("${helpdesk.password}")
    private String password;

    public void sendReopenMessage(HelpdeskBean hdBean) throws MailException {
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

    public void post(
            HelpdeskBean hdBean, MultipartFile allegato,
            CMISUser user) throws IOException, MailException , CmisObjectNotFoundException{

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

        Integer category = Integer.valueOf(hdBean.getCategory());
        if(getEsperti(category).equals("{}")){
            LOGGER.error("La categoria con id " + category + " (Bando \"" + hdBean.getCall() + "\") NON HA NESSUN ESPERTO!");
        }
        if(category == 1){
            LOGGER.warn("Il Bando \"" + hdBean.getCall() + "\" NON HA NESSUN ID ASSOCIATO ALLA CATEGORIA " + hdBean.getProblemType() + " !");
        }

        sendMessage(hdBean, allegato);
    }

    private void sendMessage(HelpdeskBean hdBean, MultipartFile allegato) throws MailException, IOException {
        final String TILDE = "~~";

        StringBuilder sb = new StringBuilder();
        sb.append("[concorsi]");
        sb.append(TILDE);
        sb.append(hdBean.getCategory());
        sb.append(TILDE);
        sb.append(hdBean.getCall() + " - " + hdBean.getProblemType());
        sb.append(TILDE);
        sb.append(hdBean.getCall() + " - " + hdBean.getSubject());
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

    private HttpClient getHttpClient() {
        HttpClient httpClient = new HttpClient();
        Credentials credentials = new UsernamePasswordCredentials(userName, password);
        httpClient.getState().setCredentials(AuthScope.ANY, credentials);
        return httpClient;
    }


    public Integer getCategoriaMaster(String callType) {
        String link = cmisService.getBaseURL().concat("service/cnr/jconon/categorie-helpdesk");
        UrlBuilder url = new UrlBuilder(link);
        Response resp = CmisBindingsHelper.getHttpInvoker(cmisService.getAdminSession()).invokeGET(url, cmisService.getAdminSession());
        int status = resp.getResponseCode();
        if (status == HttpStatus.OK.value()) {
            JSONObject jsonObject = new JSONObject(StringUtil.convertStreamToString(resp.getStream()));
            return jsonObject.getInt(callType);
        }
        return 1;
    }
    public Integer createCategoria(Integer idPadre, String nome, String descrizione) {
        Integer idCategoriaHelpDesk = null;
        // Create an instance of HttpClient.
        JSONObject json = new JSONObject();
        json.put("idPadre", idPadre == null?1:idPadre);
        json.put("nome", nome);
        json.put("descrizione", descrizione);

        UrlBuilder url = new UrlBuilder(helpdeskCatgURL);
        PutMethod method = new PutMethod(url.toString());
        try {
            method.setRequestEntity(new StringRequestEntity(json.toString(), "application/json", "UTF-8"));
            HttpClient httpClient = getHttpClient();
            int statusCode = httpClient.executeMethod(method);
            if (statusCode != HttpStatus.OK.value()) {
                LOGGER.error("Errore in fase di creazione della categoria heldesk dalla URL:" + helpdeskCatgURL);
            } else {
                LOGGER.debug(method.getResponseBodyAsString());
                idCategoriaHelpDesk = Integer.valueOf(method.getResponseBodyAsString());
            }
        } catch (IOException e) {
            LOGGER.error("Errore in fase di creazione della categoria heldesk - "
                                 + e.getMessage() + " dalla URL:" + helpdeskCatgURL, e);
        } finally{
            method.releaseConnection();
        }
        return idCategoriaHelpDesk;
    }

    public Object getEsperti(Integer idCategoria) {
        UrlBuilder url = new UrlBuilder(helpdeskUcatURL);
        GetMethod method = new GetMethod(url.toString() + "/" + idCategoria);
        try {
            HttpClient httpClient = getHttpClient();
            int statusCode = httpClient.executeMethod(method);
            if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                LOGGER.error("Errore in fase di recupero delle categorie helpdesk dalla URL:" + helpdeskUcatURL);
            } else if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return "{}";
            } else {
                LOGGER.debug(method.getResponseBodyAsString());
                return method.getResponseBodyAsString();
            }
        } catch (IOException e) {
            LOGGER.error("Errore in fase di creazione della categoria heldesk - "
                                 + e.getMessage() + " dalla URL:" + helpdeskCatgURL, e);
        } finally{
            method.releaseConnection();
        }
        return "{}";
    }

    public Object manageEsperto(Integer idCategoria, String idEsperto, boolean delete) {
        UrlBuilder url = new UrlBuilder(helpdeskUcatURL);
        HttpMethod method = null;
        if (delete)
            method = new DeleteMethod(url.toString() + "/" + idCategoria + "/" + idEsperto);
        else {
            inserisciEsperto(idEsperto);
            method = new PutMethod(url.toString() + "/" + idCategoria + "/" + idEsperto);
        }
        try {
            HttpClient httpClient = getHttpClient();
            int statusCode = httpClient.executeMethod(method);
            if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                LOGGER.error("Errore in fase di gestione esperto helpdesk dalla URL:" + helpdeskUcatURL);
            } else {
                LOGGER.debug(method.getResponseBodyAsString());
                return method.getResponseBodyAsString();
            }
        } catch (IOException e) {
            LOGGER.error("Errore in fase di creazione della categoria heldesk - "
                                 + e.getMessage() + " dalla URL:" + helpdeskCatgURL, e);
        } finally{
            method.releaseConnection();
        }
        return null;
    }

    private void inserisciEsperto(String idEsperto) {
        CMISUser user = userService.loadUserForConfirm(idEsperto);
        JSONObject json = new JSONObject();
        json.put("firstName", user.getFirstName());
        json.put("familyName", user.getLastName());
        json.put("login", user.getId());
        json.put("email", user.getEmail());
        json.put("telefono", user.getTelephone());
        json.put("struttura", "1");
        json.put("profile", "2");
        json.put("mailStop", "n");
        UrlBuilder url = new UrlBuilder(helpdeskUserURL);
        PutMethod method = new PutMethod(url.toString());
        try {
            method.setRequestEntity(new StringRequestEntity(json.toString(), "application/json", "UTF-8"));
            HttpClient httpClient = getHttpClient();
            int statusCode = httpClient.executeMethod(method);
            if (statusCode != HttpStatus.CREATED.value() && statusCode != HttpStatus.NO_CONTENT.value()) {
                LOGGER.error("Errore in fase di creazione del'utente helpdesk dalla URL:" + helpdeskUserURL);
                LOGGER.error(method.getResponseBodyAsString());
            } else {
                LOGGER.debug(method.getResponseBodyAsString());
            }
        } catch (IOException e) {
            LOGGER.error("Errore in fase di creazione della categoria heldesk - "
                                 + e.getMessage() + " dalla URL:" + helpdeskCatgURL, e);
        } finally{
            method.releaseConnection();
        }
    }


    //servono per settare il mockMailService nei test
    public MailService getMailService() {
        return mailService;
    }

    public void setMailService(MailService mailService) {
        this.mailService = mailService;
    }

}